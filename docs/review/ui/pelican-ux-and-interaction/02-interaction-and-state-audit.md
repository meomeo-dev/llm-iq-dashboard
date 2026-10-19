# 交互状态规划与客户端状态管理审计报告

## 1. 审计范围与总体结论

本报告对 `llm_iq_dashboard` 的客户端状态持久化（`localStorage` / Cookie / URL 参数）、异步操作反馈与错误处理、SSE 实时进度同步（`live-store.ts`），以及空状态（Empty States）、只读展台模式（`PELICAN_READONLY=1` / `PELICAN_DATA_SOURCE=remote`）与未配对访客模式（`owner === false`）的交互闭环进行专项审计。

### 核心结论

1. **客户端持久化状态各自为政，且存在未捕获的存储异常与跨页状态丢失**：全站 7 个 `localStorage` 键分散在 5 个独立模块中，键名风格混用 `snake_case` 与 `dot.case`。其中 [`use-stored-time-zone.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/use-stored-time-zone.ts#L16-L20) 读写 `localStorage` 未包裹 `try/catch`；首页筛选状态 `hidden: HiddenFilters`（[`use-dashboard-view-state.ts#L15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/use-dashboard-view-state.ts#L15)）既未持久化也未同步至 URL，跨页往返后筛选条件与所选日期全部丢失。
2. **异步状态建模存在 6 套互不兼容的数据结构，且毁灭性操作确认机制不一致**：各模块分别自定义了 `Notice`、`ConfigEditorStatus`、`PairFormStatus`、`SwitchFailure` 等状态类型；[`useDataRepoActions`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-data-repo-actions.ts#L234-L235) 导出的 `dismissResult` / `dismissError` 在 UI 层从未绑定；删除配置档（[`ProfileCard.tsx#L40-L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCard.tsx#L40-L53)）与删除 API 密钥（[`ProfileCredentialField.tsx#L88-L90`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCredentialField.tsx#L88-L90)）无任何二次确认，单击即删。
3. **服务端硬编码中文错误文案 + 客户端正则翻译的脆弱链路**：后端 API 直接返回中文错误字符串，5 个前端模块各自维护正则或字典映射表将其翻译为英文，而 [`live-store.ts#L97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L97)、[`use-config-editor.ts#L23`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-config-editor.ts#L23)、[`use-device-panel.ts#L33`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L33) 和 [`CapabilityPanel.tsx#L33`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/CapabilityPanel.tsx#L33) 则直接透传中文错误，导致英文界面（`locale === "en"`）下出现中英混杂报错。
4. **跨页任务反馈割裂与高频 `router.refresh()` 开销**：在 `/config` 点击「立即跑一轮」启动评测后，由于 `/config` 没有挂载 `RunStatus` 组件，用户只能看到静态文字提示「进度见首页执行状态」（[`use-config-editor.ts#L71`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-config-editor.ts#L71)），必须离开配置页回首页才能查看进度或停止任务；同时首页 [`useRunProgress.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/useRunProgress.ts#L18-L22) 在每次单次调用完成或单件作品评完时均触发整页 RSC `router.refresh()`。
5. **空状态与只读/未配对权限边界存在误导提示**：首页空状态组件 [`EmptyDay.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/EmptyDay.tsx#L17-L44) 未接收 `owner` 与 `readonly` 属性，在无运行记录时始终提示「右上角所有者登录后点“▶ 跑一次”开始」，即便用户已登录（右上角无登录按钮）或处于只读展台模式（无登录入口也无运行按钮）。

---

## 2. 客户端状态持久化（`localStorage` / URL / State）审计

### 2.1 全站 `localStorage` 键名与实现对比

| 存储键名 | 所属文件与行号 | 用途 | 键名风格 | `try/catch` 容错 | SSR 水合与跨组件同步机制 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pelican_locale` | [`src/i18n/types.ts#L50`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/i18n/types.ts#L50), [`src/i18n/context.tsx#L47,L88`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/i18n/context.tsx#L47) | 界面语言偏好 (`en` / `zh-CN`) | `snake_case`（无版本后缀） | 有 | 同时写 Cookie `pelican_locale`，由 `I18nProvider` Context 全局共享 |
| `pelican.timeZone` | [`src/app/components/timeline/use-stored-time-zone.ts#L7,L16,L20`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/use-stored-time-zone.ts#L7) | 展示时区偏好 | `dot.case`（无版本后缀） | **无（直接调用 `getItem`/`setItem`）** | 无 Context；`/`、`/view`、`/fingerprint` 各自独立挂载 `useState` |
| `pelican.cliBanner.dismissed` | [`src/app/components/cli-status/use-dismissed-clis.ts#L6,L17,L29`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/use-dismissed-clis.ts#L6) | 已忽略的 CLI 异常横幅列表 | `dot.case`（无版本后缀） | 有 | 仅在 `CliStatusBanner` 内使用 |
| `pelican.runOnce.selection.v3` | [`src/app/components/run-control/run-selection-store.ts#L10`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts#L10) | 首页「跑一次」勾选状态 | `dot.case.v3` | 有（支持注入 `storage`） | 仅在 `useRunOnceState` 挂载时读取一次 |
| `pelican.runOnce.profiles.v1` | [`src/app/components/run-control/run-selection-store.ts#L12`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts#L12) | 首页「跑一次」保存的预设组合 | `dot.case.v1` | 有（支持注入 `storage`） | 仅在 `useRunOnceState` 内管理 |
| `pelican.fingerprint.checkSelection.v1` | [`src/app/fingerprint/fingerprint-check-store.ts#L4`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts#L4) | 指纹页「指纹检测」勾选状态 | `dot.case.v1` | 有 | 与 `run-selection-store.ts` 高度重复 |
| `pelican.fingerprint.checkProfiles.v1` | [`src/app/fingerprint/fingerprint-check-store.ts#L5`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts#L5) | 指纹页「指纹检测」保存的预设 | `dot.case.v1` | 有 | 与 `run-selection-store.ts` 高度重复 |

### 2.2 具体状态管理缺陷

1. **[`use-stored-time-zone.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/use-stored-time-zone.ts#L14-L22) 未捕获 `localStorage` 异常且存在首屏时区闪烁**：
   - 在 [`use-stored-time-zone.ts#L16,L20`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/use-stored-time-zone.ts#L16) 中，`window.localStorage.getItem(TZ_STORAGE_KEY)` 与 `window.localStorage.setItem(TZ_STORAGE_KEY, next)` 均未包裹 `try/catch`。在 Safari 严格无痕模式、禁用存储或存储配额满时，调用 `setTimeZone` 会直接抛出未捕获的 `DOMException` 导致组件崩溃。
   - 在 [`FingerprintDashboard.tsx#L175-L176`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L175-L176) 中，`timeZone` 在 `useStoredTimeZone()` 水合完成前固定回退为 `"Asia/Shanghai"`（`const timeZone = storedTz ?? "Asia/Shanghai"`），而首页 [`use-dashboard-view-state.ts#L18-L19`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/use-dashboard-view-state.ts#L18-L19) 回退为服务端 `defaultTimeZone`，造成非东八区用户在 `/fingerprint` 首屏水合时出现时间戳跳变。

2. **首页筛选条件与日期参数在跨页导航后丢失**：
   - 在 [`src/app/components/dashboard/use-dashboard-view-state.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/use-dashboard-view-state.ts#L15) 中，筛选器状态 `const [hidden, setHidden] = useState<HiddenFilters>(NO_FILTERS)` 仅保存在组件内存中，既不写入 `localStorage` 也不写入 URL 查询参数。
   - 同时，顶栏工具区的 `/fingerprint`、`/config`、`/pair` 入口（[`ToolbarUtils.tsx#L70-L96`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L70-L96)）与各子页的「← 看板」链接（`href="/"`）均不保留当前 URL 的 `?day=YYYY-MM-DD` 参数。用户在查看历史某天并设置了 CLI/模型/强度筛选后，只要进入 `/config` 或 `/fingerprint` 再点返回，日期与筛选状态会被全部重置。

---

## 3. 异步操作反馈、错误处理与 SSE 实时状态（`live-store.ts`）审计

### 3.1 异步状态结构碎片化与未绑定的关闭回调

全站异步操作各自实现了 6 套不同的状态模型，导致加载态、成功提示、错误横幅的展示位置与消失时机完全不一致：

| 模块 / 组件 | 状态类型定义 | 成功反馈清理机制 | 错误反馈清理机制 | 存在的交互缺陷 |
| :--- | :--- | :--- | :--- | :--- |
| `RunOnceFooter` / `FingerprintCheckModal` | `Notice = { kind: "ok" \| "error"; text: string } \| null` + `busy: boolean` ([`RunOnceFooter.tsx#L9`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceFooter.tsx#L9)) | 启动成功后 `500ms` 自动关闭弹窗 ([`use-run-once-state.ts#L130`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/use-run-once-state.ts#L130)) | 下次点击提交时清除，无手动关闭按钮 | `500ms` 硬编码延迟期间按钮恢复可点（`setBusy(false)` 在 `finally` 中立即执行，[`#L136`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/use-run-once-state.ts#L136)），快速连点会发起重复请求 |
| `ConfigEditor` | `ConfigEditorStatus` (`idle \| saving \| saved \| running \| started \| error`) ([`config-editor-model.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/config-editor-model.ts)) | 修改任意表单项时重置为 `idle` ([`use-config-editor.ts#L50`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-config-editor.ts#L50)) | 修改表单项时重置，无关闭按钮 | 提示文字仅渲染在页面最底部 `.actions` 栏右侧（[`ConfigActionsBar.tsx#L39-L51`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigActionsBar.tsx#L39-L51)） |
| `AutoRunToggle` | `SwitchFailure = { message: string } \| null` + `switching: boolean` ([`AutoRunToggle.tsx#L10-L14`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/AutoRunToggle.tsx#L10-L14)) | 无成功提示（状态直接翻转） | `4000ms` 定时器自动消失 ([`#L38-L43`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/AutoRunToggle.tsx#L38-L43)) | 全站唯一使用 `4s` 自动消失的行内胶囊报错 |
| `DataRepoPanel` | `syncResult` + `actionError` ([`use-data-repo-actions.ts#L39-L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-data-repo-actions.ts#L39-L53)) | Hook 导出了 `dismissResult` | Hook 导出了 `dismissError` | **死代码**：[`DataRepoPanel.tsx#L191`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPanel.tsx#L191) 从未解构或绑定 `dismissResult` / `dismissError`，横幅一旦出现无法手动关闭 |
| `FingerprintDashboard` | `actionError: string \| null` + `startingProbe` ([`FingerprintDashboard.tsx#L42-L44`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L42-L44)) | 无 | 仅在下次发起操作时清除 | 错误横幅使用内联样式 `style={{ borderColor: "var(--err)", color: "var(--err)" }}`（[`#L274-L276`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L274-L276)），且 `refreshAll`（`#L58-L64`）与 `loadDrawerCell`（`#L66-L72`）在 `catch` 中静默吞掉所有网络错误 |
| `useDevicePanel` | `error: string \| null` + `busyId: string \| null` ([`use-device-panel.ts#L9-L10`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L9-L10)) | 列表刷新 | 下次撤销操作时清除 | 初次加载 `fetch("/api/session")`（[`#L12-L15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L12-L15)）无 `.catch()`，若请求失败则 `loading` 永远卡在 `true`（「读取中…」） |

### 3.2 毁灭性/高风险操作二次确认方式不一致

同属不可逆或高代价操作，全站使用了 4 种截然不同的确认模式：

1. **行内双按钮二次确认**：首页停止运行 [`StopRunButton.tsx#L37-L45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/StopRunButton.tsx#L37-L45)（展开「确认停止 / 不停了」）与指纹抽屉删除样本 [`FingerprintSampleDrawer.tsx#L131-L141`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L131-L141)（展开「确认 / 取消」）。
2. **自定义模态对话框确认**：数据仓公开推送 [`DataRepoPushDialog.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPushDialog.tsx)。
3. **浏览器原生阻塞式 `window.confirm`**：配置页移除已配对设备 [`use-device-panel.ts#L29`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L29) 直接调用 `if (!window.confirm(confirmMessage)) return;`。
4. **零确认（单击立即删除）**：配置页删除自定义 Profile 卡片（[`ProfileCard.tsx#L40-L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCard.tsx#L40-L53) 的 `✕` 按钮）以及删除已保存的第三方 API Key（[`ProfileCredentialField.tsx#L88-L90`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCredentialField.tsx#L88-L90) 的「删除密钥」按钮）均无任何确认步骤，误触即刻抹除。

### 3.3 错误信息国际化斷裂（服务端硬编码中文 + 客户端正则匹配）

后端 API 路由返回中文 `error` 字符串，前端并未统一使用错误码（Error Code），而是分裂为两类处理：
- **脆弱的客户端正则翻译**：[`run-once-api.ts#L16-L61`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-once-api.ts#L16-L61)、[`use-profile-credentials.ts#L13-L46`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-profile-credentials.ts#L13-L46)、[`pair-form-model.ts#L3-L24`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/pair-form-model.ts#L3-L24)、[`data-repo-panel-i18n.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/data-repo-panel-i18n.ts) 和 [`CliStatusBanner.tsx#L65-L73`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/cli-status/CliStatusBanner.tsx#L65-L73) 各自用正则表达式匹配中文句子并替换为英文。一旦后端微调一个标点或措辞，英文翻译即失效。
- **未翻译直接透传中文**：
  - [`src/app/components/live-state/live-store.ts#L97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L97)：在客户端 Store 中直接硬编码中文 `"服务端读取自动任务状态失败"`，英文界面下 `AutoRunToggle` 悬停 title 与报错直接显示该中文。
  - [`src/app/config/use-config-editor.ts#L23`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-config-editor.ts#L23)、[`src/app/config/use-device-panel.ts#L33`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L33)、[`src/app/config/CapabilityPanel.tsx#L33`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/CapabilityPanel.tsx#L33)、[`src/app/fingerprint/FingerprintDashboard.tsx#L80`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L80)：直接将服务端返回的中文 `body.error` 写入 UI 状态，在 `en` 语言下产生中英混排。

### 3.4 SSE 实时同步（`live-store.ts`）与跨页任务监控断层

1. **`live-store.ts` 中的死常量与重连间隔不一致**：
   - 在 [`src/app/components/live-state/live-store.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L23) 中声明了 `const RECONNECT_MS = 5_000;`，但在 [`#L112`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L112) 的 `es.onerror` 中却硬编码了 `setTimeout(..., 2000)`，`RECONNECT_MS` 从未被使用。
2. **每次子调用完成均触发全页 RSC 刷新**：
   - 在 [`src/app/components/run-status/useRunProgress.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/useRunProgress.ts#L18-L25) 中，每当 `doneCount`（已完成的模型调用数 + 已评完的作品数）增加时，立即调用 `router.refresh()`。在一轮包含数十个并发调用或高并发 AI 评审（默认并发 5）的任务中，首页会在短时间内高频触发 Next.js 服务端组件全量重渲染。
3. **`/config` 启动任务后缺乏实时进度与取消入口**：
   - [`src/app/config/ConfigActionsBar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ConfigActionsBar.tsx#L31-L38) 提供了「立即跑一轮」按钮，点击后调用 `/api/run-once` 启动整轮评测，但 `/config` 页面并未挂载 [`RunStatus`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/RunStatus.tsx) 组件，只能显示静态文本「已开始，共 N 次调用；进度见首页执行状态」（[`use-config-editor.ts#L71`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-config-editor.ts#L71)），用户无法在当前页观察进度或紧急停止刚刚启动的任务。

---

## 4. 空状态（Empty States）、只读展台模式与未配对访客模式审计

### 4.1 空状态误导文案审计

| 空状态场景 | 所在文件与行号 | 当前渲染文案 | 存在的逻辑与权限矛盾 |
| :--- | :--- | :--- | :--- |
| 整站尚无任何评测记录 (`!hasRuns`) | [`EmptyDay.tsx#L28-L35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/EmptyDay.tsx#L28-L35), [`dashboard-calc.ts#L10`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/dashboard-calc.ts#L10) | `"还没有运行记录。右上角所有者登录后点“▶ 跑一次”开始。"` / `"No benchmark runs yet. Sign in as owner and click “▶ Run Once” to start."` | `EmptyDay` 未接收 `owner` 或 `readonly` 属性：<br>1. **已登录所有者 (`owner === true`)**：右上角根本没有「所有者登录」按钮，文案要求其去右上角登录属误导。<br>2. **只读展台模式 (`readonly === true`)**：既无登录入口也无 `▶ 跑一次` 按钮，引导读者执行不可能完成的操作。 |
| 所选日期无记录 (`hasRuns && !selectedDay`) | [`EmptyDay.tsx#L28-L35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/EmptyDay.tsx#L28-L35) | `"这一天没有运行记录，点左上角“日历”切换到有小点的日期。"` | 在移动端（`≤ 640px`），工具栏折为 3 行，「日历」按钮并不在左上角而在第二行左侧。 |
| 某轮次的所有输出被筛选器隐藏 | [`RunBlock.tsx#L73`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunBlock.tsx#L73) | `<p className="empty">当前筛选条件下没有卡片</p>` | 不提供一键「重置筛选」按钮，用户需重新打开顶栏「筛选」菜单逐个恢复。 |

### 4.2 只读展台模式（`PELICAN_READONLY=1` / `PELICAN_DATA_SOURCE=remote`）一致性审计

1. **受保护路由的拦截行为不一致（`redirect("/")` vs `notFound()`）**：
   - 当 `isReadonly()` 为 `true` 时，访问 `/config`（[`src/app/config/page.tsx#L57`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L57)）与 `/fingerprint`（[`src/app/fingerprint/page.tsx#L41`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx#L41)）会执行 `redirect("/")` 平滑跳回首页；
   - 但访问 `/pair`（[`src/app/pair/page.tsx#L35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/page.tsx#L35)）却调用 `notFound()`，直接向用户展示 Next.js 默认 404 错误页。
2. **`PELICAN_READONLY=1` 本地只读模式下仍建立 SSE 连接并展示「自动」开关**：
   - 在 [`src/app/components/toolbar/ToolbarCenter.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarCenter.tsx#L47-L51) 中，`AutoRunToggle` 的渲染条件写成了 `{!remote && (<AutoRunToggle readOnly={!owner} />)}`，漏判了 `!readonly`。
   - 当部署方使用本地产物目录开启只读模式（`PELICAN_READONLY=1` 且 `PELICAN_DATA_SOURCE` 不为 `remote`）时，`ToolbarCenter` 仍会渲染 `AutoRunToggle`，并触发 [`live-store.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L84-L115) 发起 `/api/auto-run` 请求与 `/api/events` SSE 长连接。

### 4.3 未配对访客模式（`owner === false`）体验审计

1. **重定向至 `/pair?next=...` 后缺少来源上下文说明**：
   - 未配对访客直接访问 `/config`（[`config/page.tsx#L60`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/page.tsx#L60)）或 `/fingerprint`（[`fingerprint/page.tsx#L43`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/page.tsx#L43)）时，服务端重定向至 `/pair?next=%2Fconfig` 或 `/pair?next=%2Ffingerprint`。
   - 但 [`src/app/pair/page.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/page.tsx#L36-L45) 仅将 `returnTo` 传给表单用于登录成功后的跳转，界面上没有任何提示告知用户「访问 `/config` 需要先完成所有者设备配对」。
2. **顶栏权限入口表现不一**：
   - 在首页 [`ToolbarUtils.tsx#L69-L97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L69-L97) 中，未配对访客看到的是「所有者登录」钥匙图标（跳往 `/pair`）和「运行配置」齿轮图标（点击后服务端重定向至 `/pair?next=%2Fconfig`），而「模型指纹」图标和「▶ 跑一次」按钮则被完全隐藏（[`ToolbarUtils.tsx#L70`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarUtils.tsx#L70)、[`ToolbarCenter.tsx#L40`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarCenter.tsx#L40)）。同属所有者专属功能，`/config` 对访客可见并引导配对，而 `/fingerprint` 与 `RunOnceMenu` 则对访客完全隐形。

---

## 5. 整改建议优先级

1. **P0（消除异常崩溃隐患、误删风险与空状态误导）**：
   - 在 [`use-stored-time-zone.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/use-stored-time-zone.ts#L14-L22) 中为 `localStorage.getItem` / `setItem` 加上 `try/catch` 保护；在 [`use-device-panel.ts#L12-L15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L12-L15) 中补齐 `.catch()` 与 `res.ok` 失败分支处理。
   - 为 [`ProfileCard.tsx#L40-L53`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCard.tsx#L40-L53)（删除 Profile）与 [`ProfileCredentialField.tsx#L88-L90`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ProfileCredentialField.tsx#L88-L90)（删除密钥）增加行内二次确认，并将 [`use-device-panel.ts#L29`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/use-device-panel.ts#L29) 的 `window.confirm` 统一为非阻塞确认交互。
   - 向 [`EmptyDay.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/dashboard/EmptyDay.tsx) 传入 `owner` 与 `readonly` 状态，按「已登录所有者」「未登录访客」「只读展台」三态分别展示准确的引导文案；在 [`RunBlock.tsx#L73`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/timeline/RunBlock.tsx#L73) 空筛选提示旁提供「重置筛选」按钮。
2. **P1（统一异步状态反馈、错误国际化与只读守卫）**：
   - 在 [`DataRepoPanel.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPanel.tsx#L191) 中绑定 `dismissResult` 与 `dismissError` 关闭按钮；修复 [`live-store.ts#L97`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/live-state/live-store.ts#L97) 的硬编码中文错误并使用 `RECONNECT_MS` 常量。
   - 将 [`ToolbarCenter.tsx#L47`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/ToolbarCenter.tsx#L47) 的 `!remote` 改为 `!readonly && !remote`，并将 [`src/app/pair/page.tsx#L35`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/page.tsx#L35) 在只读模式下的 `notFound()` 统一为 `redirect("/")`。
3. **P2（跨页状态保持与实时进度同步优化）**：
   - 将首页 `hidden: HiddenFilters` 持久化至 `localStorage`（或 URL 参数），并在跨页返回链接中保留 `?day=` 上下文；合并 [`run-selection-store.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/run-selection-store.ts) 与 [`fingerprint-check-store.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-check-store.ts) 的通用存储逻辑。
   - 对 [`useRunProgress.ts#L18-L22`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-status/useRunProgress.ts#L18-L22) 的 `router.refresh()` 增加节流（Throttle / Debounce），避免高并发完成时频繁全页刷新。
