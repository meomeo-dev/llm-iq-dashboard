/**
 * 轮次导出与脱敏处理（export-run）测试。
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { exportRun } from "@/core/sync/export-run";
import { leakGuardFromText } from "@/core/leak-guard";

describe("export-run 轮次导出与脱敏", () => {
  let runsDir: string;

  beforeEach(async () => {
    runsDir = await mkdtemp(join(tmpdir(), "llm-iq-export-runs-"));
  });

  afterEach(async () => {
    await rm(runsDir, { recursive: true, force: true });
  });

  it("缺 run.json 或仍在进行中（inProgress=true）的轮次标记为 skipped:incomplete", async () => {
    const runIdIncomplete = "20260927T021708Z";
    await mkdir(join(runsDir, runIdIncomplete), { recursive: true });

    // 缺 run.json
    const resMissing = await exportRun(runIdIncomplete, { runsDir });
    assert.equal(resMissing.status, "skipped");
    if (resMissing.status === "skipped") {
      assert.equal(resMissing.reason, "incomplete");
    }

    // inProgress: true
    await writeFile(
      join(runsDir, runIdIncomplete, "run.json"),
      JSON.stringify({ runId: runIdIncomplete, inProgress: true, attempts: [] }),
    );
    const resInProgress = await exportRun(runIdIncomplete, { runsDir });
    assert.equal(resInProgress.status, "skipped");
    if (resInProgress.status === "skipped") {
      assert.equal(resInProgress.reason, "incomplete");
    }
  });

  it("支持旧版记录（顶层 promptId/promptText）规范化", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });

    const legacyRun = {
      runId,
      promptId: "classic-v1",
      promptText: "Draw a pelican",
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual",
      attempts: [
        {
          targetId: "claude__claude-sonnet-5__low",
          cli: "claude",
          model: "claude-sonnet-5",
          effort: "low",
          label: "Claude Sonnet 5",
          status: "ok",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
          usage: null,
        },
      ],
    };
    await writeFile(join(dir, "run.json"), JSON.stringify(legacyRun));

    const res = await exportRun(runId, { runsDir });
    assert.equal(res.status, "ready");
    if (res.status === "ready") {
      assert.equal(res.publicRecord.publicSchemaVersion, 1);
      assert.equal(res.publicRecord.inProgress, false);
      assert.equal(res.publicRecord.prompts[0]?.promptId, "classic-v1");
      assert.equal(res.publicRecord.prompts[0]?.text, "Draw a pelican");
      assert.equal(res.publicRecord.attempts[0]?.appliedEffort, "low");
      assert.equal(res.publicRecord.attempts[0]?.effortHonored, true);
      assert.equal(res.publicRecord.attempts[0]?.rawFile, null);
    }
  });

  it("usage 回填：已有值优先保留，缺失时从同名 .txt 解析", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });

    // 写入一个带 usage 事件的 claude 转录 .txt
    const transcriptText = [
      '{"type":"progress","content":"working"}',
      '{"type":"result","usage":{"input_tokens":120,"output_tokens":80,"cache_read_input_tokens":0}}',
    ].join("\n");
    await writeFile(
      join(dir, "claude__claude-sonnet-5__low__classic-v1.txt"),
      transcriptText,
    );

    const runRecord = {
      runId,
      prompts: [{ promptId: "classic-v1", text: "prompt", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule",
      inProgress: false,
      attempts: [
        // 1. 缺失 usage，需要从 .txt 回填
        {
          targetId: "claude__claude-sonnet-5__low",
          promptId: "classic-v1",
          cli: "claude",
          model: "claude-sonnet-5",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "Claude Sonnet 5",
          status: "ok",
          svgFile: null,
          rawFile: "claude__claude-sonnet-5__low__classic-v1.txt",
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
        },
        // 2. 已有显式 null，保持 null，不读 .txt
        {
          targetId: "agy__gemini-3.8-flash__low",
          promptId: "classic-v1",
          cli: "agy",
          model: "gemini-3.8-flash",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "Gemini",
          status: "ok",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: null,
          usage: null,
        },
      ],
    };
    await writeFile(join(dir, "run.json"), JSON.stringify(runRecord));

    const res = await exportRun(runId, { runsDir });
    assert.equal(res.status, "ready");
    if (res.status === "ready") {
      const att1 = res.publicRecord.attempts[0];
      assert.ok(att1?.usage !== null && att1?.usage !== undefined);
      assert.equal(att1.usage.tokens.input, 120);
      assert.equal(att1.usage.tokens.output, 80);
      assert.equal(att1.rawFile, null);

      const att2 = res.publicRecord.attempts[1];
      assert.equal(att2?.usage, null);
      assert.equal(att2?.rawFile, null);
    }
  });

  it("SVG 命中泄漏扫描被脱敏拦截：svgFile 置 null，记录 redaction", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });

    const cleanSvg = '<svg viewBox="0 0 100 100"><circle r="50"/></svg>';
    const leakedSvg =
      '<svg><!-- Generated at /Users/developer/project/file.svg --><circle r="50"/></svg>';

    await writeFile(join(dir, "clean.svg"), cleanSvg);
    await writeFile(join(dir, "leaked.svg"), leakedSvg);

    const runRecord = {
      runId,
      prompts: [{ promptId: "classic-v1", text: "prompt", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule",
      inProgress: false,
      attempts: [
        {
          targetId: "clean_target",
          promptId: "classic-v1",
          cli: "claude",
          model: "claude-sonnet-5",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "clean",
          status: "ok",
          svgFile: "clean.svg",
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 100,
          error: null,
          usage: null,
        },
        {
          targetId: "leaked_target",
          promptId: "classic-v1",
          cli: "agy",
          model: "gemini-3.8-flash",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "leaked",
          status: "ok",
          svgFile: "leaked.svg",
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: 100,
          error: null,
          usage: null,
        },
      ],
    };
    await writeFile(join(dir, "run.json"), JSON.stringify(runRecord));

    const res = await exportRun(runId, { runsDir });
    assert.equal(res.status, "ready");
    if (res.status === "ready") {
      assert.equal(res.publicRecord.attempts[0]?.svgFile, "clean.svg");
      assert.equal(res.publicRecord.attempts[1]?.svgFile, null);
      assert.deepEqual(res.publicRecord.redactions, [
        { file: "leaked.svg", reason: "local-path" },
      ]);
      assert.equal(res.svgFiles.length, 1);
      assert.equal(res.svgFiles[0]?.filename, "clean.svg");
    }
  });

  it("run.json 本机路径替换为 ~ ；若包含密钥或指纹则整轮拒绝发布", async () => {
    const runId = "20260927T021708Z";
    const dir = join(runsDir, runId);
    await mkdir(dir, { recursive: true });

    // 1. 仅包含本机路径，可被替换为 ~，顺利发布
    const runWithPath = {
      runId,
      prompts: [{ promptId: "classic-v1", text: "prompt", bindings: {} }],
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "schedule",
      inProgress: false,
      attempts: [
        {
          targetId: "claude__test",
          promptId: "classic-v1",
          cli: "claude",
          model: "claude-sonnet-5",
          effort: "low",
          appliedEffort: "low",
          effortHonored: true,
          label: "test",
          status: "error",
          svgFile: null,
          rawFile: null,
          startedAt: "2026-09-27T02:17:09.000Z",
          finishedAt: "2026-09-27T02:17:40.000Z",
          durationMs: 31000,
          svgBytes: null,
          error: "Failed to read /Users/tester/secret-dir/log.txt",
          usage: null,
        },
      ],
    };
    await writeFile(join(dir, "run.json"), JSON.stringify(runWithPath));
    const resPath = await exportRun(runId, { runsDir });
    assert.equal(resPath.status, "ready");
    if (resPath.status === "ready") {
      assert.ok(!resPath.jsonText.includes("/Users/tester/"));
      assert.ok(resPath.jsonText.includes("~/secret-dir/log.txt"));
      assert.equal(
        resPath.publicRecord.attempts[0]?.error,
        "Failed to read ~/secret-dir/log.txt",
      );
    }

    // 2. 包含 secret-pattern 令牌，整轮被拒绝
    runWithPath.attempts[0]!.error =
      "Auth failure: ghp_123456789012345678901234567890123456";
    await writeFile(join(dir, "run.json"), JSON.stringify(runWithPath));
    const resSecret = await exportRun(runId, { runsDir });
    assert.equal(resSecret.status, "rejected");
    if (resSecret.status === "rejected") {
      assert.deepEqual(resSecret.reasons, [
        { file: "run.json", reason: "secret-pattern" },
      ]);
    }

    // 3. 命中 leakGuard 指纹，整轮被拒绝
    const leakGuard = leakGuardFromText(["my-special-private-token-1234567890"]);
    runWithPath.attempts[0]!.error =
      "Error with my-special-private-token-1234567890 inside";
    await writeFile(join(dir, "run.json"), JSON.stringify(runWithPath));
    const resGuard = await exportRun(runId, { runsDir, leakGuard });
    assert.equal(resGuard.status, "rejected");
    if (resGuard.status === "rejected") {
      assert.deepEqual(resGuard.reasons, [
        { file: "run.json", reason: "leak-guard" },
      ]);
    }
  });
});

describe("永不发布的题目", () => {
  let runsDir: string;

  beforeEach(async () => {
    runsDir = await mkdtemp(join(tmpdir(), "llm-iq-export-unpublishable-"));
  });

  afterEach(async () => {
    await rm(runsDir, { recursive: true, force: true });
  });

  function attemptFor(promptId: string) {
    return {
      targetId: "agy__m__high",
      promptId,
      cli: "agy",
      model: "m",
      effort: "high",
      appliedEffort: "high",
      effortHonored: true,
      label: "M",
      status: "no-svg",
      svgFile: null,
      rawFile: null,
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      svgBytes: null,
      error: null,
      usage: null,
    };
  }

  async function writeRun(runId: string, promptIds: string[]): Promise<void> {
    await mkdir(join(runsDir, runId), { recursive: true });
    const run = {
      runId,
      prompts: promptIds.map((promptId) => ({ promptId, text: `题面 ${promptId}`, bindings: {} })),
      startedAt: "2026-09-27T02:17:08.000Z",
      finishedAt: "2026-09-27T02:18:00.000Z",
      durationMs: 52000,
      trigger: "manual",
      inProgress: false,
      attempts: promptIds.map(attemptFor),
    };
    await writeFile(join(runsDir, runId, "run.json"), JSON.stringify(run));
  }

  it("整轮只含测试题时跳过，不产出任何公开内容", async () => {
    await writeRun("20260927T021708Z", ["leijun-v1"]);
    const result = await exportRun("20260927T021708Z", { runsDir });
    assert.equal(result.status, "skipped");
    if (result.status === "skipped") assert.equal(result.reason, "unpublishable-prompt");
  });

  it("混合轮次剔除测试题的题面与调用，其余照常导出", async () => {
    await writeRun("20260927T021708Z", ["classic-v1", "leijun-v1"]);
    const result = await exportRun("20260927T021708Z", { runsDir });
    assert.equal(result.status, "ready");
    if (result.status !== "ready") return;
    assert.deepEqual(result.publicRecord.prompts.map((p) => p.promptId), ["classic-v1"]);
    assert.deepEqual(result.publicRecord.attempts.map((a) => a.promptId), ["classic-v1"]);
    assert.equal(result.jsonText.includes("leijun"), false);
  });
});
