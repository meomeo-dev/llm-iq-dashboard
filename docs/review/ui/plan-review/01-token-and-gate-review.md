# 方案审查报告 01：Design Tokens、CSS 架构与静态门禁挑刺审计

- **审查对象**：[`docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md)（重点针对 **§二 Design Tokens 规范** 与 **§五 `scripts/check-ui-hygiene.ts` 自动化静态门禁**）
- **对照基线**：[`pelican-design-system/01-token-and-css-audit.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/pelican-design-system/01-token-and-css-audit.md)、[`pelican-design-system/02-design-docs-vs-code-gap.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/pelican-design-system/02-design-docs-vs-code-gap.md)、[`fingerprint-design-system/01-css-and-token-drift-audit.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/fingerprint-design-system/01-css-and-token-drift-audit.md)、[`fingerprint-design-system/02-inline-styles-and-magic-numbers.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/fingerprint-design-system/02-inline-styles-and-magic-numbers.md) 及 `src/app/` 全量代码实测
- **总体评估**：**有条件通过（需修订 6 项 Must-Fix 与 5 项 Should-Fix）**。方案整体分层清晰，但在全面开启 `UI-01`～`UI-04` 门禁的条件下，§2.1 的 Token 表存在 **5 类合法现有样式无 Token 可替的死胡同**、**11 个业务几何常量去向不明与同心圆角几何冲突**，且 §五 的四条静态门禁规则在描述上存在多处会导致**严重漏检（False Negative）或大面积误杀（False Positive）**的边界漏洞。

---

## 一、 Token 完备性与边界漏洞深度核查（针对方案 §二）

### 1.1 全量硬编码色值对账：开启 `UI-02` 后因缺 Token 而无法改写的 6 类合法场景

对除 `globals.css`、`profile-color.ts`、`src/app/components/export/**` 外的全部 `src/app/**/*.{css,tsx}` 进行静态扫描，共检出 **127 处硬编码色值**（主看板/配置页/查看页/配对页 116 处 + 指纹页 11 处）。若严格执行方案 §5.2 的 `UI-02`（禁止一切 `#hex`、`rgb()`、`rgba()`、`hsl()` 字面量），方案 §2.1 定义的 `tokens.css` 存在以下 **6 处语义空白**：

| 序号 | 现有合法视觉场景与精确代码位置 | 当前硬编码写法 | 为什么现有 §2.1 `tokens.css` 无法覆盖 | 修订方案（补充 Token 或明确替代规范） |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **相似度条合格线刻度（Threshold Tick）**<br>[`fingerprint-check-modal.css:147`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L147) `.fp-sim-bound-tick` | `background: rgba(230, 232, 238, 0.42);` | 该刻度线横跨在 `--surface-bar` 或 `--accent-tint` 进度条之上，依赖前景色 `--text` (`#e6e8ee`) 的 42% 半透明叠底效果；若改用实色 `--text-faint` (`#6b7385`) 会在蓝色进度条上失去叠底对比度，而 `UI-02` 禁止直接写 `rgba(230, 232, 238, 0.42)` | 在 `tokens.css` 补充前景半透明刻度色：<br>`--border-tick: rgba(230, 232, 238, 0.42);` |
| **2** | **进度条非声明榜首高亮 / 中性胶囊底色**<br>[`config-data-repo.css:244`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L244)、[`config-schedule.css:53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-schedule.css#L53) 及指纹页相似度条第二档高亮 | `rgba(100, 116, 139, 0.15)` / `rgba(139, 148, 158, 0.15)` / `rgba(148, 163, 184, 0.18)` | §2.1 仅定义了 `--surface-subtle` (`0.06`) 和 `--surface-bar` (`0.10`)。在 `--surface-hi` (`#182030`) 上渲染 `StatusPill tone="neutral" variant="subtle"` 或在相似度排行中区分“Rank #1 非声明模型（`0.18`）”与“普通候选模型（`0.10`）”时，缺少更高一档的中性半透明表面色 | 在 `tokens.css` 补充：<br>`--surface-bar-hi: rgba(148, 163, 184, 0.18);` |
| **3** | **方向性局部粘性阴影（Sticky Column & Sticky Bottom Bar）**<br>1. [`fingerprint-matrix.css:58`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L58) `.fp-col-cli`<br>2. [`config-actions.css:16`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-actions.css#L16) `.actions` | 1. `box-shadow: 2px 0 6px rgba(0, 0, 0, 0.25);`<br>2. `box-shadow: 0 -6px 16px rgb(0 0 0 / 35%);` | §2.1 仅定义了 3 个向下投射的浮层阴影（`--shadow-sm/md/lg`，Y 轴偏移均为正值 `4px/12px/24px`）。表格冻结列需要**向右（`+2px, 0`）**投射阴影，吸底保存栏需要**向上（`0, -6px`）**投射阴影。若保留原写法会被 `UI-02` 拦截其中的 `rgba(0,0,0,0.25)` 和 `rgb(0 0 0 / 35%)` | 在 `tokens.css` 阴影阶梯补充：<br>`--shadow-sticky-col: 2px 0 6px rgba(0, 0, 0, 0.25);`<br>`--shadow-sticky-bottom: 0 -6px 16px rgba(0, 0, 0, 0.35);` |
| **4** | **状态圆点呼吸脉冲动画与发光阴影（Pulse & Glow）**<br>1. [`run-status-panel.css:36-44`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/run-status-panel.css#L36-L44) `@keyframes run-pulse`<br>2. [`run-control-auto.css:41`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-auto.css#L41) `.dot-running` | 1. `0%, 100% { box-shadow: 0 0 0 0 rgba(79, 141, 247, 0.55); } 50% { box-shadow: 0 0 0 5px rgba(79, 141, 247, 0); }`<br>2. `box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);` | `run-pulse` 动画起止帧需要同色相 `0.55` 与 `0` 透明度插值（若 `50%` 写 `transparent` 即 `rgba(0,0,0,0)` 在部分引擎插值中段发暗），而 `UI-02` 禁止 `rgba(...)` 字面量 | 方案 A：在 `tokens.css` 补充 `--accent-glow: rgba(79, 141, 247, 0.55)`、`--accent-glow-zero: rgba(79, 141, 247, 0)`、`--ok-glow: 0 0 6px rgba(74, 222, 128, 0.40)`；<br>方案 B（推荐）：允许并规范使用原生 `color-mix(in srgb, var(--accent) 55%, transparent)` 与 `color-mix(in srgb, var(--accent) 0%, transparent)` |
| **5** | **半透明内嵌抽屉底色与毛玻璃遮罩**<br>1. [`model-modal-standard.css:72`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/model-modal-standard.css#L72) `.modal-standard-panel`<br>2. [`config-timeout.css:49`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-timeout.css#L49) `.highlight-tier`<br>3. [`menu-base.css:61-63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-base.css#L61-L63) `.menu-backdrop` | 1. `background: rgba(15, 23, 42, 0.6);`<br>2. `background: rgba(16, 24, 38, 0.8);`<br>3. `background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px);` | §2.1 仅有重度模态窗遮罩 `--backdrop-bg: rgba(3, 6, 12, 0.72)` 及实色 `--bg` / `--surface` | 在方案中明确收敛策略：`.menu-backdrop`（移动端）统一改用 `var(--backdrop-bg)`；`.modal-standard-panel` 改用 `var(--bg)`；`.timeout-tier-card.highlight-tier` 改用 `background: var(--accent-tint); border-color: var(--accent-border);` |
| **6** | **实心主题按钮（Solid Primary/Danger Button）悬停态与复选框勾号图形**<br>1. [`config-data-repo.css:228-235`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-data-repo.css#L228-L235)<br>2. [`menu-rows.css:58-59`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-rows.css#L58-L59) & [`run-control-menu.css:232`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-control-menu.css#L232) | 1. `background: #2563eb;`<br>2. `linear-gradient(-45deg, transparent 47%, #fff 47%, ...)` | 1. §2.1 定义了 `--surface-hover`，但未定义实心主色按钮的 hover 态 `--accent-hover`；<br>2. 复选框对勾/半选横杠的 `linear-gradient` 内含 6 处 `#fff`，若不替换为 `var(--text-on-solid)` 会触发 `UI-02` | 1. 在 `tokens.css` 增加 `--accent-hover: #3b7ce6;`（或统一规定 `ui/Button` primary/danger 悬停使用 `filter: brightness(1.08)`）；<br>2. 明确将 `menu-rows.css` 与 `run-control-menu.css` 渐变中的 `#fff` 替换为 `var(--text-on-solid)` |

---

### 1.2 `--radius-md` 从 `7px` 改为 `8px` 的影响核查與残留回退值清理

- **核查结论**：将 `--radius-md` 从 `globals.css:18` 原先的 `7px` 调整为 `8px` **在视觉与工程上完全安全且高度合理**，但必须同步清理全仓矛盾的 `var(..., fallback)` 与残留的 `7px` 硬编码。
- **实证依据**：
  1. **现有 `/fingerprint` 引用点分析**：全仓仅 [`src/app/fingerprint/fingerprint-matrix.css:107`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L107)（`.fp-inline-profile-select select`）与 [`fingerprint-matrix.css:173`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L173)（覆盖 `.fp-card button`、`.fp-drawer button`、`.fp-job-banner button` 三个选择器分支）引用了 `var(--radius-md, 7px)`。由于 `7px` 与 `8px` 仅差 `1px`，且全站绝大多数标准高度（`32px`）按钮（`.menu-button`、`.icon-link`、`.modal-export-btn`、`.modal-standard-btn`、`.run-once-start`、`.run-stop`、`.viewer-actions a` 共 19 处）原本就使用 `8px` 圆角，统一为 `8px` 消除了游离于 4px/8px 栅格之外的奇数圆角 `7px`。
  2. **必须清理的矛盾回退值（Stale Fallbacks）**：在 `fingerprint-matrix.css:107, 173` 中写的 `var(--radius-md, 7px)`，以及 [`src/app/config/config-nav.css:43`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-nav.css#L43) 中写的 `var(--radius, 6px)`（`--radius` 实际为 `10px`，回退值却写 `6px`！）、[`src/app/components/card/cards-footer.css:102`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/card/cards-footer.css#L102) 的 `var(--warn, #e0a442)`，必须在重构中全部剥离冗余/错误的回退值，直接写 `var(--radius-md)`、`var(--radius)`、`var(--warn)`。
  3. **必须同步迁移的 9 处硬编码 `7px`**：[`globals.css:117`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L117)（`.lang-switch`）、[`calendar.css:54`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/calendar.css#L54)、[`toolbar-layout.css:50`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/toolbar-layout.css#L50)、[`folder.css:97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/folder.css#L97)、[`menu-panels.css:65`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-panels.css#L65)、[`menu-rows.css:11`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/menu-rows.css#L11)、[`config-base.css:97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-base.css#L97)、[`config-prompt.css:15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-prompt.css#L15)、[`fingerprint-check-modal.css:252`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-modal.css#L252) 须明确归并至 `var(--radius-md)`（`8px`）或 `var(--radius-sm)`（`6px`）。

---

### 1.3 业务几何常量（11 个）与 TS 跨语言耦合及同心圆角几何冲突（重大遗漏！）

方案 §2.1 给出了 `src/app/tokens.css` 的完整定义，并声明在 `globals.css` 首行 `@import "./tokens.css";`，但**完全未交待原 `globals.css:25-41` 中 11 个业务几何常量的去留**，且在 `--radius-xl: 24px` 的注释上发生了严重的**同心圆角几何错误**：

1. **不可改名、不可改值的跨语言硬耦合契约**：
   经全仓检索，原 `globals.css:25-41` 的业务几何变量与 4 个核心 TypeScript 布局/导出模块存在严格的数值镜像同步契约（并受 [`test/app/components/timeline/track-layout.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/timeline/track-layout.test.ts) 与 [`test/app/components/export/timeline-svg.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/export/timeline-svg.test.ts) 锁定）：
   - [`src/app/components/timeline/track-layout.ts:8-18`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/track-layout.ts#L8-L18)：硬编码了 `CELL_WIDTH = 232`（对应 `--cell-width: 232px`）、`AXIS_HEIGHT = 56`（对应 `--axis-height: 56px`）、`HEAD_HEIGHT = 30`（对应 `--head-height: 30px`），用于在 JS 中计算时间轴 `left: x` 像素坐标与画布总宽度。一旦 CSS 变量丢失或改值，DOM 卡片列与时间轴刻度线将立即错位！
   - [`src/app/components/export/timeline-svg.ts:40-50`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/timeline-svg.ts#L40-L50) 与 [`timeline-portrait-svg.ts:31-32`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/timeline-portrait-svg.ts#L31-L32)：硬编码了 `LABEL_WIDTH = 176`（`--lane-label-width`）、`LANE_HEAD_HEIGHT = 36`（`--lane-head-height`）、`ROW_HEIGHT = 236`（`--cell-height`）、`TILE_SIZE = 216`（`--tile-size`）、`FOLDER_PADDING = 16`（`--folder-padding`）、`FOLDER_GAP = 12`（`--folder-gap`）。
   - [`src/app/components/export/result-set-svg.ts:70-71`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/result-set-svg.ts#L70-L71)：硬编码了 `CARD_FOOT = 70`（对应 `--card-footer-height: 70px`）。
   - [`src/app/components/export/export-image.ts:65-81`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/export-image.ts#L65-L81)：`readPalette()` 在浏览器端通过 `getComputedStyle(document.documentElement).getPropertyValue(...)` 动态读取 `--bg`、`--surface`、`--surface-hi`、`--border`、`--text`、`--text-dim`、`--text-faint`、`--accent`、`--ok`、`--warn`、`--err` 共 11 个颜色变量，变量名严禁改动。
2. **`.folder` 同心圆角几何冲突（`44px` vs `24px`）**：
   - 方案 §2.1 第 119 行写道：`--radius-xl: 24px; /* 216×216 文件夹大磁贴 */`。
   - **事实核查**：主看板 216×216 文件夹大磁贴（[`src/app/components/timeline/folder.css:15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/folder.css#L15)）的外圆角是 **`44px`**（内部 2×2 小图 `.folder-slot` 圆角是 **`18px`**，内边距 `--folder-padding: 16px`，满足外圆角 $\ge$ 内圆角 + 内边距 `18 + 16 = 34px` 的同心圆角几何关系），且导出图 [`timeline-svg.ts:301, 315`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/timeline-svg.ts#L301-L315) 同样硬编码了 `rx="44"` 与 `rx="18"`！
   - 只有 `/fingerprint` 页的 `.folder.fp-folder`（[`fingerprint-timeline.css:22`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-timeline.css#L22)）因为内部是 `padding: 12px` + `10px` 圆角条才使用了 `24px` 圆角。如果把主看板 `.folder` 误改为 `24px`，内部 `18px` 圆角的缩略图四角会顶穿外框圆弧，且与 SVG 导出图（`rx="44"`）产生视觉割裂！
3. **`globals.css` 自身的非标断点遗漏**：
   - [`src/app/globals.css:44, 51, 82, 88`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/globals.css#L44-L92) 目前使用 `@media (max-width: 768px)` 和 `@media (max-width: 400px)` 调整 `--lane-label-width`、`--gap` 和 `.page` 的 `padding`。方案 §2.2 宣布废除 `768px` 与 `400px` 断点、统一收敛为 `640px` / `900px` / `1200px`，但未在方案中指出必须同步修改 `globals.css:44-92` 的这两处 `@media`！

---

## 二、 自动化静态门禁（`UI-01` ～ `UI-04`）误报与漏报深度审计（针对方案 §五）

### 2.1 规则 `UI-01`（禁止静态 JSX 内联样式）：必须采用 TS AST，且须堵住「静态值白名单属性」漏洞

1. **为什么不能用正则表达式扫描 `style={{ ... }}`？（3 类确定性漏检）**
   - **漏检 1：通过中间变量传入 `style={varName}`**。全仓 AST 扫描显示，现有代码库中已有 3 处将样式对象赋给局部变量再传入 `style={...}`：
     - [`src/app/components/model-modal/ProfileMatrix.tsx:32,35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ProfileMatrix.tsx#L32-L35)：`const style = { "--upstream-count": upstreams.length } as CSSProperties;` → `<div className="profile-matrix" style={style}>`
     - [`src/app/fingerprint/FingerprintCheckModal.tsx:49,55`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L49-L55)：`const modalStyle = ...` → `<section ... style={modalStyle}>`
     - [`src/app/fingerprint/FingerprintCheckModal.tsx:106-111`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L106-L111)：`const style = { "--upstream-count": records.length, gridTemplateColumns: ... }` → `<div className="profile-matrix" style={style}>`
     若用正则匹配 `style=\{\{`，任何 `const boxStyle = { fontSize: 12 }; <div style={boxStyle} />` 都会 100% 逃逸。
   - **漏检 2：跨多行与模板字符串嵌套花括号截断**。如 [`ModelFingerprintSection.tsx:94-98`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ModelFingerprintSection.tsx#L94-L98) 跨 5 行的 `style={{ ... }}` 以及含 `${records.length}` 的模板字面量，非贪婪正则会在第一个 `}` 处提前截断。
   - **漏检 3（方案 §5.1 自身规则漏洞）：白名单属性被传入静态常量值**！
     方案 §5.1 写道：“仅放行动态数据驱动的白名单属性：`left`, `top`, `right`, `bottom`, `width`, `height`, `gridColumn`, `gridTemplateColumns`, `background`（仅限动态函数返回值）”。
     但如果在实现时仅按属性名白名单放行 `gridTemplateColumns`、`width`、`height`，那么 [`ModelFingerprintSection.tsx:96, 167, 240`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ModelFingerprintSection.tsx#L96) 中静态硬编码的 `gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"` 以及 `style={{ width: "100%", height: "32px" }}` 就会被当成合法属性放行！
2. **基于 TypeScript Compiler API（复用 `scripts/code-length/ast.ts` 思路）的零漏报 AST 判定规范**：
   - 使用 `ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)` 解析 `src/app/**/*.tsx`；
   - 定位所有 `ts.isJsxAttribute(node) && node.name.getText(sf) === "style"`：
     - 解析其表达式（支持直接 `ObjectLiteralExpression`、被 `as CSSProperties` 包裹的 `AsExpression`，以及在当前文件内向上追溯同名 `VariableDeclaration` 的初始值；若为无法静态追踪的函数调用/外部变量或含 `SpreadAssignment` `...rest`，直接判定违规）；
     - 遍历 `ObjectLiteralExpression.properties`：
       1. 若属性名以 `--` 开头（CSS 自定义属性，如 `"--upstream-count"`）：**放行**；
       2. 若属性名属于几何/动态背景白名单 `{"left", "top", "right", "bottom", "width", "height", "gridColumn", "gridTemplateColumns", "background"}`：**必须同时校验其值节点 `prop.initializer` 不是纯静态字面量**（即严禁 `ts.isStringLiteral`、`ts.isNumericLiteral`、`ts.isNoSubstitutionTemplateLiteral`！例如 `gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"` 和 `background: "var(--surface-hi)"` 因值节点是 `StringLiteral` 会被精准拦截，而 `width: \`${row.barPercent}%\`` 是 `TemplateExpression`、`left: x` 是 `Identifier`、`background: profileColor(name)` 是 `CallExpression` 会被精准放行）；
       3. 其余一切属性名（`fontSize`, `color`, `display`, `gap`, `margin*`, `padding*` 等）：**无条件拦截**。
3. **方案遗漏的 6 处非指纹模块违规静态内联样式（Phase 3 必爆点）**：
   方案 §1.2 与 §6 误以为全仓只有 `/fingerprint`（44 处）+ `ModelFingerprintSection.tsx`（18 处）共 62 处内联样式。但 AST 全仓扫描证实，**全仓共有 86 处 `style=`，除 62 处指纹相关和 18 处合法动态绑定外，主看板与配置页还有 6 处静态内联样式**，必须在 Phase 3 一并清零：
   - [`src/app/page.tsx:60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/page.tsx#L60)：`style={{ borderLeftColor: "var(--warn)" }}`
   - [`src/app/components/run-status/RunStatus.tsx:181`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/RunStatus.tsx#L181)：`style={{ color: "var(--err)" }}`
   - [`src/app/config/TimeoutForm.tsx:137`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/TimeoutForm.tsx#L137)：`style={{ marginTop: 8 }}`
   - [`src/app/components/ReferenceSourceDisplay.tsx:38, 61, 68`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/ReferenceSourceDisplay.tsx#L38-L68)：3 处静态 `wordBreak: "break-word"` 与 `marginLeft: "8px", display: "inline-flex", ...`

---

### 2.2 规则 `UI-02`（禁止裸色值、非标字号与非标断点）的误报与漏报修复

1. **漏报（§2.2 承诺未兑现）**：
   - 方案 §2.2 明确承诺在 `check-ui-hygiene.ts` 锁定 3 个响应式断点（`640px` / `900px` / `1200px`），但 §5.2 规则列表漏掉了 `@media` 断点检查；
   - 方案 §5.2 仅拦截 `\d+\.5px` 半像素 `font-size`，这会漏放现有的 `font-size: 9px`、`15px`、`17px`、`18px`、`1.1rem` 以及绕过 `var(--text-*)` 直接手写的 `font-size: 12px`。
   - **修正规则**：在除 `tokens.css` 外的 `.css` 中，所有 `font-size:` 声明的值必须包含 `var(--text-`（或为 `inherit`）；所有 `@media` 中的 `max-width` / `min-width` 仅允许 `640px`、`641px`、`900px`、`901px`、`1200px`、`1201px`。
2. **误报防范**：
   - 扫描 `.css` 前必须先剥离 `/*[\s\S]*?\*/` 块注释；扫描 `.tsx` 时不得用全文正则扫 `#hex`（避免误杀 UI 文案中的 `#1` 或注释），而应通过 AST 仅检查 `style` 属性及 SVG 表现属性（`fill`, `stroke`, `stopColor`）。

---

### 2.3 规则 `UI-03`（禁止局部 CSS 裸标签选择器）：如何精确区分有害污染与合法后代选择器？

对全仓 43 个局部 CSS 文件的 **118 处含 HTML 标签名的选择器**逐一分类后，如果简单按“包含标签名”或“只看是否顶层”都会出错（例如：`.fp-card button` 有 `.fp-card` 前缀，并非顶层，但却无差别污染了卡片内所有子组件的 `<button>`；同理，方案 §4.2 第 2 条提议“将 `config-base.css` 的顶层裸标签选择器收敛至 `.config` 作用域下”，如果写成 `.config button` 或 `.config label`，依然会以 `0,1,1` 的特异性覆写 `.config` 内挂载的 `.ui-btn`（`0,1,0`）与弹窗子组件！）。

**零误报、零漏报的 `UI-03` 三级判定算法**：
将每个 CSS 规则块的选择器按顶层逗号 `,`（忽略 `:not(...)`、`[...]` 括号内部逗号）拆分为独立的选择器分支 `branch`，再按组合符（空格、`>`、`+`、`~`）拆分为复合选择器序列 `[s_0, s_1, ..., s_k]`：

1. **`UI-03a`（首段必须以类选择器 `.class` 开头）**：
   - 校验起始段 `s_0` 必须匹配 `/^\.[a-zA-Z_][a-zA-Z0-9_-]*/`。
   - **拦截效果**：100% 拦截无作用域顶层裸标签（`label`, `button`, `input[type="text"]`, `select`, `textarea`）以及标签限定类选择器（`button.primary`, `label.checkbox`, `a.secondary-link`, `code.fp-model-chip`），强制使用纯类名（如 `.ui-btn-primary`），同时自然放行以类名开头的 `.fp-card-head h2`、`.ui-table th`。
2. **`UI-03b`（禁止以无类名的交互/表单标签作为末端被修饰目标 `s_k`）**：
   - 提取末端段 `s_k` 剥离伪类（`:hover`, `:disabled`, `:focus`, `:not(...)`）与属性选择器（`[type=...]`）后的基础选择器：
   - 若 `s_k` **不含任何 `.className`**（即纯标签名作为样式作用终点）：
     - **允许语义排版/表格/折叠子元素标签**：`h1`, `h2`, `h3`, `h4`, `p`, `span`, `b`, `small`, `code`, `pre`, `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `summary`, `details`, `header`, `footer`, `img`, `figcaption`, `a`（因此 `.fp-card-head h2`、`.ui-table th`、`.viewer-drawer summary`、`.note code` 全部合法通过）；
     - **严禁交互与表单控件标签作为无类名末端目标**：`button`, `input`, `select`, `textarea`, `label`（唯一豁免：自定义勾选框组件内隐藏原生控件的 `.ui-check-row > input` / `.menu-row input`）。
   - **拦截效果**：不仅拦截顶层 `button { ... }`，还精准拦截 `.fp-card button`、`.fp-drawer button`、`.cli-banner button`、`.check-bulk button`、`.config button`、`.config label` 等**借父容器之名行全局后代污染之实**的脆弱选择器，倒逼所有按钮与表单控件显式挂载 `.ui-btn`、`.ui-input`、`.ui-select`、`.ui-label`！
3. **`UI-03c`（禁止多重 `:not()` 排除链）**：
   - 任何选择器分支匹配 `/:not\([^)]+\)\s*:not\(/`（如 `.fp-card button:not(.fp-cell-btn):not(.fp-tab)`）直接报错阻断。

---

### 2.4 规则 `UI-04`（跨目录同名类冲突 & 幽灵 CSS 变量检测）：精确冲突定义算法

在全仓 CSS 扫描中，共有 **42 个类名**出现在多个目录中。若简单按“同一类名出现在两个目录即报错”，会把合法的修饰类（如 `.status.ok` vs `.fp-folder-verdict.ok` 中的 `.ok`）或同组件状态类误判为冲突；若只检查“完全相同的选择器字符串”，又会漏掉 `config-actions.css` 的 `.actions` 污染 `pair.css` 的 `.pair-card .actions`。

**零误报、零漏报的 `UI-04` 精确判定算法**：

1. **`UI-04a`（首段主类名 `leadingClass` 跨目录唯一所有权规则）**：
   - 对文件 `F`（所属模块目录 `dir = path.dirname(F)`）中的每个选择器分支 `[s_0, s_1, ..., s_k]`，提取起始段 `s_0` 的**第一个类名** `leadingClass`（如 `.btn:hover` → `btn`；`.status.ok` → `status`；`.matrix th` → `matrix`）。
   - **所有权判定**：
     - 同一个目录 `dir` 内的多个文件（如 `src/app/components/ui/` 或 `src/app/components/toolbar/`）共享同一个 owner `dir`，在同目录内写 `.btn`、`.btn:hover`、`.btn.primary` 或跨同目录子文件引用均属于同一 `dir`，**0 误报**；
     - 在 `.status.ok`（`leadingClass = "status"`）与 `.fp-folder-verdict.ok`（`leadingClass = "fp-folder-verdict"`）中，`.ok` 是第二顺位修饰类而非 `leadingClass`，**0 误报**；
     - 一旦同一个 `leadingClass` 出现在两个不同目录 `dir_A !== dir_B` 的 `s_0` 首类位置，立即判定为**跨模块主类名冲突**！实测可 100% 抓出：
       - `.matrix`（`components/timeline` vs `config`）
       - `.profile-card` / `.profile-card-head` / `.profile-name`（`components/profile` vs `config`）
       - `.badge`（`components/card` vs `config`）
       - `.standard-tag` / `.standard-desc`（`components/model-modal` vs `view`）
       - `.checkbox` / `.radio`（`components/menu` vs `components/run-control`）
2. **`UI-04b`（无作用域顶层单类名跨目录泄漏拦截——精准抓捕 `.actions`）**：
   - 若目录 `dir_A` 定义了**无祖先限定的单类名选择器**（即 `k === 0` 且 `s_0` 仅含单个类名 `.cls` 及其伪类，如 `config-actions.css` 中的 `.actions { ... }`），则该 `.cls` 具有全局无差别打击能力；
   - 此时若任何其他目录 `dir_B !== dir_A` 在后代选择器任意位置引用了 `.cls`（如 `pair.css` 的 `.pair-card .actions`），或在其他目录的 TSX `className` 中使用了 `cls`（除 `src/app/components/ui` 的 `.ui-*` 与 `globals.css` 的 `.page` 外），立即报错拦截！这迫使 `config-actions.css` 将 `.actions` 重命名为 `.config-actions-bar`。
3. **`UI-04c`（未定义 CSS 变量与矛盾 Fallback 校验）**：
   - **剥离注释后再扫描**：必须在剥离 `/* ... */` 与 JSDoc 注释后再提取 `var(--name)`（实测 [`src/app/components/export/result-set-gif.ts:45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/export/result-set-gif.ts#L45) 的 JSDoc 注释中写有示例文本 `calc(var(--cycle) * -0.5)`，若不剥离注释会误报 `--cycle` 未定义！）；
   - **禁止对全局已定义 Token 写字面量 Fallback**：对已在 `tokens.css` / `globals.css` 定义的全局 Token，禁止写 `var(--radius, 6px)`、`var(--radius-md, 7px)`、`var(--warn, #e0a442)` 等带字面量回退值的写法，防止视觉预期与 Token 真值脱节。

---

## 三、 针对 `DESIGN_SYSTEM_AND_COMPONENT_PLAN.md` 的具体修订清单

### Must-Fix（阻塞实施或会导致门禁误杀/漏检的必改项）

1. **[Must-Fix 1] 在 §2.1 `tokens.css` 中补齐 4 个缺失的语义/阴影 Token，消除 `UI-02` 死胡同**：
   - 在色彩系统中补充：`--surface-bar-hi: rgba(148, 163, 184, 0.18);`（相似度排行非声明榜首高亮/中性胶囊底色）、`--border-tick: rgba(230, 232, 238, 0.42);`（相似度合格线刻度）、`--accent-hover: #3b7ce6;`（实心主色按钮悬停态）；
   - 在阴影阶梯中补充方向性粘性阴影：`--shadow-sticky-col: 2px 0 6px rgba(0, 0, 0, 0.25);`（用于 `.fp-col-cli` 冻结列）与 `--shadow-sticky-bottom: 0 -6px 16px rgba(0, 0, 0, 0.35);`（用于配置页底部常驻栏）；
   - 对 `run-status-panel.css:39-42` 的 `@keyframes run-pulse` 与 `run-control-auto.css:41` 的 `.dot-running`，明确改用 `color-mix(in srgb, var(--accent) 55%, transparent)` / `var(--ok-border)` 或补充发光 Token。
2. **[Must-Fix 2] 在 §二 增设「2.3 业务几何常量契约与主看板 `.folder` 同心圆角保护」小节**：
   - 明确原 `globals.css:25-41` 的 11 个业务几何常量（`--badge-height` 至 `--lane-head-height`）继续保留在 `globals.css`（或迁入对应组件 CSS 的 `:root`），且**严禁改名或改动像素值**，注明其与 `track-layout.ts`、`timeline-svg.ts`、`timeline-portrait-svg.ts`、`result-set-svg.ts` 的跨语言同步关系；
   - 修正 §2.1 第 119 行 `--radius-xl: 24px` 的注释说明：主看板 216×216 `.folder` 外圆角保持 `44px`（内槽 `.folder-slot` 保持 `18px`，与 `timeline-svg.ts:301,315` 的 `rx="44"` / `rx="18"` 严格一致，可提取为 `--folder-radius: 44px`、`--folder-slot-radius: 18px`），`--radius-xl: 24px` 仅用于 `/fingerprint` 的 `.fp-folder` 卡片。
3. **[Must-Fix 3] 在 §5.1 将 `UI-01` 明确定义为基于 TypeScript AST 的静态分析，并增加「白名单属性禁止纯静态字面量值」约束**：
   - 明确使用 `ts.createSourceFile` 遍历 `JsxAttribute(name="style")` 并追踪文件内 `Identifier` 变量引用（覆盖 `style={modalStyle}`）；
   - 明确 `width`, `height`, `gridTemplateColumns`, `background` 等白名单属性的 AST 值节点严禁为 `StringLiteral` / `NumericLiteral` / `NoSubstitutionTemplateLiteral`（拦截 `gridTemplateColumns: "repeat(auto-fill, ...)"` 与 `background: "var(--surface-hi)"`）；
   - 将主看板与配置页遗漏的 **6 处静态内联样式**（`page.tsx:60`、`RunStatus.tsx:181`、`TimeoutForm.tsx:137`、`ReferenceSourceDisplay.tsx:38,61,68`）补入 Phase 3 清零范围。
4. **[Must-Fix 4] 在 §5.3 与 §4.2 精确收紧 `UI-03` 选择器规则，禁止写成 `.config button` / `.config label` 后代裸标签**：
   - 将 `UI-03` 细化为：`UI-03a`（除 `globals.css` 外，每个选择器分支首段 `s_0` 必须以 `.class` 开头，拦截 `button.primary` / `label.checkbox`）、`UI-03b`（末端目标段 `s_k` 若无类名，严禁为交互控件标签 `button`, `input`, `select`, `textarea`, `label`，僅允许 `th`, `td`, `h1`–`h4`, `p`, `summary`, `code` 等排版/表格结构标签）、`UI-03c`（禁止连续 `:not()...:not()`）；
   - 同步修正 §4.2 第 2 条表述：将 `config-base.css:51-122` 的表单与按钮样式彻底迁移至 `.ui-label` / `.ui-input` / `.ui-select` / `.ui-textarea` / `.ui-btn` 类名下，**不得保留 `.config button` 或 `.config label` 后代裸标签规则**。
5. **[Must-Fix 5] 在 §5.4 明确 `UI-04` 跨目录类名冲突的精确算法（`leadingClass` 目录所有权 + 顶层单类名跨目录泄漏检测）**：
   - 按选择器分支首段 `s_0` 的第一个类名 `leadingClass` 绑定唯一目录 `path.dirname(file)`（同目录多文件与伪类/修饰类 `.btn:hover`、`.status.ok` 零误报）；
   - 额外拦截“目录 A 定义顶层无作用域单类名 `.cls`（如 `.actions`），目录 B 在选择器或 JSX 中使用 `.cls`”的跨页泄漏，并在 Phase 3 清单中明确将 `config-actions.css` 的 `.actions` 重命名为 `.config-actions-bar`、将 `config-base.css` 的 `.checkbox` / `.radio` 迁入 `.ui-check-row`。
6. **[Must-Fix 6] 在 §5.2 补齐 §2.2 承诺的「响应式断点门禁」与全量 `font-size` Token 强制校验**：
   - `UI-02` 不仅拦截 `\d+\.5px`，应强制除 `tokens.css` 外的所有 `font-size` 声明必须引用 `var(--text-*)`；
   - `UI-02` 扫描所有 `@media` 宽度条件，仅放行 `640px/641px`、`900px/901px`、`1200px/1201px`，并同步将 `globals.css:44,51,82,88` 的 `768px` / `400px` 纳入收敛范围。

### Should-Fix（提升迁移一致性与门禁稳健性的建议项）

1. **[Should-Fix 1] 在 §2.1 补充存量非标字号（`9px` / `10.5px` / `11.5px` / `12.5px` / `13.5px` / `14.5px` / `15px` / `17px` / `18px`）到 7 级字阶的确定性映射表**：避免 Phase 2 与 Phase 3 实施时对 `11.5px`（归 `11px` 还是 `12px`）、`12.5px`（归 `12px` 还是 `13px`）、`18px`（`.board-title` / `.modal-title` 归 `--text-lg: 16px` 还是增设档位）产生主观分歧。
2. **[Should-Fix 2] 在 `UI-04` 中增加「全局 Token 禁止携带硬编码 Fallback」规则**：自动拦截 `var(--radius, 6px)`（`config-nav.css:43`）、`var(--radius-md, 7px)`（`fingerprint-matrix.css:107,173`）、`var(--warn, #e0a442)`（`cards-footer.css:102`）等与 `:root` 真值冲突或冗余的回退值。
3. **[Should-Fix 3] 明确 `check-ui-hygiene.ts` 必须在词法层先剥离注释**：扫描 `.css` 与 `.tsx`/`.ts` 时必须先剥离块注释 `/* ... */` 与行注释，防止如 `result-set-gif.ts:45` 注释中的 `var(--cycle)` 触发 `UI-04` 误报。
4. **[Should-Fix 4] 解决跨目录组件覆盖选择器（`.menu-panel.run-once-panel`、`.folder.fp-folder`）的目录归属规范**：规定扩展子组件样式时，将本模块自有类名置于首位（如 `.run-once-panel.menu-panel`、`.fp-folder.folder`）或直接单写自有类名，确保 `UI-04a` 的 `leadingClass` 严格归属当前目录。
5. **[Should-Fix 5] 为 `scripts/check-ui-hygiene.ts` 配套编写单元测试 `test/scripts/check-ui-hygiene.test.ts`**：仿照 `test/scripts/` 现有门禁测试，覆盖 `style={varName}`、静态 vs 动态 `gridTemplateColumns`、`.ui-table th` vs `.fp-card button`、`.btn:hover` vs `.matrix` 跨目录冲突等正反例，确保门禁自身逻辑零回归。
