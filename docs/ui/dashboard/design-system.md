# 鹈鹕基准看板设计系统与组件原语规范 (Web Design System)

- **状态**：Active（全仓生效，由 `scripts/check-ui-hygiene.ts` 门禁强制保障）
- **权威源码**：[`src/app/tokens.css`](../../../src/app/tokens.css)、[`src/app/globals.css`](../../../src/app/globals.css)、[`src/app/components/ui/`](../../../src/app/components/ui/)
- **覆盖路由**：`/`（主看板）、`/fingerprint`（模型指纹控制台）、`/config`（系统配置中心）、`/view/[runId]/[file]`（单幅作品沉浸查看页）、`/pair`（设备配对页）

---

## 一、 核心设计原则

1. **90% 深色中性灰 + 5% 主题蓝 + 5% 单点状态色**：
   - 页面、卡片、抽屉、表格、进度条轨道统一采用冷静的深色中性灰阶（`--bg`, `--surface`, `--surface-hi`, `--border`）；
   - 单张卡片或单个列表行内**状态色只出现一次（Single Point of Semantic Color）**，严禁对整张卡片或六宫格单元格大面积涂刷红、绿、黄背景或刺眼边框。
2. **Token 唯一事实源**：
   - 全站颜色、字号、间距、圆角、控件高度、Z-Index 层级与海拔阴影统一定义在 [`src/app/tokens.css`](../../../src/app/tokens.css)；
   - 业务几何常量（`--cell-width`, `--tile-size`, `--folder-radius: 44px`, `--folder-slot-radius: 18px` 等）保留在 [`src/app/globals.css`](../../../src/app/globals.css)，与 [`track-layout.ts`](../../../src/app/components/timeline/track-layout.ts) 及 [`export-image.ts`](../../../src/app/components/export/export-image.ts) 保持严格契约一致。
3. **三档标准响应式断点**：
   - **Mobile**：`@media (max-width: 640px)` / `(min-width: 641px)`
   - **Tablet**：`@media (max-width: 900px)` / `(min-width: 901px)`
   - **Desktop**：`@media (max-width: 1200px)` / `(min-width: 1201px)`

---

## 二、 Design Tokens 标尺速查（`src/app/tokens.css`）

### 2.1 色彩与语义表面 Token

| 分类 | Token 名称 | 值 | 用途说明 |
| :--- | :--- | :--- | :--- |
| **中性背景阶** | `--bg` | `#0b0f17` | 页面底层画布、内嵌代码块与深层凹陷槽背景 |
| | `--surface` | `#10161f` | 标准卡片、顶栏、模态窗主体与表格默认背景 |
| | `--surface-hi` | `#182030` | 悬浮面板、次级按钮、表头与输入框背景 |
| | `--surface-hover` | `#1f2940` | 交互行、列表项与卡片的悬停高亮态 |
| | `--surface-subtle` | `rgba(148, 163, 184, 0.06)` | 极浅中性分隔底纹 |
| | `--surface-bar` | `rgba(148, 163, 184, 0.10)` | 数据可视化进度条/排行条默认中性填充 |
| | `--surface-bar-hi` | `rgba(148, 163, 184, 0.18)` | 进度条次优对比档填充 |
| | `--canvas-bg` | `#ffffff` | SVG 作品展示白底画布（作品多为浅色底线稿） |
| | `--backdrop-bg` | `rgba(3, 6, 12, 0.72)` | 模态窗与侧边抽屉遮罩背景 |
| **边框阶** | `--border` | `#232d3d` | 标准容器、卡片与表格分割线 |
| | `--border-subtle` | `rgba(255, 255, 255, 0.07)` | 密集表格内部分隔弱线 |
| | `--border-tick` | `rgba(230, 232, 238, 0.42)` | 进度条阈值刻度线 |
| | `--border-focus` | `#6b7385` | 输入框与按钮键盘聚焦环 |
| **文本阶** | `--text` | `#e6e8ee` | 主标题、正文与核心数值 |
| | `--text-dim` | `#9aa2b1` | 副标题、表头标签與次要说明 |
| | `--text-faint` | `#6b7385` | 禁用态、辅助注释与时间戳 |
| | `--text-on-solid` | `#ffffff` | 实心强调色或危险按钮上的文字 |
| **语义强调与状态** | `--accent` / `-hover` / `-tint` / `-border` | `#4f8df7` 系 | 品牌强调、选中态、主操作与声明模型高亮 |
| | `--ok` / `-tint` / `-border` | `#4ade80` 系 | 成功、`consistent`、在线可用状态 |
| | `--warn` / `-tint` / `-border` | `#fbbf24` 系 | 警告、`inconclusive`、无 SVG 或降级状态 |
| | `--err` / `-tint` / `-border` | `#f87171` 系 | 错误、`inconsistent`、超时或危险操作 |

### 2.2 字阶、间距、圆角、高度与层级标尺

- **字号阶（7 档）**：`--text-2xs` (`10px`)、`--text-xs` (`11px`)、`--text-sm` (`12px`)、`--text-base` (`13px`)、`--text-md` (`14px`)、`--text-lg` (`16px`)、`--text-xl` (`20px`)。
- **间距阶（9 档）**：`--space-1` (`4px`)、`--space-1-5` (`6px`)、`--space-2` (`8px`)、`--space-2-5` (`10px`)、`--space-3` (`12px`)、`--space-4` (`16px` / `--gap`)、`--space-5` (`20px`)、`--space-6` (`24px`)、`--space-8` (`32px`)。
- **圆角阶（7 档）**：`--radius-xs` (`4px`)、`--radius-sm` (`6px`)、`--radius-md` (`8px`)、`--radius` (`10px`)、`--radius-lg` (`14px`)、`--radius-xl` (`24px`)、`--radius-pill` (`999px`)。
- **控件高度阶（3 档）**：`--control-height-sm` (`28px`)、`--control-height` (`32px`)、`--control-height-lg` (`36px`)。
- **Z-Index 阶（9 档）**：`--z-sticky-cell` (`2`)、`--z-sticky-head` (`3`)、`--z-sticky-bar` (`10`)、`--z-dropdown` (`80`)、`--z-modal` (`200`)、`--z-drawer` (`220`)、`--z-modal-nested` (`250`)、`--z-popover` (`300`)、`--z-toast` (`400`)。
- **阴影阶（5 档）**：`--shadow-sm`、`--shadow-md`、`--shadow-lg`、`--shadow-sticky-col`、`--shadow-sticky-bottom`。

---

## 三、 三层组件模块架构与 Tier 1 UI 原语

前端代码严格遵循单向分层依赖：**Tier 3（路由页面壳）→ Tier 2（跨路由领域组件）→ Tier 1（零业务耦合 UI 原语 `src/app/components/ui/`）**。

### 3.1 Tier 1：8 组通用 UI 原语（`src/app/components/ui/`）

| 原语组件 | 源码文件 | 配套样式 | 核心职责与契约 |
| :--- | :--- | :--- | :--- |
| **`PageShell` & `PageHeader`** | [`PageHeader.tsx`](../../../src/app/components/ui/PageHeader.tsx) | `ui-layout.css` | 统一全站二级页面外壳与顶栏（返回链接与 `<h1>` 为兄弟节点，支持 `subtitle`、`centerSlot`、`actionsSlot`） |
| **`Button`, `ButtonLink`, `ConfirmButton`** | [`Button.tsx`](../../../src/app/components/ui/Button.tsx) | `ui-controls.css` | 统一按钮变体（`default`/`primary`/`danger`/`ghost`）、1×1 Grid 防抖叠层（`busyLabel`）与行内二次确认状态机 |
| **`FormField` & `CheckboxField`** | [`FormField.tsx`](../../../src/app/components/ui/FormField.tsx) | `ui-controls.css` | 统一深色表单域（`.ui-field`, `.ui-label`, `.ui-input`, `.ui-select`, `.ui-textarea`, `.ui-check-row`），零裸标签污染 |
| **`StatusPill`** | [`StatusPill.tsx`](../../../src/app/components/ui/StatusPill.tsx) | `ui-controls.css` | 统一全站状态胶囊与徽章（5 种语义色 × 3 种变体，支持可选圆点 `dot`、等宽数字 `mono` 与点击交互 `onClick`） |
| **`Modal`** | [`Modal.tsx`](../../../src/app/components/ui/Modal.tsx) | `ui-overlays.css` | 统一模态对话框，接入 `useOverlayStack` LIFO `Esc` 栈管理，SSR 默认原位渲染兼容 `renderToStaticMarkup` |
| **`Drawer` & `Collapsible`** | [`Drawer.tsx`](../../../src/app/components/ui/Drawer.tsx) | `ui-overlays.css` | 统一右侧滑出抽屉（含遮罩防误触与 `Esc` 关闭）与底部/内嵌折叠面板（CSS 旋转箭头） |
| **`DataTable`** | [`DataTable.tsx`](../../../src/app/components/ui/DataTable.tsx) | `ui-layout.css` | 提供 `variant="matrix"`（支持横向滚动与前两列 Sticky 冻结）与 `variant="compact"`（100% 自适应父容器不溢出） |
| **`AlertBanner` & `EmptyState`** | [`AlertBanner.tsx`](../../../src/app/components/ui/AlertBanner.tsx) | `ui-layout.css` | 统一页内状态/错误横幅（支持关闭回调与操作槽）与空状态引导卡片 |

### 3.2 Tier 2：跨路由共享领域组件

- **评测标准与评审徽章**：[`StandardCriteriaPanel.tsx`](../../../src/app/components/standard/StandardCriteriaPanel.tsx)、[`JudgeStatusBadge.tsx`](../../../src/app/components/standard/JudgeStatusBadge.tsx)（供首页对比弹窗与 `/view` 共用）。
- **上游 Profile 标识与持久化**：[`ProfileName.tsx`](../../../src/app/components/profile/ProfileName.tsx)、[`ProfileInfoCard.tsx`](../../../src/app/components/profile/ProfileInfoCard.tsx)（`.profile-popover-card`）、[`profile-selection-store.ts`](../../../src/app/components/profile/profile-selection-store.ts)（内置 `safeLocalStorageGet` / `safeLocalStorageSet`）。
- **时间轴与滚动锚定**：[`TimelineAxis.tsx`](../../../src/app/components/timeline/TimelineAxis.tsx)、[`use-now.ts`](../../../src/app/components/timeline/use-now.ts)、[`use-scroll-anchor.ts`](../../../src/app/components/timeline/use-scroll-anchor.ts)（供主看板与 `/fingerprint` 核验时间线共用）。

---

## 四、 自动化静态门禁（`pnpm check:ui`）

[`scripts/check-ui-hygiene.ts`](../../../scripts/check-ui-hygiene.ts) 在提交前（`lefthook.yml` `pre-commit`）自动扫描全仓 `src/app/**`，强制执行 5 项零误报规则：
- **`UI-00`**：禁止 `src/app/components/ui/*` 引用 `@/core/*` 或 `@/adapters/*`。
- **`UI-01`**：基于 TypeScript AST 禁止静态 JSX `style={{ ... }}` 内联样式（仅放行 `--*` CSS 变量与动态计算的几何/哈希色属性）。
- **`UI-02`**：禁止在 `tokens.css` 之外硬编码 `#hex`/`rgb()`/`rgba()`/`hsl()` 裸色值、非 `var(--text-*)` 字号以及非 `640px/900px/1200px` 的 `@media` 宽度断点。
- **`UI-03` (`a`/`b`/`c`)**：禁止局部 CSS 顶层裸标签、禁止无类名交互控件后代选择器（`button`, `input`, `select`, `textarea`, `label`）、禁止连续 `:not()...:not()` 排除链。
- **`UI-04` (`a`/`b`/`c`)**：强制跨目录 `leadingClass` 唯一所有权、禁止顶层单类名跨目录泄漏、禁止未定义 CSS 变量或全局 Token 冗余字面量回退。
