/**
 * 2026-11-13 代码审查修复项回归测试集：
 * 覆盖跨进程锁、请求队列 TTL 与脱敏、工作目录写出边界、串口写入错误传播、
 * AI 评审期间同步门禁、样本集按实际生效强度分桶、进度完成签名与历史日期时区偏移等。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, test } from "node:test";
import { readWrittenFile } from "@/adapters/written-files";
import { publicProgressOf } from "@/app/api/events/live-hub";
import { progressDoneSignature } from "@/app/components/run-status/useRunProgress";
import { dayOffsetLabel } from "@/app/components/timeline/zoned-time";
import { shouldRefreshViewerJudge } from "@/app/view/ArtViewerFoot";
import { acquireExecutionLock } from "@/core/active-work";
import { addDevice, listDevices, updateDevice } from "@/core/auth/devices";
import {
  appendSampleAttempt,
  listAllSampleSets,
  sampleSetFilePath,
} from "@/core/model-fingerprint/store";
import type { ProgressView } from "@/core/progress";
import {
  claimNextRequest,
  completeRequest,
  enqueueRequest,
  expirePendingRequest,
  readRequest,
} from "@/core/requests";
import { formatRunId } from "@/core/runner";
import { createSerialWriter } from "@/core/serial-writes";
import { allocateRunDir } from "@/core/store";
import { acquireDataRepoSyncLock, syncLockFilePath } from "@/core/sync/data-repo-action-lock";
import { exportRun } from "@/core/sync/export-run";
import { isJudgeOnlyUpgrade } from "@/core/sync/sync-content-check";
import { scanBuffer } from "../../scripts/check-secrets";

async function withTempDataDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "pelican-review-fix-"));
  const prev = process.env.PELICAN_DATA_DIR;
  process.env.PELICAN_DATA_DIR = dir;
  try {
    return await fn(dir);
  } finally {
    if (prev === undefined) delete process.env.PELICAN_DATA_DIR;
    else process.env.PELICAN_DATA_DIR = prev;
    await rm(dir, { recursive: true, force: true });
  }
}

describe("2026-11-13 代码审查回归测试", () => {
  test("Item #2: publicProgressOf 对未认证订阅者剥离指纹作业进度条目", () => {
    const runs = [
      { runId: "20261113T000000Z", alive: true },
      { runId: "fp-fill-20261113T000000Z", alive: true, jobKind: "fingerprint-fill" },
      { runId: "fp-check-20261113T000000Z", alive: true, jobKind: "fingerprint-check" },
    ] as unknown as ProgressView[];
    const filtered = publicProgressOf(runs);
    assert.deepEqual(
      filtered.map((r) => r.runId),
      ["20261113T000000Z"],
    );
  });

  test("Item #4: readWrittenFile 仅允许读取 allowedDirs 内的普通文件，拦截越界路径与符号链接", async () => {
    const base = await mkdtemp(join(tmpdir(), "pelican-workdir-"));
    const workdir = join(base, "work");
    const outside = join(base, "outside.svg");
    await mkdir(workdir, { recursive: true });
    await writeFile(outside, '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>');
    const inside = join(workdir, "inside.svg");
    await writeFile(inside, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>');
    const linkPath = join(workdir, "link.svg");
    await symlink(outside, linkPath);
    try {
      const startedAt = new Date(Date.now() - 5000);
      assert.equal(await readWrittenFile(outside, startedAt, [workdir]), null);
      assert.equal(await readWrittenFile(linkPath, startedAt, [workdir]), null);
      const ok = await readWrittenFile(inside, startedAt, [workdir]);
      assert.ok(ok?.content.includes("<circle"));
    } finally {
      await rm(base, { recursive: true, force: true });
    }
  });

  test("Item #5: acquireExecutionLock 跨调用互斥，allocateRunDir 同秒碰撞自动顺延秒数", async () => {
    await withTempDataDir(async () => {
      const first = await acquireExecutionLock({ kind: "run", runId: "20261113T010000Z", trigger: "manual" });
      assert.equal(first.acquired, true);
      const second = await acquireExecutionLock({ kind: "fingerprint", runId: "fp-1" });
      assert.equal(second.acquired, false);
      assert.equal(second.conflict.runId, "20261113T010000Z");
      await first.release();
      const third = await acquireExecutionLock({ kind: "fingerprint", runId: "fp-1" });
      assert.equal(third.acquired, true);
      await third.release();

      const t0 = new Date("2026-11-13T01:02:03Z");
      const a = await allocateRunDir(t0, formatRunId);
      const b = await allocateRunDir(t0, formatRunId);
      assert.equal(a.runId, "20261113T010203Z");
      assert.equal(b.runId, "20261113T010204Z");
    });
  });

  test("Items #7, #10, #14: 请求队列支持超时过期、自动跳过过期项、0o600 权限与凭据双向擦除", async () => {
    await withTempDataDir(async (dir) => {
      const r1 = await enqueueRequest("run", {
        profileCredential: { op: "set", cli: "claude", name: "p1", apiKey: "sk-secret-value" },
        githubAction: { code: "gh-oauth-code" },
      });
      const fileStat = await stat(join(dir, "requests", `${r1.id}.json`));
      assert.equal(fileStat.mode & 0o777, 0o600);

      // 超时主动置为失败后不会被认领
      const expired = await expirePendingRequest(r1.id, "等待超时");
      assert.equal(expired?.state, "failed");
      assert.equal(await claimNextRequest(), null);
      const afterExpire = await readRequest(r1.id);
      assert.equal(afterExpire?.state, "failed");
      assert.equal(afterExpire?.profileCredential?.apiKey, null);
      assert.equal(afterExpire?.githubAction?.code, null);

      // 结案后同时擦除 apiKey 与 githubAction.code
      const r2 = await enqueueRequest("profile-credential", {
        profileCredential: { op: "set", cli: "claude", name: "p2", apiKey: "sk-secret-2" },
      });
      const claimed = await claimNextRequest();
      assert.equal(claimed?.id, r2.id);
      await completeRequest(r2.id, { runId: "ok" });
      const done = await readRequest(r2.id);
      assert.equal(done?.profileCredential?.apiKey, null);
    });
  });

  test("Item #8: exportRun 在 AI 评审未收尾时跳过导出，isJudgeOnlyUpgrade 识别纯评审结论升级", async () => {
    await withTempDataDir(async (dir) => {
      const runId = "20261113T020000Z";
      const rDir = join(dir, "runs", runId);
      await mkdir(rDir, { recursive: true });
      const attempt = {
        targetId: "claude__m__high", cli: "claude", model: "m", effort: "high", appliedEffort: "high",
        effortHonored: true, promptId: "classic-v1", status: "ok", svgFile: "a.svg", rawFile: null,
        svgBytes: 50, durationMs: 1000, startedAt: "2026-11-13T02:00:00Z", finishedAt: "2026-11-13T02:01:00Z", error: null,
      };
      await writeFile(join(rDir, "run.json"), JSON.stringify({
        runId, startedAt: "2026-11-13T02:00:00Z", finishedAt: "2026-11-13T02:01:00Z",
        inProgress: false, trigger: "manual", prompts: [{ id: "classic-v1", text: "draw" }], attempts: [attempt],
      }));
      await writeFile(join(rDir, "a.svg"), '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>');
      await writeFile(join(rDir, "progress.json"), JSON.stringify({
        runId, startedAt: "2026-11-13T02:00:00Z", finishedAt: "2026-11-13T02:01:00Z", cancelledAt: null,
        lanes: [], judging: { startedAt: "2026-11-13T02:01:00Z", finishedAt: null, items: [] },
      }));
      const whileJudging = await exportRun(runId);
      assert.equal(whileJudging.status, "skipped");
      assert.equal(whileJudging.reason, "incomplete");

      await rm(join(rDir, "progress.json"));
      const firstExport = await exportRun(runId);
      assert.equal(firstExport.status, "ready");
      const targetDir = join(dir, "repo-run");
      await mkdir(targetDir, { recursive: true });
      await writeFile(join(targetDir, "run.json"), firstExport.jsonText);
      await writeFile(join(targetDir, "a.svg"), firstExport.svgFiles[0]!.content);

      const upgradedRecord = structuredClone(firstExport.publicRecord);
      upgradedRecord.attempts[0]!.judge = {
        schemaVersion: 1, rubric: { id: "r", version: 1, passThreshold: 70 },
        subject: { runId, attemptKey: "a", promptId: "classic-v1", cli: "claude", model: "m", effort: "high", svgFile: "a.svg" },
        judges: [], gates: [], criteria: [],
        total: { score: 88, maxScore: 100, verdict: "online", judgedAt: "2026-11-13T02:02:00Z" },
      };
      const isUpgrade = await isJudgeOnlyUpgrade(targetDir, {
        ...firstExport, publicRecord: upgradedRecord, jsonText: JSON.stringify(upgradedRecord, null, 2),
      });
      assert.equal(isUpgrade, true);
    });
  });

  test("Item #11 & #13: SerialWriter.drainOrThrow 传播写入异常；devices 并发写入不丢记录", async () => {
    const writer = createSerialWriter(() => {});
    writer.enqueue(async () => {
      throw new Error("disk full");
    });
    await assert.rejects(() => writer.drainOrThrow(), /disk full/);

    await withTempDataDir(async () => {
      await Promise.all(
        Array.from({ length: 6 }, (_, i) =>
          addDevice({
            id: `dev-${i}`,
            name: `设备-${i}`,
            tokenHmac: `hmac-${i}`,
            previousHmac: null,
            previousValidUntil: null,
            issuedAt: new Date().toISOString(),
            rotatedAt: new Date().toISOString(),
            lastSeenAt: new Date().toISOString(),
          }),
        ),
      );
      await Promise.all(
        Array.from({ length: 6 }, (_, i) => updateDevice(`dev-${i}`, { name: `新设备-${i}` })),
      );
      const devices = await listDevices();
      assert.equal(devices.length, 6);
      assert.ok(devices.every((d) => d.name.startsWith("新设备-")));
    });
  });

  test("Item #15: acquireDataRepoSyncLock 在已有未过期锁文件时跨进程拒绝", async () => {
    await withTempDataDir(async (dir) => {
      const lockFile = syncLockFilePath(dir);
      await mkdir(dir, { recursive: true });
      await writeFile(
        lockFile,
        JSON.stringify({ lockedAt: new Date().toISOString(), pid: 999999, token: "other-proc" }),
      );
      const res = await acquireDataRepoSyncLock(dir);
      assert.equal(res.acquired, false);
      const content = JSON.parse(await readFile(lockFile, "utf8")) as { token: string };
      assert.equal(content.token, "other-proc");
    });
  });

  test("Item #18: 模型指纹样本集按实际生效强度（appliedEffort）分桶落盘与读取", async () => {
    await withTempDataDir(async () => {
      await appendSampleAttempt(
        {
          probe: "uuid",
          cli: "claude",
          model: "model-a",
          requestedEffort: "xhigh",
          appliedEffort: "high",
          effortHonored: false,
        },
        {
          reqId: "req-1",
          at: "2026-11-13T00:00:00Z",
          profile: "default",
          valuesPerCall: 1,
          outcome: "ok",
          durationMs: 1000,
          rawText: "550e8400-e29b-41d4-a716-446655440000",
          usage: null,
          estimatedCostUsd: null,
          cliVersion: "1.0.0",
        },
      );
      assert.ok(sampleSetFilePath("claude", "high", "model-a", "uuid").includes("claude-high"));
      const highSets = await listAllSampleSets({ cli: "claude", appliedEffort: "high" });
      assert.equal(highSets.length, 1);
      assert.equal(highSets[0]?.requestedEffort, "xhigh");
      assert.equal(highSets[0]?.appliedEffort, "high");
      const xhighSets = await listAllSampleSets({ cli: "claude", appliedEffort: "xhigh" });
      assert.equal(xhighSets.length, 0);
    });
  });

  test("Item #20, #21, #23: 密钥扫描二进制缓冲、进度完成签名、裁判完成自动刷新与历史时区偏移", () => {
    const fakeSecret = `${"sk-ant-"}api03-AbCdEfGhIjKlMnOpQrStUvWxYz123456`;
    const hits = scanBuffer("leak.ts", Buffer.from(`const key = "${fakeSecret}";\n`));
    assert.equal(hits.length, 1);

    const runA = [{ runId: "r1", lanes: [{ calls: [{ targetId: "t1", promptId: "p1", state: "done" }] }] }] as unknown as ProgressView[];
    const runB = [{ runId: "r1", lanes: [{ calls: [{ targetId: "t2", promptId: "p1", state: "done" }] }] }] as unknown as ProgressView[];
    assert.notEqual(progressDoneSignature(runA), progressDoneSignature(runB));

    assert.equal(shouldRefreshViewerJudge("running", null), true);
    assert.equal(shouldRefreshViewerJudge("queued", null), true);
    assert.equal(shouldRefreshViewerJudge("running", "running"), false);
    assert.equal(shouldRefreshViewerJudge(null, null), false);

    // 美东夏令时（7月 UTC-4）与冬令时（1月 UTC-5）及切换日
    assert.equal(dayOffsetLabel("2026-07-15", "America/New_York"), "UTC−4");
    assert.equal(dayOffsetLabel("2026-01-15", "America/New_York"), "UTC−5");
    assert.equal(dayOffsetLabel("2026-03-08", "America/New_York"), "UTC−5 → UTC−4");
  });
});
