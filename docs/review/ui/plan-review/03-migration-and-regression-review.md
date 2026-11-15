# 方案审查报告 03：迁移风险、回归影响面与遗漏项核查审计

- **审查对象**：[`docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md`](../DESIGN_SYSTEM_AND_COMPONENT_PLAN.md)（重点针对 **§四 模块边界重整**、**§六 分阶段实施路线图** 及 **12 份审查报告的全量缺陷覆盖率**）
- **对照基线**：`docs/review/ui/` 下全部 12 份审查报告、`test/app/**`（14 个静态 HTML 快照测试文件 + `test/fixtures/markup/` 下 67 个 `.html` 快照夹具）、[`test/core/model-fingerprint/ui-model.test.ts`](../../../../test/core/model-fingerprint/ui-model.test.ts)、[`src/app/components/export/`](../../../../src/app/components/export/export-image.ts)、[`scripts/showcase-smoke/assertions.ts`](../../../../scripts/showcase-smoke/assertions.ts) 及 `scripts/diagnostics/`
- **总体评估**：**有条件通过（检出 21 项审查报告遗漏项、3 类高危测试/冒烟回归阻断项，需修订 8 项 Must-Fix 与 6 项 Should-Fix）**。方案主干架构清晰，但遗漏了客户端状态/异常韧性与 `docs/ui/` 失真文档收口，且对存量 67 个逐字节 HTML 快照夹具、`ui-model.test.ts` 死属性断言及 `showcase:smoke` 的回归风险缺乏防护策略。

---

## 一、 12 份审查报告全量覆盖率对账与 21 项遗漏清单（Completeness Audit）

逐条对照 6 个子代理产出的 12 份审查报告，初版 [`DESIGN_SYSTEM_AND_COMPONENT_PLAN.md`](../DESIGN_SYSTEM_AND_COMPONENT_PLAN.md) 存在以下 **4 大类、21 项未纳入或覆盖不全的缺陷**：

### 1.1 客户端状态管理、异常处理与只读权限边界遗漏（源自 [`pelican-ux-and-interaction/02-interaction-and-state-audit.md`](../pelican-ux-and-interaction/02-interaction-and-state-audit.md)）

| 序号 | 遗漏缺陷与精确代码位置 | 故障表现 | 应补入方案的修复动作 |
| :--- | :--- | :--- | :--- |
| **1** | **`use-stored-time-zone.ts:16,20` 读写 `localStorage` 无 `try/catch` 保护**<br>[`use-stored-time-zone.ts`](../../../../src/app/components/toolbar/use-stored-time-zone.ts#L16-L20) | Safari 无痕模式或禁用存储时直接抛出未捕获 `DOMException` 导致整页白屏；且 [`FingerprintDashboard.tsx:175-176`](../../../../src/app/fingerprint/FingerprintDashboard.tsx#L175-L176) 水合前硬编码回退 `"Asia/Shanghai"` 而非服务端 `defaultTimeZone` | 封装共享安全存储工具 `safeLocalStorageGet` / `safeLocalStorageSet`（内置 `try/catch`）；`/fingerprint` 水合前使用服务端传入的 `defaultTimeZone` |
| **2** | **`DataRepoPanel.tsx:191` 未绑定 `dismissResult` / `dismissError`**<br>[`DataRepoPanel.tsx`](../../../../src/app/config/DataRepoPanel.tsx#L191) | `useDataRepoActions` 已导出关闭回调，但组件未解构传入，导致数据仓同步结果与错误横幅一旦出现永远无法关闭 | 接入 `ui/AlertBanner` 并绑定 `onDismiss={dismissResult}` / `onDismiss={dismissError}` |
| **3** | **`use-device-panel.ts:12-15` 初次 `fetch("/api/session")` 无 `.catch()` 且未检查 `!res.ok`**<br>[`use-device-panel.ts`](../../../../src/app/config/use-device-panel.ts#L12-L15) | 网络异常或接口非 200 时 Promise 拒绝未处理，`loading` 状态永远卡死在 `true`（「读取中…」） | 补齐 `.catch()` 与 `!res.ok` 分支，确保 `finally` 复位 `loading = false` 并展示错误横幅 |
| **4** | **`ToolbarCenter.tsx:47` 仅判断 `!remote` 而漏判 `!readonly`**<br>[`ToolbarCenter.tsx`](../../../../src/app/components/toolbar/ToolbarCenter.tsx#L47) | 本地只读展台模式（`PELICAN_READONLY=1`）下仍渲染 `AutoRunToggle`，并触发 [`live-store.ts:84-115`](../../../../src/app/components/live-state/live-store.ts#L84-L115) 轮询 `/api/auto-run` 与建立 `/api/events` SSE 连接 | 改为 `!remote && !readonly` 时才挂载 `AutoRunToggle`；同步清理 `live-store.ts:23` 未使用的 `RECONNECT_MS` 死常量与 `L97` 硬编码中文报错 |
| **5** | **`/fingerprint` 顶栏缺失 `TimeZoneMenu` 时区切换器**<br>[`FingerprintDashboard.tsx:266-300`](../../../../src/app/fingerprint/FingerprintDashboard.tsx#L266-L300) | 指纹页虽然读取 `pelican.timeZone`，但顶栏未挂载 `TimeZoneMenu`，用户无法在 `/fingerprint` 页切换时区 | 在 Phase 2 将 `TimeZoneMenu`（及 `LiveClock`）挂入 `/fingerprint` 顶栏 `actionsSlot` |
| **6** | **`DeviceTable.tsx` / `use-device-panel.ts:29` 仍使用原生阻塞式 `window.confirm`**<br>[`use-device-panel.ts`](../../../../src/app/config/use-device-panel.ts#L29) | 方案 §3.1 原语 2 提到用 `ConfirmButton` 统一二次确认，但未将 `DeviceTable`（移除设备）、`ProfileCard`（删除上游）、`ProfileCredentialField`（删除密钥）列入具体改造项 | 在 Phase 3 明确将上述 3 处危险操作及 `use-device-panel.ts:29` 的 `window.confirm` 全部替换为 `ui/ConfirmButton` |
| **7** | **`use-run-once-state.ts:130-136` 存在 `500ms` 延迟关闭期间 `busy=false` 连点重复触发漏洞**<br>[`use-run-once-state.ts`](../../../../src/app/components/run-control/use-run-once-state.ts#L130-L136) | 发起成功后 `setBusy(false)` 在 `finally` 立即执行，而面板 `500ms` 后才关闭，期间再次点击会重复发起轮次 | 成功分支保持 `busy = true` 直至 `setTimeout` 关闭面板后再复位 |
| **8** | **`RunBlock.tsx:73` 筛选结果为空时无一键「重置筛选」按钮，且跨页跳转丢失 `?day=`**<br>[`RunBlock.tsx`](../../../../src/app/components/dashboard/RunBlock.tsx#L73) | 筛选导致全天无卡片时只显示纯文本，用户需进多层下拉菜单逐项取消勾选 | `RunBlock` 接入 `ui/EmptyState`，在 `action` 插槽提供一键「重置筛选」按钮 |
| **9** | **`/fingerprint` 静默吞掉网络刷新与抽屉加载错误**<br>[`FingerprintDashboard.tsx:58-72`](../../../../src/app/fingerprint/FingerprintDashboard.tsx#L58-L72) | `refreshAll` 与 `loadDrawerCell` 在 `catch` 中静默忽略异常，用户点击单元格无反应时无任何错误提示 | 捕获异常并写入 `error` 状态，通过顶层 `ui/AlertBanner` 展示 |

### 1.2 模型指纹模块架构与细节遗漏（源自 `fingerprint-*` 6 份报告）

| 序号 | 遗漏缺陷与精确代码位置 | 故障表现 | 应补入方案的修复动作 |
| :--- | :--- | :--- | :--- |
| **10** | **`fingerprint/page.tsx:45-96` 与 `api/fingerprint/route.ts:108-151` 快照构造代码 100% 重复且已发生字段漂移** | `route.ts` 返回了 `activeWork`，而 `page.tsx` 漏掉了 `activeWork`，违反 DRY 原则 | 提取共享服务端加载器 `src/core/model-fingerprint/snapshot-loader.ts`（或 `src/app/fingerprint/fingerprint-snapshot.ts`），供 SSR 页面与 API 路由共同调用 |
| **11** | **`fingerprint-model.ts:311-395` 混入 4 个异步 `fetch` 与 DOM `<a>` 下载副作用，且 `fingerprint-detail-model.ts` 反向依赖 `fingerprint-timeline-model.ts`** | 纯视图模型文件混入网络 I/O 与 DOM 操作；详情模型反向 import 泳道模型导致层级倒置 | 将 `normalizeCheckProfile`、`resolveActiveCheckView`、`isRecordCheckPassed`、`orderCheckRecordsByProfile` 下沉至 `fingerprint-model.ts`；将网络请求与导入导出副作用抽离为 `use-fingerprint-bundle.ts` |
| **12** | **`FingerprintCheckPanel.tsx:199-209` 复制 `RunOnceHeadBar` 11 行 JSX，且 `fingerprint-check-model.ts` 克隆 `run-once-profiles.ts` 5 个函数** | 仅因右列标题为「探针」而非「题目」就复制整个头部；上游选择计算逻辑双份维护 | 为 `RunOnceHeadBar` 增加可选 `secondColumnTitle?: string`；将 `supportsProfiles`、`shorten`、`profileChoices`、`startMode` 提取为 `run-control` 与 `fingerprint` 共享的纯函数 |
| **13** | **停止指纹作业存在两套分裂的后端取消入口** | 顶栏 `RunStatus` 调 `POST /api/run/cancel`，而面板内 `CheckLauncherFooter` 调 `POST /api/fingerprint` (`{ action: "cancel" }`) | 统一使用带二次确认的 `ConfirmButton` 并收敛取消调用逻辑 |
| **14** | **`FingerprintSampleDrawer.tsx` 内 `AttemptCard` 8 项元数据拥挤折行且无状态筛选胶囊** | 抽屉内 50 条采样记录无「全部 / 有效 / 异常与已排除」快速筛选，单卡 8 个散装 `<span>` 视觉杂乱 | 重构 `AttemptCard` 为两行结构（头部状态胶囊+序号+耗时，副行提取数量/拒绝原因），并在抽屉头部增加状态筛选胶囊条 |
| **15** | **`/fingerprint` 同页两个 Tab 的面板外壳样式不一致，且残留 `.verdict-*` 幽灵类與 `.fp-form-grid` 死规则** | 「发起渠道核验」用 `.board-panel`（`14px` 圆角，`18px` 标题），「基准样本矩阵」用 `.fp-card`（`10px` 圆角，`16px` 标题），切换 Tab 时外框跳变 | 统一两个 Tab 的主面板容器样式；清理 [`FingerprintCheckTile.tsx:30,68`](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L30) 未定义的 `.verdict-*` 类名与 [`fingerprint.css:202-206`](../../../../src/app/fingerprint/fingerprint.css#L202-L206) 未引用的 `.fp-form-grid` |

### 1.3 主看板与配置页 CSS 跨文件撕裂与冗余包装壳遗漏（源自 [`pelican-component-architecture/02-line-limit-driven-fragmentation.md`](../pelican-component-architecture/02-line-limit-driven-fragmentation.md)）

| 序号 | 遗漏缺陷与精确代码位置 | 故障表现 | 应补入方案的修复动作 |
| :--- | :--- | :--- | :--- |
| **16** | **除 `run-control-stop.css` 外，还有 5 处把同一选择器的桌面规则与 `@media`（或同组件伪类）硬切在两个 CSS 文件的反模式** | 1. `run-status-panel.css` 与 `run-status-calls.css` 腰斩 `.run-dot` 与 `.run-panel`<br>2. `cards-base.css` 与 `cards-footer.css` 分隔 `.card-grid`<br>3. `timeline-board.css` 与 `timeline-track.css` 分隔 `.board-panel` / `.row-label`<br>4. `model-modal-dialog.css` 与 `model-modal-content.css` 分隔 `.modal-head`<br>5. `toolbar-responsive.css:72-86` 跨目录覆写 `run-control` 的 `.auto-run` | 在 Phase 3 按「同一选择器及其状态修饰符、`@media` 必须驻留同一 CSS 文件」原则归位上述 5 处样式 |
| **17** | **`ConfigSectionShell.tsx` 8 个零逻辑透传包装函数与 `DashboardToolbar.tsx` 薄包装壳** | [`ConfigSectionShell.tsx`](../../../../src/app/config/ConfigSectionShell.tsx) 包含 8 个仅做 `<Section id=...>{children}</Section>` 透传的包装组件 | 在 Phase 3 精简无状态透传壳，让 `ConfigEditor` 直接渲染 `<ConfigSection id=... title=...>` |
| **18** | **`ProfileName.tsx:22` 强耦合主看板 `DashboardCard[]` 类型** | 导致 `/fingerprint` 调用 `<ProfileName>` 时每次都要手写 `cards={[]}` 空数组垫片 | 将 `ProfileNameProps.cards` 改为可选 `cards?: readonly DashboardCard[]`（默认 `[]`） |

### 1.4 `docs/ui/` 设计文档失真与技能契约脱节遗漏（源自 [`pelican-design-system/02-design-docs-vs-code-gap.md`](../pelican-design-system/02-design-docs-vs-code-gap.md)）

| 序号 | 遗漏缺陷与精确代码位置 | 故障表现 | 应补入方案的修复动作 |
| :--- | :--- | :--- | :--- |
| **19** | **[`docs/ui/UX_STATE_MAP.md`](../../../ui/UX_STATE_MAP.md) 存在 6 处与代码严重失真的断言** | 漏掉 `/fingerprint` 路由与 6 个弹窗/抽屉、断点表与 CSS 不符、错写 `status-no-svg` 为灰标、错写脚本路径为 `scripts/ux_state_crawler.py` | 在 Phase 3 同步重写更新 `docs/ui/UX_STATE_MAP.md`，对齐 3 个标准断点（`640px/900px/1200px`）与全量 5 个路由状态 |
| **20** | **[`docs/ui/README.md`](../../../ui/README.md) 与 [`dial-design-brief.md`](../../../ui/dashboard/dial-design-brief.md) 过期失真** | `docs/ui/` 下无 `design-system.md`，仅链接到已废弃的圆形玫瑰图表盘草案 | 基于落地的 `src/app/tokens.css` 与 `src/app/components/ui/` 生成正式的 `docs/ui/dashboard/design-system.md`，并在 `dial-design-brief.md` 顶部标注 `Status: Superseded` |
| **21** | **[`docs/ui/ux_coverage_report.json`](../../../ui/ux_coverage_report.json) 含本机私有绝对路径 `~/.gemini/...`** | 违反仓库脱敏规范且记录着过期的 `STATE_PAIR_PAGE: FAIL` | 将报告中的截图路径改为相对路径或移出版本库，并在修复 `/pair` 后更新覆盖报告 |

---

## 二、 存量测试、导出管线与诊断脚本的回归风险评估（Regression Impact Surface）

### 2.1 高危阻断项 1：14 个静态 HTML 快照测试与 67 个 `.html` 黄金夹具

经检索 `test/app/`，仓库共有 **14 个测试文件**使用 `ReactDOMServer.renderToStaticMarkup` 将组件渲染结果与 `test/fixtures/markup/wp-{f,g,h,l,p}/*.html`（共 **67 个 HTML 文件**）做**逐字节严格比对**：
- **`wp-f`（21 个夹具）**：锁死 `PelicanCard`（`.judge-tag`）、`ModelModal`（`.modal-backdrop`, `.modal`, `.standard-tag`）、`RunOnceMenu`（`.run-once-panel`, `.run-once-head-bar`, `.run-once-close`）、`StopRunButton`（`.run-stop`）。
- **`wp-g`（15 个夹具）**：[`targettable-default.html`](../../../../test/fixtures/markup/wp-g/targettable-default.html) 与 [`targettable-no-efforts.html`](../../../../test/fixtures/markup/wp-g/targettable-no-efforts.html) **逐字节锁死了 `<table class="matrix">` 与 `<button type="button" class="danger">`**；[`pairform-signed-in.html`](../../../../test/fixtures/markup/wp-g/pairform-signed-in.html) 与 `pairform-signed-out.html` **逐字节锁死了 `<a class="button" href="/config">` 与 `<div class="actions">`**。
- **`wp-h`（17 个夹具）**：[`art-viewer-full.html`](../../../../test/fixtures/markup/wp-h/art-viewer-full.html) **逐字节锁死了 `<header class="viewer-head">`、`<details class="viewer-drawer viewer-standard">`、`.standard-tag`**。
- **`wp-l`（6 个夹具）与 `wp-p`（6 个夹具）**：锁死 `DataRepoPanel`（`.data-repo-dialog-backdrop`, `.data-repo-health-badge`）与 `DataRepoPipeline`。

**迁移防回归策略**：
1. 统一 `test/app/` 下 14 个快照测试文件的夹具更新入口（目前仅 4 个文件支持 `UPDATE_FIXTURES=1` / `UPDATE_MARKUP_FIXTURES=1`，其余 10 个文件直接调 `assert.strictEqual` 而不支持环境变量更新，建议统一接入 [`test/support/fixtures.ts`](../../../../test/support/fixtures.ts) 的 `expectFixture`）；
2. 在 Phase 3 修改受快照保护的组件后，执行 `UPDATE_FIXTURES=1 pnpm test` 并逐文件运行 `git diff test/fixtures/markup/` 人工审查 DOM 变更。

### 2.2 高危阻断项 2：`test/core/model-fingerprint/ui-model.test.ts` 的 5 处断裂点

在 Phase 2 重构 `/fingerprint` 与 `ModelFingerprintSection.tsx` 时，[`test/core/model-fingerprint/ui-model.test.ts`](../../../../test/core/model-fingerprint/ui-model.test.ts) 存在以下 **5 处硬耦合断言**，若不同步修改将导致 `pnpm lint` 或 `pnpm test` 立即失败：
1. **L402**：`assert.equal(stateWithRelay.panelChoices.length, 2)` —— 方案 §4.1(4) 删除死字段 `CheckSelectionState.panelChoices` 时，必须同步移除或更新 L402 断言；
2. **L421–433**：测试代码向 `<FingerprintCheckPanel>` 传入了 `checks`、`rescoringId`、`onPreviewPlan`、`onRescore` —— 方案 §4.1(4) 从 `FingerprintCheckPanelProps` 删除这些死 Props 时，必须同步清理 L421–433 的传参，否则 `pnpm lint`（`tsc --noEmit` 覆盖 `test/`）直接报 TS2322 错误；
3. **L326–328**：断言 `ModelFingerprintSection` 渲染结果包含 `"#matrix"`、`"#profiles"` 与 `"codex/gpt-5.4"` —— Phase 2 重构 `ModelFingerprintSection.tsx` 时必须保留这两个锚点链接与底部目标模型列表展示；
4. **L437–441**：断言 `FingerprintCheckPanel` 包含 `"run-once-panel"`、`"run-once-head-bar"`、`"run-once-close"`、`"run-once-models"`、`"cli-mark cli-codex"`；
5. **L494–496**：断言 `FingerprintCheckTimeline` 包含 `"folder fp-folder"` 与 `"fp-probe-slot"`。

此外，[`test/app/components/profile/profile-info-card.test.ts:59-60`](../../../../test/app/components/profile/profile-info-card.test.ts#L59-L60) 断言包含 `<span class="profile-card-gone">`：Phase 3 将外层 `.profile-card` 重命名为 `.profile-popover-card` 时，须保留内部子元素 `.profile-card-gone` 类名不变（或同步更新该测试）。

### 2.3 高危阻断项 3：`pnpm showcase:smoke` 对只读模式下 `/pair` 返回 `404` 的硬性契约

审查报告 `pelican-ux-and-interaction/02-interaction-and-state-audit.md` 曾指出只读模式下 `/pair` 返回 `notFound()`（404）而 `/config`、`/fingerprint` 返回 `redirect("/")` 不一致。但核查 [`scripts/showcase-smoke/assertions.ts:110-114`](../../../../scripts/showcase-smoke/assertions.ts#L110-L114)（`assertPairPage404`）证实：**`pnpm showcase:smoke` 明确断言只读展台模式下 `GET /pair` 必须返回 HTTP 404**！
- **结论**：方案必须明确声明**保持只读模式下 `/pair` 调用 `notFound()` 返回 404 的行为不变**，严禁改为 `redirect("/")`。

### 2.4 导出管线（`export/`）、`visual-ruler` 与诊断脚本兼容性核查

1. **SVG/PNG/GIF 导出管线（[`src/app/components/export/export-image.ts:65-81`](../../../../src/app/components/export/export-image.ts#L65-L81)）**：`readPalette()` 读取的 11 个基础颜色变量在 `tokens.css` 中名称与色值 100% 保持不变，导出图像零回归。
2. **`visual-ruler`（[`.agents/skills/visual-ruler/scripts/inject_ruler_overlay.js`](../../../../.agents/skills/visual-ruler/scripts/inject_ruler_overlay.js)）**：基于 HTML 语义标签与几何面积自动探测容器，不依赖特定业务 CSS 类名，零回归。
3. **Playwright 诊断脚本（[`scripts/diagnostics/ux_state_crawler.py`](../../../../scripts/diagnostics/ux_state_crawler.py) 与 [`e2e_devices_test.py`](../../../../scripts/diagnostics/e2e_devices_test.py)）**：脚本硬编码了 `.toolbar`, `.day-panel`, `.filter-panel`, `.run-pill`, `.run-once-panel`, `.folder`, `.modal`, `.modal-close`, `.config`, `.pair-card`, `#pair-code`, `.viewer`, `.viewer-prompt summary`, `.viewer-standard summary` 等选择器。在接入 `ui/*` 原语时，通过 `className` 叠加保留上述宿主语义类名（如 `className="ui-modal modal"`、`className="ui-collapsible viewer-drawer viewer-standard"`），即可保证诊断脚本 100% 零改动通过。

---

## 三、 分阶段实施颗粒度与渐进式门禁评估（Phasing & Progressive Gating）

### 3.1 将 Phase 3 拆分为 Phase 3A 与 Phase 3B，避免单次变更过大

初版方案的 Phase 3 同时包含 4 个路由的组件重构、冲突类名重命名、67 个 HTML 快照更新、全仓 120+ 处色值/字号/圆角 Token 替换以及 `lefthook.yml` 门禁挂载，单阶段改动超过 60 个文件。建议拆分为两个独立可提交、可验收的子阶段：
- **Phase 3A（跨页领域组件去重、`/pair` / `/view` / `/config` 结构修复与冲突类重命名）**：
  - 修复 `/pair` 裸奔控件与幽灵变量、`/view` 顶栏与抽屉高度、`/config` 容器对齐与裸标签剥离；
  - 落地 `StandardCriteriaPanel`、`JudgeStatusBadge`、`profile-selection-store.ts`，重命名 `.matrix`（配置页表格）与 `.profile-popover-card`；
  - 修复 `use-stored-time-zone.ts`、`DataRepoPanel.tsx`、`use-device-panel.ts`、`ToolbarCenter.tsx`、`use-run-once-state.ts` 的状态与异常缺陷；
  - 同步刷新 `test/fixtures/markup/` 快照并通过 `pnpm test && pnpm build`。
- **Phase 3B（全仓 CSS Token 数值收敛、文档同步与 `check-ui-hygiene.ts` 挂钩子）**：
  - 将主看板、配置页、查看页剩余的硬编码色值、非标字号、非标圆角与非标 `@media` 断点收敛至 `tokens.css`，归位 6 处跨文件撕裂的 CSS 规则；
  - 更新 `docs/ui/dashboard/design-system.md`、`docs/ui/UX_STATE_MAP.md`、`docs/ui/README.md`；
  - 将 `pnpm check:ui` 作用域扩展至全仓 `src/app/` 并挂入 `lefthook.yml` `pre-commit`。

### 3.2 `scripts/check-ui-hygiene.ts` 渐进式目录门禁（Progressive Scope）与自身代码长度合规

1. **支持按阶段扩大强制扫描目录**：
   - 在 **Phase 1** 即可上线 `scripts/check-ui-hygiene.ts`（及单元测试 `test/scripts/check-ui-hygiene.test.ts`），初始扫描范围 `ENFORCED_DIRS` 设为 `["src/app/tokens.css", "src/app/components/ui"]`；
   - 在 **Phase 2** 将 `"src/app/fingerprint"` 与 `"src/app/config/ModelFingerprintSection.tsx"`、`"src/app/config/config-fingerprint.css"` 加入 `ENFORCED_DIRS` 并挂入 `lefthook.yml`，防止 Phase 3 施工期间前序已净化模块回退；
   - 在 **Phase 3B** 将 `ENFORCED_DIRS` 切换为全量 `["src/app"]`。
2. **`UI-01` 白名单剔除 `gridTemplateColumns`**：
   - 初版方案 §5.1 将 `gridTemplateColumns` 列入动态内联样式放行白名单。但 [`FingerprintCheckModal.tsx:108`](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L108) 的 `gridTemplateColumns: \`repeat(${records.length}, minmax(310px, 1fr))\`` 正是阻断窄屏 `@media` 响应式覆盖的元凶（正确做法是仅内联传 `--upstream-count: records.length`，在 CSS 中写 `grid-template-columns: repeat(var(--upstream-count), minmax(310px, 1fr))`）。因此 **必须从 `UI-01` 白名单中移除 `gridTemplateColumns`**！
3. **遵守 `config/code-length-policy.yaml` 对 `scripts/` 的限制**：
   - [`config/code-length-policy.yaml:15`](../../../../config/code-length-policy.yaml#L15) 规定 `scripts/**/*.ts` 同样受「文件 ≤ 500 行、单函数 ≤ 50 行」约束。`scripts/check-ui-hygiene.ts` 必须按 `UI-01`～`UI-04` 拆分为职责单一、每个 ≤ 40 行的检查函数（或 `scripts/ui-hygiene/` 子模块）。

---

## 四、 针对 `DESIGN_SYSTEM_AND_COMPONENT_PLAN.md` 的具体修订清单

### Must-Fix（合入方案前必须补齐的 8 项关键修订）

1. **[Must-Fix 1] 在 §4.2 增设「4.4 客户端状态韧性、异步错误处理与只读边界修复」小节**：将 `use-stored-time-zone.ts`（`localStorage` `try/catch` 封装）、`DataRepoPanel.tsx:191`（绑定 `dismissResult`/`dismissError`）、`use-device-panel.ts:12-15`（补齐 `.catch()` 与 `ConfirmButton`）、`ToolbarCenter.tsx:47`（补齐 `!readonly` 守卫）、`use-run-once-state.ts:130`（防连点重复触发）纳入明确改造范围。
2. **[Must-Fix 2] 在 §4.1 补齐 `/fingerprint` 遗漏的 5 项架构与 UX 收口任务**：
   - 顶栏接入 `TimeZoneMenu` 与 `LiveClock`；
   - 提取 `fingerprint/page.tsx` 与 `api/fingerprint/route.ts` 共享的服务端快照构造函数（修复 `page.tsx` 漏传 `activeWork`）；
   - 将 `fingerprint-model.ts` 中的网络/下载副作用抽离为 `use-fingerprint-bundle.ts`，下沉 `fingerprint-detail-model.ts` 依赖的公共函数以消除反向依赖；
   - 为 `RunOnceHeadBar` 增加 `secondColumnTitle?: string` 并提取与 `run-once-profiles.ts` 重复的 5 个上游选择纯函数；
   - 重构 `FingerprintSampleDrawer` 内的 `AttemptCard` 两行布局与状态筛选胶囊，统一两个 Tab 的主面板容器圆角与内边距。
3. **[Must-Fix 3] 从 §5.1 规则 `UI-01` 的内联样式白名单中剔除 `gridTemplateColumns`**：强制通过 `--upstream-count` 等 CSS 变量驱动动态网格列数，恢复 CSS `@media` 对窄屏网格列宽的控制力。
4. **[Must-Fix 4] 在 §六 明确存量测试（67 个 HTML 快照 + `ui-model.test.ts`）与 `showcase:smoke` 的防回归规程**：
   - 明确 Phase 2 同步更新 `test/core/model-fingerprint/ui-model.test.ts` 中对 `panelChoices`（L402）及 `FingerprintCheckPanel` 死 Props（L421–433）的调用，并保留 L326–328、L437–441、L494–496 断言的关键锚点与类名；
   - 明确 Phase 3 通过 `expectFixture`（`UPDATE_FIXTURES=1`）统一刷新并人工审查 `test/fixtures/markup/wp-{f,g,h,l,p}/*.html`；
   - 明确只读模式下 `/pair` 保持 `notFound()`（404）不变，以满足 `scripts/showcase-smoke/assertions.ts:110` 契约。
5. **[Must-Fix 5] 将 §六 的 Phase 3 拆分为 Phase 3A（组件去重、跨页缺陷修复与快照更新）与 Phase 3B（全仓 CSS Token 收敛、文档同步与门禁全量开启）**，并在每一阶段的验收门禁中完整包含 `pnpm lint && pnpm test && pnpm check:length && pnpm build`。
6. **[Must-Fix 6] 在 §五 为 `scripts/check-ui-hygiene.ts` 设计渐进式目录门禁（Progressive Scope）并标注自身函数长度约束（≤ 50 行/函数）**：Phase 1 锁定 `tokens.css` + `components/ui/`，Phase 2 扩展锁定 `fingerprint/` + `ModelFingerprintSection`，Phase 3B 锁定全仓 `src/app/`。
7. **[Must-Fix 7] 在 §4.3 补齐主看板与查看页其余 5 处跨文件撕裂的 CSS 选择器归位清单**（`run-status-panel/calls.css`、`cards-base/footer.css`、`timeline-board/track.css`、`model-modal-dialog/content.css`、`viewer-base/drawers.css` 以及 `toolbar-responsive.css` 跨模块覆写 `.auto-run`）。
8. **[Must-Fix 8] 增设 `docs/ui/` 设计文档同步收口任务**：在 Phase 3B 生成 `docs/ui/dashboard/design-system.md`、更新 `docs/ui/UX_STATE_MAP.md` 与 `docs/ui/README.md`、标注 `dial-design-brief.md` 已废弃，并清理 `docs/ui/ux_coverage_report.json` 中的本机私有路径。

### Should-Fix（建议一并采纳的 6 项优化）

1. **[Should-Fix 1]** 将 `ProfileNameProps.cards` 改为可选属性 `cards?: readonly DashboardCard[]`（默认 `[]`），消除 `/fingerprint` 中的 `cards={[]}` 样板代码。
2. **[Should-Fix 2]** 精简 `src/app/config/ConfigSectionShell.tsx` 中的 8 个零逻辑纯透传包装函数。
3. **[Should-Fix 3]** 在 `RunBlock.tsx:73` 筛选为空的 `EmptyState` 中提供一键「重置筛选」按钮。
4. **[Should-Fix 4]** 在接入 `ui/Modal`、`ui/Collapsible`、`ui/PageHeader` 时，保留宿主语义类名（如 `.modal`, `.modal-close`, `.viewer-drawer`, `.viewer-standard`, `.toolbar`），确保 `scripts/diagnostics/ux_state_crawler.py` 与 `e2e_devices_test.py` 无需重写选择器即可运行。
5. **[Should-Fix 5]** 统一 `test/app/` 下全部 14 个静态 HTML 快照测试文件使用 `test/support/fixtures.ts` 的 `expectFixture`，消除手写 `fs.readFileSync` 无法通过 `UPDATE_FIXTURES=1` 刷新的不一致。
6. **[Should-Fix 6]** 统一 `/fingerprint` 停止作业的后端接口调用（收敛 `POST /api/run/cancel` 与 `POST /api/fingerprint` `{ action: "cancel" }`）。
