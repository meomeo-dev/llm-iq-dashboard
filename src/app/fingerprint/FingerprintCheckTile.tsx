"use client";

import { VerdictIcon } from "@/app/components/icons/verdict-icons";
import { profileColor } from "@/app/components/profile/profile-color";
import { useProfiles } from "@/app/components/profile/profiles-context";
import { SLOT_COUNT_CAP } from "@/app/components/timeline/effort-slots";
import type { Verdict as JudgeVerdict } from "@/core/judge/schema";
import { PROBE_IDS, type FingerprintCheckRecord } from "@/core/model-fingerprint/types";
import { profileLabel } from "@/core/profile-view";
import { useI18n } from "@/i18n";
import {
  buildCheckCardViewModel,
  normalizeCheckProfile,
  summarizeCellVerdicts,
  type CheckCardViewModel,
  type ProbeSlotView,
} from "./fingerprint-timeline-model";

export interface FingerprintCheckTileProps {
  record: FingerprintCheckRecord;
  cellRecords?: readonly FingerprintCheckRecord[];
  profileCount?: number;
  x: number;
  onOpen: (checkId: string) => void;
}

function shortVerdictInfo(
  vm: CheckCardViewModel,
  fpCheck: ReturnType<typeof useI18n>["t"]["fingerprint"]["check"],
): { label: string; toneClass: "ok" | "err" | "warn"; icon: JudgeVerdict } {
  if (vm.activeVerdict === "consistent") {
    return {
      label: fpCheck.verdictShortConsistent,
      toneClass: "ok",
      icon: "online",
    };
  }
  if (vm.isSingleRefPassed) {
    return {
      label: fpCheck.verdictShortSingleRef,
      toneClass: "ok",
      icon: "online",
    };
  }
  if (vm.activeVerdict === "inconsistent") {
    return {
      label: fpCheck.verdictShortInconsistent,
      toneClass: "err",
      icon: "degraded",
    };
  }
  return {
    label: fpCheck.verdictShortInconclusive,
    toneClass: "warn",
    icon: "pending",
  };
}

function judgeVerdictLabel(
  verdict: JudgeVerdict,
  fpCheck: ReturnType<typeof useI18n>["t"]["fingerprint"]["check"],
): string {
  if (verdict === "online") return fpCheck.verdictShortConsistent;
  if (verdict === "degraded") return fpCheck.verdictShortInconsistent;
  return fpCheck.verdictShortInconclusive;
}

function CheckTileHead(props: {
  count: number;
  isEn: boolean;
  multiSummary: string;
  verdictCounts: ReturnType<typeof summarizeCellVerdicts>;
  fpCheck: ReturnType<typeof useI18n>["t"]["fingerprint"]["check"];
  verdict: ReturnType<typeof shortVerdictInfo>;
  isDefault: boolean;
  normProf: string;
  profText: string;
  selfSimText: string;
}) {
  return (
    <div className="fp-folder-head">
      {props.count > 1 ? (
        <>
          <span className="fp-folder-count" title={props.isEn ? `${props.count} profiles` : `${props.count} 个上游`}>
            ×{props.count}
          </span>
          <span className="fp-folder-marks" title={props.multiSummary}>
            {props.verdictCounts.map((item) => (
              <span key={item.verdict} className="verdict-badge verdict-count">
                <VerdictIcon verdict={item.verdict} label={judgeVerdictLabel(item.verdict, props.fpCheck)} />
                {Math.min(item.count, SLOT_COUNT_CAP)}
              </span>
            ))}
          </span>
        </>
      ) : (
        <>
          <span className={`fp-folder-verdict ${props.verdict.toneClass}`}>
            {!props.isDefault && (
              <span
                className="profile-dot"
                style={{ background: profileColor(props.normProf) }}
                title={props.profText}
                aria-hidden="true"
              />
            )}
            <VerdictIcon verdict={props.verdict.icon} label={props.verdict.label} />
            <span>{props.verdict.label}</span>
          </span>
          <span className="fp-folder-sim">{props.selfSimText}</span>
        </>
      )}
    </div>
  );
}

export function FingerprintCheckTile({
  record,
  cellRecords,
  profileCount,
  x,
  onOpen,
}: FingerprintCheckTileProps) {
  const { profiles } = useProfiles();
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const recordsInCell = cellRecords && cellRecords.length > 0 ? cellRecords : [record];
  const count = profileCount ?? recordsInCell.length;
  const vm = buildCheckCardViewModel(record, recordsInCell);
  const verdict = shortVerdictInfo(vm, fp.check);
  const verdictCounts = summarizeCellVerdicts(recordsInCell);
  const normProf = normalizeCheckProfile(record.profile);
  const isDefault = normProf === "default";
  const profText = isDefault ? fp.check.officialProfile : profileLabel(normProf, profiles, locale);
  const multiSummary = verdictCounts
    .map((item) => `${judgeVerdictLabel(item.verdict, fp.check)} ${item.count}`)
    .join(isEn ? ", " : "、");
  const costLabel = count > 1 ? (isEn ? `Total ${vm.costText}` : `合计 ${vm.costText}`) : isEn ? `List ${vm.costText}` : `官价 ${vm.costText}`;
  const durationLabel = isEn ? `Time ${vm.durationText}` : `耗时 ${vm.durationText}`;
  const costSuffix = vm.totalCostUsd !== null ? ` · ${costLabel}` : "";
  const titleText =
    count > 1
      ? `${record.cli} · ${record.declaredModel} · ${isEn ? `${count} profiles` : `${count} 个上游`} (${multiSummary}) · ${durationLabel}${costSuffix}`
      : `${record.cli} (${profText}) · ${record.declaredModel} · ${verdict.label} (${vm.selfSimText}) · ${durationLabel}${costSuffix}`;

  return (
    <button
      type="button"
      className="folder fp-folder"
      style={{ left: x }}
      title={titleText}
      aria-label={titleText}
      onClick={() => onOpen(record.checkId)}
    >
      <CheckTileHead
        count={count} isEn={isEn} multiSummary={multiSummary} verdictCounts={verdictCounts}
        fpCheck={fp.check} verdict={verdict} isDefault={isDefault} normProf={normProf}
        profText={profText} selfSimText={vm.selfSimText}
      />
      {vm.slots.map((slot) => (
        <ProbeSlotCell key={slot.probe} slot={slot} />
      ))}
      <div className="fp-folder-foot">
        <span className="fp-folder-duration">{durationLabel}</span>
        <span className="fp-folder-cost">{costLabel}</span>
      </div>
    </button>
  );
}

function ProbeSlotCell({ slot }: { slot: ProbeSlotView }) {
  if (slot.kind === "empty") {
    return (
      <span className="folder-slot folder-empty" title={slot.tooltip} aria-label={slot.tooltip}>
        —
      </span>
    );
  }
  return (
    <span
      className={`folder-slot fp-probe-slot slot-${slot.kind}`}
      title={slot.tooltip}
      aria-label={slot.tooltip}
    >
      <span className="fp-probe-top">
        <code className="fp-probe-name">{slot.probe}</code>
        <span className={`status-dot status-${slot.dotStatus}`} aria-hidden="true" />
      </span>
      <span className="fp-probe-score">{slot.scoreText}</span>
    </span>
  );
}

export function ProbeSlotLegend() {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <span className="slot-legend" aria-label={fp.check.probeSlotLegendTitle}>
      <span>{fp.check.probeSlotLegendTitle}</span>
      {PROBE_IDS.map((probeId, idx) => (
        <span key={probeId} className="slot-legend-item" title={fp.probes[probeId].desc}>
          <span className="slot-legend-corner" aria-hidden="true">
            {idx + 1}.
          </span>
          <code>{probeId}</code>
        </span>
      ))}
    </span>
  );
}

export function CheckVerdictLegend() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  return (
    <span className="status-legend">
      <span className="legend-item">
        <VerdictIcon verdict="online" label={fp.check.verdictShortConsistent} />
        {fp.check.verdictShortConsistent}
      </span>
      <span className="legend-item">
        <VerdictIcon verdict="degraded" label={fp.check.verdictShortInconsistent} />
        {fp.check.verdictShortInconsistent}
      </span>
      <span className="legend-item">
        <span className="status-dot status-ok" aria-hidden="true" />
        {isEn ? "Probe #1" : "探针第 1"}
      </span>
      <span className="legend-item">
        <span className="status-dot status-no-svg" aria-hidden="true" />
        {isEn ? "Other / Pending" : "非第 1 / 待定"}
      </span>
      <span className="legend-item">
        <span className="status-dot status-error" aria-hidden="true" />
        {isEn ? "Probe Failed" : "探针失败"}
      </span>
    </span>
  );
}

export function CheckEmptyDay(props: {
  hasChecks: boolean;
  hasReadyBaselines: boolean;
  isToday: boolean;
  latestDayLabel: string | null;
  onPickLatestDay: () => void;
  onSwitchToMatrix?: () => void;
  onOpenRunOnce?: () => void;
}) {
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const isEn = locale === "en";
  if (!props.hasChecks) {
    if (!props.hasReadyBaselines) {
      return (
        <>
          {isEn ? "No baseline samples collected or imported yet. Go to " : "尚未采集或导入任何基准样本。请先前往 "}
          {props.onSwitchToMatrix ? (
            <button type="button" className="matrix-empty-link" onClick={props.onSwitchToMatrix}>{fp.tabs.matrix}</button>
          ) : (
            fp.tabs.matrix
          )}
          {isEn ? " to fill or import a baseline bundle first." : " 补齐或导入基准包后再发起核验。"}
        </>
      );
    }
    return (
      <>
        {isEn ? "No channel verification records yet. Click " : "暂无渠道核验记录。点击顶部 "}
        {props.onOpenRunOnce ? (
          <button type="button" className="matrix-empty-link" onClick={props.onOpenRunOnce}>
            {isEn ? "▶ Run Once" : "▶ 跑一次"}
          </button>
        ) : (
          isEn ? "“▶ Run Once”" : "「▶ 跑一次」"
        )}
        {isEn ? " to start." : " 选择模型与渠道开始核验。"}
      </>
    );
  }
  if (props.latestDayLabel === null) return <>{fp.check.noChecksYet}</>;
  return (
    <>
      {isEn
        ? `No checks ${props.isToday ? "today" : "on this day"}. Latest check on ${props.latestDayLabel} — `
        : `${props.isToday ? "今天" : "这一天"}还没有核验记录。最近一次在 ${props.latestDayLabel}，`}
      <button type="button" className="matrix-empty-link" onClick={props.onPickLatestDay}>
        {isEn ? "View" : "查看"}
      </button>
    </>
  );
}
