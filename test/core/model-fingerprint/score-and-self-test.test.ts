import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateVerdictState,
  scoreVerificationQuery,
} from "../../../src/core/model-fingerprint/score";
import {
  buildFoldIndexSets,
  buildSelfTestReport,
  capAndSliceReferencePool,
  computeIntraProbeConvergence,
  decodeSampleSetAttempts,
  prepareModelProbeFolds,
} from "../../../src/core/model-fingerprint/self-test";
import type {
  ModelComparisonResult,
  ProbeId,
  ProbeSampleSet,
} from "../../../src/core/model-fingerprint/types";

function makeSeedValue(alphabet: string, index: number): string {
  const chars: string[] = [];
  for (let i = 0; i < 16; i += 1) {
    chars.push(alphabet[(index + i) % alphabet.length]!);
  }
  return `seed_${chars.join("")}`;
}

function makeNumberValue(digits: string, index: number): string {
  const chars: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    const ch = digits[(index + i) % digits.length]!;
    chars.push(i === 0 && ch === "0" ? "1" : ch);
  }
  return chars.join("");
}

function makeSampleSet(
  model: string,
  probe: ProbeId,
  values: readonly string[],
  valuesPerCall = 1,
): ProbeSampleSet {
  const attempts = [];
  for (let i = 0; i < values.length; i += valuesPerCall) {
    const batch = values.slice(i, i + valuesPerCall);
    attempts.push({
      at: "2026-10-17T00:00:00.000Z",
      profile: "default",
      reqId: `req-${model}-${probe}-${i}`,
      valuesPerCall,
      outcome: "ok" as const,
      rawText: `<answer>\n${batch.join("\n")}\n</answer>`,
      durationMs: 100,
      usage: null,
      estimatedCostUsd: 0.01,
      cliVersion: "1.0.0",
    });
  }
  return {
    probe,
    cli: "codex",
    environment: "codex-low",
    model,
    requestedEffort: "low",
    appliedEffort: "low",
    effortHonored: true,
    attempts,
  };
}

describe("model-fingerprint self-test folds & sampleSelfSim", () => {
  it("enforces per-reqId cap floor(N/(2m)) and non-overlapping reqId folds (AC 4, AC 6)", () => {
    const raw = Array.from({ length: 12 }, (_, i) => ({
      reqId: i < 8 ? "req-big" : `req-${i}`,
      value: makeSeedValue("01234567", i),
    }));
    const capped = capAndSliceReferencePool(raw, 10, 2);
    const bigCount = capped.filter((x) => x.reqId === "req-big").length;
    assert.equal(bigCount, 2);

    const pool = Array.from({ length: 10 }, (_, i) => ({
      reqId: `req-${Math.floor(i / 2)}`,
      value: makeSeedValue("01234567", i),
    }));
    const folds = buildFoldIndexSets(10, 2);
    assert.equal(folds.length, 45);
    const prep = prepareModelProbeFolds("seed", pool, folds);
    assert.equal(prep.singleRefCapacity, 6);

    const largeFolds1 = buildFoldIndexSets(20, 3);
    const largeFolds2 = buildFoldIndexSets(20, 3);
    assert.equal(largeFolds1.length, 50);
    assert.deepEqual(largeFolds1, largeFolds2);
  });

  it("computes sampleSelfSim and sets null when only 1 attempt exists (AC 6)", () => {
    const singleSet = makeSampleSet("m1", "seed", [makeSeedValue("01234567", 0)]);
    const decodedSingle = decodeSampleSetAttempts(singleSet, 10, 1);
    assert.equal(decodedSingle[0]?.sampleSelfSim, null);

    const multiSet = makeSampleSet("m1", "seed", [
      makeSeedValue("01234567", 0),
      makeSeedValue("01234567", 1),
    ]);
    const decodedMulti = decodeSampleSetAttempts(multiSet, 10, 1);
    assert.ok(typeof decodedMulti[0]?.sampleSelfSim === "number");
  });
});

describe("model-fingerprint pairwise scoring, independence & self-test report", () => {
  const modelAVals = Array.from({ length: 10 }, (_, i) => makeSeedValue("012345", i));
  const modelBVals = Array.from({ length: 10 }, (_, i) => makeSeedValue("abcdef", i));
  const modelCVals = Array.from({ length: 10 }, (_, i) => makeSeedValue("56789a", i));
  const numAVals = Array.from({ length: 10 }, (_, i) => makeNumberValue("123456", i));
  const numBVals = Array.from({ length: 10 }, (_, i) => makeNumberValue("567890", i));

  it("preserves strict pairwise independence when adding or removing a third model (AC 4)", () => {
    const twoModels = new Map<string, Partial<Record<ProbeId, ProbeSampleSet>>>([
      [
        "model-a",
        {
          seed: makeSampleSet("model-a", "seed", modelAVals, 2),
          number: makeSampleSet("model-a", "number", numAVals, 1),
        },
      ],
      [
        "model-b",
        {
          seed: makeSampleSet("model-b", "seed", modelBVals, 1),
          number: makeSampleSet("model-b", "number", numBVals, 2),
        },
      ],
    ]);
    const threeModels = new Map(twoModels);
    threeModels.set("model-c", {
      seed: makeSampleSet("model-c", "seed", modelCVals, 1),
    });

    const query = { seed: [modelAVals[0]!], number: [numAVals[0]!] };
    const score2 = scoreVerificationQuery({
      declaredModel: "model-a",
      queryValuesByProbe: query,
      sampleSetsByModel: twoModels,
      selectedProbes: ["seed", "number"],
      samplesPerProbe: 10,
      valuesPerCheck: 1,
    });
    const score3 = scoreVerificationQuery({
      declaredModel: "model-a",
      queryValuesByProbe: query,
      sampleSetsByModel: threeModels,
      selectedProbes: ["seed", "number"],
      samplesPerProbe: 10,
      valuesPerCheck: 1,
    });

    const pair2 = score2.comparisons.find((c) => c.candidateModel === "model-b")!;
    const pair3 = score3.comparisons.find((c) => c.candidateModel === "model-b")!;
    assert.equal(pair2.scoreDiff, pair3.scoreDiff);
    assert.equal(pair2.threshold, pair3.threshold);
    assert.equal(score2.verdict, "consistent");
    assert.equal(score3.ranking.length, 2);

    const report = buildSelfTestReport({
      sampleSetsByModel: threeModels,
      probes: ["seed", "number"],
      samplesPerProbe: 10,
      valuesPerCheck: 1,
    });
    assert.equal(report.foldCount, 10);
    assert.ok(report.capacityCurve.length >= 2);
  });
});

describe("model-fingerprint 4-state verdict machine & closestCandidate ordering", () => {
  const baseComp = (overrides: Partial<ModelComparisonResult>): ModelComparisonResult => ({
    candidateModel: "cand-1",
    candidateAppliedEffort: "low",
    sharedProbes: ["seed"],
    probeDeltas: { seed: 0.2 },
    scoreDiff: 0.2,
    rawScoreDiff: 0.2,
    threshold: 0.1,
    distinguishable: true,
    candidateSelfSim: 0.8,
    candidateLowerBound: 0.7,
    ...overrides,
  });

  it("evaluates all 4 verdict states and 4 inconclusiveReason branches (AC 5)", () => {
    assert.equal(
      evaluateVerdictState({
        validProbes: [],
        selfSim: null,
        selfLowerBound: null,
        comparisons: [],
      }).verdict,
      "not-comparable",
    );

    const inconsistentBelowSelf = evaluateVerdictState({
      validProbes: ["seed"],
      selfSim: 0.4,
      selfLowerBound: 0.7,
      comparisons: [baseComp({ candidateModel: "cand-a", scoreDiff: -0.25, threshold: 0.1 })],
    });
    assert.equal(inconsistentBelowSelf.verdict, "inconsistent");
    assert.equal(inconsistentBelowSelf.closestCandidate, "cand-a");

    const inconsistentUnmatched = evaluateVerdictState({
      validProbes: ["seed"],
      selfSim: 0.5,
      selfLowerBound: 0.7,
      comparisons: [
        baseComp({
          candidateModel: "cand-a",
          scoreDiff: -0.25,
          threshold: 0.1,
          candidateSelfSim: 0.3,
          candidateLowerBound: 0.7,
        }),
      ],
    });
    assert.equal(inconsistentUnmatched.verdict, "inconsistent");
    assert.equal(inconsistentUnmatched.closestCandidate, null);

    assert.equal(
      evaluateVerdictState({
        validProbes: ["seed"],
        selfSim: 0.5,
        selfLowerBound: 0.7,
        comparisons: [baseComp({ scoreDiff: 0.2, threshold: 0.1 })],
      }).inconclusiveReason,
      "below-self-lower-bound",
    );
    assert.equal(
      evaluateVerdictState({
        validProbes: ["seed"],
        selfSim: 0.8,
        selfLowerBound: 0.7,
        comparisons: [],
      }).inconclusiveReason,
      "single-reference-only",
    );
    assert.equal(
      evaluateVerdictState({
        validProbes: ["seed"],
        selfSim: 0.8,
        selfLowerBound: 0.7,
        comparisons: [baseComp({ distinguishable: false, threshold: null })],
      }).inconclusiveReason,
      "candidates-indistinguishable",
    );
    assert.equal(
      evaluateVerdictState({
        validProbes: ["seed"],
        selfSim: 0.8,
        selfLowerBound: 0.7,
        comparisons: [baseComp({ scoreDiff: 0.05, threshold: 0.1 })],
      }).inconclusiveReason,
      "within-threshold-margin",
    );
  });

  it("applies deterministic 4-level total-order tie-breaking for closestCandidate (AC 5)", () => {
    const res = evaluateVerdictState({
      validProbes: ["seed", "number"],
      selfSim: 0.8,
      selfLowerBound: 0.7,
      comparisons: [
        baseComp({
          candidateModel: "model-z",
          scoreDiff: -0.3,
          sharedProbes: ["seed", "number"],
          candidateSelfSim: 0.85,
        }),
        baseComp({
          candidateModel: "model-b",
          scoreDiff: -0.3,
          sharedProbes: ["seed", "number"],
          candidateSelfSim: 0.85,
        }),
        baseComp({
          candidateModel: "model-a",
          scoreDiff: -0.3,
          sharedProbes: ["seed"],
          candidateSelfSim: 0.95,
        }),
      ],
    });
    assert.equal(res.verdict, "inconsistent");
    assert.equal(res.closestCandidate, "model-b");
  });

  it("computes balanced reqId split-half convergence alongside single-check 5th-percentile bound", () => {
    const rawValues = Array.from({ length: 20 }, (_, i) => ({
      reqId: `req-${Math.floor(i / 5)}`,
      value: makeSeedValue("0123456789abcdef", i),
    }));
    const conv = computeIntraProbeConvergence("seed", rawValues, 20, 1);
    assert.ok(conv.intraProbeSim !== null && conv.intraProbeSim > 0.9);
    assert.ok(conv.intraProbeLowerBound !== null && conv.intraProbeLowerBound <= conv.intraProbeSim);
  });

  it("reports Stage 1 self-bound pass rate as expectedConsistency for single-reference models and supports valuesPerCheckByProbe", () => {
    const seedVals = Array.from({ length: 50 }, (_, i) => makeSeedValue("0123456789abcdef", i));
    const singleModelMap = new Map([
      ["only-model", { seed: makeSampleSet("only-model", "seed", seedVals, 5) }],
    ]);
    const selfTest = buildSelfTestReport({
      sampleSetsByModel: singleModelMap,
      probes: ["seed"],
      samplesByProbe: { seed: 50 },
      valuesPerCheckByProbe: { seed: 10 },
    });
    assert.ok((selfTest.modelSelfBounds["only-model"]?.expectedConsistency ?? 0) >= 0.9);
    assert.deepEqual(selfTest.modelSelfBounds["only-model"]?.usableProbes, ["seed"]);

    const scored = scoreVerificationQuery({
      declaredModel: "only-model",
      queryValuesByProbe: { seed: seedVals.slice(0, 10) },
      sampleSetsByModel: singleModelMap,
      selectedProbes: ["seed"],
      samplesByProbe: { seed: 50 },
      valuesPerCheckByProbe: { seed: 10 },
    });
    assert.equal(scored.verdict, "inconclusive");
    assert.equal(scored.inconclusiveReason, "single-reference-only");
    assert.ok((scored.expectedConsistency ?? 0) >= 0.9);
  });
});
