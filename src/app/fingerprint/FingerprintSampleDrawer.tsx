"use client";

import { useMemo, useState } from "react";
import {
  formatAttemptCostTitle,
  formatDuration,
  formatTokens,
  formatUsd,
} from "@/app/components/card/card-format";
import { Button } from "@/app/components/ui/Button";
import { Drawer } from "@/app/components/ui/Drawer";
import { StatusPill } from "@/app/components/ui/StatusPill";
import {
  resolveAttemptCostUsd,
  sumAttemptTokens,
} from "@/core/model-fingerprint/cost";
import type { ProbeGapSummary } from "@/core/model-fingerprint/plan";
import type {
  DecodedAttemptSummary,
  RejectionReason,
} from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { formatText, useI18n } from "@/i18n";
import { FillProfileSelect } from "./FingerprintMatrixHead";
import {
  formatSimilarityScore,
  listFillableCliProfiles,
  type FingerprintProfileSummary,
  type SelectedProbeCell,
} from "./fingerprint-model";

export interface FingerprintSampleDrawerProps {
  cell: SelectedProbeCell;
  profiles?: readonly FingerprintProfileSummary[];
  selectedProfile?: string;
  onChangeProfile?: (profile: string) => void;
  attempts: readonly DecodedAttemptSummary[];
  gap: ProbeGapSummary | null;
  targetSamples: number;
  busy: boolean;
  onClose: () => void;
  onFillProbe: () => void;
  onToggleExclude: (reqId: string, currentlyExcluded: boolean) => void;
  onResetProbe: () => void;
}

type AttemptFilter = "all" | "valid" | "excluded" | "failed";

function filterTabLabel(key: AttemptFilter, count: number, isEn: boolean): string {
  if (key === "all") return `${isEn ? "All" : "全部"} (${count})`;
  if (key === "valid") return isEn ? "Valid" : "有效";
  if (key === "excluded") return isEn ? "Excluded" : "已剔除";
  return isEn ? "Rejected / Error" : "未合格/错误";
}

export function FingerprintSampleDrawer(props: FingerprintSampleDrawerProps) {
  const { cell, profiles = [], selectedProfile = "default", onChangeProfile, attempts, gap, targetSamples, busy, onClose, onFillProbe, onToggleExclude, onResetProbe } = props;
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const [filter, setFilter] = useState<AttemptFilter>("all");
  const cliProfiles = useMemo(() => listFillableCliProfiles(cell.cli, profiles), [cell.cli, profiles]);
  const filteredAttempts = useMemo(() => {
    if (filter === "valid") return attempts.filter((a) => !a.excluded && a.values.length > 0);
    if (filter === "excluded") return attempts.filter((a) => a.excluded);
    if (filter === "failed") return attempts.filter((a) => !a.excluded && a.values.length === 0);
    return attempts;
  }, [attempts, filter]);

  return (
    <Drawer
      open={true} onClose={onClose} className="fp-drawer"
      closeLabel={t.common.actions.close}
      title={formatText(fp.drawer.title, { model: `${cell.cli}/${cell.model}`, probe: cell.probe })}
      subtitle={fp.probes[cell.probe].desc}
    >
      {gap && (
        <DrawerGapActions
          cli={cell.cli} cliProfiles={cliProfiles} selectedProfile={selectedProfile}
          onChangeProfile={onChangeProfile} gap={gap} targetSamples={targetSamples}
          hasAttempts={attempts.length > 0} busy={busy} onFillProbe={onFillProbe} onResetProbe={onResetProbe}
        />
      )}
      {attempts.length > 0 && (
        <div className="fp-tabs fp-drawer-filters" role="tablist">
          {(["all", "valid", "excluded", "failed"] as const).map((key) => (
            <button
              key={key} type="button" role="tab" aria-selected={filter === key}
              className={`fp-tab ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {filterTabLabel(key, attempts.length, isEn)}
            </button>
          ))}
        </div>
      )}
      {filteredAttempts.length === 0 ? (
        <p className="fp-empty-note">{fp.drawer.noAttempts}</p>
      ) : (
        <div className="fp-attempt-list">
          {filteredAttempts.map((attempt) => (
            <AttemptCard
              key={attempt.reqId}
              attempt={attempt}
              busy={busy}
              onToggleExclude={onToggleExclude}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}

function DrawerGapActions(props: {
  cli: CliKind;
  cliProfiles: readonly FingerprintProfileSummary[];
  selectedProfile: string;
  onChangeProfile?: (profile: string) => void;
  gap: ProbeGapSummary;
  targetSamples: number;
  hasAttempts: boolean;
  busy: boolean;
  onFillProbe: () => void;
  onResetProbe: () => void;
}) {
  const { cli, cliProfiles, selectedProfile, onChangeProfile, gap, targetSamples, hasAttempts, busy, onFillProbe, onResetProbe } = props;
  const { t } = useI18n();
  const fp = t.fingerprint;
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resolvedTarget = gap.targetValues ?? targetSamples;

  return (
    <div className="fp-drawer-gap-bar">
      <div>
        <strong>
          {formatText(fp.drawer.effectiveCount, { effective: gap.validValues, target: resolvedTarget })}
        </strong>
        {" · "}
        <span className="fp-text-dim">
          {formatText(fp.drawer.targetCount, { missing: gap.missingValues, calls: gap.estimatedCalls })}
          {gap.estimatedCostUsd != null && gap.missingValues > 0 ? ` (~${formatUsd(gap.estimatedCostUsd)})` : ""}
          {gap.spentCostUsd != null ? ` · ${formatUsd(gap.spentCostUsd)}` : ""}
          {gap.totalTokens != null ? ` · ${formatTokens(gap.totalTokens)} tok` : ""}
        </span>
        {gap.intraProbeSim !== null && gap.intraProbeSim !== undefined && (
          <div className="fp-drawer-sim-note">
            {formatText(fp.drawer.intraProbeSimText, {
              mean: formatSimilarityScore(gap.intraProbeSim),
              lower: formatSimilarityScore(gap.intraProbeLowerBound),
            })}
          </div>
        )}
      </div>
      <div className="fp-btn-row">
        {cliProfiles.length > 0 && onChangeProfile && (
          <FillProfileSelect
            cli={cli}
            profiles={cliProfiles}
            value={selectedProfile}
            disabled={busy}
            onChange={onChangeProfile}
          />
        )}
        <Button variant="primary" disabled={busy || gap.missingValues === 0} onClick={onFillProbe}>
          {fp.drawer.fillProbeBtn}
        </Button>
        {!confirmingReset ? (
          <Button disabled={busy || !hasAttempts} onClick={() => setConfirmingReset(true)}>
            {fp.drawer.resetProbeBtn}
          </Button>
        ) : (
          <>
            <span className="fp-reset-warn">{fp.drawer.resetConfirmText}</span>
            <Button variant="danger" disabled={busy} onClick={() => { setConfirmingReset(false); onResetProbe(); }}>
              {t.common.actions.confirm}
            </Button>
            <Button onClick={() => setConfirmingReset(false)}>{t.common.actions.cancel}</Button>
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
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const isExcluded = attempt.excluded;
  const rejectionText = attempt.rejectionReason
    ? fp.rejectionReasons[attempt.rejectionReason as RejectionReason] ?? attempt.rejectionReason
    : null;
  const outcomeTone = attempt.outcome === "ok" ? "ok" : "err";
  const tok = sumAttemptTokens(attempt.usage);
  const cost = resolveAttemptCostUsd(attempt);
  const costTitle = formatAttemptCostTitle(
    { usage: attempt.usage, estimatedCostUsd: cost, profile: attempt.profile },
    locale,
  );

  return (
    <div className={`fp-attempt-item ${isExcluded ? "excluded" : ""}`}>
      <div className="fp-attempt-head">
        <div className="fp-btn-row">
          <code>{attempt.reqId}</code>
          <StatusPill tone={outcomeTone} dot={false} className="fp-badge">
            {fp.outcomes[attempt.outcome]}
          </StatusPill>
          {attempt.profile && attempt.profile !== "default" && (
            <StatusPill tone="neutral" dot={false} className="fp-badge">
              {attempt.profile}
            </StatusPill>
          )}
          {isExcluded && (
            <StatusPill tone="warn" dot={false} className="fp-badge not-comparable">
              {fp.drawer.excludedBadge}
            </StatusPill>
          )}
        </div>
        <Button
          size="sm"
          disabled={busy}
          onClick={() => onToggleExclude(attempt.reqId, isExcluded)}
        >
          {isExcluded ? fp.drawer.includeBtn : fp.drawer.excludeBtn}
        </Button>
      </div>
      <div className="fp-attempt-meta" title={costTitle || undefined}>
        {fp.drawer.codecLabel}: <code>{attempt.matchedCodecId ?? attempt.codecId}</code> ·{" "}
        {fp.drawer.valuesPerCallLabel}: {attempt.valuesPerCall}
        {attempt.durationMs > 0 ? ` · ${formatDuration(attempt.durationMs)}` : ""}
        {tok !== null ? ` · ${formatTokens(tok)} tok` : ""}
        {cost !== null ? ` · ${formatUsd(cost)}` : ""}
        {attempt.outcome === "ok"
          ? ` · ${fp.drawer.selfSimLabel}: ${formatSimilarityScore(attempt.sampleSelfSim)}`
          : ""}
        {attempt.values.length > 0
          ? ` · ${formatText(fp.drawer.attemptActiveWindow, {
              active: attempt.activeWindowCount,
              extracted: attempt.values.length,
            })}`
          : ""}
      </div>
      {rejectionText && (
        <div className="fp-attempt-err">{rejectionText}</div>
      )}
      {attempt.values.length > 0 && (
        <div>
          <div className="fp-attempt-values-head">
            {fp.drawer.acceptedValuesLabel} ({attempt.values.length}):
          </div>
          <pre className="fp-pre">{attempt.values.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
