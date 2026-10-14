# 施工单 M2-04：主看板、作品详情页与社交分享导出图国际化

> 将主看板（`/`）的全部工具栏、筛选器、日历、时间线、运行控制、模型对比弹窗、作品大图详情页（`/view`）与评审抽屉、以及社交分享导出长图/GIF（`src/app/components/export/`）接入 `useI18n()` 与 `locale`，实现无缝中英双语切换。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：主看板、详情页与导出长图/GIF 国际化） |
| 依赖工单 | [M2-01](M2-01-i18n-core-and-locale-context.md), [M2-03](M2-03-prompt-and-judge-metadata-i18n.md) |
| 验收文件 | [M2-04](../acceptance/M2-04-dashboard-viewer-and-export-i18n.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有但硬编码中文的模块**：
  - 顶部工具栏与筛选：`src/app/components/toolbar/{Toolbar.tsx,ToolbarCenter.tsx,ToolbarMenus.tsx,FilterMenu.tsx,FilterTabs.tsx,toolbar-filter-groups.tsx,filter-badge.ts,Calendar.tsx,TimeZoneMenu.tsx,LiveClock.tsx}`；
  - 看板主视图与时间线：`src/app/components/dashboard/{DashboardToolbar.tsx,DashboardBoard.tsx,DashboardModal.tsx,EmptyDay.tsx}`、`src/app/components/timeline/{TimelineAxis.tsx,RunGrid.tsx,FolderTile.tsx,RowPassRate.tsx,Thumb.tsx}`、`src/app/components/card/{PelicanCard.tsx,card-format.ts}`；
  - 运行控制与状态：`src/app/components/run-control/{RunOnceMenu.tsx,RunOnceHeadBar.tsx,RunOnceModelRows.tsx,RunOncePrompts.tsx,RunOnceFooter.tsx,RunForecast.tsx,RunOnceProfileModal.tsx,UnavailableNote.tsx,AutoRunToggle.tsx,auto-run-desc.ts,StopRunButton.tsx}`、`src/app/components/run-status/{RunStatus.tsx,run-phase.ts}`、`src/app/components/cli-status/CliStatusBanner.tsx`；
  - 模型对比弹窗与 Profile 卡片：`src/app/components/model-modal/{ModelModal.tsx,ModelModalHeader.tsx,ModelStandardPanel.tsx,ProfileMatrix.tsx,ModelExportMenu.tsx}`、`src/app/components/profile/ProfileInfoCard.tsx`；
  - 作品详情页与评审抽屉：`src/app/view/{ArtViewer.tsx,ArtViewerHead.tsx,ArtViewerFoot.tsx,ArtViewerSiblings.tsx,JudgeDrawer.tsx}`；
  - 社交分享导出图：`src/app/components/export/{ExportMenu.tsx,timeline-svg.ts,timeline-portrait-svg.ts,result-set-svg.ts,result-set-gif.ts,verdict-badges-svg.ts}`。

## ⚠️ 关键落地约束（必须先验证）

1. **工具栏语言切换入口布局**：
   - 在 `Toolbar.tsx` 右侧操作区加入 `<LanguageSwitch />`，在只读展台模式（`readOnly`）与所有者模式下均可见且不挤压既有按钮布局。
2. **导出 SVG/PNG/GIF 双语支持与文件长度控制**：
   - `timeline-svg.ts`（357 行）与 `result-set-svg.ts`（314 行）接近 500 行阈值：导出函数新增可选参数 `locale: Locale = "zh-CN"`，所有文案从 `getMessages(locale).export` 读取，不增加导出文件行数。
3. **组件行数红线**：
   - 所有修改后的 `.tsx` 组件必须 `≤ 300 行`，`.ts` 文件 `≤ 500 行`，函数 `≤ 50/80 行`。

## 任务

### 1. 工具栏、时间线、运行控制与模型对比弹窗国际化

- 在 `Toolbar.tsx` 挂载 `<LanguageSwitch />`，并将 `toolbar/`、`dashboard/`、`timeline/`、`card/`、`run-control/`、`run-status/`、`cli-status/`、`model-modal/`、`profile/` 下的全部中文界面文案替换为 `useI18n()` 字典与 `localizePromptLabel` / `localizePromptStandard` / `localizePromptGroupLabel`。

### 2. 作品大图页（`/view`）、评审抽屉与导出长图/GIF 国际化

- 在 `ArtViewerHead.tsx` 提供 `<LanguageSwitch />`，将 `ArtViewer.tsx`、`ArtViewerHead.tsx`、`ArtViewerFoot.tsx`、`ArtViewerSiblings.tsx`、`JudgeDrawer.tsx` 接入 `useI18n()` 与 `localizeGate` / `localizeCriterion` / `localizeDetailSubject` / `localizeVerdictLabel`；
- 将 `ExportMenu.tsx`、`ModelExportMenu.tsx` 的当前 `locale` 透传给 `timeline-svg.ts`、`timeline-portrait-svg.ts`、`result-set-svg.ts`、`result-set-gif.ts`、`verdict-badges-svg.ts`，使英文模式下导出的 SVG/PNG/GIF 均采用英文标题、图例、角标与页脚。

### 不改的地方（红线）

- 不修改 SVG 净化与沙箱挂载逻辑（`src/app/components/card/svg-sanitize.ts`、`svg-shadow.ts`）；
- 不修改 SSE 实时推送与状态存储机制（`live-store.ts`、`useRunProgress.ts`）；
- 不修改任何后端数据落盘格式。

### 测试

- 新增或更新导出图测试，断言 `timeline-svg` 与 `result-set-svg` 在 `locale: "en"` 时输出英文标题与角标，在 `locale: "zh-CN"` 时输出中文标题与角标；
- 运行 `pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm build` 全部通过。

## 验收

```bash
pnpm lint
pnpm test
pnpm check:length
pnpm build
```

## 回报格式

1. `pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm build` 执行结果；
2. 改造的主看板、详情页与导出组件列表；
3. 导出 SVG 双语验证摘要。

## 边界

- 允许修改：`src/app/components/**`、`src/app/view/**`、`src/i18n/**`；
- 禁止修改：`src/adapters/**`、`src/core/runner.ts`、`src/core/scheduler.ts`。

## 依赖

- 依赖 [M2-01](M2-01-i18n-core-and-locale-context.md) 与 [M2-03](M2-03-prompt-and-judge-metadata-i18n.md)。
