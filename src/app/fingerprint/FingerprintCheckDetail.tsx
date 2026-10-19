"use client";

import {
  formatDuration,
  formatTokens,
  formatUsd,
} from "@/app/components/card/card-format";
import { useProfiles } from "@/app/components/profile/profiles-context";
import type {
  FingerprintCheckRecord,
  InconclusiveReason,
} from "@/core/model-fingerprint/types";
import { useI18n } from "@/i18n";
import { CheckTechDrawer } from "./FingerprintCheckTechDrawer";
import {
  buildCheckDetailViewModel,
  type CheckDetailViewModel,
} from "./fingerprint-detail-model";

export interface FingerprintCheckDetailProps {
  record: FingerprintCheckRecord;
  rescoring: boolean;
  onRescore?: (checkId: string) => void;
}

export function FingerprintCheckDetail({
  record,
  rescoring,
  onRescore,
}: FingerprintCheckDetailProps) {
  const vm = buildCheckDetailViewModel(record);
  return (
    <article className="fp-check-card">
      <CheckVerdictBanner vm={vm} record={record} />
      <ModelSimilarityRanking vm={vm} record={record} />
      <CheckProbeMiniGrid vm={vm} />
      <CheckTechDrawer vm={vm} record={record} rescoring={rescoring} onRescore={onRescore} />
    </article>
  );
}

function formatCheckCostMeta(
  vm: CheckDetailViewModel,
  multiplier: number | undefined,
  isEn: boolean,
): string | null {
  const parts: string[] = [];
  if (vm.totalDurationMs > 0) {
    parts.push(isEn ? `Time ${formatDuration(vm.totalDurationMs)}` : `耗时 ${formatDuration(vm.totalDurationMs)}`);
  }
  if (vm.totalTokens !== null) parts.push(`${formatTokens(vm.totalTokens)} tok`);
  if (vm.totalCostUsd !== null) {
    const costLabel = isEn ? `List ${formatUsd(vm.totalCostUsd)}` : `官价 ${formatUsd(vm.totalCostUsd)}`;
    if (typeof multiplier === "number" && Number.isFinite(multiplier) && multiplier !== 1) {
      parts.push(`${costLabel} (×${multiplier} → ${formatUsd(vm.totalCostUsd * multiplier)})`);
    } else {
      parts.push(costLabel);
    }
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

function CheckVerdictBanner({
  vm,
  record,
}: {
  vm: CheckDetailViewModel;
  record: FingerprintCheckRecord;
}) {
  const { profiles } = useProfiles();
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const profInfo = profiles.find((p) => p.name === vm.normProfile);
  const costMetaText = formatCheckCostMeta(vm, profInfo?.multiplier, isEn);
  const incReason = vm.activeInconclusiveReason
    ? fp.inconclusiveReasons[vm.activeInconclusiveReason as InconclusiveReason] ?? vm.activeInconclusiveReason
    : null;
  const verdictLabel = fp.verdict[vm.activeVerdict];
  let statusText: string;
  let detailText: string | null = null;
  if (vm.allProbesFailed) {
    statusText = `⚠ ${verdictLabel}`;
    detailText = isEn
      ? `All probe calls failed (0/${record.selectedProbes.length})`
      : `全部探针调用失败 (0/${record.selectedProbes.length})`;
  } else if (vm.isSingleRefPassed) {
    statusText = `✓ ${fp.check.singleRefPassedBadge}`;
  } else if (vm.activeVerdict === "consistent") {
    statusText = `✓ ${verdictLabel}`;
  } else if (vm.activeVerdict === "inconsistent") {
    statusText = `✗ ${verdictLabel}`;
    if (vm.usurperModel) {
      detailText = isEn ? `Closer to ${vm.usurperModel}` : `疑似 ${vm.usurperModel}`;
    }
  } else {
    statusText = `⚠ ${verdictLabel}`;
  }

  let subline: string;
  if (vm.allProbesFailed) {
    subline = isEn
      ? `${vm.totalAttemptCalls} calls attempted · all returned error`
      : `共尝试 ${vm.totalAttemptCalls} 次调用，全部返回错误`;
  } else if (vm.selfBoundChecked) {
    subline = isEn
      ? `Declared match ${vm.selfSimText} (${vm.selfBoundPassed ? `pass ≥ ${vm.selfLowerBoundText}` : `below ${vm.selfLowerBoundText}`})`
      : `声明匹配度 ${vm.selfSimText}（${vm.selfBoundPassed ? `合格线 ≥ ${vm.selfLowerBoundText}` : `低于合格线 ${vm.selfLowerBoundText}`}）`;
  } else {
    subline = incReason ?? verdictLabel;
  }

  const fullHeadline = detailText ? `${statusText} · ${detailText}` : statusText;
  return (
    <div className={`fp-verdict-banner tone-${vm.tone}`} title={fullHeadline}>
      <div className="fp-verdict-main">
        <span className="fp-verdict-headline">
          <span className="fp-verdict-status">{statusText}</span>
          {detailText && <span className="fp-verdict-detail">{` · ${detailText}`}</span>}
        </span>
        {vm.latestRescoreAt && (
          <span className="fp-sim-tag">{isEn ? "↻ Rescored" : "↻ 已重算"}</span>
        )}
      </div>
      <div className="fp-verdict-sub" title={subline}>
        <span>{subline}</span>
        {costMetaText && (
          <span className="fp-sim-delta" title={vm.costBreakdownTitle ?? costMetaText}>
            {costMetaText}
          </span>
        )}
      </div>
    </div>
  );
}

function ModelSimilarityRanking({
  vm,
  record,
}: {
  vm: CheckDetailViewModel;
  record: FingerprintCheckRecord;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div>
      <div className="fp-section-head">
        <span>{isEn ? "Model Similarity Ranking" : "候选模型匹配度排行"}</span>
        {vm.selfBoundChecked && (
          <span>{isEn ? `Pass line ${vm.selfLowerBoundText}` : `合格线 ${vm.selfLowerBoundText}`}</span>
        )}
      </div>
      {vm.activeView.validProbes.length === 0 ? (
        <div className="fp-sim-empty-slot">
          {vm.allProbesFailed
            ? isEn
              ? `No valid probe samples collected (${record.failedProbes.length} probes failed). Expand technical details below to inspect error logs.`
              : `本次未采集到有效探针样本（${record.failedProbes.length} 个探针调用失败），可展开下方技术明细查看详情。`
            : isEn
              ? `No usable baseline samples for ${record.declaredModel}. Fill baseline samples in the Matrix first.`
              : `${record.declaredModel} 尚无可用基准样本，请先在「基准样本矩阵」补齐。`}
        </div>
      ) : (
        <div className="fp-sim-list">
          {vm.modelRows.map((row) => {
            const rowCls = [
              row.isDeclared ? "is-declared" : "",
              row.rank === 1 ? "is-rank-top" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={row.model} className={`fp-sim-row ${rowCls}`}>
                <div className="fp-sim-fill" style={{ width: `${row.barPercent}%` }} />
                {row.boundPercent !== null && (
                  <div
                    className="fp-sim-bound-tick"
                    style={{ left: `${row.boundPercent}%` }}
                    title={isEn ? `Pass line: ${vm.selfLowerBoundText}` : `合格线：${vm.selfLowerBoundText}`}
                  />
                )}
                <div className="fp-sim-left">
                  <span className="fp-sim-rank">#{row.rank}</span>
                  <span className="fp-sim-name" title={row.model}>{row.model}</span>
                  {row.isDeclared && <span className="fp-sim-tag">{isEn ? "Declared" : "声明"}</span>}
                </div>
                <div className="fp-sim-right">
                  <span className="fp-sim-score">{row.meanSimText}</span>
                  {row.deltaText && <span className="fp-sim-delta">{row.deltaText}</span>}
                </div>
              </div>
            );
          })}
          {vm.modelRows.length === 1 && vm.isSingleRefPassed && (
            <div className="fp-sim-empty-slot">
              {isEn
                ? "Only 1 baseline model collected — fill a 2nd model in Reference Matrix to compare"
                : "当前仅 1 个基准模型 — 在「基准样本矩阵」补齐第 2 个模型后可做横向排他对比"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckProbeMiniGrid({ vm }: { vm: CheckDetailViewModel }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div>
      <div className="fp-section-head">
        <span>{isEn ? "6-Probe Performance" : "6 探针得分表现"}</span>
        <span>
          {vm.activeView.validProbes.length}/{vm.probeSlots.length} {isEn ? "valid" : "有效"}
        </span>
      </div>
      <div className="fp-modal-probe-grid">
        {vm.probeSlots.map((slot) => {
          const cellCls =
            slot.status === "skipped" || slot.status === "unselected" || slot.status === "failed"
              ? "is-muted"
              : "";
          const dotCls =
            slot.status === "valid"
              ? "status-ok"
              : slot.status === "failed"
                ? "status-error"
                : "";
          let subText: string;
          if (slot.status === "valid") {
            subText = slot.isTop
              ? slot.deltaVsRivalText
                ? isEn
                  ? `Top ${slot.deltaVsRivalText}`
                  : `最高 ${slot.deltaVsRivalText}`
                : isEn
                  ? "Valid"
                  : "有效"
              : isEn
                ? `< ${slot.bestRivalModel}`
                : `次于 ${slot.bestRivalModel}`;
          } else if (slot.status === "failed") {
            subText = isEn ? `Error (${slot.failedAttempts}x)` : `调用错误 (${slot.failedAttempts}次)`;
          } else if (slot.status === "skipped") {
            subText = isEn ? "Skipped (no ref)" : "已跳过（缺基准）";
          } else {
            subText = isEn ? "Not selected" : "未参与";
          }
          return (
            <div key={slot.probe} className={`fp-modal-probe-cell ${cellCls}`} title={slot.tooltip}>
              <div className="fp-modal-probe-top">
                <span className="fp-modal-probe-id">{slot.probe}</span>
                <span className="fp-modal-probe-val">
                  <span className={`status-dot ${dotCls}`} />
                  {slot.declaredScoreText}
                </span>
              </div>
              <div className="fp-modal-probe-sub" title={subText}>{subText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
