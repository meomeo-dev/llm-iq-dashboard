"use client";

import React from "react";
import type { TimeZoneOption } from "../timeline/zoned-time";
import { PageGroupNav, type PageGroupId } from "./PageGroupNav";
import { ToolbarUtils } from "./ToolbarUtils";

export interface WorkspaceToolbarProps {
  /** 当前激活的页面组标签（"pelican" | "fingerprint"） */
  readonly activePage: PageGroupId;
  /** 无障碍页面主标题（sr-only h1） */
  readonly pageTitle: string;
  readonly owner: boolean;
  readonly readonly?: boolean;
  readonly timeZone: string;
  readonly timeZones: readonly TimeZoneOption[];
  readonly onPickTimeZone: (tz: string) => void;
  readonly onJumpToNow: () => void;
  readonly openMenu: string | null;
  readonly onToggleMenu: (id: string) => void;
  readonly onCloseMenus: () => void;
  readonly configHref?: string;
  readonly configTitle?: string;
  readonly pairHref?: string;
  /** 紧接页面切换器右侧的菜单区（<nav className="menus">：日期选择、筛选或子视图切换） */
  readonly menusSlot?: React.ReactNode;
  /** 工具栏中右部区域（<div className="toolbar-center">：当日统计、跑一次、自动任务） */
  readonly centerSlot?: React.ReactNode;
}

/**
 * 跨页面组（鹈鹕基准 `/` 与模型指纹 `/fingerprint`）共享的 52px 顶部单行工具栏外壳：
 * 保证在切换页面组 Tab 时，顶栏尺寸、圆角、内边距、左端页面组切换器与右端状态/时钟/时区/语言/权限区零跳动。
 */
export function WorkspaceToolbar({
  activePage,
  pageTitle,
  owner,
  readonly = false,
  timeZone,
  timeZones,
  onPickTimeZone,
  onJumpToNow,
  openMenu,
  onToggleMenu,
  onCloseMenus,
  configHref,
  configTitle,
  pairHref,
  menusSlot,
  centerSlot,
}: WorkspaceToolbarProps): React.ReactElement {
  return (
    <header className="toolbar">
      <div className="toolbar-top-row">
        <PageGroupNav active={activePage} pageTitle={pageTitle} />
        {menusSlot}
        <ToolbarUtils
          owner={owner}
          readonly={readonly}
          timeZone={timeZone}
          timeZones={timeZones}
          onPickTimeZone={onPickTimeZone}
          onJumpToNow={onJumpToNow}
          openMenu={openMenu}
          onToggleMenu={onToggleMenu}
          onCloseMenus={onCloseMenus}
          configHref={configHref}
          configTitle={configTitle}
          pairHref={pairHref}
        />
      </div>
      {centerSlot}
    </header>
  );
}
