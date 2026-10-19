import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  planFingerprintStatus,
  planReferenceFill,
  planVerificationCheck,
  resolveSelectedProbes,
  simulateSampleSetMutation,
} from "../../../src/core/model-fingerprint/plan";
import {
  DEFAULT_SAMPLES_BY_PROBE,
  DEFAULT_VALUES_PER_CHECK_BY_PROBE,
  PROBE_IDS,
  type ProbeId,
  type ProbeSampleSet,
} from "../../../src/core/model-fingerprint/types";

function makeSeedSet(model: string, count: number): ProbeSampleSet {
  const alphabet = "0123456789abcdef";
  const attempts = Array.from({ length: count }, (_, idx) => {
    const hex = Array.from({ length: 16 }, (__, j) => alphabet[(idx + j) % 16]!).join("");
    return {
      at: "2026-10-17T00:00:00.000Z",
      profile: "default",
      reqId: `req-${idx}`,
      valuesPerCall: 1,
      outcome: "ok" as const,
      rawText: `<answer>\nseed_${hex}\n</answer>`,
      durationMs: 100,
      usage: null,
      estimatedCostUsd: 0.02,
      cliVersion: "1.0.0",
    };
  });
  return {
    probe: "seed",
    cli: "codex",
    environment: "codex-low",
    model,
    requestedEffort: "low",
    appliedEffort: "low",
    effortHonored: true,
    attempts,
  };
}

function makeFullProbeSets(model: string, count: number): Partial<Record<ProbeId, ProbeSampleSet>> {
  const base = makeSeedSet(model, count);
  return {
    uuid: { ...base, probe: "uuid", attempts: base.attempts.map((a, i) => ({ ...a, rawText: `<answer>\n${String((i % 8) + 1).repeat(8)}-2345-4678-89ab-${String(((i + 3) % 8) + 1).repeat(12)}\n</answer>` })) },
    number: { ...base, probe: "number", attempts: base.attempts.map((a, i) => ({ ...a, rawText: `<answer>\n${123456789012 + i * 11111}\n</answer>` })) },
    seed: base,
    palette: { ...base, probe: "palette", attempts: base.attempts.map((a, i) => ({ ...a, rawText: `<answer>\n#12345${i % 10}-#23456${i % 10}-#34567${i % 10}-#45678${i % 10}-#56789${i % 10}\n</answer>` })) },
    "words-en": { ...base, probe: "words-en", attempts: base.attempts.map((a) => ({ ...a, rawText: "<answer>\napple-river-cloud-stone-flame-breeze-shadow-amber\n</answer>" })) },
    "words-zh": { ...base, probe: "words-zh", attempts: base.attempts.map((a) => ({ ...a, rawText: "<answer>\n山川-星河-清风-明月-松涛-云海-晨曦-暮雪\n</answer>" })) },
  };
}

describe("model-fingerprint planner: probes, fill, status & check", () => {
  it("resolves selected probes and plans targeted single-model fill with --count and mutations (AC 1, AC 7)", () => {
    assert.deepEqual(resolveSelectedProbes(["seed", "invalid", "seed"], ["uuid"]), ["seed"]);
    assert.deepEqual(resolveSelectedProbes([], ["uuid", "number"]), ["uuid", "number"]);
    assert.equal(resolveSelectedProbes().length, 6);

    const existing = makeSeedSet("gpt-5.4", 8);
    const sampleSets = new Map([["codex:gpt-5.4:seed", existing]]);

    const fillPlan = planReferenceFill({
      configuredReferences: [{ cli: "codex", model: "gpt-5.4" }],
      sampleSets,
      cliFilter: "codex",
      modelFilter: "gpt-6-new",
      requestedProbes: ["seed"],
      samplesPerProbe: 10,
      countLimit: 3,
    });
    assert.equal(fillPlan.items.length, 1);
    assert.equal(fillPlan.items[0]?.model, "gpt-6-new");
    assert.equal(fillPlan.items[0]?.missingValues, 10);
    assert.equal(fillPlan.items[0]?.plannedValues, 3);
    assert.equal(fillPlan.totalEstimatedCalls, 1);

    const mutatedPlan = planReferenceFill({
      configuredReferences: [{ cli: "codex", model: "gpt-5.4" }],
      sampleSets,
      requestedProbes: ["seed", "uuid"],
      samplesPerProbe: 10,
      mutation: { excludeReqIds: ["req-0", "req-1"] },
    });
    assert.equal(mutatedPlan.items[0]?.validValues, 6);
    assert.equal(mutatedPlan.items[0]?.missingValues, 4);
    assert.ok(Math.abs((mutatedPlan.items[1]?.estimatedCostUsd ?? 0) - 0.04) < 1e-12);
    assert.equal(existing.attempts[0]?.excluded, undefined);

    const excludedSet = simulateSampleSetMutation(existing, { excludeReqIds: ["req-0", "req-1"] })!;
    assert.equal(excludedSet.attempts[0]?.excluded, true);
    assert.equal(excludedSet.attempts[1]?.excluded, true);
    const conflictMutated = simulateSampleSetMutation(excludedSet, {
      excludeReqIds: ["req-0"],
      includeReqIds: ["req-0", "req-1"],
    })!;
    assert.equal(conflictMutated.attempts[0]?.excluded, true, "--exclude must take precedence over --include on same reqId");
    assert.equal(conflictMutated.attempts[1]?.excluded, undefined, "--include restores excluded sample when not in excludeReqIds");

    const resetPlan = planReferenceFill({
      configuredReferences: [{ cli: "codex", model: "gpt-5.4" }],
      sampleSets,
      requestedProbes: ["seed"],
      samplesPerProbe: 10,
      mutation: { reset: true },
    });
    assert.equal(resetPlan.items[0]?.validValues, 0);
    assert.equal(resetPlan.items[0]?.missingValues, 10);

    const perProbePlan = planReferenceFill({
      configuredReferences: [{ cli: "codex", model: "gpt-5.4" }],
      sampleSets,
      requestedProbes: ["seed", "words-zh"],
      samplesPerProbe: 20,
      samplesByProbe: { seed: 50, "words-zh": 80 },
    });
    assert.equal(perProbePlan.items[0]?.targetValues, 50);
    assert.equal(perProbePlan.items[0]?.missingValues, 42);
    assert.equal(perProbePlan.items[1]?.targetValues, 80);
    assert.equal(perProbePlan.items[1]?.missingValues, 80);
  });

  it("unions configured references and on-disk sample sets in planFingerprintStatus and computes intraProbeSim", () => {
    const diskSet = makeSeedSet("disk-only-model", 10);
    const status = planFingerprintStatus({
      configuredReferences: [{ cli: "codex", model: "cfg-only-model" }],
      onDiskSampleSets: [diskSet],
      requestedProbes: ["seed"],
      samplesPerProbe: 10,
    });
    assert.equal(status.length, 2);
    const cfgEntry = status.find((s) => s.model === "cfg-only-model")!;
    const diskEntry = status.find((s) => s.model === "disk-only-model")!;
    assert.equal(cfgEntry.configuredInReferences, true);
    assert.equal(cfgEntry.onDisk, false);
    assert.equal(diskEntry.configuredInReferences, false);
    assert.equal(diskEntry.onDisk, true);
    assert.deepEqual(diskEntry.usableProbes, ["seed"]);
    assert.ok((diskEntry.probes.seed?.intraProbeSim ?? 0) > 0.5);
    assert.ok((diskEntry.probes.seed?.intraProbeLowerBound ?? 0) > 0.4);
    assert.ok(Math.abs((diskEntry.probes.seed?.unitCostUsd ?? 0) - 0.02) < 1e-12);
    assert.ok(Math.abs((diskEntry.probes.seed?.spentCostUsd ?? 0) - 0.2) < 1e-12);
    assert.ok(Math.abs((cfgEntry.probes.seed?.unitCostUsd ?? 0) - 0.02) < 1e-12);
    assert.ok(Math.abs((cfgEntry.probes.seed?.estimatedCostUsd ?? 0) - 0.04) < 1e-12);
  });

  it("skips missing-reference probes during check and reports fill call counts across 1, 3, and 6 probes (AC 4, AC 7)", () => {
    const setC = makeSeedSet("model-c", 10);
    const setA = makeSeedSet("model-a", 10);
    const byModel = new Map([
      ["model-c", { seed: setC }],
      ["model-a", { seed: setA }],
      ["model-uncompared", {}],
    ]);

    const checkPlan = planVerificationCheck({
      cli: "codex",
      declaredModel: "model-c",
      sampleSetsByModel: byModel,
      requestedProbes: ["seed", "uuid", "number"],
      samplesPerProbe: 10,
      valuesPerCheck: 1,
      checkAttempts: 3,
    });

    assert.equal(checkPlan.selectedProbes.length, 3);
    assert.equal(checkPlan.executableProbes.length, 1);
    assert.equal(checkPlan.executableProbes[0]?.probe, "seed");
    assert.equal(checkPlan.totalEstimatedCalls, 1);
    assert.equal(checkPlan.totalMaxCalls, 3);
    assert.ok(Math.abs((checkPlan.executableProbes[0]?.estimatedCostUsd ?? 0) - 0.02) < 1e-12);
    assert.ok(Math.abs((checkPlan.totalEstimatedCostUsd ?? 0) - 0.02) < 1e-12);
    assert.equal(checkPlan.skippedProbes.length, 2);
    assert.equal(checkPlan.skippedProbes[0]?.probe, "uuid");
    assert.equal(checkPlan.skippedProbes[0]?.missingValues, 10);
    assert.equal(checkPlan.skippedProbes[0]?.estimatedCalls, 2);
    assert.deepEqual(checkPlan.candidateModels, ["model-a"]);
    assert.equal(checkPlan.uncomparedModels.length, 1);
    assert.equal(checkPlan.uncomparedModels[0]?.model, "model-uncompared");

    const fullByModel = new Map([
      ["model-c", makeFullProbeSets("model-c", 10)],
      ["model-a", makeFullProbeSets("model-a", 10)],
    ]);
    for (const subset of [["seed"], ["seed", "uuid", "number"], [...PROBE_IDS]] as const) {
      const subPlan = planVerificationCheck({
        cli: "codex",
        declaredModel: "model-c",
        sampleSetsByModel: fullByModel,
        requestedProbes: subset,
        samplesPerProbe: 10,
        valuesPerCheck: 1,
        checkAttempts: 3,
      });
      assert.equal(subPlan.executableProbes.length, subset.length);
      assert.equal(subPlan.skippedProbes.length, 0);
      assert.equal(subPlan.totalEstimatedCalls, subset.length);
      assert.equal(subPlan.totalMaxCalls, subset.length * 3);
    }

    const calibratedByModel = new Map([["model-c", makeFullProbeSets("model-c", 80)]]);
    const calibratedPlan = planVerificationCheck({
      cli: "codex",
      declaredModel: "model-c",
      sampleSetsByModel: calibratedByModel,
      requestedProbes: [...PROBE_IDS],
      samplesByProbe: { ...DEFAULT_SAMPLES_BY_PROBE },
      valuesPerCheckByProbe: { ...DEFAULT_VALUES_PER_CHECK_BY_PROBE },
      checkAttempts: 3,
    });
    assert.deepEqual(
      calibratedPlan.executableProbes.map((p) => p.estimatedCalls),
      [1, 1, 2, 2, 1, 3],
    );
    assert.equal(calibratedPlan.totalEstimatedCalls, 10);
    assert.equal(calibratedPlan.totalMaxCalls, 30);

    assert.throws(() => resolveSelectedProbes(["invalid-only"], ["seed"]), /Invalid probe filter/);
  });
});
