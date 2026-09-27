/**
 * 提示词生命周期与新增 2026 前沿题测试：
 * 验证所有内置提示词均包含首发与收录时间、时间计算及新题完整性。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUILTIN_PROMPTS,
  promptLifecycle,
  resolvePrompt,
  resolvePromptStandard,
  type PromptSpec,
} from "@/core/prompt";

const DATE_PATTERN = /^\d{4}-\d{2}(-\d{2})?$/;

test("全部内置提示词均明确记录首发时间与收录时间", () => {
  for (const prompt of BUILTIN_PROMPTS) {
    assert.ok(
      prompt.originDate !== undefined && prompt.originDate !== null,
      `提示词 ${prompt.id} 缺少首发时间 originDate`,
    );
    assert.ok(
      DATE_PATTERN.test(prompt.originDate),
      `提示词 ${prompt.id} 的 originDate 格式不合法：${prompt.originDate}`,
    );

    assert.ok(
      prompt.registeredAt !== undefined && prompt.registeredAt !== null,
      `提示词 ${prompt.id} 缺少收录时间 registeredAt`,
    );
    assert.ok(
      DATE_PATTERN.test(prompt.registeredAt),
      `提示词 ${prompt.id} 的 registeredAt 格式不合法：${prompt.registeredAt}`,
    );
  }
});

test("2026 前沿题目完整注册且题面要求清晰", () => {
  const newPromptIds = [
    "clock-v1",
    "animated-pelican-v1",
    "penrose-v1",
    "ice-water-v1",
    "four-stroke-engine-v1",
    "mobius-strip-v1",
    "cart-pole-v1",
    "cyber-cube-v1",
    "synthwave-drive-v1",
    "cyber-hud-v1",
    "black-hole-lensing-v1",
    "quantum-double-slit-v1",
    "ferrofluid-spikes-v1",
    "jwst-deployment-v1",
    "tokamak-plasma-v1",
    "gaa-nanosheet-v1",
    "crispr-cas9-rloop-v1",
    "pulsar-jet-v1",
  ];

  for (const id of newPromptIds) {
    const spec = resolvePrompt(id);
    assert.ok(spec !== undefined, `新题 ${id} 解析失败`);
    assert.equal(spec.immutable, true, `${id} 必须不可变`);
    assert.ok(spec.template.includes("SVG"), `${id} 题面必须要求生成 SVG`);
    assert.ok(spec.originDate?.startsWith("2026-"), `${id} 首发时间应为 2026 年`);
    assert.equal(spec.registeredAt, "2026-09-26");
  }
});

test("2026 Batch 1-5 全 14 领域共 140 道前沿工程与视效题目完整注册且符合基准规范", () => {
  const prefixes = [
    "FE-AI",
    "FE-SEMI",
    "FE-QUANTUM",
    "FE-BIO",
    "FE-ENERGY",
    "FE-AERO",
    "FE-META",
    "FE-NEURO",
    "VFX-SIM",
    "VFX-OPTICS",
    "VFX-GEOM",
    "VFX-SCIVIS",
    "VFX-MOTION",
    "VFX-SYS",
  ];
  for (const prefix of prefixes) {
    for (let i = 1; i <= 10; i++) {
      const id = `${prefix}-${String(i).padStart(2, "0")}`;
      const spec = resolvePrompt(id);
      assert.ok(spec !== undefined, `前沿题目 ${id} 解析失败`);
      assert.equal(spec.immutable, true, `${id} 必须不可变`);
      assert.ok(spec.template.includes("SVG"), `${id} 题面必须要求生成 SVG`);
      assert.ok(spec.originDate?.startsWith("2026-"), `${id} 首发时间应为 2026 年`);
      assert.equal(spec.registeredAt, "2026-09-27");
      assert.ok(spec.standard !== undefined, `${id} 必须提供客观参考标准 standard`);
      assert.ok((spec.standard?.groundTruth.length ?? 0) > 0, `${id} groundTruth 不能为空`);
    }
  }

  // 验证 14 套领域分组聚合套题
  const suiteIds = [
    "fe-ai-v1",
    "fe-semi-v1",
    "fe-quantum-v1",
    "fe-bio-v1",
    "fe-energy-v1",
    "fe-aero-v1",
    "fe-meta-v1",
    "fe-neuro-v1",
    "vfx-sim-v1",
    "vfx-optics-v1",
    "vfx-geom-v1",
    "vfx-scivis-v1",
    "vfx-motion-v1",
    "vfx-sys-v1",
  ];
  for (const sid of suiteIds) {
    const suite = resolvePrompt(sid);
    assert.ok(suite !== undefined, `套题 ${sid} 解析失败`);
    assert.equal(suite.immutable, true, `套题 ${sid} 必须不可变`);
    assert.equal(suite.candidates.length, 10, `套题 ${sid} 必须包含 10 个候选题目`);
    assert.ok(suite.standard != null, `套题 ${sid} 必须提供领域级标准 standard`);
    assert.ok((suite.standard?.groundTruth.length ?? 0) > 0, `套题 ${sid} groundTruth 不能为空`);

    for (const cand of suite.candidates) {
      assert.ok(cand.standard != null, `候选 ${cand.id} 必须挂载单题标准 standard`);
      assert.ok((cand.standard?.groundTruth.length ?? 0) > 0, `候选 ${cand.id} groundTruth 不能为空`);
      assert.ok((cand.standard?.evaluationCriteria.length ?? 0) > 0, `候选 ${cand.id} evaluationCriteria 不能为空`);

      // 验证通过 bindings 能精准解析到该候选的标准
      const resolved = resolvePromptStandard(sid, { 回目: cand.label });
      assert.ok(resolved != null, `根据回目 ${cand.label} 解析标准失败`);
      assert.equal(resolved?.coreKey, cand.standard?.coreKey);
    }
  }
});

test("promptLifecycle 正确计算题龄与淘汰状态", () => {
  const fakeNow = new Date("2026-09-26T12:00:00Z");

  // 1. 经典老题锚点 (classic-v1)：应标记为 legacy
  const classic = resolvePrompt("classic-v1");
  const classicLife = promptLifecycle(classic, fakeNow);
  assert.equal(classicLife.status, "legacy");
  assert.ok(classicLife.originAgeText?.includes("年前"));

  // 2. 2026-07 的新题 (clock-v1)：活跃新题
  const clock = resolvePrompt("clock-v1");
  const clockLife = promptLifecycle(clock, fakeNow);
  assert.equal(clockLife.status, "active");
  assert.equal(clockLife.daysSinceCollected, 0);
  assert.equal(clockLife.collectedAgeText, "今天收录");
  assert.ok(clockLife.originAgeText?.includes("个月前"));

  // 3. 模拟收录超过半年的老化题目：应标记为 aging
  const agingPrompt: PromptSpec = {
    id: "old-test-v1",
    label: "老化测试题",
    template: "Generate an SVG of a tree",
    variables: [],
    candidates: [],
    source: null,
    verified: true,
    immutable: false,
    originDate: "2024-01-01",
    registeredAt: "2025-01-01",
  };
  const agingLife = promptLifecycle(agingPrompt, fakeNow);
  assert.equal(agingLife.status, "aging");
  assert.ok((agingLife.daysSinceCollected ?? 0) > 180);
});
