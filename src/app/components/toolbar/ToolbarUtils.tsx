import React from "react";
import type { TimeZoneOption } from "../timeline/zoned-time";
import { RunStatus } from "../run-status/RunStatus";
import { LiveClock } from "./LiveClock";
import { TimeZoneMenu } from "./TimeZoneMenu";
import { KeyIcon, SettingsIcon } from "./ToolbarIcons";

interface ToolbarUtilsProps {
  readonly owner: boolean;
  readonly readonly: boolean;
  readonly timeZone: string;
  readonly timeZones: readonly TimeZoneOption[];
  readonly onPickTimeZone: (tz: string) => void;
  readonly onJumpToNow: () => void;
  readonly openMenu: string | null;
  readonly onToggleMenu: (id: string) => void;
  readonly onCloseMenus: () => void;
}

/** 工具栏右侧工具区：运行状态、时钟、时区切换与配置/登录入口 */
export function ToolbarUtils({
  owner,
  readonly,
  timeZone,
  timeZones,
  onPickTimeZone,
  onJumpToNow,
  openMenu,
  onToggleMenu,
  onCloseMenus,
}: ToolbarUtilsProps) {
  return (
    <div className="toolbar-utils">
      <RunStatus
        timeZone={timeZone}
        owner={owner}
        open={openMenu === "run"}
        onToggle={() => onToggleMenu("run")}
        onClose={onCloseMenus}
      />
      <div className="toolbar-stack clock">
        <button type="button" className="clock-now" title="回到今天，时间线滚到现在" onClick={onJumpToNow}>
          <LiveClock timeZone={timeZone} />
        </button>
        <TimeZoneMenu
          timeZone={timeZone}
          timeZones={timeZones}
          open={openMenu === "zone"}
          onToggle={() => onToggleMenu("zone")}
          onClose={onCloseMenus}
          onPickTimeZone={onPickTimeZone}
        />
      </div>
      {readonly ? (
        <span className="badge-readonly" title="只读展台">
          只读展台
        </span>
      ) : owner ? (
        <a className="icon-link" href="/config" title="配置" aria-label="配置">
          <SettingsIcon />
        </a>
      ) : (
        <a className="icon-link" href="/pair" title="所有者登录" aria-label="所有者登录">
          <KeyIcon />
        </a>
      )}
    </div>
  );
}
