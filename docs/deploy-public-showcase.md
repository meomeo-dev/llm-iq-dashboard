# Public Read-Only Showcase Deployment Guide

> **English** | [简体中文](deploy-public-showcase.zh-CN.md)

This guide explains how to deploy `llm-iq-dashboard` as a public read-only showcase on serverless platforms (such as Vercel), serving sanitized benchmark history and SVG artworks from a public data repository while enforcing strict server-side security boundaries.

---

## 1. Architecture & Use Cases

- **Target Platforms**: Serverless environments with read-only filesystems and no persistent background daemons (Vercel, Netlify, etc.).
- **Data Flow**: Instead of reading a local `data/` directory, the server fetches run manifests and sanitized artworks on demand from the public data repository (`meomeo-dev/llm-iq-data`).
- **Server-Enforced Read-Only Mode**: Every write endpoint is blocked at the server boundary (`403 Forbidden`), pairing routes return `404`, and no CLI processes or filesystem writes can be triggered.
- **Embedded Judge Verdicts (ACR-020)**: Public `run.json` records embed sanitized `judge` summaries (`online` / `degraded` / `pending` verdicts and per-criterion scores) while omitting local contact sheets and judge transcripts.

---

## 2. Environment Variables

All variables are evaluated on the server (no `NEXT_PUBLIC_` prefix is used):

| Variable | Recommended Value | Required | Description |
|---|---|---|---|
| `PELICAN_READONLY` | `1` | Recommended | Enforces read-only deployment (`403` on write APIs, `404` on `/pair`, zero disk writes). |
| `PELICAN_DATA_SOURCE` | `remote` | Yes | Enables remote data source from the public data repository (automatically implies read-only mode if `PELICAN_READONLY` is omitted). |
| `PELICAN_DATA_REPO_URL` | `https://raw.githubusercontent.com/<org>/<repo>/main` | No | Raw root URL of the public data repository. Defaults to `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`. |

---

## 3. Pre-Deployment Checklist

1. **Run the Showcase Smoke Suite**:
   ```bash
   pnpm showcase:smoke
   ```
   Starts a local static fixture data repo and boots a production Next.js server with `PELICAN_READONLY=1 PELICAN_DATA_SOURCE=remote`, verifying homepage rendering, `/api/health`, `/art` CSP sandboxing, `403` write blocking, and `/config` redirection.
2. **Verify `/api/health`**:
   - Request `GET /api/health` after deployment;
   - Expect HTTP `200` with `dataRepo.reachable === true`.
3. **Caching & ISR Cadence**:
   - Manifest (`index.json`), day indices (`runs/YYYY/MM/DD/index.json`), and `run.json` use `next: { revalidate: 60 }` (60-second ISR + in-process deduplication);
   - Immutable SVG artworks served via `/art/[runId]/[file]` return `Cache-Control: public, max-age=86400, immutable` (24 hours) and strict `Content-Security-Policy: sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:;`.

---

## 4. Deploying on Vercel

1. Import this repository into [Vercel](https://vercel.com/) (**Framework Preset**: `Next.js`, **Build Command**: `pnpm build`, **Install Command**: `pnpm install`).
2. Add Environment Variables:
   - `PELICAN_READONLY` = `1`
   - `PELICAN_DATA_SOURCE` = `remote`
   - `PELICAN_DATA_REPO_URL` = `https://raw.githubusercontent.com/meomeo-dev/llm-iq-data/main`
3. Click **Deploy**.
