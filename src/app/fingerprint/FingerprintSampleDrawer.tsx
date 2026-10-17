"use client";

import { useState } from "react";
import type { ProbeGapSummary } from "@/core/model-fingerprint/plan";
import type {
  DecodedAttemptSummary,
  RejectionReason,
} from "@/core/model-fingerprint/types";
import { formatText, useI18n } from "@/i18n";
import { formatSimilarityScore, type SelectedProbeCell } from "./fingerprint-model";

export interface FingerprintSampleDrawerProps {
  cell: SelectedProbeCell;
  attempts: readonly DecodedAttemptSummary[];
  gap: ProbeGapSummary | null;
  targetSamples: number;
  busy: boolean;
  onClose: () => void;
  onFillProbe: () => void;
  onToggleExclude: (reqId: string, currentlyExcluded: boolean) => void;
  onResetProbe: () => void;
}

export function FingerprintSampleDrawer({
  cell,
  attempts,
  gap,
  targetSamples,
  busy,
  onClose,
  onFillProbe,
  onToggleExclude,
  onResetProbe,
}: FingerprintSampleDrawerProps) {
  const { t } = useI18n();
  const fp = t.fingerprint;

  return (
    <div className="fp-drawer-backdrop" onClick={onClose}>
      <aside className="fp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="fp-card-head">
          <div>
            <h2>
              {formatText(fp.drawer.title, {
                model: `${cell.cli}/${cell.model}`,
                probe: cell.probe,
              })}
            </h2>
            <p>{fp.probes[cell.probe].desc}</p>
          </div>
          <button type="button" onClick={onClose}>
            {t.common.actions.close}
          </button>
        </div>

        {gap && (
          <DrawerGapActions
            gap={gap}
            targetSamples={targetSamples}
            hasAttempts={attempts.length > 0}
            busy={busy}
            onFillProbe={onFillProbe}
            onResetProbe={onResetProbe}
          />
        )}

        {attempts.length === 0 ? (
          <p style={{ color: "var(--text-dim)" }}>{fp.drawer.noAttempts}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {attempts.map((attempt) => (
              <AttemptCard
                key={attempt.reqId}
                attempt={attempt}
                busy={busy}
                onToggleExclude={onToggleExclude}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

function DrawerGapActions(props: {
  gap: ProbeGapSummary;
  targetSamples: number;
  hasAttempts: boolean;
  busy: boolean;
  onFillProbe: () => void;
  onResetProbe: () => void;
}) {
  const { gap, targetSamples, hasAttempts, busy, onFillProbe, onResetProbe } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resolvedTarget = gap.targetValues ?? targetSamples;

  return (
    <div className="fp-btn-row" style={{ justifyContent: "space-between" }}>
      <div>
        <strong>
          {formatText(fp.drawer.effectiveCount, { effective: gap.validValues, target: resolvedTarget })}
        </strong>
        {" · "}
        <span style={{ color: "var(--text-dim)" }}>
          {formatText(fp.drawer.targetCount, { missing: gap.missingValues, calls: gap.estimatedCalls })}
        </span>
        {gap.intraProbeSim !== null && gap.intraProbeSim !== undefined && (
          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>
            {formatText(fp.drawer.intraProbeSimText, {
              mean: formatSimilarityScore(gap.intraProbeSim),
              lower: formatSimilarityScore(gap.intraProbeLowerBound),
            })}
          </div>
        )}
      </div>
      <div className="fp-btn-row">
        <button type="button" className="primary" disabled={busy || gap.missingValues === 0} onClick={onFillProbe}>
          {fp.drawer.fillProbeBtn}
        </button>
        {!confirmingReset ? (
          <button type="button" disabled={busy || !hasAttempts} onClick={() => setConfirmingReset(true)}>
            {fp.drawer.resetProbeBtn}
          </button>
        ) : (
          <>
            <span style={{ fontSize: "12px", color: "var(--warn)" }}>{fp.drawer.resetConfirmText}</span>
            <button type="button" disabled={busy} onClick={() => { setConfirmingReset(false); onResetProbe(); }}>
              {t.common.actions.confirm}
            </button>
            <button type="button" onClick={() => setConfirmingReset(false)}>{t.common.actions.cancel}</button>
          </>
        )}
      </div>
    </div>
  );
}

function AttemptCard({
  attempt,
  busy,
  onToggleExclude,
}: {
  attempt: DecodedAttemptSummary;
  busy: boolean;
  onToggleExclude: (reqId: string, currentlyExcluded: boolean) => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const isExcluded = attempt.excluded;
  const rejectionText = attempt.rejectionReason
    ? fp.rejectionReasons[attempt.rejectionReason as RejectionReason] ?? attempt.rejectionReason
    : null;

  return (
    <div className={`fp-attempt-item ${isExcluded ? "excluded" : ""}`}>
      <div className="fp-btn-row" style={{ justifyContent: "space-between" }}>
        <div className="fp-btn-row">
          <code>{attempt.reqId}</code>
          <span className="fp-badge">{fp.outcomes[attempt.outcome]}</span>
          {isExcluded && <span className="fp-badge not-comparable">{fp.drawer.excludedBadge}</span>}
          <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {fp.drawer.codecLabel}: <code>{attempt.matchedCodecId ?? attempt.codecId}</code> ·{" "}
            {fp.drawer.valuesPerCallLabel}: {attempt.valuesPerCall}
            {attempt.outcome === "ok"
              ? ` · ${fp.drawer.selfSimLabel}: ${formatSimilarityScore(attempt.sampleSelfSim)}`
              : ""}
            {attempt.values.length > 0
              ? ` · ${formatText(fp.drawer.attemptActiveWindow, {
                  active: attempt.activeWindowCount,
                  extracted: attempt.values.length,
                })}`
              : ""}
          </span>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => onToggleExclude(attempt.reqId, isExcluded)}
        >
          {isExcluded ? fp.drawer.includeBtn : fp.drawer.excludeBtn}
        </button>
      </div>
      {rejectionText && (
        <div style={{ fontSize: "12px", color: "var(--err)" }}>{rejectionText}</div>
      )}
      {attempt.values.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "2px" }}>
            {fp.drawer.acceptedValuesLabel} ({attempt.values.length}):
          </div>
          <pre className="fp-pre">{attempt.values.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
