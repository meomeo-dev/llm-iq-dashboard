# 专题一：组件层级与模块边界审计（Component Hierarchy & Module Boundaries）

## 1. 审计结论摘要

对 `src/app/components/`（13 个子目录、109 个文件、12,045 行代码）及 `src/app/view/`、`src/app/config/`、`src/app/pair/`、`src/app/fingerprint/` 的源码审查表明：

1. **缺乏基础 UI 原语层（Primitives / Common UI）**：仓库未划分「通用基础控件（Primitives）→ 领域业务组件（Domain Components）→ 页面外壳（Page Shells）」三层架构。`src/app/components/` 下的 13 个子目录本质上是**首页看板（Dashboard）的业务拼装块切片**，几乎全部直接依赖 `@/core/types` 中的鹈鹕评测领域类型（`DashboardCard`、`PromptStandard`、`Moment`、`RunOptionsView`）。
2. **唯一接近通用原语的组件也被业务样式反向污染**：全目录仅 [`Menu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx#L22-L50)（下拉容器）与 [`SvgFrame.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/SvgFrame.tsx#L18-L43)（Shadow DOM SVG 挂载框）具备通用容器形态，但 `menu/` 目录下的 [`menu-rows.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-rows.css#L73-L150) 与 [`menu-panels.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L3-L176) 直接硬编码了 `.zone-id`（时区）、`.export-panel`（导出）、`.filter-panel`（筛选）、`.day-panel`（日历）等首页业务选择器。
3. **基础交互控件在各路由目录各自手写，产生行为分裂与可访问性缺陷**：Modal（模态窗）、Drawer/Collapsible（抽屉与折叠面板）、Button（按钮）、Badge/Pill（徽章）、Table（表格）、PageHeader（页头）、Alert（提示条）在 `components/`、`view/`、`config/`、`pair/`、`fingerprint/` 中各自重复实现，导致键盘交互（Esc 关闭）、焦点管理、`role="dialog"` 语义属性及移动端适配逻辑不一致。
4. **全局裸标签选择器污染与跨模块类名冲突并存**：[`config-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L94-L122) 直接对裸 HTML 标签 `button`、`input`、`select`、`textarea`、`label` 施加全局样式；同时不同模块各自声明同名类（如 `.matrix`、`.profile-card`），或引用完全未定义的孤儿类名与 CSS 变量（如 `.masthead`、`.prompt`、`.button`、`--line`、`--danger`）。

---

## 2. `src/app/components/` 全量目录职责与耦合度盘点

`src/app/components/` 并非跨页面共享的通用组件库，而是首页看板（`/`）的专属实现目录（其他路由仅零星借用了 `LanguageSwitch`、`ProfileName`、`useModalBehavior`、`action-fetch`）。各子目录的真实职责与业务耦合证据如下：

| 目录 / 文件 | 文件数 | 真实职责 | 依赖的核心业务模型 | 是否通用原语 | 跨页复用情况与架构问题 |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `Dashboard.tsx` + `dashboard/` | 5 | 首页看板顶层状态组装与过滤 | `DashboardData`, `DashboardCard`, `LiveRunProgress` | 否（页面壳） | 仅首页 `/` 使用；纯页面级容器直接混放于 `components/` 根目录与 `dashboard/` 子目录。 |
| `toolbar/` | 21 | 首页顶部工具栏、日历、筛选面板、语言切换 | `DashboardCard`, `CliStatusReport`, `RunOptionsView` | 否（仅 `LanguageSwitch` 跨页） | `LanguageSwitch.tsx` 被 `/config`、`/pair`、`/view`、`/fingerprint` 复用，却深埋在首页专属的 `toolbar/` 目录中。 |
| `timeline/` | 12 | 首页按日/时刻展开的跑道网格、卡片矩阵与思考强度槽 | `Moment`, `DashboardCard`, `PromptStandard`, `Effort` | 否（领域核心） | 仅首页 `/` 使用；包含纯算法（`track-layout.ts`、`effort-slots.ts`、`zoned-time.ts`）与跑道视图。 |
| `card/` | 13 | 鹈鹕作品卡片、文件夹磁贴、SVG 净化与 Shadow DOM 渲染 | `DashboardCard`, `CardAttempt` | 仅 `SvgFrame` / `LazySvgFrame` | `LazySvgFrame` 被 `view/` 与 `model-modal/` 复用；但 `PelicanCard`、`FolderTile` 强绑定评测分数与耗时字段。 |
| `model-modal/` | 9 | 首页点击模型或文件夹弹出的作品横向对比模态窗 | `DashboardCard`, `PromptStandard` | 仅 `use-modal-behavior.ts` | 未抽象通用 `<Modal>`；`run-control/` 与 `fingerprint/` 只能跨目录借用其内部 Hook 或 `.modal-backdrop` 类名。 |
| `run-control/` | 17 | 首页「立即跑一轮」菜单、配置档案预览弹窗、自动运行开关、停止按钮 | `RunOptionsView`, `RunProfileSummary`, `LiveRunProgress` | 否（领域控制） | 仅首页 `/` 使用；其 [`RunOnceProfileModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx#L4) 跨目录 import `../model-modal/use-modal-behavior` 并重写整套弹窗 CSS。 |
| `run-status/` | 7 | 首页运行进度徽章、倒计时与活跃调用列表面板 | `LiveRunProgress`, `ScheduleStatusView`, `LiveCallItem` | 否（领域状态） | 仅首页 `/` 使用。 |
| `cli-status/` | 3 | 首页顶部 CLI 可用性异常告警横幅 | `CliStatusReport`, `CliProbeResult` | 否（领域状态） | 仅首页 `/` 使用；未抽象为通用 `<AlertBanner>`。 |
| `profile/` | 6 | 配置档案徽章与悬停详情浮层（Popover） | `RunProfileDetail`, `DashboardCard` | 否（被业务侵入） | 在 [`ProfileName.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/profile/ProfileName.tsx#L14-L28) 中直接接收 `cards?: readonly DashboardCard[]`，并在 [`ProfileInfoCard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/profile/ProfileInfoCard.tsx#L50-L64) 内计算单件作品耗时与折算成本，导致浮层控件与跑道卡片数据强耦合。 |
| `menu/` | 5 | 下拉菜单容器（点击外部与 Esc 关闭） | TS 无业务依赖，**但 CSS 写死业务选择器** | 半通用（样式腐化） | [`Menu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx#L22-L50) 本是 50 行的通用下拉原语，但 [`menu-rows.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-rows.css#L73-L150) 与 [`menu-panels.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L3-L176) 塞满了 `.zone-id`、`.export-panel`、`.filter-panel`、`.day-panel` 等具体业务面板样式。 |
| `export/` | 9 | 导出 PNG / SVG / GIF 菜单与画布合成逻辑 | `Moment`, `DashboardCard`, `PromptStandard` | 否（领域功能） | 仅首页 `/` 使用；其菜单面板样式反向写进了 `menu/menu-rows.css` 与 `menu/menu-panels.css`。 |
| `live-state/` | 6 | SSE 实时事件订阅（`/api/events`）与可见性重连 | `LiveRunProgress`, `ScheduleStatusView`, `CliStatusReport` | 否（领域数据层） | 仅首页 `/` 使用。 |
| `icons/` | 1 | `CalendarIcon`、`ClockIcon` 两个内联 SVG 图标 | 无 | 是（仅 2 个图标） | 全站其余图标均以 Unicode 字符（`×`、`▾`、`▸`、`✓`、`⚠`）或内联 `<svg>` 散落在各业务组件内（如 [`CliStatusBanner.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/CliStatusBanner.tsx#L50-L61)、[`ToolbarUtils.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L39-L51)）。 |
| `ReferenceSourceDisplay.tsx` | 1 | 黄金标准参考来源（书籍章节/图片链接）展示块 | `PromptReferenceSource` | 否（领域展示） | 被 `model-modal/` 与 `view/` 复用。 |

---

## 3. 核心基础 UI 原语缺失与重复手写取证

由于缺少 `src/app/components/ui/`（或 `primitives/`）基础层，全站各页面在遇到相同交互模式时只能各自手写 DOM 与 CSS，或跨业务目录借用局部代码。以下为六类核心 UI 原语的重复实现与缺陷对照。

### 3.1 Modal（模态窗）：4 套桌面实现 + 4 套移动端伪模态窗，可访问性不一

全站没有任何通用的 `<Modal>` 或 `<Dialog>` 组件，现有 4 处模态窗各自维护一套 DOM 结构与遮罩样式：

| 模态窗组件 | 容器与遮罩类名 | 样式定义位置 | `useModalBehavior` 接入 | 可访问性与交互缺陷 |
| :--- | :--- | :--- | :---: | :--- |
| [`ModelModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModal.tsx#L37-L81) | `.modal-backdrop` > `<section class="modal" role="dialog" aria-modal="true">` | [`model-modal-dialog.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-dialog.css#L3-L25) (`z-index: 100`) | 是（[`L37`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModal.tsx#L37)） | 具备 Esc 关闭、背景滚动锁定与关闭后焦点归还（[`use-modal-behavior.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L4-L22)），但未做 Tab 焦点陷阱（Focus Trap）。 |
| [`RunOnceProfileModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx#L39-L97) | `.profile-modal-backdrop` > `<section class="profile-modal" role="dialog" aria-modal="true">` | [`run-control-profiles.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-profiles.css#L3-L60) (`z-index: 200`) | 跨目录借用 `../model-modal/use-modal-behavior`（[`L4`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx#L4)） | 逻辑复用但 DOM 类名与 CSS 完全重写一遍（`.profile-modal-head`、`.profile-modal-close`）。 |
| [`DataRepoPushDialog.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPushDialog.tsx#L16-L81) | `<div class="data-repo-dialog-backdrop" role="dialog" aria-modal="true">` > `.data-repo-dialog` | [`config-data-repo.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L143-L236) (`z-index: 1000`) | **否（未接入）** | **1. `role="dialog"` 错挂在全屏半透明遮罩层上而非对话框主体；2. 不支持按 Esc 键关闭；3. 不支持点击遮罩关闭；4. 未锁定 `document.body` 滚动；5. 无焦点归还与右上角关闭按钮。** |
| [`FingerprintCheckModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L51-L91) | `.modal-backdrop` > `<section class="modal fp-check-modal" role="dialog" aria-modal="true">` | [`fingerprint-check-modal.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L1-L35) | 跨目录借用 `@/app/components/model-modal/use-modal-behavior`（[`L4`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L4)） | 直接复用 `model-modal` 的 `.modal-backdrop` / `.modal` 全局类名，依赖首页 CSS 已在全局 `layout.tsx` 注入的前提。 |

此外，在移动端（`@media (max-width: 640px)` / `768px`），下拉菜单 [`Menu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx#L22-L50) 的 `.menu-panel` 被强行通过 CSS 改写为 `position: fixed` 全屏遮罩 + 居中弹窗，导致 4 个菜单各自手写了一套移动端弹窗头部与关闭按钮：
- 日历面板：`.day-panel-head-bar` + `.day-panel-close-btn`（[`ToolbarMenus.tsx#L39-L48`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarMenus.tsx#L39-L48)，[`menu-panels.css#L101-L132`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L101-L132)）
- 筛选面板：`.filter-panel-head-bar` + `.filter-panel-close-btn`（[`FilterPanel.tsx#L51-L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/FilterPanel.tsx#L51-L60)，[`menu-panels.css#L134-L165`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L134-L165)）
- 运行状态面板：`.run-panel-head-bar` + `.run-panel-close-btn`（[`RunStatusBadge.tsx#L67-L76`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/RunStatusBadge.tsx#L67-L76)，[`run-status-panel.css#L43-L81`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-panel.css#L43-L81)）
- 立即跑一轮面板：`.run-once-head-bar` + `.run-once-close`（[`RunOnceHeadBar.tsx#L18-L41`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceHeadBar.tsx#L18-L41)，[`run-control-menu.css#L32-L52`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-menu.css#L32-L52) 与 [`run-control-stop.css#L45-L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-stop.css#L45-L60)）

### 3.2 Drawer / Collapsible（抽屉与折叠面板）：4 种互不统属的实现方式

1. **查看页底部 `<details class="viewer-drawer">`**：[`ArtViewerFoot.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L33-L100) 与 [`JudgeDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L29-L57) 使用原生 `<details className="viewer-drawer"><summary>` 搭配 `<span className="drawer-icon">▾</span>`，样式定义在 [`viewer-drawers.css#L3-L75`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L3-L75)。
2. **配置页数据仓折叠列表 `<details class="data-repo-discarded">`**：[`DataRepoDiscardedList.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoDiscardedList.tsx#L17-L35) 同样使用 `<details><summary>`，但未复用任何类名，在 [`config-data-repo-pending.css#L200-L219`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo-pending.css#L200-L219) 重新编写了一套样式。
3. **配置页自定义题库折叠编辑器（`useState` + `<button>`）**：[`CustomPromptEditor.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/CustomPromptEditor.tsx#L25-L68) 不使用 `<details>`，而是用 `const [open, setOpen] = useState(false)` 与 `<button type="button" onClick={() => setOpen(!open)}>{open ? "▾" : "▸"} ...</button>` 手工控制显隐，无 `aria-expanded` 属性。
4. **模型指纹页右侧滑出抽屉 `<aside class="fp-drawer">`**：[`FingerprintSampleDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L46-L90) 与 [`FingerprintCheckTechDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L26-L52) 采用 `<div className="fp-drawer-backdrop" onClick={onClose}><aside className="fp-drawer">`，既未绑定 Esc 关闭，也未声明 `role="dialog"` 或 `aria-modal="true"`。

### 3.3 Button（按钮）：全局裸标签污染与 14+ 套局部类名并存

全站未封装 `<Button>` 组件，存在两类架构问题：

1. **全局裸 `<button>` 标签样式污染**：
   [`src/app/config/config-base.css#L94-L122`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L94-L122) 直接对裸 HTML 选择器 `button`、`button.primary`、`button.danger`、`input`、`select`、`textarea`、`label` 设置了内边距、圆角、边框和背景色。在 Next.js App Router 中，一旦客户端访问过 `/config`（或样式被合并打包），这些无命名空间的裸标签规则会直接作用于全局所有未显式重置样式的 `<button>`。
2. **各业务模块各自发明按钮类名（部分甚至漏写样式）**：
   - `.menu-button`（[`Menu.tsx#L31`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx#L31)，[`menu-base.css#L11-L32`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L11-L32)）
   - `.modal-standard-btn`（[`ModelModalHeader.tsx#L76`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModalHeader.tsx#L76)，[`model-modal-standard.css#L3-L25`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-standard.css#L3-L25)）
   - `.run-once-start`（[`RunOnceFooter.tsx#L66`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceFooter.tsx#L66)，[`run-control-foot.css#L43-L63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-foot.css#L43-L63)）
   - `.run-stop` / `.run-stop-cancel`（[`StopRunButton.tsx#L20-L45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/StopRunButton.tsx#L20-L45)，[`run-control-stop.css#L10-L43`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-stop.css#L10-L43)）
   - `.cli-banner-dismiss` / `.cli-banner-copy`（[`CliStatusBanner.tsx#L77-L98`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/CliStatusBanner.tsx#L77-L98)，[`cli-status.css#L92-L120`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/cli-status.css#L92-L120)）
   - `.schedule-toggle-btn.btn-activate` / `.btn-pause`（[`ScheduleRuntimeCard.tsx#L90-L135`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ScheduleRuntimeCard.tsx#L90-L135)，[`config-schedule.css#L64-L98`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-schedule.css#L64-L98)）
   - `.btn-preset`（[`TimeoutForm.tsx#L191`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/TimeoutForm.tsx#L191)，[`config-timeout.css#L19-L36`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-timeout.css#L19-L36)）
   - `.data-repo-btn` / `.data-repo-btn-primary` / `.data-repo-pipeline-btn` / `.data-repo-btn-cancel` / `.data-repo-btn-confirm` / `.data-repo-link-button`（散落于 `src/app/config/DataRepo*.tsx` 与 `config-data-repo*.css`）
   - **孤儿类名缺陷**：[`PairSignedInCard.tsx#L28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairSignedInCard.tsx#L28) 渲染了 `<a className="button" href="/">`，但在 [`pair.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css) 与 [`globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css) 中根本不存在 `.button` 选择器，导致该返回链接退化为无按钮外观的普通超链接。

### 3.4 Badge / Pill / Tag（徽章与状态胶囊）：11+ 套实现与逐行粘贴的 CSS

全站用于表达状态、思考强度、评审结论与数量的胶囊徽章存在至少 11 套独立类名，其中两处在两个目录里出现了完全相同的代码复制：

1. **评审结论徽章在卡片与查看页各写一套（`.judge-tag` vs `.judge-pill`）**：
   - 首页卡片 [`PelicanCard.tsx#L143-L163`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/PelicanCard.tsx#L143-L163)（`CardJudgeTag`）渲染 `.judge-tag.online` / `.degraded` / `.pending` / `.judging` / `.interrupted`，样式在 [`cards-footer.css#L77-L103`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-footer.css#L77-L103)。
   - 查看页抽屉 [`JudgeDrawer.tsx#L33-L45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L33-L45) 针对完全相同的 `CardJudgeView` 数据结构，另写一套 `.judge-pill.online` / `.degraded` / `.pending` / `.judging` / `.interrupted`，样式在 [`viewer-judge.css#L3-L29`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-judge.css#L3-L29)。
2. **黄金标准标签 `.standard-tag.gt` / `.standard-tag.eval` 逐行复制粘贴**：
   [`model-modal-standard.css#L113-L132`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-standard.css#L113-L132) 与 [`viewer-drawers.css#L107-L126`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L107-L126) 中的 `.standard-tag`、`.standard-tag.gt`、`.standard-tag.eval` 共 20 行 CSS 属性逐字相同；其对应的 JSX 结构 [`ModelStandardPanel.tsx#L11-L43`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelStandardPanel.tsx#L11-L43) 与 [`ArtViewerFoot.tsx#L64-L100`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L64-L100)（`StandardDrawer`）内部双栏内容也高度重复。
3. **其余散落的同类徽章实现**：
   - `.badge`（[`PelicanCard.tsx#L61-L75`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/PelicanCard.tsx#L61-L75)、[`PromptPicker.tsx#L72-L103`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/PromptPicker.tsx#L72-L103)，[`cards-base.css#L51-L95`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-base.css#L51-L95)）
   - `.menu-badge`（[`Menu.tsx#L37`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx#L37)，[`menu-base.css#L34-L46`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L34-L46)）
   - `.badge-readonly`（[`ToolbarUtils.tsx#L65`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L65)，[`toolbar-elements.css#L119-L130`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-elements.css#L119-L130)）
   - `.verdict-badge`（[`FolderTile.tsx#L100-L115`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/FolderTile.tsx#L100-L115)，[`folder.css#L81-L103`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/folder.css#L81-L103)）
   - `.modal-standard-pill`（[`ModelModalHeader.tsx#L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModalHeader.tsx#L60)） vs `.drawer-core-pill`（[`ArtViewerFoot.tsx#L72`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L72)）
   - `.schedule-badge`（[`config-schedule.css#L37-L56`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-schedule.css#L37-L56)）、`.tier-badge`（[`config-timeout.css#L59-L77`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-timeout.css#L59-L77)）、`.data-repo-health-badge`（[`config-data-repo.css#L32-L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L32-L53)）、`.fp-badge`（[`FingerprintSampleDrawer.tsx#L169`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L169)）

### 3.5 Table（表格）与跨模块同名类冲突（`.matrix`、`.profile-card`）

1. **三套表格样式各自独立**：
   - 查看页评审明细表：`<table className="judge-table">`（[`JudgeDrawer.tsx#L63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L63)，[`viewer-judge.css#L42-L92`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-judge.css#L42-L92)）
   - 配置页目标矩阵表：`<table className="matrix">`（[`TargetTable.tsx#L55`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/TargetTable.tsx#L55)、[`JudgePanel.tsx#L139`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/JudgePanel.tsx#L139)，[`config-matrix.css#L13-L35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-matrix.css#L13-L35)）
   - 配置页已配对设备表：`<table className="device-table">`（[`DeviceTable.tsx#L15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DeviceTable.tsx#L15)，[`config-actions.css#L51-L67`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-actions.css#L51-L67)）
2. **跨模块全局类名冲突**：
   - **`.matrix` 冲突**：在首页时间线 [`RunGrid.tsx#L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunGrid.tsx#L53) 中，`.matrix` 是 `display: grid; grid-template-columns: 168px minmax(0, 1fr); gap: 8px;` 的跑道网格容器（[`timeline-board.css#L60-L64`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L60-L64)）；而在配置页 [`TargetTable.tsx#L55`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/TargetTable.tsx#L55) 中，`.matrix` 却是 `width: 100%; border-collapse: collapse;` 的 `<table>`（[`config-matrix.css#L13-L17`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-matrix.css#L13-L17)）。一旦客户端在 `/` 与 `/config` 间经 `<Link>` 路由切换，两套全局样式表同时驻留 `<head>`，`.matrix` 会同时命中 `display: grid` 与 `border-collapse: collapse`！
   - **`.profile-card` 冲突**：在 [`src/app/components/profile/profile.css#L42-L54`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/profile/profile.css#L42-L54) 中，`.profile-card` 是 `position: fixed; z-index: 260; width: min(360px, calc(100vw - 24px));` 的悬停浮层；而在 [`src/app/config/config-profiles.css#L37-L44`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-profiles.css#L37-L44) 中，`.profile-card` 是文档流内的配置档案编辑框。二者仅靠配置页写了 `.profile-list .profile-card` 提高特异性才勉强避免配置页变成 `position: fixed` 浮层，但首页 `.profile-card` 的 `width: min(360px, ...)` 与 `box-shadow` 依然会泄漏叠加到配置页的 `.profile-card` 上！

### 3.6 PageHeader（页头）与孤儿类名 / 未定义 CSS 变量

1. **重复手写页头且样式缺失**：
   - [`ConfigPageHeader.tsx#L10-L22`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L10-L22) 与 [`PairPageHeader.tsx#L10-L31`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairPageHeader.tsx#L10-L31) 具有完全一致的页头结构：`<header className="masthead"><div><h1>{title} <Link className="nav-link">...</Link> <LanguageSwitch /></h1><p className="prompt">{subtitle}</p></div></header>`。
   - **孤儿类名缺陷**：检索全仓库所有 `.css` 文件，**没有任何一处定义了 `.masthead` 或 `.prompt` 选择器**。这两个页头组件使用的类名是早期遗留或未落盘的孤儿类名。
2. **未定义的 CSS 自定义属性**：
   - [`src/app/pair/pair.css#L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L9) 使用了 `border: 1px solid var(--line);`，[`pair.css#L28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L28) 使用了 `color: var(--danger);`。
   - 核对 [`src/app/globals.css#L3-L28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L3-L28) 的 `:root` 设计令牌，全站标准令牌名为 `--border`（而非 `--line`）和 `--err`（而非 `--danger`）。由于 `--line` 与 `--danger` 未定义，`/pair` 页面输入框边框与错误文字颜色直接失效回退。

---

## 4. 分层重构建议（Primitives vs Domain vs Page Shells）

为消除跨页复制粘贴、全局类名碰撞与可访问性分裂，建议将前端组件明确划分为三层：

1. **`src/app/components/ui/`（通用基础原语层，零业务依赖）**：
   - 严禁 import `@/core/types` 中的业务模型。
   - 收拢并提供统一前缀（如 `ui-*` 或 CSS Modules）的基础原语：
     - `Modal`（统一封装 `useModalBehavior`、遮罩点击、Esc 关闭、焦点管理与 `role="dialog"`，替代 4 套手写弹窗）
     - `Drawer` / `Collapsible`（统一底部折叠 `<details>` 与侧滑 `<aside role="dialog">`）
     - `DropdownMenu`（将现 `menu/Menu.tsx` 剥离业务 CSS，只保留通用触发器与浮层定位）
     - `Button` / `IconButton`（移除 `config-base.css` 对裸 `button` 标签的全局污染）
     - `Badge` / `StatusPill`（统一 `.badge`、`.judge-tag`、`.judge-pill`、`.verdict-badge`）
     - `AlertBanner`（统一 `CliStatusBanner`、`ConfigAlerts` 与状态提示条）
     - `PageHeader`（统一 `/config`、`/pair`、`/fingerprint`、`/view` 页头，修复孤儿类名）
2. **`src/app/components/domain/`（跨页复用的领域业务组件）**：
   - 放置被 2 个以上路由页面共享的鹈鹕评测领域组件：
     - `svg-viewer/`（`SvgFrame`、`LazySvgFrame`、`svg-sanitize`、`svg-shadow`）
     - `standard/`（合并 `ModelStandardPanel` 与 `ArtViewerFoot` 的 `StandardDrawer` 内容，含 `ReferenceSourceDisplay`）
     - `judge/`（统一评审分数胶囊与 C1–C9 / G1–G5 判据表）
     - `i18n/`（将 `LanguageSwitch` 从 `toolbar/` 提升至独立共享层）
     - `profile/`（解耦 `ProfileName` 对 `DashboardCard[]` 全量卡片数组的直接依赖，改为传入已聚合的统计摘要）
3. **路由内聚的页面组件（`src/app/(dashboard)/`、`src/app/view/`、`src/app/config/`、`src/app/pair/`、`src/app/fingerprint/`）**：
   - 仅服务于首页看板的 `toolbar/`、`timeline/`、`run-control/`、`run-status/`、`export/`、`live-state/` 应归入首页专属目录，避免与全站共享组件混放。
   - 清理 `.matrix` 与 `.profile-card` 的跨页同名冲突，修复 `pair.css` 中未定义的 `--line` / `--danger` 变量。
