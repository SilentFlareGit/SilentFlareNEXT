"""Modular FastAPI backend for SilentFlare.

Import ``silentflare_api.main`` explicitly to construct the ASGI application. Keeping
package import side-effect free lets migrations, workers, and tests use infrastructure
modules without initializing every HTTP domain.
"""
