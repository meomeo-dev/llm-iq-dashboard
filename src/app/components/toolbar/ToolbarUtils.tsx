import React from "react";
import { LanguageSwitch, useI18n } from "@/i18n";
import type { TimeZoneOption } from "../timeline/zoned-time";
import { RunStatus } from "../run-status/RunStatus";
import { LiveClock } from "./LiveClock";
import { TimeZoneMenu } from "./TimeZoneMenu";
import { KeyIcon, RepositoryLink, SettingsIcon } from "./ToolbarIcons";

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

/** 工具栏右侧工具区：运行状态、时钟、时区切换、语言切换与配置/登录入口；只读展台改为徽章与源码仓库入口 */
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
  const { locale } = useI18n();
  const isEn = locale === "en";
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
        <button
          type="button"
          className="clock-now"
          title={isEn ? "Jump to today and scroll timeline to now" : "回到今天，时间线滚到现在"}
          onClick={onJumpToNow}
        >
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
      <LanguageSwitch />
      {readonly ? (
        <>
          <span className="badge-readonly" title={isEn ? "Read-only Showcase" : "只读展台"}>
            {isEn ? "Showcase" : "只读展台"}
          </span>
          <RepositoryLink />
        </>
      ) : owner ? (
        <a
          className="icon-link"
          href="/config"
          title={isEn ? "Configuration" : "配置"}
          aria-label={isEn ? "Configuration" : "配置"}
        >
          <SettingsIcon />
        </a>
      ) : (
        <a
          className="icon-link"
          href="/pair"
          title={isEn ? "Owner Sign-In" : "所有者登录"}
          aria-label={isEn ? "Owner Sign-In" : "所有者登录"}
        >
          <KeyIcon />
        </a>
      )}
    </div>
  );
}
