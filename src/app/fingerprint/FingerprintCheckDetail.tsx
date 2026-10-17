"use client";

import type {
  FingerprintCheckRecord,
  InconclusiveReason,
  ModelComparisonResult,
  ProbeId,
} from "@/core/model-fingerprint/types";
import { formatText, useI18n } from "@/i18n";
import { formatPercent, formatSimilarityScore } from "./fingerprint-model";

export interface FingerprintCheckDetailProps {
  record: FingerprintCheckRecord;
  rescoring: boolean;
  onRescore: (checkId: string) => void;
}

export function FingerprintCheckDetail({
  record,
  rescoring,
  onRescore,
}: FingerprintCheckDetailProps) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const latestRescore = record.rescores[record.rescores.length - 1];
  const activeVerdict = latestRescore?.verdict ?? record.verdict;
  const activeInconclusive = latestRescore !== undefined ? latestRescore.inconclusiveReason : record.inconclusiveReason;
  const incReason = activeInconclusive
    ? fp.inconclusiveReasons[activeInconclusive as InconclusiveReason] ?? activeInconclusive
    : null;
  const activeView: FingerprintCheckRecord = latestRescore ? { ...record, ...latestRescore } : record;
  const effortBadge =
    record.effortHonored === false
      ? `${record.requestedEffort} → fixed`
      : record.appliedEffort !== record.requestedEffort
        ? `${record.requestedEffort} → ${record.appliedEffort}`
        : record.appliedEffort;

  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div>
          <div className="fp-btn-row">
            <h2 style={{ margin: 0 }}>
              {record.cli}{record.profile ? ` (${record.profile})` : ""} · {record.declaredModel}
            </h2>
            <span className={`fp-badge ${activeVerdict}`}>{fp.verdict[activeVerdict]}</span>
            {latestRescore && (
              <span className="fp-badge">
                {formatText(fp.check.rescoreLatestBadge, { at: latestRescore.rescoredAt })} ·{" "}
                {formatText(fp.check.originalVerdictLabel, { verdict: fp.verdict[record.verdict] })}
              </span>
            )}
          </div>
          <p style={{ marginTop: "4px" }}>
            <code>{record.checkId}</code> · {record.createdAt} · <code>{record.cliVersion}</code> ·{" "}
            <code>{effortBadge}</code>{incReason ? ` · ${incReason}` : ""}
          </p>
        </div>
        <button type="button" disabled={rescoring} onClick={() => onRescore(record.checkId)}>
          {rescoring ? fp.check.rescoring : fp.check.rescoreBtn}
        </button>
      </div>
      <CheckSummaryMetrics record={activeView} />
      <ProbeBreakdownTable record={activeView} />
      {activeView.comparisons.length > 0 && <CandidateComparisonTable comparisons={activeView.comparisons} />}
      <CheckProbeAttemptsSection record={activeView} />
    </div>
  );
}

function CheckSummaryMetrics({ record }: { record: FingerprintCheckRecord }) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <div className="fp-form-grid">
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {fp.check.declaredMeanLabel}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>
          {formatSimilarityScore(record.selfSim)}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {fp.check.thresholdLabel}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>
          {formatSimilarityScore(record.selfLowerBound)}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {fp.check.closestCandidateLabel}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>
          {record.closestCandidate ?? "—"}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {fp.check.usableProbesLabel} / {fp.check.coverageLabel}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>
          {record.validProbes.length} · {formatPercent(record.expectedConsistency)}
        </div>
      </div>
    </div>
  );
}

function ProbeBreakdownTable({ record }: { record: FingerprintCheckRecord }) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const models = Array.from(
    new Set([
      record.declaredModel,
      ...record.ranking.map((r) => r.model),
      ...record.comparisons.map((c) => c.candidateModel),
    ]),
  );
  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: "14px" }}>{fp.check.probeBreakdownTitle}</h3>
      <div className="fp-table-wrap">
        <table className="fp-matrix-table">
          <thead>
            <tr>
              <th>{fp.check.colProbe}</th>
              {models.map((m) => (
                <th key={m}>
                  <code>{m}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {record.validProbes.map((probeId: ProbeId) => {
              const rowScores = record.probeScores[probeId] ?? {};
              return (
                <tr key={probeId}>
                  <td>
                    <code>{probeId}</code>
                  </td>
                  {models.map((m) => (
                    <td
                      key={m}
                      style={{
                        fontWeight: m === record.declaredModel ? 600 : 400,
                      }}
                    >
                      {formatSimilarityScore(rowScores[m])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidateComparisonTable({
  comparisons,
}: {
  comparisons: readonly ModelComparisonResult[];
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: "14px" }}>
        {fp.check.candidatesComparisonTitle}
      </h3>
      <div className="fp-table-wrap">
        <table className="fp-matrix-table">
          <thead>
            <tr>
              <th>{fp.check.colCandidateModel}</th>
              <th>{fp.check.colSharedProbes}</th>
              <th>{fp.check.colDelta}</th>
              <th>{fp.check.colThreshold}</th>
              <th>{fp.check.colCandidateLowerBound}</th>
              <th>{fp.check.colDistinguishable}</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.candidateModel}>
                <td>
                  <code>{c.candidateModel}</code>
                </td>
                <td>{c.sharedProbes.join(", ")}</td>
                <td
                  style={{
                    color: c.scoreDiff < 0 ? "var(--err)" : "var(--text)",
                  }}
                >
                  {formatSimilarityScore(c.scoreDiff)}
                </td>
                <td>{formatSimilarityScore(c.threshold)}</td>
                <td>{formatSimilarityScore(c.candidateLowerBound)}</td>
                <td>{c.distinguishable ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CheckProbeAttemptsSection({ record }: { record: FingerprintCheckRecord }) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const attemptEntries = Object.entries(record.probeAttempts ?? {}).flatMap(([probeId, list]) =>
    (list ?? []).map((att) => ({ probeId: probeId as ProbeId, att })),
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {(record.skippedProbes.length > 0 || record.failedProbes.length > 0 || record.uncomparedModels.length > 0) && (
        <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
          {record.skippedProbes.length > 0 && (
            <span>
              {formatText(fp.check.skippedProbesNotice, {
                probes: record.skippedProbes.map((s) => s.probe).join(", "),
              })}{" "}
            </span>
          )}
          {record.failedProbes.length > 0 && (
            <span>· failed: {record.failedProbes.map((f) => `${f.probe}(${f.lastReason})`).join(", ")} </span>
          )}
          {record.uncomparedModels.length > 0 && (
            <span>· uncompared: {record.uncomparedModels.map((u) => u.model).join(", ")}</span>
          )}
        </div>
      )}
      {attemptEntries.length > 0 && (
        <div className="fp-table-wrap">
          <table className="fp-matrix-table">
            <thead>
              <tr>
                <th>{fp.check.colProbe}</th>
                <th>reqId</th>
                <th>{fp.drawer.codecLabel}</th>
                <th>{fp.drawer.acceptedValuesLabel}</th>
              </tr>
            </thead>
            <tbody>
              {attemptEntries.map(({ probeId, att }) => (
                <tr key={`${probeId}:${att.reqId}`}>
                  <td><code>{probeId}</code></td>
                  <td><code>{att.reqId}</code></td>
                  <td><code>{fp.outcomes[att.outcome]}</code></td>
                  <td><code style={{ wordBreak: "break-all" }}>{att.rawText.trim()}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
