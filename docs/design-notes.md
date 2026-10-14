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

When a target requests a reasoning effort above the model's supported ceiling, `foldEffort` folds it down to the highest supported level not exceeding the requested level (never escalating upward). `run.json` records `effort` (requested), `appliedEffort` (sent to CLI), and `effortHonored` (whether the model supports effort tuning).

## Separating Benchmark Prompts from House Rules

Keeping benchmark prompt wording verbatim is mandatory for historical and external comparability. However, agentic CLIs frequently try to save SVGs to disk and reply “Saved to …”, leaving no inline SVG in stdout.

Output format instructions are therefore injected as **House Rules** (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md` with identical content) inside the per-call scratch directory rather than mutating the prompt text (see [`src/core/house-rules.ts`](../src/core/house-rules.ts)).

Optionally, `run.harnessGuard` (disabled by default) appends a direct-output instruction paragraph after the prompt to suppress web search, code execution, and self-screenshots, recording the appended text in `run.json`'s `harnessGuard` field so bare-model and harness-guarded runs remain explicitly distinguished.

## Clean Per-Call Scratch Directory

Agent CLIs automatically load instruction files from the current working directory. Running inside this repository would leak project docs into the model's context. Every invocation therefore executes in an isolated empty directory `data/scratch/<runId>/<targetId>__<promptId>/` that is deleted once the round finishes.

## Untrusted SVG Sanitization & Shadow DOM Isolation

Model-generated SVGs are untrusted XML documents that may contain `<script>`, `on*` event attributes, `<foreignObject>`, or external `href` beacons.

- [`src/app/components/card/svg-sanitize.ts`](../src/app/components/card/svg-sanitize.ts) repairs common XML well-formedness slips (`<style>` CDATA wrapping, consecutive `--` in comments, duplicate attributes, HTML named entities) and then parses the markup into a DOM tree to prune unsafe elements and attributes before `importNode`.
- [`src/app/components/card/svg-scope.ts`](../src/app/components/card/svg-scope.ts) prefixes internal element IDs so multiple artworks on screen never collide on `url(#id)` gradients or clip paths.
- [`src/app/components/card/svg-shadow.ts`](../src/app/components/card/svg-shadow.ts) mounts each sanitized SVG inside its own Shadow Root (`:root` rewritten to `:host`) so inline `<style>` rules and `@keyframes` cannot leak across cards.

## Failure Classification & SVG Recovery

`no-svg` (the model responded but produced no valid SVG) and `error` (CLI invocation or transport failure) are recorded as distinct statuses so pass-rate metrics are not polluted by operational errors.

SVG extraction checks three sources in priority order: inline `<svg>` in the response body → files written into the scratch workspace during the call → `file://…/*.svg` paths referenced in the response.

## CLI Invocation Modes

All three CLIs are driven via structured JSON event streams with tools disabled:

| CLI | Invocation | Key Constraints |
| --- | --- | --- |
| `claude` | `claude -p … --output-format stream-json --verbose --tools ""` | All tools disabled; `result` event reports any rejected tool attempts |
| `codex` | `codex app-server` (stdio JSON-RPC) | One long-lived process per round per profile; ephemeral threads; read-only sandbox + `untrusted` approval policy rejecting all tool requests |
| `agy` | `agy --print … --output-format stream-json --sandbox` | Unapproved commands/reads rejected automatically; recovers SVG from `write_to_file` events if needed |

In **Judge Mode** (cross-vendor AI artwork evaluation), the temporary directory contains only the rendered contact sheets and read access to those images is enabled (`claude --tools Read`, `codex` read-only sandbox with `never` approval prompt), while command execution remains blocked.
