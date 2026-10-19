# 跨页面 UX 一致性与组件规范审计报告

## 1. 审计范围与总体结论

本报告对 `llm_iq_dashboard` 全部 5 个页面路由的布局容器、顶部导航栏、表单与按钮控件、模态窗/抽屉/弹出菜单体系，以及 [`docs/ui/UX_STATE_MAP.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md) 与真实代码实现的对齐度进行全面核查：

1. **首页看板 `/`**：[`src/app/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/page.tsx)
2. **单幅作品大图查看页 `/view/[runId]/[file]`**：[`src/app/view/[runId]/[file]/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/[runId]/[file]/page.tsx)
3. **运行配置页 `/config`**：[`src/app/config/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx)
4. **设备配对页 `/pair`**：[`src/app/pair/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/page.tsx)
5. **模型指纹页 `/fingerprint`**：[`src/app/fingerprint/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx)

### 核心结论

1. **缺乏统一应用外壳（App Shell）与基础组件层**：[`RootLayout`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/layout.tsx#L34-L47) 仅提供 `<I18nProvider>`，不提供页面级导航骨架或公共 UI 原语。[`src/app/globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L18-L20) 中定义的 `--control-height: 32px`、`--radius-md: 7px`、`--radius-sm: 6px` 三个控件级 Token 仅被 `/fingerprint` 页面引用，其余 4 个页面全部硬编码像素值。
2. **5 个页面存在 4 套互不兼容的顶部导航结构，且 `/view` 存在导航死胡同**：`/view/[runId]/[file]` 没有任何返回首页 `/` 的链接；`/config` 与 `/pair` 将返回链接 `<Link className="nav-link">` 和 `<LanguageSwitch />` 直接嵌套在 `<h1>` 标题标签内部，并引用了仓库中不存在的幽灵类名 `.masthead` 与 `.prompt`。
3. **全局标签选择器污染与 `/pair` 原生控件样式缺失**：[`src/app/config/config-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L51-L122) 直接对无作用域的 `label`、`input`、`select`、`textarea`、`button` 声明全局样式；而 `/pair` 未引入该样式表，且 [`src/app/pair/pair.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L1-L30) 未定义按钮与输入框色彩、边框及 `.button` 类，还引用了未定义的 CSS 变量 `--line` 与 `--danger`，导致深色背景下渲染出浏览器默认的白底输入框、系统灰按钮和无样式链接。
4. **浮层体系（Modal / Drawer / Popover）缺乏统一分层与键盘事件管理**：全站 9 个浮层横跨 6 档硬编码 `z-index`（`50`～`1000`）与 5 种关闭按钮样式。[`RunOnceProfileModal`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx#L98-L110) 嵌套在带 `transform: translate(-50%, -50%)` 的 `.run-once-panel` 内，导致 `position: fixed` 遮罩被困在父级面板内，且按下 `Escape` 会同时关闭子弹窗与父菜单。
5. **[`docs/ui/UX_STATE_MAP.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md) 与代码实际状态严重脱节**：文档声称双向绑定的 [`scripts/ux_state_crawler.py`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/ux_state_crawler.py) 在仓库中不存在；文档遗漏了 `/fingerprint` 整页及 6 个新增弹窗/抽屉，且所记载的非所有者点击 `▶ 跑一次` 跳转流程、执行阶段枚举和移动端断点均与代码不符。

---

## 2. 页面容器与顶部导航栏（Header / Navigation）一致性审计

### 2.1 五页容器与顶部栏横向对比

| 页面路由 | 根容器标签与类名 | 最大宽度与内边距 | 顶部栏实现与类名 | 返回首页 `/` 入口 | 语言切换器 (`LanguageSwitch`) 位置 | 移动端适配缺陷 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `<div className="page">` → `<div className="workspace">` ([`page.tsx#L57`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/page.tsx#L57), [`Dashboard.tsx#L59`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/Dashboard.tsx#L59)) | `max-width: 1600px; padding: 20px 20px 48px` ([`globals.css#L76-L80`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L76-L80)) | `<header className="toolbar">` sticky 顶栏，高度 `52px`，圆角 `12px` ([`Toolbar.tsx#L69`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Toolbar.tsx#L69), [`toolbar-layout.css#L9-L22`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-layout.css#L9-L22)) | 当前即首页 | 位于 `.toolbar-utils` 右侧图标栏内 ([`ToolbarUtils.tsx#L98`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L98)) | `≤ 640px` 折成 3 行 Grid ([`toolbar-responsive.css#L27-L95`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-responsive.css#L27-L95)) |
| `/view/[runId]/[file]` | `<div className="viewer">` ([`ArtViewer.tsx#L34`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewer.tsx#L34))，未使用 `.page` | `height: 100vh; display: flex; flex-direction: column` ([`viewer-base.css#L3-L7`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L3-L7)) | `<header className="viewer-head">` 全宽底边框条 ([`ArtViewerHead.tsx#L36`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L36), [`viewer-base.css#L9-L17`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L9-L17)) | **无返回链接** | 位于 `.viewer-actions` 内，与 `.raw` 链接并排 ([`ArtViewerHead.tsx#L83-L90`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L83-L90)) | `.viewer` 锁死 `height: 100vh`，展开底部抽屉会挤压画布至 `0px` |
| `/config` | `<main className="page config-page-layout">` ([`config/page.tsx#L72`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L72)) | 外层 `1600px`，左侧栏 `240px`，表单区 `.config` 限宽 `1100px`，但末尾两面板溢出至 `1328px` | `<header className="masthead">`（幽灵类名，无对应 CSS）([`ConfigPageHeader.tsx#L10-L21`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L10-L21)) | `<Link className="nav-link" href="/">` 嵌在 `<h1>` 内 | 嵌在 `<h1>` 内，紧贴 `.nav-link` 右侧无间距 | `≤ 900px` 时 `ConfigSideNav` sticky 导航条出现在页头标题上方 |
| `/pair` | `<main className="page pair-page">` ([`pair/page.tsx#L41`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/page.tsx#L41)) | `max-width: 720px` ([`pair.css#L1-L3`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L1-L3)) | `<header className="masthead">`（幽灵类名，无对应 CSS）([`PairPageHeader.tsx#L13-L30`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairPageHeader.tsx#L13-L30)) | `<Link className="nav-link" href="/">` 嵌在 `<h1>` 内 | 嵌在 `<h1>` 内，紧贴 `.nav-link` 右侧无间距 | 窄屏下 `<h1>` 内标题、链接与按钮拥挤折行 |
| `/fingerprint` | `<main className="fp-page">` ([`FingerprintDashboard.tsx#L187`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L187))，未使用 `.page` | `max-width: 1480px; padding: 20px 20px 56px` ([`fingerprint.css#L11-L18`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L11-L18)) | `<header className="fp-header">` 独立顶栏 ([`FingerprintDashboard.tsx#L257-L272`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L257-L272), [`fingerprint.css#L20-L61`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L20-L61)) | `<Link href="/" className="fp-nav-link">` 按钮式胶囊链接 | 位于 `.fp-header-actions` 右侧操作区 | `.fp-header` 支持 `flex-wrap: wrap` |

### 2.2 具体缺陷与代码证据

1. **`/view/[runId]/[file]` 缺失返回看板导航且 `100vh` 布局锁死**：
   - 在 [`src/app/view/ArtViewerHead.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L36-L92) 中，顶栏仅渲染模型标题、元信息与右侧 `.viewer-actions`（语言切换 + 原始 SVG 链接），没有任何返回 `/` 的导航入口。代码隐式假设用户永远从首页卡片 [`PelicanCard.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/PelicanCard.tsx#L106) 的 `target="_blank"` 打开新标签页；一旦用户通过分享链接、书签或同标签页直接访问 `/view/...`，将无法通过界面导航回到主看板。
   - 在 [`src/app/view/viewer-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L42-L60) 中，`.viewer-actions` 声明了 `display: flex; gap: 8px` 但未声明 `align-items: center`，导致固定高度 `30px` 的 `<LanguageSwitch />`（[`globals.css#L113`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L113)）与由 `padding: 6px 12px` 撑开的 `.viewer-head .raw` 按钮垂直不居中。
   - 在 [`src/app/view/viewer-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L3-L7) 中，`.viewer` 设置了固定 `height: 100vh`，而底部 `.viewer-foot`（[`viewer-base.css#L77-L83`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L77-L83)）未限制最大高度。当用户展开底部 [`JudgeDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L103-L149)（含多张全宽联系表图片與 AI 转录 `<pre>`）时，`.viewer-stage`（`flex: 1; min-height: 0`）会被压缩至 `0px`，画布完全消失。

2. **`/config` 与 `/pair` 的 `<h1>` 内联控件与幽灵类名**：
   - [`src/app/config/ConfigPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L10-L21) 与 [`src/app/pair/PairPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairPageHeader.tsx#L13-L30) 均使用 `<header className="masthead">` 和 `<p className="prompt">`，但全仓 CSS 中不存在 `.masthead` 或 `.prompt` 规则。
   - 两个组件均将 `<Link className="nav-link" href="/">` 和 `<LanguageSwitch />` 直接写在 `<h1>` 内部：
     ```tsx
     <h1>
       {tp.title}
       <Link className="nav-link" href="/">{tp.backToDashboard}</Link>
       {hasProvider && <LanguageSwitch />}
     </h1>
     ```
     在 [`src/app/globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L96-L125) 中，`.nav-link` 定义了 `margin-left: 14px`，但 `.lang-switch` 未定义左外边距，导致语言切换按钮在 `<h1>` 行内紧贴 `← 看板` 文字右侧（`0px` 间距），语义与排版同时失范。

3. **`/config` 页面宽度不一致与移动端 DOM 顺序倒置**：
   - 在 [`src/app/config/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L73-L100) 中，`<ConfigSideNav />` 在 DOM 中位于 `<div className="config-content">`（内含 `<ConfigPageHeader />`）之前。当视口 `≤ 900px` 时（[`src/app/config/config-nav.css#L68-L82`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-nav.css#L68-L82)），`.config-page-layout` 变为纵向 `flex-direction: column`，`.config-side-nav` 吸顶横向滚动条直接压在页面主标题 `ConfigPageHeader` 上方。
   - 在 `<div className="config-content">` 内部，[`ConfigEditor.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigEditor.tsx#L39) 将前 9 个配置区块包裹在 `<div className="config">`（`max-width: 1100px`，[`config-base.css#L3-L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L3-L9)）中，但 [`src/app/config/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L98-L99) 将 `<DataRepoPanel />` 和 `<DevicePanel />` 渲染在 `<ConfigEditor />` 之外，导致最后两个区块宽度撑满 `.config-content`（约 `1328px`），与上方 9 个区块右边界错位 `228px`。

---

## 3. 按钮、表单与反馈控件跨页碎片化审计

### 3.1 全局标签选择器污染 vs `/pair` 样式裸奔

1. **`/config` 的全局标签选择器污染**：
   - [`src/app/config/config-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L51-L122)（通过 [`src/app/config/layout.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/layout.tsx#L1) 注入）未使用 `.config` 作用域前缀，直接定义了全局元素规则：
     - `label`（`#L51-L57`）：强制 `display: flex; flex-direction: column; gap: 4px`。导致同页的 [`config-data-repo-pending.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo-pending.css#L18-L26) 必须专门写覆盖规则才能让复选框与文字水平排列。
     - `button`（`#L92-L122`）：全局设置 `padding: 7px 14px; border-radius: 7px; background: var(--surface-hi)`，且 `button:hover:not(:disabled)`（特异性 `0,2,1`）将所有按钮悬停边框设为 `var(--text-faint)`，覆盖了 [`globals.css#L127-L131`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L127-L131) 中 `.lang-switch:hover`（特异性 `0,2,0`）的 `border-color: var(--accent)`。

2. **`/pair` 页面控件样式缺失与未定义 CSS 变量**：
   - [`src/app/pair/pair.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L1-L30) 共 30 行，未导入 `config-base.css`，也未定义任何表单色彩或按钮样式：
     - **输入框白底刺眼**：[`PairCodeForm.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairCodeForm.tsx#L25-L35) 的 `<input id="pair-code" className="pair-code">` 在 [`pair.css#L13-L19`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L13-L19) 中仅定义了字号与内边距，未设置 `background`、`color`、`border`、`border-radius`，在 `#0b0f17` 深色背景上直接渲染为浏览器默认的纯白底黑字输入框。
     - **按钮退化为系统原生灰按钮**：[`PairCodeForm.tsx#L37`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairCodeForm.tsx#L37) 的 `<button type="submit">` 与 [`PairSignedInCard.tsx#L31`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairSignedInCard.tsx#L31) 的 `<button type="button">` 无类名且无 CSS 规则，直接渲染为操作系统原生浅灰按钮。
     - **幽灵 `.button` 类**：[`PairSignedInCard.tsx#L28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairSignedInCard.tsx#L28) 的 `<a className="button" href={returnTo}>` 所引用的 `.button` 在全仓 CSS 中不存在，渲染为无边框的默认紫色/蓝色超链接。
     - **引用未定义的 CSS 变量 `--line` 与 `--danger`**：
       - [`pair.css#L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L9) 中 `.pair-card` 使用 `border: 1px solid var(--line, #d9d9d9)`，而 [`globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L6) 定义的是 `--border: #1e2636`，导致卡片边框回退为浅色主题的亮灰色 `#d9d9d9`。
       - [`pair.css#L28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css#L28) 中 `.pair-error` 与 [`config-actions.css#L75`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-actions.css#L75) 中 `.device-error` 使用 `color: var(--danger, #b42318)`，而 [`globals.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L13) 定义的是 `--err: #f87171`，导致错误文字回退为暗红色 `#b42318`，在 `#0b0f17` 背景上的对比度仅约 `2.4:1`，远低于 WCAG AA 标准（`4.5:1`）。

### 3.2 全站按钮变体碎片化清单

全站没有任何共享按钮类，各模块各自声明了 12 套以上的按钮尺寸、圆角、主按钮配色与禁用态规则：

| 按钮类名 / 选择器 | 所在文件与行号 | 高度 / 内边距 | 圆角 (`border-radius`) | 主操作视觉表现 | `:disabled` 透明度与鼠标指针 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.lang-switch` | [`globals.css#L110-L125`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L110-L125) | `height: 30px; padding: 0 9px` | `7px` | 描边按钮 (`var(--surface-hi)`) | 未定义 |
| `.menu-btn` | [`menu-base.css#L9-L40`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L9-L40) | `height: 32px; padding: 0 11px` | `8px` | `.menu-btn-accent`: 描边 `rgba(79,141,247,0.45)` + 浅蓝底 | 未定义 |
| `.icon-link` | [`toolbar-utils.css#L33-L55`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-utils.css#L33-L55) | `width: 32px; height: 32px` | `8px` | 图标方钮 | 未定义 |
| `.run-once-start` | [`run-control-foot.css#L49-L63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-foot.css#L49-L63) | `padding: 7px 16px` | `7px` | **实心蓝底** `background: var(--accent); color: #fff` | `opacity: 0.45; cursor: not-allowed` |
| `.modal-action-btn` | [`model-modal-actions.css#L6-L31`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-actions.css#L6-L31) | `height: 30px; padding: 0 11px` | `7px` | 描边按钮 (`var(--surface-hi)`) | `opacity: 0.55; cursor: progress` |
| `.viewer-head .raw` | [`viewer-base.css#L47-L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-base.css#L47-L60) | `padding: 6px 12px` | `8px` | 描边按钮 (`var(--surface-hi)`) | 未定义 |
| `button.primary` (`/config`) | [`config-base.css#L92-L122`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L92-L122) | `padding: 7px 14px` | `7px` | **描边蓝字** `background: var(--surface-hi); border-color: var(--accent); color: var(--accent)` | `opacity: 0.5; cursor: not-allowed` |
| `.schedule-toggle-btn.btn-activate` | [`config-schedule.css#L88-L119`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-schedule.css#L88-L119) | `padding: 6px 14px` | `6px` | **实心蓝底** `background: var(--accent); color: #fff` | `opacity: 0.5; cursor: not-allowed` |
| `.data-repo-btn-primary` | [`config-data-repo.css#L238-L254`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L238-L254) | `padding: 6px 14px` | `6px` | **实心蓝底** `background: var(--accent); color: #fff` | `opacity: 0.45; cursor: not-allowed` |
| `.data-repo-btn-confirm` / `.data-repo-pipeline-btn-primary` | [`config-data-repo.css#L227-L236`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L227-L236), [`config-data-repo-pipeline.css#L112-L133`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo-pipeline.css#L112-L133) | `padding: 7px 14px` / `7px 16px` | `6px` | **硬编码深蓝实心底** `background: #2563eb; color: #fff` | `opacity: 0.5` / `0.45; cursor: not-allowed` |
| `.fp-btn-primary` | [`fingerprint-matrix.css#L103-L139`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L103-L139) | `height: var(--control-height)` (`32px`) | `var(--radius-md)` (`7px`) | **硬编码渐变蓝底** `linear-gradient(180deg, #3b82f6, #2563eb)` | `opacity: 0.5; cursor: default` |
| `.fp-filter-btn` / `.fp-drawer-head button` | [`fingerprint.css#L92-L113`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L92-L113), [`fingerprint.css#L194-L202`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L194-L202) | `padding: 5px 10px` / `4px 10px` | `var(--radius)` (`10px`) / `var(--radius-sm)` (`6px`) | 描边按钮 | `opacity: 0.5; cursor: not-allowed` |

---

## 4. 模态窗、抽屉与弹出层（Modal / Drawer / Popover）一致性审计

### 4.1 全站 9 个浮层组件横向对比

| 浮层组件 | 触发页面 | 遮罩类名与背景 | 层级 (`z-index`) | 关闭按钮形态与字符 | `Escape` 键关闭 | 遮罩点击关闭 | `body` 滚动锁定 | ARIA 属性 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ModelModal` ([`ModelModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/ModelModal.tsx)) | `/` | `.modal-backdrop` (`rgba(5,8,14,0.72)` + `blur(4px)`) | `50` ([`model-modal-dialog.css#L6`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-dialog.css#L6)) | 右上 `.modal-close` (`32×32px` 带边框，`×` `U+00D7`) | 支持 (`useModalBehavior`) | 支持 | 支持 | `role="dialog" aria-modal="true"` |
| `FingerprintCheckModal` ([`FingerprintCheckModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx)) | `/fingerprint` | 复用 `.modal-backdrop` | `50` | 右上 `.modal-close` (`32×32px` 带边框，`×` `U+00D7`) | 支持 (`useModalBehavior`) | 支持 | 支持 | `role="dialog" aria-modal="true"` |
| `FingerprintSampleDrawer` ([`FingerprintSampleDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx)) | `/fingerprint` | `.fp-drawer-backdrop` (`rgba(0,0,0,0.55)`) | `60` ([`fingerprint.css#L161`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L161)) | 右上文字按钮 `<button>关闭</button>` ([`#L58-L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L58-L60)) | **不支持** | 支持 | **不支持** | **缺失** |
| `FilterMenu` / `Calendar` ([`Menu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/Menu.tsx)) | `/` | `.menu-backdrop` (`≤768px` 为 `rgba(0,0,0,0.5)` + `blur(2px)`；`≥769px` 透明) | 遮罩 `80`，面板 `85`（`≤640px` 面板 `100`） | 仅 `≤640px` 显示 `.menu-panel-close` (`24×24px` 无边框，`✕` `U+2715`) | 支持 (`useMenuDismiss`) | 支持 | **不支持** | Trigger 含 `aria-expanded`，面板无 `role` |
| `RunStatus` 详情面板 ([`RunStatus.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/RunStatus.tsx)) | `/` | 复用 `.menu-backdrop` | 遮罩 `80`，面板 `85` | 右上 `.menu-panel-close` (`24×24px` 无边框，`✕` `U+2715`) | 支持 (`useMenuDismiss`) | 支持 | **不支持** | Trigger 含 `aria-expanded` |
| `RunOnceMenu` ([`RunOnceMenu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx)) | `/` | 复用 `.menu-backdrop`（桌面端居中弹窗但遮罩全透明） | 遮罩 `80`，面板 `85`（`≤640px` 面板 `100`） | 右上 `.run-once-close` (`28×28px` 带边框，`✕` `U+2715`) | 支持 (`useMenuDismiss`) | 支持 | **不支持** | 面板无 `role="dialog"` |
| `RunOnceProfileModal` ([`RunOnceProfileModal.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx)) | `/` (`RunOnceMenu` 内) | `.profile-modal-backdrop` (`rgba(0,0,0,0.6)` + `blur(2px)`) | `200` ([`run-control-profiles.css#L6`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-profiles.css#L6)) | 右上无边框 `×` (`U+00D7`) + 底部 `取消` 按钮 | **冲突**（同时关闭父菜单） | 支持 | 支持 | `role="dialog" aria-modal="true"` |
| `DataRepoPushDialog` ([`DataRepoPushDialog.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPushDialog.tsx)) | `/config` | `.data-repo-dialog-backdrop` (`rgba(0,0,0,0.65)`) | `1000` ([`config-data-repo.css#L150`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L150)) | **无右上关闭钮**，仅底部 `取消` 按钮 | **不支持** | **不支持** | **不支持** | `role="dialog"` 错挂在遮罩层上 |

### 4.2 关键浮层交互缺陷

1. **`RunOnceProfileModal` 的 CSS Containing Block 陷阱与 `Escape` 双重关闭 Bug**：
   - 在 [`src/app/components/run-control/RunOnceMenu.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx#L98-L110) 中，`<RunOnceProfileModal>` 直接作为 `.menu-panel.run-once-panel` 的子节点渲染，未使用 `createPortal`。而在桌面端（`> 640px`），[`run-control-menu.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-menu.css#L11) 为 `.menu-panel.run-once-panel` 设置了 `transform: translate(-50%, -50%)`。根据 CSS 规范，祖先元素的 `transform` 会为后代 `position: fixed` 元素建立新的包含块（Containing Block），导致 `.profile-modal-backdrop`（`position: fixed; inset: 0`）仅覆盖 `850px × 680px` 的 `RunOnceMenu` 面板，无法覆盖整个浏览器视口。
   - 同时，父级 `Menu` 的 [`useMenuDismiss`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/use-menu-dismiss.ts#L16-L18) 与子级 `RunOnceProfileModal` 的 [`useModalBehavior`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/use-modal-behavior.ts#L11-L13) 同时在 `document` 上监听 `keydown` `Escape` 且均未调用 `stopImmediatePropagation()`。当用户在「保存预设」二级弹窗中按 `Escape` 时，`RunOnceProfileModal` 与底下的 `RunOnceMenu` 会同时关闭。

2. **`Menu` 组件在 `641px–768px` 平板断点区间的遮罩与面板错位**：
   - 在 [`src/app/components/menu/menu-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L57-L72) 中，`.menu-backdrop` 在 `≤ 768px` 时显示半透明黑底与毛玻璃模糊（`@media (min-width: 769px)` 才变透明）。
   - 但 [`src/app/components/menu/menu-panels.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L127) 中，`.filter-panel` 与 `.day-panel` 仅在 `@media (max-width: 640px)` 时才切换为 `position: fixed` 居中模态窗并显示顶栏关闭按钮（`.filter-panel-head-bar` / `.day-panel-head-bar`）。
   - 结果在 `641px–768px` 宽度区间内，展开「筛选」或「日历」会使全屏变暗模糊，但下拉面板仍以桌面端 `position: absolute` 挂在按钮下方，且不显示面板标题栏与关闭按钮。

3. **黄金标准与评测折叠面板（`<details>`）跨页重复实现与箭头失灵**：
   - 首页 `ModelModal` 内的 [`ModelStandardPanel.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelStandardPanel.tsx)（样式见 [`model-modal-standard.css#L88-L165`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-standard.css#L88-L165)）与 `/view` 页底部的 [`ArtViewerFoot.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerFoot.tsx#L64-L100)（样式见 [`viewer-drawers.css#L78-L158`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L78-L158)）重复实现了黄金标准展示逻辑，且样式分叉（如 `.standard-desc` 在弹窗中为 `var(--text-dim)`，在 `/view` 中为 `var(--text)`；`.source-link` 在弹窗中硬编码 `#60a5fa`，在 `/view` 中使用 `var(--accent)`）。
   - `/fingerprint` 页的 [`FingerprintCheckTechDrawer.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L32-L38) 未使用 `/view` 的 `summary::before` 旋转伪元素（[`viewer-drawers.css#L27-L39`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/viewer-drawers.css#L27-L39)），而是直接在 JSX 文本中硬编码了 `"▸ "` 字符，导致展开 `<details>` 后箭头永远指向右侧，不会旋转为向下。

---

## 5. `docs/ui/UX_STATE_MAP.md` 与实际代码对齐审计

核查 [`docs/ui/UX_STATE_MAP.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md) 与 [`docs/ui/ux_coverage_report.json`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/ux_coverage_report.json) 后，发现以下 6 处失真与漂移：

| 审计项 | `UX_STATE_MAP.md` 记载内容 | 仓库真实代码状态 |
| :--- | :--- | :--- |
| **自动化巡检脚本绑定** | [`UX_STATE_MAP.md#L201`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md#L201) 声明本文件与 `scripts/ux_state_crawler.py` 强制双向绑定 | `scripts/ux_state_crawler.py` **在仓库中不存在**；[`ux_coverage_report.json`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/ux_coverage_report.json#L2) 停留在历史快照，且 `STATE_PAIR_PAGE` 在 `mobile_iphone16` 下记录为 `"status": "FAIL"`（[`#L270-L273`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/ux_coverage_report.json#L270-L273)） |
| **页面路由覆盖率** | [`UX_STATE_MAP.md#L11-L26`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md#L11-L26) 仅列出 `/`、`/view/[runId]/[file]`、`/config`、`/pair` 四个路由 | 遗漏了整个模型指纹控制台路由 `/fingerprint`（[`src/app/fingerprint/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx)）及其顶栏入口 |
| **弹窗与抽屉覆盖率** | 仅登记 `Filter`、`Calendar`、`RunOnce`、`RunStatus`、`ModelModal` 五个浮层 | 遗漏了 6 个交互浮层：`RunOnceProfileModal`、`ModelExportMenu`、`/view` 页的 `JudgeDrawer`、`/config` 页的 `DataRepoPushDialog`、`/fingerprint` 页的 `FingerprintCheckModal` 与 `FingerprintSampleDrawer` |
| **非所有者点击「跑一次」流程** | [`UX_STATE_MAP.md#L106-L108`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md#L106-L108)（Flow 2）描绘未配对访客点击 `▶ 跑一次` 后触发 401 跳转 `/pair` | 在 [`ToolbarCenter.tsx#L40`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarCenter.tsx#L40) 中，`RunOnceMenu` 仅在 `!readonly && !remote && owner` 时渲染；未配对访客在顶栏根本看不到 `▶ 跑一次` 按钮 |
| **执行状态机阶段枚举** | [`UX_STATE_MAP.md#L149-L158`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md#L149-L158) 仅列出 `Idle`、`Running`、`Stopped/Done` 三态 | 遗漏了 AI 评审阶段 `phase === "judging"` 及其中断态 `judgeInterrupted`（[`RunStatus.tsx#L27-L44`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/RunStatus.tsx#L27-L44)） |
| **响应式断点阈值** | [`UX_STATE_MAP.md#L77,L184-L195`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md#L77) 记载下拉面板在 `< 768px` 切换为居中 Modal、在 `< 360px` 触发极窄屏流式布局 | 实际 [`menu-panels.css#L127,L167`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L127) 中，`FilterMenu` 与 `Calendar` 的 Modal 切换断点为 `640px`，极窄屏断点为 `380px` |

---

## 6. 整改建议优先级

1. **P0（修复视觉破损与导航断路）**：
   - 为 [`src/app/pair/pair.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair.css) 补齐深色主题输入框、按钮与 `.button` 链接样式，将未定义的 `var(--line)` 与 `var(--danger)` 替换为 `var(--border)` 与 `var(--err)`（同改 [`src/app/config/config-actions.css#L75`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-actions.css#L75)）。
   - 在 [`src/app/view/ArtViewerHead.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx) 左侧增加返回看板 `/` 的链接，为 `.viewer-actions` 补上 `align-items: center`，并将 `.viewer` 的 `height: 100vh` 改为允许抽屉展开时滚动或为 `.viewer-foot` 设置 `max-height: 55vh; overflow-y: auto`。
   - 将 [`RunOnceProfileModal`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx#L98-L110) 移出带 `transform` 的 `.run-once-panel`（或使用 `createPortal` 挂载到 `document.body`），并在二级弹窗处理 `Escape` 时阻止触发父菜单关闭。
2. **P1（收敛跨页头部、容器与控件规范）**：
   - 将 [`ConfigPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx) 与 [`PairPageHeader.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairPageHeader.tsx) 中的 `<Link className="nav-link">` 和 `<LanguageSwitch />` 移出 `<h1>`，与 `/fingerprint` 的 `.fp-header` 统一为标准页头组件。
   - 在 [`src/app/config/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L73-L100) 中将 `<DataRepoPanel />` 和 `<DevicePanel />` 纳入 `1100px` 限宽容器，并修正 `≤ 900px` 下侧栏导航与页头的视觉顺序。
   - 为 [`src/app/config/config-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L51-L122) 的裸标签选择器加上 `.config` 作用域，并在 `globals.css` 中提取统一的 `.btn`、`.btn-primary`、`.btn-danger` 原语。
3. **P2（统一浮层行为与更新状态图文档）**：
   - 让 [`DataRepoPushDialog`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPushDialog.tsx) 与 [`FingerprintSampleDrawer`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx) 接入 `useModalBehavior`（支持 `Escape` 关闭与背景滚动锁定），统一 [`menu-base.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L70) 与 [`menu-panels.css`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L127) 的响应式断点（统一为 `768px` 或 `640px`），并同步更新 [`docs/ui/UX_STATE_MAP.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md)。
