# Docker Deployment

> **English** | [简体中文](deploy-docker.zh-CN.md)

Two containers share a single image: `llm-iq-web` runs only the web dashboard, exposes port `3000`, and mounts only the shared data volume; `llm-iq-runner` installs the three CLIs (`claude`, `codex`, `agy`), mounts credential volumes, exposes no network ports, and handles scheduling and execution. Rounds triggered from the dashboard are handed off to `runner` via request files in the shared data volume so credentials never exist inside the port-exposed web container.

## Quick Start

Run the following commands on the host terminal (`docker compose` reads `compose.yaml` in the repository root):

```bash
docker compose up -d --build
docker exec -it llm-iq-runner pnpm onboard
docker exec -it llm-iq-runner pnpm pair
```

1. **Build & Start**: Builds the image and starts `llm-iq-web` and `llm-iq-runner`. On first start, `runner` installs the three CLIs from official channels, initializes `pelican.config.yaml` from the starter template, syncs the pricing catalog, probes CLI capabilities, and records login readiness. Follow progress with `docker logs -f llm-iq-runner`. The dashboard is served at <http://localhost:3000>.
2. **Interactive CLI Login (`pnpm onboard`)**: Walks through each CLI (`claude`, `codex`, `agy`), skipping already-authenticated CLIs and launching the native login flow for unauthenticated ones. To onboard specific CLIs only: `docker exec -it llm-iq-runner pnpm onboard claude agy`.
3. **Owner Browser Pairing (`pnpm pair`)**: Prints a single-use pairing code valid for 10 minutes. Open `/pair` in your browser (key icon in the top-right toolbar) and enter the code to authorize your browser as Owner. Use `pnpm pair --list`, `--revoke <id>`, or `--revoke-all` to manage devices.
4. **Launch a Run**: Click “Run Once” on the dashboard.

| CLI | Login Flow Launched by `pnpm onboard` | Credential Volume |
| --- | --- | --- |
| `claude` | `claude auth login --claudeai`: open URL in browser and paste authorization code | `claude-auth` → `~/.claude` |
| `codex` | `codex login --device-auth`: open URL and enter device code | `codex-auth` → `~/.codex` |
| `agy` | Runs `agy` interactively to complete Google OAuth, then `/exit` | `agy-auth` → `~/.gemini` |

## Volumes & Configuration

| Volume / Bind Path | Mount Point | Contents |
| --- | --- | --- |
| `pelican-data` | `/app/data` (both containers) | Run records, `pelican.config.yaml`, pricing cache, auto-run state, paired devices, audit log, request queue |
| `runner-secrets` | `/app/secrets` (`runner` only) | GitHub App credentials & push tokens, upstream profile API keys (`0700` dir / `0600` files) |
| `cli-tools` | `/opt/clis` (`runner` only) | Installed CLI binaries; deleting re-downloads CLIs on next start without losing auth |
| `claude-auth` / `codex-auth` / `agy-auth` | `/home/node/.claude`, etc. (`runner` only) | Per-CLI OAuth credentials |
| `${PELICAN_DATA_REPO_DIR:-../llm-iq-data}` | `/data-repo` (`runner` only) | Host working copy of the public data repository for sanitized export and git commits |

To copy your host configuration into the container:

```bash
docker cp config/pelican.config.yaml llm-iq-runner:/app/data/pelican.config.yaml
```

To change the host port (default `3000`):

```bash
PELICAN_PORT=3100 docker compose up -d
```

### Host Ceilings

Set in `compose.yaml` or `.env` to cap values configurable via the web UI:

| Variable | Effect |
| --- | --- |
| `PELICAN_CEILING_PER_DAY_USD` | Maximum rolling 24h budget cap (USD) |
| `PELICAN_CEILING_PER_ROUND_USD` | Maximum per-round forecast cap (USD) |
| `PELICAN_ALLOW_EXTRA_ARGS` | Must be `1` to allow `targets[].extraArgs` in configuration |

## Data Repository Sync & GitHub App Integration

- **Bind Mount & Ownership**: `compose.yaml` mounts `${PELICAN_DATA_REPO_DIR:-../llm-iq-data}` at `/data-repo` inside `runner` with `safe.directory=/data-repo`.
- **Host Manual Push or Web GitHub App Push**:
  - Without GitHub App connected, `runner` exports sanitized runs and creates local commits (`exported` state), and the host operator pushes via `git -C ../llm-iq-data push` followed by `docker compose exec runner pnpm sync:data --confirm-published`.
  - Or connect a repository-scoped GitHub App in `/config` under “Data Repository” (ACR-011): tokens are stored exclusively in `runner-secrets` (`/app/secrets`) and allow one-click push from the web console.

## Upgrading

OAuth tokens refresh in place inside their named volumes—upgrading does not require re-authenticating:

```bash
git pull
docker compose up -d --build
```

| Operation | Auth & Data Volumes |
| --- | --- |
| `docker compose up -d --build`, `restart`, `stop` / `start`, `down` (without `-v`) | Preserved |
| `docker compose down -v` or `docker volume rm llm-iq-dashboard_*-auth` | **Wiped (requires re-login)** |
