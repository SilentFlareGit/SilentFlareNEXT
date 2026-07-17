"""Compatibility entry point; production uses silentflare_api.main."""

from server.api.silentflare_api.domains.accounts.router import *  # noqa: F403
from server.api.silentflare_api.domains.admin.router import *  # noqa: F403
from server.api.silentflare_api.domains.auth.router import *  # noqa: F403
from server.api.silentflare_api.domains.bots.router import *  # noqa: F403
from server.api.silentflare_api.domains.comments.router import *  # noqa: F403
from server.api.silentflare_api.domains.health.router import *  # noqa: F403
from server.api.silentflare_api.domains.internal_shield.router import *  # noqa: F403
from server.api.silentflare_api.domains.site_settings.router import *  # noqa: F403
from server.api.silentflare_api.main import app, create_app
from server.api.silentflare_api.runtime import *  # noqa: F403
