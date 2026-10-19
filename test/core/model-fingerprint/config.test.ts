import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  DEFAULT_MODEL_FINGERPRINT_CONFIG,
  loadConfig,
  parseModelFingerprint,
  resolveModelFingerprintConfig,
} from "../../../src/core/config";

describe("modelFingerprint config parser", () => {
  it("returns default config when modelFingerprint is omitted or null", () => {
    const errors: string[] = [];
    const cfg = parseModelFingerprint(undefined, errors);
    assert.deepEqual(errors, []);
    assert.deepEqual(cfg, DEFAULT_MODEL_FINGERPRINT_CONFIG);
    assert.equal(resolveModelFingerprintConfig({}), DEFAULT_MODEL_FINGERPRINT_CONFIG);
  });

  it("parses valid modelFingerprint section including references and modelPrompts", () => {
    const errors: string[] = [];
    const cfg = parseModelFingerprint(
      {
        enabled: true,
        effort: "medium",
        samplesPerProbe: 24,
        probes: ["uuid", "words-zh", "uuid"],
        valuesPerCheck: 4,
        checkAttempts: 5,
        targetAccuracy: 0.9,
        maxCallsFactor: 4,
        concurrency: 8,
        references: [
          { cli: "codex", model: "gpt-5.4" },
          { cli: "codex", model: "gpt-5.4" },
          { cli: "claude", model: "claude-opus-4-6" },
        ],
        modelPrompts: {
          "codex:gpt-5.4": {
            "words-zh": { prompt: "Custom {{REQ_ID}}", valuesPerCall: 2 },
          },
        },
      },
      errors,
    );
    assert.deepEqual(errors, []);
    assert.equal(cfg.enabled, true);
    assert.equal(cfg.effort, "medium");
    assert.equal(cfg.samplesPerProbe, 24);
    assert.deepEqual(cfg.probes, ["uuid", "words-zh"]);
    assert.equal(cfg.valuesPerCheck, 4);
    assert.equal(cfg.checkAttempts, 5);
    assert.equal(cfg.targetAccuracy, 0.9);
    assert.equal(cfg.maxCallsFactor, 4);
    assert.equal(cfg.concurrency, 8);
    assert.equal(cfg.references.length, 2);
    assert.equal(cfg.modelPrompts["codex:gpt-5.4"]?.["words-zh"]?.valuesPerCall, 2);
  });

  it("rejects out-of-range samplesPerProbe, valuesPerCheck, targetAccuracy, and invalid entries", () => {
    const errors: string[] = [];
    parseModelFingerprint(
      {
        enabled: "yes",
        effort: "invalid-effort",
        samplesPerProbe: 8,
        probes: ["unknown-probe"],
        valuesPerCheck: 15,
        checkAttempts: 0,
        targetAccuracy: 0.5,
        maxCallsFactor: 0,
        concurrency: 25,
        references: [{ cli: "bad", model: "" }],
        modelPrompts: {
          "gpt-5.4": {
            "bad-probe": { prompt: "" },
            uuid: { prompt: "   ", valuesPerCall: 0 },
          },
          "badcli:gpt-5.4": {
            uuid: { prompt: "ok" },
          },
        },
      },
      errors,
    );
    assert.ok(errors.some((e) => e.includes("modelFingerprint.enabled")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.effort")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.samplesPerProbe")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.probes")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.valuesPerCheck")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.checkAttempts")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.targetAccuracy")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.maxCallsFactor")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.concurrency")));
    assert.ok(errors.some((e) => e.includes("modelFingerprint.references[0]")));
    assert.ok(errors.some((e) => e.includes("含有未知探针：bad-probe")));
    assert.ok(errors.some((e) => e.includes("uuid.prompt")));
    assert.ok(errors.some((e) => e.includes("uuid.valuesPerCall")));
    assert.ok(errors.some((e) => e.includes('modelPrompts["badcli:gpt-5.4"]')));

    const effortErrors: string[] = [];
    parseModelFingerprint({ effort: "" }, effortErrors);
    assert.equal(effortErrors.length, 1);
  });

  it("integrates with top-level loadConfig and parses pelican.example.yaml", () => {
    const dir = mkdtempSync(join(tmpdir(), "pelican-fp-cfg-"));
    try {
      const cfgPath = join(dir, "test.yaml");
      writeFileSync(
        cfgPath,
        [
          "run:",
          "  promptIds:",
          "    - classic-v1",
          "targets:",
          "  - cli: codex",
          "    model: gpt-5.4",
          "    effort: low",
          "modelFingerprint:",
          "  enabled: true",
          "  samplesPerProbe: 20",
          "  valuesPerCheck: 10",
        ].join("\n"),
        "utf8",
      );
      const cfg = loadConfig(cfgPath);
      assert.equal(cfg.modelFingerprint?.enabled, true);
      assert.equal(cfg.modelFingerprint?.valuesPerCheck, 10);
      const resolved = resolveModelFingerprintConfig(cfg);
      assert.deepEqual(resolved.references, [{ cli: "codex", model: "gpt-5.4" }]);

      const exampleCfg = loadConfig("config/pelican.example.yaml");
      assert.equal(exampleCfg.modelFingerprint?.enabled, false);
      assert.equal(exampleCfg.modelFingerprint?.samplesPerProbe, 20);
      const resolvedExample = resolveModelFingerprintConfig(exampleCfg);
      assert.ok(resolvedExample.references.length >= 3, "derives unique (cli, model) pairs from example targets");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
