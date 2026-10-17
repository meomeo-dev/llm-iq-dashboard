"use client";

import type { ModelFingerprintConfig } from "@/core/config";
import type { FillPlan, ModelStatusEntry } from "@/core/model-fingerprint/plan";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import { resolveProbeTargetSamples, type ProbeId } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { formatText, useI18n } from "@/i18n";
import {
  buildMatrixViewModel,
  formatSimilarityScore,
  resolveActiveProbes,
  type MatrixRowViewModel,
  type SelectedProbeCell,
} from "./fingerprint-model";

export interface FingerprintMatrixProps {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  fillPlan: FillPlan;
  selfTest?: SelfTestReport | null;
  busy: boolean;
  pendingPlan: FillPlan | null;
  onSelectCell: (cell: SelectedProbeCell) => void;
  onRequestFillPlan: (opts: { cli?: CliKind; model?: string; probes?: ProbeId[] }) => void;
  onConfirmFill: () => void;
  onCancelPlan: () => void;
}

export function FingerprintMatrix(props: FingerprintMatrixProps) {
  const { config, matrix, fillPlan, selfTest, busy, pendingPlan, onSelectCell, onRequestFillPlan, onConfirmFill, onCancelPlan } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  const activeProbes = resolveActiveProbes(config.probes);
  const rows = buildMatrixViewModel(matrix, activeProbes, config.samplesPerProbe, config.samplesByProbe);

  return (
    <section className="fp-card">
      <div className="fp-card-head">
        <div>
          <h2>{fp.matrix.title}</h2>
          <p>{fp.matrix.subtitle}</p>
        </div>
        <div className="fp-btn-row">
          <button type="button" className="primary" disabled={busy || fillPlan.totalPlannedValues === 0} onClick={() => onRequestFillPlan({})}>
            {fp.matrix.fillAllBtn} ({fillPlan.totalEstimatedCalls})
          </button>
        </div>
      </div>
      {pendingPlan && (
        <FillPlanPreviewBox plan={pendingPlan} busy={busy} onConfirm={onConfirmFill} onCancel={onCancelPlan} />
      )}
      {rows.length === 0 ? (
        <p style={{ color: "var(--text-dim)", margin: 0 }}>{fp.matrix.emptyReferences}</p>
      ) : (
        <div className="fp-table-wrap">
          <table className="fp-matrix-table">
            <thead>
              <tr>
                <th>{fp.matrix.modelHeader}</th>
                <th>{fp.matrix.cliEffortHeader}</th>
                {activeProbes.map((probeId: ProbeId) => {
                  const sep = selfTest?.probeSeparability?.[probeId];
                  const probeTarget = resolveProbeTargetSamples(probeId, config);
                  return (
                    <th key={probeId} title={fp.probes[probeId].desc}>
                      <div>
                        {probeId}{" "}
                        <span style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}>
                          ({formatText(fp.matrix.probeTargetTag, { target: probeTarget })})
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}>
                        {fp.probes[probeId].label}
                        {sep && sep.totalPairs > 0 ? ` (${sep.distinguishablePairs}/${sep.totalPairs})` : ""}
                      </div>
                    </th>
                  );
                })}
                <th>{t.common.actions.confirm}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <MatrixTableRow
                  key={`${row.cli}:${row.model}`}
                  row={row}
                  effort={config.effort}
                  busy={busy}
                  onSelectCell={onSelectCell}
                  onFillModel={() => onRequestFillPlan({ cli: row.cli, model: row.model })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MatrixTableRow({
  row,
  effort,
  busy,
  onSelectCell,
  onFillModel,
}: {
  row: MatrixRowViewModel;
  effort: string;
  busy: boolean;
  onSelectCell: (cell: SelectedProbeCell) => void;
  onFillModel: () => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const effortLabel =
    row.effortHonored === false
      ? `${effort} → fixed`
      : row.appliedEffort && row.appliedEffort !== effort
        ? `${effort} → ${row.appliedEffort}`
        : effort;
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{row.model}</div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {formatText(fp.matrix.usableCount, { usable: row.usableProbes, total: row.totalProbes })}
        </div>
      </td>
      <td>
        <code>
          {row.cli} · {effortLabel}
        </code>
        {row.cliVersions && row.cliVersions.length > 0 && (
          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {row.cliVersions.join(", ")}
          </div>
        )}
      </td>
      {row.cells.map((cell) => {
        const selfSimLabel =
          cell.intraProbeSim !== null && cell.intraProbeSim !== undefined
            ? formatText(fp.matrix.cellSelfSimTag, { sim: formatSimilarityScore(cell.intraProbeSim) })
            : null;
        return (
          <td key={cell.probeId}>
            <button
              type="button"
              className={`fp-cell-btn ${cell.statusClass}`}
              title={selfSimLabel ? `${fp.matrix.fillCellTitle} · ${selfSimLabel}` : fp.matrix.fillCellTitle}
              onClick={() => onSelectCell({ cli: row.cli, model: row.model, probe: cell.probeId })}
            >
              <span>{cell.progressText}</span>
              <span>{cell.usable ? (selfSimLabel ?? "✓") : `+${cell.missingValues}`}</span>
            </button>
          </td>
        );
      })}
      <td>
        <button type="button" disabled={busy || row.totalMissingValues === 0} onClick={onFillModel}>
          {fp.matrix.fillSelectedBtn}
        </button>
      </td>
    </tr>
  );
}

function FillPlanPreviewBox({
  plan,
  busy,
  onConfirm,
  onCancel,
}: {
  plan: FillPlan;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <div className="fp-job-banner" style={{ flexWrap: "wrap" }}>
      <div>
        <strong>{fp.matrix.planPreviewTitle}: </strong>
        <span>
          {formatText(fp.check.planEstimatedCalls, { calls: plan.totalEstimatedCalls })} (max{" "}
          {plan.totalMaxCalls})
          {plan.totalEstimatedCostUsd !== null
            ? ` · ${formatText(fp.check.planEstimatedUsd, {
                usd: plan.totalEstimatedCostUsd.toFixed(4),
              })}`
            : ""}
        </span>
      </div>
      <div className="fp-btn-row">
        <button type="button" className="primary" disabled={busy} onClick={onConfirm}>
          {fp.matrix.confirmFillBtn}
        </button>
        <button type="button" disabled={busy} onClick={onCancel}>
          {t.common.actions.cancel}
        </button>
      </div>
    </div>
  );
}
