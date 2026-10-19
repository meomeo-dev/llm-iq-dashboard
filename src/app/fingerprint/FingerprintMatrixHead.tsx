"use client";

import { useRef } from "react";
import { formatUsd } from "@/app/components/card/card-format";
import { AlertBanner } from "@/app/components/ui/AlertBanner";
import { Button } from "@/app/components/ui/Button";
import type { ModelFingerprintConfig } from "@/core/config";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import { resolveProbeTargetSamples, type ProbeId } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { formatText, useI18n } from "@/i18n";
import type { FingerprintProfileSummary } from "./fingerprint-model";
import type { BundleBannerState } from "./use-fingerprint-bundle";

export type { BundleBannerState };

export function FillProfileSelect({
  cli,
  profiles,
  value,
  disabled,
  onChange,
}: {
  cli: CliKind;
  profiles: readonly FingerprintProfileSummary[];
  value: string;
  disabled?: boolean;
  onChange: (profile: string) => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  if (profiles.length === 0) return null;
  return (
    <label className="fp-inline-profile-select">
      <span className="fp-inline-profile-label">
        {formatText(fp.matrix.fillProfileLabel, { cli })}:
      </span>
      <select
        className="ui-select fp-profile-select-input"
        value={value || "default"}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="default">{fp.check.officialProfile}</option>
        {profiles.map((p) => (
          <option key={p.name} value={p.name}>
            {p.label && p.label !== p.name ? `${p.label} (${p.name})` : p.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatefulActionButton({
  busy,
  active,
  idleLabel,
  activeLabel,
  className,
  onClick,
}: {
  busy: boolean;
  active: boolean;
  idleLabel: string;
  activeLabel: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button className={className} disabled={busy} onClick={onClick}>
      <span className="fp-btn-stack">
        <span className={active ? "is-hidden" : undefined} aria-hidden={active || undefined}>
          {idleLabel}
        </span>
        <span className={active ? undefined : "is-hidden"} aria-hidden={!active || undefined}>
          {activeLabel}
        </span>
      </span>
    </Button>
  );
}

export function MatrixCardHeader({
  canOperate = true,
  busy,
  importing,
  totalSpentCostUsd,
  onImportFile,
}: {
  canOperate?: boolean;
  busy: boolean;
  importing: boolean;
  totalSpentCostUsd?: number | null;
  onImportFile: (file: File) => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="fp-card-head">
      <div>
        <h2>{fp.matrix.title}</h2>
        <p>
          {fp.matrix.subtitle}
          {totalSpentCostUsd != null ? ` · ${formatUsd(totalSpentCostUsd)}` : ""}
        </p>
      </div>
      {canOperate && (
        <div className="fp-btn-row">
          <input
            ref={fileInputRef}
            type="file"
            className="fp-hidden-input"
            accept=".tar.gz,.tgz,application/gzip,application/x-gzip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onImportFile(file);
            }}
          />
          <StatefulActionButton
            busy={busy}
            active={importing}
            idleLabel={fp.matrix.importBundleBtn}
            activeLabel={fp.matrix.importingBtn}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      )}
    </div>
  );
}

export function MatrixBundleBanner({
  banner,
  onDismiss,
}: {
  banner: Exclude<BundleBannerState, null>;
  onDismiss: () => void;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const isOk = banner.kind === "ok";
  const text = isOk
    ? formatText(fp.matrix.importSuccessBanner, {
        cli: banner.data.cli,
        effort: banner.data.requestedEffort,
        model: banner.data.model,
        probes: banner.data.importedProbes.length,
        values: banner.data.totalValidValues,
      })
    : banner.message;
  return (
    <AlertBanner tone={isOk ? "ok" : "err"} className="fp-job-banner" onDismiss={onDismiss}>
      {text}
    </AlertBanner>
  );
}

export function MatrixTableHead({
  activeProbes,
  config,
  selfTest,
  canOperate = true,
}: {
  activeProbes: readonly ProbeId[];
  config: ModelFingerprintConfig;
  selfTest?: SelfTestReport | null;
  canOperate?: boolean;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <thead>
      <tr>
        <th className="fp-col-model">{fp.matrix.modelHeader}</th>
        <th className="fp-col-cli">{fp.matrix.cliEffortHeader}</th>
        {activeProbes.map((probeId: ProbeId) => {
          const sep = selfTest?.probeSeparability?.[probeId];
          const probeTarget = resolveProbeTargetSamples(probeId, config);
          return (
            <th key={probeId} className="fp-col-probe" title={fp.probes[probeId].desc}>
              <div>
                {probeId}{" "}
                <span className="fp-col-probe-meta">
                  ({formatText(fp.matrix.probeTargetTag, { target: probeTarget })})
                </span>
              </div>
              <div className="fp-col-probe-meta">
                {fp.probes[probeId].label}
                {sep && sep.totalPairs > 0 ? ` (${sep.distinguishablePairs}/${sep.totalPairs})` : ""}
              </div>
            </th>
          );
        })}
        {canOperate && <th className="fp-col-actions">{t.common.actions.confirm}</th>}
      </tr>
    </thead>
  );
}
