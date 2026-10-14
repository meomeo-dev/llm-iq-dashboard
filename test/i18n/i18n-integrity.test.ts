import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getMessages, I18nProvider } from "@/i18n";
import { BUILTIN_PROMPTS } from "@/core/prompt";
import {
  localizePromptLabel,
  localizeCandidateLabel,
  localizePromptStandard,
  localizePromptSpec,
} from "@/core/prompts/i18n";
import {
  renderTimelineSvg,
  type Palette,
  type TimelineExport,
} from "@/app/components/export/timeline-svg";
import { renderTimelinePortraitSvg } from "@/app/components/export/timeline-portrait-svg";
import { renderResultSetSvg } from "@/app/components/export/result-set-svg";
import type { DashboardCard } from "@/core/types";
import { EmptyDay } from "@/app/components/dashboard/EmptyDay";
import { ConfigPageHeader } from "@/app/config/ConfigPageHeader";
import { PairCodeForm } from "@/app/pair/PairCodeForm";

const CJK_RE = /[\u4e00-\u9fff]/;
const INTENTIONAL_ZH_SWITCH_KEYS = new Set([
  "common.languageSwitchLabel",
  "common.languageSwitchTitle",
]);
const EXPECTED_BUILTIN_PROMPTS_SHA256 =
  "97adfdad892945b18d21a8248265bd4886fb3f8722eed819c7b391e0d9ffe22b";

function collectLeafEntries(obj: unknown, prefix = ""): Map<string, string> {
  const entries = new Map<string, string>();
  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") {
        for (const [k, v] of collectLeafEntries(value, nextKey)) {
          entries.set(k, v);
        }
      } else {
        entries.set(nextKey, String(value));
      }
    }
  }
  return entries;
}

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{([a-zA-Z0-9_]+)\}/g) ?? [];
  return [...new Set(matches)].sort();
}

const TEST_PALETTE: Palette = {
  bg: "#0b0e14",
  surface: "#121722",
  surfaceHi: "#1a2130",
  border: "#263044",
  text: "#e6edf3",
  textDim: "#9da7b3",
  textFaint: "#6e7681",
  accent: "#58a6ff",
  ok: "#3fb950",
  warn: "#d29922",
  err: "#f85149",
};

const SAMPLE_CARD: DashboardCard = {
  runId: "20261013T120000Z",
  runStartedAt: "2026-10-13T12:00:00.000Z",
  startedAt: "2026-10-13T12:00:00.000Z",
  finishedAt: "2026-10-13T12:00:15.000Z",
  durationMs: 15000,
  trigger: "schedule",
  runInProgress: false,
  targetId: "claude-opus",
  promptId: "classic-v1",
  cli: "claude",
  model: "claude-opus-4-6",
  effort: "high",
  appliedEffort: "high",
  effortHonored: true,
  label: "claude-opus",
  status: "ok",
  svgFile: "20261013T120000Z/claude-opus.svg",
  rawFile: null,
  svgBytes: 2048,
  error: null,
  promptText: "Generate an SVG of a pelican riding a bicycle",
  bindings: {},
  usage: null,
  cost: {
    status: "unpriced",
    usd: null,
    modelId: null,
    channelId: null,
    serviceTier: "standard",
    catalogTag: null,
    lines: [],
    note: null,
  },
  judge: null,
  judgeCost: null,
};

describe("M2-06 full-stack i18n integrity & invariant regression suite", () => {
  it("verifies 100% key symmetry, zero CJK in en leaves, Monday-first calendar weekdays, and identical {placeholder} sets", () => {
    const enMsg = getMessages("en");
    const zhMsg = getMessages("zh-CN");
    assert.equal(enMsg.toolbar.calendarWeekdays[0], "Mo");
    assert.equal(zhMsg.toolbar.calendarWeekdays[0], "一");

    const enLeaves = collectLeafEntries(enMsg);
    const zhLeaves = collectLeafEntries(zhMsg);

    assert.deepEqual(
      [...enLeaves.keys()].sort(),
      [...zhLeaves.keys()].sort(),
      "en and zh-CN leaf key sets must match 100%",
    );

    for (const [key, enVal] of enLeaves.entries()) {
      const zhVal = zhLeaves.get(key)!;
      assert.ok(enVal.trim().length > 0, `en key "${key}" must not be empty`);
      assert.ok(zhVal.trim().length > 0, `zh-CN key "${key}" must not be empty`);
      if (!INTENTIONAL_ZH_SWITCH_KEYS.has(key)) {
        assert.equal(
          CJK_RE.test(enVal),
          false,
          `en dictionary key "${key}" must not contain CJK characters, got: "${enVal}"`,
        );
      }
      assert.deepEqual(
        extractPlaceholders(enVal),
        extractPlaceholders(zhVal),
        `Interpolation placeholders for "${key}" must match between en ("${enVal}") and zh-CN ("${zhVal}")`,
      );
    }
  });

  it("verifies all 54 BUILTIN_PROMPTS and 300 candidates have CJK-free en metadata and locked SHA-256 prompt templates", () => {
    assert.equal(BUILTIN_PROMPTS.length, 54);
    const classic = BUILTIN_PROMPTS.find((p) => p.id === "classic-v1");
    assert.ok(classic);
    assert.equal(classic.template, "Generate an SVG of a pelican riding a bicycle");

    const shaPayload = JSON.stringify(
      BUILTIN_PROMPTS.map((p) => ({
        id: p.id,
        template: p.template,
        candidates: p.candidates.map((c) => ({ id: c.id, text: c.text })),
      })),
    );
    const actualSha256 = crypto.createHash("sha256").update(shaPayload).digest("hex");
    assert.equal(
      actualSha256,
      EXPECTED_BUILTIN_PROMPTS_SHA256,
      "BUILTIN_PROMPTS templates and candidate texts must remain byte-for-byte identical",
    );

    let candidateTotal = 0;
    for (const spec of BUILTIN_PROMPTS) {
      const origTemplate = spec.template;
      const enLabel = localizePromptLabel(spec.id, spec.label, "en");
      const zhLabel = localizePromptLabel(spec.id, spec.label, "zh-CN");
      assert.ok(enLabel.trim().length > 0, `en label for ${spec.id} must be non-empty`);
      assert.ok(zhLabel.trim().length > 0, `zh-CN label for ${spec.id} must be non-empty`);
      assert.equal(CJK_RE.test(enLabel), false, `CJK in en label for ${spec.id}: ${enLabel}`);

      if (spec.standard) {
        const enStd = localizePromptStandard(spec.id, spec.standard, "en");
        const zhStd = localizePromptStandard(spec.id, spec.standard, "zh-CN");
        assert.ok(enStd && enStd.coreKey.trim().length > 0 && enStd.groundTruth.trim().length > 0);
        assert.ok(zhStd && zhStd.coreKey.trim().length > 0 && zhStd.groundTruth.trim().length > 0);
        assert.ok(enStd.evaluationCriteria.trim().length > 0);
        assert.equal(CJK_RE.test(enStd.coreKey), false, `CJK in coreKey for ${spec.id}`);
        assert.equal(CJK_RE.test(enStd.groundTruth), false, `CJK in groundTruth for ${spec.id}`);
        assert.equal(
          CJK_RE.test(enStd.evaluationCriteria),
          false,
          `CJK in evaluationCriteria for ${spec.id}`,
        );
      }

      const localizedEn = localizePromptSpec(spec, "en");
      assert.equal(localizedEn.id, spec.id);
      assert.equal(localizedEn.template, origTemplate, "localizePromptSpec must never alter prompt template");

      for (let i = 0; i < spec.candidates.length; i += 1) {
        candidateTotal += 1;
        const c = spec.candidates[i]!;
        const origText = c.text;
        const enCand = localizeCandidateLabel(c.id, c.label, "en");
        const zhCand = localizeCandidateLabel(c.id, c.label, "zh-CN");
        assert.ok(enCand.trim().length > 0);
        assert.ok(zhCand.trim().length > 0);
        assert.equal(CJK_RE.test(enCand), false, `CJK in en candidate label ${c.id}: ${enCand}`);
        assert.equal(localizedEn.candidates[i]?.text, origText, "localizePromptSpec must never alter candidate text");
      }
    }
    assert.equal(candidateTotal, 300);
  });

  it("verifies bilingual documentation pairs exist and contain reciprocal language switch links", () => {
    const repoRoot = process.cwd();
    const pairs: Array<[string, string, string, string]> = [
      ["README.md", "README.zh-CN.md", "README.zh-CN.md", "README.md"],
      ["docs/development.md", "docs/development.zh-CN.md", "development.zh-CN.md", "development.md"],
      ["docs/design-notes.md", "docs/design-notes.zh-CN.md", "design-notes.zh-CN.md", "design-notes.md"],
      ["docs/deploy-docker.md", "docs/deploy-docker.zh-CN.md", "deploy-docker.zh-CN.md", "deploy-docker.md"],
      ["docs/deploy-public-showcase.md", "docs/deploy-public-showcase.zh-CN.md", "deploy-public-showcase.zh-CN.md", "deploy-public-showcase.md"],
      ["docs/data-sync-architecture.md", "docs/data-sync-architecture.zh-CN.md", "data-sync-architecture.zh-CN.md", "data-sync-architecture.md"],
    ];

    for (const [enRel, zhRel, expectedLinkInEn, expectedLinkInZh] of pairs) {
      const enPath = path.join(repoRoot, enRel);
      const zhPath = path.join(repoRoot, zhRel);
      assert.ok(fs.existsSync(enPath), `Missing English doc: ${enRel}`);
      assert.ok(fs.existsSync(zhPath), `Missing Chinese doc: ${zhRel}`);
      const enHead = fs.readFileSync(enPath, "utf8").split("\n").slice(0, 10).join("\n");
      const zhHead = fs.readFileSync(zhPath, "utf8").split("\n").slice(0, 10).join("\n");
      assert.ok(enHead.includes(expectedLinkInEn), `${enRel} top lines should link to ${expectedLinkInEn}`);
      assert.ok(zhHead.includes(expectedLinkInZh), `${zhRel} top lines should link to ${expectedLinkInZh}`);
    }
  });

  it("renders localized labels in timelineSvg, timelinePortraitSvg, and resultSetSvg for en and zh-CN", () => {
    const baseTimeline: TimelineExport = {
      title: "Pelican Benchmark",
      subtitle: "2026-10-13",
      moments: [
        {
          runId: "20261013T120000Z",
          startedAt: "2026-10-13T12:00:00.000Z",
          dayKey: "2026-10-13",
          fraction: 0.5,
          clock: "12:00",
          cards: [SAMPLE_CARD],
          okCount: 1,
        },
      ],
      efforts: ["low", "medium", "high", "max"],
      now: { fraction: 0.52, clock: "12:30" },
      thumbnails: new Map(),
      palette: TEST_PALETTE,
    };

    const enHoriz = renderTimelineSvg({ ...baseTimeline, locale: "en" }).svg;
    const zhHoriz = renderTimelineSvg({ ...baseTimeline, locale: "zh-CN" }).svg;
    assert.ok(enHoriz.includes("Models"));
    assert.ok(enHoriz.includes("Tile corners"));
    assert.ok(enHoriz.includes("Now 12:30"));
    assert.ok(zhHoriz.includes("模型"));
    assert.ok(zhHoriz.includes("格内位置"));
    assert.ok(zhHoriz.includes("现在 12:30"));

    const enPortrait = renderTimelinePortraitSvg({ ...baseTimeline, locale: "en" }).svg;
    const zhPortrait = renderTimelinePortraitSvg({ ...baseTimeline, locale: "zh-CN" }).svg;
    assert.ok(enPortrait.includes("Models"));
    assert.ok(enPortrait.includes("1 results · 1 ok"));
    assert.ok(zhPortrait.includes("模型"));
    assert.ok(zhPortrait.includes("1 个结果 · 成功 1"));

    const enResultSet = renderResultSetSvg({
      title: "claude · claude-opus-4-6",
      subtitle: "classic-v1",
      cards: [SAMPLE_CARD],
      columns: [{ name: "default", label: "Login", color: null }],
      efforts: ["high"],
      timeZone: "UTC",
      thumbnails: new Map(),
      palette: TEST_PALETTE,
      locale: "en",
    }).svg;
    const zhResultSet = renderResultSetSvg({
      title: "claude · claude-opus-4-6",
      subtitle: "classic-v1",
      cards: [SAMPLE_CARD],
      columns: [{ name: "default", label: "登录态", color: null }],
      efforts: ["high"],
      timeZone: "UTC",
      thumbnails: new Map(),
      palette: TEST_PALETTE,
      locale: "zh-CN",
    }).svg;
    assert.ok(enResultSet.includes("Scheduled"));
    assert.ok(zhResultSet.includes("定时"));
  });

  it("renders UI components in English under <I18nProvider initialLocale='en'> and Chinese under 'zh-CN'", () => {
    (globalThis as Record<string, unknown>).React = React;
    const enHtml = renderToStaticMarkup(
      React.createElement(I18nProvider, {
        initialLocale: "en",
        children: [
          React.createElement(ConfigPageHeader, { key: "cfg", path: "/tmp/pelican.config.yaml" }),
          React.createElement(EmptyDay, {
            key: "empty",
            hasRuns: false,
            dayHasRuns: false,
            isToday: true,
            latestDay: null,
            onPickDay: () => {},
          }),
          React.createElement(PairCodeForm, {
            key: "pair",
            code: "",
            status: { kind: "idle" },
            onChangeCode: () => {},
            onSubmit: async () => {},
          }),
        ],
      }),
    );
    assert.ok(enHtml.includes("Benchmark Configuration"));
    assert.ok(enHtml.includes("← Dashboard"));
    assert.ok(enHtml.includes("No benchmark runs yet"));
    assert.ok(enHtml.includes("Pairing Code"));

    const zhHtml = renderToStaticMarkup(
      React.createElement(I18nProvider, {
        initialLocale: "zh-CN",
        children: [
          React.createElement(ConfigPageHeader, { key: "cfg", path: "/tmp/pelican.config.yaml" }),
          React.createElement(EmptyDay, {
            key: "empty",
            hasRuns: false,
            dayHasRuns: false,
            isToday: true,
            latestDay: null,
            onPickDay: () => {},
          }),
          React.createElement(PairCodeForm, {
            key: "pair",
            code: "",
            status: { kind: "idle" },
            onChangeCode: () => {},
            onSubmit: async () => {},
          }),
        ],
      }),
    );
    assert.ok(zhHtml.includes("基准配置"));
    assert.ok(zhHtml.includes("← 看板"));
    assert.ok(zhHtml.includes("还没有运行记录"));
    assert.ok(zhHtml.includes("配对码"));
  });
});
