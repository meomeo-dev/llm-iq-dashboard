"use client";

import type { ProfileView } from "@/core/profile-view";
import type { PromptStandard } from "@/core/prompt";
import type { DashboardCard } from "@/core/types";
import { ProfilesProvider } from "./profile/profiles-context";
import { DashboardBoard } from "./dashboard/DashboardBoard";
import { DashboardModal } from "./dashboard/DashboardModal";
import { DashboardToolbar } from "./dashboard/DashboardToolbar";
import { useDashboardViewState } from "./dashboard/use-dashboard-view-state";

import "./toolbar/toolbar.css";
import "./menu/menu.css";
import "./toolbar/calendar.css";
import "./timeline/timeline.css";
import "./timeline/folder.css";
import "./card/cards.css";
import "./model-modal/model-modal.css";
import "./run-status/run-status.css";
import "./run-control/run-control.css";
import "./profile/profile.css";

export interface DashboardProps {
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
  /** 配置里的上游 profile 公开视图；缺省为空，页面不出现任何上游元素 */
  profiles?: readonly ProfileView[];
}

/**
 * 看板主体：工具栏 + 当天的时间轨道（24 小时轴与结果矩阵共用一条 x 轴），
 * 点格子打开模态窗。日期与时刻按所选时区换算；pickedDay 为 null 表示跟随今天
 * （过零点自动换天）。
 */
export function Dashboard(props: DashboardProps) {
  const state = useDashboardViewState(props);
  const { data, timeZone } = state;

  if (!data.ready || data.todayKey === null || data.dayKey === null || timeZone === null) {
    return <div className="workspace" />;
  }

  return (
    <ProfilesProvider value={{ profiles: props.profiles ?? [], owner: props.owner }}>
    <div className="workspace">
      <DashboardToolbar
        owner={props.owner}
        readonly={state.readonly}
        remote={state.remote}
        cards={state.dayCards}
        promptLabels={props.promptLabels}
        days={data.days}
        dayKey={data.dayKey}
        todayKey={data.todayKey}
        timeZone={timeZone}
        timeZones={state.timeZones}
        hidden={state.hidden}
        onHidden={state.onHidden}
        onPickTimeZone={state.onPickTimeZone}
        onJumpToNow={state.onJumpToNow}
        onPickDay={state.onPickDay}
      />
      <DashboardBoard
        moments={data.visible}
        efforts={data.efforts}
        nowMark={data.nowMark}
        dayKey={data.dayKey}
        timeZone={timeZone}
        hidden={state.hidden}
        runStarts={props.runStarts}
        dayMomentsCount={data.dayMoments.length}
        days={data.days}
        todayKey={data.todayKey}
        jumpCount={state.jumpCount}
        onOpenCell={state.setOpenCell}
        onPickDay={data.setPickedDay}
      />
      <DashboardModal
        openCell={state.openCell}
        visible={data.visible}
        efforts={data.efforts}
        timeZone={timeZone}
        promptStandards={props.promptStandards}
        onClose={() => state.setOpenCell(null)}
      />
    </div>
    </ProfilesProvider>
  );
}
