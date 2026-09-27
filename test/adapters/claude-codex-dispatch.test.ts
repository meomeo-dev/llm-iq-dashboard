/**
 * Claude 与 Codex 适配器调度参数的基本测试（零额度消耗）：
 * 验证对含输入参考图的题目的参数拼装、努力程度传递与考场工具约束。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { buildClaudeArgs } from "@/adapters/claude";
import { buildTurnParams } from "@/adapters/codex";
import type { AgentRequest } from "@/adapters/types";
/** 带输入参考图的题面样例：Markdown 图片嵌入 + 图片链接 */
const IMAGE_PROMPT_TEMPLATE = [
  "请参考以下输入的图片，生成对应的 SVG 插画：",
  "",
  "![参考图](https://example.com/reference.png)",
].join("\n");
import type { Target } from "@/core/types";

const mockTargetClaude: Target = {
  id: "claude__claude-sonnet-5__low",
  cli: "claude",
  model: "claude-sonnet-5",
  effort: "low",
  label: "Claude Sonnet 5 · low",
  timeoutMs: 300_000,
  extraArgs: [],
  enabled: true,
};

const mockTargetCodex: Target = {
  id: "codex__gpt-6-luna__high",
  cli: "codex",
  model: "gpt-6-luna",
  effort: "high",
  label: "Codex gpt-6-luna · high",
  timeoutMs: 600_000,
  extraArgs: [],
  enabled: true,
};

test("Claude 适配器：正确组装含参考图的提示词及 CLI 参数", () => {
  const request: AgentRequest = {
    target: mockTargetClaude,
    promptText: IMAGE_PROMPT_TEMPLATE,
    workdir: "/tmp/mock-workdir",
    appliedEffort: "low",
    effortAdjustable: true,
    timeoutMs: 300_000,
  };

  const args = buildClaudeArgs(request);

  // 验证基础命令行结构
  assert.equal(args[0], "-p");
  assert.equal(args[1], IMAGE_PROMPT_TEMPLATE);
  assert.ok(args[1].includes("![参考图]"), "提示词参数未包含输入图片的 Markdown 语法");
  assert.ok(args[1].includes("https://example.com/reference.png"), "提示词参数未包含图片链接");

  // 验证模型与思考强度
  const modelIdx = args.indexOf("--model");
  assert.ok(modelIdx !== -1);
  assert.equal(args[modelIdx + 1], "claude-sonnet-5");

  const effortIdx = args.indexOf("--effort");
  assert.ok(effortIdx !== -1);
  assert.equal(args[effortIdx + 1], "low");

  // 验证禁用外部工具约束
  const toolsIdx = args.indexOf("--tools");
  assert.ok(toolsIdx !== -1);
  assert.equal(args[toolsIdx + 1], "");
});

test("Codex 适配器：正确组装 turn/start 参数与含参考图的输入数据", () => {
  const request: AgentRequest = {
    target: mockTargetCodex,
    promptText: IMAGE_PROMPT_TEMPLATE,
    workdir: "/tmp/mock-workdir",
    appliedEffort: "high",
    effortAdjustable: true,
    timeoutMs: 600_000,
  };

  const params = buildTurnParams("th_test_12345", request);

  assert.equal(params.threadId, "th_test_12345");
  assert.equal(params.effort, "high");

  // 验证 input 结构
  const input = params.input as Array<{ type: string; text: string }>;
  assert.ok(Array.isArray(input));
  assert.equal(input.length, 1);
  const first = input[0];
  assert.ok(first !== undefined);
  assert.equal(first.type, "text");
  assert.equal(first.text, IMAGE_PROMPT_TEMPLATE);
  assert.ok(first.text.includes("https://example.com/reference.png"), "Codex 输入未包含图片链接");
});

test("Codex 适配器：当模型不可调时不传递 effort", () => {
  const request: AgentRequest = {
    target: mockTargetCodex,
    promptText: "Test prompt",
    workdir: "/tmp/mock-workdir",
    appliedEffort: "low",
    effortAdjustable: false,
    timeoutMs: 600_000,
  };

  const params = buildTurnParams("th_test_12345", request);
  assert.equal(params.effort, undefined, "不可调模型不应传递 effort 字段");
});
