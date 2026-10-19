"use client";

import type { CSSProperties } from "react";
import { formatDuration, formatUsd } from "@/app/components/card/card-format";
import type { ProfileWorkItem } from "@/app/components/profile/ProfileInfoCard";
import { ProfileName } from "@/app/components/profile/ProfileName";
import { useProfiles } from "@/app/components/profile/profiles-context";
import { formatZonedClock } from "@/app/components/timeline/zoned-time";
import { Modal } from "@/app/components/ui/Modal";
import { summarizeCheckRecordMetrics } from "@/core/model-fingerprint/cost";
import type { FingerprintCheckRecord } from "@/core/model-fingerprint/types";
import { useI18n } from "@/i18n";
import { FingerprintCheckDetail } from "./FingerprintCheckDetail";
import {
  isRecordCheckPassed,
  normalizeCheckProfile,
  orderCheckRecordsByProfile,
} from "./fingerprint-timeline-model";

export interface FingerprintCheckModalProps {
  record: FingerprintCheckRecord;
  siblings?: readonly FingerprintCheckRecord[];
  timeZone: string;
  rescoring: boolean;
  rescoringId?: string | null;
  onRescore?: (checkId: string) => void;
  onClose: () => void;
}

function toCheckWorkItems(rec: FingerprintCheckRecord): readonly ProfileWorkItem[] | undefined {
  const m = summarizeCheckRecordMetrics(rec);
  if (m.callCount === 0) return undefined;
  return [{ key: rec.checkId, durationMs: m.totalDurationMs, costUsd: m.totalCostUsd }];
}

function formatRecordsCostSummary(records: readonly FingerprintCheckRecord[]): string | null {
  let totalCost = 0;
  let hasCost = false;
  let totalDur = 0;
  for (const r of records) {
    const m = summarizeCheckRecordMetrics(r);
    totalDur += m.totalDurationMs;
    if (m.totalCostUsd !== null) {
      totalCost += m.totalCostUsd;
      hasCost = true;
    }
  }
  const parts: string[] = [];
  if (totalDur > 0 && records.length === 1) parts.push(formatDuration(totalDur));
  if (hasCost) parts.push(formatUsd(totalCost));
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function FingerprintCheckModal({
  record,
  siblings = [],
  timeZone,
  rescoring,
  rescoringId,
  onRescore,
  onClose,
}: FingerprintCheckModalProps) {
  const { profiles } = useProfiles();
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const clockText = formatZonedClock(new Date(record.createdAt), timeZone);
  const ordered = orderCheckRecordsByProfile(siblings.length > 0 ? siblings : [record], profiles);
  const passedCount = ordered.filter(isRecordCheckPassed).length;
  const normProf = normalizeCheckProfile(record.profile);
  const isDefault = normProf === "default";
  const isSingle = ordered.length === 1;
  const titleText = `${record.cli} · ${record.declaredModel}`;
  const costSummary = formatRecordsCostSummary(ordered);
  return (
    <Modal
      open={true}
      onClose={onClose}
      size={isSingle ? "md" : "columns"}
      colCount={ordered.length}
      className={`modal fp-check-modal ${isSingle ? "is-single" : ""}`}
      bodyClassName="modal-body fp-check-modal-body"
      closeLabel={t.common.actions.close}
      ariaLabel={titleText}
      title={
        <span className="fp-modal-title-row">
          <span>{titleText}</span>
          {isSingle && (
            isDefault ? (
              <span className="fp-badge">{fp.check.officialProfile}</span>
            ) : (
              <ProfileName name={normProf} workItems={toCheckWorkItems(record)} />
            )
          )}
        </span>
      }
      subtitle={
        <>
          {clockText}
          {!isSingle && (
            isEn
              ? ` · ${ordered.length} profiles · ${passedCount}/${ordered.length} consistent`
              : ` · ${ordered.length} 个上游 · 一致 ${passedCount}/${ordered.length}`
          )}
          {costSummary && ` · ${costSummary}`}
        </>
      }
    >
      {!isSingle ? (
        <CheckProfileMatrix records={ordered} rescoringId={rescoringId ?? (rescoring ? record.checkId : null)} onRescore={onRescore} />
      ) : (
        <FingerprintCheckDetail record={record} rescoring={rescoring} onRescore={onRescore} />
      )}
    </Modal>
  );
}

function CheckProfileMatrix({
  records,
  rescoringId,
  onRescore,
}: {
  records: readonly FingerprintCheckRecord[];
  rescoringId: string | null;
  onRescore?: (checkId: string) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const style = { "--upstream-count": records.length } as CSSProperties;
  return (
    <div className="fp-profile-matrix profile-matrix" style={style}>
      {records.map((rec) => {
        const prof = normalizeCheckProfile(rec.profile);
        return (
          <div key={`head-${rec.checkId}`} className="profile-matrix-col">
            {prof === "default" ? (
              <span className="profile-matrix-login">{isEn ? "Official Login" : "登录态"}</span>
            ) : (
              <ProfileName name={prof} workItems={toCheckWorkItems(rec)} />
            )}
          </div>
        );
      })}
      {records.map((rec) => (
        <div key={rec.checkId} className="fp-profile-matrix-cell">
          <FingerprintCheckDetail
            record={rec}
            rescoring={rescoringId === rec.checkId}
            onRescore={onRescore}
          />
        </div>
      ))}
    </div>
  );
}
