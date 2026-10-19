# 专题二：代码行数门禁驱动的机械切碎审计（Line-Limit-Driven Fragmentation）

## 1. 审计结论摘要

结合 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L1-L26)、[`scripts/code-length/checker.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/checker.ts#L18-L27)、[`scripts/code-length/ast.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/ast.ts#L87-L109) 以及历史重构提交（`220c49f`、`d226fd4`、`f4c5f90`、`0babae0`、`a18abee`）审查可见：

1. **门禁规则对 React 组件与 CSS 的机械约束效应**：
   - 门禁规定 `.tsx` 文件上限 **300 行**、函数上限 **80 行**；`.ts` 文件上限 **500 行**、函数上限 **50 行**；`.css` 文件上限 **300 行**（[`config/code-length-policy.yaml#L4-L11`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L4-L11)）。
   - 在 [`scripts/code-length/ast.ts#L87-L109`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/ast.ts#L87-L109) 中，AST 检查器计算外层 React 组件函数从 `{` 到 `}` 的总物理行数（包含内部所有 `useState`/`useEffect`、事件处理函数以及整棵 JSX 返回树）。一旦一个组件超过 80 行，或一个 `.css` 文件超过 300 行，`pre-commit` 钩子即阻断提交。
2. **CSS 被按 300 行阈值截断，导致同一选择器的基础样式与响应式 `@media` / 状态类跨文件撕裂**：
   - 全站出现 **9 个仅含 `@import` 的空壳聚合 CSS 文件**，将原本内聚的组件样式按行数切分为 30+ 个碎片文件。多处出现「基础规则在 A 文件、关闭按钮或 `@media` 响应式规则被塞进 B 文件（甚至塞进毫不相干的 `stop.css`）」的反模式。
3. **React 组件出现「解剖式切头去尾」与「一次性薄包装器」泛滥**：
   - 为将每个 `.tsx` 函数压在 80 行以内、文件压在 300 行以内，大量原本内聚的视图被按 DOM 部位切为 `Head` / `Center` / `Foot` 或被套上仅做 Props 透传的 `Shell` / `Toolbar` 包装器，且子碎片之间依赖全局 CSS 类名甚至 `display: contents` + Flex `order` 隐式耦合，无法独立演进或复用。
4. **纯逻辑抽离（正例）与视图/样式硬切（反例）并存**：
   - 仓库中将纯计算逻辑（如跑道布局、时区换算、SVG 净化、日历矩阵）抽离为独立 `.ts` 模块的做法属于**高质量职责分离**；而将紧耦合 JSX 与同选择器 CSS 按行数硬切的做法则属于**凑行数机械碎片化**。

---

## 2. CSS 机械切碎深度取证：9 组 `@import` 空壳聚合器与跨文件样式撕裂

为绕过 `.css` 单文件 300 行上限（[`config/code-length-policy.yaml#L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L9)），全站建立了 9 个仅含 `@import` 语句的聚合文件。审查其内部子文件可以发现，切分边界并非按独立子组件划分，而是**写满约 150~230 行后直接截断换下一个文件**：

### 2.1 典型撕裂案例逐项取证

| 聚合入口文件 | 被切分的子文件（行数） | 跨文件撕裂的具体代码证据 |
| :--- | :--- | :--- |
| [`run-control/run-control.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control.css#L1-L5) (5 行) | `run-control-menu.css` (233)<br>`run-control-foot.css` (63)<br>`run-control-auto.css` (87)<br>`run-control-stop.css` (143)<br>`run-control-profiles.css` (109) | **最典型的凑行数错位**：`.run-once-head-bar` 桌面样式写在 [`run-control-menu.css#L32-L52`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-menu.css#L32-L52)，但因为该文件已达 233 行，头部里的关闭按钮 `.run-once-close` 以及整个 `.menu-panel.run-once-panel`、`.run-once-head-bar`、`.run-once-body`、`.run-once-foot` 的 `@media (max-width: 640px)` 移动端样式（共 99 行）被硬塞进了名为「停止按钮」的 [`run-control-stop.css#L45-L143`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-stop.css#L45-L143)！ |
| [`run-status/run-status.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status.css#L1-L2) (2 行) | `run-status-panel.css` (194)<br>`run-status-calls.css` (98)<br>*(合计 292 行，逼近 300 行)* | 1. **状态修饰符被腰斩**：状态圆点 `.run-dot` 的基础样式及 `.running` / `.judging` / `.interrupted` / `.finished` 定义在 [`run-status-panel.css#L10-L34`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-panel.css#L10-L34)，而同一个 `.run-dot` 的 `.stopping` 与 `.cancelled` 状态却被切到了 [`run-status-calls.css#L74-L81`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-calls.css#L74-L81)。<br>2. **基础规则与 `@media` 紧邻截断**：[`run-status-panel.css#L190-L194`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-panel.css#L190-L194) 刚写完 `.run-calls` 基础规则，下一行紧接着针对 `.menu-panel.run-panel` 和 `.run-calls` 的 `@media (max-width: 768px)` 就被切到了 [`run-status-calls.css#L1-L24`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-calls.css#L1-L24) 开头。 |
| [`card/cards.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards.css#L1-L3) (3 行) | `cards-base.css` (95)<br>`cards-frame.css` (92)<br>`cards-footer.css` (103)<br>*(合计 290 行，逼近 300 行)* | `.card-grid` 的桌面 Grid 定义在 [`cards-base.css#L3-L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-base.css#L3-L9)，而 `.card-grid` 的移动端 `@media (max-width: 640px)` 覆盖却掉到了 [`cards-footer.css#L64-L68`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-footer.css#L64-L68)；同一个 `<article class="card">` 的 `header` 在 `cards-base.css#L23`，SVG 画布框在 `cards-frame.css#L3`，`footer` 在 `cards-footer.css#L3`。 |
| [`timeline/timeline.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline.css#L1-L2) (2 行) | `timeline-board.css` (152)<br>`timeline-track.css` (161)<br>*(合计 313 行，刚超 300 行)* | `.board-panel`、`.board-title`、`.row-label`、`.lane-head` 的桌面端样式全部定义在 [`timeline-board.css#L10-L118`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L10-L118)，但这些类名的 `@media (max-width: 768px)` 响应式调整却被切到了 [`timeline-track.css#L134-L161`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-track.css#L134-L161)。 |
| [`model-modal/model-modal.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal.css#L1-L3) (3 行) | `model-modal-dialog.css` (71)<br>`model-modal-standard.css` (164)<br>`model-modal-content.css` (128)<br>*(合计 363 行)* | 弹窗头部 `.modal-head` 及标题定义在 [`model-modal-dialog.css#L27-L61`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-dialog.css#L27-L61)，而位于 `.modal-head` 内部的关闭按钮 `.modal-close` 以及 `.modal` / `.modal-head` 的移动端 `@media (max-width: 640px)` 却被切到了 [`model-modal-content.css#L1-L18`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-content.css#L1-L18) 与 [`L87-L128`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-content.css#L87-L128)。 |
| [`toolbar/toolbar.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar.css#L1-L4) (4 行) | `toolbar-layout.css` (80)<br>`toolbar-responsive.css` (91)<br>`toolbar-elements.css` (130)<br>*(合计 301 行，仅超 1 行)* | 因总行数 301 行跨过 300 行红线被切为 3 个文件；且 [`toolbar-responsive.css#L72-L86`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-responsive.css#L72-L86) 跨目录直接覆写了属于 `run-control` 模块的 `.auto-run` 与 `.auto-run-switch` 样式。 |
| [`view/viewer.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer.css#L1-L4) (4 行) | `viewer-base.css` (83)<br>`viewer-drawers.css` (192)<br>`viewer-judge.css` (152) | `.viewer-head`、`.viewer-stage`、`.viewer-foot` 定义在 [`viewer-base.css#L9-L83`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L9-L83)，但针对它们的 `@media (max-width: 640px)` 规则却被放进了 [`viewer-drawers.css#L160-L174`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L160-L174)。 |
| [`menu/menu.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu.css#L1-L4) (4 行) | `menu-base.css` (85)<br>`menu-rows.css` (150)<br>`menu-panels.css` (176) | 将通用菜单与导出菜单（`.export-*`）、时区菜单（`.zone-id`）、筛选菜单（`.filter-*`）、日历菜单（`.day-panel`）混写后按行数切成 3 份。 |
| [`config/config.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config.css#L1-L13) (13 行) | 聚合 13 个 `config-*.css`（外加 `capability.css` 共 14 个文件） | 切出了仅 **4 行**（单条选择器）的 [`config-unscheduled.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-unscheduled.css#L1-L5) 与 **26 行**的 [`config-responsive.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-responsive.css#L1-L27)。 |

---

## 3. React 组件机械切分深度取证：解剖式切头去尾与薄包装器

由于 `.tsx` 函数上限为 **80 行**、文件上限为 **300 行**，一个包含常规表单或头部/主体/底部三段式布局的 React 组件一旦超过 80 行，就必须把内部 JSX 拆成独立函数或拆到新文件。这导致了以下四类典型机械切碎现象：

### 3.1 `Toolbar`：按左/中/右 DOM 部位硬切 + CSS `display: contents` 隐式重排耦合

首页工具栏被拆成 5 个组件文件：
1. [`DashboardToolbar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/DashboardToolbar.tsx#L1-L37)（37 行）：仅调用 `summarize(cards)`，随即将 **15 个 Props** 原封不动透传给 `<Toolbar>`。
2. [`Toolbar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Toolbar.tsx#L1-L107)（107 行）：为了让主函数 `Toolbar` 刚好停在 **69 行**（低于 80 行红线），将工具栏内部 JSX 按视觉位置切成了三个子组件：
   - [`ToolbarMenus.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarMenus.tsx#L1-L78)（78 行，紧贴 80 行上限）
   - [`ToolbarCenter.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarCenter.tsx#L1-L54)（54 行）
   - [`ToolbarUtils.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L1-L101)（101 行，主函数 74 行）
3. **跨文件隐式布局耦合证据**：
   - 在 [`Toolbar.tsx#L73-L103`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Toolbar.tsx#L73-L103) 中，`<ToolbarMenus>` 与 `<ToolbarUtils>` 被包裹在 `<div className="toolbar-top-row">` 内，而 `<ToolbarCenter>` 在其外部。
   - 但在桌面端样式 [`toolbar-layout.css#L26-L80`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-layout.css#L26-L80) 中，`.toolbar-top-row` 被设为 `display: contents;`，使 `<ToolbarMenus>`（`.toolbar-group`，`order: 2`）、`<ToolbarCenter>`（`.toolbar-center`，`order: 3`）、`<ToolbarUtils>`（`.toolbar-utils`，`order: 4`）以及品牌块（`.toolbar-brand`，`order: 1`）跨组件边界拍平进同一个父级 Flex 容器重排！
   - 同时，三个子组件通过魔术字符串 `openMenu: string | null`（`"day"`、`"filter"`、`"run"`、`"zone"`、`"run-once"`）共享互斥状态。它们既不能独立复用，也不能脱离彼此独立修改 DOM 层级。

### 3.2 `ArtViewer`：313 行单页视图因跨过 300 行文件红线被切成 4 份

`/view` 作品查看页总代码量仅 **313 行**，因恰好超过 `.tsx` 单文件 300 行上限，被按头部、舞台、底部、侧边切换切成了 4 个文件：
- [`ArtViewer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewer.tsx#L1-L43)（43 行）：仅组装 `<ArtViewerHead>`、`<div className="viewer-stage"><ArtViewerSiblings /></div>` 与 `<ArtViewerFoot>`。
- [`ArtViewerHead.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L1-L94)（94 行，函数 73 行）：仅在 `ArtViewer.tsx#L21` 调用 1 次。
- [`ArtViewerSiblings.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerSiblings.tsx#L1-L76)（76 行，函数 58 行）：仅在 `ArtViewer.tsx#L23` 调用 1 次。
- [`ArtViewerFoot.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L1-L100)（100 行）：仅在 `ArtViewer.tsx#L39` 调用 1 次。

### 3.3 `Dashboard` 与 `Pair`：为规避 80 行函数上限而产生的透传薄壳

1. **`Dashboard` 顶层三件套薄包装**：
   - [`Dashboard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/Dashboard.tsx#L27-L103)（主函数 **77 行**，卡在 80 行红线下）将 JSX 拆成 [`DashboardToolbar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/DashboardToolbar.tsx#L1-L37)（37 行）、[`DashboardBoard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/DashboardBoard.tsx#L1-L88)（88 行，函数 72 行）、[`DashboardModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/DashboardModal.tsx#L1-L45)（45 行）。
   - `DashboardToolbar` 与 `DashboardModal` 几乎不含独立业务逻辑，仅作为降低 `Dashboard` 函数行数的中间传手，把十几个状态与回调从 `Dashboard` 原样转发给 `Toolbar` 与 `ModelModal`。
2. **`Pair` 配对页：1 个简单输入框拆成 6 个微型文件（合计 220 行）**：
   - 整个 `/pair` 页面仅包含一个配对码文本输入框与已登录状态提示，却被拆成 6 个文件：[`PairForm.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairForm.tsx#L1-L38)（38 行）、[`PairCodeForm.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairCodeForm.tsx#L1-L44)（44 行）、[`PairSignedInCard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairSignedInCard.tsx#L1-L37)（37 行）、[`PairPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairPageHeader.tsx#L1-L33)（33 行）、[`use-pair-form.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/use-pair-form.ts#L1-L42)（42 行）、[`pair-form-model.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair-form-model.ts#L1-L33)（33 行）。

### 3.4 `src/app/config/`：59 个文件扁平堆积与 `ConfigSectionShell.tsx` 凑行数包装

`src/app/config/` 在**同一个扁平目录下堆放了 59 个文件**（31 个 `.tsx`、14 个 `.ts`、14 个 `.css`，没有任何子目录分类）：

1. **`ConfigSectionShell.tsx` 凑行数包装器**：
   - 为避免 [`ConfigEditor.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigEditor.tsx#L19-L89) 主函数（当前 **71 行**）超过 80 行上限，专门新建了 [`ConfigSectionShell.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigSectionShell.tsx#L1-L203)（203 行），在里面塞入了 8 个一次性包装组件（`PromptSection`、`HarnessGuardSection`、`ProfileSection`、`MatrixSection`、`ConfigEditorActions`、`ScheduleSection`、`JudgeSection`、`TimeoutSection`）。
   - 每个包装组件只有 10~20 行，唯一做的事就是写一层 `<ConfigSection title={...} hint={...}><XxxForm ... /></ConfigSection>`。
   - 更不一致的是，后加入的 [`ModelFingerprintSection.tsx#L20-L49`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ModelFingerprintSection.tsx#L20-L49) 与 [`DataRepoForm.tsx#L18-L40`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoForm.tsx#L18-L40)（`DataRepoSettingsSection`）没有放进 `ConfigSectionShell.tsx`，而是各自在文件内直接包裹 `<ConfigSection>`。
2. **极度细碎的微型文件**：
   - [`config-unscheduled.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-unscheduled.css#L1-L5)：仅 **4 行**。
   - [`device-panel-model.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/device-panel-model.ts#L1-L11)：仅 **11 行**（1 个接口 + 1 个常量）。
   - [`rotation-constants.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/rotation-constants.ts#L1-L8)：仅 **8 行**。
   - [`config-page-loader.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-page-loader.ts#L1-L28)：仅 **28 行**。
   - [`use-master-switch.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-master-switch.ts#L1-L29)：仅 **29 行**。

---

## 4. 合理职责分离 vs 机械凑行数切片对照表

并非所有小文件都是负面的。审计需要严格区分「**具备独立语义与可测边界的职责分离**」与「**纯粹为绕过 80/300 行红线而制造的机械切片**」：

| 类别 | 具体模块与文件 | 判定 | 工程依据 |
| :--- | :--- | :---: | :--- |
| **纯算法与领域计算抽离** | [`timeline/track-layout.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/track-layout.ts) (125 行)<br>[`timeline/effort-slots.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/effort-slots.ts) (103 行)<br>[`timeline/zoned-time.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/zoned-time.ts) (158 行)<br>[`toolbar/calendar-grid.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/calendar-grid.ts) (87 行) | **合理分离（正例）** | 纯函数输入输出清晰，不依赖 React DOM，可直接由 `test/` 下的单元测试独立验证。 |
| **安全沙箱与导出合成** | [`card/svg-sanitize.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/svg-sanitize.ts) (257 行) + [`svg-scope.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/svg-scope.ts) + [`svg-shadow.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/svg-shadow.ts)<br>[`export/timeline-svg.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/timeline-svg.ts) (364 行) + [`result-set-gif.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/result-set-gif.ts) (179 行) | **合理分离（正例）** | 净化管线、CSS 作用域改写、Shadow Root 挂载、SVG/GIF 编码各自构成高内聚的技术子域。 |
| **独立闭环的 UI 子组件** | [`card/LazySvgFrame.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/LazySvgFrame.tsx) + [`SvgFrame.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/SvgFrame.tsx)<br>[`toolbar/Calendar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Calendar.tsx)<br>[`view/JudgeDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx) | **合理分离（正例）** | Props 契约最小化，内部状态自包含，不依赖父组件特定 DOM 层级即可独立渲染。 |
| **CSS 按 300 行截断** | `run-control-*.css` (5 个文件)<br>`run-status-*.css` (2 个文件)<br>`cards-*.css` (3 个文件)<br>`timeline-*.css` (2 个文件)<br>`model-modal-*.css` (3 个文件)<br>`toolbar-*.css` (3 个文件)<br>`viewer-*.css` (3 个文件) | **机械切碎（反例）** | 同一个组件的基础选择器、状态修饰类（`.run-dot.*`）与 `@media` 响应式规则被分散在不同文件中，阅读和修改单个组件样式需要在 2~5 个文件间来回跳转。 |
| **JSX 按部位解剖切分** | `Toolbar` → `ToolbarMenus` / `Center` / `Utils`<br>`ArtViewer` → `ArtViewerHead` / `Siblings` / `Foot`<br>`RunOnceMenu` → `HeadBar` / `ModelRows` / `Prompts` / `Footer` | **机械切碎（反例）** | 仅被父组件单处调用，且强耦合父级 Flex/Grid 甚至 `display: contents` 布局，拆开后反而增加跨文件 Props 传递与认知负担。 |
| **一次性透传包装层** | `DashboardToolbar.tsx` / `DashboardModal.tsx`<br>`ConfigSectionShell.tsx` (8 个 Section 包装函数)<br>`Pair` 6 件套 | **机械切碎（反例）** | 无独立业务语义，仅为了把父组件函数行数压到 80 行以下而制造的中间转发层。 |

---

## 5. 架构与门禁改进建议

1. **按业务子域重组扁平目录（特别是 `src/app/config/`）**：
   - 将 `src/app/config/` 下 59 个散装文件按功能域归入子目录：`sections/schedule/`、`sections/targets/`、`sections/prompts/`、`sections/profiles/`、`sections/judge/`、`sections/timeout/`、`sections/data-repo/`、`sections/devices/`、`sections/fingerprint/`。
   - 移除 [`ConfigSectionShell.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigSectionShell.tsx)，让每个 Section 组件自带其 `<ConfigSection>` 外壳，统一 `ConfigEditor.tsx` 的装配模式。
2. **以「组件内聚」而非「行数截断」重构 CSS 切分边界**：
   - 严禁把同一个选择器的桌面规则与 `@media` 响应式规则切进不同文件（清理 `run-control-stop.css` 中寄居的 `.run-once-panel` 响应式规则、`run-status-calls.css` 中寄居的 `.run-dot` 状态与 `.run-panel` 响应式规则、`timeline-track.css` 中寄居的 `.board-*` 响应式规则）。
   - 若某个模块的 CSS 超过 300 行，应**先提炼通用 UI 原语样式**（如抽出通用 `<Modal>`、`<Badge>`、`<Button>`、`<Table>`、`<MobileSheet>` 的样式到 `src/app/components/ui/`），从根源上消除各业务模块重复编写的遮罩、头部、徽章和按钮 CSS，而不是将 350 行杂糅样式硬切成 2 个各 175 行的碎片。
3. **校准 AST 函数长度门禁对声明式 JSX 组件的统计方式**：
   - 在 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L6-L7) 与 [`scripts/code-length/ast.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/ast.ts#L87-L109) 中，80 行的 `.tsx` 函数上限对包含多段表单或头部/主体/底部结构的顶层组件过于严苛，直接诱导了 `ConfigSectionShell.tsx`、`DashboardToolbar.tsx`、`ArtViewerHead/Foot.tsx` 等纯粹凑行数的薄包装器。
   - 建议优先通过**提炼真正可复用的基础 UI 原语（`<Modal>`、`<Drawer>`、`<Badge>`、`<PageHeader>`）**来自然降低业务组件的 JSX 体积；对于純粹只有单处调用的内部布局块，避免跨文件拆出无法独立存在的碎片文件。
