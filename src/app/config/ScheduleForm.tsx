"use client";

import { useState } from "react";
import { actionFetch } from "../components/action-fetch";
import { publishAutoRun, useLiveAutoRun } from "../components/live-state/live-store";
import { formatZonedClock } from "../components/timeline/zoned-time";
import type { AutoRunView } from "@/core/auto-run";

export interface ScheduleDraft {
  enabled: boolean;
  cron: string | null;
  intervalMinutes: number | null;
  timezone: string | null;
  runOnStart: boolean;
}

/** cron 与间隔互斥：未选中的一方置 null，写回时从 YAML 删除 */
type Mode = "cron" | "interval";

export function ScheduleForm({
  value,
  onChange,
}: {
  value: ScheduleDraft;
  onChange: (next: ScheduleDraft) => void;
}) {
  const mode: Mode = value.cron !== null ? "cron" : "interval";
  const liveAutoRun = useLiveAutoRun();
  const [switching, setSwitching] = useState(false);

  const state = liveAutoRun !== null && !("error" in liveAutoRun) ? liveAutoRun : null;
  const isMasterEnabled = state?.enabled === true;

  const toggleMasterSwitch = async (): Promise<void> => {
    if (state === null || switching) return;
    setSwitching(true);
    try {
      const next = !state.enabled;
      const res = await actionFetch("/api/auto-run", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (res.ok) {
        const data = (await res.json()) as AutoRunView;
        publishAutoRun(data);
        if (next && !value.enabled) {
          onChange({ ...value, enabled: true });
        }
      }
    } finally {
      setSwitching(false);
    }
  };

  const switchMode = (next: Mode): void => {
    onChange(
      next === "cron"
        ? { ...value, cron: value.cron ?? "0 */6 * * *", intervalMinutes: null }
        : { ...value, cron: null, intervalMinutes: value.intervalMinutes ?? 360 },
    );
  };

  const timeZone = value.timezone ?? (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Shanghai");

  return (
    <div className="stack">
      {/* 调度运行态总开关与实时状态感知面板 */}
      <div className="schedule-runtime-card">
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
              title={state?.schedulerPid ? `后台守护进程正在运行` : "后台未检测到调度器守护进程"}
            >
              {state?.schedulerPid ? `调度器 PID ${state.schedulerPid}` : "调度器未运行"}
            </span>
            <button
              type="button"
              className={`schedule-toggle-btn ${!isMasterEnabled ? "btn-activate" : ""}`}
              disabled={switching || state === null}
              onClick={() => void toggleMasterSwitch()}
            >
              {isMasterEnabled ? "暂停自动任务" : "开启自动任务"}
            </button>
          </div>
        </div>

        {/* 消除歧义的状态解读与快捷操作 */}
        {value.enabled && !isMasterEnabled ? (
          <div className="schedule-runtime-notice warn">
            <span>
              ⚠️ <strong>状态说明：</strong>定时计划规则已配置，但外部<strong>自动任务运行总开关当前处于“已暂停”</strong>状态。定时点到达时将自动跳过，不消耗 API 配额。
            </span>
            <button
              type="button"
              className="schedule-toggle-btn btn-activate"
              disabled={switching}
              onClick={() => void toggleMasterSwitch()}
            >
              一键开启自动任务
            </button>
          </div>
        ) : value.enabled && isMasterEnabled ? (
          <div className="schedule-runtime-notice ok">
            <span>
              ✅ <strong>状态说明：</strong>自动任务正常运行中。
              {state?.nextRunAt
                ? `下次触发预计于 ${formatZonedClock(new Date(state.nextRunAt), timeZone)}`
                : `按设定间隔自动发起评测`}。
            </span>
          </div>
        ) : (
          <div className="schedule-runtime-notice muted">
            <span>
              ○ <strong>状态说明：</strong>定时计划规则已在下方停用，调度器不会自动触发任何任务。
            </span>
          </div>
        )}
      </div>

      {/* 定时规则配置 */}
      <div className="field-row">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          启用定时计划规则（由调度器按指定节奏自动发起评测）
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={value.runOnStart}
            onChange={(e) => onChange({ ...value, runOnStart: e.target.checked })}
          />
          调度器启动时立刻跑一轮
        </label>
      </div>

      <div style={{ opacity: value.enabled ? 1 : 0.5, pointerEvents: value.enabled ? "auto" : "none", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="field-row">
          <label className="radio">
            <input
              type="radio"
              name="schedule-mode"
              checked={mode === "cron"}
              onChange={() => switchMode("cron")}
            />
            cron 表达式
          </label>
          <label className="radio">
            <input
              type="radio"
              name="schedule-mode"
              checked={mode === "interval"}
              onChange={() => switchMode("interval")}
            />
            固定间隔
          </label>
        </div>

        {mode === "cron" ? (
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
        ) : (
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
        )}

        <p className="note">
          常见写法：<code>0 */6 * * *</code> 每 6 小时 ｜ <code>0 9 * * *</code> 每天 9 点
          ｜ <code>*/30 * * * *</code> 每 30 分钟
        </p>
      </div>
    </div>
  );
}
