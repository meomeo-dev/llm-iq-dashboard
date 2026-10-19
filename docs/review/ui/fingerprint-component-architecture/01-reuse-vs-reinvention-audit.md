# 指纹页组件级「复用 vs 重复造轮子 / 拼凑缝合」全量审计

## 1. 审计范围与总体结论

本次审查覆盖 `src/app/fingerprint/` 下的全部 12 个 `.tsx` 文件（11 个客户端组件文件 + `page.tsx`）、5 个 `.ts` 模型/状态文件与 4 个 `.css` 样式文件，横向对比主看板（`src/app/components/`）、配置页（`src/app/config/`）与作品查看页（`src/app/view/`）。

**核心结论**：
1. **缺乏跨页面共享的布局与基础容器组件层**：全站未规划统一的页面顶栏（PageHeader）、抽屉（Drawer）、模态窗外壳（ModalShell）、二次确认按钮（ConfirmButton）或横幅通知（Banner）。每个新页面均从零手写布局骨架。
2. **「借壳拼凑 + 逻辑克隆」替代了组件化抽象**：`/fingerprint` 在引入主看板的「跑一次」面板、24 小时泳道和多上游对比弹窗时，由于原组件与评测轮次的数据结构（`RunOptionsView`、`Moment.cards: DashboardCard[]`）硬绑定，开发者没有对原组件做参数化抽离，而是采取了**「表层 import 叶子组件 + 跨目录 `@import` 私有 CSS + 整段复制粘贴状态/外框代码并改名 + 构造伪造数据结构欺骗原组件」**的做法。
3. **交互与无障碍体验因重复造轮子而退化**：自研的 `FingerprintSampleDrawer` 漏掉了主看板模态窗已有的 `useModalBehavior`（无 `Escape` 关闭、无背景滚动锁定、无焦点归还、无 `role="dialog"`）；自研的 `CheckTechDrawer` 漏掉了 `/view` 抽屉已有的展开箭头旋转样式；自研的 `CheckLauncherFooter` 停止按钮漏掉了 `StopRunButton` 的二次确认防误触机制。

---

## 2. 全量文件复用与重造分类总表

| 指纹页文件 | 行数 | 复用主看板/全局模块 | 重复造轮子 / 复制粘贴改名部分 | 审计定性 |
| --- | ---: | --- | --- | --- |
| [FingerprintDashboard.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx) | 280 | `RunStatus`、`ProfilesProvider`、`useStoredTimeZone`、`LanguageSwitch`、`useLiveFingerprintJob` | 手写 `<header className="fp-header">`；右侧硬塞 `.toolbar` 内部控件；自建 `openMenu` 状态与 `useRunProgress` 形成双轨刷新 | 拼凑缝合 |
| [FingerprintSampleDrawer.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx) | 209 | `useI18n` | 手写 `.fp-drawer-backdrop` + `.fp-drawer`（未用 `useModalBehavior`）；手写 `confirmingReset` 二次确认状态机（重复 `StopRunButton`） | 重复造轮子（体验降级） |
| [FingerprintCheckTechDrawer.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx) | 173 | `useI18n`、`StatefulActionButton` | 手写 `<details className="fp-tech-drawer">`，重复实现 `src/app/view/JudgeDrawer.tsx` 的 `.viewer-drawer` 手风琴结构 | 重复造轮子 |
| [FingerprintCheckPanel.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckPanel.tsx) | 236 | `Menu`、`PickerHead`、`ModelRows`、`RunOncePrompts`、`RunOnceProfileModal` | 复制 `RunOnceMenu.tsx` 的双栏 Tab 切换状态与 `.run-once-head-bar` 头部 DOM；重写 `useCheckSelectorState` 替代 `useRunOnceSelection` + `useRunOnceProfiles` | 半复用半克隆 |
| [FingerprintCheckSections.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx) | 239 | `StartMode` 类型 | `checkStartLabel` + `CheckLauncherFooter` 克隆自 `RunOnceFooter.tsx`；`UnreadyBaselineNote` 克隆自 `UnavailableNote.tsx`；`CheckEmptyDay` 克隆自 `EmptyDay.tsx` | 复制粘贴重命名 + 杂物间拼凑 |
| [FingerprintCheckTimeline.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx) | 287 | `TimelineAxis`、`layoutColumns`、`listDays`、`Menu`、`Calendar` | `useScrollAnchor` 100% 复制自 `RunGrid.tsx`；`useNowTick` 100% 复制自 `use-dashboard-time.ts`；`.matrix` 泳道骨架与 `CheckRowLabel` 复制自 `RunGrid.tsx`；日期菜单 JSX 复制自 `ToolbarMenus.tsx` | 高度复制粘贴 |
| [FingerprintCheckTile.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx) | 163 | `useProfiles`、`profileColor`、`profileLabel` | 借用 `.folder` / `.folder-slot` 样式覆写为 2×3 探针宫格；`ProbeSlotLegend` 与 `CheckVerdictLegend` 复制自 `FolderTile.tsx` 的 `SlotLegend` / `StatusLegend` | 借壳改写 |
| [FingerprintCheckModal.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx) | 135 | `useModalBehavior`、`ProfileName`、`useProfiles` | `.modal-head` 头部结构复制自 `ModelModalHeader.tsx`；`CheckProfileMatrix` 复制改写自 `ProfileMatrix.tsx` | 复制粘贴重命名 |
| [FingerprintCheckDetail.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckDetail.tsx) | 232 | `useI18n` | 指纹专属的四段式核验详情卡（结论条 + 候选模型相似度排行 + 6 探针表现网格 + 技术抽屉入口） | 领域专属组件 |
| [FingerprintMatrix.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintMatrix.tsx) | 230 | `useI18n` | 基准样本矩阵表格与 `FillPlanPreviewBox`（内联复用 `.fp-job-banner` 样式） | 领域专属组件 |
| [FingerprintMatrixHead.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintMatrixHead.tsx) | 234 | `useI18n` | 混放 `useMatrixBundleActions`、`FillProfileSelect`、`StatefulActionButton`、`MatrixCardHeader`、`MatrixBundleBanner`、`MatrixTableHead` | 模块边界混乱 |
| [page.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx) | 111 | 鉴权与 `core/model-fingerprint` | L45–L96 的快照组装逻辑与 `src/app/api/fingerprint/route.ts` L108–L151 逐段重复 | 服务端逻辑复制粘贴 |
| [fingerprint-check-store.ts](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts) | 88 | 无 | 整文件克隆自 `src/app/components/run-control/run-selection-store.ts`（`localStorage` 读写与集合校正） | 100% 重复造轮子 |
| [fingerprint-check-model.ts](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts) | 449 | `resolvePickedProfiles`、`ProfileChoice`、`StartMode` | `supportsCheckProfiles`、`shortenItems`、`buildUnionProfileChoices`、`resolveCheckStartMode`、`buildCheckRoundMeta` 克隆自 `run-once-profiles.ts` | 半复用半克隆 |
| [fingerprint-timeline-model.ts](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline-model.ts) | 292 | `Moment`、`zonedDayKey`、`orderProfileNames` | `groupCheckMoments` 克隆改写自 `moments.ts`；为适配 `Moment` 构造 `new Array<DashboardCard>(n)` 稀疏假数组 | 耦合强凑 |
| [fingerprint-detail-model.ts](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-detail-model.ts) | 243 | 无 | 核验详情卡片视图模型计算 | 领域专属模型 |
| [fingerprint-model.ts](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-model.ts) | 413 | `actionFetch` | 混放矩阵视图模型、数字格式化、请求 JSON 构造、HTTP 请求与浏览器文件下载副作用 | 职责过载 |

---

## 3. 五大核心模块横向对比与逐行证据

### 3.1 页面头部：`FingerprintHeader` vs `Toolbar.tsx` / `ConfigPageHeader.tsx` / `ArtViewerHead.tsx`

#### （1）全站四套顶栏各自为政，无共享 `<PageHeader>`
对比全站 4 个页面的顶栏实现：
- **主看板（`/`）**：[`Toolbar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Toolbar.tsx#L68-L106) 使用 `<header className="toolbar">`，分为 `.toolbar-top-row`（`ToolbarBrand` + `ToolbarMenus` + `ToolbarUtils`）与 `.toolbar-center`（`.toolbar-stack.stats` + `RunOnceMenu` + `AutoRunToggle`）。跨页入口使用 32×32px 的 `.icon-link` 图标按钮（[`ToolbarUtils.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L72-L98)）。
- **配置页（`/config`）**：[`ConfigPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L6-L23) 使用 `<header className="masthead">`，将 `<Link className="nav-link" href="/">` 和 `<LanguageSwitch />` 直接嵌套在 `<h1>` 标签内部（L12–L18）。
- **作品查看页（`/view`）**：[`ArtViewerHead.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L36-L93) 使用 `<header className="viewer-head">`，右侧操作区使用 `<nav className="viewer-actions">` 包裹原生 `<a>`。
- **指纹页（`/fingerprint`）**：[`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L245-L280) 的 `FingerprintHeader` 手写了第 4 套顶栏 `<header className="fp-header">`（样式见 [`fingerprint.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L20-L61)）。

#### （2）在自定义 `.fp-header` 中硬塞 `.toolbar` 体系控件导致的样式寄生与规格冲突
- **跨目录寄生导入私有 CSS**：`FingerprintHeader` 本身不使用 `.toolbar` 容器，却在 `.fp-header-actions`（[`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L262-L271)）中塞入了原本为 `.toolbar` 设计的 `FingerprintCheckPanel`（使用 `.run-once-label` / `.run-once-panel`）和 `RunStatus`（使用 `.run-pill` / `.run-panel`）。为此，[`fingerprint.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L2-L6) 只能在文件顶部用 `@import` 强行拉入 5 个 `src/app/components/` 子目录的内部样式表：
  ```css
  @import "../components/toolbar/toolbar-elements.css";
  @import "../components/menu/menu.css";
  @import "../components/run-status/run-status.css";
  @import "../components/run-control/run-control.css";
  @import "../components/profile/profile.css";
  ```
- **同一行内 3 类按钮呈现 3 种高度与 3 种圆角**：在 `.fp-header-actions`（[`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L262-L271)）中并排放置的控件各自遵循不同规范：
  1. `RunOnce` 与 `RunStatus` 触发器（`.menu-button`，[`menu-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L12-L32)）：`padding: 6px 10px`、`border-radius: 8px`、默认 `border: 1px solid transparent`，仅在 hover 或展开时显示边框。
  2. `<LanguageSwitch />`（`.lang-switch`，[`globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L110-L125)）：固定 `height: 30px`、`padding: 0 10px`、`border-radius: 7px`、常驻 `border: 1px solid var(--border)`。
  3. 导航链接 `<a className="fp-nav-link">`（[`fingerprint.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L48-L61)）：未声明 `height`（靠 `padding: 6px 12px` 与 `line-height: 1.55` 撑出约 `34px` 高）、`border-radius: var(--radius)`（`10px`）、常驻 `border: 1px solid var(--border)`；且未使用 Next.js `<Link>`（对比 [`ConfigPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L14)），点击返回首页会触发浏览器整页硬刷新。
- **日历控件（`Calendar`）位置与主看板割裂**：主看板的日期选择菜单位于顶栏左侧 [`ToolbarMenus.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarMenus.tsx#L40-L67)；而指纹页因为 `FingerprintHeader` 只写了标题与右侧动作区，到了 [`FingerprintCheckTimeline.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L180-L217) 需要按日查看泳道时，只能把 `<Menu panelClassName="day-panel">` + `<Calendar>` 塞进泳道面板内部的 `.board-head > .fp-board-actions` 中，并把 [`ToolbarMenus.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarMenus.tsx#L47-L56) 的 `.day-panel-head-bar` 移动端标题栏 JSX 原样复制到了 [`FingerprintCheckTimeline.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L197-L207)。

---

### 3.2 抽屉与折叠面板：`FingerprintSampleDrawer.tsx` & `FingerprintCheckTechDrawer.tsx` vs `JudgeDrawer.tsx` / `use-modal-behavior.ts`

指纹页存在两个带 `Drawer` 命名的组件，分别暴露了**模态行为缺失**与**手风琴样式重复造轮子**两类问题：

#### （1）侧滑抽屉 `FingerprintSampleDrawer.tsx` 未接入 `useModalBehavior`，缺失核心交互与无障碍属性
对比 [`FingerprintSampleDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L45-L90) 与主看板模态窗体系（[`ModelModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModal.tsx#L37-L45)、[`RunOnceProfileModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx#L39-L43)、[`use-modal-behavior.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L4-L22)）：

| 维度 | `ModelModal` / `RunOnceProfileModal` / `FingerprintCheckModal` | `FingerprintSampleDrawer`（[`L45–L61`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L45-L61)） | 缺陷影响 |
| --- | --- | --- | --- |
| `Escape` 键关闭 | 调用 [`useModalBehavior(onClose)`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L11-L14)，监听全局 `keydown` `Escape` | **无任何键盘事件监听** | 用户按 `Esc` 无法关闭样本抽屉 |
| 背景滚动锁定 | `useModalBehavior` 设置 `document.body.style.overflow = "hidden"`（[`L8–L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L8-L9)） | **未锁定 `body` 滚动** | 鼠标在遮罩区或抽屉滚到底部时，底层矩阵页面随之滚动 |
| 焦点管理 | 打开时聚焦关闭按钮 `closeButton.current?.focus()`，关闭时归还触发按钮 `opener?.focus()`（[`L7, L10, L18`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L7-L18)） | **无 ref、无焦点接管与归还** | 键盘焦点留在背后的矩阵单元格按钮上 |
| ARIA 角色声明 | `<section role="dialog" aria-modal="true" aria-label={...}>` | 裸 `<div className="fp-drawer-backdrop"><aside className="fp-drawer">`，**无 `role` 与 `aria-modal`** | 屏幕阅读器与自动化测试无法识别为模态抽屉 |
| 遮罩点击事件 | `onPointerDown={(e) => e.target === e.currentTarget && onClose()}` | `onClick={onClose}` + 内部 `onClick={(e) => e.stopPropagation()}`（[`L46–L47`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L46-L47)） | 用户在抽屉 `<pre className="fp-pre">` 内按住鼠标拖拽复制样本值、指针移出抽屉边缘松开时，会误触发 backdrop `onClick` 关闭抽屉 |

此外，`DrawerGapActions`（[`FingerprintSampleDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L104-L143)）为「重置此探针样本」按钮手写了一套 `confirmingReset` 布尔状态机（点击后展开警告文案 +「确认」+「取消」），与 [`StopRunButton.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/StopRunButton.tsx#L14-L60) 的 `confirming` 二次确认状态机完全同构，未提取为共享的二次确认按钮组件。

#### （2）折叠面板 `FingerprintCheckTechDrawer.tsx` vs `/view` 的 `JudgeDrawer.tsx` / `ArtViewerFoot.tsx`
- 在作品查看页 `/view` 中，[`JudgeDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L29-L56) 与 [`ArtViewerFoot.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L32-L99) 已经建立了一套基于 `<details className="viewer-drawer"><summary>...</summary><div className="viewer-drawer-body">...</div></details>` 的折叠抽屉规范（见 [`viewer-drawers.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L3-L55)），通过 `summary::before { content: "▸"; transition: transform 0.15s ease; }` 与 `.viewer-drawer[open] summary::before { transform: rotate(90deg); }` 实现展开时三角图标旋转。
- 而在指纹页核验模态窗中，[`FingerprintCheckTechDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L32-L66) 没有复用 `.viewer-drawer`，而是在 [`fingerprint-check-modal.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L252-L269) 中另起炉灶写了 `.fp-tech-drawer` / `.fp-tech-summary` / `.fp-tech-body`，并在 [`FingerprintCheckTechDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L35) 中把字符 `▸ ` 硬编码进 JSX 文本：
  ```tsx
  <span>▸ {isEn ? `Technical Details & Raw Samples (${vm.totalAttemptCalls} calls)` : `展开技术明细与原始采样（${vm.totalAttemptCalls} 次调用）`}</span>
  ```
  导致 `<details>` 展开后，文本前的 `▸` 不会旋转为向下，文案也始终停留为“展开技术明细”。

---

### 3.3 任务发起面板：`FingerprintCheckPanel.tsx` vs `src/app/components/run-control/RunOnceMenu.tsx`

[`FingerprintCheckPanel.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckPanel.tsx) 复用了 `Menu`、`PickerHead`、`ModelRows`、`RunOncePrompts`、`RunOnceProfileModal` 五个组件，但其余外壳、状态持久化与 Profile 计算逻辑全部通过复制粘贴分叉实现：

#### （1）只因一个标题文案未参数化，复制整段 `RunOnceHeadBar` JSX
- [`RunOnceHeadBar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceHeadBar.tsx#L53-L101) 封装了 `.run-once-head-bar`、两个 `.run-once-head-cell`（移动端切换 `models` / `prompts` Tab）与右上角 `.run-once-close` 关闭按钮，但第 84 行将右列标题硬编码为 `title={isEn ? "Prompts" : "题目"}`。
- [`FingerprintCheckPanel.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckPanel.tsx#L199-L209) 为了把右列标题显示为 `st.fp.check.probesLabel`（“探针选择”），没有给 `RunOnceHeadBar` 增加一个可选的 `secondColumnTitle?: string` 属性，而是把 `div.run-once-head-bar`、两个 `div.run-once-head-cell`、`PickerHead` 和 `button.run-once-close` 的 11 行 JSX 原封不动复制了一遍。

#### （2）底部栏 `CheckLauncherFooter` 克隆自 `RunOnceFooter.tsx`，且丢掉了停止确认保护
- [`FingerprintCheckSections.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx#L12-L24) 的 `checkStartLabel` 与 [`RunOnceFooter.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceFooter.tsx#L26-L33) 的 `startLabel` 分支结构与按钮文案高度重复：
  - `RunOnceFooter.tsx` L28–L32：`Starting…` / `发起中…`、`Select Profiles & Start` / `选择 Profile 后开始`、`Start (${mode.calls} calls)` / `开始（${mode.calls} 次调用）`。
  - `FingerprintCheckSections.tsx` L19–L23：逐字复制上述分支，仅将 `Round running…` 改为 `Verification running…`。
- 在停止运行按钮上，[`RunOnceFooter.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceFooter.tsx#L63) 复用了带二次确认的 `<StopRunButton runId={activeRunId} stopping={stopping} />`；而 [`FingerprintCheckSections.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx#L92-L96) 却手写了一个无二次确认的裸按钮：
  ```tsx
  {activeJob !== null && onCancelJob && (
    <button type="button" className="run-stop" onClick={onCancelJob}>
      {fp.matrix.cancelJobBtn}
    </button>
  )}
  ```

#### （3）`localStorage` 选择缓存层与 Profile 决策逻辑成片克隆
对比指纹页模型文件与 `src/app/components/run-control/` 下的同名逻辑：

| 指纹页函数与位置 | 主看板原函数与位置 | 重复度与差异说明 |
| --- | --- | --- |
| [`readStoredCheckProfiles` / `writeStoredCheckProfiles`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts#L32-L51) | [`readStoredProfiles` / `writeStoredProfiles`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts#L195-L217) | **除 Storage Key 常量名外，20 行代码逐字 100% 相同** |
| [`readStoredCheckSelection` / `writeStoredCheckSelection`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts#L7-L30) | [`readStoredSelection` / `writeStoredSelection`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts#L34-L90) | 克隆后仅将属性名 `prompts` 改为 `probes`，去掉了 `candidateOverrides` |
| [`reconcileCheckTargets` / `resolveCheckProbes`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts#L53-L88) | [`resolveTargetsSelection` / `resolvePromptsSelection` / `reconcileRunSelection`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts#L105-L174) | 集合初始化与有效 ID 过滤逻辑完全重复，未抽象通用的 `createSelectionStore(key)` |
| [`supportsCheckProfiles`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts#L72-L74) | [`supportsProfiles`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-profiles.ts#L28-L30) | **100% 相同**：`return (PROFILE_CLIS as readonly string[]).includes(cli);` |
| [`shortenItems`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts#L314-L320) | [`shorten`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-profiles.ts#L135-L141) | **7 行代码逐字 100% 相同** |
| [`buildUnionProfileChoices`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts#L214-L248) | [`profileChoices`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-profiles.ts#L40-L73) | 构造 `login` + `upstreams` 的 `ProfileChoice[]` 结构重复 |
| [`resolveCheckStartMode`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts#L322-L347) | [`startMode`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-profiles.ts#L99-L117) | 判断 `available.length === 0 | 1 | >1` 返回 `StartMode` 的状态机完全一致 |
| [`buildCheckRoundMeta`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-model.ts#L349-L369) | [`describeRound`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-profiles.ts#L120-L133) + [`loginOnlyNote`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx#L31-L38) | 拼接 `${shortenItems(combos)} × ${shortenItems(titles)}` 与 `${names} 只跑登录态` 完全重复 |

---

### 3.4 任务状态控制：`FingerprintDashboard.tsx` 与 `RunStatus.tsx` 的双轨状态与双套取消链路

虽然 [`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L264-L267) 在顶栏挂载了主看板的 `<RunStatus>` 组件，但底层状态同步与作业控制实际上处于**「两套机制并存、双倍请求刷新、两个取消接口各走各路」**的拼凑状态：

1. **SSE 双通道广播同一份指纹作业**：
   - 在 [`live-hub.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/api/events/live-hub.ts#L183-L194) 与 [`progress.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/progress.ts#L263-L277) 中，服务端一方面把指纹作业经 [`fingerprintJobToProgressView`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/job.ts#L376-L394) 伪装成评测轮次 `ProgressView`（把 `probe#i` 塞进 `CallProgress.promptId`）放进 `progress` 事件推给 `RunStatus`；另一方面又把同一个作业放进 `fingerprint-job` 事件推给 `FingerprintDashboard.tsx` 的 `useLiveFingerprintJob()`（[`live-store.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L53-L55)）。
2. **作业执行期间触发双倍全量重算（`router.refresh()` + `fetch("/api/fingerprint")`）**：
   - `RunStatus` 内部的 [`useRunProgress.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/useRunProgress.ts#L17-L22) 在每次 `done` 调用数变化时执行 `router.refresh()`，触发 Next.js 重新执行 [`src/app/fingerprint/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx#L40-L111) 的服务端全量样本读取与自检标定计算；
   - 与此同时，[`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L74-L79) 的 `useEffect` 监听 `completedCalls` 变化，每次变化又立即发起客户端 `fetch("/api/fingerprint")`（[`refreshAll`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L58-L64)），触发 [`src/app/api/fingerprint/route.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/api/fingerprint/route.ts#L132-L151) 再跑一遍完全相同的全量磁盘读取与 `buildSelfTestReport` 计算。
   - 并且 [`src/app/fingerprint/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx#L45-L96) 的 SSR 装载代码并没有更新 [`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L41) 的 `useState(initialSnapshot)`（因为 `useState` 只在挂载时读一次初始值），导致 `RunStatus` 触发的 `router.refresh()` 在 `/fingerprint` 页面纯属空转浪费服务端算力！
3. **停止同一个指纹作业存在两套 UI 按钮与两个后端 API**：
   - 路径 A（在 `RunStatus` 下拉面板内点击停止）：使用 [`StopRunButton.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/StopRunButton.tsx#L11-L78)，**有二次确认**，请求 `POST /api/run/cancel`（`{ runId }`），由 [`src/app/api/run/cancel/route.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/api/run/cancel/route.ts#L42-L50) 的 `findActiveFingerprintJob` 分支处理。
   - 路径 B（在紧邻的 `FingerprintCheckPanel` 下拉面板底部点击停止）：使用 [`CheckLauncherFooter`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx#L92-L96) 的裸 `<button className="run-stop">`，**无二次确认**，调用 [`FingerprintDashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L143-L148) 的 `cancelJob()`，请求 `POST /api/fingerprint`（`{ action: "cancel", jobId }`），由 [`src/app/api/fingerprint/route.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/api/fingerprint/route.ts#L281-L294) 的 `handleCancelPost` 处理。

---

### 3.5 泳道与模态窗：`FingerprintCheckTimeline.tsx` / `FingerprintCheckModal.tsx` vs `DashboardBoard.tsx` / `RunGrid.tsx` / `ModelModal.tsx`

核验历史泳道与核验详情模态窗对主看板时间线与模态窗进行了大面积的**源码级复制粘贴后改名**：

#### （1）逐函数/逐组件复制对照表

| 指纹页实现 | 主看板原实现 | 证据对比 |
| --- | --- | --- |
| [`useScrollAnchor`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L277-L287) | [`useScrollAnchor`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunGrid.tsx#L114-L124) | **11 行代码逐字 100% 相同**，连变量名 `scroller`、`anchor`、`element` 都一字未改 |
| [`useNowTick`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L267-L275) | [`useNow`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/use-dashboard-time.ts#L8-L16) | **逻辑 100% 相同**（挂载后 `new Date()` + `setInterval(..., 30_000)`），仅改了函数名 |
| [`CheckBoardHead`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L166-L218) | [`DashboardBoard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/DashboardBoard.tsx#L53-L68) + [`ToolbarMenus.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarMenus.tsx#L40-L67) | 复制 `.board-head` > `.board-title` + `.board-title-sub` 标题结构，以及 `.day-panel-head-bar` + `<Calendar>` 的完整 JSX |
| [`FingerprintCheckTimeline` 矩阵骨架](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L113-L154) | [`RunGrid.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunGrid.tsx#L52-L96) | `.matrix` > `.matrix-labels`（`.matrix-labels-spacer` + `.lane-head` + `.row-label`）+ `.track`（`TimelineAxis` + `.lane-line` + `.row-track`）+ `.matrix-empty` 的 DOM 树完全克隆 |
| [`CheckRowLabel` 上游色点](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L239-L245) | [`RowUpstreams`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunGrid.tsx#L100-L112) | `.row-label-profiles` > `.profile-dot` 渲染代码完全重复 |
| [`ProbeSlotLegend` / `CheckVerdictLegend`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx#L126-L163) | [`SlotLegend` / `StatusLegend`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/FolderTile.tsx#L121-L168) | 复制 `.slot-legend` 与 `.status-legend` 结构 |
| [`FingerprintCheckModal` 头部](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L60-L82) | [`ModelModalHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModalHeader.tsx#L50-L89) | 复制 `<header className="modal-head"><div className="modal-heading"><h2 className="modal-title">...<p className="modal-sub">...<div className="modal-head-actions"><button className="modal-close">×` |
| [`CheckProfileMatrix`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L95-L135) | [`ProfileMatrix.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ProfileMatrix.tsx#L29-L68) | 复制 `.profile-matrix` > `.profile-matrix-col` > `.profile-matrix-login` / `<ProfileName>` 多上游并排矩阵 |

#### （2）复制改写过程中引入的 3 处具体缺陷与脆弱 Hack
1. **为凑 `Moment` 接口构造稀疏 `undefined` 数组（[`fingerprint-timeline-model.ts` L157](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline-model.ts#L157)）**：
   - 主看板 [`moments.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/moments.ts#L9-L20) 的 `Moment` 接口写死了 `cards: DashboardCard[]`，且 [`momentHealth`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/moments.ts#L75-L79) 用 `moment.okCount === moment.cards.length` 判断时间轴圆点颜色。
   - 指纹泳道的 `CheckMoment` 并不是 `DashboardCard`，开发者没有把 `Moment` 解耦为基础接口 `TimelinePoint { ..., okCount: number; totalCount?: number }`，而是在 [`finalizeCheckMoment`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline-model.ts#L157) 中写了：
     ```ts
     cards: new Array<DashboardCard>(m.records.length),
     ```
     用一个长度为 `m.records.length`、内部元素全为 empty slot（`undefined`）的假 `DashboardCard[]` 欺骗 TypeScript 类型检查和 `momentHealth`。一旦任何接收 `Moment` 的函数遍历 `moment.cards`，运行时立即崩溃。
2. **图例复制时写错类名导致样式失效（[`FingerprintCheckTile.tsx` L149, L153, L157](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx#L149-L160)）**：
   - 主看板 [`FolderTile.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/FolderTile.tsx#L146) 使用 `<span className="legend-item">`，对应 [`folder.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/folder.css#L141-L145) 的 `display: inline-flex; align-items: center; gap: 5px;`。
   - `CheckVerdictLegend` 复制时凭空改名为 `<span className="status-legend-item">`，但 `folder.css` 与 `fingerprint-timeline.css` 中均无 `.status-legend-item` 规则，导致图例中的圆点 `.status-dot` 与文字失去 `gap: 5px` 间距和垂直居中对齐。
3. **行标签复制时残留未定义的幽灵 CSS 类名（[`FingerprintCheckTimeline.tsx` L247, L255](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L247-L260)）**：
   - `CheckRowLabel` 渲染了 `<div className="row-pass"><div className="row-pass-head">...<span className="row-pass-pct">`，而在 [`timeline-board.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L121-L152) 与 [`fingerprint-timeline.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css) 中只有 `.row-pass-total` 和 `.row-pass-efforts`，根本不存在 `.row-pass-head` 和 `.row-pass-pct` 的样式定义。
4. **`CheckProfileMatrix` 用内联样式强行覆盖 `.profile-matrix` 网格列定义（[`FingerprintCheckModal.tsx` L106–L111](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L106-L111)）**：
   - 主看板 [`model-modal-content.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-content.css#L36-L42) 的 `.profile-matrix` 硬编码了 `grid-template-columns: 56px repeat(var(--upstream-count), minmax(260px, 1fr))`（首列 `56px` 给思考强度行标题）。
   - 指纹弹窗不需要首列强度标题，却直接借用了 `.profile-matrix` 类名，再在 JSX 的 `style` 属性里写 `gridTemplateColumns: \`repeat(${records.length}, minmax(310px, 1fr))\`` 强行覆盖 CSS 的列模板。
