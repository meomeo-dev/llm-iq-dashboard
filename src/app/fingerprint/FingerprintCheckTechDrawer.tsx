"use client";

import {
  formatAttemptCostTitle,
  formatDuration,
  formatTokens,
  formatUsd,
} from "@/app/components/card/card-format";
import { DataTable } from "@/app/components/ui/DataTable";
import { Collapsible } from "@/app/components/ui/Drawer";
import {
  resolveAttemptCostUsd,
  sumAttemptTokens,
} from "@/core/model-fingerprint/cost";
import type {
  FingerprintCheckRecord,
  ModelComparisonResult,
  ProbeId,
} from "@/core/model-fingerprint/types";
import { formatText, useI18n } from "@/i18n";
import { StatefulActionButton } from "./FingerprintMatrixHead";
import {
  resolveModelMeanSim,
  type CheckDetailViewModel,
} from "./fingerprint-detail-model";
import { formatSimilarityScore } from "./fingerprint-model";

export function CheckTechDrawer({
  vm,
  record,
  rescoring,
  onRescore,
}: {
  vm: CheckDetailViewModel;
  record: FingerprintCheckRecord;
  rescoring: boolean;
  onRescore?: (checkId: string) => void;
}) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const summaryExtraParts = [
    vm.totalDurationMs > 0 ? formatDuration(vm.totalDurationMs) : null,
    vm.totalTokens !== null ? `${formatTokens(vm.totalTokens)} tok` : null,
    vm.totalCostUsd !== null ? formatUsd(vm.totalCostUsd) : null,
    record.appliedEffort,
  ].filter(Boolean);
  return (
    <Collapsible
      className="fp-tech-drawer"
      summaryClassName="fp-tech-summary"
      bodyClassName="fp-tech-body"
      summary={
        isEn
          ? `Technical Details & Raw Samples (${vm.totalAttemptCalls} calls)`
          : `展开技术明细与原始采样（${vm.totalAttemptCalls} 次调用）`
      }
      summaryExtra={summaryExtraParts.join(" · ")}
    >
      <div className="fp-tech-meta-bar">
        <div>
          <code>{record.checkId}</code> · <code>{record.cliVersion}</code> · <code>{vm.effortBadge}</code>
          {vm.latestRescoreAt && (
            <>
              {" · "}
              <span>{formatText(fp.check.rescoreLatestBadge, { at: vm.latestRescoreAt })}</span>
              {" · "}
              <span>{formatText(fp.check.originalVerdictLabel, { verdict: fp.verdict[vm.originalVerdict] })}</span>
            </>
          )}
        </div>
        {onRescore && (
          <StatefulActionButton
            busy={rescoring}
            active={rescoring}
            idleLabel={fp.check.rescoreBtn}
            activeLabel={fp.check.rescoring}
            onClick={() => onRescore(record.checkId)}
          />
        )}
      </div>
      <ProbeBreakdownTable record={vm.activeView} />
      {vm.activeView.comparisons.length > 0 && (
        <CandidateComparisonTable comparisons={vm.activeView.comparisons} />
      )}
      <CheckProbeAttemptsSection record={vm.activeView} />
    </Collapsible>
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
  const declaredMean = resolveModelMeanSim(record, record.declaredModel);
  return (
    <div>
      <h3 className="fp-tech-subhead">{fp.check.probeBreakdownTitle}</h3>
      <DataTable variant="compact" wrapClassName="fp-table-wrap">
        <thead>
          <tr>
            <th>{fp.check.colProbe}</th>
            {models.map((m) => (
              <th key={m}><code>{m}</code></th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="fp-tech-mean-row">
            <td className="fp-tech-bold">{fp.check.rowMeanSim}</td>
            {models.map((m) => {
              const meanSim = resolveModelMeanSim(record, m);
              const diff =
                m !== record.declaredModel && meanSim !== null && declaredMean !== null
                  ? meanSim - declaredMean
                  : null;
              return (
                <td key={m} className="fp-tech-bold">
                  <span>{formatSimilarityScore(meanSim)}</span>
                  {diff !== null && (
                    <span className="fp-tech-diff">
                      {` (${diff >= 0 ? "+" : ""}${diff.toFixed(4)})`}
                    </span>
                  )}
                </td>
              );
            })}
          </tr>
          {record.validProbes.map((probeId: ProbeId) => {
            const rowScores = record.probeScores[probeId] ?? {};
            return (
              <tr key={probeId}>
                <td><code>{probeId}</code></td>
                {models.map((m) => (
                  <td key={m} className={m === record.declaredModel ? "fp-tech-bold" : undefined}>
                    {formatSimilarityScore(rowScores[m])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </div>
  );
}

function CandidateComparisonTable({ comparisons }: { comparisons: readonly ModelComparisonResult[] }) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <div>
      <h3 className="fp-tech-subhead">{fp.check.candidatesComparisonTitle}</h3>
      <DataTable variant="compact" wrapClassName="fp-table-wrap">
        <thead>
          <tr>
            <th>{fp.check.colCandidateModel}</th>
            <th>{fp.check.colSharedProbes}</th>
            <th>{fp.check.colCandidateSim}</th>
            <th>{fp.check.colDelta}</th>
            <th>{fp.check.colThreshold}</th>
            <th>{fp.check.colCandidateLowerBound}</th>
            <th>{fp.check.colDistinguishable}</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.candidateModel}>
              <td><code>{c.candidateModel}</code></td>
              <td>{c.sharedProbes.join(", ")}</td>
              <td className="fp-tech-bold">{formatSimilarityScore(c.candidateSelfSim)}</td>
              <td className={c.scoreDiff < 0 ? "fp-tech-lead" : "fp-tech-lag"}>
                {formatSimilarityScore(c.scoreDiff)}
              </td>
              <td>{formatSimilarityScore(c.threshold)}</td>
              <td>{formatSimilarityScore(c.candidateLowerBound)}</td>
              <td>{c.distinguishable ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}

export function CheckProbeAttemptsSection({ record }: { record: FingerprintCheckRecord }) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const attemptEntries = Object.entries(record.probeAttempts ?? {}).flatMap(([probeId, list]) =>
    (list ?? []).map((att) => ({ probeId: probeId as ProbeId, att })),
  );
  return (
    <div className="fp-tech-attempts">
      {(record.skippedProbes.length > 0 || record.failedProbes.length > 0 || record.uncomparedModels.length > 0) && (
        <div className="fp-tech-notice">
          {record.skippedProbes.length > 0 && (
            <span>
              {formatText(fp.check.skippedProbesNotice, {
                probes: record.skippedProbes.map((s) => s.probe).join(", "),
              })}{" "}
            </span>
          )}
          {record.failedProbes.length > 0 && (
            <span>
              {`· ${isEn ? "failed" : "失败"}: ${record.failedProbes.map((f) => `${f.probe}(${f.lastReason})`).join(", ")} `}
            </span>
          )}
          {record.uncomparedModels.length > 0 && (
            <span>
              {`· ${isEn ? "uncompared" : "未比对"}: ${record.uncomparedModels.map((u) => u.model).join(", ")}`}
            </span>
          )}
        </div>
      )}
      {attemptEntries.length > 0 && (
        <DataTable variant="compact" wrapClassName="fp-table-wrap">
          <thead>
            <tr>
              <th>{fp.check.colProbe}</th>
              <th>reqId</th>
              <th>{isEn ? "Status" : "状态"}</th>
              <th>{isEn ? "Time" : "耗时"}</th>
              <th>Token</th>
              <th>{isEn ? "Cost" : "成本"}</th>
              <th>{isEn ? "Raw Output" : "原始输出"}</th>
            </tr>
          </thead>
          <tbody>
            {attemptEntries.map(({ probeId, att }) => {
              const tok = sumAttemptTokens(att.usage);
              const cost = resolveAttemptCostUsd(att);
              const costTitle = formatAttemptCostTitle(
                { usage: att.usage, estimatedCostUsd: cost, profile: record.profile },
                locale,
              );
              return (
                <tr key={`${probeId}:${att.reqId}`}>
                  <td><code>{probeId}</code></td>
                  <td><code>{att.reqId}</code></td>
                  <td><code>{fp.outcomes[att.outcome]}</code></td>
                  <td><code>{att.durationMs > 0 ? formatDuration(att.durationMs) : "—"}</code></td>
                  <td title={costTitle || undefined}><code>{tok !== null ? formatTokens(tok) : "—"}</code></td>
                  <td title={costTitle || undefined}><code>{cost !== null ? formatUsd(cost) : "—"}</code></td>
                  <td><code className="fp-tech-raw">{att.rawText.trim()}</code></td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}
