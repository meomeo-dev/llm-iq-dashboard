import type { AutoRunView } from "@/core/auto-run";
import { formatZonedClock } from "../components/timeline/zoned-time";

export function ScheduleRuntimeCard({
  state,
  isMasterEnabled,
  switching,
  scheduled,
  timeZone,
  onToggleMaster,
}: {
  state: AutoRunView | null;
  isMasterEnabled: boolean;
  switching: boolean;
  scheduled: boolean;
  timeZone: string;
  onToggleMaster: () => Promise<void>;
}) {
  return (
    <div className="schedule-runtime-card">
      <ScheduleRuntimeHeader
        state={state}
        isMasterEnabled={isMasterEnabled}
        switching={switching}
        onToggleMaster={onToggleMaster}
      />
      <ScheduleNoticeBox
        scheduled={scheduled}
        isMasterEnabled={isMasterEnabled}
        state={state}
        switching={switching}
        timeZone={timeZone}
        onToggleMaster={onToggleMaster}
      />
    </div>
  );
}

function ScheduleRuntimeHeader({
  state,
  isMasterEnabled,
  switching,
  onToggleMaster,
}: {
  state: AutoRunView | null;
  isMasterEnabled: boolean;
  switching: boolean;
  onToggleMaster: () => Promise<void>;
}) {
  return (
    <div className="schedule-runtime-row">
      <div className="schedule-runtime-title">
        <span>自动任务全局运行态</span>
        <span className={`schedule-badge ${isMasterEnabled ? "running" : "offline"}`}>
          {isMasterEnabled ? "● 执行中（已激活）" : "○ 已暂停（保护模式）"}
        </span>
      </div>
      <div className="schedule-runtime-badges">
        <span
          className={`schedule-badge ${state?.schedulerPid ? "running" : "offline"}`}
          title={state?.schedulerPid ? "后台守护进程正在运行" : "后台未检测到调度器守护进程"}
        >
          {state?.schedulerPid ? `调度器 PID ${state.schedulerPid}` : "调度器未运行"}
        </span>
        <button
          type="button"
          className={`schedule-toggle-btn ${!isMasterEnabled ? "btn-activate" : ""}`}
          disabled={switching || state === null}
          onClick={() => void onToggleMaster()}
        >
          {isMasterEnabled ? "暂停自动任务" : "开启自动任务"}
        </button>
      </div>
    </div>
  );
}

function ScheduleNoticeBox({
  scheduled,
  isMasterEnabled,
  state,
  switching,
  timeZone,
  onToggleMaster,
}: {
  scheduled: boolean;
  isMasterEnabled: boolean;
  state: AutoRunView | null;
  switching: boolean;
  timeZone: string;
  onToggleMaster: () => Promise<void>;
}) {
  if (scheduled && !isMasterEnabled) {
    return (
      <div className="schedule-runtime-notice warn">
        <span>
          ⚠️ <strong>状态说明：</strong>定时节奏已设置，但<strong>自动任务开关当前处于“已暂停”</strong>状态。定时点到达时将自动跳过，不消耗 API 配额。
        </span>
        <button
          type="button"
          className="schedule-toggle-btn btn-activate"
          disabled={switching}
          onClick={() => void onToggleMaster()}
        >
          一键开启自动任务
        </button>
      </div>
    );
  }
  if (scheduled && isMasterEnabled) {
    return (
      <div className="schedule-runtime-notice ok">
        <span>
          ✅ <strong>状态说明：</strong>自动任务正常运行中。
          {state?.pendingRun
            ? `到点时${state.pendingRun.waitingFor !== null ? `轮次 ${state.pendingRun.waitingFor}` : "上一轮"}还在跑，定时轮次已排队，等它结束立即开跑`
            : state?.nextRunAt
              ? `下次触发预计于 ${formatZonedClock(new Date(state.nextRunAt), timeZone)}`
              : "按设定间隔自动发起评测"}。
        </span>
      </div>
    );
  }
  return (
    <div className="schedule-runtime-notice muted">
      <span>
        ○ <strong>状态说明：</strong>下方选了“不定时”，调度器不会自动触发任何任务。
      </span>
    </div>
  );
}
