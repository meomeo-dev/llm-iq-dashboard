/**
/**
 * 提示词系统特征测试（Prompt Characterization Tests）
 *
 * 在重构前锁定 prompt.ts 和 prompt-schema.ts 的所有行为：
 * 1. resolvePrompt: 对所有内置提示词与前沿单题的解析
 * 2. resolvePromptStandard: 各种重载、候选回目标准匹配与回退分支
 * 3. promptLifecycle: 各时间与状态分支
 * 4. buildRegistry / listPrompts: 注册表构建、不可变保护与自定义题目校验
 * 5. schema 边界与校验器行为
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUILTIN_PROMPTS,
  FRONTIER_INDIVIDUAL_PROMPT_MAP,
  buildRegistry,
  listPrompts,
  promptLifecycle,
  resolvePrompt,
  resolvePromptStandard,
  type PromptSpec,
} from "@/core/prompt";

test("resolvePrompt: 全量 44 道内置题目均能被正向解析且属性完备", () => {
  assert.equal(BUILTIN_PROMPTS.length, 44);
  for (const builtin of BUILTIN_PROMPTS) {
    const resolved = resolvePrompt(builtin.id);
    assert.equal(resolved.id, builtin.id);
    assert.equal(resolved.label, builtin.label);
    assert.equal(resolved.template, builtin.template);
    assert.equal(resolved.immutable, true);
    assert.equal(resolved.verified, true);
  }
});

test("resolvePrompt: 全量 140 道前沿单题均能从映射表中检索解析", () => {
  assert.equal(FRONTIER_INDIVIDUAL_PROMPT_MAP.size, 140);
  for (const [id, expected] of FRONTIER_INDIVIDUAL_PROMPT_MAP.entries()) {
    const resolved = resolvePrompt(id);
    assert.equal(resolved.id, id);
    assert.equal(resolved.label, expected.label);
    assert.equal(resolved.template, expected.template);
    assert.ok(resolved.standard !== null && resolved.standard !== undefined);
  }
});

test("resolvePrompt: 从套题 candidates 中派生子题目", () => {
  // 名著套题
  const shuihu003 = resolvePrompt("shuihu-003");
  assert.equal(shuihu003.id, "shuihu-003");
  assert.ok(shuihu003.label.includes("第3回"));
  assert.equal(shuihu003.immutable, true);

  // 前沿套题候选
  const feAi01 = resolvePrompt("FE-AI-01");
  assert.equal(feAi01.id, "FE-AI-01");
  assert.ok(feAi01.template.includes("SVG"));
  assert.ok(feAi01.standard !== null);
});

test("resolvePrompt: 未知 promptId 抛出包含候选列表的清晰错误", () => {
  assert.throws(
    () => resolvePrompt("non-existent-prompt-id"),
    /未知的 promptId "non-existent-prompt-id"，已登记的提示词：/,
  );
});

test("resolvePromptStandard: 各种重载与标准查找逻辑", () => {
  // 1. 顶层带 standard 的单题
  const classicStandard = resolvePromptStandard("classic-v1");
  assert.ok(classicStandard !== null);
  assert.equal(classicStandard.coreKey, "非训练集分布（OOD）构图与主体部件关联");

  // 2. 套题带 bindings（匹配 candidate.label）
  const shuihuStandard = resolvePromptStandard("shuihu-v1", { 回目: "第1回 张天师祈禳瘟疫 洪太尉误走妖魔" });
  assert.ok(shuihuStandard !== null);

  // 3. 套题带 bindings（匹配 candidate.id）
  const feAiStandard = resolvePromptStandard("fe-ai-v1", { candidate: "FE-AI-01" });
  assert.ok(feAiStandard !== null);
  assert.ok(feAiStandard.coreKey.length > 0);

  // 4. 重载签名：bindingsOrCustom 为 PromptSpec 数组
  const customSpec: PromptSpec = {
    id: "custom-with-std",
    label: "Custom",
    template: "Generate an SVG test",
    variables: [],
    candidates: [],
    source: null,
    verified: false,
    immutable: false,
    standard: {
      coreKey: "测试考点",
      groundTruth: "测试参考标准 Ground Truth 说明",
      evaluationCriteria: "测试判断依据 Evaluation Criteria",
    },
  };
  const customStandard = resolvePromptStandard("custom-with-std", [customSpec]);
  assert.ok(customStandard !== null);
  assert.equal(customStandard.coreKey, "测试考点");

  // 5. 不存在的题目返回 null 而非抛错
  const unknownStandard = resolvePromptStandard("completely-unknown-id");
  assert.equal(unknownStandard, null);
});

test("promptLifecycle: 生命周期与题龄计算覆盖各分支", () => {
  // 经典题为 legacy
  const classic = resolvePrompt("classic-v1");
  const classicLife = promptLifecycle(classic, new Date("2026-09-27T00:00:00Z"));
  assert.equal(classicLife.status, "legacy");
  assert.equal(classicLife.originDate, "2024-07");
  assert.ok(classicLife.originAgeText?.includes("年前"));

  // 2026 年新题为 active
  const clock = resolvePrompt("clock-v1");
  const clockLife = promptLifecycle(clock, new Date("2026-09-27T00:00:00Z"));
  assert.equal(clockLife.status, "active");
  assert.equal(clockLife.collectedAgeText, "1 天前");

  // 当天收录为“今天收录”
  const todaySpec: PromptSpec = {
    ...clock,
    registeredAt: "2026-09-27",
  };
  const todayLife = promptLifecycle(todaySpec, new Date("2026-09-27T10:00:00Z"));
  assert.equal(todayLife.collectedAgeText, "今天收录");

  // 超过 180 天的非 legacy 题为 aging
  const agingSpec: PromptSpec = {
    ...clock,
    id: "aging-prompt",
    registeredAt: "2025-01-01",
  };
  const agingLife = promptLifecycle(agingSpec, new Date("2026-09-27T00:00:00Z"));
  assert.equal(agingLife.status, "aging");
  assert.ok(agingLife.collectedAgeText?.includes("个月前"));

  // 无日期时的空分支
  const noDateSpec: PromptSpec = {
    id: "no-date",
    label: "No Date",
    template: "Generate SVG",
    variables: [],
    candidates: [],
    source: null,
    verified: false,
    immutable: false,
  };
  const noDateLife = promptLifecycle(noDateSpec);
  assert.equal(noDateLife.originDate, null);
  assert.equal(noDateLife.registeredAt, null);
  assert.equal(noDateLife.originAgeText, null);
  assert.equal(noDateLife.collectedAgeText, null);
  assert.equal(noDateLife.status, "active");
});

test("buildRegistry 与 listPrompts: 合并、覆盖检查与自定义题目", () => {
  const custom: PromptSpec = {
    id: "my-custom-prompt",
    label: "我的自定义题目",
    template: "Generate an SVG of something",
    variables: [],
    candidates: [],
    source: null,
    verified: false,
    immutable: false,
  };

  const reg = buildRegistry([custom]);
  assert.ok(reg.has("my-custom-prompt"));
  assert.ok(reg.has("classic-v1"));

  const list = listPrompts([custom]);
  assert.ok(list.some((p) => p.id === "my-custom-prompt"));

  // 尝试覆盖 immutable 锚点必须抛错
  const badOverride: PromptSpec = {
    ...custom,
    id: "classic-v1",
  };
  assert.throws(
    () => buildRegistry([badOverride]),
    /提示词 "classic-v1" 是不可变的基准锚点，不能被自定义条目覆盖/,
  );
});

test("prompt 快照基准比对：全量内置题目与前沿题目解析与夹具逐字段一致", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const fixturePath = path.join(process.cwd(), "test/fixtures/prompt-resolution-snapshot.json");
  const snapshot = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

  // 1. 比对内置题
  for (const item of snapshot.builtin) {
    const actualSpec = resolvePrompt(item.id);
    const actualStd = resolvePromptStandard(item.id);
    assert.deepEqual(JSON.parse(JSON.stringify(actualSpec)), item.spec, `题目 ${item.id} spec 与快照不一致`);
    assert.deepEqual(JSON.parse(JSON.stringify(actualStd)), item.standard, `题目 ${item.id} standard 与快照不一致`);
  }

  // 2. 比对前沿单题
  for (const item of snapshot.frontier) {
    const actualSpec = resolvePrompt(item.id);
    const actualStd = resolvePromptStandard(item.id);
    assert.deepEqual(JSON.parse(JSON.stringify(actualSpec)), item.spec, `前沿题目 ${item.id} spec 与快照不一致`);
    assert.deepEqual(JSON.parse(JSON.stringify(actualStd)), item.standard, `前沿题目 ${item.id} standard 与快照不一致`);
  }
});
