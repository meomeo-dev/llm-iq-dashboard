# Design Notes

> **English** | [简体中文](design-notes.zh-CN.md)

Key engineering trade-offs in the Pelican Bicycle Benchmark execution and observability layers: capability probing, benchmark comparability, workspace isolation, SVG sanitization, and failure diagnostics.

## CLI Capability Probing & Effort Folding

Model lists and supported reasoning efforts are probed directly from each CLI to stay synchronized with CLI updates:

| CLI | Model Source | Effort Source |
| --- | --- | --- |
| `codex` | `codex debug models` (JSON) | Declared per model (e.g. `gpt-6-astra` up to `ultra`, `gpt-5.5` up to `xhigh`) |
| `agy` | `agy models` | Effort-suffixed variants merged into base model ID (`gemini-3.8-flash` → `low`/`medium`/`high`); unsuffixed models have fixed effort |
| `claude` | History + built-in fallback + custom config | Parsed from `claude --help` options |

`claude` models are merged from historical successful runs, the built-in catalog, and `customModels`, with each model badged by source (`probed` / `verified` / `custom` / `built-in`) in `/config`. Probed capabilities are cached in `data/capabilities.json` and can be re-probed on demand.

When a target requests a reasoning effort above the model's supported ceiling, `foldEffort` folds it down to the highest supported level not exceeding the requested level (never escalating upward). `run.json` records `effort` (requested), `appliedEffort` (sent to CLI), and `effortHonored` (whether the model supports effort tuning), displayed on cards as `effort: max → high` or `Effort fixed`.

## Separating Benchmark Prompts from House Rules & Display Localization

Keeping benchmark prompt wording verbatim is mandatory for historical and external comparability. However, agentic CLIs frequently try to save SVGs to disk and reply “Saved to …”, leaving no inline SVG in stdout.

Output format instructions are therefore injected as **House Rules** (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md` with identical content) inside the per-call scratch directory rather than mutating the prompt text (see [`src/core/house-rules.ts`](../src/core/house-rules.ts)). Note that `agy` in `--print` mode does not load workspace instruction files, so its adapter recovers SVGs from `write_to_file` events at the delivery stage.

Optionally, `run.harnessGuard` (disabled by default) appends a direct-output instruction paragraph after the prompt to suppress web search, code execution, and self-screenshots, recording the appended text in `run.json`'s `harnessGuard` field so bare-model and harness-guarded runs remain explicitly distinguished.

Likewise, switching the dashboard UI language (`EN` / `中文`) never alters the prompt `template`, `candidates[].text`, `house-rules.ts`, or `ai-prompt.ts` sent to CLIs, nor does it alter `run.json` or `.judge.json` on disk; only human-facing display metadata (`label`, `standard`, lifecycle age in `src/core/prompts/i18n/`, and judge rubric `G1`–`G5` / `C1`–`C9` descriptions in `src/i18n/judge-rubric.ts`) are localized at the presentation layer.

## Clean Per-Call Scratch Directory

Agent CLIs automatically load instruction files from the current working directory. Running inside this repository would leak project docs into the model's context. Every invocation therefore executes in an isolated empty directory `data/scratch/<runId>/<targetId>__<promptId>/` that is deleted once the round finishes; stale scratch directories left behind by interrupted rounds older than 3 hours are cleaned up before each round starts.

## Untrusted SVG Sanitization & Shadow DOM Isolation

Model-generated SVGs are untrusted XML documents that may contain `<script>`, `on*` event attributes, `<foreignObject>`, or external `href` beacons.

- [`src/app/components/card/svg-sanitize.ts`](../src/app/components/card/svg-sanitize.ts) repairs common XML well-formedness slips (`<style>` CDATA wrapping, consecutive `--` in comments, duplicate attributes, HTML named entities) and then parses the markup into a DOM tree to prune unsafe elements and attributes before `importNode`. Sanitization runs strictly in the browser so server-rendered HTML never embeds raw model markup.
- [`src/app/components/card/svg-scope.ts`](../src/app/components/card/svg-scope.ts) prefixes internal element IDs so multiple artworks on screen never collide on `url(#id)` gradients or clip paths.
- [`src/app/components/card/svg-shadow.ts`](../src/app/components/card/svg-shadow.ts) mounts each sanitized SVG inside its own Shadow Root (`:root` rewritten to `:host`; `@property` rules hoisted to `document.head` for Chromium compatibility) so inline `<style>` rules and `@keyframes` cannot leak across cards. When a `viewBox` is present, the `<svg>` element is sized to its exact aspect ratio using container query units (`cqw` / `cqh`) so out-of-bounds shapes are clipped at the canvas boundary; exported thumbnails wrap `<image>` in a nested `<svg viewBox>` for identical clipping.

## Failure Classification & SVG Recovery

`no-svg` (the model responded but produced no valid SVG) and `error` (CLI invocation or transport failure) are recorded as distinct statuses so pass-rate metrics are not polluted by operational errors. When a call fails, the adapter extracts the CLI-level failure reason (rejected flags, denied tool calls, turn errors) from the raw event stream.

SVG extraction checks three sources in priority order: inline `<svg>` in the response body → files written into the scratch workspace during the call (including `write_to_file` tool events and script-generated `.svg` files modified after the call started, taking the latest version) → `file://…/*.svg` paths referenced in the response. If a valid SVG was already written to disk before a timeout occurred, the attempt is still recorded as `ok`.

## CLI Invocation Modes

All three CLIs are driven via structured JSON event streams with tools disabled:

| CLI | Invocation | Key Constraints |
| --- | --- | --- |
| `claude` | `claude -p … --output-format stream-json --verbose --tools ""` | All tools disabled; `result` event reports any rejected tool attempts |
| `codex` | `codex app-server` (stdio JSON-RPC) | One long-lived process per round per profile (each non-default profile uses an isolated temporary home); ephemeral threads; read-only sandbox + `untrusted` approval policy rejecting all tool requests |
| `agy` | `agy --print … --output-format stream-json --sandbox` | Unapproved commands/reads rejected automatically; recovers SVG from `write_to_file` events if needed |

`codex` uses `codex app-server` because spawning concurrent `codex exec` processes causes contention when refreshing model lists (`failed to refresh available models`), hanging until timeout; sharing a single `app-server` process per profile avoids this contention (`codex` targets therefore do not accept per-target CLI `extraArgs`).

All three CLIs run without tools: drawing an SVG requires neither reading files nor running shell commands, and enabling tools would expose host credential files (see [`docs/security/public-exposure-design.md`](security/public-exposure-design.md) §4.5). If a model in `agy --sandbox` attempts to run `mkdir` or a validation command before outputting its SVG and gives up when rejected, that attempt is recorded as `no-svg` and preserved in the `.txt` event stream.

In **Judge Mode** (cross-vendor AI artwork evaluation), the temporary directory contains only the rendered contact sheets and read access to those images is enabled (`claude --tools Read`, `codex` read-only sandbox with `never` approval prompt, `agy` unchanged), while file writes and command execution remain blocked.
