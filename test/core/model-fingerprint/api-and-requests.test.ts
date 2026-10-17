/**
 * 模型指纹第 2 期后端集成测试（api-and-requests.test.ts）：
 * 覆盖 GET/POST /api/fingerprint、PATCH /api/fingerprint/samples 鉴权与只读展台保护、
 * 活跃工作 409 冲突拦截、样本单条剔除/恢复与归档重置、config-writer 注释保留写回、
 * 分容器请求队列以及 live-hub SSE 监听过滤规则。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { isWatchedPath } from "@/app/api/events/live-hub";
import { GET, POST } from "@/app/api/fingerprint/route";
import { PATCH } from "@/app/api/fingerprint/samples/route";
import { ACTION_HEADER } from "@/core/auth/guard";
import { issueSession, SESSION_COOKIE } from "@/core/auth/session";
import { loadConfig } from "@/core/config";
import { applyConfigPatch } from "@/core/config-writer";
import { createFingerprintJobTracker } from "@/core/model-fingerprint/job";
import { saveCheckRecord, saveSampleSet } from "@/core/model-fingerprint/store";
import type { FingerprintCheckRecord, ProbeAttempt, ProbeSampleSet } from "@/core/model-fingerprint/types";
import { claimNextRequest, enqueueRequest } from "@/core/requests";

function makeNumberAttempt(index: number, value: string): ProbeAttempt {
  return {
    at: new Date(1760000000000 + index * 1000).toISOString(),
    profile: "default",
    reqId: `req-${String(index).padStart(2, "0")}`,
    valuesPerCall: 1,
    outcome: "ok",
    rawText: `<answer>${value}</answer>`,
    durationMs: 120,
    usage: null,
    estimatedCostUsd: 0.0005,
    cliVersion: "codex 0.101.0",
  };
}

function makeSampleSet(model: string, values: readonly string[]): ProbeSampleSet {
  return {
    probe: "number",
    cli: "codex",
    environment: "codex-low",
    model,
    requestedEffort: "low",
    appliedEffort: "low",
    effortHonored: true,
    attempts: values.map((v, idx) => makeNumberAttempt(idx + 1, v)),
  };
}

describe("Model Fingerprint Web API, Config Writer, Requests & Live-Hub", () => {
  let rootDir = "";
  let dataDir = "";
  let cfgFile = "";
  let sessionCookie = "";
  const originalEnv = { ...process.env };

  before(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "pelican-fp-api-test-"));
    dataDir = join(rootDir, "data");
    cfgFile = join(rootDir, "pelican.config.yaml");
    await mkdir(dataDir, { recursive: true });
    process.env.PELICAN_DATA_DIR = dataDir;
    process.env.PELICAN_CONFIG = cfgFile;
    const issued = await issueSession("test-fp-owner-device");
    sessionCookie = issued.cookie;
  });

  after(async () => {
    process.env = { ...originalEnv };
    if (rootDir) await rm(rootDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    delete process.env.PELICAN_READONLY;
    delete process.env.PELICAN_DATA_SOURCE;
    delete process.env.PELICAN_RUNNER;
    await rm(dataDir, { recursive: true, force: true });
    await mkdir(dataDir, { recursive: true });
    const issued = await issueSession("test-fp-owner-device");
    sessionCookie = issued.cookie;

    const initialYaml = `# 顶部保留注释
schedule:
  cron: null
  intervalMinutes: null
run:
  promptIds:
    - classic-v1
targets:
  - id: codex-gpt-5-5
    label: GPT 5.5
    cli: codex
    model: gpt-5.5
    effort: low
modelFingerprint:
  enabled: true
  effort: low
  samplesPerProbe: 10
  probes:
    - number
  valuesPerCheck: 1
  checkAttempts: 3
  targetAccuracy: 0.95
  maxCallsFactor: 3
  concurrency: 2
  references:
    - cli: codex
      model: gpt-5.5
`;
    await writeFile(cfgFile, initialYaml, "utf8");
  });

  function ownerHeaders(withAction = false): HeadersInit {
    return {
      cookie: `${SESSION_COOKIE}=${sessionCookie}`,
      ...(withAction ? { [ACTION_HEADER]: "1", "content-type": "application/json" } : {}),
    };
  }

  it("enforces requireOwner, requireOwnerAction, and readonly/remote showcase rejection (AC 13)", async () => {
    const unauthGet = await GET(new Request("http://127.0.0.1:3000/api/fingerprint"));
    assert.equal(unauthGet.status, 401);

    const unauthPost = await POST(
      new Request("http://127.0.0.1:3000/api/fingerprint", {
        method: "POST",
        body: JSON.stringify({ action: "plan" }),
      }),
    );
    assert.equal(unauthPost.status, 401);

    const noActionPost = await POST(
      new Request("http://127.0.0.1:3000/api/fingerprint", {
        method: "POST",
        headers: ownerHeaders(false),
        body: JSON.stringify({ action: "plan" }),
      }),
    );
    assert.equal(noActionPost.status, 403);

    const noActionPatch = await PATCH(
      new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
        method: "PATCH",
        headers: ownerHeaders(false),
        body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", reset: true }),
      }),
    );
    assert.equal(noActionPatch.status, 403);

    process.env.PELICAN_READONLY = "1";
    const roGet = await GET(new Request("http://127.0.0.1:3000/api/fingerprint", { headers: ownerHeaders(false) }));
    assert.equal(roGet.status, 403);
    const roPost = await POST(
      new Request("http://127.0.0.1:3000/api/fingerprint", {
        method: "POST",
        headers: ownerHeaders(true),
        body: JSON.stringify({ action: "plan" }),
      }),
    );
    assert.equal(roPost.status, 403);

    delete process.env.PELICAN_READONLY;
    process.env.PELICAN_DATA_SOURCE = "remote";
    const remoteGet = await GET(
      new Request("http://127.0.0.1:3000/api/fingerprint", { headers: ownerHeaders(false) }),
    );
    assert.equal(remoteGet.status, 403);
    const remotePatch = await PATCH(
      new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
        method: "PATCH",
        headers: ownerHeaders(true),
        body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", reset: true }),
      }),
    );
    assert.equal(remotePatch.status, 403);
  });

  it("supports GET snapshot, GET cell sample detail, and PATCH exclude/include/reset (AC 8, AC 13)", async () => {
    const values = [
      "123456789012",
      "123456789013",
      "123456789014",
      "123456789015",
      "123456789016",
      "123456789017",
      "123456789018",
      "123456789019",
      "123456789021",
      "123456789023",
    ];
    await saveSampleSet(makeSampleSet("gpt-5.5", values));

    const snapRes = await GET(
      new Request("http://127.0.0.1:3000/api/fingerprint", { headers: ownerHeaders(false) }),
    );
    assert.equal(snapRes.status, 200);
    const snap = (await snapRes.json()) as {
      matrix: Array<{ cli: string; model: string; usableProbes: string[] }>;
    };
    assert.equal(snap.matrix.length, 1);
    assert.deepEqual(snap.matrix[0]!.usableProbes, ["number"]);

    const cellRes = await GET(
      new Request("http://127.0.0.1:3000/api/fingerprint?cli=codex&model=gpt-5.5&probe=number", {
        headers: ownerHeaders(false),
      }),
    );
    assert.equal(cellRes.status, 200);
    const cell = (await cellRes.json()) as {
      gap: { validValues: number; missingValues: number };
      attempts: Array<{ reqId: string; excluded: boolean; sampleSelfSim: number | null }>;
    };
    assert.equal(cell.gap.validValues, 10);
    assert.equal(cell.gap.missingValues, 0);
    assert.equal(cell.attempts.length, 10);
    assert.equal(typeof cell.attempts[0]!.sampleSelfSim, "number");

    const excludeRes = await PATCH(
      new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
        method: "PATCH",
        headers: ownerHeaders(true),
        body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", exclude: ["req-01", "req-02"] }),
      }),
    );
    assert.equal(excludeRes.status, 200);
    const afterExclude = (await excludeRes.json()) as { gap: { validValues: number; missingValues: number } };
    assert.equal(afterExclude.gap.validValues, 8);
    assert.equal(afterExclude.gap.missingValues, 2);

    const includeRes = await PATCH(
      new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
        method: "PATCH",
        headers: ownerHeaders(true),
        body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", include: ["req-01"] }),
      }),
    );
    assert.equal(includeRes.status, 200);
    const afterInclude = (await includeRes.json()) as { gap: { validValues: number; missingValues: number } };
    assert.equal(afterInclude.gap.validValues, 9);
    assert.equal(afterInclude.gap.missingValues, 1);

    const resetRes = await PATCH(
      new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
        method: "PATCH",
        headers: ownerHeaders(true),
        body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", reset: true }),
      }),
    );
    assert.equal(resetRes.status, 200);
    const afterReset = (await resetRes.json()) as {
      archivePath: string | null;
      gap: { validValues: number; missingValues: number };
    };
    assert.ok(afterReset.archivePath && afterReset.archivePath.includes("archive"));
    assert.equal(afterReset.gap.validValues, 0);
    assert.equal(afterReset.gap.missingValues, 10);
  });

  it("returns 409 Conflict on POST fill/check and PATCH samples when a fingerprint job is active (AC 11, AC 13)", async () => {
    await saveSampleSet(
      makeSampleSet("gpt-5.5", [
        "123456789012",
        "123456789013",
        "123456789014",
        "123456789015",
        "123456789016",
        "123456789017",
        "123456789018",
        "123456789019",
        "123456789021",
        "123456789023",
      ]),
    );
    const tracker = await createFingerprintJobTracker({ kind: "fill", totalEstimatedCalls: 5 });

    try {
      const patchRes = await PATCH(
        new Request("http://127.0.0.1:3000/api/fingerprint/samples", {
          method: "PATCH",
          headers: ownerHeaders(true),
          body: JSON.stringify({ cli: "codex", model: "gpt-5.5", probe: "number", exclude: ["req-01"] }),
        }),
      );
      assert.equal(patchRes.status, 409);

      const fillRes = await POST(
        new Request("http://127.0.0.1:3000/api/fingerprint", {
          method: "POST",
          headers: ownerHeaders(true),
          body: JSON.stringify({ action: "fill", cli: "codex", model: "gpt-5.5", probes: ["number"] }),
        }),
      );
      assert.equal(fillRes.status, 409);

      const checkRes = await POST(
        new Request("http://127.0.0.1:3000/api/fingerprint", {
          method: "POST",
          headers: ownerHeaders(true),
          body: JSON.stringify({ action: "check", cli: "codex", model: "gpt-5.5", probes: ["number"] }),
        }),
      );
      assert.equal(checkRes.status, 409);

      const cancelRes = await POST(
        new Request("http://127.0.0.1:3000/api/fingerprint", {
          method: "POST",
          headers: ownerHeaders(true),
          body: JSON.stringify({ action: "cancel" }),
        }),
      );
      assert.equal(cancelRes.status, 200);
      const cancelJson = (await cancelRes.json()) as { ok: boolean; jobId: string };
      assert.equal(cancelJson.ok, true);
      assert.equal(cancelJson.jobId, tracker.jobId);
    } finally {
      await tracker.finish({});
    }
  });

  it("supports POST plan and POST rescore with 0 CLI calls (AC 2, AC 13)", async () => {
    await saveSampleSet(
      makeSampleSet("gpt-5.5", [
        "123456789012",
        "123456789013",
        "123456789014",
        "123456789015",
        "123456789016",
        "123456789017",
        "123456789018",
        "123456789019",
        "123456789021",
        "123456789023",
      ]),
    );
    await saveSampleSet(
      makeSampleSet("gpt-6-mini", [
        "987650123411",
        "987650123412",
        "987650123413",
        "987650123414",
        "987650123415",
        "987650123416",
        "987650123417",
        "987650123418",
        "987650123419",
        "987650123421",
      ]),
    );

    const planRes = await POST(
      new Request("http://127.0.0.1:3000/api/fingerprint", {
        method: "POST",
        headers: ownerHeaders(true),
        body: JSON.stringify({ action: "plan", mode: "check", cli: "codex", model: "gpt-5.5", probes: ["number"] }),
      }),
    );
    assert.equal(planRes.status, 200);
    const planJson = (await planRes.json()) as { ok: boolean; mode: string; checkPlan: { executableProbes: unknown[] } };
    assert.equal(planJson.ok, true);
    assert.equal(planJson.mode, "check");
    assert.equal(planJson.checkPlan.executableProbes.length, 1);

    const checkRecord: FingerprintCheckRecord = {
      checkId: "20261017-090000-codex-default",
      createdAt: "2026-10-17T09:00:00.000Z",
      cli: "codex",
      profile: "default",
      environment: "codex-low",
      declaredModel: "gpt-5.5",
      requestedEffort: "low",
      appliedEffort: "low",
      effortHonored: true,
      cliVersion: "codex 0.101.0",
      selectedProbes: ["number"],
      skippedProbes: [],
      validProbes: ["number"],
      failedProbes: [],
      probeAttempts: {
        number: [makeNumberAttempt(1, "123456789014")],
      },
      selfSim: 0.5,
      selfLowerBound: 0.3,
      expectedConsistency: 0.9,
      expectedFalseInconsistentRate: 0.05,
      verdict: "consistent",
      inconclusiveReason: null,
      closestCandidate: null,
      ranking: [{ model: "gpt-5.5", meanSim: 0.5 }],
      comparisons: [],
      uncomparedModels: [],
      probeScores: { number: { "gpt-5.5": 0.5 } },
      rescores: [],
    };
    await saveCheckRecord(checkRecord);

    const rescoreRes = await POST(
      new Request("http://127.0.0.1:3000/api/fingerprint", {
        method: "POST",
        headers: ownerHeaders(true),
        body: JSON.stringify({ action: "rescore", checkId: checkRecord.checkId }),
      }),
    );
    assert.equal(rescoreRes.status, 200);
    const rescoreJson = (await rescoreRes.json()) as { ok: boolean; record: FingerprintCheckRecord };
    assert.equal(rescoreJson.ok, true);
    assert.equal(rescoreJson.record.rescores.length, 1);
  });

  it("preserves YAML comments on applyConfigPatch for modelFingerprint and queues split-container requests", async () => {
    await applyConfigPatch(cfgFile, {
      modelFingerprint: {
        enabled: false,
        effort: "medium",
        samplesPerProbe: 20,
        probes: ["uuid", "palette"],
        valuesPerCheck: 2,
        checkAttempts: 4,
        targetAccuracy: 0.95,
        maxCallsFactor: 3,
        concurrency: 4,
        references: [{ cli: "claude", model: "claude-opus-4-6" }],
        modelPrompts: {
          "claude:claude-opus-4-6": {
            palette: { valuesPerCall: 5 },
          },
        },
      },
    });

    const rawText = await readFile(cfgFile, "utf8");
    assert.ok(rawText.includes("# 顶部保留注释"));
    const reloaded = loadConfig(cfgFile);
    assert.equal(reloaded.modelFingerprint?.enabled, false);
    assert.equal(reloaded.modelFingerprint?.effort, "medium");
    assert.equal(reloaded.modelFingerprint?.samplesPerProbe, 20);
    assert.deepEqual(reloaded.modelFingerprint?.probes, ["uuid", "palette"]);
    assert.equal(reloaded.modelFingerprint?.valuesPerCheck, 2);
    assert.equal(reloaded.modelFingerprint?.references[0]?.model, "claude-opus-4-6");
    assert.equal(
      reloaded.modelFingerprint?.modelPrompts?.["claude:claude-opus-4-6"]?.palette?.valuesPerCall,
      5,
    );

    const fillReq = await enqueueRequest("fingerprint-fill", {
      fingerprintFill: {
        cli: "codex",
        model: "gpt-5.5",
        probes: ["uuid"],
        count: 5,
      },
    });
    const claimed1 = await claimNextRequest();
    assert.equal(claimed1?.id, fillReq.id);
    assert.equal(claimed1?.kind, "fingerprint-fill");
    assert.equal(claimed1?.fingerprintFill?.model, "gpt-5.5");

    const checkReq = await enqueueRequest("fingerprint-check", {
      fingerprintCheck: {
        cli: "codex",
        profile: "default",
        model: "gpt-5.5",
        probes: ["uuid"],
      },
    });
    const claimed2 = await claimNextRequest();
    assert.equal(claimed2?.id, checkReq.id);
    assert.equal(claimed2?.kind, "fingerprint-check");
    assert.equal(claimed2?.fingerprintCheck?.model, "gpt-5.5");
  });

  it("watches model-fingerprint/jobs/<jobId>.json while ignoring samples/, archive/, checks/, .cancel.json, and .staging", () => {
    const oldest = "20261001T000000Z";
    assert.equal(isWatchedPath("model-fingerprint", oldest), true);
    assert.equal(isWatchedPath("model-fingerprint/jobs", oldest), true);
    assert.equal(isWatchedPath("model-fingerprint/jobs/20261017-090000-fill.json", oldest), true);

    assert.equal(isWatchedPath("model-fingerprint/jobs/20261017-090000-fill.cancel.json", oldest), false);
    assert.equal(isWatchedPath("model-fingerprint/jobs/20261017-090000-fill.json.staging.1234", oldest), false);
    assert.equal(isWatchedPath("model-fingerprint/samples", oldest), false);
    assert.equal(isWatchedPath("model-fingerprint/samples/codex-low/gpt-5.5/uuid.json", oldest), false);
    assert.equal(isWatchedPath("model-fingerprint/archive", oldest), false);
    assert.equal(isWatchedPath("model-fingerprint/checks", oldest), false);
  });
});
