#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
	echo "Run as root" >&2
	exit 1
fi

source_root="${1:-/opt/silentflare/app}"
unit_root="${source_root}/server/api/deploy/systemd"
install -o root -g root -m 0644 "${unit_root}/silentflare-api.service" /etc/systemd/system/silentflare-api.service
install -o root -g root -m 0644 "${unit_root}/silentflare-api-worker.service" /etc/systemd/system/silentflare-api-worker.service
systemctl daemon-reload
systemctl enable silentflare-api.service silentflare-api-worker.service
echo "SYSTEMD_UNITS_INSTALLED=true"
