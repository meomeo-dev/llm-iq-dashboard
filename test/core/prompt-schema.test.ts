/**
 * 提示词数据模型（Schema）与数据完整性校验（Validation）专项测试：
 * 验证所有内置单题、套题与候选题目均完全满足数据契约约束，
 * 并充分测试各种属性缺失、格式非法的拦截能力。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BUILTIN_PROMPTS,
  FRONTIER_INDIVIDUAL_PROMPT_MAP,
  resolvePrompt,
  type PromptSpec,
} from "@/core/prompt";
import {
  assertValidPromptSpec,
  validatePromptCandidate,
  validatePromptRegistry,
  validatePromptSpec,
  validatePromptStandard,
} from "@/core/prompt-schema";
import { parsePrompts } from "@/core/config-prompts";

test("全量内置提示词 (BUILTIN_PROMPTS) 100% 通过严格 Schema 完整性校验", () => {
  const result = validatePromptRegistry(BUILTIN_PROMPTS, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });

  if (!result.valid) {
    const errorDetails = result.errors.map((e) => `[${e.path}] ${e.message}`).join("\n");
    assert.fail(`内置题库存在属性缺失或格式违规：\n${errorDetails}`);
  }
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test("全量 140 道前沿单题 (FRONTIER_INDIVIDUAL_PROMPT_MAP) 100% 通过严格 Schema 完整性校验", () => {
  const individuals = [...FRONTIER_INDIVIDUAL_PROMPT_MAP.values()];
  assert.equal(individuals.length, 140, "前沿单题总数应为 140 道");

  const result = validatePromptRegistry(individuals, {
    requireStandard: true,
    requireLifecycleDates: true,
    requireSvgRequirement: true,
  });

  if (!result.valid) {
    const errorDetails = result.errors.map((e) => `[${e.path}] ${e.message}`).join("\n");
    assert.fail(`前沿单题库存在属性缺失或格式违规：\n${errorDetails}`);
  }
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test("14 个前沿套题的所有候选条目 (candidates) 均具备独立针对性的客观黄金标准", () => {
  const frontierSuiteIds = [
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

  for (const sid of frontierSuiteIds) {
    const suite = resolvePrompt(sid);
    assert.equal(suite.candidates.length, 10, `${sid} 必须包含 10 个候选题目`);

    // 启用严格候选标准检查 requireCandidateStandard
    const suiteResult = validatePromptSpec(suite, {
      requireStandard: true,
      requireCandidateStandard: true,
      requireLifecycleDates: true,
    });

    if (!suiteResult.valid) {
      const errorDetails = suiteResult.errors.map((e) => `[${e.path}] ${e.message}`).join("\n");
      assert.fail(`套题 ${sid} 候选属性或标准校验失败：\n${errorDetails}`);
    }
  }
});

test("负向用例：validatePromptStandard 能够精准拦截各种非法或缺失的标准数据", () => {
  // 1. null 或 undefined
  assert.ok(validatePromptStandard(null).length > 0);
  assert.ok(validatePromptStandard(undefined).length > 0);

  // 2. 缺失 coreKey
  const errNoCoreKey = validatePromptStandard({
    groundTruth: "加州褐鹈鹕全身繁殖羽与车身几何对齐",
    evaluationCriteria: "1. 辐条与车架力学；2. 繁殖羽与喉囊",
  });
  assert.ok(errNoCoreKey.some((e) => e.path.endsWith("coreKey")));

  // 3. groundTruth 过短或空
  const errShortGT = validatePromptStandard({
    coreKey: "核心考点",
    groundTruth: "太短了",
    evaluationCriteria: "1. 辐条与车架力学；2. 繁殖羽与喉囊",
  });
  assert.ok(errShortGT.some((e) => e.path.endsWith("groundTruth") && e.message.includes("过短")));

  // 4. evaluationCriteria 缺失
  const errNoEval = validatePromptStandard({
    coreKey: "核心考点",
    groundTruth: "加州褐鹈鹕全身繁殖羽与车身几何对齐",
  });
  assert.ok(errNoEval.some((e) => e.path.endsWith("evaluationCriteria")));
});

test("负向用例：validatePromptSpec 能够精准拦截单题和套题的属性违规", () => {
  // 1. 缺失 id 或 template
  const invalidNoId = validatePromptSpec({
    label: "无 ID 题目",
    template: "Generate an SVG of a cat",
    verified: true,
    immutable: false,
    originDate: "2026-09",
    registeredAt: "2026-09-26",
    standard: {
      coreKey: "猫咪生理特征",
      groundTruth: "必须包含猫耳、猫爪与胡须的对称解剖构图",
      evaluationCriteria: "完整性、对称性与矢量平滑度",
    },
  });
  assert.ok(!invalidNoId.valid);
  assert.ok(invalidNoId.errors.some((e) => e.path.includes("id")));

  // 2. 没有要求生成 SVG 的单题模板
  const invalidNoSvg = validatePromptSpec({
    id: "no-svg-cat",
    label: "无 SVG 题",
    template: "Draw a cat with colored pencils",
    verified: true,
    immutable: false,
    originDate: "2026-09",
    registeredAt: "2026-09-26",
    standard: {
      coreKey: "猫咪生理特征",
      groundTruth: "必须包含猫耳、猫爪与胡须的对称解剖构图",
      evaluationCriteria: "完整性、对称性与矢量平滑度",
    },
  });
  assert.ok(!invalidNoSvg.valid);
  assert.ok(invalidNoSvg.errors.some((e) => e.path.includes("template") && e.message.includes("SVG")));

  // 3. 日期格式错误
  const invalidDate = validatePromptSpec({
    id: "bad-date-prompt",
    label: "日期错误题",
    template: "Generate an SVG of something",
    verified: true,
    immutable: false,
    originDate: "2026/09/26", // 斜杠是非法的
    registeredAt: "2026-09", // 收录日期必须是具体到日 YYYY-MM-DD
    standard: {
      coreKey: "测试考点",
      groundTruth: "必须包含充分的客观判定标准和事实依据",
      evaluationCriteria: "必须包含明确的判据和失误扣分点",
    },
  });
  assert.ok(!invalidDate.valid);
  assert.ok(invalidDate.errors.some((e) => e.path.includes("originDate")));
  assert.ok(invalidDate.errors.some((e) => e.path.includes("registeredAt")));

  // 4. 缺失 standard
  const invalidNoStandard = validatePromptSpec({
    id: "no-standard-prompt",
    label: "无标准题",
    template: "Generate an SVG of something",
    verified: true,
    immutable: false,
    originDate: "2026-09",
    registeredAt: "2026-09-26",
  });
  assert.ok(!invalidNoStandard.valid);
  assert.ok(invalidNoStandard.errors.some((e) => e.path.includes("standard")));
});

test("负向用例：assertValidPromptSpec 能够直接抛出包含字段路径的异常", () => {
  assert.throws(
    () => {
      assertValidPromptSpec({
        id: "broken-spec-v1",
        label: "Broken Spec",
        template: "Broken prompt without vector format",
      });
    },
    (err: Error) => {
      assert.ok(err.message.includes("提示词数据结构校验失败 (broken-spec-v1)"));
      assert.ok(err.message.includes("template"));
      return true;
    },
  );
});

test("配置解析器 (config-prompts) 正确解析合法 standard，并拦截非法 standard", () => {
  const errors: string[] = [];

  // 合法配置输入
  const validYamlCustom = [
    {
      id: "custom-good-v1",
      label: "自定义优质题目",
      template: "Generate an SVG of a futuristic train",
      originDate: "2026-09",
      registeredAt: "2026-09-27",
      standard: {
        coreKey: "磁悬浮流线型空气动力学与轨道拓扑",
        groundTruth: "列车前端具备钝头细长流线型减阻设计，车体与轨道间留有悬浮间隙",
        evaluationCriteria: "1. 悬浮间隙清晰；2. 具有完整的转向架与受流靴剖面",
        referenceSource: "https://example.com/train",
      },
    },
  ];

  const parsedGood = parsePrompts(validYamlCustom, errors);
  assert.equal(errors.length, 0);
  assert.equal(parsedGood.length, 1);
  const goodPrompt = parsedGood[0];
  assert.ok(goodPrompt !== undefined);
  assert.ok(goodPrompt.standard != null);
  assert.equal(goodPrompt.standard?.coreKey, "磁悬浮流线型空气动力学与轨道拓扑");

  // 非法配置输入（standard 缺属性）
  const badErrors: string[] = [];
  const badYamlCustom = [
    {
      id: "custom-bad-v1",
      label: "自定义残缺题目",
      template: "Generate an SVG of something",
      standard: {
        coreKey: "短",
        groundTruth: "太短",
      },
    },
  ];

  const parsedBad = parsePrompts(badYamlCustom, badErrors);
  assert.equal(parsedBad.length, 1);
  assert.ok(badErrors.length > 0, "应检测出 standard 中的校验错误");
  assert.ok(badErrors.some((e) => e.includes("coreKey")));
  assert.ok(badErrors.some((e) => e.includes("evaluationCriteria")));
});

test("负向用例：能够严格拦截包含 Markdown 标题或未清理报告草稿残留的 referenceSource 和 source", () => {
  const pollutedSpec = {
    id: "polluted-spec-v1",
    label: "受污染题目",
    template: "Generate an SVG of a cell",
    verified: true,
    immutable: false,
    originDate: "2026-09",
    registeredAt: "2026-09-27",
    source: "Some paper (2024). - **净室设计理念**: 从某某推导 --- #### 题目 5",
    standard: {
      coreKey: "细胞膜拓扑结构",
      groundTruth: "双层磷脂分子构型与流动镶嵌模型完整呈现",
      evaluationCriteria: "内外膜极性头与疏水尾方向准确对齐",
      referenceSource: "Science (2024); DOI: 10.1126/xxx. - **净室设计理念**: 测试文本 --- #### 题目 5",
    },
  };

  const result = validatePromptSpec(pollutedSpec);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.path.endsWith("source") && e.message.includes("草稿残留")));
  assert.ok(result.errors.some((e) => e.path.endsWith("referenceSource") && e.message.includes("草稿残留")));
});

