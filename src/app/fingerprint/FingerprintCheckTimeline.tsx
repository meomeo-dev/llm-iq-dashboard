"use client";

import { useCallback, useMemo, useState } from "react";
import { formatUsd } from "@/app/components/card/card-format";
import { Menu } from "@/app/components/menu/Menu";
import { profileColor } from "@/app/components/profile/profile-color";
import { useProfiles } from "@/app/components/profile/profiles-context";
import { useNow } from "@/app/components/timeline/use-now";
import { useScrollAnchor } from "@/app/components/timeline/use-scroll-anchor";
import { TimelineAxis, type NowMark } from "@/app/components/timeline/TimelineAxis";
import { listDays, type DayOption } from "@/app/components/timeline/moments";
import { CELL_WIDTH, layoutColumns, timeX } from "@/app/components/timeline/track-layout";
import { formatDayLabel, formatZonedClock, zonedDayFraction, zonedDayKey } from "@/app/components/timeline/zoned-time";
import { Calendar } from "@/app/components/toolbar/Calendar";
import { profileLabel } from "@/core/profile-view";
import type { FingerprintCheckRecord } from "@/core/model-fingerprint/types";
import { formatText, useI18n } from "@/i18n";
import { FingerprintCheckModal } from "./FingerprintCheckModal";
import { CheckEmptyDay, CheckVerdictLegend, FingerprintCheckTile, ProbeSlotLegend } from "./FingerprintCheckTile";
import { formatSimilarityScore } from "./fingerprint-model";
import { computeRowConsistencyStats, groupCheckMoments, listCheckRows, listRowUpstreams, type CheckRow } from "./fingerprint-timeline-model";

export interface FingerprintCheckTimelineProps {
  sortedChecks: readonly FingerprintCheckRecord[];
  timeZone: string;
  pickedDay?: string | null;
  onPickDay?: (dayKey: string) => void;
  rescoringId: string | null;
  hasReadyBaselines?: boolean;
  onRescore?: (checkId: string) => void;
  onSwitchToMatrix?: () => void;
  onOpenRunOnce?: () => void;
}

function useCheckTimelineState(
  sortedChecks: readonly FingerprintCheckRecord[],
  timeZone: string,
  externalPickedDay?: string | null,
  externalOnPickDay?: (dayKey: string) => void,
) {
  const { profiles } = useProfiles();
  const nowDate = useNow();
  const allMoments = useMemo(
    () => groupCheckMoments(sortedChecks, timeZone, null, profiles),
    [sortedChecks, timeZone, profiles],
  );
  const days = useMemo(
    () => listDays(sortedChecks.map((c) => c.createdAt), timeZone),
    [sortedChecks, timeZone],
  );
  const todayKey = nowDate ? zonedDayKey(nowDate, timeZone) : (days[0]?.dayKey ?? "1970-01-01");
  const [internalPickedDay, setInternalPickedDay] = useState<string | null>(null);
  const pickedDay = externalPickedDay !== undefined ? externalPickedDay : internalPickedDay;
  const setPickedDay = externalOnPickDay ?? setInternalPickedDay;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [openCheckId, setOpenCheckId] = useState<string | null>(null);
  const closeCheckModal = useCallback(() => setOpenCheckId(null), []);

  const defaultDayKey = useMemo(
    () => (days.some((d) => d.dayKey === todayKey) ? todayKey : (days[0]?.dayKey ?? todayKey)),
    [days, todayKey],
  );
  const activeDayKey =
    pickedDay !== null && (pickedDay === todayKey || days.some((d) => d.dayKey === pickedDay))
      ? pickedDay
      : defaultDayKey;
  const dayMoments = useMemo(() => allMoments.filter((m) => m.dayKey === activeDayKey), [allMoments, activeDayKey]);
  const dayRecords = useMemo(() => dayMoments.flatMap((m) => m.records), [dayMoments]);
  const rows = useMemo(
    () => listCheckRows(dayRecords.length > 0 ? dayRecords : sortedChecks),
    [dayRecords, sortedChecks],
  );
  const momentByRunId = useMemo(() => new Map(dayMoments.map((m) => [m.runId, m])), [dayMoments]);
  const { columns, width, scale } = useMemo(() => layoutColumns(dayMoments, CELL_WIDTH), [dayMoments]);
  const nowMark: NowMark | null =
    nowDate !== null && activeDayKey === todayKey
      ? { fraction: zonedDayFraction(nowDate, timeZone), clock: formatZonedClock(nowDate, timeZone) }
      : null;
  const anchorX =
    columns.length > 0 ? columns[columns.length - 1]!.x : nowMark !== null ? timeX(nowMark.fraction, scale) : null;
  const scroller = useScrollAnchor(anchorX, `${activeDayKey}:${timeZone}:${columns.length}`);
  const modalRecord = useMemo(
    () => (openCheckId ? sortedChecks.find((c) => c.checkId === openCheckId) ?? null : null),
    [openCheckId, sortedChecks],
  );
  const modalSiblings = useMemo(() => {
    if (!modalRecord) return [];
    const moment = allMoments.find((m) => m.records.some((r) => r.checkId === modalRecord.checkId));
    if (!moment) return [modalRecord];
    return moment.records.filter(
      (r) => r.cli === modalRecord.cli && r.declaredModel === modalRecord.declaredModel,
    );
  }, [allMoments, modalRecord]);

  return {
    todayKey, activeDayKey, days, dayMoments, dayRecords, rows, momentByRunId,
    columns, width, scale, nowMark, scroller, calendarOpen, setCalendarOpen,
    setPickedDay, setOpenCheckId, closeCheckModal, modalRecord, modalSiblings,
  };
}

export function FingerprintCheckTimeline({
  sortedChecks,
  timeZone,
  pickedDay,
  onPickDay,
  rescoringId,
  hasReadyBaselines = true,
  onRescore,
  onSwitchToMatrix,
  onOpenRunOnce,
}: FingerprintCheckTimelineProps) {
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const st = useCheckTimelineState(sortedChecks, timeZone, pickedDay, onPickDay);
  const latestDay = st.days.find((d) => d.dayKey !== st.activeDayKey)?.dayKey ?? null;

  return (
    <section className="board-panel fp-board-panel">
      <CheckBoardHead
        activeDayKey={st.activeDayKey} todayKey={st.todayKey} days={st.days}
        showCalendar={onPickDay === undefined}
        calendarOpen={st.calendarOpen} onToggleCalendar={() => st.setCalendarOpen((v) => !v)}
        onCloseCalendar={() => st.setCalendarOpen(false)}
        onPickDay={(nextKey) => { st.setPickedDay(nextKey); st.setCalendarOpen(false); }}
      />
      <div className="matrix">
        <div className="matrix-labels">
          <div className="matrix-labels-spacer" />
          <div className="lane-head">
            {fp.check.swimlaneLaneHeader}
            <span className="lane-head-count">{formatText(fp.check.swimlaneChannelCount, { count: st.rows.length })}</span>
          </div>
          {st.rows.map((row) => (
            <CheckRowLabel key={row.key} row={row} records={st.dayRecords.length > 0 ? st.dayRecords : sortedChecks} />
          ))}
        </div>
        <div className="track" ref={st.scroller}>
          <TimelineAxis columns={st.columns} width={st.width} now={st.nowMark} scale={st.scale} />
          <div style={{ width: st.width }}>
            <div className="lane-line" />
            {st.rows.map((row) => (
              <div key={row.key} className="row-track">
                {st.columns.map(({ moment, x }) => {
                  const checkMoment = st.momentByRunId.get(moment.runId);
                  const record = checkMoment?.recordsByRow.get(row.key);
                  const cellRecords = checkMoment?.cellRecordsByRow.get(row.key) ?? [];
                  if (!record) return null;
                  return <FingerprintCheckTile key={record.checkId} record={record} cellRecords={cellRecords} profileCount={cellRecords.length} x={x} onOpen={st.setOpenCheckId} />;
                })}
              </div>
            ))}
          </div>
        </div>
        {st.dayMoments.length === 0 && (
          <p className="matrix-empty">
            <CheckEmptyDay
              hasChecks={sortedChecks.length > 0}
              hasReadyBaselines={hasReadyBaselines}
              isToday={st.activeDayKey === st.todayKey}
              latestDayLabel={latestDay ? formatDayLabel(latestDay, locale) : null}
              onPickLatestDay={() => { if (latestDay) st.setPickedDay(latestDay); }}
              onSwitchToMatrix={onSwitchToMatrix}
              onOpenRunOnce={onOpenRunOnce}
            />
          </p>
        )}
      </div>
      {st.modalRecord && (
        <FingerprintCheckModal
          record={st.modalRecord} siblings={st.modalSiblings} timeZone={timeZone}
          rescoring={rescoringId === st.modalRecord.checkId} rescoringId={rescoringId}
          onRescore={onRescore} onClose={st.closeCheckModal}
        />
      )}
    </section>
  );
}

function CheckBoardHead(props: {
  activeDayKey: string;
  todayKey: string;
  days: readonly DayOption[];
  showCalendar: boolean;
  calendarOpen: boolean;
  onToggleCalendar: () => void;
  onCloseCalendar: () => void;
  onPickDay: (dayKey: string) => void;
}) {
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const isEn = locale === "en";
  const dayLabel = formatDayLabel(props.activeDayKey, locale);

  return (
    <div className="board-head">
      <h2 className="board-title">
        {fp.check.swimlaneTitle}{" "}
        <span className="board-title-sub">{isEn ? "(24 Hours)" : "（24 小时）"}</span>
      </h2>
      <ProbeSlotLegend />
      <CheckVerdictLegend />
      {props.showCalendar && (
        <div className="fp-board-actions">
          <Menu
            label={dayLabel}
            panelClassName="day-panel"
            align="right"
            open={props.calendarOpen}
            onToggle={props.onToggleCalendar}
            onClose={props.onCloseCalendar}
          >
            <div className="day-panel-head-bar">
              <span className="day-panel-title">{isEn ? "Pick Date" : "选择日期"}</span>
              <button
                type="button"
                className="day-panel-close-btn"
                onClick={props.onCloseCalendar}
                aria-label={t.common.actions.close}
              >
                ✕
              </button>
            </div>
            <Calendar
              days={props.days}
              dayKey={props.activeDayKey}
              todayKey={props.todayKey}
              onPick={props.onPickDay}
            />
          </Menu>
        </div>
      )}
    </div>
  );
}

function CheckRowLabel({
  row,
  records,
}: {
  row: CheckRow;
  records: readonly FingerprintCheckRecord[];
}) {
  const { profiles } = useProfiles();
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const stats = computeRowConsistencyStats(row.key, records);
  const upstreams = listRowUpstreams(row.key, records, profiles);
  const joinedUpstreams = upstreams.map((n) => profileLabel(n, profiles, locale)).join(locale === "en" ? ", " : "、");

  return (
    <div className="row-label" title={`${row.cli} · ${row.declaredModel}`}>
      <span className="row-label-name">
        {row.cli} · {row.declaredModel}
      </span>
      {upstreams.length > 0 && (
        <span className="row-label-profiles" aria-label={locale === "en" ? `Profiles: ${joinedUpstreams}` : `上游：${joinedUpstreams}`}>
          {upstreams.map((name) => (
            <span key={name} className="profile-dot" style={{ background: profileColor(name) }} title={profileLabel(name, profiles, locale)} />
          ))}
        </span>
      )}
      <div className="row-pass">
        <div className="row-pass-head">
          <span>
            {formatText(fp.check.swimlaneConsistentRate, {
              passed: stats.passed,
              total: stats.total,
            })}
          </span>
          {stats.latestSelfSim !== null && (
            <span className="row-pass-pct">
              {formatText(fp.check.swimlaneLatestSelfSim, {
                sim: formatSimilarityScore(stats.latestSelfSim),
              })}
            </span>
          )}
          {stats.totalCostUsd !== null && (
            <span className="row-pass-pct">
              {locale === "en" ? `Total ${formatUsd(stats.totalCostUsd)}` : `合计 ${formatUsd(stats.totalCostUsd)}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
