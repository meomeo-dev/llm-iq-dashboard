# 模型指纹页（`/fingerprint`）信息架构、UX 事故溯源与存量短板审计报告

## 1. 审计结论总览

针对“当前 Web 开发是否有设计系统、组件模块是否真有规划设计”的核查结论如下：

1. **缺乏前置的信息架构（IA）与交互契约规划**：`/fingerprint` 与 `/config#model-fingerprint` 的开发过程没有前置页面级线框图、用户任务流拆解与组件复用契约，采取了从后端 TypeScript 类型与磁盘 JSON Schema 直接映射为前端 DOM 节点的开发模式（Schema-Driven UI，而非 User-Task-Driven UI）。
2. **缺乏跨页面的应用外壳（App Shell）与基础 UI 原语层**：仓库虽在 `src/app/globals.css` 中定义了 11 个基础色值与少量主看板几何常量，但没有提炼跨页面共用的顶栏（Header）、按钮（Button）、徽章（Badge）、数据表（DataTable）、侧边抽屉（SideDrawer）、内嵌折叠面板（Collapsible）与状态横幅（Banner）。当开发 `/fingerprint` 新路由时，编码代理退化为手写裸 HTML 标签 + 局部 `.fp-*` 样式 + `style={{ ... }}` 内联样式。
3. **集中爆发 8 起 UX 事故且仍存留 3 处结构性短板**：上述两点根因直接导致 `/fingerprint` 初版（commit `f4b3d0e`）上线后集中出现 8 起典型交互与视觉缺陷。尽管后续通过 commit `29f29d4` 及工作区补丁修复了主干流程，但在 `FingerprintSampleDrawer.tsx`、`ModelFingerprintSection.tsx` 与 `FingerprintCheckSections.tsx` 中仍残留 **52 处静态内联样式**、**死代码 Props**、**表头与单元格数据错位**以及**双处样本量配置冲突**等未收敛问题。

---

## 2. 为什么开发 `/fingerprint` 时集中爆发 8 起 UX 事故？——从代码与流程倒推根因

### 2.1 根因一：缺乏页面级与组件级 UX 规划前置（Database / Schema-Driven UI）

对比后端核心模型（`src/core/model-fingerprint/types.ts`、`src/core/model-fingerprint/plan.ts`）与前端初版实现（commit `f4b3d0e`），可以看到前端界面几乎是后端数据结构的 1:1 机械投影：

| 后端数据结构 / CLI 接口 | 初版前端机械映射实现（commit `f4b3d0e`） | 违背的真实用户任务流（User Task） |
| :--- | :--- | :--- |
| `FingerprintCheckRecord`（含 `selfSim`、`selfLowerBound`、`ranking`、`comparisons`、`probeScores`、`probeAttempts`） | `FingerprintCheckDetail.tsx` 直接平铺渲染 4 张卡片/宽表：`CheckSummaryMetrics` + `ProbeBreakdownTable` + `CandidateComparisonTable`（7 列浮点数）+ `CheckProbeAttemptsSection` | 用户首屏只需快速判断“当前渠道是否一致、若不一致最像哪个替身模型、哪几个探针异常”；底层 JSD 交叉矩阵与原始响应文本属于低频排查数据，平铺展示造成严重的信息过载。 |
| 磁盘样本路径 `<cli>-<effort>/<model>/<probe>.json`（无 `profile` 维度） | `FingerprintMatrix.tsx` 的「补齐全部」与单行「补齐模型」按钮不带任何 `profile` 选择能力，直接触发 `onRequestFillPlan({ cli, model })` | 用户在未登录官方 CLI 账号、但已配置官方/高可信 API Profile 的机器上无法采集基准样本。存储路径不区分 Profile 不代表采集动作不需要指定 Profile。 |
| 单目标 CLI 命令 `fingerprint:check --cli <cli> --model <model>` | `src/app/api/fingerprint/route.ts` 的 `externalRunner()` 分支直接取 `validated[0]!` 单条转发；本地分支仅在 `i === 0` 时触发 `onStarted` | Web 端 `FingerprintCheckPanel.tsx` 允许用户勾选多个模型 × 多个 Profile 发起批量核验，前后端未事先对齐“批次作业（Batch Job）”契约，导致多任务被静默截断。 |
| `ModelFingerprintConfig.references` 数组字段 | `ModelFingerprintSection.tsx` 底部单列一个手工增删 `cli + model` 的 `FingerprintReferencesEditor` 表单 | 用户已经在 `/config#matrix` 维护了被测模型矩阵、在 `/config#profiles` 维护了上游渠道，再维护第二套独立的 `references` 列表造成配置割裂与重复劳动。 |

#### 8 起典型 UX 事故的代码级溯源清单

1. **多任务被静默截断成单任务**
   - **发生机制**：前端 `FingerprintCheckPanel.tsx` 复用了主看板「跑一次」的多选矩阵，生成 `drafts: CheckTargetDraft[]`，但在 `src/app/fingerprint/FingerprintDashboard.tsx:128-130` 构造请求体时将 `...first`（首条记录）与 `targets: drafts` 混装；初版 `src/app/api/fingerprint/route.ts` 在 `handleCheckPost` 的 `externalRunner()` 分支写了 `startViaRunner("fingerprint-check", validated[0]!, who)`，直接丢弃 `validated.slice(1)`；而在本地执行分支中则用 `for` 循环逐条串行调用单任务 `executeFingerprintCheck`，导致每次调用生成孤立的 `jobId`，`RunStatus` 进度条只追踪第一个模型。
   - **修复落点**：在 `src/app/api/fingerprint/route.ts:416-441` 与 `src/bin/runner.ts:172-189` 引入 `executeFingerprintCheckBatch`，将 `targets: validated` 作为单一批次作业执行。
2. **基准采样（Matrix Fill）选不了 Profile**
   - **发生机制**：初版 `FingerprintMatrix.tsx`（commit `f4b3d0e`）完全没有接收 `profiles` 数据，也无渠道选择器。
   - **修复落点**：在 `src/app/fingerprint/FingerprintDashboard.tsx:44-46` 新增 `fillProfiles` 状态，在 `src/app/fingerprint/FingerprintMatrix.tsx:175-229`（`FillPlanPreviewBox`）与 `src/app/fingerprint/FingerprintMatrixHead.tsx:56-91`（`FillProfileSelect`）补入按 CLI 分组的 Profile 下拉框，并在 `src/app/api/fingerprint/route.ts:313-334` 增加 `profilesByCli` 解析与 `validateProfileLaunch` 校验。
3. **「跑一次」与被测矩阵 / Profile 不对齐**
   - **发生机制**：初版 `buildCheckTargetsView`（`f4b3d0e`）未传入 `profiles`，未按 `isProfileApplicableToTarget`（校验 `profile.cli` 与 `profile.models` 白名单）过滤可用渠道，也未将尚无可用基准样本的模型拆出 `unreadyModels` 提示，导致预估调用次数与实际可执行目标脱节。
   - **修复落点**：在 `src/app/fingerprint/fingerprint-check-model.ts:87-175` 与 `250-312` 补齐目标与 Profile 的交叉过滤及调用次数预估。
4. **主看板（`/`）与指纹页（`/fingerprint`）两套完全割裂的 UX**
   - **发生机制**：初版 `/fingerprint`（commit `f4b3d0e` 的 `FingerprintCheckSections.tsx:100-148`）将历史核验记录渲染为一排水平换行的 `.fp-tab` 按钮，点击切换下方单张详情卡，与主看板的“24 小时时间轴泳道 + 文件夹卡片 + 多渠道并排对比模态窗”完全割裂。
   - **修复落点**：新增 `src/app/fingerprint/FingerprintCheckTimeline.tsx:91-164`、`FingerprintCheckTile.tsx:54-101` 与 `FingerprintCheckModal.tsx:28-135`，复用主看板的 `TimelineAxis`、`layoutColumns` 与 `.profile-matrix` 多列对比布局。
5. **泳道表头多余的「跑一次」与缺失的日历控件**
   - **发生机制**：在引入泳道视图时，因缺乏统一的看板头部规范，未在 `CheckBoardHead` 中挂载日期选单 `Calendar`，且「跑一次」入口位置摇摆。
   - **修复落点**：commit `29f29d4` 将 `FingerprintCheckPanel` 作为下拉菜单固定在页面顶栏 `FingerprintHeader` 的 `RunStatus` 左侧（`src/app/fingerprint/FingerprintDashboard.tsx:188-202`），并在 `src/app/fingerprint/FingerprintCheckTimeline.tsx:166-218`（`CheckBoardHead`）接入 `Calendar` 组件。
6. **空状态缺乏上下文引导**
   - **发生机制**：初版在无核验记录时仅输出静态文本 `fp.check.noChecksYet`，用户首次进入页面面对空白区域不知应先去采集基准样本还是直接点核验。
   - **修复落点**：在 `src/app/fingerprint/FingerprintCheckSections.tsx:104-155`（`CheckEmptyDay`）拆分为三态引导：① 无基准样本时提供跳转「基准样本矩阵」按钮；② 有基准无核验时提供打开「▶ 跑一次」按钮；③ 当天无记录但历史有记录时提供跳转最近日期按钮。
7. **SSR Hydration 报错**
   - **发生机制**：在组件初始渲染阶段直接使用客户端时钟 `new Date()` 计算 `todayKey` 或同步读取 `window.localStorage`，导致服务端 SSR 产出的 HTML 与客户端 Hydration 首次渲染不一致。
   - **修复落点**：在 `src/app/fingerprint/FingerprintCheckTimeline.tsx:33, 42, 267-275` 中使用初始返回 `null` 的 `useNowTick()`，并在 `src/app/fingerprint/FingerprintCheckPanel.tsx:91-106` 中将 `readStoredCheckSelection()` 与 `readStoredCheckProfiles()` 延后至 `useEffect` 执行。
8. **详情弹窗信息过载、大红大绿配色与表格列文字溢出**
   - **发生机制**：初版弹窗无信息层级，所有统计表全部展开，且矩阵表未做列宽约束与 sticky 固定。
   - **修复落点**：在 `src/app/fingerprint/FingerprintCheckDetail.tsx:20-34` 与 `fingerprint-check-modal.css:32-270` 重构为“结论条 + 候选排行条 + 6 探针宫格 + 默认折叠技术抽屉（`CheckTechDrawer`）”四段式结构，仅结论条保留 3px 左边框语义色；在 `src/app/fingerprint/fingerprint-matrix.css:39-89` 为模型列（200px）与 CLI 列（148px）增加 `position: sticky` 与 `text-overflow: ellipsis`。

---

### 2.2 根因二：缺乏共享组件原语与布局外壳（No App Shell / Shared Primitives）

全仓 4 个主要路由各自实现了互不相干的顶栏与容器结构，没有任何共享的页面外壳（App Shell）：

| 页面路由 | 顶栏组件与文件位置 | 顶栏根类名与高度/样式特征 | 暴露的一致性缺陷 |
| :--- | :--- | :--- | :--- |
| `/`（主看板） | `Toolbar` (`src/app/components/toolbar/Toolbar.tsx:68-106`) | `<header className="toolbar">`，高度 `52px`，圆角 `12px`，`position: sticky`，含品牌标识、月历、筛选、时钟/时区切换、SVG 图标入口 | 功能最全，但与主看板强耦合（Props 强依赖 `DashboardCard[]` 与 `HiddenFilters`），无法被其他页面复用。 |
| `/fingerprint`（模型指纹） | `FingerprintHeader` (`src/app/fingerprint/FingerprintDashboard.tsx:245-280`) | `<header className="fp-header">`，无背景框，底边框分隔，左侧 `h1` + `p` 副标题，右侧纯文本链接 `.fp-nav-link` | **缺失时区切换器（`TimeZoneMenu`）**：页面虽然通过 `useStoredTimeZone()`（第 `175` 行）渲染 24 小时泳道，但顶栏根本没有时区切换菜单，用户必须退回 `/` 改时区；无品牌标识；导航退化为文字框。 |
| `/config`（配置页） | `ConfigPageHeader` (`src/app/config/ConfigPageHeader.tsx:6-23`) | `<header className="masthead">`，将 `<Link className="nav-link">` 和 `<LanguageSwitch />` 直接嵌在 `<h1>` 标签内部 | 标题与操作按钮混写在同一 `<h1>` 行盒内，无 `RunStatus` 运行状态指示。 |
| `/view/[runId]/[file]`（作品页） | `ArtViewerHead` (`src/app/view/ArtViewerHead.tsx:28-94`) | `<header className="viewer-head">`，自定义 `.viewer-actions` 导航区 | 独立一套顶栏布局，无返回主看板或配置页的标准导航槽位。 |

此外，由于 `src/app/components/` 下只有业务功能模块（`card/`, `cli-status/`, `dashboard/`, `export/`, `menu/`, `model-modal/`, `profile/`, `run-control/`, `run-status/`, `timeline/`, `toolbar/`），**不存在 `src/app/components/ui/` 基础原语目录**：

- `src/app/fingerprint/fingerprint.css:2-9` 被迫通过 8 条跨目录 `@import` 拼凑样式：
  ```css
  @import "../components/toolbar/toolbar-elements.css";
  @import "../components/menu/menu.css";
  @import "../components/run-status/run-status.css";
  @import "../components/run-control/run-control.css";
  @import "../components/profile/profile.css";
  ```
- 初版 `fingerprint.css`（commit `f4b3d0e` 第 2 行）甚至直接 `@import "../config/config-base.css"`，而 `src/app/config/config-base.css:51-122` 中定义了无类名前缀的全局 HTML 元素选择器（`label`, `input[type="text"]`, `select`, `textarea`, `button`）。移除该引入后，为了给页内按钮补齐样式，`src/app/fingerprint/fingerprint-matrix.css:164-202` 又手写了如下脆弱的后代排除选择器：
  ```css
  .fp-card button:not(.fp-cell-btn):not(.fp-tab),
  .fp-drawer button,
  .fp-job-banner button { ... }
  ```

---

## 3. 当前 `/fingerprint` 与 `/config#model-fingerprint` 仍存留的 UX 与代码短板

对当前工作区代码进行逐行扫描，`src/app/fingerprint/*.tsx` 中仍存在 **42 处** `style={{ ... }}`，`src/app/config/ModelFingerprintSection.tsx` 中存在 **16 处** `style={{ ... }}`（合计 **58 处**，其中仅 **6 处**为动态坐标/百分比/颜色绑定，其余 **52 处**均为静态布局、字号与颜色硬编码）。以下三个模块的短板最为突出：

### 3.1 `FingerprintSampleDrawer.tsx`：基准样本抽屉仍处于未打磨的原始状态

文件位置：`src/app/fingerprint/FingerprintSampleDrawer.tsx`（共 210 行）及配套样式 `src/app/fingerprint/fingerprint.css:155-200`。

1. **死代码 Props 与断裂的「补齐此探针」交互链路**：
   - 在 `FingerprintSampleDrawer.tsx:16-29` 的 `FingerprintSampleDrawerProps` 接口中定义了：
     ```tsx
     profiles?: readonly FingerprintProfileSummary[];
     selectedProfile?: string;
     onChangeProfile?: (profile: string) => void;
     ```
   - 但在组件函数签名（第 `31-41` 行）中，这 3 个属性**完全未被解构使用**，且 `FingerprintDashboard.tsx:224-238` 调用该组件时也未传入这 3 个属性。
   - **交互后果**：用户在抽屉内查看某个探针缺样本，点击第 `127-129` 行的「补齐此探针」按钮（`onFillProbe`）时，`FingerprintDashboard.tsx:228-235` 执行的是：先强行关闭抽屉（`ctrl.setDrawerState(null)`），再在主页面矩阵上方弹出 `FillPlanPreviewBox` 横幅让用户选 Profile 并二次点击「确认采集」。用户在侧边抽屉里发起的局部动作，却导致抽屉本身消失、焦点丢失并跳回背景主表二次确认。
2. **缺失键盘 `Escape` 关闭、背景滚动锁定与无障碍语义**：
   - 对比 `FingerprintCheckModal.tsx:41, 56-58` 使用了 `useModalBehavior(onClose)` 并声明了 `role="dialog" aria-modal="true"`，`FingerprintSampleDrawer.tsx:46-47` 仅编写了：
     ```tsx
     <div className="fp-drawer-backdrop" onClick={onClose}>
       <aside className="fp-drawer" onClick={(e) => e.stopPropagation()}>
     ```
   - 抽屉打开时**按 `Esc` 键无任何反应**，背景页面仍可滚动，且无 `role="dialog"` 与焦点接管。
3. **10 处静态内联样式代替 CSS 类**：
   - 分布在 `FingerprintSampleDrawer.tsx` 第 `75, 77, 108, 114, 118, 136, 166, 174, 197, 201` 行。例如第 `108` 行与第 `166` 行复用了原本为按钮组设计的 `.fp-btn-row`，再用 `style={{ justifyContent: "space-between" }}` 强行改成两端对齐工具栏；第 `136` 行重置确认提示直接用 `style={{ fontSize: "12px", color: "var(--warn)" }}` 挤在同一行按钮组里。
4. **`AttemptCard` 原始采样列表信息密度失控、无高度限制与筛选**：
   - 第 `167-187` 行将 `reqId`、`outcome` 徽章、`profile` 徽章、`excluded` 徽章、`codecId`、`valuesPerCall`、`sampleSelfSim`、`activeWindowCount` 共 **8 项元数据**全部塞进同一个 `.fp-btn-row` flex 容器内，中间用 `·` 拼接在 `11px` 的内联样式 `<span>` 中，在 `680px` 宽的抽屉内发生不规则折行。
   - 第 `204` 行 `<pre className="fp-pre">{attempt.values.join("\n")}</pre>` 在 `src/app/fingerprint/fingerprint.css:190-200` 中未设置 `max-height` 与 `overflow-y: auto`。当探针目标样本数为 100~160、包含数十条采样卡片时，抽屉滚动条变得极长，且没有“全部 / 仅看有效 / 仅看已拒绝或已排除”的快速过滤或折叠机制。

### 3.2 `ModelFingerprintSection.tsx`：配置页卡片与 `/fingerprint` 控制台职责边界模糊、存在配置失效陷阱

文件位置：`src/app/config/ModelFingerprintSection.tsx`（共 294 行）。

1. **全局样本量 `samplesPerProbe` 与逐探针样本量 `samplesByProbe` 并列暴露，导致顶层输入框形同虚设**：
   - `FingerprintNumericFields`（第 `180-186` 行）渲染了“每探针目标样本数（`samplesPerProbe`）”输入框；紧接着 `FingerprintProbeTargetsEditor`（第 `224-258` 行）又渲染了全部 6 个探针（`uuid`, `number`, `seed`, `palette`, `words-en`, `words-zh`）各自的样本数输入框。
   - 根据 `src/core/model-fingerprint/types.ts` 的 `resolveProbeTargetSamples(probeId, config)` 逻辑，只要 `config.samplesByProbe[probeId]` 有值，就优先使用 `samplesByProbe[probeId]`，忽略 `config.samplesPerProbe`。
   - 而 `DEFAULT_MODEL_FINGERPRINT_CONFIG` 默认已为全部 6 个探针填充了 `samplesByProbe`（`160, 120, 100, 100, 100, 100`）。当用户在第 `180` 行修改 `samplesPerProbe` 时，`onChange`（第 `182-185` 行）只更新了 `value.samplesPerProbe`，**完全不会改动已存在的 `value.samplesByProbe`**。结果是用户在界面上修改了“每探针目标样本数”，下方 6 个探针的目标值和实际运行行为没有任何变化。
2. **16 处 `style={{ ... }}` 内联样式，未建立组件级样式表**：
   - `src/app/config/` 目录下为各个区块都拆分了独立 CSS（如 `config-schedule.css`, `config-timeout.css`, `config-profiles.css`, `config-data-repo.css`），唯独 `ModelFingerprintSection.tsx` 没有配套 CSS，在第 `80, 91, 92, 94-98, 128, 129, 165-170, 172, 225, 226, 227, 238-243, 271-274, 279, 283` 行手写了 16 处内联样式（包括 3 处 `display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(...))"` 与 2 处 `borderTop: "1px dashed var(--border)"`）。
3. **与 `/fingerprint` 控制台的职责边界缺乏联动**：
   - `ModelFingerprintSection.tsx:261-293`（`FingerprintSharedSourcesSummary`）在配置页底部渲染了一排只读的 `.fp-model-chip`，仅告知“当前共 N 个模型”，但不展示哪些模型已采集基准、哪些未就绪；而用户在 `/fingerprint` 矩阵页想调整探针样本数或启用/停用某个探针时，又必须离开 `/fingerprint` 跳回 `/config#model-fingerprint`。两者应当明确边界：**`/config#model-fingerprint` 只管全局功能开关与算法标定参数（收敛目标、并发度、单探针目标数），不重复堆砌只读模型芯片；或者在 `/fingerprint` 矩阵表头提供直达探针参数抽屉的快捷编辑能力**。

### 3.3 `FingerprintCheckSections.tsx` 中的 `CheckProbeAttemptsSection`：表头与数据列张冠李戴、中英混杂

文件位置：`src/app/fingerprint/FingerprintCheckSections.tsx:187-238`（被 `FingerprintCheckTechDrawer.tsx:64` 调用）。

1. **表格第 3、4 列“表头文案”与“单元格实际渲染字段”严重错位**：
   - 查看 `src/app/fingerprint/FingerprintCheckSections.tsx:215-232`：
     ```tsx
     <thead>
       <tr>
         <th>{fp.check.colProbe}</th>
         <th>reqId</th>
         <th>{fp.drawer.codecLabel}</th>
         <th>{fp.drawer.acceptedValuesLabel}</th>
       </tr>
     </thead>
     <tbody>
       {attemptEntries.map(({ probeId, att }) => (
         <tr key={`${probeId}:${att.reqId}`}>
           <td><code>{probeId}</code></td>
           <td><code>{att.reqId}</code></td>
           <td><code>{fp.outcomes[att.outcome]}</code></td>
           <td><code style={{ wordBreak: "break-all" }}>{att.rawText.trim()}</code></td>
         </tr>
       ))}
     </tbody>
     ```
   - **第 2 列**：表头硬编码英文字符串 `reqId`，未使用双语字典。
   - **第 3 列**：表头使用 `{fp.drawer.codecLabel}`（中文为“解码器”，英文为“Codec”），但单元格渲染的却是 `fp.outcomes[att.outcome]`（“有效 / 格式拒绝 / 空响应”等状态词），真正的 `att.codecId` 根本没渲染。
   - **第 4 列**：表头使用 `{fp.drawer.acceptedValuesLabel}`（中文为“提取有效值”，英文为“Accepted values”），但单元格渲染的却是 `att.rawText.trim()`（模型原始输出全文，即使在 `outcome !== "ok"` 解析失败时也会原样塞入“提取有效值”列）。
2. **异常摘要行硬编码英文文本，破坏双语规范**：
   - 在 `src/app/fingerprint/FingerprintCheckSections.tsx:195-210` 中：
     ```tsx
     {record.failedProbes.length > 0 && (
       <span>· failed: {record.failedProbes.map((f) => `${f.probe}(${f.lastReason})`).join(", ")} </span>
     )}
     {record.uncomparedModels.length > 0 && (
       <span>· uncompared: {record.uncomparedModels.map((u) => u.model).join(", ")}</span>
     )}
     ```
   - `· failed:` 与 `· uncompared:` 均为未走 `src/i18n/messages/fingerprint.ts` 的硬编码英文，且 `f.lastReason` 未映射 `fp.rejectionReasons`。
3. **在窄列模态窗中混用 `.fp-matrix-table` 导致横向溢出**：
   - `CheckTechDrawer` 中的 3 张表（`ProbeBreakdownTable`、`CandidateComparisonTable`、`CheckProbeAttemptsSection`）全部直接套用了 `.fp-matrix-table` 类，而 `src/app/fingerprint/fingerprint-matrix.css:9-15` 为 `.fp-matrix-table` 强制设置了 **`min-width: 980px`**！
   - 当用户在多渠道对比模态窗（`CheckProfileMatrix`，每列宽度仅 `310px~356px`）或单渠道模态窗（宽度 `680px`）中点开 `CheckTechDrawer` 时，内部 3 张表格全部因为 `min-width: 980px` 产生剧烈的横向滚动条，哪怕只有 2 列模型或 4 列采样记录也会被强行撑到 `980px` 宽。
