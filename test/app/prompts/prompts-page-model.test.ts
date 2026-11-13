import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import { renderToStaticMarkup } from "react-dom/server";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { BUILTIN_PROMPTS, ARCHIVED_PROMPTS, type PromptSpec } from "@/core/prompt";
import { I18nProvider } from "@/i18n";
import { PromptsGalleryPage } from "@/app/prompts/PromptsGalleryPage";
import { PromptDetailModal } from "@/app/prompts/PromptDetailModal";
import {
  DEFAULT_PROMPT_FILTER,
  buildPromptCatalog,
  computePromptCatalogStats,
  filterPromptCatalog,
  resolveCopyablePromptText,
} from "@/app/prompts/prompts-page-model";

const CUSTOM_PROMPT_FIXTURE: PromptSpec = {
  id: "custom-gearbox-v1",
  label: "行星齿轮啮合图（Custom Planetary Gear）",
  template: "Generate an SVG of a {{tooth_count}}-tooth planetary gear system in {{style}} style",
  variables: [
    { name: "tooth_count", mode: "sequence", values: ["12", "24"] },
    { name: "style", mode: "sequence", values: ["blueprint", "cutaway"] },
  ],
  candidates: [],
  source: null,
  verified: false,
  immutable: false,
  standard: {
    coreKey: "行星轮与太阳轮同轴啮合",
    groundTruth: "中心太阳轮、3 个行星轮与外齿圈同心啮合。",
    evaluationCriteria: "齿廓清晰、啮合位置准确。",
  },
};

describe("prompts-page-model: catalog construction, filtering, stats & verbatim copy", () => {
  it("builds bilingual catalog items without mutating PromptSpec.template or candidate.text", () => {
    const zhCatalog = buildPromptCatalog({
      locale: "zh-CN",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
      scheduledPromptIds: ["classic-v1", "animated-pelican-v1"],
      now: new Date("2026-09-10T00:00:00Z"),
    });
    const enCatalog = buildPromptCatalog({
      locale: "en",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
      scheduledPromptIds: ["classic-v1", "animated-pelican-v1"],
      now: new Date("2026-09-10T00:00:00Z"),
    });

    assert.equal(
      zhCatalog.length,
      BUILTIN_PROMPTS.length + 1 + ARCHIVED_PROMPTS.length,
    );
    assert.equal(enCatalog.length, zhCatalog.length);

    const classicZh = zhCatalog.find((item) => item.id === "classic-v1");
    const classicEn = enCatalog.find((item) => item.id === "classic-v1");
    assert.ok(classicZh && classicEn);
    assert.equal(classicZh.isLocked, true);
    assert.equal(classicZh.isScheduled, true);
    assert.equal(classicZh.isAnimated, false);
    assert.equal(
      classicZh.template,
      "Generate an SVG of a pelican riding a bicycle",
    );
    assert.equal(classicEn.template, classicZh.template);
    assert.equal(classicZh.groupLabel, "经典基准");
    assert.equal(classicEn.groupLabel, "Classic Benchmarks");

    const animPelicanZh = zhCatalog.find((item) => item.id === "animated-pelican-v1");
    const animPelicanEn = enCatalog.find((item) => item.id === "animated-pelican-v1");
    assert.ok(animPelicanZh?.rubric && animPelicanEn?.rubric);
    assert.equal(animPelicanZh.isAnimated, true);
    assert.equal(animPelicanZh.rubric.codePoints, 30);
    assert.equal(animPelicanZh.rubric.aiPoints, 70);
    assert.equal(animPelicanZh.rubric.gates.length, 5);
    assert.equal(animPelicanZh.rubric.criteria.length, 9);
    assert.equal(animPelicanZh.rubric.gates[0]?.title, "XML 合法");
    assert.equal(animPelicanEn.rubric.gates[0]?.title, "Valid XML");
    assert.equal(animPelicanZh.rubric.criteria[0]?.title, "车轮绕轴心旋转");
    assert.equal(animPelicanEn.rubric.criteria[0]?.title, "Wheels Rotate Around Axles");
    assert.deepEqual(
      animPelicanZh.rubric.gates.map((g) => g.id),
      ["G1", "G2", "G3", "G4", "G5"],
    );
    assert.deepEqual(
      animPelicanZh.rubric.criteria.map((c) => c.id),
      ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
    );
    assert.equal(/[\u4e00-\u9fff]/.test(classicEn.lifecycle.originAgeText ?? ""), false);
    assert.equal(/[\u4e00-\u9fff]/.test(classicEn.lifecycle.collectedAgeText ?? ""), false);

    const shuihuZh = zhCatalog.find((item) => item.id === "shuihu-v1");
    assert.ok(shuihuZh);
    assert.ok(shuihuZh.promptStandard !== null);
    assert.ok(shuihuZh.candidates[0]?.standard !== null);

    const jansenZh = zhCatalog.find((item) => item.id === "animated-jansen-walker-v1");
    const jansenEn = enCatalog.find((item) => item.id === "animated-jansen-walker-v1");
    assert.ok(jansenZh && jansenEn);
    assert.equal(jansenZh.groupKey, "2026-10");
    assert.equal(jansenZh.groupLabel, "2026-10 流行力学与拓扑");
    assert.equal(jansenEn.groupKey, "2026-10");
    assert.equal(jansenEn.groupLabel, "2026-10 Viral Kinematics & Topology");

    const customItem = zhCatalog.find((item) => item.id === "custom-gearbox-v1");
    assert.ok(customItem);
    assert.equal(customItem.isCustom, true);
    assert.equal(customItem.variableCount, 2);
    assert.equal(customItem.isScheduled, false);
  });

  it("computes catalog stats and filters by scope, groupKey, feature, and multi-token search query", () => {
    const customNoStd: PromptSpec = {
      ...CUSTOM_PROMPT_FIXTURE,
      id: "custom-no-std-v1",
      standard: null,
    };
    const items = buildPromptCatalog({
      locale: "zh-CN",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE, customNoStd],
      scheduledPromptIds: ["classic-v1", "animated-pelican-v1", "shuihu-v1"],
    });
    const enItems = buildPromptCatalog({
      locale: "en",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
    });

    const activeStats = computePromptCatalogStats(items, "active");
    assert.equal(activeStats.totalPrompts, BUILTIN_PROMPTS.length + 2);
    assert.equal(activeStats.rubricPrompts, 1);
    assert.equal(activeStats.archivedPrompts, ARCHIVED_PROMPTS.length);
    assert.ok(activeStats.totalScenes > 160);

    const allStats = computePromptCatalogStats(items, "all");
    assert.equal(
      allStats.totalPrompts,
      BUILTIN_PROMPTS.length + 2 + ARCHIVED_PROMPTS.length,
    );

    const activeOnly = filterPromptCatalog(items, DEFAULT_PROMPT_FILTER);
    assert.equal(activeOnly.length, BUILTIN_PROMPTS.length + 2);

    const allScope = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      scope: "all",
    });
    assert.equal(allScope.length, BUILTIN_PROMPTS.length + 2 + ARCHIVED_PROMPTS.length);

    const archivedOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      scope: "archived",
    });
    assert.equal(archivedOnly.length, ARCHIVED_PROMPTS.length);

    const suitesOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      feature: "suite",
    });
    assert.ok(suitesOnly.length >= 10);
    assert.ok(suitesOnly.every((item) => item.isSuite && item.candidateCount > 0));

    const animatedOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      feature: "animated",
    });
    assert.ok(animatedOnly.length > 0);
    assert.ok(animatedOnly.every((item) => item.isAnimated));
    assert.ok(animatedOnly.some((item) => item.id === "animated-pelican-v1"));
    assert.ok(!animatedOnly.some((item) => item.id === "classic-v1"));

    const standardOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      feature: "standard",
    });
    assert.ok(standardOnly.length > 0);
    assert.ok(standardOnly.every((item) => item.standard !== null));
    assert.ok(!standardOnly.some((item) => item.id === "custom-no-std-v1"));

    const rubricOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      feature: "rubric",
    });
    assert.deepEqual(
      rubricOnly.map((item) => item.id),
      ["animated-pelican-v1"],
    );

    const scheduledOnly = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      feature: "scheduled",
    });
    assert.deepEqual(
      scheduledOnly.map((item) => item.id),
      ["classic-v1", "animated-pelican-v1", "shuihu-v1"],
    );

    const classicGroup = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      groupKey: "经典基准",
    });
    assert.equal(classicGroup.length, 5);

    const oct2026Group = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      groupKey: "2026-10",
    });
    assert.equal(oct2026Group.length, 8);
    assert.ok(oct2026Group.every((item) => item.groupKey === "2026-10"));

    const octStatsGroup = activeStats.groups.find((g) => g.key === "2026-10");
    assert.ok(octStatsGroup);
    assert.equal(octStatsGroup.count, 8);
    assert.equal(octStatsGroup.label, "2026-10 流行力学与拓扑");

    const candidateQuery = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      query: "shuihu-007 倒拔垂杨柳",
    });
    assert.equal(candidateQuery.length, 1);
    assert.equal(candidateQuery[0]?.id, "shuihu-v1");

    const standardQuery = filterPromptCatalog(items, {
      ...DEFAULT_PROMPT_FILTER,
      query: "行星轮 齿廓清晰",
    });
    assert.deepEqual(
      standardQuery.map((item) => item.id),
      ["custom-gearbox-v1"],
    );

    const enQuery = filterPromptCatalog(enItems, {
      ...DEFAULT_PROMPT_FILTER,
      query: "pelican bicycle",
    });
    assert.ok(enQuery.some((item) => item.id === "classic-v1"));
  });

  it("resolves verbatim copyable prompt text for single prompts and multi-scene suites", () => {
    const items = buildPromptCatalog({
      locale: "en",
      includeArchived: false,
    });
    const classic = items.find((item) => item.id === "classic-v1")!;
    assert.equal(
      resolveCopyablePromptText(classic),
      "Generate an SVG of a pelican riding a bicycle",
    );

    const shuihu = items.find((item) => item.id === "shuihu-v1")!;
    assert.ok(shuihu.candidates.length >= 2);
    assert.equal(
      resolveCopyablePromptText(shuihu),
      shuihu.candidates[0]!.text,
    );
    assert.equal(
      resolveCopyablePromptText(shuihu, shuihu.candidates[1]!.id),
      shuihu.candidates[1]!.text,
    );
    assert.equal(
      resolveCopyablePromptText(shuihu, "non-existent-candidate"),
      shuihu.candidates[0]!.text,
    );
  });

  it("renders PromptsGalleryPage filter bar and masonry waterfall cards in zh-CN and en", () => {
    const mockRouter = {
      back: () => {},
      forward: () => {},
      refresh: () => {},
      push: () => {},
      replace: () => {},
      prefetch: () => {},
    };
    const renderGallery = (
      locale: "zh-CN" | "en",
      opts: { owner?: boolean; readonly?: boolean } = {},
    ) =>
      renderToStaticMarkup(
        React.createElement(
          AppRouterContext.Provider,
          { value: mockRouter },
          React.createElement(I18nProvider, {
            initialLocale: locale,
            children: React.createElement(PromptsGalleryPage, {
              owner: opts.owner ?? true,
              readonly: opts.readonly ?? false,
              prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
              scheduledPromptIds: ["classic-v1", "animated-pelican-v1"],
            }),
          }),
        ),
      );

    const zhHtml = renderGallery("zh-CN");
    assert.ok(zhHtml.includes("测评题目"));
    assert.ok(zhHtml.includes("prompts-toolbar"));
    assert.ok(zhHtml.includes("prompts-masonry"));
    assert.ok(zhHtml.includes("prompts-card"));
    assert.ok(zhHtml.includes("prompts-scene-chip"));
    assert.ok(zhHtml.includes("复制提示词"));
    assert.ok(zhHtml.includes("Generate an SVG of a pelican riding a bicycle"));
    assert.ok(zhHtml.includes("100 分量表"));
    assert.ok(zhHtml.includes("2026-10 流行力学与拓扑"));

    const enHtml = renderGallery("en");
    assert.ok(enHtml.includes("Benchmark Prompts"));
    assert.ok(enHtml.includes("Copy Prompt"));
    assert.ok(enHtml.includes("100-pt Rubric"));
    assert.ok(enHtml.includes("2026-10 Viral Kinematics"));

    const readonlyHtml = renderGallery("en", { owner: false, readonly: true });
    assert.ok(readonlyHtml.includes("badge-readonly"));

    const guestHtml = renderGallery("zh-CN", { owner: false, readonly: false });
    assert.ok(guestHtml.includes("/pair?next=%2Fprompts"));
  });

  it("renders PromptDetailModal for rubric prompt, suite candidate, and custom variables in zh-CN and en", () => {
    const zhCatalog = buildPromptCatalog({
      locale: "zh-CN",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
    });
    const enCatalog = buildPromptCatalog({
      locale: "en",
      prompts: [...BUILTIN_PROMPTS, CUSTOM_PROMPT_FIXTURE],
    });

    const renderModal = (
      locale: "zh-CN" | "en",
      item: (typeof zhCatalog)[number] | null,
      initialCandidateId?: string,
    ) =>
      renderToStaticMarkup(
        React.createElement(I18nProvider, {
          initialLocale: locale,
          children: React.createElement(PromptDetailModal, {
            item,
            initialCandidateId,
            onClose: () => {},
          }),
        }),
      );

    assert.equal(renderModal("zh-CN", null), "");

    const zhAnimated = zhCatalog.find((p) => p.id === "animated-pelican-v1")!;
    const zhAnimatedHtml = renderModal("zh-CN", zhAnimated);
    assert.ok(zhAnimatedHtml.includes("prompts-modal"));
    assert.ok(zhAnimatedHtml.includes("复制当前提示词"));
    assert.ok(zhAnimatedHtml.includes("硬性准入门槛（G1–G5）"));
    assert.ok(zhAnimatedHtml.includes("分项计分维度（C1–C9）"));
    assert.ok(zhAnimatedHtml.includes("G1"));
    assert.ok(zhAnimatedHtml.includes("C9"));

    const enAnimated = enCatalog.find((p) => p.id === "animated-pelican-v1")!;
    const enAnimatedHtml = renderModal("en", enAnimated);
    assert.ok(enAnimatedHtml.includes("Copy Current Prompt"));
    assert.ok(enAnimatedHtml.includes("Hard Eligibility Gates (G1–G5)"));
    assert.ok(enAnimatedHtml.includes("Scored Criteria (C1–C9)"));

    const zhXiyou = zhCatalog.find((p) => p.id === "xiyou-v1")!;
    const secondCand = zhXiyou.candidates[1]!;
    const zhSuiteHtml = renderModal("zh-CN", zhXiyou, secondCand.id);
    assert.ok(zhSuiteHtml.includes("prompts-modal-scene-grid"));
    assert.ok(zhSuiteHtml.includes(`#${secondCand.id}`));
    assert.ok(zhSuiteHtml.includes(secondCand.text.slice(0, 40)));
    assert.ok(zhSuiteHtml.includes("standard-criteria-panel"));

    const zhCustom = zhCatalog.find((p) => p.id === "custom-gearbox-v1")!;
    const zhCustomHtml = renderModal("zh-CN", zhCustom);
    assert.ok(zhCustomHtml.includes("{{tooth_count}}"));
    assert.ok(zhCustomHtml.includes("{{style}}"));
    assert.ok(zhCustomHtml.includes("blueprint · cutaway"));
  });
});
