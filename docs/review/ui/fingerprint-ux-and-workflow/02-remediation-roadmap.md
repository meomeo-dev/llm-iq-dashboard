# 从“散装页面开发”走向“设计系统与组件规划”的工程整改路线图

## 1. 总体工程原则

针对本仓库的技术栈现状（Next.js 15 + React 19 + 原生 CSS 变量）与质量门禁（`config/code-length-policy.yaml`：`.ts` ≤ 500 行、`.tsx` ≤ 300 行、`.css` ≤ 300 行；函数 `.ts` ≤ 50 行、`.tsx` ≤ 80 行），整改遵循以下三条务实原则：

1. **零重型框架引入**：不引入 Tailwind CSS、CSS-in-JS 运行时或第三方重型组件库（如 MUI / AntD），保持原生 CSS 自定义属性（CSS Variables）+ 轻量级无状态 React 原语组件的架构。
2. **先立 Token 与原语，再清存量页面**：先在 `src/app/tokens.css`（由 `src/app/globals.css` 引入）收敛字号、间距、圆角、层级与语义表面色，再在 `src/app/components/ui/` 提炼 7 个零业务耦合的原子/分子组件，最后替换 `/fingerprint`、`/config`、`/`、`/view` 中的散装实现。
3. **用自动化门禁替代口头约定**：在 `scripts/` 下新增静态检查脚本并与 `check:length`、`lint` 一起挂入 `lefthook.yml` 的 `pre-commit` 钩子，从代码提交入口拦截静态 `style={{ ... }}` 内联样式与未登记的散装色值。

---

## 2. 第一步：Design Tokens 层（`src/app/globals.css` / `src/app/tokens.css`）

### 2.1 现有 Token 缺口盘点

目前 `src/app/globals.css:3-42` 仅定义了 8 个中性色、3 个裸语义色（`--ok`, `--warn`, `--err`）、3 个圆角（`--radius`, `--radius-md`, `--radius-sm`）、`--control-height: 32px`、`--gap: 16px` 以及主看板时间线专用几何常量。由于缺少完整的标尺阶，各页面 CSS 与 JSX 内联样式出现了严重的数值发散：

- **字号发散（共 13 种）**：`10px` (`fingerprint-check-modal.css:178`)、`10.5px` (`fingerprint-timeline.css:95`)、`11px` (`fingerprint.css:133`)、`11.5px` (`config-base.css:126`)、`12px` (`fingerprint.css:125`)、`12.5px` (`ModelFingerprintSection.tsx:92`)、`13px` (`fingerprint.css:39`)、`13.5px` (`fingerprint-check-modal.css:59`)、`14px` (`globals.css:70`)、`15px` (`config-base.css:24`)、`16px` (`fingerprint.css:119`)、`18px` (`model-modal-dialog.css:44`)、`20px` (`fingerprint.css:32`)。
- **间距发散（共 16 种）**：在 `2px` 到 `24px` 之间任意手写偶数与奇数像素值（如 `2px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px`）。
- **圆角发散（共 10 种）**：除 3 个已有变量外，散落着 `4px`, `5px`, `8px`, `12px`, `14px`, `24px`, `999px`。
- **Z-Index 无全局规划**：矩阵固定列 `z-index: 2 / 3`（`fingerprint-matrix.css:72, 78`）、顶栏 `z-index: 10`（`toolbar-layout.css:12`）、模态窗 `z-index: 50`（`model-modal-dialog.css:6`）、抽屉 `z-index: 60`（`fingerprint.css:161`）各自硬编码。
- **语义透明色硬编码**：在 `fingerprint.css:141, 146, 152`、`fingerprint-matrix.css:140, 145`、`fingerprint-check-modal.css:135, 139, 147, 198`、`viewer-drawers.css:117-125` 中手写了 15 处以上的 `rgba(...)` 半透明边框色与底色。

### 2.2 应补齐的标准 Token 清单

新建 `src/app/tokens.css` 并由 `src/app/globals.css` 首行 `@import "./tokens.css";`，补齐以下 5 组基础标尺：

```css
:root {
  /* 1. 字体栈与 7 级字号阶（彻底淘汰 .5px 半像素字号） */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-2xs: 10px;   /* 角标、微型徽章 */
  --text-xs: 11px;    /* 辅助说明、表头副标题、探针槽位名 */
  --text-sm: 12px;    /* 密集表格、次要元数据、抽屉摘要 */
  --text-base: 13px;  /* 按钮、表单控件、标准正文卡片 */
  --text-md: 14px;    /* 页面默认正文、重要数值 */
  --text-lg: 16px;    /* 区块标题 (h2)、品牌标题 */
  --text-xl: 20px;    /* 页面主标题 (h1)、模态窗主标题 */

  /* 2. 间距阶（4px 基准网格 + 6px 紧凑微调） */
  --space-1: 4px;
  --space-1-5: 6px;
  --space-2: 8px;
  --space-2-5: 10px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;

  /* 3. 圆角与控件尺寸阶 */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius: 10px;
  --radius-lg: 14px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --control-height-sm: 28px;
  --control-height: 32px;

  /* 4. Z-Index 层级阶（消除弹层与下拉菜单遮挡隐患） */
  --z-sticky-cell: 2;
  --z-sticky-head: 3;
  --z-toolbar: 10;
  --z-dropdown: 40;
  --z-modal: 50;
  --z-drawer: 60;
  --z-toast: 70;

  /* 5. 语义表面色与半透明边框（替代散落的 rgba 硬编码） */
  --surface-subtle: rgba(148, 163, 184, 0.06);
  --surface-bar: rgba(148, 163, 184, 0.10);
  --accent-tint: rgba(79, 141, 247, 0.14);
  --accent-border: rgba(79, 141, 247, 0.45);
  --ok-tint: rgba(74, 222, 128, 0.12);
  --ok-border: rgba(74, 222, 128, 0.45);
  --warn-tint: rgba(251, 191, 36, 0.12);
  --warn-border: rgba(251, 191, 36, 0.45);
  --err-tint: rgba(248, 113, 113, 0.12);
  --err-border: rgba(248, 113, 113, 0.45);
  --backdrop-bg: rgba(3, 6, 12, 0.72);
}
```

---

## 3. 第二步：共享 UI 原语层（`src/app/components/ui/`）

在 `src/app/components/ui/` 下提炼 **7 个零业务耦合的原子/分子组件**。每个组件配对独立的 `.tsx` 与 `.css`（均严格小于 200 行），供 `/`、`/fingerprint`、`/config`、`/view`、`/pair` 共同调用：

### 3.1 7 个核心 UI 原语规划表

| 序号 | 原语组件名与路径 | 职责与核心 Props 契约 | 直接收编与替代的散装代码 | 跨页复用范围 |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **`AppTopbar`**<br>`ui/AppTopbar.tsx`<br>`ui/app-topbar.css` | 统一全站粘性顶栏外壳。槽位：`brand`（图标+主副标题/面包屑）、`center`（页面主操作器，如「▶ 跑一次」与筛选器）、`right`（内置 `RunStatus`、`LiveClock` + `TimeZoneMenu`、`LanguageSwitch` 及路由图标导航） | 替代 `FingerprintHeader` (`FingerprintDashboard.tsx:245-280`)、`ConfigPageHeader` (`ConfigPageHeader.tsx:6-23`)、`ArtViewerHead` 外壳 (`ArtViewerHead.tsx:35-93`)，与 `Toolbar.tsx` 共用同一套顶栏布局 | `/`、`/fingerprint`、`/config`、`/view` |
| **2** | **`Button` / `StatefulButton`**<br>`ui/Button.tsx`<br>`ui/button.css` | 通用按钮与 1×1 Grid 叠层定宽异步按钮。Props：`variant?: "default" \| "primary" \| "danger" \| "ghost"`、`size?: "sm" \| "md"`、`active?: boolean`、`activeLabel?: string` | 收编 `FingerprintMatrixHead.tsx:93-120`（`StatefulActionButton`）、`fingerprint-matrix.css:164-220`（`.fp-card button:not(...)`）、`config-base.css:94-122`（裸 `button` 选择器） | 全站所有操作按钮 |
| **3** | **`StatusPill`**<br>`ui/StatusPill.tsx`<br>`ui/status-pill.css` | 状态徽章与 6px 状态圆点原语。Props：`tone?: "neutral" \| "ok" \| "warn" \| "err" \| "accent"`、`dot?: boolean`、`mono?: boolean` | 统一 `.fp-badge` (`fingerprint.css:128-153`)、`.fp-sim-tag` (`fingerprint-check-modal.css:176-186`)、`.badge-readonly` (`toolbar-elements.css:119-130`)、`.standard-tag` (`viewer-drawers.css:107-126`) | `/`、`/fingerprint`、`/config`、`/view` |
| **4** | **`ModalShell`**<br>`ui/ModalShell.tsx`<br>`ui/modal-shell.css` | 标准模态窗容器（含遮罩点击关闭、`Esc` 退出、背景滚动锁定、标准 Header/Body 与动态多列宽度 `--col-count`）。内部直接调用 `useModalBehavior` | 统一 `ModelModal.tsx` (`model-modal-dialog.css:1-72`)、`FingerprintCheckModal.tsx:51-91` (`fingerprint-check-modal.css:3-20`)、`RunOnceProfileModal.tsx`、`DataRepoPushDialog.tsx` | `/`、`/fingerprint`、`/config` |
| **5** | **`DrawerShell` & `CollapsibleSection`**<br>`ui/DrawerShell.tsx`<br>`ui/CollapsibleSection.tsx`<br>`ui/drawer.css` | `DrawerShell`：右侧滑出抽屉（内置 `useModalBehavior` 支持 `Esc` 关闭与滚动锁定、固定头部+粘性操作栏+独立滚动体）；<br>`CollapsibleSection`：统一 `<details>/<summary>` 折叠面板 | `DrawerShell` 替代 `FingerprintSampleDrawer.tsx:46-62` (`fingerprint.css:155-174`)；<br>`CollapsibleSection` 统一 `.fp-tech-drawer` (`fingerprint-check-modal.css:252-269`) 与 `.viewer-drawer` (`viewer-drawers.css:3-55`) | `/fingerprint`、`/view`、`/config` |
| **6** | **`DataTable`**<br>`ui/DataTable.tsx`<br>`ui/data-table.css` | 统一数据表格原语。提供两种模式：<br>① `variant="matrix"`：含横向滚动容器、`min-width` 与首二列 `sticky` 固定；<br>② `variant="compact"`：`width: 100%` 自适应父容器、无强制 `min-width: 980px`，支持长文本折行与行高亮 | 拆分并替代 `fingerprint-matrix.css:3-89` 的 `.fp-matrix-table`，解决 `CheckTechDrawer` 在模态窗内套用 `.fp-matrix-table` 被 `min-width: 980px` 撑爆的问题；同时复用于 `TargetTable.tsx` 与 `DeviceTable.tsx` | `/fingerprint`、`/config` |
| **7** | **`NoticeBanner` & `EmptyState`**<br>`ui/NoticeBanner.tsx`<br>`ui/EmptyState.tsx`<br>`ui/feedback.css` | `NoticeBanner`：页内状态/错误/预检计划横幅（`tone: "info" \| "ok" \| "warn" \| "err"`，支持操作按钮区与关闭按钮）；<br>`EmptyState`：空状态引导容器与内联动作按钮 | 替代 `.fp-job-banner` 及其 3 处内联 `borderColor/color` 覆盖（`FingerprintDashboard.tsx:274`、`FingerprintMatrix.tsx:196`、`FingerprintMatrixHead.tsx:184`）、`ConfigAlerts.tsx`、`EmptyDay.tsx` 与 `CheckEmptyDay` | `/`、`/fingerprint`、`/config` |

### 3.2 关键存量组件的原语化改造要点

1. **`FingerprintSampleDrawer.tsx` 重构要点**：
   - 使用 `<DrawerShell title={...} subtitle={...} onClose={onClose}>` 获得完整的 `Esc` 键关闭、`role="dialog"`、`aria-modal="true"` 与背景滚动锁定能力。
   - **打通抽屉内直接选 Profile 并补采的闭环**：将已声明但未使用的 `profiles`、`selectedProfile`、`onChangeProfile` Props 真正接入抽屉顶部的 `DrawerGapActions` 工具栏（直接复用 `FillProfileSelect`），点击「补齐此探针」时直接在抽屉内触发采集或预览，**不再强制关闭抽屉跳回背景页二次确认**。
   - **收敛 `AttemptCard` 排版与高度**：将 8 项元数据拆分为卡片头（左侧 `reqId` + `StatusPill` 状态与 Profile 徽章，右侧「排除/恢复」按钮）与卡片副行（`codec`、有效值计数、自相似度）；为 `.fp-pre` 增加 `max-height: 160px; overflow-y: auto`；在抽屉顶部增加“全部 / 有效 / 异常与已排除”状态筛选胶囊。
2. **`ModelFingerprintSection.tsx` 重构要点**：
   - 新建 `src/app/config/config-fingerprint.css`，将 16 处 `style={{ ... }}` 全部迁移为语义化 CSS 类（复用 `config-base.css` 网格规范）。
   - **消除 `samplesPerProbe` 与 `samplesByProbe` 的双处冲突**：移除顶层形同虚设的 `samplesPerProbe` 独立输入框，仅保留“各探针目标样本数（`samplesByProbe`）”网格作為唯一权威入口，并提供「一键恢复默认样本数」按钮；当用户修改任一探针目标值时，自动更新 `samplesPerProbe = Math.min(...Object.values(samplesByProbe))` 以保持底层配置兼容。
   - 精简底部的只读模型芯片展示，改为一行统计摘要 +「在指纹控制台查看基准就绪状态 →」链接，划清“参数配置（`/config`）”与“样本采集与核验操作（`/fingerprint`）”的职责边界。
3. **`CheckProbeAttemptsSection` 与 `CheckTechDrawer` 重构要点**：
   - 修正 `src/app/fingerprint/FingerprintCheckSections.tsx:215-232` 的列定义，将 4 列明确对齐为：`探针 (Probe)`、`请求 ID / 状态 (Request / Outcome)`、`解码器与提取数 (Codec & Accepted)`、`原始输出摘要 (Raw Output，限制 max-height: 96px 可滚动)`。
   - 将第 `195-210` 行硬编码的 `· failed:` 与 `· uncompared:` 补入 `src/i18n/messages/fingerprint.ts` 双语词条字典。
   - 将 `CheckTechDrawer` 内 3 张表从 `.fp-matrix-table`（`min-width: 980px`）切换为 `<DataTable variant="compact">`，确保在 `680px` 单渠道弹窗与 `310px` 多渠道并排列中均不产生恶性横向溢出。

---

## 4. 第三步：开发门禁与规范层（Static Gates & Workflow）

### 4.1 新增静态 UI 门禁脚本：`scripts/check-ui-hygiene.ts`（`pnpm check:ui`）

仿照现有的 `scripts/check-code-length.ts` 与 `scripts/check-secrets.ts`，新增 `scripts/check-ui-hygiene.ts`，并在 `package.json` 注册 `"check:ui": "tsx scripts/check-ui-hygiene.ts"`，挂入 `lefthook.yml` 的 `pre-commit` 并行门禁。该脚本执行三项确定性静态检查：

1. **规则 UI-01：禁止在 `src/app/**/*.tsx` 中使用静态内联样式**
   - 扫描 JSX 中的 `style={{ ... }}` 属性。
   - **仅允许动态几何/数据驱动属性白名单**：`left`, `top`, `right`, `bottom`, `width`, `height`, `gridColumn`, `gridTemplateColumns`, `background`（仅限调用 `profileColor(...)` 函数），以及以 `"--"` 开头的 CSS 自定义属性（如 `"--upstream-count"`）。
   - **严禁出现的静态样式键**：`fontSize`, `fontWeight`, `lineHeight`, `color`, `borderColor`, `borderTop`, `borderBottom`, `border`, `display`, `flexDirection`, `justifyContent`, `alignItems`, `flexWrap`, `gap`, `margin`, `marginTop`, `marginBottom`, `marginLeft`, `padding`, `paddingTop`, `wordBreak`, `whiteSpace`, `overflow`, `textOverflow`。命中即报错退出（exit code 1）。
2. **规则 UI-02：禁止在业务 `.css` 与 `.tsx` 中手写未登记的裸色值字面量**
   - 扫描 `src/app/**/*.{css,tsx}` 中的 `#([0-9a-fA-F]{3,8})`、`rgb(...)`、`rgba(...)`、`hsl(...)`、`hsla(...)`。
   - **白名单文件**：仅 `src/app/tokens.css`、`src/app/globals.css`、`src/app/components/profile/profile-color.ts`（上游渠道色板生成函数）与 `src/app/components/export/**`（离线 SVG/Canvas 导出图内嵌样式）允许定义色值字面量；其余业务文件一律强制使用 `var(--*)`。
3. **规则 UI-03：禁止在局部 CSS 文件中编写无作用域的顶层 HTML 标签选择器**
   - 扫描除 `src/app/globals.css` 以外的所有 `src/app/**/*.css` 文件，禁止出现顶层裸标签选择器（如 `button { ... }`、`label { ... }`、`input[type="text"] { ... }`、`select { ... }`、`textarea { ... }`）。
   - 同步将 `src/app/config/config-base.css:51-122` 中的顶层标签选择器收敛至 `.config` 作用域下（如 `.config label`, `.config input[type="text"]`）或迁移至 `src/app/components/ui/button.css`，消除跨文件样式污染。

### 4.2 新增页面或复杂交互面板的前置「四问轻量契约」

在开发任何新路由或复杂交互面板前，禁止直接从后端 `types.ts` 开始写 `.tsx` 表格，必须先在工单或 `docs/ui/` 下完成不超过 30 行的轻量级契约确认：

1. **用户首屏核心决策是什么？**（区分“首屏必看结论”与“默认收起进 `CollapsibleSection` / `DrawerShell` 的底层诊断数据”，禁止平铺超过 2 张数据表）。
2. **空状态与异常态如何闭环引导？**（无前置数据、有前置数据未运行、当天无记录但历史有记录、全部调用失败四类状态分别指向哪个可执行按钮）。
3. **单条与批量操作的 API 载荷契约是否对齐？**（多选 UI 必须对应后端 Batch 接口，禁止前端循环发单请求或后端取 `[0]` 静默截断）。
4. **复用了 `src/app/components/ui/` 中的哪些原语？哪些状态依赖客户端 `window` / `localStorage` / `Date`？**（所有浏览器环境依赖必须经 `useEffect` 或客户端 Hook 注入，保证 SSR Hydration 零报错）。

### 4.3 落地实施排期与验收指标

| 阶段 | 核心交付内容 | 涉及文件范围 | 量化验收指标 |
| :--- | :--- | :--- | :--- |
| **Phase 1（P0 缺陷与数据对齐修复）** | 1. 修复 `CheckProbeAttemptsSection` 表头错位与硬编码英文；<br>2. 移除 `ModelFingerprintSection` 中冲突失效的 `samplesPerProbe` 独立框；<br>3. 修复 `FingerprintSampleDrawer` 死代码 Props，支持 `Esc` 关闭与抽屉内选 Profile 直接补采 | `src/app/fingerprint/FingerprintCheckSections.tsx`<br>`src/app/fingerprint/FingerprintSampleDrawer.tsx`<br>`src/app/config/ModelFingerprintSection.tsx`<br>`src/i18n/messages/fingerprint.ts` | 1. 表头与单元格 100% 语义对应，零硬编码英文残留；<br>2. 抽屉按 `Esc` 可关闭，抽屉内点「补齐此探针」不丢失上下文；<br>3. `pnpm test` 与 `pnpm build` 全部通过 |
| **Phase 2（Tokens 与 UI 原语提炼）** | 1. 新增 `src/app/tokens.css` 补齐 5 类设计 Token；<br>2. 在 `src/app/components/ui/` 落地 `AppTopbar`, `Button`, `StatusPill`, `ModalShell`, `DrawerShell`, `CollapsibleSection`, `DataTable`, `NoticeBanner`；<br>3. `/fingerprint` 顶栏接入 `AppTopbar` 补齐时区切换 | `src/app/tokens.css`、`src/app/globals.css`<br>`src/app/components/ui/*`<br>`src/app/fingerprint/*`<br>`src/app/config/config-fingerprint.css` | 1. `src/app/fingerprint/` 与 `ModelFingerprintSection.tsx` 的 `style={{ ... }}` 从 **58 处降至 ≤ 6 处**（仅留动态坐标/百分比）；<br>2. `CheckTechDrawer` 窄列弹窗内零横向爆表；<br>3. 所有文件通过 `pnpm check:length` |
| **Phase 3（全仓收口与门禁挂载）** | 1. 清理 `config-base.css` 顶层裸标签选择器，在 `/config` 与 `/view` 复用 `AppTopbar`、`CollapsibleSection`、`DataTable`；<br>2. 编写 `scripts/check-ui-hygiene.ts` 并接入 `lefthook.yml` `pre-commit` | `scripts/check-ui-hygiene.ts`<br>`lefthook.yml`、`package.json`<br>`src/app/config/*`、`src/app/view/*` | 1. `pnpm check:ui` 全仓零告警通过；<br>2. `pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm build` 全绿 |
