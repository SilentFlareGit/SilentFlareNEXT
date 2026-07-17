#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
	echo "Run as root" >&2
	exit 1
fi

source_root="${1:-/opt/silentflare/app}"
release_id="${2:-$(git -C "${source_root}" rev-parse HEAD)}"
api_root=/opt/silentflare/api
releases_root="${api_root}/releases"
release="${releases_root}/${release_id}"
current="${api_root}/current"
previous=""
env_file="${api_root}/api.env"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

if [[ ! "${release_id}" =~ ^[0-9a-f]{7,64}$ ]]; then
	echo "Invalid release id" >&2
	exit 1
fi
if [[ ! -f "${source_root}/server/api/requirements.txt" || ! -f "${env_file}" ]]; then
	echo "API source or environment file is missing" >&2
	exit 1
fi

mkdir -p "${releases_root}" "${api_root}/backups"
if [[ -L "${current}" ]]; then
	previous="$(readlink -f "${current}" 2>/dev/null || true)"
elif [[ -e "${current}" ]]; then
	previous="${api_root}/legacy-current-${timestamp}"
	mv "${current}" "${previous}"
fi
if [[ ! -d "${release}" ]]; then
	temporary="${release}.tmp.$$"
	mkdir -p "${temporary}"
	cp -a "${source_root}/server" "${temporary}/server"
	python3 -m venv "${temporary}/venv"
	"${temporary}/venv/bin/python" -m pip install --disable-pip-version-check --requirement "${temporary}/server/api/requirements.txt"
	printf '%s\n' "${release_id}" > "${temporary}/REVISION"
	mv "${temporary}" "${release}"
fi

(
	cd "${release}"
	./venv/bin/python -m server.api.silentflare_api.db.cli --env-file "${env_file}" backup "${api_root}/backups/account-${timestamp}-${release_id}.db"
)
(
	cd "${release}"
	./venv/bin/python -m server.api.silentflare_api.db.cli --env-file "${env_file}" migrate
)

ln -sfn "${release}" "${current}.next"
mv -Tf "${current}.next" "${current}"

rollback() {
	if [[ -n "${previous}" && "${previous}" != "${current}" && -d "${previous}" ]]; then
		ln -sfn "${previous}" "${current}.rollback"
		mv -Tf "${current}.rollback" "${current}"
		systemctl restart silentflare-api.service silentflare-api-worker.service || true
	fi
}
trap rollback ERR

systemctl restart silentflare-api.service silentflare-api-worker.service
systemctl is-active --quiet silentflare-api.service
systemctl is-active --quiet silentflare-api-worker.service
curl --fail --silent --show-error --max-time 15 http://127.0.0.1:9010/health/live >/dev/null
curl --fail --silent --show-error --max-time 15 http://127.0.0.1:9010/health/ready | grep --quiet '"ok":true'
trap - ERR

echo "API_RELEASE=${release_id}"
echo "API_ACTIVE=true"
echo "WORKER_ACTIVE=true"
