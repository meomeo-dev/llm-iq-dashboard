"use client";

import { useLiveAutoRun } from "../components/live-state/live-store";
import {
  type ScheduleDraft,
  type ScheduleMode,
  getScheduleMode,
  switchScheduleMode,
  resolveTimeZone,
} from "./schedule-form-model";
import { useMasterSwitch } from "./use-master-switch";
import { ScheduleRuntimeCard } from "./ScheduleRuntimeCard";

export { type ScheduleDraft };

export function ScheduleForm({
  value,
  onChange,
}: {
  value: ScheduleDraft;
  onChange: (next: ScheduleDraft) => void;
}) {
  const mode = getScheduleMode(value);
  const scheduled = mode !== "none";
  const liveAutoRun = useLiveAutoRun();
  const state = liveAutoRun !== null && !("error" in liveAutoRun) ? liveAutoRun : null;
  const isMasterEnabled = state?.enabled === true;
  const { switching, toggleMasterSwitch } = useMasterSwitch(state);

  const switchMode = (next: ScheduleMode): void => {
    onChange(switchScheduleMode(value, next));
  };

  const timeZone = resolveTimeZone(value.timezone);

  return (
    <div className="stack">
      {/* 调度运行态总开关与实时状态感知面板 */}
      <ScheduleRuntimeCard
        state={state}
        isMasterEnabled={isMasterEnabled}
        switching={switching}
        scheduled={scheduled}
        timeZone={timeZone}
        onToggleMaster={toggleMasterSwitch}
      />

      {/* 定时节奏：只决定何时触发，是否执行看上方的自动任务开关 */}
      <ScheduleModeSelector mode={mode} onSelect={switchMode} />
      <ScheduleInputs mode={mode} value={value} onChange={onChange} />

      {scheduled ? (
        <div className="field-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={value.runOnStart}
              onChange={(e) => onChange({ ...value, runOnStart: e.target.checked })}
            />
            调度器启动时立刻跑一轮
          </label>
        </div>
      ) : null}

      <p className="note">
        常见写法：<code>0 */6 * * *</code> 每 6 小时 ｜ <code>0 9 * * *</code> 每天 9 点
        ｜ <code>*/30 * * * *</code> 每 30 分钟
      </p>
    </div>
  );
}

function ScheduleModeSelector({
  mode,
  onSelect,
}: {
  mode: ScheduleMode;
  onSelect: (next: ScheduleMode) => void;
}) {
  return (
    <div className="field-row">
      <label className="radio">
        <input
          type="radio"
          name="schedule-mode"
          checked={mode === "none"}
          onChange={() => onSelect("none")}
        />
        不定时
      </label>
      <label className="radio">
        <input
          type="radio"
          name="schedule-mode"
          checked={mode === "cron"}
          onChange={() => onSelect("cron")}
        />
        cron 表达式
      </label>
      <label className="radio">
        <input
          type="radio"
          name="schedule-mode"
          checked={mode === "interval"}
          onChange={() => onSelect("interval")}
        />
        固定间隔
      </label>
    </div>
  );
}

function ScheduleInputs({
  mode,
  value,
  onChange,
}: {
  mode: ScheduleMode;
  value: ScheduleDraft;
  onChange: (next: ScheduleDraft) => void;
}) {
  if (mode === "cron") {
    return (
      <div className="field-row">
        <label>
          cron
          <input
            type="text"
            value={value.cron ?? ""}
            placeholder="分 时 日 月 周"
            onChange={(e) => onChange({ ...value, cron: e.target.value })}
          />
        </label>
        <label>
          时区
          <input
            type="text"
            value={value.timezone ?? ""}
            placeholder="留空跟随本机"
            onChange={(e) =>
              onChange({
                ...value,
                timezone: e.target.value.trim() === "" ? null : e.target.value,
              })
            }
          />
        </label>
      </div>
    );
  }
  if (mode === "interval") {
    return (
      <div className="field-row">
        <label>
          间隔（分钟）
          <input
            type="number"
            min={1}
            value={value.intervalMinutes ?? 360}
            onChange={(e) =>
              onChange({ ...value, intervalMinutes: Number(e.target.value) })
            }
          />
        </label>
      </div>
    );
  }
  return null;
}
