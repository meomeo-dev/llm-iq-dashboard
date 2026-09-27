/**
 * 探测命令的失败说明：优先用 CLI 自己报的 "Error: …" 行，其次才是 Node 的 "Command failed"。
 * 用 node 本身充当被探测的命令，测试不依赖任何 CLI。
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { runProbeCommand } from "@/capabilities/probe-command";

describe("runProbeCommand", () => {
  test("命令非零退出且输出里有 Error: 行时，失败说明取该行", async () => {
    const script = 'console.log("Fetching…"); console.log("Error: Eligibility check failed: Post https://x"); process.exit(1)';
    const result = await runProbeCommand("node", ["-e", script]);
    assert.equal(result.ok, true);
    assert.equal(result.error, "node 探测失败：Eligibility check failed: Post https://x");
  });

  test("没有 Error: 行时退回 Command failed 的第一行", async () => {
    const result = await runProbeCommand("node", ["-e", "process.exit(2)"]);
    assert.equal(result.ok, false);
    assert.match(result.error ?? "", /^node 探测失败：Command failed/);
  });

  test("可执行文件不存在时标记 notFound", async () => {
    const result = await runProbeCommand("llm-iq-no-such-binary", []);
    assert.equal(result.notFound, true);
    assert.equal(result.error, "llm-iq-no-such-binary 不在 PATH 中");
  });
});
