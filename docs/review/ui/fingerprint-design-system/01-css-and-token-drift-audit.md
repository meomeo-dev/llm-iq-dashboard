# 指纹页（`/fingerprint`）设计系统合规性与样式漂移审查报告

## 1. 核心结论：为什么 `/fingerprint` 与主看板像两个不同的产品？

审查 `src/app/globals.css`、`src/app/components/**/*.css`、`src/app/config/*.css` 以及 `src/app/fingerprint/fingerprint*.css` 后可以确认：**本仓库目前不存在成体系的 Web 设计系统（Design System）或跨页面共享的原子 UI 组件层**。

1. **设计规范文档与代码实现脱节**：`docs/ui/` 下仅有针对首页 24 小时表盘的单页概念稿 [dial-design-brief.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/dashboard/dial-design-brief.md) 与状态映射表 [UX_STATE_MAP.md](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/ui/UX_STATE_MAP.md)，不存在全局 `design-system.md` 或组件原语规范。
2. **全局变量表（`:root`）仅覆盖色彩与主看板几何常量**：[globals.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L3-L42) 只定义了 11 个颜色变量、3 个圆角变量（`--radius: 10px`、`--radius-md: 7px`、`--radius-sm: 6px`）、1 个控件高度（`--control-height: 32px`）、1 个间距变量（`--gap: 16px`）以及首页卡片/泳道专属尺寸。**字号阶梯（Typography Scale）、字重、字体栈（`--font-mono`）、阴影、Z-Index 层级、半透明语义色（Alpha Tokens）、容器宽度、断点（Breakpoints）全部处于无 Token 裸写状态。**
3. **各路由各自建立私有 CSS 命名空间**：
   - 主看板 `/` 使用 `.page` + `.workspace` + `.toolbar` + `.board-panel` 体系；
   - 配置页 `/config` 使用 `.page.config-page-layout` + `.masthead` + `.config-section` + 全局裸标签选择器（`config-base.css` 直接对全局 `label`、`input`、`select`、`textarea`、`button` 写样式）；
   - 指纹页 `/fingerprint` 则另起炉灶定义了整套 `.fp-*` 平行样式体系（[fingerprint.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css)、[fingerprint-timeline.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css)、[fingerprint-check-modal.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css)、[fingerprint-matrix.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css)），同时又通过 `@import` 强行混入主看板的局部组件样式，形成严重的视觉割裂与层叠冲突。

---

## 2. 页面骨架与容器布局漂移（`/` vs `/config` vs `/fingerprint`）

### 2.1 页面根容器最大宽度、内边距与响应式断点不一致

| 维度 | 主看板 `/` ([page.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/page.tsx#L57)) | 配置页 `/config` ([page.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L72)) | 指纹页 `/fingerprint` ([FingerprintDashboard.tsx](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L187)) | 漂移诊断 |
| --- | --- | --- | --- | --- |
| 根类名 | `.page` ([globals.css:76-80](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L76-L80)) | `.page.config-page-layout` ([config-nav.css:3-8](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-nav.css#L3-L8)) | `.fp-page` ([fingerprint.css:11-18](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L11-L18)) | `/fingerprint` 未使用全局 `.page` 容器 |
| `max-width` | `1600px` | 外层 `.page` `1600px`，内层 `.config` `1100px` ([config-base.css:8](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L8)) | `1480px` | 同一网站出现 `1600px`、`1480px`、`1100px` 三种页面宽度基准 |
| `padding` | `20px 20px 48px` | `20px 20px 48px` | `20px 20px 56px` | 底部留白无依据地从 `48px` 改为 `56px` |
| 子块纵向间距 | `--gap: 16px` ([toolbar-layout.css:6](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-layout.css#L6)) | `22px` ([config-nav.css:15](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-nav.css#L15)) | `20px` ([fingerprint.css:17](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L17)) | 纵向节奏存在 `16px` / `20px` / `22px` 三种标准 |
| 窄屏响应式缩放 | `@media (max-width: 768px)` 缩至 `10px 10px 32px`；`400px` 缩至 `8px 6px 24px` ([globals.css:82-92](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L82-L92)) | 继承 `.page` 响应式内边距 + `@media (max-width: 900px)` 折叠导航 ([config-nav.css:68-120](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-nav.css#L68-L120)) | **完全缺失 `@media` 规则** | 移动端访问 `/fingerprint` 时四周死守 `20px` 内边距，挤占视口宽度 |

### 2.2 顶栏（Header / Toolbar）结构与控件混搭失调

- **主看板 `/` 顶栏**：采用 `.toolbar`（[toolbar-layout.css:9-22](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-layout.css#L9-L22)），具备 `position: sticky; top: 0; z-index: 10; height: 52px; padding: 0 10px 0 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface);` 的悬浮卡片式导航栏；左上角有 `.brand-mark` + `.brand-title`（`16px`），右侧入口统一为 `32×32px` 的 `.icon-link` 图标按钮（[toolbar-elements.css:102-117](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-elements.css#L102-L117)）。
- **指纹页 `/fingerprint` 顶栏**：采用 `.fp-header`（[fingerprint.css:20-46](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L20-L46)），不吸顶、无背景色、无外框圆角，仅设置 `padding-bottom: 14px; border-bottom: 1px solid var(--border);`；左侧为 `20px` 标题 + `13px` 副标题上下堆叠。
- **`.fp-header-actions` 内部 5 个并排控件出现 4 种高度与 3 种圆角**：
  在 [FingerprintDashboard.tsx:262-271](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L262-L271) 中，`.fp-header-actions` 横向并排放置了 5 个元素，由于分别来自不同样式表且缺乏统一 Button 原语，视觉参数全面打架：
  1. `FingerprintCheckPanel`（复用 `.menu-button`，[menu-base.css:12-25](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L12-L25)）：`padding: 6px 10px`、**无默认边框（`border: 1px solid transparent`）**、**无背景（`transparent`）**、**圆角 `8px`**、**字号 `13.5px`**。
  2. `RunStatus`（复用 `.menu-button`，[menu-base.css:12-25](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L12-L25)）：同上，无边框透明底、**圆角 `8px`**、**字号 `13.5px`**。
  3. `LanguageSwitch`（`.lang-switch`，[globals.css:110-125](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L110-L125)）：**定高 `30px`**、`padding: 0 10px`、**实线边框 `1px solid var(--border)`**、背景 `var(--surface)`、**圆角 `7px`**、**字号 `12px`**、字重 `600`。
  4. 配置页链接 `.fp-nav-link`（[fingerprint.css:48-56](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L48-L56)）：**未定高**（靠 `padding: 6px 12px` 与 `1.55` 行高撑出约 `34px` 高）、**实线边框 `1px solid var(--border)`**、背景 `var(--surface)`、**圆角 `var(--radius)`（`10px`）**、**字号 `13px`**。
  5. 返回看板链接 `.fp-nav-link`（[fingerprint.css:48-56](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L48-L56)）：同上（约 `34px` 高、圆角 `10px`、字号 `13px`），且未使用 Next.js `<Link>` 而是原生 `<a href="/">`（对比 [ConfigPageHeader.tsx:14](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigPageHeader.tsx#L14) 使用 `<Link className="nav-link" href="/">`）。

### 2.3 同页 Tab 切换时的面板外壳跳变

在 [FingerprintDashboard.tsx:203-222](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L203-L222) 中，两个一级 Tab 分别渲染了完全不同的面板容器：
- **「渠道核验」Tab** 渲染 `<section className="board-panel fp-board-panel">`（[FingerprintCheckTimeline.tsx:106](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L106)），继承 [timeline-board.css:10-30](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L10-L30)：`padding: 16px 18px 18px`、**`border-radius: 14px`**、标题 `.board-title` **字号 `18px`**。
- **「基准样本矩阵」Tab** 渲染 `<section className="fp-card">`（[FingerprintMatrix.tsx:58](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintMatrix.tsx#L58)），使用 [fingerprint.css:99-126](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L99-L126)：`padding: 16px`、**`border-radius: var(--radius)`（`10px`）**、标题 `.fp-card-head h2` **字号 `16px`**。
- 用户在同页点击 `.fp-tab` 切换时，下方主卡片的圆角在 `14px` 与 `10px` 之间跳变，内边距在 `16px 18px 18px` 与 `16px` 之间跳变，卡片主标题在 `18px` 与 `16px` 之间跳变。

---

## 3. 脆弱选择器、层叠覆盖冲突与“幽灵类名”审计

### 3.1 脆弱的后代标签排除选择器（`button:not(...)`）

在 [fingerprint-matrix.css:164-202](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L164-L202) 中，指纹页没有定义显式的 `.btn` 组件类，而是编写了高耦合的后代标签排除选择器：

```css
/* src/app/fingerprint/fingerprint-matrix.css:164-166 */
.fp-card button:not(.fp-cell-btn):not(.fp-tab),
.fp-drawer button,
.fp-job-banner button {
  display: inline-flex;
  ...
  height: var(--control-height, 32px);
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 7px);
  background: var(--surface-hi);
```

**工程缺陷分析**：
1. **作用域认知错位**：`.fp-tab` 位于 `.fp-tabs`（[FingerprintDashboard.tsx:203-206](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L203-L206)）下，根本不在 `.fp-card` 内部，写 `.fp-card button:not(.fp-cell-btn):not(.fp-tab)` 说明编写者靠猜测拼接选择器。
2. **伪类链不一致**：第 164 行声明了 `:not(.fp-cell-btn):not(.fp-tab)`（特异性 `0,3,1`），但第 184 行 `.fp-card button:hover:not(:disabled)`（特异性 `0,3,1`）和第 190 行 `.fp-card button:disabled`（特异性 `0,2,1`）却漏掉了 `:not(.fp-cell-btn)`，导致 `.fp-cell-btn:hover`（[fingerprint-matrix.css:134](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L134)，特异性 `0,2,0`）的 `border-color` 实际上被第 184 行规则以更高特异性（`0,3,1` > `0,2,0`）强行接管。
3. **无差别污染子组件**：任何放入 `.fp-card`、`.fp-drawer` 或 `.fp-job-banner` 内部的子组件（如 `ProfileName`、关闭图标按钮、行内文字链接按钮）只要底层是 `<button>` 标签，都会被强制加上 `32px` 高度、`0 12px` 内边距和 `var(--surface-hi)` 灰底。

### 3.2 跨模块 CSS 强行覆写与内联补丁

指纹页通过 `@import` 引入了主看板的 `timeline.css`、`folder.css`、`profile.css`、`model-modal.css`，但 DOM 结构与主看板不同，导致多处样式冲突与内联补丁：

1. **`.profile-matrix` 网格列定义被内联强行推翻**：
   - 主看板 [model-modal-content.css:36-42](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-content.css#L36-L42) 定义 `.profile-matrix { grid-template-columns: 56px repeat(var(--upstream-count), minmax(260px, 1fr)); }`，其中首列 `56px` 是强度档位行头列（`.profile-matrix-row`）。
   - 指纹页 [FingerprintCheckModal.tsx:106-111](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L106-L111) 复用了 `.profile-matrix` 类名，但并无左侧行头列，只能用内联样式 `gridTemplateColumns: \`repeat(${records.length}, minmax(310px, 1fr))\`` 强行覆盖 CSS 文件中的 `grid-template-columns`。
2. **`.folder-count` 绝对定位被内联 `position: "static"` 强行推翻**：
   - 主看板 [profile.css:150-162](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/profile/profile.css#L150-L162) 定义 `.folder-count { position: absolute; top: 5px; left: 6px; }`，用于贴在 `216×216` 文件夹左上角。
   - 指纹页 [FingerprintCheckTile.tsx:89](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx#L89) 将 `.folder-count` 放进顶部状态条 `.fp-folder-head` 的 Flex 容器内，为了防止其飞出到卡片左上角，直接写死 `style={{ position: "static" }}`。
3. **`.row-label` 溢出裁剪被二次覆写**：
   - 主看板 [timeline-board.css:96-106](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L96-L106) 定义 `.row-label { overflow: hidden; }`。
   - 指纹页 [fingerprint-timeline.css:116-118](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L116-L118) 又用 `.fp-board-panel .row-label { overflow: visible; }` 将其反转。
4. **`.fp-matrix-table` 被误用于模态窗抽屉内部，引发 `min-width: 980px` 撑爆 `680px` 弹窗**：
   - [fingerprint-matrix.css:9-15](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L9-L15) 为全宽矩阵表定义了 `.fp-matrix-table { width: 100%; min-width: 980px; }`。
   - 但在单渠道核验详情模态窗（宽度 `min(680px, calc(100vw - 32px))`，见 [fingerprint-check-modal.css:8-10](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L8-L10)）的技术明细抽屉内，[FingerprintCheckTechDrawer.tsx:85](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L85)、[FingerprintCheckTechDrawer.tsx:142](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L142) 以及 [FingerprintCheckSections.tsx:214](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx#L214) 的三张小型明细表（有时仅 2～4 列）全部直接套用了 `className="fp-matrix-table"`，导致在 `680px` 弹窗或 `356px` 多渠道并排卡片内被强制撑到 `980px` 宽，产生毫无必要的横向滚动条。

### 3.3 幽灵类名（TSX 引用但未定义）与死样式（CSS 定义但未引用）

| 类型 | 类名 | 出现位置 | 实际后果 |
| --- | --- | --- | --- |
| **幽灵类名（未定义）** | `.status-legend-item` | [FingerprintCheckTile.tsx:149, 153, 157](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx#L149-L157) | 主看板 [folder.css:141-145](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/folder.css#L141-L145) 定义的类名是 `.legend-item`（`display: inline-flex; align-items: center; gap: 5px;`），而指纹页误写为 `.status-legend-item`。由于全仓无此选择器，图例中的 `.status-dot` 圆点与文字紧贴在一起，丢失了 `5px` 间距与垂直居中对齐。 |
| **幽灵类名（未定义）** | `.row-pass-head`、`.row-pass-pct` | [FingerprintCheckTimeline.tsx:247, 255](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTimeline.tsx#L247-L255) | 主看板 [timeline-board.css:128-146](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/timeline-board.css#L128-L146) 定义的是 `.row-pass-total` 与 `.row-pass-efforts`，全仓不存在 `.row-pass-head` 或 `.row-pass-pct`。导致泳道左栏的一致率文案与最新自相似分两个 `<span>` 首尾直接相连，无空格也无两端对齐。 |
| **幽灵类名（未定义）** | `.verdict-consistent`、`.verdict-single-ref`、`.verdict-inconsistent`、`verdict-${activeVerdict}` | [FingerprintCheckTile.tsx:30, 37, 44, 50, 69](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTile.tsx#L30-L50) | 挂在 `.folder.fp-folder` 上，全仓 CSS 零定义，属于无效修饰类。 |
| **幽灵类名（未定义）** | `.grid-fields` | [ModelFingerprintSection.tsx:164, 237](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ModelFingerprintSection.tsx#L164) | 全仓 CSS 零定义；编写者写下 `className="grid-fields"` 后直接用内联 `style={{ display: "grid", ... }}` 硬编码布局。 |
| **死样式（未引用）** | `.fp-form-grid` | [fingerprint.css:202-206](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L202-L206) | 定义了 `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;`，但在全仓 TSX 中零引用（而 `ModelFingerprintSection.tsx` 却用内联样式重复手写了几乎相同的 Grid 规则）。 |

---

## 4. 组件原语碎片化对比（徽章、表格、横幅、抽屉）

由于缺乏统一的 UI 组件原语，相同语义的视觉元素在主看板、配置页、指纹页中各自发明了一套样式：

### 4.1 徽章 / 标签（Badge / Tag / Chip）存在 7 套不兼容实现

| 样式类 | 所在文件与行号 | 高度 / 内边距 | 圆角 | 字号 / 字重 | 边框与背景策略 |
| --- | --- | --- | --- | --- | --- |
| `.badge` | [cards-base.css:51-61](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-base.css#L51-L61) | `height: 21px; padding: 0 8px` | `5px` | `11px` / `400` | `background: var(--surface-hi)`，无边框（`.cli`/`.binding` 用 `inset` 阴影） |
| `.badge-readonly` | [toolbar-elements.css:119-130](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-elements.css#L119-L130) | `padding: 3px 8px` | `6px` | `12px` / `500` | `background: var(--surface-hi); border: 1px solid var(--border)` |
| `.standard-tag` | [model-modal-standard.css:113-132](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-standard.css#L113-L132) | `padding: 1px 6px` | `4px` | `10.5px` / `600` | 半透明彩色背景 + 半透明彩色边框 |
| `.schedule-badge` / `.tier-badge` | [config-schedule.css:37-56](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-schedule.css#L37-L56) / [config-timeout.css:59-77](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-timeout.css#L59-L77) | `padding: 2px 8px` | `12px` / `999px` | `11.5px` / `11px` | 硬编码 GitHub 色系（`#3fb950`、`#e3b341`）半透明底 + 边框 |
| `.fp-badge` | [fingerprint.css:128-153](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L128-L153) | `padding: 2px 8px` | `999px` | `11px` / `600` | **透明背景** + `1px solid` 边框（状态态用硬编码 `rgba(...)` 边框） |
| `.fp-sim-tag` | [fingerprint-check-modal.css:176-186](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L176-L186) | `padding: 1px 5px` | `4px` | `10px` / `600` | `background: var(--surface-hi); border: 1px solid var(--border)` |
| `code.fp-model-chip` | [config-base.css:155-165](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L155-L165) | `padding: 3px 8px` | `5px` | `12px` / `400` | `background: var(--surface-hi); border: 1px solid var(--border)` |

### 4.2 提示横幅（Banner / Notice）各自为政

- 主看板 CLI 警告横幅 `.cli-banner`（[cli-status.css:3-16](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/cli-status.css#L3-L16)）：`background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--warn);`（中性底色 + 左侧 3px 语义色强调线）。
- 指纹页详情弹窗内的 `.fp-verdict-banner`（[fingerprint-check-modal.css:33-50](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L33-L50)）：遵循了左侧 `3px` 语义色线的设计，但背景改用 `var(--bg)`，圆角改用 `8px`（而非 `var(--radius)` `10px`）。
- 指纹页顶部的 `.fp-job-banner`（[fingerprint.css:63-73](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L63-L73)）：却采用四周边框全着色（默认 `border: 1px solid var(--accent); background: var(--surface-hi)`），到了报错或导入成功时又在 [FingerprintDashboard.tsx:274](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L274) 和 [FingerprintMatrixHead.tsx:186](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintMatrixHead.tsx#L186) 用内联 `style={{ borderColor: ..., color: ... }}` 临时改色。

---

## 5. `fingerprint*.css` 硬编码色值、非标字号与非标 Token 逐行清单

### 5.1 硬编码色值（未走 `:root` CSS 变量）

| 文件 | 行号 | 选择器 | 属性与硬编码值 | 问题说明 |
| --- | --- | --- | --- | --- |
| [fingerprint.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L141) | L141 | `.fp-badge.consistent` | `border-color: rgba(74, 222, 128, 0.5);` | 将 `--ok` (`#4ade80`) 拆解为硬编码 RGB 通道 |
| [fingerprint.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L146) | L146 | `.fp-badge.inconsistent` | `border-color: rgba(248, 113, 113, 0.5);` | 将 `--err` (`#f87171`) 拆解为硬编码 RGB 通道 |
| [fingerprint.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L152) | L152 | `.fp-badge.inconclusive, .fp-badge.not-comparable` | `border-color: rgba(251, 191, 36, 0.5);` | 将 `--warn` (`#fbbf24`) 拆解为硬编码 RGB 通道 |
| [fingerprint.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L158) | L158 | `.fp-drawer-backdrop` | `background: rgba(0, 0, 0, 0.65);` | 与 `.modal-backdrop` 的 `rgba(3, 6, 12, 0.72)` ([model-modal-dialog.css:11](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-dialog.css#L11)) 及 `.menu-backdrop` 的 `rgba(0, 0, 0, 0.5)` ([menu-base.css:61](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L61)) 遮罩浓度各不相同 |
| [fingerprint-check-modal.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L135) | L135 | `.fp-sim-fill` | `background: rgba(148, 163, 184, 0.10);` | 硬编码 Slate 灰半透明填充色 |
| [fingerprint-check-modal.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L139) | L139 | `.fp-sim-row.is-declared .fp-sim-fill` | `background: rgba(79, 141, 247, 0.16);` | 将 `--accent` (`#4f8df7`) 拆解为硬编码 RGB 通道 |
| [fingerprint-check-modal.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L147) | L147 | `.fp-sim-bound-tick` | `background: rgba(230, 232, 238, 0.42);` | 将 `--text` (`#e6e8ee`) 拆解为硬编码 RGB 通道 |
| [fingerprint-check-modal.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L198) | L198 | `.fp-sim-empty-slot` | `background: rgba(148, 163, 184, 0.04);` | 硬编码半透明背景色 |
| [fingerprint-matrix.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L58) | L58 | `.fp-col-cli` | `box-shadow: 2px 0 6px rgba(0, 0, 0, 0.25);` | 硬编码粘性列阴影 |
| [fingerprint-matrix.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L140) | L140 | `.fp-cell-btn.ready` | `border-color: rgba(74, 222, 128, 0.45);` | 与 `.fp-badge.consistent` 的 `0.5` alpha 甚至都不一致（`0.45` vs `0.5`） |
| [fingerprint-matrix.css](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L145) | L145 | `.fp-cell-btn.partial` | `border-color: rgba(251, 191, 36, 0.45);` | 与 `.fp-badge.inconclusive` 的 `0.5` alpha 不一致（`0.45` vs `0.5`） |

### 5.2 非标半像素字号与碎片化字号阶梯

在 `fingerprint*.css` 的 817 行样式中，共出现了 **10 种字号**，其中包括大量随意微调的 `.5px` 半像素字号：

| 字号 | 出现位置（文件与行号） |
| --- | --- |
| `10px` | [fingerprint-check-modal.css:178](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L178) (`.fp-sim-tag`) |
| **`10.5px`（非标半像素）** | [fingerprint-timeline.css:96](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L96) (`.fp-probe-name`)、[fingerprint-check-modal.css:170](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L170) (`.fp-sim-rank`)、[fingerprint-check-modal.css:242](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L242) (`.fp-modal-probe-sub`) |
| `11px` | [fingerprint.css:133](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L133) (`.fp-badge`)、[fingerprint-timeline.css:39](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L39) (`.fp-folder-head`)、[fingerprint-check-modal.css:175](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L175) (`.fp-sim-delta`)、[fingerprint-check-modal.css:226](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L226) (`.fp-modal-probe-id`)、[fingerprint-matrix.css:62](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L62) (`.fp-col-cli-ver`) |
| **`11.5px`（非标半像素）** | [fingerprint-check-modal.css:97](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L97) (`.fp-section-head`)、[fingerprint-check-modal.css:195](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L195) (`.fp-sim-empty-slot`) |
| `12px` | [fingerprint.css:125, 197](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L125)、[fingerprint-check-modal.css:84, 124, 259, 268](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L84)、[fingerprint-matrix.css:95, 111, 131](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L95) |
| **`12.5px`（非标半像素）** | [fingerprint-timeline.css:104](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L104) (`.fp-probe-score`)、[fingerprint-check-modal.css:232](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L232) (`.fp-modal-probe-val`) |
| `13px` | [fingerprint.css:39, 55, 72, 89](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L39)、[fingerprint-matrix.css:14, 177](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L14) |
| **`13.5px`（非标半像素）** | [fingerprint-check-modal.css:60](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L60) (`.fp-verdict-headline`) |
| `16px` | [fingerprint.css:119](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L119) (`.fp-card-head h2`) |
| `20px` | [fingerprint.css:32](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L32) (`.fp-header-titles h1`) |

### 5.3 圆角（Border Radius）脱离 `:root` 变量表

尽管 [globals.css:17-19](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L17-L19) 定义了 `--radius: 10px`、`--radius-md: 7px`、`--radius-sm: 6px`，`fingerprint*.css` 仍在大量位置直接硬编码像素值，且混用了 `4px`、`6px`、`7px`、`8px`、`10px`、`24px`、`999px` 共 7 种圆角：
- 硬编码 `4px`：[fingerprint-check-modal.css:181](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L181)
- 硬编码 `6px`（未用 `--radius-sm`）：[fingerprint-check-modal.css:113, 191](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L113)
- 硬编码 `7px`（未用 `--radius-md`）：[fingerprint-check-modal.css:252](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L252)
- 硬编码 `8px`（不在 `:root` 变量表中）：[fingerprint.css:178](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L178)、[fingerprint-timeline.css:36](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L36)、[fingerprint-check-modal.css:36, 210](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L36)
- 硬编码 `10px`（未用 `--radius`）：[fingerprint-timeline.css:70](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L70)、[fingerprint-check-modal.css:24](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L24)
- 硬编码 `24px`：[fingerprint-timeline.css:22](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L22)（覆写主看板 `.folder` 的 `44px` 圆角）

### 5.4 字体栈（Font Family）重复硬编码 9 次

`:root` 未提取 `--font-mono` 与 `--font-sans` 变量，导致 `fingerprint*.css` 内部将冗长的等宽字体栈 `font-family: ui-monospace, SFMono-Regular, Menlo, monospace;` 逐字复制粘贴了 **8 次**：
- [fingerprint.css:196](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint.css#L196)
- [fingerprint-timeline.css:64, 95, 103](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L64)
- [fingerprint-check-modal.css:122, 226, 231, 241](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L122)
- [fingerprint-matrix.css:129](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L129)
并在 [fingerprint-check-modal.css:177](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L177) 为在等宽行内重置回无衬线字体，又手写了 `font-family: ui-sans-serif, system-ui, sans-serif;`（且漏掉了 [globals.css:68-69](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L68-L69) 中的中文字体回退栈 `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"`）。
