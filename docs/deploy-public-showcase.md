# Public Read-Only Showcase Deployment Guide

> **English** | [简体中文](deploy-public-showcase.zh-CN.md)

This guide explains how to deploy `llm-iq-dashboard` as a public read-only showcase on serverless platforms (such as Vercel), serving sanitized benchmark history and SVG artworks from a public data repository while enforcing strict server-side security boundaries.

---

## 1. Architecture & Use Cases

- **Target Platforms**: Serverless environments with read-only filesystems and no persistent background daemons (Vercel, Netlify, etc.).
- **Data Flow**: Instead of reading a local `data/` directory, the server fetches run manifests and sanitized artworks on demand from the public data repository (`meomeo-dev/llm-iq-data`).
- **Server-Enforced Read-Only Mode**: Every write endpoint is blocked at the server boundary (`403 Forbidden`), pairing routes return `404`, and no CLI processes or filesystem writes can be triggered.
- **Embedded Judge Verdicts (ACR-020)**: Public `run.json` records embed sanitized `judge` summaries (`online` / `degraded` / `pending` verdicts and per-criterion scores) so showcase cards and artwork pages display the exact same badges and scores while omitting local contact sheets and judge transcripts.

---

## 2. Environment Variables

All variables are evaluated on the server (no `NEXT_PUBLIC_` prefix is used; the client receives only read-only props):

| Variable | Recommended Value | Required | Description |
|---|---|---|---|
| `PELICAN_READONLY` | `1` | Recommended | Enforces read-only deployment (`403` on write APIs, `404` on `/pair`, zero disk writes). |
| `PELICAN_DATA_SOURCE` | `remote` | Yes | Enables remote data source from the public data repository (automatically implies read-only mode with a startup log warning if `PELICAN_READONLY` is omitted). |
| `PELICAN_DATA_REPO_URL` | `https://raw.githubusercontent.com/<org>/<repo>/main` | No | Raw root URL of the public data repository. Defaults to `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`. |

**Custom Data Repository**: You can create your own data repository from the [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data) template, configure `dataRepo.repository` and `dataRepo.path` on your runner machine, and point `PELICAN_DATA_REPO_URL` on the showcase deployment to your repository's raw root URL. The data repository's CI automatically validates schema contracts and runs leak scans on every push.

---

## 3. Pre-Deployment Checklist

Run the full verification suite locally before pushing or triggering a cloud build:

1. **Run the Showcase Smoke Suite**:
   ```bash
   pnpm showcase:smoke
   ```
   Starts a local static fixture data repository and boots a production Next.js server with `PELICAN_READONLY=1 PELICAN_DATA_SOURCE=remote`, verifying homepage rendering, `/api/health`, `/art` CSP sandboxing, `403` write blocking, and `/config` redirection.
2. **Required Environment Variables**:
   - `PELICAN_READONLY=1`: Enforces read-only mode and prevents any disk writes.
   - `PELICAN_DATA_SOURCE=remote`: Switches data loading to the remote public data repository.
   - `PELICAN_DATA_REPO_URL`: Root raw URL of the public data repository (defaults to official repo).
3. **Verify `/api/health`**:
   - Request `GET /api/health` (public, read-only, side-effect-free) after deployment;
   - Expect HTTP `200` with `dataRepo.reachable === true`;
   - If the remote repository is unreachable, the endpoint still returns HTTP `200` with `reachable: false` and a safe diagnostic message without leaking local file paths or environment variables.
4. **60-Second Refresh Cadence & Bounds**:
   - **Meaning**: Manifest (`index.json`), day indices (`runs/YYYY/MM/DD/index.json`), and `run.json` fetches attach `next: { revalidate: 60 }` (60-second Next.js ISR cache) alongside a matching 60-second in-process request cache that coalesces concurrent in-flight requests for the same URL;
   - **Bound**: Newly pushed rounds appear on the public showcase within ~60 seconds (plus GitHub Raw CDN propagation); published SVG artworks are append-only and immutable, cached for 24 hours.
5. **Pricing Catalog Bundling (`outputFileTracingIncludes`)**:
   - `next.config.ts` configures `outputFileTracingIncludes: { "/**": ["data/pricing/**/*"] }`;
   - During `pnpm install`, the `postinstall` hook downloads and verifies the locked pricing catalog release assets into `data/pricing/`;
   - **Graceful Degradation**: If the build environment is offline and pricing assets are absent, the showcase degrades gracefully—displaying `Unsynced / Unknown` for card costs without causing SSR errors or `500` responses.

---

## 4. Deploying on Vercel

1. **Import Repository**: Sign in to [Vercel](https://vercel.com/), click **Add New... -> Project**, and import this repository.
2. **Build Settings**:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
3. **Configure Environment Variables**:
   - `PELICAN_READONLY` = `1`
   - `PELICAN_DATA_SOURCE` = `remote`
   - `PELICAN_DATA_REPO_URL` = `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main` (or your custom data repo raw URL)
4. **Deploy**: Click **Deploy**.

Live public showcase: <https://llm-iq-dashboard.vercel.app> (auto-deployed from `main` via Vercel GitHub integration; `GET /api/health` reports the live `version` from `package.json`).

---

## 5. Security Boundaries (Server-Enforced)

Read-only protection is enforced at the server boundary rather than merely hiding UI controls:

1. **Write Endpoints Blocked (`403 Forbidden`)**:
   - Every state-mutating route (`POST /api/run`, `POST /api/run/cancel`, `PUT /api/config`, `PUT /api/auto-run`, `/api/data-repo*`, `/api/profiles*`, etc.) checks `isReadonly()` inside `requireOwnerAction` and immediately returns `403 Forbidden` without executing commands or writing to `data/audit.log`.
2. **Pairing & Configuration Entrypoints Closed**:
   - `/pair` and `POST /api/pair` return `404 Not Found`;
   - `/config` redirects immediately to `/`;
   - Owner session cookies are never accepted (`verifySession` always returns `null`);
   - `data/server.key` and `data/devices.json` are never read or generated.
3. **Strict CSP Sandbox & Same-Origin Policy**:
   - Global response headers maintain `default-src 'self'` without opening cross-origin access to third-party repositories;
   - Browsers never fetch GitHub Raw directly—all artworks are proxied by `/art/[runId]/[file]`;
   - `/art` responses attach `Content-Security-Policy: sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:;` with an opaque origin, preventing script execution or same-origin probing.
4. **Registered Filename Allowlist**:
   - `/art/[runId]/[file]` verifies that `file` is explicitly listed in `attempts[].svgFile` of that round's `run.json`; unregistered or redacted filenames return `404`, preventing path traversal or unauthorized file access.

---

## 6. Caching, Calendar Cap & SSE Behavior

- **Manifest, Day Indices & Run Records**:
  - `index.json` (Manifest), `runs/YYYY/MM/DD/index.json` (DayIndex), and per-round `run.json` use `next: { revalidate: 60 }` and a 60-second in-process cache.
  - **62-Day Calendar Cap (`CALENDAR_DETAIL_DAYS`)**: When building calendar run counts (`listRunStarts`), the server fetches day indices only for the most recent 62 days in `index.json` to obtain exact timestamps; earlier dates synthesize UTC noon timestamps (`<date>T12:00:00.000Z`) directly from `days[].runs` counts, bounding calendar requests to a constant `≤ 62` fetches.
- **Append-Only Immutable Artworks**:
  - The data repository contract guarantees that published run directories are never mutated or deleted;
  - `/art` returns `Cache-Control: public, max-age=86400, immutable` for 24-hour browser and CDN caching.
- **SSE Event Channel**:
  - In `remote` mode, `/api/events` does not start a local `chokidar` file watcher; it pushes an initial empty progress and auto-run snapshot and holds the connection open so clients do not reconnect in a loop.

---

## 7. Functional Limitations

1. **No Online Benchmark Execution**: The public showcase never runs `claude`, `codex`, or `agy` CLIs and does not run a background scheduler.
2. **Cost Calculation**: Relies on the pricing catalog bundled at build time via `outputFileTracingIncludes` (`data/pricing/**/*`); if a model's pricing entry is missing, cost fields degrade gracefully to `Unsynced / Unknown` without crashing page rendering.
