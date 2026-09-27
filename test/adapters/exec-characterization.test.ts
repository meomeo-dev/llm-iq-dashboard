/**
 * 子进程执行器特征测试（Exec Characterization Tests）
 *
 * 覆盖 exec.ts 中即将重构的各项函数：
 * 1. execStreaming 正常流式输出逐行回调、标准输出/错误收集、退出码
 * 2. execStreaming 超时退出与 timedOut 标记
 * 3. execStreaming 不存在的 binary 抛错
 * 4. composeTranscript 拼接格式
 * 5. LineSplitter 换行切分与 flush
 */

import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { composeTranscript, execStreaming, LineSplitter } from "@/adapters/exec";

test("execStreaming: 正常执行命令并流式收集输出", async () => {
  const lines: string[] = [];
  const outcome = await execStreaming(
    { binary: "node", args: ["-e", "console.log('line 1'); console.log('line 2');"] },
    {
      cwd: tmpdir(),
      timeoutMs: 5000,
      onLine: (line) => lines.push(line),
    },
  );

  assert.equal(outcome.exitCode, 0);
  assert.equal(outcome.timedOut, false);
  assert.equal(outcome.stdout.trim(), "line 1\nline 2");
  assert.equal(outcome.stderr, "");
  assert.deepEqual(lines, ["line 1", "line 2"]);
});

test("execStreaming: 收集 stderr 并返回非 0 退出码", async () => {
  const outcome = await execStreaming(
    { binary: "node", args: ["-e", "console.error('some error message'); process.exit(42);"] },
    {
      cwd: tmpdir(),
      timeoutMs: 5000,
      onLine: () => {},
    },
  );

  assert.equal(outcome.exitCode, 42);
  assert.equal(outcome.timedOut, false);
  assert.equal(outcome.stderr.trim(), "some error message");
});

test("execStreaming: 超时触发后退出码为 null 且 timedOut 为 true", async () => {
  const outcome = await execStreaming(
    { binary: "sleep", args: ["10"] },
    {
      cwd: tmpdir(),
      timeoutMs: 150,
      onLine: () => {},
    },
  );

  assert.equal(outcome.timedOut, true);
  assert.equal(outcome.exitCode, null);
});

test("execStreaming: 不存在的命令抛出启动失败异常", async () => {
  await assert.rejects(
    async () => {
      await execStreaming(
        { binary: "non_existent_binary_xyz_12345", args: [] },
        {
          cwd: tmpdir(),
          timeoutMs: 1000,
          onLine: () => {},
        },
      );
    },
    /无法启动 non_existent_binary_xyz_12345/,
  );
});

test("composeTranscript: 组合标准输出与标准错误", () => {
  assert.equal(composeTranscript({ stdout: "only stdout", stderr: "" }), "only stdout");
  assert.equal(
    composeTranscript({ stdout: "stdout content", stderr: "stderr content" }),
    "stdout content\n===== stderr =====\nstderr content",
  );
});

test("LineSplitter: 正确切分跨块数据并在 flush 时交付尾行", () => {
  const collected: string[] = [];
  const splitter = new LineSplitter((l) => collected.push(l));

  splitter.push("hello ");
  splitter.push("world\nsecond line");
  splitter.push("\nthird line");
  splitter.flush();

  assert.deepEqual(collected, ["hello world", "second line", "third line"]);
});
