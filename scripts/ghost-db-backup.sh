#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

ENV_FILE=/opt/silentflare/deploy/ghost-db-backup.env
BACKUP_DIR_DEFAULT=/opt/silentflare/backups/ghost-db

stage="init"
current_tag=""
release_created="no"
asset_uploaded="no"
dummy_test_dir=""
cleanup_plain_tmp=""
cleanup_encrypted_tmp=""
cleanup_plain_file=""
cleanup_notes_file=""

notify_telegram() {
	local text="$1"
	if [[ -z "${TELEGRAM_BOT_TOKEN:-}" || -z "${TELEGRAM_CHAT_ID:-}" ]]; then
		return 0
	fi
	curl -fsS \
		-X POST \
		--data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
		--data-urlencode "text=${text}" \
		"https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" >/dev/null || true
}

fail() {
	local message="$1"
	local now host
	now="$(date -u +%Y%m%dT%H%M%SZ 2>/dev/null || printf unknown)"
	host="$(hostname 2>/dev/null || printf unknown)"
	notify_telegram "$(cat <<MSG
status: failure
failed stage: ${stage}
error: ${message}
timestamp: ${now}
hostname: ${host}
MSG
)"
	printf 'backup failed: stage=%s error=%s\n' "$stage" "$message" >&2
	exit 1
}

on_error() {
	local exit_code=$?
	fail "command failed with exit code ${exit_code}"
}
trap on_error ERR

require_var() {
	local name="$1"
	if [[ -z "${!name:-}" ]]; then
		fail "missing required env ${name}"
	fi
}

require_command() {
	local name="$1"
	if ! command -v "$name" >/dev/null 2>&1; then
		fail "missing dependency ${name}"
	fi
}

load_env() {
	stage="load_env"
	if [[ ! -r "$ENV_FILE" ]]; then
		printf 'missing env file: %s\n' "$ENV_FILE" >&2
		exit 1
	fi
	# shellcheck disable=SC1090
	. "$ENV_FILE"

	: "${BACKUP_DIR:=$BACKUP_DIR_DEFAULT}"
	: "${MYSQL_CONTAINER:=silentflare-ghost-mysql}"
	: "${BACKUP_LOCAL_RETENTION:=30}"
	: "${BACKUP_RELEASE_RETENTION:=30}"
	: "${BACKUP_REMOTE:=local}"

	if [[ "$BACKUP_REMOTE" != "local" && "$BACKUP_REMOTE" != "github_release" ]]; then
		fail "BACKUP_REMOTE must be local or github_release"
	fi
	if ! [[ "$BACKUP_LOCAL_RETENTION" =~ ^[0-9]+$ ]] || [[ "$BACKUP_LOCAL_RETENTION" -lt 1 ]]; then
		fail "BACKUP_LOCAL_RETENTION must be a positive integer"
	fi
	if ! [[ "$BACKUP_RELEASE_RETENTION" =~ ^[0-9]+$ ]] || [[ "$BACKUP_RELEASE_RETENTION" -lt 1 ]]; then
		fail "BACKUP_RELEASE_RETENTION must be a positive integer"
	fi
}

check_common_dependencies() {
	stage="check_dependencies"
	for command_name in age gh gzip sha256sum stat find sort head tail awk date docker curl hostname wc grep; do
		require_command "$command_name"
	done
}

check_age_recipient() {
	stage="check_age_recipient"
	require_var BACKUP_AGE_RECIPIENT
	if [[ "$BACKUP_AGE_RECIPIENT" != age1* ]]; then
		fail "BACKUP_AGE_RECIPIENT must start with age1"
	fi
}

check_github_env() {
	stage="check_github_env"
	require_var GH_TOKEN
	require_var GITHUB_REPO
	require_var BACKUP_AGE_RECIPIENT
}

install_backup_dir() {
	stage="prepare_backup_dir"
	install -d -m 700 "$BACKUP_DIR"
}

recipient_label() {
	local recipient="$1"
	printf "%s...%s" "${recipient:0:12}" "${recipient: -6}"
}

file_sha256() {
	sha256sum "$1" | awk "{print \$1}"
}

file_size() {
	stat -c "%s" "$1"
}

gh_supports_latest_false() {
	gh release create --help 2>/dev/null | grep -q -- "--latest"
}

create_release_with_asset() {
	local tag="$1"
	local title="$2"
	local notes_file="$3"
	local asset_file="$4"
	local create_args=()
	stage="github_release_create"
	if gh_supports_latest_false; then
		create_args+=(--latest=false)
	fi
	current_tag="$tag"
	GH_TOKEN="$GH_TOKEN" gh release create "$tag" "$asset_file" \
		--repo "$GITHUB_REPO" \
		--title "$title" \
		--notes-file "$notes_file" \
		"${create_args[@]}"
	release_created="yes"
	asset_uploaded="yes"
}

verify_release_asset() {
	local tag="$1"
	local asset_name="$2"
	stage="github_release_verify"
	GH_TOKEN="$GH_TOKEN" gh release view "$tag" --repo "$GITHUB_REPO" >/dev/null
	GH_TOKEN="$GH_TOKEN" gh release view "$tag" --repo "$GITHUB_REPO" --json assets --jq ".assets[].name" | grep -Fx -- "$asset_name" >/dev/null
}

cleanup_test_release() {
	local tag="$1"
	stage="github_dummy_cleanup"
	GH_TOKEN="$GH_TOKEN" gh release delete "$tag" --repo "$GITHUB_REPO" --yes --cleanup-tag >/dev/null
}

local_retention_cleanup() {
	stage="local_retention"
	local keep="$BACKUP_LOCAL_RETENTION"
	local before after removed plaintext_count
	before="$(find "$BACKUP_DIR" -maxdepth 1 -type f \( -name "SilentFLare-DB-Backup-*.sql.gz.age" -o -name "ghost-db-*.sql.gz.age" \) | wc -l | awk "{print \$1}")"
	find "$BACKUP_DIR" -maxdepth 1 -type f \( -name "SilentFLare-DB-Backup-*.sql.gz.age" -o -name "ghost-db-*.sql.gz.age" \) -printf "%T@ %p\n" \
		| sort -rn \
		| tail -n +$((keep + 1)) \
		| awk "{ \$1=\"\"; sub(/^ /, \"\"); print }" \
		| while IFS= read -r old_file; do
			[[ -n "$old_file" ]] && rm -f -- "$old_file"
		done
	after="$(find "$BACKUP_DIR" -maxdepth 1 -type f \( -name "SilentFLare-DB-Backup-*.sql.gz.age" -o -name "ghost-db-*.sql.gz.age" \) | wc -l | awk "{print \$1}")"
	removed=$((before - after))
	if [[ "$removed" -lt 0 ]]; then
		removed=0
	fi
	plaintext_count="$(find "$BACKUP_DIR" -maxdepth 1 -type f \( -name "SilentFLare-DB-Backup-*.sql.gz" -o -name "ghost-db-*.sql.gz" \) | wc -l | awk "{print \$1}")"
	printf "kept=%s before=%s after=%s removed=%s historical_plaintext=%s" "$keep" "$before" "$after" "$removed" "$plaintext_count"
}

remote_retention_cleanup() {
	stage="remote_retention"
	if [[ "${BACKUP_REMOTE}" != "github_release" ]]; then
		printf "skipped mode=%s" "$BACKUP_REMOTE"
		return 0
	fi
	local keep="$BACKUP_RELEASE_RETENTION"
	local list_file delete_file before deleted tag
	list_file="$(mktemp)"
	delete_file="$(mktemp)"
	GH_TOKEN="$GH_TOKEN" gh release list --repo "$GITHUB_REPO" --limit 200 --json tagName,createdAt --jq ".[] | select(.tagName | test(\"^(SilentFLare-DB-Backup|ghost-db)-[0-9]{8}T[0-9]{6}Z$\")) | [.createdAt, .tagName] | @tsv" \
		| sort -r > "$list_file"
	before="$(wc -l < "$list_file" | awk "{print \$1}")"
	tail -n +$((keep + 1)) "$list_file" | awk -F "\t" "{print \$2}" > "$delete_file"
	deleted=0
	while IFS= read -r tag; do
		[[ -z "$tag" ]] && continue
		GH_TOKEN="$GH_TOKEN" gh release delete "$tag" --repo "$GITHUB_REPO" --yes --cleanup-tag >/dev/null
		deleted=$((deleted + 1))
	done < "$delete_file"
	rm -f "$list_file" "$delete_file"
	printf "kept=%s before=%s deleted=%s" "$keep" "$before" "$deleted"
}

write_release_notes() {
	local notes_file="$1"
	local encrypted_name="$2"
	local sha="$3"
	local size="$4"
	local timestamp="$5"
	local host="$6"
	cat > "$notes_file" <<NOTES
Encrypted SilentFlare DB Backup.

encrypted filename: ${encrypted_name}
sha256: ${sha}
size: ${size}
created_at UTC: ${timestamp}
hostname: ${host}
database scope: all databases, including future schema/table additions
encryption: age recipient $(recipient_label "$BACKUP_AGE_RECIPIENT")
NOTES
}

run_dummy_github_test() {
	load_env
	check_common_dependencies
	check_age_recipient
	check_github_env
	stage="github_dummy_prepare"
	local timestamp test_dir dummy_file encrypted_file notes_file sha size tag title asset_name
	timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
	test_dir="$(mktemp -d)"
	dummy_test_dir="$test_dir"
	trap 'rm -rf "${dummy_test_dir:-}"' EXIT
	dummy_file="${test_dir}/github-backup-test-${timestamp}.txt"
	encrypted_file="${dummy_file}.age"
	notes_file="${test_dir}/notes.md"
	tag="silentflare-db-backup-test-${timestamp}"
	title="SilentFlare DB Backup Test ${timestamp}"
	cat > "$dummy_file" <<DUMMY
SilentFlare DB Backup pipeline dummy test.
No production data or secrets are included.
created_at UTC: ${timestamp}
DUMMY
	stage="github_dummy_encrypt"
	age -r "$BACKUP_AGE_RECIPIENT" -o "$encrypted_file" "$dummy_file"
	sha="$(file_sha256 "$encrypted_file")"
	size="$(file_size "$encrypted_file")"
	asset_name="$(basename "$encrypted_file")"
	cat > "$notes_file" <<NOTES
SilentFlare DB Backup Test ${timestamp}

This is a dummy GitHub Release upload test. It contains no production data and no secrets.
asset: ${asset_name}
sha256: ${sha}
size: ${size}
NOTES
	create_release_with_asset "$tag" "$title" "$notes_file" "$encrypted_file"
	verify_release_asset "$tag" "$asset_name"
	cleanup_test_release "$tag"
	printf "dummy github release test succeeded: tag=%s asset=%s sha256=%s size=%s cleaned_up=yes\n" "$tag" "$asset_name" "$sha" "$size"
}

run_backup() {
	load_env
	check_common_dependencies
	check_age_recipient
	if [[ "$BACKUP_REMOTE" == "github_release" ]]; then
		check_github_env
	fi
	install_backup_dir

	local timestamp host plain_file plain_tmp encrypted_file encrypted_tmp sha size asset_name tag title notes_file local_cleanup remote_cleanup upload_status
	timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
	host="$(hostname)"
	plain_file="${BACKUP_DIR}/SilentFLare-DB-Backup-${timestamp}.sql.gz"
	plain_tmp="${plain_file}.tmp"
	encrypted_file="${plain_file}.age"
	encrypted_tmp="${encrypted_file}.tmp"
	notes_file="$(mktemp)"
	cleanup_plain_tmp="$plain_tmp"
	cleanup_encrypted_tmp="$encrypted_tmp"
	cleanup_plain_file="$plain_file"
	cleanup_notes_file="$notes_file"
	tag="SilentFLare-DB-Backup-${timestamp}"
	title="SilentFLare DB Backup ${timestamp}"
	upload_status="local-only"

	cleanup() {
		rm -f "${cleanup_plain_tmp:-}" "${cleanup_encrypted_tmp:-}" "${cleanup_plain_file:-}" "${cleanup_notes_file:-}"
	}
	trap cleanup EXIT

	stage="mysql_container_check"
	if ! docker inspect "$MYSQL_CONTAINER" >/dev/null 2>&1; then
		fail "mysql container not found: ${MYSQL_CONTAINER}"
	fi

	stage="mysql_dump"
	docker exec "$MYSQL_CONTAINER" sh -c \
		'mysqldump --single-transaction --quick --routines --events --triggers --no-tablespaces -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases' \
		| gzip -9 > "$plain_tmp"

	stage="finalize_plaintext"
	mv "$plain_tmp" "$plain_file"
	chmod 600 "$plain_file"

	stage="age_encrypt"
	age -r "$BACKUP_AGE_RECIPIENT" -o "$encrypted_tmp" "$plain_file"
	mv "$encrypted_tmp" "$encrypted_file"
	chmod 600 "$encrypted_file"
	rm -f "$plain_file"

	stage="metadata"
	sha="$(file_sha256 "$encrypted_file")"
	size="$(file_size "$encrypted_file")"
	asset_name="$(basename "$encrypted_file")"
	write_release_notes "$notes_file" "$asset_name" "$sha" "$size" "$timestamp" "$host"

	if [[ "$BACKUP_REMOTE" == "github_release" ]]; then
		create_release_with_asset "$tag" "$title" "$notes_file" "$encrypted_file" || fail "release or asset upload failed for ${tag}"
		verify_release_asset "$tag" "$asset_name" || fail "release asset verification failed for ${tag}"
		upload_status="uploaded"
	fi

	local_cleanup="$(local_retention_cleanup)"
	remote_cleanup="$(remote_retention_cleanup)"

	notify_telegram "$(cat <<MSG
status: success
mode: ${BACKUP_REMOTE}
encrypted filename: ${asset_name}
local encrypted path: ${encrypted_file}
GitHub repo: ${GITHUB_REPO:-n/a}
release tag: ${tag}
asset name: ${asset_name}
sha256: ${sha}
size: ${size}
upload status: ${upload_status}
local retention cleanup: ${local_cleanup}
remote retention cleanup: ${remote_cleanup}
timestamp: ${timestamp}
hostname: ${host}
MSG
)"

	printf 'SilentFlare DB Backup created: %s sha256=%s size=%s scope=all-databases update_proof=yes encrypted=age mode=%s upload=%s release=%s local_cleanup="%s" remote_cleanup="%s"\n' "$encrypted_file" "$sha" "$size" "$BACKUP_REMOTE" "$upload_status" "$tag" "$local_cleanup" "$remote_cleanup"
}

case "${1:-backup}" in
	backup)
		run_backup
		;;
	github-dummy-test | test-github-release)
		run_dummy_github_test
		;;
	*)
		printf "usage: %s [backup|github-dummy-test]\n" "$0" >&2
		exit 2
		;;
esac
