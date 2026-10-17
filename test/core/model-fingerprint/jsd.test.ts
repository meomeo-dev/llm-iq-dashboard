import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildEmpiricalDistribution,
  computeJsd,
  computeJsdSimilarity,
  computeProbeSubsetScore,
  poolProbeDistributions,
} from "../../../src/core/model-fingerprint/jsd";
import { PROBES } from "../../../src/core/model-fingerprint/probes";

describe("model-fingerprint jsd math", () => {
  it("throws on empty feature list, empty distribution, or all-zero distribution", () => {
    assert.throws(() => buildEmpiricalDistribution([]), /empty/);
    const nonEmpty = buildEmpiricalDistribution(["a"]);
    assert.throws(() => computeJsd(new Map(), nonEmpty), /empty/);
    assert.throws(() => computeJsd(nonEmpty, new Map()), /empty/);
    assert.throws(() => computeJsd(new Map([["a", 0]]), nonEmpty), /empty/);
    assert.throws(() => poolProbeDistributions(PROBES.number, []), /empty/);
    const withZero = new Map([
      ["a", 1],
      ["ghost", 0],
    ]);
    assert.equal(computeJsd(nonEmpty, withZero), 0);
  });

  it("satisfies boundedness, symmetry, and analytical base-2 JSD values (AC 3)", () => {
    const distP = new Map<string, number>([
      ["a", 0.5],
      ["b", 0.5],
    ]);
    const distQ = new Map<string, number>([["a", 1.0]]);
    const distDisjoint = new Map<string, number>([["z", 1.0]]);

    assert.equal(computeJsd(distP, distP), 0);
    assert.equal(computeJsdSimilarity(distP, distP), 1);
    assert.equal(computeJsd(distQ, distDisjoint), 1);
    assert.equal(computeJsdSimilarity(distQ, distDisjoint), 0);

    const expectedJsd = 1.5 - 0.75 * Math.log2(3);
    const expectedSim = 1 - expectedJsd;
    assert.ok(Math.abs(computeJsd(distP, distQ) - expectedJsd) < 1e-12);
    assert.ok(Math.abs(computeJsdSimilarity(distP, distQ) - expectedSim) < 1e-12);
    assert.ok(Math.abs(computeJsdSimilarity(distQ, distP) - expectedSim) < 1e-12);
  });

  it("preserves non-co-occurring support split invariance (AC 3)", () => {
    const distQ = new Map<string, number>([
      ["a", 0.6],
      ["c", 0.4],
    ]);
    const distP1 = new Map<string, number>([
      ["a", 0.5],
      ["b", 0.5],
    ]);
    const distP2 = new Map<string, number>([
      ["a", 0.5],
      ["b1", 0.15],
      ["b2", 0.2],
      ["b3", 0.15],
    ]);
    const jsd1 = computeJsd(distP1, distQ);
    const jsd2 = computeJsd(distP2, distQ);
    assert.ok(Math.abs(jsd1 - jsd2) < 1e-12);
  });

  it("pools 2 granularities for seed/number/uuid and 3 granularities for palette/words", () => {
    const seedPool = poolProbeDistributions(PROBES.seed, ["seed_a1b2c3d4e5f60718"]);
    assert.equal(seedPool.segments, undefined);
    assert.equal(
      computeProbeSubsetScore(
        PROBES.seed,
        ["seed_a1b2c3d4e5f60718"],
        ["seed_a1b2c3d4e5f60718"],
      ),
      1,
    );

    const palVal = "#1a2b3c-#4d5e6f-#708192-#a3b4c5-#d6e7f8";
    const palPool = poolProbeDistributions(PROBES.palette, [palVal]);
    assert.ok(palPool.segments !== undefined);
    assert.equal(computeProbeSubsetScore(PROBES.palette, [palVal], [palVal]), 1);
  });
});
