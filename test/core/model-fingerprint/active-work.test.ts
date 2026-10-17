import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { describeActiveWorkConflict, findActiveWork } from "../../../src/core/active-work";
import {
  createFingerprintJobTracker,
  findActiveFingerprintJob,
  listRecentFingerprintJobs,
  requestFingerprintJobCancel,
  watchFingerprintJobCancel,
} from "../../../src/core/model-fingerprint/job";
import { runDir } from "../../../src/core/paths";
import { processStartMark } from "../../../src/core/process-identity";
import { findActiveRun, type RunProgress } from "../../../src/core/progress";
import { writeJsonPathAtomic } from "../../../src/core/store";

describe("Fingerprint job tracking & active-work mutual exclusion", () => {
  it("tracks fingerprint job lifecycle and preserves findActiveRun() contract", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-active-work-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    try {
      assert.equal(await findActiveFingerprintJob(), null);
      assert.equal(await findActiveWork(), null);

      const tracker = await createFingerprintJobTracker({
        jobId: "20261017T100000Z",
        kind: "fill",
        totalEstimatedCalls: 8,
      });

      await tracker.markProgress({
        completedCalls: 3,
        failedCalls: 1,
        currentTarget: "codex / gpt-5.4",
        currentProbe: "uuid",
      });

      const activeJob = await findActiveFingerprintJob();
      assert.notEqual(activeJob, null);
      assert.equal(activeJob?.jobId, "20261017T100000Z");
      assert.equal(activeJob?.completedCalls, 3);
      assert.equal(activeJob?.failedCalls, 1);
      assert.equal(activeJob?.currentProbe, "uuid");
      assert.equal(activeJob?.alive, true);

      // findActiveRun() must remain null when only a fingerprint job is running
      assert.equal(await findActiveRun(), null);

      const activeWork = await findActiveWork();
      assert.deepEqual(activeWork, {
        runId: "20261017T100000Z",
        kind: "fingerprint",
      });
      assert.equal(
        describeActiveWorkConflict(activeWork!),
        "模型指纹作业正在执行（20261017T100000Z）",
      );

      await tracker.finish({ checkId: "20261017-100000-codex-default" });
      assert.equal(await findActiveFingerprintJob(), null);
      assert.equal(await findActiveWork(), null);

      const recent = await listRecentFingerprintJobs();
      assert.equal(recent.length, 1);
      assert.equal(recent[0]?.alive, false);
      assert.equal(recent[0]?.checkId, "20261017-100000-codex-default");
    } finally {
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("propagates cancel.json to watchFingerprintJobCancel", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-job-cancel-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    try {
      const tracker = await createFingerprintJobTracker({
        jobId: "20261017T110000Z",
        kind: "check",
        totalEstimatedCalls: 6,
      });

      let abortFired = false;
      const watch = watchFingerprintJobCancel("20261017T110000Z", 20);
      watch.signal.addEventListener("abort", () => {
        abortFired = true;
      });

      try {
        const req = await requestFingerprintJobCancel("20261017T110000Z");
        assert.equal(typeof req.requestedAt, "string");
        for (let i = 0; i < 30 && !watch.signal.aborted; i += 1) {
          await new Promise((resolve) => setTimeout(resolve, 15));
        }
        assert.equal(watch.signal.aborted, true);
        assert.equal(abortFired, true);
      } finally {
        watch.stop();
        await tracker.finish();
      }
    } finally {
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("detects active pelican runs including AI judging phase in findActiveWork()", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-run-judging-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    try {
      const runId = "20261017T120000Z";
      const progressRecord: RunProgress = {
        runId,
        trigger: "manual",
        startedAt: "2026-10-17T12:00:00.000Z",
        updatedAt: "2026-10-17T12:01:00.000Z",
        // Sampling finished, but AI judging is still running (finishedAt: null)
        finishedAt: "2026-10-17T12:01:00.000Z",
        pid: process.pid,
        pidStart: processStartMark(process.pid),
        laneLimit: 2,
        lanes: [],
        judging: {
          startedAt: "2026-10-17T12:01:00.000Z",
          finishedAt: null,
          items: [
            {
              attemptKey: "codex-gpt-5.4__classic-v1",
              targetId: "codex-gpt-5.4",
              promptId: "classic-v1",
              state: "running",
              startedAt: "2026-10-17T12:01:01.000Z",
              durationMs: null,
              verdict: null,
              score: null,
              note: null,
            },
          ],
        },
      };
      await writeJsonPathAtomic(join(runDir(runId), "progress.json"), progressRecord);

      const activeWork = await findActiveWork();
      assert.deepEqual(activeWork, {
        runId,
        kind: "run",
        trigger: "manual",
      });
      assert.equal(describeActiveWorkConflict(activeWork!), `已有一轮正在执行（手动 ${runId}）`);
    } finally {
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });

  it("handles PELICAN_RUNNER=external fresh vs stale heartbeat for fingerprint jobs", async () => {
    const tempDataDir = await mkdtemp(join(tmpdir(), "pelican-test-ext-runner-"));
    const prevDataDir = process.env.PELICAN_DATA_DIR;
    const prevRunner = process.env.PELICAN_RUNNER;
    process.env.PELICAN_DATA_DIR = tempDataDir;
    process.env.PELICAN_RUNNER = "external";
    try {
      const tracker = await createFingerprintJobTracker({
        jobId: "20261017T130000Z-fp-ext",
        kind: "fill",
        totalEstimatedCalls: 5,
      });
      const snap = tracker.snapshot();

      // Fresh heartbeat covering the job's pid & pidStart
      const nowIso = new Date().toISOString();
      await writeJsonPathAtomic(join(tempDataDir, "runner.json"), {
        pid: snap.pid,
        pidStart: snap.pidStart ?? null,
        startedAt: nowIso,
        heartbeatAt: nowIso,
      });
      const activeWithFreshBeat = await findActiveWork();
      assert.equal(activeWithFreshBeat?.kind, "fingerprint");
      assert.equal(activeWithFreshBeat?.runId, "20261017T130000Z-fp-ext");

      // Stale heartbeat (> 45s old) -> treated as orphan
      const staleIso = new Date(Date.now() - 120_000).toISOString();
      await writeJsonPathAtomic(join(tempDataDir, "runner.json"), {
        pid: snap.pid,
        pidStart: snap.pidStart ?? null,
        startedAt: staleIso,
        heartbeatAt: staleIso,
      });
      assert.equal(await findActiveFingerprintJob(), null);
      assert.equal(await findActiveWork(), null);
    } finally {
      if (prevRunner === undefined) delete process.env.PELICAN_RUNNER;
      else process.env.PELICAN_RUNNER = prevRunner;
      if (prevDataDir === undefined) delete process.env.PELICAN_DATA_DIR;
      else process.env.PELICAN_DATA_DIR = prevDataDir;
      await rm(tempDataDir, { recursive: true, force: true });
    }
  });
});
