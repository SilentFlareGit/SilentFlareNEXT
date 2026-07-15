#!/usr/bin/env bash
set -Eeuo pipefail

if [[ ${EUID} -ne 0 ]]; then
	echo "Run this installer as root." >&2
	exit 1
fi

SOURCE_DIR=${1:-/opt/silentflare/app/shield/nginx/fns1}
if [[ ! -d ${SOURCE_DIR} ]]; then
	echo "Shield Nginx source directory is missing: ${SOURCE_DIR}" >&2
	exit 1
fi

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_DIR=/etc/nginx/shield-backups/${STAMP}
mkdir -p "${BACKUP_DIR}" /etc/nginx/snippets
PORTAL_ENABLED=/etc/nginx/sites-enabled/silentflare-shield-portal
PORTAL_ENABLED_BACKUP=${BACKUP_DIR}/silentflare-shield-portal.enabled

if [[ -e ${PORTAL_ENABLED} || -L ${PORTAL_ENABLED} ]]; then
	cp -a "${PORTAL_ENABLED}" "${PORTAL_ENABLED_BACKUP}"
fi

TARGETS=(
	/etc/nginx/sites-available/silentflare-blog
	/etc/nginx/sites-available/silentflare-accounts
	/etc/nginx/sites-available/silentflare-admin
	/etc/nginx/sites-available/silentflare-api
	/etc/nginx/sites-available/silentflare-cms
	/etc/nginx/sites-available/silentflare-shield-portal
	/etc/nginx/conf.d/silentflare-cloudflare-real-ip.conf
	/etc/nginx/conf.d/silentflare-shield-origin.conf
	/etc/nginx/snippets/silentflare-shield-blog.conf
	/etc/nginx/snippets/silentflare-shield-api.conf
	/etc/nginx/snippets/silentflare-shield-edge.conf
	/etc/nginx/snippets/silentflare-shield-cms.conf
	/etc/nginx/snippets/silentflare-shield-control.conf
)

for target in "${TARGETS[@]}"; do
	if [[ -f ${target} ]]; then
		cp -a "${target}" "${BACKUP_DIR}/$(basename "${target}")"
	fi
done

restore() {
	for target in "${TARGETS[@]}"; do
		backup=${BACKUP_DIR}/$(basename "${target}")
		if [[ -f ${backup} ]]; then
			cp -a "${backup}" "${target}"
		else
			rm -f "${target}"
		fi
	done
	rm -f "${PORTAL_ENABLED}"
	if [[ -e ${PORTAL_ENABLED_BACKUP} || -L ${PORTAL_ENABLED_BACKUP} ]]; then
		cp -a "${PORTAL_ENABLED_BACKUP}" "${PORTAL_ENABLED}"
	fi
	nginx -t >/dev/null 2>&1 && systemctl reload nginx || true
}
trap restore ERR

install -m 0644 "${SOURCE_DIR}/silentflare-blog.conf" /etc/nginx/sites-available/silentflare-blog
install -m 0644 "${SOURCE_DIR}/silentflare-accounts.conf" /etc/nginx/sites-available/silentflare-accounts
install -m 0644 "${SOURCE_DIR}/silentflare-admin.conf" /etc/nginx/sites-available/silentflare-admin
install -m 0644 "${SOURCE_DIR}/silentflare-api.conf" /etc/nginx/sites-available/silentflare-api
install -m 0644 "${SOURCE_DIR}/silentflare-cms.conf" /etc/nginx/sites-available/silentflare-cms
install -m 0644 "${SOURCE_DIR}/silentflare-shield-portal.conf" /etc/nginx/sites-available/silentflare-shield-portal
install -m 0644 "${SOURCE_DIR}/silentflare-cloudflare-real-ip.conf" /etc/nginx/conf.d/silentflare-cloudflare-real-ip.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-origin.conf" /etc/nginx/conf.d/silentflare-shield-origin.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-blog.conf" /etc/nginx/snippets/silentflare-shield-blog.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-api.conf" /etc/nginx/snippets/silentflare-shield-api.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-edge.conf" /etc/nginx/snippets/silentflare-shield-edge.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-cms.conf" /etc/nginx/snippets/silentflare-shield-cms.conf
install -m 0644 "${SOURCE_DIR}/silentflare-shield-control.conf" /etc/nginx/snippets/silentflare-shield-control.conf
ln -sfn /etc/nginx/sites-available/silentflare-shield-portal "${PORTAL_ENABLED}"

nginx -t
systemctl reload nginx
trap - ERR
echo "Shield routing installed. Backup: ${BACKUP_DIR}"
