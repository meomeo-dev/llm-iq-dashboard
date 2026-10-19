# Web UI 设计系统与组件模块架构审查总览

本目录存放由 6 个子代理（鹈鹕主看板 3 个、模型指纹页 3 个）对本仓库前端代码（`src/app/`）与设计文档（`docs/ui/`）进行的全面工程审计报告。

---

## 一、核心结论：到底有没有设计系统？组件模块是否真的有规划？

### 1. 设计系统（Design System）：**无成体系的设计系统，仅有基础色值表**
- **设计系统文档 100% 缺失**：`.agents/skills/ui-design-system/SKILL.md` 中声明的 `design-system.md`、`UI Elements Kit`、5 份规范 Brief 与 5 张规范图在仓库中**完全不存在**（运行 `ui-design.mjs check` 报 12 个 ERROR）；`docs/ui/` 下仅有一份早期已废弃的圆形玫瑰图表盘草稿（`dial-design-brief.md`，其色值与现行代码不符）和一份与现行路由/断点脱节的 `UX_STATE_MAP.md`。
- **`globals.css` 只是局部色板与看板几何常量的混合体**：`src/app/globals.css:3-42` 仅定义了 11 个基础颜色、4 个尺寸变量和 11 个绑定主页时间线的业务几何常量（`--cell-width` 等）。**字阶（Typography Scale）、间距阶（Spacing Scale）、圆角阶（Radius Scale）、层级阶（Z-Index Scale）、阴影海拔（Elevation）以及半透明状态表面/边框色 Token 全部缺失**。
- **僵尸 Token 与幽灵 Token 并存**：
  - `globals.css:18-20` 定义的 `--control-height: 32px`、`--radius-md: 7px`、`--radius-sm: 6px` 在鹈鹕主看板、配置页、作品查看页、配对页的 43 个 CSS 文件中**引用次数为 0**；
  - `pair.css:9,28` 与 `config-actions.css:75` 引用了从未定义的 `--line` 和 `--danger`，在深色背景上回退渲染出浅色模式的 `#d9d9d9` 灰白边框与 `#b42318` 低对比度暗红字。
- **全站散装数值失控**：在受审的 CSS 文件中检出 **116 处硬编码色值**（成功绿分裂为 `#4ade80` / `#10b981` / `#3fb950` 三套色系，主强调蓝分裂为 `#4f8df7` / `#60a5fa` / `#2563eb`）、**16 种字号档位**（含 `10.5px` / `11.5px` / `12.5px` / `13.5px` / `14.5px` 等拍脑袋半像素字号）、**17 种圆角写法**、**11 档孤立 `z-index`**，以及在指纹相关 `.tsx` 中检出 **62 处内联 `style={{ ... }}`**。

### 2. 组件模块规划（Component Architecture）：**无通用 UI 原语层，大量拆分由“代码行数门禁”机械驱动**
- **缺乏基础 UI 原语层（`src/app/components/ui/` 为空缺）**：
  - `src/app/components/` 下的 13 个子目录（109 个文件）除 `Menu.tsx` 与 `SvgFrame.tsx` 外，全部强耦合 `@/core/types` 的鹈鹕画图评测业务模型，并非通用组件库。
  - 全站没有统一的 `AppTopbar`、`Button`、`Badge`、`Modal`、`Drawer`、`Table`、`Tabs` 组件：
    - **5 个路由手写了 4 套互不兼容的页面顶栏**（`.toolbar`、`.masthead`、`.viewer-head`、`.fp-header`），其中 `.masthead` 和 `.prompt` 甚至是没有 CSS 定义的“幽灵类名”；
    - **4 处 Modal 与 4 处 Drawer 各自手写 DOM 与遮罩**，导致 `DataRepoPushDialog` 与 `FingerprintSampleDrawer` 缺失 `useModalBehavior`（不支持 `Esc` 关闭、不锁定背景滚动、缺失 `aria-modal`）；
    - **全站分裂出 14+ 套按钮类名**，`config-base.css:51-122` 直接用无作用域的裸 `button`、`input`、`select` 标签选择器污染全局，而未引入该文件的 `/pair` 页则退化为浏览器原生白底输入框与系统灰按钮；
    - **跨模块全局 CSS 类名冲突**：`.matrix`（Grid 时间线 vs 配置页 `<table>`）、`.profile-card`（`position: fixed` 浮层 vs 配置页静态卡片）、`.actions`、`.checkbox` 在不同目录重名定义，靠路由未同时加载侥幸维持，一旦同页混用即发生样式覆盖。
- **代码长度门禁（`code-length-policy.yaml`）催生“解剖式切碎”与“杂物间文件”**：
  - 为满足 `.tsx ≤ 300 行 / 函数 ≤ 80 行`、`.css ≤ 300 行` 的硬门禁，大量单内聚组件与样式表被按行数硬切：
    - CSS 出现 9 个纯 `@import` 聚合壳，同一个选择器的基础样式与 `@media` 响应式规则被切在不同文件（如 `.run-once-panel` 的移动端样式被塞进 `run-control-stop.css:45-143`）；
    - React 组件被切成单次调用的碎片（如 `ArtViewer` 313 行被切成 4 个文件，`ConfigSectionShell.tsx` 堆放 8 个纯透传包装函数）；
    - `/fingerprint` 中出现按行数凑文件的“杂物间模块”（`FingerprintCheckSections.tsx` 混放顶栏底脚、泳道空状态与弹窗第 4 层表格，并与 `FingerprintCheckTimeline.tsx` 形成循环依赖）。

---

## 二、分专题审查报告目录（`docs/review/ui/<topic>/*`）

### A. 鹈鹕主看板及附属页审查（3 个专题，6 份报告）

1. **`pelican-design-system`（设计系统与 CSS Token 治理）**
   - [01-token-and-css-audit.md](./pelican-design-system/01-token-and-css-audit.md)：`globals.css` Token 覆盖率、僵尸/幽灵 Token、116 处硬编码色值、16 档散装字号、17 种圆角与 11 档 `z-index` 定量普查。
   - [02-design-docs-vs-code-gap.md](./pelican-design-system/02-design-docs-vs-code-gap.md)：`docs/ui/` 文档缺失与漂移、全局 CSS 类名冲突（`.profile-card` / `.matrix` / `.actions`）、裸标签选择器污染审计。
2. **`pelican-component-architecture`（组件架构与拆分规划）**
   - [01-component-hierarchy-and-boundaries.md](./pelican-component-architecture/01-component-hierarchy-and-boundaries.md)：`src/app/components/` 业务耦合度分析，以及 Modal、Drawer、Button、Badge、Table、PageHeader 六大原语重复手写举证。
   - [02-line-limit-driven-fragmentation.md](./pelican-component-architecture/02-line-limit-driven-fragmentation.md)：代码行数门禁如何导致 CSS 跨文件撕裂与 React 组件机械切碎（含合理拆分正例与机械切碎反例对照）。
3. **`pelican-ux-and-interaction`（跨页面 UX 一致性与交互状态）**
   - [01-cross-page-ux-consistency.md](./pelican-ux-and-interaction/01-cross-page-ux-consistency.md)：`/`、`/view`、`/config`、`/pair` 四页顶栏、容器宽度、表单按钮、浮层关闭交互与响应式断点不一致审计。
   - [02-interaction-and-state-audit.md](./pelican-ux-and-interaction/02-interaction-and-state-audit.md)：`localStorage` 散落读写、6 套异步状态结构、危险删除操作缺乏统一二次确认、错误国际化断裂与只读权限边界审计。

### B. 模型指纹页审查（3 个专题，6 份报告）

4. **`fingerprint-design-system`（指纹页设计系统合规性与样式漂移）**
   - [01-css-and-token-drift-audit.md](./fingerprint-design-system/01-css-and-token-drift-audit.md)：`.fp-*` 平行样式体系与主看板 `@import` 混搭冲突、顶栏 5 控件 4 种高度、脆弱 `:not()` 按钮选择器与 4 组幽灵类名审计。
   - [02-inline-styles-and-magic-numbers.md](./fingerprint-design-system/02-inline-styles-and-magic-numbers.md)：指纹页与 `ModelFingerprintSection.tsx` 中 **62 处 `style={{ ... }}` 内联样式**逐文件逐行普查与成因剖析。
5. **`fingerprint-component-architecture`（指纹页组件复用、重复造轮子与模块边界）**
   - [01-reuse-vs-reinvention-audit.md](./fingerprint-component-architecture/01-reuse-vs-reinvention-audit.md)：页头、抽屉、跑一次面板、状态栏、泳道与弹窗的“半复用半克隆”清单，以及双重请求刷新（`router.refresh()` + `fetch("/api/fingerprint")`）与双套取消入口剖析。
   - [02-module-boundaries-and-coupling.md](./fingerprint-component-architecture/02-module-boundaries-and-coupling.md)：2 处模块循环依赖、`FingerprintCheckSections.tsx` / `FingerprintMatrixHead.tsx` 职责混杂，以及 6 处死状态/无人消费的冗余 Props 清单。
6. **`fingerprint-ux-and-workflow`（指纹页信息架构、UX 事故溯源与工程整改路线图）**
   - [01-information-architecture-and-ux-audit.md](./fingerprint-ux-and-workflow/01-information-architecture-and-ux-audit.md)：复盘 `/fingerprint` 连续 8 起 UX 事故的工程根因（Schema-Driven UI + 无共享原语），并指出 `FingerprintSampleDrawer`、`ModelFingerprintSection`、`CheckProbeAttemptsSection` 现存的未打磨短板。
   - [02-remediation-roadmap.md](./fingerprint-ux-and-workflow/02-remediation-roadmap.md)：不引入重型第三方 UI 库的前提下，分三步补齐 `tokens.css`、7 个核心共享 UI 原语（`src/app/components/ui/`）与 `check-ui-hygiene.ts` 自动化门禁的落地方案。

---

## 三、架构重构方案与 3 个子代理方案审查报告

基于上述 12 份审查报告，已编制完整的四层重构方案并由 3 个专项审查子代理完成挑刺与定稿修订：

- **重构总方案（已合入全部 Must-Fix 修订）**：[DESIGN_SYSTEM_AND_COMPONENT_PLAN.md](./DESIGN_SYSTEM_AND_COMPONENT_PLAN.md)
- **方案审查报告（`docs/review/ui/plan-review/*`）**：
  1. [01-token-and-gate-review.md](./plan-review/01-token-and-gate-review.md)：针对 `tokens.css` 完备性、11 个业务几何常量与 `.folder` 同心圆角保护、以及 `UI-01`～`UI-04` 静态门禁 AST/选择器算法的挑刺审计。
  2. [02-component-api-and-ssr-review.md](./plan-review/02-component-api-and-ssr-review.md)：针对 8 个 UI 原语 Props 契约、`createPortal` 在 Node.js `renderToStaticMarkup` 单测下的崩溃风险与 SSR-Safe 渐进策略、以及 300 行 CSS 门禁拆分的挑刺审计。
  3. [03-migration-and-regression-review.md](./plan-review/03-migration-and-regression-review.md)：针对 12 份报告遗漏项对账（客户端状态韧性、`docs/ui/` 文档收口）、67 个静态 HTML 快照夹具与 `showcase:smoke` 回归风险、以及 Phase 1 / 2 / 3A / 3B 渐进式门禁的核查审计。

