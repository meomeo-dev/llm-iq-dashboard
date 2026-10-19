import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { AgentReply, AgentRequest, SessionPool } from "../../../src/adapters/index";
import { runModelFingerprintCli } from "../../../src/bin/model-fingerprint";
import { loadConfig, type AppConfig } from "../../../src/core/config";
import type { LeakGuard } from "../../../src/core/leak-guard";
import {
  executeFingerprintCheck,
  executeFingerprintCheckBatch,
  executeFingerprintFill,
  type CollectDeps,
} from "../../../src/core/model-fingerprint/collect";
import {
  readFingerprintJob,
  requestFingerprintJobCancel,
} from "../../../src/core/model-fingerprint/job";
import {
  extractValidCanonicalValues,
  listCheckRecords,
  readSampleSet,
} from "../../../src/core/model-fingerprint/store";
import { fingerprintWorkdir } from "../../../src/core/paths";

function makeDistinctNumber(itemIdx: number): string {
  const digits = "12345678901234567890";
  const rot = itemIdx % 9;
  return digits.slice(rot, rot + 10) + String(1000 + itemIdx);
}

function makeDistinctUuid(itemIdx: number): string {
  const hex = (itemIdx + 1).toString(16).padStart(4, "0");
  return `a1b2c3d4-${hex}-4e5f-8901-23456789abcd`;
}

function makeBatchNumbersAnswer(callIdx: number, count = 5): string {
  const lines = Array.from({ length: count }, (_, k) => makeDistinctNumber(callIdx * 10 + k));
  return `<answer>\n${lines.join("\n")}\n</answer>`;
}

function makeBatchUuidsAnswer(callIdx: number, count = 5): string {
  const lines = Array.from({ length: count }, (_, k) => makeDistinctUuid(callIdx * 10 + k));
  return `<answer>\n${lines.join("\n")}\n</answer>`;
}

function buildTestAppConfig(): AppConfig {
  const base = loadConfig("config/pelican.example.yaml");
  return {
    ...base,
    modelFingerprint: {
      enabled: true,
      effort: "low",
      samplesPerProbe: 10,
      probes: ["number", "uuid"],
      valuesPerCheck: 1,
      checkAttempts: 2,
      targetAccuracy: 0.9,
      maxCallsFactor: 3,
      concurrency: 4,
      references: [
        { cli: "codex", model: "ref-model-1" },
        { cli: "codex", model: "ref-model-2" },
      ],
      modelPrompts: {},
    },
  };
}

interface FakeCallRecord {
  cli: string;
  profile: string;
  model: string;
  promptText: string;
  concurrentAtStart: number;
}

function createCountingFakePool(
  respond: (req: AgentRequest, callIndex: number) => Promise<Partial<AgentReply>> | Partial<AgentReply>,
): {
  pool: SessionPool;
  calls: FakeCallRecord[];
  maxObservedConcurrency: number;
} {
  const calls: FakeCallRecord[] = [];
  let inFlight = 0;
  let maxObservedConcurrency = 0;

  const pool: SessionPool = {
    sessionFor(cli, profile = "default") {
      return {
        cli,
        async ask(req: AgentRequest): Promise<AgentReply> {
          inFlight += 1;
          maxObservedConcurrency = Math.max(maxObservedConcurrency, inFlight);
          const idx = calls.length;
          calls.push({
            cli: req.target.cli,
            profile,
            model: req.target.model,
            promptText: req.promptText,
            concurrentAtStart: inFlight,
          });
          try {
            const custom = await respond(req, idx);
            return {
              text: custom.text ?? makeBatchNumbersAnswer(idx, 5),
              writtenFiles: custom.writtenFiles ?? [],
              transcript:
                custom.transcript ??
                JSON.stringify({
                  type: "turn.completed",
                  usage: { input_tokens: 25, output_tokens: 12 },
                }),
              timedOut: custom.timedOut ?? false,
              error: custom.error ?? null,
              notes: custom.notes ?? [],
              effortHonored: custom.effortHonored ?? true,
            };
          } finally {
            inFlight -= 1;
          }
        },
        async close() {},
      };
    },
    async closeAll() {},
  };

  return {
    pool,
    calls,
    get maxObservedConcurrency() {
      return maxObservedConcurrency;
    },
  };
}

function buildFakeCollectDeps(
  pool: SessionPool,
  canaryMarker?: string,
): Partial<CollectDeps> {
  const guard: LeakGuard = {
    size: canaryMarker ? 1 : 0,
    hits: (text: string) => Boolean(canaryMarker && text.includes(canaryMarker)),
  };
  return {
    openSessionPool: () => pool,
    resolveCliVersion: async (cli) => `${cli} 1.2.3-test`,
    buildLeakGuard: async () => guard,
    loadPriceCatalog: () => null,
    loadCapabilityCatalog: async () => null,
  };
}

describe("model-fingerprint collect.ts and src/bin/model-fingerprint.ts", () => {
  let tempDir = "";
  let prevDataDir: string | undefined;

  beforeEach(async () => {
    prevDataDir = process.env.PELICAN_DATA_DIR;
    tempDir = await mkdtemp(join(tmpdir(), "pelican-fp-collect-test-"));
    process.env.PELICAN_DATA_DIR = tempDir;
  });

  afterEach(async () => {
    if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
    else process.env.PELICAN_DATA_DIR = prevDataDir;
    if (tempDir) await rm(tempDir, { recursive: true, force: true });
  });

  it("executes targeted single-model fill without touching other reference models, and supports exclude/include delta fill", async () => {
    const config = buildTestAppConfig();
    config.modelFingerprint = {
      ...config.modelFingerprint!,
      modelPrompts: {
        "codex:custom-new-model": {
          number: { valuesPerCall: 1 },
        },
      },
    };
    const fake = createCountingFakePool((_req, idx) => ({
      text: `<answer>${makeDistinctNumber(idx)}</answer>`,
    }));
    const collectDeps = buildFakeCollectDeps(fake.pool);

    // 1. Targeted single-model trial fill (--count 3) for custom-new-model (valuesPerCall=1 -> 3 calls)
    const trialLines: string[] = [];
    await runModelFingerprintCli(
      ["fill", "--cli", "codex", "--model", "custom-new-model", "--probes", "number", "--count", "3", "--yes"],
      {
        loadConfig: async () => config,
        collectDeps,
        writeLine: (l) => trialLines.push(l),
      },
    );
    assert.equal(fake.calls.length, 3);
    assert.ok(fake.calls.every((c) => c.model === "custom-new-model"));

    // Verify ref-model-1 and ref-model-2 were never touched
    assert.equal(await readSampleSet("codex", "low", "ref-model-1", "number"), null);
    assert.equal(await readSampleSet("codex", "low", "ref-model-2", "number"), null);

    // 2. Fill remaining 7 samples for custom-new-model to reach 10/10 (7 calls)
    await runModelFingerprintCli(
      ["fill", "--cli", "codex", "--model", "custom-new-model", "--probes", "number", "--yes"],
      {
        loadConfig: async () => config,
        collectDeps,
        writeLine: () => {},
      },
    );
    assert.equal(fake.calls.length, 10);
    const fullSet = await readSampleSet("codex", "low", "custom-new-model", "number");
    assert.ok(fullSet);
    assert.equal(
      extractValidCanonicalValues(fullSet, 10, 1, config.modelFingerprint.modelPrompts).length,
      10,
    );

    // 3. Exclude 2 samples with --count 0 (0 CLI calls, only disk flag update)
    const excludedIds = [fullSet.attempts[0]!.reqId, fullSet.attempts[1]!.reqId];
    const callsBeforeCountZero = fake.calls.length;
    await runModelFingerprintCli(
      [
        "fill",
        "--cli",
        "codex",
        "--model",
        "custom-new-model",
        "--probes",
        "number",
        "--exclude",
        excludedIds.join(","),
        "--count",
        "0",
      ],
      {
        loadConfig: async () => config,
        collectDeps,
        writeLine: () => {},
      },
    );
    assert.equal(fake.calls.length, callsBeforeCountZero);
    const afterExcludeSet = await readSampleSet("codex", "low", "custom-new-model", "number");
    assert.ok(afterExcludeSet);
    assert.equal(
      extractValidCanonicalValues(afterExcludeSet, 10, 1, config.modelFingerprint.modelPrompts).length,
      8,
    );

    // 4. Subsequent fill only collects the 2 missing values (delta fill = 2 calls, not 10)
    await runModelFingerprintCli(
      ["fill", "--cli", "codex", "--model", "custom-new-model", "--probes", "number", "--yes"],
      {
        loadConfig: async () => config,
        collectDeps,
        writeLine: () => {},
      },
    );
    assert.equal(fake.calls.length, callsBeforeCountZero + 2);
  });

  it("pre-reserves inFlight * valuesPerCall and runs first call serially for cache warm-up", async () => {
    const config = buildTestAppConfig();
    const fake = createCountingFakePool(async (_req, idx) => {
      await new Promise((r) => setTimeout(r, 15));
      return { text: makeBatchNumbersAnswer(idx, 5) };
    });
    const collectDeps = buildFakeCollectDeps(fake.pool);

    const res = await executeFingerprintFill(
      config,
      { cli: "codex", model: "ref-model-1", probes: ["number"] },
      collectDeps,
    );
    // 10 needed values / 5 valuesPerCall = 2 calls (despite concurrency = 4)
    assert.equal(res.callsExecuted, 2);
    assert.equal(fake.calls.length, 2);
    assert.equal(fake.calls[0]!.concurrentAtStart, 1);
  });

  it("clears fingerprintWorkdir before job start and after wroteFile, and strips rawText on leak-blocked", async () => {
    const config = buildTestAppConfig();
    const canaryVal = "SUPER_SECRET_CREDENTIAL_VALUE_999";
    const workdir = fingerprintWorkdir();
    await mkdir(workdir, { recursive: true });
    await writeFile(join(workdir, "stale.txt"), "stale", "utf8");

    const fake = createCountingFakePool(async (_req, idx) => {
      if (idx === 0) {
        await writeFile(join(workdir, "rogue.txt"), "rogue", "utf8");
        return {
          text: `${makeBatchNumbersAnswer(0, 5)} ${canaryVal}`,
          writtenFiles: [{ path: join(workdir, "rogue.txt"), content: "" }],
        };
      }
      if (idx === 1) {
        return { text: "", notes: ["agy 触发被禁工具：run_command"] };
      }
      return { text: makeBatchNumbersAnswer(idx, 5) };
    });
    const collectDeps = buildFakeCollectDeps(fake.pool, canaryVal);

    await executeFingerprintFill(
      config,
      { cli: "codex", model: "ref-model-1", probes: ["number"], count: 5 },
      collectDeps,
    );

    const remainingFiles = await readdir(workdir);
    assert.deepEqual(remainingFiles, []);

    const sampleSet = await readSampleSet("codex", "low", "ref-model-1", "number");
    assert.ok(sampleSet);
    const leakedAttempt = sampleSet.attempts[0]!;
    assert.equal(leakedAttempt.outcome, "leak-blocked");
    assert.equal(leakedAttempt.rawText, "");
    assert.equal(leakedAttempt.wroteFile, true);
    assert.equal(sampleSet.attempts[1]?.wroteFile, true);
  });

  it("enforces --reset triple requirement and executes status, self-test, check, and rescore with 0 unintended CLI calls", async () => {
    const config = buildTestAppConfig();
    const fake = createCountingFakePool((req, idx) => {
      if (req.promptText.includes("UUID")) {
        return { text: makeBatchUuidsAnswer(idx, 5) };
      }
      return { text: makeBatchNumbersAnswer(idx, 5) };
    });
    const collectDeps = buildFakeCollectDeps(fake.pool);

    await assert.rejects(
      () =>
        runModelFingerprintCli(["fill", "--reset", "--cli", "codex"], {
          loadConfig: async () => config,
          collectDeps,
        }),
      /--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,\.\.\.>/,
    );

    // Check before any reference samples exist -> rejects before confirm and prompts fingerprint:fill
    let confirmCalled = false;
    await assert.rejects(
      () =>
        runModelFingerprintCli(["check", "--cli", "codex", "--declared", "ref-model-1"], {
          loadConfig: async () => config,
          collectDeps,
          confirm: async () => {
            confirmCalled = true;
            return true;
          },
          writeLine: () => {},
        }),
      /pnpm fingerprint:fill/,
    );
    assert.equal(confirmCalled, false);
    assert.equal(fake.calls.length, 0);

    // Fill 2 models * 2 probes * (10 values / 5 valuesPerCall = 2 calls) = 8 calls
    await runModelFingerprintCli(["fill", "--yes"], {
      loadConfig: async () => config,
      collectDeps,
      writeLine: () => {},
    });
    const callsAfterFill = fake.calls.length;
    assert.equal(callsAfterFill, 8);

    await runModelFingerprintCli(
      ["fill", "--cli", "codex", "--model", "ref-model-1", "--probes", "number", "--reset", "--dry-run"],
      { loadConfig: async () => config, collectDeps, writeLine: () => {} },
    );
    await runModelFingerprintCli(
      ["check", "--cli", "codex", "--model", "ref-model-1", "--effort", "low", "--probe", "uuid", "--dry-run"],
      { loadConfig: async () => config, collectDeps, writeLine: () => {} },
    );
    assert.equal(fake.calls.length, callsAfterFill);

    const statusLines: string[] = [];
    await runModelFingerprintCli(["status", "--cli", "agy", "--model", "gemini-3.8-flash", "--effort", "low"], {
      loadConfig: async () => config,
      collectDeps,
      writeLine: (l) => statusLines.push(l),
    });
    assert.ok(statusLines.some((l) => l.includes("目标 10 条/探针，强度=low")));
    assert.ok(statusLines.some((l) => l.includes("gemini-3.8-flash")));
    await runModelFingerprintCli(["self-test"], {
      loadConfig: async () => config,
      collectDeps,
      writeLine: () => {},
    });
    assert.equal(fake.calls.length, callsAfterFill);

    const checkRecord = await executeFingerprintCheck(
      config,
      { cli: "codex", model: "ref-model-1" },
      collectDeps,
    );
    assert.equal(fake.calls.length, callsAfterFill + 2);
    assert.deepEqual(checkRecord.validProbes, ["number", "uuid"]);

    const callsBeforeRescore = fake.calls.length;
    await assert.rejects(
      () =>
        runModelFingerprintCli(["rescore", checkRecord.checkId], {
          loadConfig: async () => config,
          collectDeps,
          writeLine: () => {},
        }),
      /模型指纹历史核验重算回填命令（rescore）已停用/,
    );
    assert.equal(fake.calls.length, callsBeforeRescore);
  });

  it("executes multi-target check batch in a single job with combined lanes and totalEstimatedCalls, and handles cancellation", async () => {
    const config = buildTestAppConfig();
    const fake = createCountingFakePool(async (req, idx) => {
      await new Promise((r) => setTimeout(r, 10));
      return {
        text: req.promptText.includes("UUID") ? makeBatchUuidsAnswer(idx, 5) : makeBatchNumbersAnswer(idx, 5),
      };
    });
    const collectDeps = buildFakeCollectDeps(fake.pool);

    await executeFingerprintFill(config, {}, collectDeps);

    let startedJobId = "";
    const batchRecords = await executeFingerprintCheckBatch(
      config,
      {
        cli: "codex",
        model: "ref-model-1",
        targets: [
          { cli: "codex", model: "ref-model-1" },
          { cli: "codex", model: "ref-model-2" },
        ],
        onStarted: (jobId) => {
          startedJobId = jobId;
        },
      },
      collectDeps,
    );

    assert.equal(batchRecords.length, 2);
    assert.notEqual(batchRecords[0]!.checkId, batchRecords[1]!.checkId);
    assert.equal(batchRecords[0]!.createdAt, batchRecords[1]!.createdAt, "batch checks share identical createdAt for swimlane column alignment");
    const completedJob = await readFingerprintJob(startedJobId);
    assert.ok(completedJob);
    assert.equal(completedJob.totalEstimatedCalls, 4);
    assert.equal(completedJob.completedCalls, 4);
    assert.equal(completedJob.lanes?.length, 2);
    assert.deepEqual(completedJob.checkIds, batchRecords.map((r) => r.checkId));

    // Mid-flight cancellation skips saving incomplete check records and marks remaining calls cancelled
    let cancelJobId = "";
    const slowFake = createCountingFakePool(async (req, idx) => {
      if (idx === 0 && cancelJobId) {
        await requestFingerprintJobCancel(cancelJobId);
      }
      await new Promise((r) => setTimeout(r, 35));
      return {
        text: req.promptText.includes("UUID") ? makeBatchUuidsAnswer(idx, 5) : makeBatchNumbersAnswer(idx, 5),
      };
    });
    const checksBeforeCancel = (await listCheckRecords(20)).length;
    const cancelledRecords = await executeFingerprintCheckBatch(
      config,
      {
        cli: "codex",
        model: "ref-model-1",
        targets: [
          { cli: "codex", model: "ref-model-1" },
          { cli: "codex", model: "ref-model-2" },
        ],
        onStarted: (id) => {
          cancelJobId = id;
        },
      },
      buildFakeCollectDeps(slowFake.pool),
    );
    assert.equal(cancelledRecords.length, 0);
    assert.equal((await listCheckRecords(20)).length, checksBeforeCancel);
    const cancelledJob = await readFingerprintJob(cancelJobId);
    assert.ok(cancelledJob);
    assert.ok(cancelledJob.cancelledAt !== null);
  });
});
