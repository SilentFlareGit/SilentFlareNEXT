#!/usr/bin/env bash
set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
	echo "Run this configurator as root." >&2
	exit 1
fi

SHIELD_ENV=${SHIELD_ENV:-/opt/silentflare/shield/shared/.env}
API_ENV=${API_ENV:-/opt/silentflare/api/api.env}
DEPLOY_ENV=${DEPLOY_ENV:-/opt/silentflare/deploy/deploy.env}

for file in "${SHIELD_ENV}" "${API_ENV}" "${DEPLOY_ENV}"; do
	if [[ ! -f ${file} ]]; then
		echo "Required environment file is missing: ${file}" >&2
		exit 1
	fi
done

read_value() {
	local file=$1
	local key=$2
	local line
	line=$(grep -m 1 "^${key}=" "${file}" || true)
	printf '%s' "${line#*=}"
}

TURNSTILE_SECRET_VALUE=$(read_value "${API_ENV}" TURNSTILE_SECRET_KEY)
TURNSTILE_SITE_VALUE=$(read_value "${DEPLOY_ENV}" PUBLIC_TURNSTILE_SITE_KEY)

if [[ -z ${TURNSTILE_SECRET_VALUE} || -z ${TURNSTILE_SITE_VALUE} ]]; then
	echo "Existing Turnstile configuration is incomplete; Shield enforcement cannot be configured." >&2
	exit 1
fi

set_value() {
	local key=$1
	local value=$2
	local temporary
	temporary=$(mktemp)
	awk -F= -v key="${key}" -v value="${value}" '
		BEGIN { replaced = 0 }
		$1 == key { print key "=" value; replaced = 1; next }
		{ print }
		END { if (!replaced) print key "=" value }
	' "${SHIELD_ENV}" > "${temporary}"
	install -m 0600 "${temporary}" "${SHIELD_ENV}"
	rm -f "${temporary}"
}

set_value SHIELD_TURNSTILE_SITE_KEY "${TURNSTILE_SITE_VALUE}"
set_value SHIELD_TURNSTILE_SECRET_KEY "${TURNSTILE_SECRET_VALUE}"
set_value SHIELD_CONNECTED_HOSTS "blog.silentflare.com,accounts.silentflare.com,api.silentflare.com,admin.silentflare.com,cms.silentflare.com"
set_value SHIELD_MAX_BODY_BYTES "52428800"
set_value SHIELD_ACCOUNT_SNAPSHOT_URL "http://127.0.0.1:9010/internal/shield/accounts"
set_value SHIELD_ACCOUNT_RESPONSE_URL "http://127.0.0.1:9010/internal/shield/respond"
set_value SHIELD_PUBLIC_URL "https://shield.silentflare.com"
set_value SHIELD_UPSTREAMS_JSON '{"blog.silentflare.com":"http://127.0.0.1:9081","accounts.silentflare.com":"http://127.0.0.1:9081","api.silentflare.com":"http://127.0.0.1:9010","admin.silentflare.com":"http://127.0.0.1:9081","cms.silentflare.com":"http://127.0.0.1:9081"}'

echo "Shield environment updated; secret values were not printed."
