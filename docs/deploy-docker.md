# Docker Deployment

> **English** | [简体中文](deploy-docker.zh-CN.md)

Two containers share a single image: `llm-iq-web` runs only the web dashboard, exposes port `3000`, and mounts only the shared data volume; `llm-iq-runner` installs the three CLIs (`claude`, `codex`, `agy`), mounts credential volumes, exposes no network ports, and handles scheduling and execution. Rounds triggered from the dashboard are handed off to `runner` via request files in the shared data volume so credentials never exist inside the port-exposed web container. The image contains only open-source components—the three CLIs are installed from their official channels on `runner`'s first start, and each CLI is authenticated once inside `runner` using your subscription account.

## Quick Start

Run the following commands in the host terminal (`docker compose` reads `compose.yaml` in the repository root; container names are fixed to `llm-iq-web` and `llm-iq-runner`):

```bash
docker compose up -d --build
docker exec -it llm-iq-runner pnpm onboard
docker exec -it llm-iq-runner pnpm pair
```

1. **Build & Start**: Builds the image and starts `llm-iq-web` and `llm-iq-runner` in the background. On first start, `runner` installs the three CLIs from official channels (requires internet, ~1–2 minutes), initializes `pelican.config.yaml` from the starter template, syncs the pricing catalog, probes CLI capabilities, and records login readiness. Follow progress with `docker logs -f llm-iq-runner`. The dashboard is served at <http://localhost:3000>.
2. **Interactive CLI Login (`pnpm onboard`)**: Walks through each CLI (`claude`, `codex`, `agy`), skipping already-authenticated CLIs and launching the native login flow for unauthenticated ones. Re-verifies readiness immediately after each login and prints an environment summary. To onboard specific CLIs only: `docker exec -it llm-iq-runner pnpm onboard claude agy`.
3. **Owner Browser Pairing (`pnpm pair`)**: Prints a single-use pairing code valid for 10 minutes. Open `/pair` in your browser (key icon in the top-right toolbar) and enter the code to authorize your browser as Owner. Visitors without pairing can browse results read-only, while `/config`, “Run Once”, and the Auto-Run toggle are restricted to the Owner. Use `pnpm pair --list`, `--revoke <id>`, or `--revoke-all` to manage devices from the CLI, or revoke devices at the bottom of `/config`.
4. **Launch a Run**: Click “Run Once” on the dashboard. Selectable targets are the intersection of configured targets and currently ready CLIs; unauthenticated CLIs are listed in the top banner with exact login commands. Remove unused CLIs in `/config` (clicking “Dismiss” on the banner only hides the banner in the current browser).

| CLI | Login Flow Launched by `pnpm onboard` | Credential Volume |
| --- | --- | --- |
| `claude` | `claude auth login --claudeai`: open URL in browser and paste authorization code back into terminal | `claude-auth` → `~/.claude` |
| `codex` | `codex login --device-auth`: open URL in browser and enter the device code shown in terminal | `codex-auth` → `~/.codex` |
| `agy` | Runs `agy` interactively to complete Google OAuth in browser; once the prompt appears, type `/exit` | `agy-auth` → `~/.gemini` |

OAuth tokens refresh automatically in their named volumes. Host and container sessions are separate and do not share credential files (sharing a single credential file would cause token refreshes on one side to invalidate the other).

## Volumes & Configuration

| Volume / Bind Path | Mount Point | Contents |
| --- | --- | --- |
| `pelican-data` | `/app/data` (both containers) | Run records, `pelican.config.yaml`, pricing cache, auto-run state, paired devices, audit log, request queue |
| `runner-secrets` | `/app/secrets` (`runner` only) | GitHub App credentials & push tokens, non-default profile API keys (`0700` dir / `0600` files) |
| `cli-tools` | `/opt/clis` (`runner` only) | Installed CLI binaries; deleting re-downloads CLIs on next start without losing auth |
| `claude-auth` / `codex-auth` / `agy-auth` | `/home/node/.claude`, etc. (`runner` only) | Per-CLI OAuth credentials; removing a volume signs out that CLI |
| `${PELICAN_DATA_REPO_DIR:-../llm-iq-data}` (bind mount) | `/data-repo` (`runner` only) | Host working copy of the public data repository for sanitized export and local commits |

On first boot the container uses the starter configuration (one lightweight model per CLI). To copy your host configuration into the container:

```bash
docker cp config/pelican.config.yaml llm-iq-runner:/app/data/pelican.config.yaml
```

You can then edit it at `/config` or copy it out and back in:

```bash
docker cp llm-iq-runner:/app/data/pelican.config.yaml ./pelican.config.yaml
docker cp ./pelican.config.yaml llm-iq-runner:/app/data/pelican.config.yaml
```

To change the host port if `3000` is occupied:

```bash
PELICAN_PORT=3100 docker compose up -d
```

### Host Ceilings

Set in `compose.yaml` or `.env` to cap values configurable via the web UI:

| Variable | Effect |
| --- | --- |
| `PELICAN_CEILING_PER_DAY_USD` | Maximum rolling 24h budget cap (USD); effective `budget.perDayUsd` is `min(config, ceiling)` |
| `PELICAN_CEILING_PER_ROUND_USD` | Maximum per-round forecast cap (USD); effective `budget.perRoundUsd` is `min(config, ceiling)` |
| `PELICAN_ALLOW_EXTRA_ARGS` | Must be `1` to allow `targets[].extraArgs` in configuration (rejected by default) |

All three CLIs run with tools disabled; before each round, credential files are hashed into sliding-window fingerprints, and any model output matching a credential fragment is recorded as `error` without writing the SVG or transcript to disk.

Use `docker exec -it llm-iq-runner pnpm preflight` to diagnose the environment, `docker logs -f llm-iq-web` for web logs, and `docker logs -f llm-iq-runner` for scheduler/execution logs.

## Data Repository Sync & GitHub App Integration

### Data Repository Sync

The Docker deployment bind-mounts the host's public data repository working copy into `runner`:

- **Bind Mount & Ownership Isolation**: `compose.yaml` mounts `${PELICAN_DATA_REPO_DIR:-../llm-iq-data}` at `/data-repo` inside `runner` (`web` never mounts it; add the host path to Docker Desktop File Sharing on macOS). The image pre-installs `git` and sets `GIT_CONFIG_COUNT=1`, `GIT_CONFIG_KEY_0=safe.directory`, `GIT_CONFIG_VALUE_0=/data-repo` via environment variables to avoid Git dubious-ownership warnings across container/host UIDs without writing global Git config.
- **Security Boundary & Credential Isolation**: Neither SSH keys nor Git credential helpers are stored in the container. When a GitHub App is connected, push tokens live exclusively in the `runner-secrets` volume (`/app/secrets`), which `web` does not mount. Git commit authorship inherits the repository-local config (`user.name` and `user.email` in `llm-iq-data/.git/config`).
- **Custom Data Repository**: Create your own repository from the [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data) template and set its GitHub URL under “Data Repository Settings” in `/config`. Even if `/data-repo` is an empty directory, `runner` automatically clones the repository on startup and verifies that `origin` matches before every sync.
- **Container Configuration** (`/config` or `/app/data/pelican.config.yaml`):
  ```yaml
  dataRepo:
    path: /data-repo
    repository: https://github.com/<owner>/<repo>   # Optional; enables auto-clone and origin verification
    autoSync: true
    push: false
  ```
- **Host Manual Publish Workflow**:
  1. When a round finishes, `runner` exports sanitized records and creates a local Git commit in `/data-repo`, recording `exported` in `/app/data/sync-state.json`;
  2. The host operator pushes using host credentials:
     ```bash
     git -C ../llm-iq-data push
     ```
  3. **Publish Confirmation**: On the next automatic sync (or manually via the command below), `runner` runs an anonymous `git fetch` and `git merge-base --is-ancestor` check to promote verified rounds to `published`:
     ```bash
     docker compose exec runner pnpm sync:data --confirm-published
     ```
- **Retention Guard**: Local run pruning (`retention.days`) only deletes expired runs confirmed as `published` (or `skipped/unpublishable-prompt`, `skipped/empty`, `skipped/discarded`), preserving unpublished runs if the network or remote is unreachable.
- **Web Console Data Repository Panel (ACR-010 / ACR-011)**: In `/config`, the Owner can run `dry-run`, `export`, `confirm`, and `push` (delegated to `runner` via `data/requests/`). Triggering `push` without a connected GitHub App returns `409` instructing the operator to push on the host or connect GitHub.

### Connecting GitHub in the Web Console (ACR-011)

The Owner can register and authorize a repository-scoped GitHub App directly from `/config` for one-click container pushes without manually managing tokens:

1. **Connection Steps**:
   - Sign in as Owner, open `/config`, and click **Connect GitHub** in the Data Repository section;
   - Your browser redirects to GitHub's App Manifest creation page with permissions and callbacks pre-filled; click **Create GitHub App**;
   - GitHub redirects back and immediately forwards to the App installation page; select **Only select repositories**, choose your configured data repository, and confirm;
   - Upon redirect to `/config#data-repo`, the card shows **Connected as `{login}`** and unlocks the **Push** action.
2. **Permission Scope & Security**:
   - **Minimal Permissions**: Requests only `contents: write` and `metadata: read`, with Webhooks disabled (`active: false`);
   - **Single-Repository Scope**: Installed only on the single public data repository;
   - **Dual Scope Intersection**: Uses User-to-Server tokens bounded by the intersection of the user's permissions and the single-repo installation.
3. **Credential Storage & Isolation**:
   - Stored exclusively in `runner-secrets` (`/app/secrets`, dir `0700`, files `0600`): `github-app.json` (App ID & client secret), `github-user.json` (user & refresh token), and `github-access-token` (ephemeral token read by `GIT_ASKPASS`);
   - Never mounted in `llm-iq-web`, and never passed via command-line arguments or logged; tokens with < 10 minutes remaining are refreshed automatically before pushing.
4. **Revoking & Deleting the App**:
   - Click **Disconnect GitHub** in `/config` to revoke the token via GitHub's API and wipe `/app/secrets/github-*`;
   - Follow **Manage App on GitHub** to uninstall or delete the GitHub App under your GitHub account settings.
5. **Fallback: Manual GitHub App Creation (Restricted Networks)**:
   If network restrictions prevent automatic Manifest submission, create the App manually at `https://github.com/settings/apps/new`:
   - **GitHub App name**: `llm-iq-data-publisher-<random-suffix>`
   - **Homepage URL**: Your `dataRepo.repository` URL (defaults to `https://github.com/meomeo-dev/llm-iq-data`)
   - **Callback URL**: `http://localhost:3000/api/data-repo/github/callback`
   - **Setup URL (redirect on install)**: `http://localhost:3000/api/data-repo/github/app-created`
   - **Webhook**: Uncheck **Active**
   - **Repository permissions**: `Contents: Read and write`, `Metadata: Read-only`
   - **Where can this GitHub App be installed**: `Only on this account`
   After creation, generate a Client Secret and write `{ id, slug, client_id, client_secret }` to `github-app.json` inside `runner`'s secrets directory (`/app/secrets/github-app.json`).

## Upgrading & Auth Persistence

OAuth tokens refresh in place inside their named volumes—upgrading does not require re-authenticating (frequent re-logins may trigger provider rate limits or risk controls):

```bash
git pull
docker compose up -d --build
```

| Operation | Auth & Data Volumes |
| --- | --- |
| `docker compose up -d --build`, `restart`, `stop` / `start`, `down` (without `-v`) | Preserved |
| Rebooting host machine or restarting Docker daemon | Preserved |
| `docker compose down -v` or `docker volume rm llm-iq-dashboard_*-auth` | **Wiped (requires re-login)** |
| Changing `name`, volume names, or mount paths in `compose.yaml` | **Orphaned (requires re-login)** |

`claude` and `codex` versions are pinned via `CLAUDE_CODE_VERSION` and `CODEX_VERSION` in `docker/Dockerfile` (skipped on boot if the installed binary already matches). `agy` installs the latest official release verified against its `sha512` manifest and updates in the background. If CLI installation fails on first boot due to transient network errors, restart the container or run manually:

```bash
docker exec -it llm-iq-runner sh docker/install-clis.sh
```

Credential file locations inside their volumes:
- `claude`: `~/.claude/.credentials.json`
- `codex`: `~/.codex/auth.json`
- `agy`: `~/.gemini/antigravity-cli/antigravity-oauth-token` (falls back to file storage because no OS keychain is present inside the container)

## Design Trade-Offs

- **Web and Credentials in Separate Containers**: Even if the public-facing Next.js process were compromised, CLI login tokens and GitHub push tokens do not exist on its filesystem. The two containers coordinate solely through `/app/data`: the web server writes request files into `data/requests/` for manual runs, readiness checks, capability probes, and data-repo actions; `runner` claims them, executes them, and writes back results. Because `web` cannot see `runner` PIDs across container namespaces, it checks `runner`'s 15-second heartbeat (`data/runner.json`, 45s TTL) plus the recorded PID to determine whether an active round is still alive.
- **Persistent Scheduler in `runner`**: The auto-run switch (`data/auto-run.json`) is stored on the shared volume and read by `runner` on every scheduled tick, surviving container restarts.
- **Bound to Localhost Only**: `compose.yaml` binds port `3000` to `127.0.0.1`. For public internet exposure, see [`docs/security/public-exposure-design.md`](security/public-exposure-design.md).
- **No Web Credential Upload**: CLI OAuth logins happen strictly inside `runner` via `pnpm onboard`.
- **Non-Root Execution**: Containers run as the `node` user owning both the data and auth directories.
- **CLIs Not Bundled in Image**: `claude` and `agy` are proprietary binaries whose licenses do not grant redistribution rights; the image ships only open-source code and downloads CLIs from official upstream channels at container boot.
- **Artwork Judging Inside `runner` (ACR-019 / ACR-020)**: The image installs Debian `chromium` for 8-frame rendered contact-sheet capture (`PELICAN_BROWSER_PATH=/usr/bin/chromium` and `PELICAN_BROWSER_NO_SANDBOX=1` because containers lack user namespaces), while the AI semantic layer invokes the authenticated CLIs inside `runner`. Contact sheets are written to the shared data volume and served by `web` via `/sheet`.

## Known Limitations

- `codex` device-code authentication (`codex login --device-auth`) and execution inside Linux containers have not been exhaustively verified across all environments.
- Headless `chromium` contact-sheet capture inside containers (`--no-sandbox` and `/dev/shm` sizing) falls back gracefully to static-only scoring if the browser fails to launch (logged as `render layer skipped`).
- `codex`'s read-only sandbox relies on Linux Landlock and `seccomp`, which may be restricted under certain default Docker security profiles; inspect the per-attempt `.txt` raw stream if sandbox errors occur.
- Images build for the host CPU architecture (`amd64` or `arm64`); all three CLIs provide Linux binaries for both architectures.
- First boot requires outbound network access to `registry.npmjs.org` and `antigravity.google`.
