import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { loadConfig, type AppConfig } from "../../../src/core/config";
import {
  appendSampleAttempt,
  extractValidCanonicalValues,
  listAllSampleSets,
  listCheckRecords,
  mutateSampleSetFlags,
  readCheckRecord,
  readReferenceSampleSetWithArchiveFallback,
  readSampleSet,
  resetSampleSetToArchive,
  rescoreCheckRecord,
  saveCheckRecord,
  withProbeFileLock,
} from "../../../src/core/model-fingerprint/store";
import type {
  FingerprintCheckRecord,
  ProbeAttempt,
  ProbeId,
} from "../../../src/core/model-fingerprint/types";

function makeNumberRaw(index: number): string {
  const digits = [
    "123456789012",
    "234567890123",
    "345678901234",
    "456789012345",
    "567890123456",
    "678901234567",
    "789012345678",
    "890123456789",
    "901234567891",
    "135792468013",
    "246801357924",
    "357924680135",
    "468013579246",
    "579246801357",
    "680135792468",
  ];
  const base = digits[index % digits.length]!;
  const suffix = String(100 + index).slice(-2);
  return `<answer>${base}${suffix}</answer>`;
}

function makeUuidRaw(index: number): string {
  const hex = (index + 1).toString(16).padStart(4, "0");
  return `<answer>a1b2c3d4-${hex}-4e5f-8901-23456789abcd</answer>`;
}

function makeAttempt(reqId: string, rawText: string, valuesPerCall = 1): ProbeAttempt {
  return {
    at: "2026-10-17T08:00:00.000Z",
    profile: "default",
    reqId,
    valuesPerCall,
    outcome: "ok",
    rawText,
    durationMs: 120,
    usage: { tokens: { input: 20, output: 15 }, reasoningTokens: 0, serviceTier: "standard", reportedCostUsd: null },
    estimatedCostUsd: 0.001,
    cliVersion: "codex 0.101.0",
  };
}

function buildMinimalAppConfig(): AppConfig {
  const base = loadConfig("config/pelican.example.yaml");
  return {
    ...base,
    modelFingerprint: {
      enabled: true,
      effort: "low",
      samplesPerProbe: 10,
      probes: ["number", "uuid"],
      valuesPerCheck: 1,
      checkAttempts: 3,
      targetAccuracy: 0.9,
      maxCallsFactor: 3,
      concurrency: 2,
      references: [
        { cli: "codex", model: "model-alpha" },
        { cli: "codex", model: "model-beta" },
      ],
      modelPrompts: {},
    },
  };
}

describe("model-fingerprint store.ts", () => {
  let tempDir = "";
  let prevDataDir: string | undefined;

  beforeEach(async () => {
    prevDataDir = process.env.PELICAN_DATA_DIR;
    tempDir = await mkdtemp(join(tmpdir(), "pelican-fp-store-test-"));
    process.env.PELICAN_DATA_DIR = tempDir;
  });

  afterEach(async () => {
    if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
    else process.env.PELICAN_DATA_DIR = prevDataDir;
    if (tempDir) await rm(tempDir, { recursive: true, force: true });
  });

  it("serializes concurrent appendSampleAttempt and mutateSampleSetFlags via withProbeFileLock without lost updates", async () => {
    const meta = {
      probe: "number" as ProbeId,
      cli: "codex" as const,
      model: "model-alpha",
      requestedEffort: "low" as const,
      appliedEffort: "low" as const,
      effortHonored: true,
    };

    await Promise.all(
      Array.from({ length: 12 }, (_, idx) =>
        appendSampleAttempt(meta, makeAttempt(`req-${idx}`, makeNumberRaw(idx))),
      ),
    );

    const loaded = await readSampleSet("codex", "low", "model-alpha", "number");
    assert.ok(loaded);
    assert.equal(loaded.attempts.length, 12);

    await Promise.all([
      mutateSampleSetFlags({
        cli: "codex",
        appliedEffort: "low",
        model: "model-alpha",
        probe: "number",
        exclude: ["req-0", "req-1"],
      }),
      mutateSampleSetFlags({
        cli: "codex",
        appliedEffort: "low",
        model: "model-alpha",
        probe: "number",
        exclude: ["req-2"],
      }),
    ]);

    const afterExclude = await readSampleSet("codex", "low", "model-alpha", "number");
    assert.ok(afterExclude);
    const valid = extractValidCanonicalValues(afterExclude, 10, 1);
    assert.equal(valid.length, 9);
    assert.ok(!valid.some((v) => v.reqId === "req-0" || v.reqId === "req-1" || v.reqId === "req-2"));

    const afterInclude = await mutateSampleSetFlags({
      cli: "codex",
      appliedEffort: "low",
      model: "model-alpha",
      probe: "number",
      include: ["req-1"],
    });
    assert.ok(afterInclude);
    const validRestored = extractValidCanonicalValues(afterInclude, 10, 1);
    assert.equal(validRestored.length, 10);
  });

  it("enforces strict FIFO execution order inside withProbeFileLock for the same path", async () => {
    const order: number[] = [];
    const targetPath = join(tempDir, "lock-test.json");
    await Promise.all([
      withProbeFileLock(targetPath, async () => {
        await new Promise((r) => setTimeout(r, 20));
        order.push(1);
      }),
      withProbeFileLock(targetPath, async () => {
        await new Promise((r) => setTimeout(r, 5));
        order.push(2);
      }),
      withProbeFileLock(targetPath, async () => {
        order.push(3);
      }),
    ]);
    assert.deepEqual(order, [1, 2, 3]);
  });

  it("decodes mixed valuesPerCall (1 and 5) per attempt accurately even when response has draft <answer> blocks", async () => {
    // Attempt 1: valuesPerCall=1 with draft <answer> block followed by final <answer> block
    await appendSampleAttempt(
      {
        probe: "number",
        cli: "codex",
        model: "model-mixed",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      {
        ...makeAttempt("mix-1", "Draft: <answer>123456789011</answer> Final: <answer>123456789022</answer>"),
        valuesPerCall: 1,
      },
    );
    // Attempt 2: valuesPerCall=5 with 5 single-value <answer> blocks
    await appendSampleAttempt(
      {
        probe: "number",
        cli: "codex",
        model: "model-mixed",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      {
        ...makeAttempt(
          "mix-5",
          "<answer>123456789031</answer>\n<answer>123456789032</answer>\n<answer>123456789033</answer>\n<answer>123456789034</answer>\n<answer>123456789035</answer>",
        ),
        valuesPerCall: 5,
      },
    );
    const loaded = await readSampleSet("codex", "low", "model-mixed", "number");
    assert.ok(loaded);
    // Even if active override sets valuesPerCall=1, mix-5 still extracts up to 5 values (capped by capAndSliceReferencePool at floor(10/2)=5)
    // and mix-1 picks the final block "123456789022" rather than the draft block "123456789011"
    const valid = extractValidCanonicalValues(loaded, 10, 1, {
      "codex:model-mixed": { number: { valuesPerCall: 1 } },
    });
    assert.equal(valid.length, 6);
    assert.equal(valid[0]?.value, "123456789022");
  });

  it("moves sample set to archive/ on reset and falls back to archive/ during rescore when samples/ is missing or incomplete", async () => {
    const config = buildMinimalAppConfig();
    for (let i = 0; i < 10; i += 1) {
      await appendSampleAttempt(
        {
          probe: "number",
          cli: "codex",
          model: "model-alpha",
          requestedEffort: "low",
          appliedEffort: "low",
          effortHonored: true,
        },
        makeAttempt(`a-num-${i}`, makeNumberRaw(i)),
      );
      await appendSampleAttempt(
        {
          probe: "uuid",
          cli: "codex",
          model: "model-alpha",
          requestedEffort: "low",
          appliedEffort: "low",
          effortHonored: true,
        },
        makeAttempt(`a-uuid-${i}`, makeUuidRaw(i)),
      );
      await appendSampleAttempt(
        {
          probe: "number",
          cli: "codex",
          model: "model-beta",
          requestedEffort: "low",
          appliedEffort: "low",
          effortHonored: true,
        },
        makeAttempt(`b-num-${i}`, `<answer>9876543210${String(10 + i)}</answer>`),
      );
      await appendSampleAttempt(
        {
          probe: "uuid",
          cli: "codex",
          model: "model-beta",
          requestedEffort: "low",
          appliedEffort: "low",
          effortHonored: true,
        },
        makeAttempt(`b-uuid-${i}`, `<answer>f9e8d7c6-00${String(10 + i)}-4a1b-9c2d-ef0123456789</answer>`),
      );
    }

    const allBeforeReset = await listAllSampleSets();
    assert.equal(allBeforeReset.length, 4);

    const archivePath = await resetSampleSetToArchive({
      cli: "codex",
      appliedEffort: "low",
      model: "model-alpha",
      probe: "number",
      now: new Date("2026-10-17T09:00:00.000Z"),
    });
    assert.ok(archivePath?.includes("number.20261017T090000000Z.json"));

    await appendSampleAttempt(
      {
        probe: "number",
        cli: "codex",
        model: "model-alpha",
        requestedEffort: "low",
        appliedEffort: "low",
        effortHonored: true,
      },
      makeAttempt("a-partial-0", makeNumberRaw(0)),
    );

    const fallbackRes = await readReferenceSampleSetWithArchiveFallback({
      cli: "codex",
      appliedEffort: "low",
      model: "model-alpha",
      probe: "number",
      samplesPerProbe: 10,
      valuesPerCheck: 1,
    });
    assert.equal(fallbackRes.fromArchive, true);
    assert.equal(fallbackRes.sampleSet?.attempts.length, 10);

    const checkRecord: FingerprintCheckRecord = {
      checkId: "20261017-091500-codex-default",
      createdAt: "2026-10-17T09:15:00.000Z",
      cli: "codex",
      profile: "default",
      environment: "codex-low",
      declaredModel: "model-alpha",
      requestedEffort: "low",
      appliedEffort: "low",
      effortHonored: true,
      cliVersion: "codex 0.101.0",
      selectedProbes: ["number", "uuid"],
      skippedProbes: [],
      validProbes: ["number", "uuid"],
      failedProbes: [],
      uncomparedModels: [],
      probeAttempts: {
        number: [makeAttempt("chk-num", makeNumberRaw(1))],
        uuid: [makeAttempt("chk-uuid", makeUuidRaw(1))],
      },
      probeScores: {},
      selfSim: 0.5,
      selfLowerBound: 0.4,
      expectedConsistency: 0.9,
      expectedFalseInconsistentRate: 0,
      verdict: "inconclusive",
      inconclusiveReason: "candidates-indistinguishable",
      closestCandidate: null,
      comparisons: [],
      ranking: [],
      rescores: [],
    };
    await saveCheckRecord(checkRecord);

    const listedChecks = await listCheckRecords();
    assert.equal(listedChecks.length, 1);

    const rescored = await rescoreCheckRecord(config, checkRecord.checkId);
    assert.equal(rescored.rescores.length, 1);
    assert.equal(rescored.verdict, "inconclusive");
    assert.deepEqual(rescored.rescores[0]!.validProbes, ["number", "uuid"]);
    assert.ok(rescored.rescores[0]!.selfSim !== null);

    const reloaded = await readCheckRecord(checkRecord.checkId);
    assert.equal(reloaded?.record.rescores.length, 1);
  });
});
