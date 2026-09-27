"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { ExportMenu } from "./export/ExportMenu";
import { isCardShown, isFiltered, NO_FILTERS, type HiddenFilters } from "./toolbar/filters";
import { ModelModal } from "./model-modal/ModelModal";
import { Toolbar } from "./toolbar/Toolbar";
import { SlotLegend, StatusLegend } from "./timeline/FolderTile";
import { RunGrid, type OpenCell } from "./timeline/RunGrid";
import { planSlots } from "./timeline/effort-slots";
import { filterMoment, groupMoments, listDays, listEfforts, type Moment } from "./timeline/moments";
import { rowKeyOf, type Row } from "./timeline/rows";
import type { NowMark } from "./timeline/TimelineAxis";
import { useStoredTimeZone } from "./timeline/use-stored-time-zone";
import { formatDayLabel, formatZonedClock, listTimeZones, zonedDayFraction, zonedDayKey } from "./timeline/zoned-time";
import "./toolbar/toolbar.css";
import "./menu/menu.css";
import "./toolbar/calendar.css";
import "./timeline/timeline.css";
import "./timeline/folder.css";
import "./card/cards.css";
import "./model-modal/model-modal.css";
import "./run-status/run-status.css";
import "./run-control/run-control.css";

/** 尚无任何轮次时时间线里的引导 */
const FIRST_RUN_HINT = "还没有运行记录。所有者登录后点右上角“▶ 跑一次”开始。";

/** 现在线的刷新间隔 */
const NOW_INTERVAL_MS = 60_000;

/**
 * 看板主体：工具栏 + 当天的时间轨道（24 小时轴与结果矩阵共用一条 x 轴），
 * 点格子打开模态窗。日期与时刻按所选时区换算；pickedDay 为 null 表示跟随今天
 * （过零点自动换天）。
 */
export function Dashboard({
  owner,
  readonly = false,
  remote = false,
  cards,
  runStarts,
  initialDay,
  promptLabels,
  promptStandards = {},
  scheduleTimeZone,
}: {
  /** 所有者视角（有效的设备 cookie），决定是否显示操作控件 */
  owner: boolean;
  /** 只读部署模式，不显示钥匙入口，显示只读展台徽章 */
  readonly?: boolean;
  /** 是否使用远程数据源 */
  remote?: boolean;
  /** 所选那天前后的卡片（服务端按 URL 的 day 参数载入） */
  cards: DashboardCard[];
  /** 全部轮次的开始时刻，供日历标出每天的轮数 */
  runStarts: readonly string[];
  /** URL 里带着的日期；没有则跟随今天 */
  initialDay: string | null;
  promptLabels: Readonly<Record<string, string>>;
  promptStandards?: Readonly<Record<string, PromptStandard>>;
  /** 调度器 cron 的时区；配置里留空时为 null */
  scheduleTimeZone: string | null;
}) {
  const [hidden, setHidden] = useState<HiddenFilters>(NO_FILTERS);
  const [pickedDay, setPickedDay] = useState<string | null>(initialDay);
  const [openCell, setOpenCell] = useState<OpenCell | null>(null);
  // 每次回到现在都递增，让时间线重新滚到现在
  const [jumpCount, setJumpCount] = useState(0);
  const [timeZone, pickTimeZone] = useStoredTimeZone();
  const now = useNow();
  // 页面数据由 useRunProgress 在完成数变化时刷新（见 ACR-002、ACR-003）
  useDayInUrl(pickedDay);

  // 时区与现在只在挂载后才有；之前不计算，避免与服务端渲染结果不一致（hydration）
  const ready = timeZone !== null && now !== null;
  const moments = useMemo(() => (timeZone === null ? [] : groupMoments(cards, timeZone)), [cards, timeZone]);
  const days = useMemo(() => (timeZone === null ? [] : listDays(runStarts, timeZone)), [runStarts, timeZone]);
  const todayKey = ready ? zonedDayKey(now, timeZone) : null;
  const isShowcase = readonly || remote;
  const todayHasRuns = ready && todayKey !== null && days.some((d) => d.dayKey === todayKey && d.momentCount > 0);
  // 远程或只读展台下，未显式指定日期且访客时区今天无轮次时，默认落到最近有数据的一天
  const defaultShowcaseDay = isShowcase && !todayHasRuns && days.length > 0 ? days[0]?.dayKey ?? null : null;
  const dayKey = pickedDay ?? defaultShowcaseDay ?? todayKey;
  const nowMark: NowMark | null =
    ready && dayKey === todayKey ? { fraction: zonedDayFraction(now, timeZone), clock: formatZonedClock(now, timeZone) } : null;
  const timeZones = useMemo(() => (timeZone === null ? [] : listTimeZones(scheduleTimeZone)), [timeZone, scheduleTimeZone]);
  const dayMoments = useMemo(
    () => moments.filter((m) => m.dayKey === dayKey).sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
    [moments, dayKey],
  );
  const dayCards = useMemo(() => dayMoments.flatMap((moment) => moment.cards), [dayMoments]);

  const visible = useMemo(
    () =>
      dayMoments
        .map((moment) => filterMoment(moment, (card) => isCardShown(card, hidden)))
        .filter((moment) => moment.cards.length > 0),
    [dayMoments, hidden],
  );
  const efforts = useMemo(() => listEfforts(visible.flatMap((moment) => moment.cards)), [visible]);
  // 打开的格子被筛掉或换天后消失时，模态窗随之关闭
  const opened = resolveOpenCell(openCell, visible);
  // 保持引用稳定：模态窗据此注册 Esc 监听与焦点恢复，不应随每分钟的重绘重新注册
  const closeModal = useCallback(() => setOpenCell(null), []);

  const jumpToNow = (): void => {
    // 远程展台若今天无数据，点回到现在时显式切到今天展示空引导；有数据或本地模式清空跟随今天
    setPickedDay(isShowcase && !todayHasRuns ? todayKey : null);
    setJumpCount((count) => count + 1);
  };

  if (!ready || todayKey === null || dayKey === null) return <div className="workspace" />;

  return (
    <div className="workspace">
      <Toolbar
        owner={owner}
        readonly={readonly}
        remote={remote}
        cards={dayCards}
        promptLabels={promptLabels}
        days={days}
        dayKey={dayKey}
        todayKey={todayKey}
        timeZone={timeZone}
        timeZones={timeZones}
        onPickTimeZone={(next) => {
          pickTimeZone(next);
          setPickedDay(null);
        }}
        onJumpToNow={jumpToNow}
        hidden={hidden}
        onHidden={(key, values) => setHidden((current) => ({ ...current, [key]: values }))}
        onPickDay={(next) => {
          if (isShowcase) {
            setPickedDay(next);
          } else {
            setPickedDay(next === todayKey ? null : next);
          }
        }}
        stats={summarize(dayCards)}
      />
      <main className="board">
        <section className="board-panel">
          <div className="board-head">
            <h2 className="board-title">
              执行时间线 <span className="board-title-sub">（24 小时）</span>
            </h2>
            <SlotLegend slots={planSlots(efforts)} />
            <StatusLegend />
            <ExportMenu
              moments={visible}
              efforts={efforts}
              now={nowMark}
              dayKey={dayKey}
              timeZone={timeZone}
              filtered={isFiltered(hidden)}
            />
          </div>
          <RunGrid
            scrollKey={`${dayKey}|${timeZone}|${jumpCount}`}
            now={nowMark}
            moments={visible}
            efforts={efforts}
            onOpen={setOpenCell}
            emptyContent={
              <EmptyDay
                hasRuns={runStarts.length > 0}
                dayHasRuns={dayMoments.length > 0}
                isToday={dayKey === todayKey}
                latestDay={days.find((day) => day.dayKey !== dayKey)?.dayKey ?? null}
                onPickDay={setPickedDay}
              />
            }
          />
        </section>
      </main>
      {opened !== null && (
        <ModelModal
          moment={opened.moment}
          row={opened.row}
          efforts={efforts}
          timeZone={timeZone}
          standard={
            (() => {
              const candidate = opened.bindings?.["回目"] || opened.bindings?.["candidate"];
              if (candidate) {
                return (
                  promptStandards[`${opened.row.promptId}::${candidate}`] ??
                  promptStandards[candidate] ??
                  promptStandards[opened.row.promptId] ??
                  null
                );
              }
              return promptStandards[opened.row.promptId] ?? null;
            })()
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
}

interface EmptyDayProps {
  hasRuns: boolean;
  /** 这一天有结果、只是全被筛掉了 */
  dayHasRuns: boolean;
  isToday: boolean;
  /** 除这一天外最近有运行的一天 */
  latestDay: string | null;
  onPickDay: (dayKey: string) => void;
}

/** 时间线为空时的说明；所选日无运行时指出最近有运行的一天并可跳转 */
function EmptyDay({ hasRuns, dayHasRuns, isToday, latestDay, onPickDay }: EmptyDayProps) {
  if (!hasRuns) return FIRST_RUN_HINT;
  if (dayHasRuns || latestDay === null) return "没有符合筛选的结果";
  return (
    <>
      {isToday ? "今天" : "这一天"}还没有运行。最近一次在 {formatDayLabel(latestDay)}，
      <button type="button" className="matrix-empty-link" onClick={() => onPickDay(latestDay)}>
        查看
      </button>
    </>
  );
}

/** 从当前可见的数据里找回打开的格子；找不到时返回 null */
function resolveOpenCell(
  open: OpenCell | null,
  moments: readonly Moment[],
): { moment: Moment; row: Row; bindings?: Record<string, string> } | null {
  if (open === null) return null;
  const moment = moments.find((item) => item.runId === open.runId);
  const card = moment?.cards.find((item) => rowKeyOf(item) === open.rowKey);
  if (moment === undefined || card === undefined) return null;
  return {
    moment,
    row: { key: open.rowKey, cli: card.cli, model: card.model, promptId: card.promptId },
    bindings: card.bindings,
  };
}

function summarize(cards: readonly DashboardCard[]): { runs: number; works: number; rate: number } {
  const runs = new Set(cards.map((card) => card.runId)).size;
  const ok = cards.filter((card) => card.status === "ok").length;
  return { runs, works: cards.length, rate: cards.length === 0 ? 0 : Math.round((ok / cards.length) * 100) };
}

/** 挂载后才返回当前时刻：服务端没有浏览器时区，提前渲染会与客户端不一致 */
function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), NOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);
  return now;
}

/** 所选日期写进 URL（?day=）供服务端按天载入；跟随今天时去掉参数，地址未变则不跳转 */
function useDayInUrl(pickedDay: string | null): void {
  const router = useRouter();
  useEffect(() => {
    const target = pickedDay === null ? "" : `?day=${pickedDay}`;
    if (window.location.search === target) return;
    router.replace(`/${target}`, { scroll: false });
  }, [router, pickedDay]);
}

