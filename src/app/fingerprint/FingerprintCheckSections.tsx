"use client";

import type { StartMode } from "@/app/components/run-control/run-once-profiles";
import type { FingerprintJobView } from "@/core/model-fingerprint/job";
import type { VerificationCheckPlan } from "@/core/model-fingerprint/plan";
import type { FingerprintCheckRecord } from "@/core/model-fingerprint/types";
import { formatText, useI18n, type Locale } from "@/i18n";
import { FingerprintCheckDetail } from "./FingerprintCheckDetail";
import type { CheckForecastSummary, UnreadyCheckModel } from "./fingerprint-check-model";
import { formatPercent } from "./fingerprint-model";

export function checkStartLabel(
  mode: StartMode,
  busy: boolean,
  jobActive: boolean,
  locale: Locale,
): string {
  const isEn = locale === "en";
  if (busy && !jobActive) return isEn ? "Starting…" : "发起中…";
  if (jobActive) return isEn ? "Verification running…" : "核验执行中…";
  if (mode.kind === "choose") return isEn ? "Select Profiles & Start" : "选择 Profile 后开始";
  if (mode.kind === "none") return mode.reason;
  return isEn ? `Start (${mode.calls} calls)` : `开始（${mode.calls} 次调用）`;
}

export function UnreadyBaselineNote({
  unready,
  locale,
}: {
  unready: readonly UnreadyCheckModel[];
  locale: Locale;
}) {
  if (unready.length === 0) return null;
  const isEn = locale === "en";
  const names = unready.map((m) => `${m.cli}/${m.model}`).join(isEn ? ", " : "、");
  return (
    <p className="run-once-unavailable">
      {isEn
        ? `Unavailable (baseline samples not full yet, fill in matrix first): ${names}`
        : `暂不可选（基准样本未满额，请先在矩阵中补采）：${names}`}
    </p>
  );
}

export function CheckLauncherFooter(props: {
  forecast: CheckForecastSummary;
  pendingPlan: VerificationCheckPlan | null;
  mode: StartMode;
  busy: boolean;
  activeJob: FingerprintJobView | null;
  nothingToRun: boolean;
  locale: Locale;
  onPreview: () => void;
  onStart: () => void;
  onCancelJob?: () => void;
}) {
  const { forecast, pendingPlan, mode, busy, activeJob, nothingToRun, locale, onPreview, onStart, onCancelJob } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <footer className="run-once-foot">
      <p className="run-once-forecast">
        <span>
          {formatText(fp.check.planEstimatedCalls, { calls: forecast.totalEstimatedCalls })} (max {forecast.totalMaxCalls})
        </span>
        {pendingPlan?.totalEstimatedCostUsd != null && (
          <span>
            {formatText(fp.check.planEstimatedUsd, { usd: pendingPlan.totalEstimatedCostUsd.toFixed(4) })}
          </span>
        )}
        {forecast.expectedConsistency !== null && (
          <span>
            {formatText(fp.check.planExpectedConsistency, { rate: formatPercent(forecast.expectedConsistency) })}
          </span>
        )}
        {forecast.executableProbes.length > 0 && (
          <span>
            {formatText(fp.check.planExecutableProbes, { probes: forecast.executableProbes.join(", ") })}
          </span>
        )}
        {forecast.skippedProbes.length > 0 && (
          <span style={{ color: "var(--warn)" }}>
            {formatText(fp.check.skippedProbesNotice, {
              probes: forecast.skippedProbes.map((s) => `${s.probe} (+${s.estimatedCalls})`).join(", "),
            })}
          </span>
        )}
      </p>
      {activeJob !== null && onCancelJob && (
        <button type="button" className="run-stop" onClick={onCancelJob}>
          {fp.matrix.cancelJobBtn}
        </button>
      )}
      <button type="button" className="profile-modal-cancel" disabled={busy || nothingToRun} onClick={onPreview}>
        {fp.check.previewPlanBtn}
      </button>
      <button type="button" className="run-once-start" disabled={busy || nothingToRun} onClick={onStart}>
        {checkStartLabel(mode, busy, activeJob !== null, locale)}
      </button>
    </footer>
  );
}

export function CheckHistorySection({
  sortedChecks,
  selectedRecord,
  rescoringId,
  onSelectCheck,
  onRescore,
  onOpenRunOnce,
}: {
  sortedChecks: readonly FingerprintCheckRecord[];
  selectedRecord: FingerprintCheckRecord | null;
  rescoringId: string | null;
  onSelectCheck: (checkId: string) => void;
  onRescore: (checkId: string) => void;
  onOpenRunOnce?: () => void;
}) {
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const isEn = locale === "en";
  if (sortedChecks.length === 0) {
    return (
      <section className="fp-card">
        <div className="fp-card-head">
          <p style={{ color: "var(--text-dim)", margin: 0 }}>{fp.check.noChecksYet}</p>
          {onOpenRunOnce && (
            <button type="button" className="primary" onClick={onOpenRunOnce}>
              {isEn ? "▶ Run Once" : "▶ 跑一次"}
            </button>
          )}
        </div>
      </section>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="fp-btn-row">
        {sortedChecks.map((item) => (
          <button
            key={item.checkId}
            type="button"
            className={`fp-tab ${(selectedRecord?.checkId ?? null) === item.checkId ? "active" : ""}`}
            onClick={() => onSelectCheck(item.checkId)}
          >
            <code>{item.profile || item.cli}</code> · {item.declaredModel} ({fp.verdict[item.verdict]})
          </button>
        ))}
      </div>
      {selectedRecord && (
        <FingerprintCheckDetail
          record={selectedRecord}
          rescoring={rescoringId === selectedRecord.checkId}
          onRescore={onRescore}
        />
      )}
    </div>
  );
}
