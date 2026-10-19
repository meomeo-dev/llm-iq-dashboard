import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import type { CapabilitySnapshot } from "@/capabilities/types";
import { inferCliForModel, resolveCliRunConfig } from "@/core/cli-run-selection";
import { loadConfig, type AppConfig } from "@/core/config";

const CONFIG_YAML = `
run:
  promptIds: [classic-v1]
  defaultTimeoutMs: 120000
  timeoutByCli:
    agy: 180000
  timeoutByEffort:
    high: 240000
profiles:
  - { name: relay-codex, cli: codex, upstreamType: compatible, baseUrl: "https://a.example/v1" }
  - { name: relay-off, cli: codex, upstreamType: compatible, baseUrl: "https://b.example/v1", enabled: false }
customModels:
  claude: [custom-claude-x]
targets:
  - { cli: claude, model: m-configured, effort: low }
  - { cli: claude, model: m-configured, effort: high, enabled: false }
  - { cli: codex, model: m-codex, effort: medium }
  - { cli: agy, model: m-agy-disabled, effort: low, enabled: false }
`;

let workdir = "";
let config: AppConfig;

const MOCK_CATALOG: CapabilitySnapshot = {
  schemaVersion: 2,
  probedAt: "2026-10-19T00:00:00.000Z",
  clis: [
    {
      cli: "agy",
      available: true,
      models: [
        {
          id: "probed-agy-only",
          cli: "agy",
          displayName: "Probed Agy",
          efforts: ["low", "medium", "high"],
          description: null,
          sources: ["probe"],
        },
      ],
      efforts: ["low", "medium", "high"],
      notes: [],
    },
    {
      cli: "claude",
      available: true,
      models: [
        {
          id: "shared-model",
          cli: "claude",
          displayName: "Shared Claude",
          efforts: ["low", "high"],
          description: null,
          sources: ["probe"],
        },
      ],
      efforts: ["low", "high"],
      notes: [],
    },
    {
      cli: "codex",
      available: true,
      models: [
        {
          id: "shared-model",
          cli: "codex",
          displayName: "Shared Codex",
          efforts: ["low", "high"],
          description: null,
          sources: ["probe"],
        },
      ],
      efforts: ["low", "high"],
      notes: [],
    },
  ],
};

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-cli-selection-"));
  const cfgPath = join(workdir, "pelican.config.yaml");
  await writeFile(cfgPath, CONFIG_YAML, "utf8");
  config = loadConfig(cfgPath);
});

after(async () => {
  await rm(workdir, { recursive: true, force: true });
});

test("inferCliForModel: resolves across 4 priority layers and rejects ambiguous/unknown models", () => {
  // Layer 1: config.targets
  assert.equal(inferCliForModel("m-configured", config, MOCK_CATALOG), "claude");
  // Layer 1 via extraCandidates (e.g., fingerprint reference)
  assert.equal(
    inferCliForModel("fp-ref-model", config, MOCK_CATALOG, [{ cli: "agy", model: "fp-ref-model" }]),
    "agy",
  );
  // Layer 2: capabilities.json snapshot
  assert.equal(inferCliForModel("probed-agy-only", config, MOCK_CATALOG), "agy");
  // Layer 3: config.customModels
  assert.equal(inferCliForModel("custom-claude-x", config, MOCK_CATALOG), "claude");
  // Layer 4: builtinModels
  assert.equal(inferCliForModel("gemini-3.8-flash", config, null), "agy");

  // Ambiguous across multiple CLIs
  assert.throws(
    () => inferCliForModel("shared-model", config, MOCK_CATALOG),
    /同时存在于多个 CLI（claude, codex）/,
  );

  // Unknown everywhere
  assert.throws(
    () => inferCliForModel("unknown-mystery-model", config, MOCK_CATALOG),
    /无法自动推导模型 "unknown-mystery-model" 所属的 CLI/,
  );
});

test("resolveCliRunConfig: falls back to scheduledRound when no target filters are provided", () => {
  const resolved = resolveCliRunConfig(config, {});
  assert.deepEqual(
    resolved.targets.map((t) => t.id),
    ["claude__m-configured__low", "codex__m-codex__medium"],
  );
  assert.deepEqual(resolved.run.promptIds, ["classic-v1"]);
});

test("resolveCliRunConfig: synthesizes ad-hoc Target for unconfigured model with standard buildTargetId and timeout priority", () => {
  const resolved = resolveCliRunConfig(
    config,
    { models: ["gemini-3.8-flash"], efforts: ["low"], promptIds: ["xiyou-v1"] },
    MOCK_CATALOG,
  );
  assert.equal(resolved.targets.length, 1);
  const target = resolved.targets[0]!;
  assert.equal(target.id, "agy__gemini-3.8-flash__low");
  assert.equal(target.cli, "agy");
  assert.equal(target.model, "gemini-3.8-flash");
  assert.equal(target.effort, "low");
  assert.equal(target.timeoutMs, 180000);
  assert.deepEqual(target.extraArgs, []);
  assert.equal(target.enabled, true);
  assert.deepEqual(resolved.run.promptIds, ["xiyou-v1"]);
});

test("resolveCliRunConfig: defaults ad-hoc model effort to 'low' and prefers enabled efforts for configured models", () => {
  const adhoc = resolveCliRunConfig(config, { clis: ["agy"], models: ["brand-new-model"] });
  assert.equal(adhoc.targets.length, 1);
  assert.equal(adhoc.targets[0]!.id, "agy__brand-new-model__low");

  // m-configured has low (enabled: true) and high (enabled: false) -> only low when --effort is omitted
  const configuredActiveOnly = resolveCliRunConfig(config, { models: ["m-configured"] });
  assert.deepEqual(configuredActiveOnly.targets.map((t) => t.id), ["claude__m-configured__low"]);

  // m-agy-disabled has only low (enabled: false) -> activates low when explicitly requested
  const configuredAllDisabled = resolveCliRunConfig(config, { models: ["m-agy-disabled"] });
  assert.deepEqual(configuredAllDisabled.targets.map((t) => t.id), ["agy__m-agy-disabled__low"]);
  assert.equal(configuredAllDisabled.targets[0]!.enabled, true);
});

test("resolveCliRunConfig: filterConfiguredTargets activates disabled targets when CLI has no enabled targets", () => {
  const agyOnly = resolveCliRunConfig(config, { clis: ["agy"] });
  assert.deepEqual(agyOnly.targets.map((t) => t.id), ["agy__m-agy-disabled__low"]);
  assert.equal(agyOnly.targets[0]!.enabled, true);
});

test("resolveCliRunConfig: expands across --profile and rejects unsupported/disabled/missing profiles", () => {
  const withProfile = resolveCliRunConfig(config, {
    clis: ["codex"],
    models: ["m-codex"],
    efforts: ["high"],
    profiles: ["relay-codex"],
  });
  assert.equal(withProfile.targets.length, 1);
  assert.equal(withProfile.targets[0]!.id, "codex__m-codex__high__relay-codex");
  assert.equal(withProfile.targets[0]!.profile, "relay-codex");
  assert.equal(withProfile.targets[0]!.timeoutMs, 240000);

  // Reject custom profile on non-PROFILE_CLIS (agy / claude)
  assert.throws(
    () =>
      resolveCliRunConfig(config, {
        clis: ["agy"],
        models: ["gemini-3.8-flash"],
        profiles: ["relay-codex"],
      }),
    /CLI "agy" 不支持自定义上游 profile/,
  );
  assert.throws(
    () => resolveCliRunConfig(config, { clis: ["claude"], profiles: ["relay-codex"] }),
    /CLI "claude" 不支持自定义上游 profile/,
  );
  // Reject disabled profile
  assert.throws(
    () => resolveCliRunConfig(config, { clis: ["codex"], profiles: ["relay-off"] }),
    /上游 relay-off 已停用/,
  );
  // Reject unknown prompt with typo suggestion
  assert.throws(
    () => resolveCliRunConfig(config, { promptIds: ["clasic-v1"] }),
    /未知题目 ID：clasic-v1（您是否想输入 classic-v1？）/,
  );
});
