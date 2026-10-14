# Development Guide

> **English** | [简体中文](development.zh-CN.md)

Directory responsibilities, runtime data artifacts, HTTP API reference, adding a new CLI adapter, and running the test suite.

## Directory Layout

```
config/             Starter config template, smoke config, pricing lockfile, code-length & secret scan policies
docs/               Benchmark provenance, design notes, deployment guides, data sync & architecture records
docker/             Dockerfile, .dockerignore, container entrypoint, and CLI installer script (see root compose.yaml)
scripts/            Production dashboard launcher, code-length gate, secret scanner, judge backfill, showcase smoke
src/core/           Domain logic: config & AST writer, prompts & variables, orchestration, scheduler, storage, SVG extraction
src/core/judge/     Artwork judging: static AST analysis, Chromium frame capture, cross-vendor AI judge, store
src/core/sync/      Data repo sync pipeline: sanitization, sync ledger, publish confirmation, origin verification
src/core/data-repo/ Data repository layout and schema contract
src/core/data-source/ Data source abstraction: local data/ filesystem vs. remote public data repo
src/core/auth/, github-auth/ Owner device pairing & session tokens; GitHub App manifest flow & push tokens
src/capabilities/   CLI capability probing, multi-source merging, installation & login readiness cache
src/adapters/       One adapter per CLI implementing the unified AgentAdapter contract
src/pricing/        Token usage parsing and API-equivalent cost calculation against the pricing catalog
src/i18n/           Bilingual (en / zh-CN) type-safe dictionaries, locale negotiation, and React context
src/bin/            CLI entrypoints: run-once, scheduler, runner, pair, preflight, onboard, pricing-sync, sync-data, validate-prompts
src/app/            Next.js dashboard (/), config console (/config), artwork viewer (/view), pairing (/pair), sandboxed SVG (/art), contact sheets (/sheet)
test/               Unit tests mirroring src/ directory structure
data/runs/          Run outputs (gitignored)
data/pricing/       Cached pricing catalog release assets (gitignored, populated by pnpm pricing:sync)
```

## Runtime Artifacts (`data/`)

All state is stored as plain files under `data/` (`PELICAN_DATA_DIR`):

```
data/runs/<runId>/run.json                  Full metadata for a benchmark round (updated incrementally while inProgress)
data/runs/<runId>/progress.json             Per-attempt live status (queued / running / done, runner pid, AI judging queue)
data/runs/<runId>/<attemptKey>.svg          Extracted SVG artwork (<targetId>__<promptId>)
data/runs/<runId>/<attemptKey>.txt          Raw CLI event stream and stderr (never published to public data repo)
data/runs/<runId>/cancel.json               Cancellation marker written when stopping an active round
data/runs/<runId>/<attemptKey>.judge.json   Artwork evaluation record (ACR-019 / ACR-020)
data/runs/<runId>/<attemptKey>.sheet.png    8-frame sequence contact sheet; .sheet.<kind>.png part detail sheets
data/runs/<runId>/<attemptKey>.judge-ai.txt Raw transcript of the 3-turn AI judge session
data/scratch/<runId>/<attemptKey>/          Isolated empty working directory per CLI invocation (cleaned up after round)
data/requests/                              File-based RPC queue from web container to runner container
data/auto-run.json                          Auto-run master switch state
data/scheduler.json                         Active scheduler pid & start timestamp
data/runner.json                            Runner container heartbeat (updated every 15s)
data/variable-state.json                    Current candidate rotation deck and shuffle state
data/capabilities.json                      Cached CLI capability snapshot
data/readiness.json                         Cached CLI installation and login readiness
data/sync-state.json                        Public data repository sync ledger
```

`runId` is derived from the UTC start timestamp (`20260922T113920Z`), so lexicographical order equals chronological order.

## HTTP API Reference

Write endpoints require an authorized Owner browser session cookie plus header `X-Pelican-Action: 1`, and always return `403` in read-only mode (`PELICAN_READONLY=1` or `PELICAN_DATA_SOURCE=remote`).

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Deployment mode, remote data repo reachability, and package version |
| `POST /api/pair` | Exchange one-time `pnpm pair` code for an Owner session cookie (rate-limited to 5 attempts / 10m per IP) |
| `GET` / `DELETE /api/session` | Query owner session & paired device list; sign out current device |
| `DELETE /api/devices/<id>` | Revoke a paired device |
| `GET /api/runs?limit=20` | Read-only benchmark run records |
| `GET /api/events` | Server-Sent Events (SSE) stream pushing live progress and auto-run state changes |
| `GET /api/progress` | Detailed per-call progress for the latest 3 rounds |
| `GET /view/<runId>/<svgFile>` | Standalone artwork viewer page with prompt and judge drawers |
| `GET /art/<runId>/<svgFile>` | Raw model SVG served with strict `Content-Security-Policy: sandbox` |
| `GET /sheet/<runId>/<file>` | Contact sheet PNG for judged artworks |
| `GET` / `PUT /api/config` | Read configuration or apply validated patch to `pelican.config.yaml` |
| `GET` / `POST /api/capabilities` | Read cached CLI capabilities or trigger live re-probe |
| `GET` / `POST /api/run` | Query selectable run options or launch a manual benchmark round (`202`) |
| `POST /api/run/cancel` | Request cancellation of the active round (`202`) |
| `GET` / `POST /api/readiness` | Read or re-check CLI installation & login status |
| `GET` / `PUT /api/auto-run` | Query or toggle the scheduled auto-run switch |
| `GET` / `POST /api/data-repo*` | Query data repository sync status, trigger dry-run / export / confirm / push, or manage GitHub App |
| `GET` / `PUT` / `DELETE /api/profiles/credential` | Check, save, or delete upstream profile API keys |
| `POST /api/profiles/models` | Fetch upstream model list for a configured profile |

## Adding a New CLI Adapter

1. Implement `AgentAdapter` under `src/adapters/` (`openSession()` and `ask()`);
2. Register the adapter in `src/adapters/index.ts`;
3. Add the CLI identifier to `CLI_KINDS` in `src/core/types.ts`;
4. Implement a `CapabilityProbe` under `src/capabilities/` and add it to `PROBES` in `src/capabilities/catalog.ts`.

## Testing & Quality Gates

```bash
pnpm test
```

Runs `test/**/*.test.ts` via Node's built-in `node:test` runner and `tsx`. Unit tests never invoke external CLIs or read host `data/`. Pre-commit and pre-push hooks are managed by `lefthook` (`lefthook.yml`).
