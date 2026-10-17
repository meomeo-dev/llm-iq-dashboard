import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
(globalThis as unknown as { React: typeof React }).React = React;
import { renderToStaticMarkup } from "react-dom/server";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { I18nProvider } from "@/i18n";
import { DEFAULT_MODEL_FINGERPRINT_CONFIG } from "@/core/config";
import type { FillPlan, ModelStatusEntry, ProbeGapSummary } from "@/core/model-fingerprint/plan";
import type { FingerprintCheckRecord, ProbeId } from "@/core/model-fingerprint/types";
import {
  buildCheckRequestBody,
  buildFillRequestBody,
  buildMatrixViewModel,
  buildSampleMutationBody,
  cellStatusClass,
  formatCellProgress,
  formatPercent,
  formatSimilarityScore,
  sortCheckRecordsDescending,
} from "@/app/fingerprint/fingerprint-model";
import { FingerprintMatrix } from "@/app/fingerprint/FingerprintMatrix";
import { FingerprintCheckDetail } from "@/app/fingerprint/FingerprintCheckDetail";
import { FingerprintCheckPanel } from "@/app/fingerprint/FingerprintCheckPanel";
import {
  buildCheckBatchDrafts,
  buildCheckProbeOptions,
  buildCheckTargetsView,
  computeCheckSelectionState,
} from "@/app/fingerprint/fingerprint-check-model";
import { ModelFingerprintSection } from "@/app/config/ModelFingerprintSection";
import { ToolbarUtils } from "@/app/components/toolbar/ToolbarUtils";
import { getMessages } from "@/i18n";

function makeGap(probe: ProbeId, validValues: number, targetValues = 20): ProbeGapSummary {
  const missingValues = Math.max(0, targetValues - validValues);
  return {
    cli: "codex",
    model: "gpt-5.4",
    probe,
    codecId: "default",
    valuesPerCall: 5,
    targetValues,
    validValues,
    rawValidValues: validValues,
    missingValues,
    plannedValues: missingValues,
    estimatedCalls: Math.ceil(missingValues / 5),
    maxCalls: Math.ceil(missingValues / 5) * 3,
    estimatedCostUsd: null,
    usable: validValues >= targetValues,
    intraProbeSim: validValues >= 10 ? 0.725 : null,
    intraProbeLowerBound: validValues >= 10 ? 0.65 : null,
    totalAttempts: 4,
    excludedAttempts: 0,
    cliVersions: ["1.0.0"],
  };
}

const SAMPLE_MATRIX: ModelStatusEntry[] = [
  {
    cli: "codex",
    model: "gpt-5.4",
    configuredInReferences: true,
    onDisk: true,
    usableProbes: ["uuid"],
    probes: {
      uuid: makeGap("uuid", 20),
      number: makeGap("number", 10),
      seed: makeGap("seed", 0),
      palette: makeGap("palette", 0),
      "words-en": makeGap("words-en", 0),
      "words-zh": makeGap("words-zh", 0),
    },
  },
];

const SAMPLE_FILL_PLAN: FillPlan = {
  probes: ["uuid", "number", "seed"],
  items: [],
  pendingItems: [],
  totalPlannedValues: 30,
  totalEstimatedCalls: 6,
  totalMaxCalls: 18,
  totalEstimatedCostUsd: null,
};

const SAMPLE_CHECK_RECORD: FingerprintCheckRecord = {
  checkId: "20261017T060000Z-codex-gpt-5.4",
  createdAt: "2026-10-17T06:00:00.000Z",
  cli: "codex",
  profile: "third-party-relay",
  environment: "codex-low",
  declaredModel: "gpt-5.4",
  requestedEffort: "low",
  appliedEffort: "low",
  effortHonored: true,
  cliVersion: "1.0.0",
  selectedProbes: ["uuid", "number", "seed", "palette"],
  skippedProbes: [],
  validProbes: ["uuid", "number", "seed", "palette"],
  failedProbes: [],
  uncomparedModels: [],
  probeAttempts: {},
  probeScores: {
    uuid: { "gpt-5.4": 0.91, "claude-opus-4-6": 0.65 },
  },
  selfSim: 0.8921,
  selfLowerBound: 0.82,
  expectedConsistency: 0.96,
  expectedFalseInconsistentRate: 0.04,
  verdict: "consistent",
  inconclusiveReason: null,
  closestCandidate: "claude-opus-4-6",
  comparisons: [
    {
      candidateModel: "claude-opus-4-6",
      candidateAppliedEffort: "low",
      sharedProbes: ["uuid", "number", "seed", "palette"],
      probeDeltas: { uuid: 0.26 },
      scoreDiff: 0.2409,
      rawScoreDiff: 0.2409,
      threshold: 0.05,
      distinguishable: true,
      candidateSelfSim: 0.88,
      candidateLowerBound: 0.81,
    },
  ],
  ranking: [
    { model: "gpt-5.4", meanSim: 0.8921 },
    { model: "claude-opus-4-6", meanSim: 0.6512 },
  ],
  rescores: [],
};

describe("fingerprint UI view-model & SSR bilingual components", () => {
  it("computes cell status classes, progress text, and matrix rows accurately", () => {
    assert.equal(cellStatusClass(20, 20), "ready");
    assert.equal(cellStatusClass(5, 20), "partial");
    assert.equal(cellStatusClass(0, 20), "empty");
    assert.equal(formatCellProgress(15, 20), "15/20");

    const rows = buildMatrixViewModel(SAMPLE_MATRIX, ["uuid", "number", "seed"], 20);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]!.cells.length, 3);
    assert.equal(rows[0]!.cells[0]!.statusClass, "ready");
    assert.equal(rows[0]!.cells[0]!.intraProbeSim, 0.725);
    assert.equal(rows[0]!.cells[1]!.statusClass, "partial");
    assert.equal(rows[0]!.cells[2]!.statusClass, "empty");
    assert.equal(rows[0]!.totalMissingValues, 30);
    assert.equal(rows[0]!.totalEstimatedCalls, 6);

    const defaultRows = buildMatrixViewModel(SAMPLE_MATRIX, [], 20);
    assert.equal(defaultRows[0]!.cells.length, 6);
    assert.equal(defaultRows[0]!.totalProbes, 6);
  });

  it("formats similarity scores, percentages, check sorting, and request payloads", () => {
    assert.equal(formatSimilarityScore(0.89214), "0.8921");
    assert.equal(formatSimilarityScore(null), "—");
    assert.equal(formatPercent(0.925), "92.5%");
    assert.equal(formatPercent(null), "—");

    const r1 = { ...SAMPLE_CHECK_RECORD, checkId: "c1", createdAt: "2026-10-17T01:00:00Z" };
    const r2 = { ...SAMPLE_CHECK_RECORD, checkId: "c2", createdAt: "2026-10-17T05:00:00Z" };
    const sorted = sortCheckRecordsDescending([r1, r2]);
    assert.equal(sorted[0]!.checkId, "c2");

    const fillBody = JSON.parse(
      buildFillRequestBody({ action: "fill", cli: "codex", model: "gpt-5.4", probes: ["uuid"] }),
    );
    assert.equal(fillBody.action, "fill");
    assert.equal(fillBody.cli, "codex");

    const checkBody = JSON.parse(
      buildCheckRequestBody({
        action: "check",
        cli: "codex",
        profile: " relay ",
        declaredModel: " gpt-5.4 ",
      }),
    );
    assert.equal(checkBody.profile, "relay");
    assert.equal(checkBody.model, "gpt-5.4");

    const sampleBody = JSON.parse(
      buildSampleMutationBody({
        action: "exclude",
        cli: "codex",
        model: "gpt-5.4",
        probe: "uuid",
        reqId: "r-1",
      }),
    );
    assert.deepEqual(sampleBody.exclude, ["r-1"]);
  });

  it("renders FingerprintMatrix, FingerprintCheckDetail, and ModelFingerprintSection in en and zh-CN", () => {
    const dummyCatalog = { schemaVersion: 1 as const, probedAt: "2026-10-17T00:00:00Z", clis: [] };
    const rescoredRecord: FingerprintCheckRecord = {
      ...SAMPLE_CHECK_RECORD,
      rescores: [
        {
          rescoredAt: "2026-10-17T07:00:00.000Z",
          validProbes: SAMPLE_CHECK_RECORD.validProbes,
          verdict: "inconsistent",
          inconclusiveReason: null,
          closestCandidate: "claude-opus-4-6",
          selfSim: 0.61,
          selfLowerBound: 0.82,
          expectedConsistency: 0.96,
          expectedFalseInconsistentRate: 0.04,
          probeScores: SAMPLE_CHECK_RECORD.probeScores,
          ranking: SAMPLE_CHECK_RECORD.ranking,
          comparisons: SAMPLE_CHECK_RECORD.comparisons,
        },
      ],
    };
    const enHtml = renderToStaticMarkup(
      React.createElement(I18nProvider, {
        initialLocale: "en",
        children: [
          React.createElement(FingerprintMatrix, {
            key: "m",
            config: DEFAULT_MODEL_FINGERPRINT_CONFIG,
            matrix: SAMPLE_MATRIX,
            fillPlan: SAMPLE_FILL_PLAN,
            busy: false,
            pendingPlan: null,
            onSelectCell: () => {},
            onRequestFillPlan: () => {},
            onConfirmFill: () => {},
            onCancelPlan: () => {},
          }),
          React.createElement(FingerprintCheckDetail, {
            key: "d",
            record: rescoredRecord,
            rescoring: false,
            onRescore: () => {},
          }),
          React.createElement(ModelFingerprintSection, {
            key: "c",
            value: DEFAULT_MODEL_FINGERPRINT_CONFIG,
            catalog: dummyCatalog,
            onChange: () => {},
          }),
        ],
      }),
    );
    assert.ok(enHtml.includes("Reference Model × Probe Sample Matrix"));
    assert.ok(enHtml.includes("words-zh"));
    assert.ok(enHtml.includes("Inconsistent with Declared Model"));
    assert.ok(enHtml.includes("Latest rescore: 2026-10-17T07:00:00.000Z"));
    assert.ok(enHtml.includes("Enable Model Statistical Fingerprinting"));

    const zhHtml = renderToStaticMarkup(
      React.createElement(I18nProvider, {
        initialLocale: "zh-CN",
        children: [
          React.createElement(FingerprintMatrix, {
            key: "m",
            config: DEFAULT_MODEL_FINGERPRINT_CONFIG,
            matrix: SAMPLE_MATRIX,
            fillPlan: SAMPLE_FILL_PLAN,
            busy: false,
            pendingPlan: null,
            onSelectCell: () => {},
            onRequestFillPlan: () => {},
            onConfirmFill: () => {},
            onCancelPlan: () => {},
          }),
          React.createElement(FingerprintCheckDetail, {
            key: "d",
            record: rescoredRecord,
            rescoring: false,
            onRescore: () => {},
          }),
          React.createElement(ModelFingerprintSection, {
            key: "c",
            value: DEFAULT_MODEL_FINGERPRINT_CONFIG,
            catalog: dummyCatalog,
            onChange: () => {},
          }),
        ],
      }),
    );
    assert.ok(zhHtml.includes("基准模型 × 探针有效样本矩阵"));
    assert.ok(zhHtml.includes("与声明模型不一致"));
    assert.ok(zhHtml.includes("最新重算：2026-10-17T07:00:00.000Z"));
    assert.ok(zhHtml.includes("启用模型统计指纹功能"));
  });

  it("shows /fingerprint toolbar link only for authenticated owners and hides it in readonly or guest mode (AC 13)", () => {
    const mockRouter = {
      back: () => {},
      forward: () => {},
      refresh: () => {},
      push: () => {},
      replace: () => {},
      prefetch: () => {},
    };
    const baseProps = {
      timeZone: "UTC",
      timeZones: [{ id: "UTC", label: "UTC", short: "UTC" }],
      onPickTimeZone: () => {},
      onJumpToNow: () => {},
      openMenu: null,
      onToggleMenu: () => {},
      onCloseMenus: () => {},
    };
    const renderToolbar = (owner: boolean, readonly: boolean) =>
      renderToStaticMarkup(
        React.createElement(
          AppRouterContext.Provider,
          { value: mockRouter },
          React.createElement(I18nProvider, {
            initialLocale: "en",
            children: React.createElement(ToolbarUtils, {
              ...baseProps,
              owner,
              readonly,
            }),
          }),
        ),
      );

    const ownerHtml = renderToolbar(true, false);
    assert.ok(ownerHtml.includes('href="/fingerprint"'), "Owner toolbar must include /fingerprint link");

    const readonlyHtml = renderToolbar(true, true);
    assert.equal(
      readonlyHtml.includes('href="/fingerprint"'),
      false,
      "Readonly showcase must hide /fingerprint link",
    );

    const guestHtml = renderToolbar(false, false);
    assert.equal(
      guestHtml.includes('href="/fingerprint"'),
      false,
      "Unauthenticated guest toolbar must hide /fingerprint link",
    );
  });

  it("models check target selection, profile choices, forecast, and renders FingerprintCheckPanel with RunOnce components", () => {
    const matrixWithUnready: ModelStatusEntry[] = [
      ...SAMPLE_MATRIX,
      {
        cli: "agy",
        model: "claude-opus-4-6",
        configuredInReferences: true,
        onDisk: false,
        usableProbes: [],
        probes: {
          ...SAMPLE_MATRIX[0]!.probes,
          uuid: makeGap("uuid", 0),
          number: makeGap("number", 0),
        },
      },
    ];
    const view = buildCheckTargetsView({
      config: DEFAULT_MODEL_FINGERPRINT_CONFIG,
      matrix: matrixWithUnready,
    });
    assert.equal(view.targets.length, 1);
    assert.equal(view.targets[0]!.cli, "codex");
    assert.equal(view.targets[0]!.model, "gpt-5.4");
    assert.equal(view.unreadyModels.length, 1);
    assert.equal(view.unreadyModels[0]!.model, "claude-opus-4-6");

    const zhFp = getMessages("zh-CN").fingerprint;
    const probeView = buildCheckProbeOptions(DEFAULT_MODEL_FINGERPRINT_CONFIG, zhFp);
    assert.equal(probeView.items.length, 6);
    assert.ok(probeView.items[5]!.subtitle?.includes("≥80"));

    const stateWithRelay = computeCheckSelectionState({
      config: DEFAULT_MODEL_FINGERPRINT_CONFIG,
      targets: view.targets,
      probeOptions: probeView.items,
      profiles: [{ name: "relay-1", label: "Relay One", cli: "codex", enabled: false, hasKey: true, models: [] }],
      pickedTargets: new Set([view.targets[0]!.id]),
      pickedProbes: new Set(probeView.allIds),
      storedProfiles: null,
      locale: "zh-CN",
    });
    assert.equal(stateWithRelay.mode.kind, "choose");
    assert.equal(stateWithRelay.choices.length, 2);
    assert.equal(stateWithRelay.forecast.executableProbes.length, 1);
    assert.equal(stateWithRelay.forecast.skippedProbes.length, 5);

    const drafts = buildCheckBatchDrafts({
      targets: view.targets,
      pickedTargets: new Set([view.targets[0]!.id]),
      pickedProbes: new Set(probeView.allIds),
      profiles: ["default", "relay-1"],
    });
    assert.equal(drafts.length, 2);
    assert.equal(drafts[0]!.profile, "");
    assert.equal(drafts[1]!.profile, "relay-1");
    assert.deepEqual(drafts[0]!.probes, ["uuid"]);

    const panelHtml = renderToStaticMarkup(
      React.createElement(I18nProvider, {
        initialLocale: "zh-CN",
        children: React.createElement(FingerprintCheckPanel, {
          config: DEFAULT_MODEL_FINGERPRINT_CONFIG,
          matrix: matrixWithUnready,
          profiles: [{ name: "relay-1", label: "Relay One", cli: "codex", enabled: true, hasKey: true, models: [] }],
          checks: [SAMPLE_CHECK_RECORD],
          busy: false,
          rescoringId: null,
          pendingPlan: null,
          onPreviewPlan: () => {},
          onStartCheck: () => {},
          onRescore: () => {},
        }),
      }),
    );
    assert.ok(panelHtml.includes("▶ 跑一次"));
    assert.ok(panelHtml.includes("run-once-panel"));
    assert.ok(panelHtml.includes("run-once-head-bar"));
    assert.ok(panelHtml.includes("run-once-close"));
    assert.ok(panelHtml.includes("run-once-models"));
    assert.ok(panelHtml.includes("cli-mark cli-codex"));
    assert.ok(panelHtml.includes("选择 Profile 后开始"));
    assert.ok(panelHtml.includes("暂不可选（基准样本未满额，请先在矩阵中补采）：agy/claude-opus-4-6"));
  });
});
