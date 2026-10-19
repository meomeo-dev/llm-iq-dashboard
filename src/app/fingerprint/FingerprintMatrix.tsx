"use client";

import { formatUsd } from "@/app/components/card/card-format";
import { Button } from "@/app/components/ui/Button";
import { DataTable } from "@/app/components/ui/DataTable";
import type { ModelFingerprintConfig } from "@/core/config";
import type { FillPlan, ModelStatusEntry } from "@/core/model-fingerprint/plan";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import type { CliKind } from "@/core/types";
import { formatText, useI18n } from "@/i18n";
import {
  FillProfileSelect,
  MatrixBundleBanner,
  MatrixCardHeader,
  MatrixTableHead,
  StatefulActionButton,
} from "./FingerprintMatrixHead";
import {
  buildMatrixViewModel,
  formatSimilarityScore,
  listFillableCliProfiles,
  resolveActiveProbes,
  type FillRequestOptions,
  type FingerprintProfileSummary,
  type MatrixRowViewModel,
  type SelectedProbeCell,
} from "./fingerprint-model";
import { useMatrixBundleActions } from "./use-fingerprint-bundle";

export interface FingerprintMatrixProps {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  profiles: readonly FingerprintProfileSummary[];
  fillProfiles: Partial<Record<CliKind, string>>;
  onChangeFillProfile: (cli: CliKind, profile: string) => void;
  selfTest?: SelfTestReport | null;
  canOperate?: boolean;
  busy: boolean;
  pendingPlan: FillPlan | null;
  onSelectCell: (cell: SelectedProbeCell) => void;
  onRequestFillPlan: (opts: FillRequestOptions) => void;
  onConfirmFill: () => void;
  onCancelPlan: () => void;
  onRefresh?: () => Promise<void> | void;
}

export function FingerprintMatrix(props: FingerprintMatrixProps) {
  const {
    config, matrix, profiles, fillProfiles, onChangeFillProfile,
    selfTest, canOperate = true, busy, pendingPlan, onSelectCell,
    onRequestFillPlan, onConfirmFill, onCancelPlan, onRefresh,
  } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  const activeProbes = resolveActiveProbes(config.probes);
  const rows = buildMatrixViewModel(matrix, activeProbes, config.samplesPerProbe, config.samplesByProbe);
  const matrixSpentCost = rows.some((r) => r.totalSpentCostUsd !== null)
    ? rows.reduce((sum, r) => sum + (r.totalSpentCostUsd ?? 0), 0)
    : null;
  const bundle = useMatrixBundleActions(onRefresh);
  const actionBusy = busy || bundle.importing || bundle.exportingKey !== null;

  return (
    <section className="fp-card">
      <MatrixCardHeader
        canOperate={canOperate}
        busy={actionBusy}
        importing={bundle.importing}
        totalSpentCostUsd={matrixSpentCost}
        onImportFile={(file) => void bundle.importFile(file)}
      />
      {bundle.banner && <MatrixBundleBanner banner={bundle.banner} onDismiss={() => bundle.setBanner(null)} />}
      {canOperate && pendingPlan && (
        <FillPlanPreviewBox
          plan={pendingPlan} profiles={profiles} fillProfiles={fillProfiles}
          onChangeFillProfile={onChangeFillProfile} busy={actionBusy}
          onConfirm={onConfirmFill} onCancel={onCancelPlan}
        />
      )}
      {rows.length === 0 ? (
        <p className="fp-empty-note">{fp.matrix.emptyReferences}</p>
      ) : (
        <DataTable variant="matrix" wrapClassName="fp-table-wrap" className="fp-matrix-table">
          <MatrixTableHead activeProbes={activeProbes} config={config} selfTest={selfTest} canOperate={canOperate} />
          <tbody>
            {rows.map((row) => {
              const key = `${row.cli}:${row.model}`;
              return (
                <MatrixTableRow
                  key={key} row={row} effort={config.effort} canOperate={canOperate} busy={actionBusy}
                  exporting={bundle.exportingKey === key} onSelectCell={onSelectCell}
                  onFillModel={() => onRequestFillPlan({
                    cli: row.cli, model: row.model,
                    profile: fillProfiles[row.cli] ?? "default", profilesByCli: fillProfiles,
                  })}
                  onExportModel={() => void bundle.exportRow(row.cli, row.model, config.effort)}
                />
              );
            })}
          </tbody>
        </DataTable>
      )}
    </section>
  );
}

function MatrixTableRow(props: {
  row: MatrixRowViewModel;
  effort: string;
  canOperate: boolean;
  busy: boolean;
  exporting: boolean;
  onSelectCell: (cell: SelectedProbeCell) => void;
  onFillModel: () => void;
  onExportModel: () => void;
}) {
  const { row, effort, canOperate, busy, exporting, onSelectCell, onFillModel, onExportModel } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  const effortLabel =
    row.effortHonored === false ? `${effort} → fixed` : row.appliedEffort && row.appliedEffort !== effort ? `${effort} → ${row.appliedEffort}` : effort;
  const verText = row.cliVersions?.join(", ");
  return (
    <tr>
      <td className="fp-col-model">
        <div className="fp-col-model-name">{row.model}</div>
        <div className="fp-col-model-sub">
          {formatText(fp.matrix.usableCount, { usable: row.usableProbes, total: row.totalProbes })}
          {row.totalSpentCostUsd !== null ? ` · ${formatUsd(row.totalSpentCostUsd)}` : ""}
        </div>
      </td>
      <td className="fp-col-cli">
        <code>{row.cli} · {effortLabel}</code>
        {verText && <div className="fp-col-cli-ver" title={verText}>{verText}</div>}
      </td>
      {row.cells.map((cell) => {
        const selfSimLabel =
          cell.intraProbeSim !== null && cell.intraProbeSim !== undefined
            ? formatText(fp.matrix.cellSelfSimTag, { sim: formatSimilarityScore(cell.intraProbeSim) })
            : null;
        const cellCostTag = cell.spentCostUsd != null ? formatUsd(cell.spentCostUsd) : null;
        const titleParts = [fp.matrix.fillCellTitle, selfSimLabel, cellCostTag].filter(Boolean);
        return (
          <td key={cell.probeId} className="fp-col-probe">
            <button
              type="button"
              className={`fp-cell-btn ${cell.statusClass}`}
              disabled={!canOperate}
              title={titleParts.join(" · ")}
              onClick={() => { if (canOperate) onSelectCell({ cli: row.cli, model: row.model, probe: cell.probeId }); }}
            >
              <span>{cell.progressText}</span>
              <span>{cell.usable ? (selfSimLabel ?? "✓") : `+${cell.missingValues}`}</span>
            </button>
          </td>
        );
      })}
      {canOperate && (
        <td className="fp-col-actions">
          <div className="fp-btn-row nowrap">
            <Button disabled={busy || row.totalMissingValues === 0} onClick={onFillModel}>{fp.matrix.fillSelectedBtn}</Button>
            <StatefulActionButton
              busy={busy || !row.canExport} active={exporting}
              idleLabel={fp.matrix.exportModelBtn} activeLabel={fp.matrix.exportingBtn}
              onClick={onExportModel}
            />
          </div>
        </td>
      )}
    </tr>
  );
}

function FillPlanPreviewBox({
  plan,
  profiles,
  fillProfiles,
  onChangeFillProfile,
  busy,
  onConfirm,
  onCancel,
}: {
  plan: FillPlan;
  profiles: readonly FingerprintProfileSummary[];
  fillProfiles: Partial<Record<CliKind, string>>;
  onChangeFillProfile: (cli: CliKind, profile: string) => void;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const planClis = [...new Set(plan.items.map((i) => i.cli))];
  return (
    <div className="fp-job-banner fp-plan-preview">
      <div>
        <strong>{fp.matrix.planPreviewTitle}: </strong>
        <span>
          {formatText(fp.check.planEstimatedCalls, { calls: plan.totalEstimatedCalls })} (max {plan.totalMaxCalls})
          {plan.totalEstimatedCostUsd !== null
            ? ` · ${formatText(fp.check.planEstimatedUsd, { usd: plan.totalEstimatedCostUsd.toFixed(4) })}`
            : ""}
        </span>
      </div>
      <div className="fp-btn-row">
        {planClis.map((cli) => {
          const cliProfiles = listFillableCliProfiles(cli, profiles);
          if (cliProfiles.length === 0) return null;
          return (
            <FillProfileSelect
              key={cli}
              cli={cli}
              profiles={cliProfiles}
              value={fillProfiles[cli] ?? "default"}
              disabled={busy}
              onChange={(prof) => onChangeFillProfile(cli, prof)}
            />
          );
        })}
        <Button variant="primary" disabled={busy} onClick={onConfirm}>
          {fp.matrix.confirmFillBtn}
        </Button>
        <Button disabled={busy} onClick={onCancel}>
          {t.common.actions.cancel}
        </Button>
      </div>
    </div>
  );
}
