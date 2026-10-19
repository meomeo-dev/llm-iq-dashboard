# 方案审查报告 02：组件原语 API、SSR 测试兼容性与代码长度门禁审查

**审查对象**：[`docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md)（重点针对 **§三 三层组件模块架构与 8 个 UI 原语**、**§四 模块边界重整** 及 **§六 验收门禁**）  
**对照基线**：
- [`docs/review/ui/pelican-component-architecture/01-component-hierarchy-and-boundaries.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/pelican-component-architecture/01-component-hierarchy-and-boundaries.md)
- [`docs/review/ui/pelican-component-architecture/02-line-limit-driven-fragmentation.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/pelican-component-architecture/02-line-limit-driven-fragmentation.md)
- [`docs/review/ui/fingerprint-component-architecture/01-reuse-vs-reinvention-audit.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/fingerprint-component-architecture/01-reuse-vs-reinvention-audit.md)
- [`docs/review/ui/fingerprint-component-architecture/02-module-boundaries-and-coupling.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/fingerprint-component-architecture/02-module-boundaries-and-coupling.md)
- [`test/core/model-fingerprint/ui-model.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/ui-model.test.ts) 及 `test/app/**` 下全部 14 个 `renderToStaticMarkup` 单元测试文件
- [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml) 与 [`scripts/code-length/checker.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/checker.ts)

---

## 一、 审查总结（Executive Summary）

方案 §三 提出的三层组件架构（`Tier 3 Route Pages` → `Tier 2 Domain Components` → `Tier 1 UI Primitives`）方向正确，准确命中了全仓重复手写 Modal / Drawer / Button / Pill / Table 的痛点。但在工程落地层面，存在 **4 项会直接导致 `pnpm test` 或 `pnpm check:length` 失败的阻断性风险（Must-Fix）** 以及 **6 项原语 API 契约漏洞（Should-Fix）**：

1. **[Must-Fix 1] `Modal` 渲染期无条件调用 `createPortal(..., document.body)` 将直接击穿全仓 `renderToStaticMarkup` 单测体系**：本仓库所有 UI 单元测试均在 Node.js 无 DOM 环境下使用 `react-dom/server` 的 `renderToStaticMarkup`。直接调用 `createPortal(..., document.body)` 既会抛出 `ReferenceError: document is not defined`，也会触发 React 19 Server Renderer 的 `Portals are not currently supported by the server renderer` 异常；若简单用 `if (typeof document === "undefined") return null` 规避，则会导致 `ModelModal`、`DataRepoPushDialog`、`FingerprintCheckModal` 等静态渲染测试返回空字符串 `""` 而全线断言失败。
2. **[Must-Fix 2] `createPortal` 与 `Menu` 的 `useMenuDismiss` 原生 DOM 事件监听存在物理树击穿 Bug**：[`use-menu-dismiss.ts:14`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/use-menu-dismiss.ts#L14) 通过原生 `document.addEventListener("pointerdown", ...)` 检查 `!root.current.contains(event.target as Node)`。原生 DOM `contains()` 检查的是物理 DOM 树而非 React Fiber 树——一旦 `Menu` 内部的子弹窗通过 Portal 挂载到 `document.body`，用户在弹窗内的任何点击都会被 `useMenuDismiss` 误判为“点击了菜单外部”。
3. **[Must-Fix 3] `ui.css` 单文件汇总 8 个原语样式将必然突破 `config/code-length-policy.yaml` 的 300 行 `.css` 门禁，且 `FingerprintCheckPanel.tsx` 并入 `CheckLauncherFooter` 后将逼近/突破 300 行 `.tsx` 门禁**。
4. **[Must-Fix 4] 方案遗漏了 `test/fixtures/markup/wp-{f,g,h,l,p}/*.html`（共 51 个逐字节 HTML 特征夹具）的同步迁移策略**：修改 `ModelModal`、`DataRepoPushDialog`、`TargetTable`、`ArtViewer`、`PairForm`、`StopRunButton` 的 DOM 结构或类名后，若不按阶段处理特征夹具，11 个特征测试文件将立即红灯。

---

## 二、 致命风险深度核查：`createPortal` 与 SSR / `renderToStaticMarkup` 兼容性

### 2.1 现有测试架构的事实取证

检索 `test/` 目录可见，本仓库的前端组件测试**不依赖 `@testing-library/react` 或浏览器渲染**，而是统一在 Node.js 纯服务端环境下通过 `react-dom/server` 的 `renderToStaticMarkup` 对组件输出 HTML 做断言（共 **15 个测试文件、50+ 个测试用例**）：

| 测试文件 | 被测组件（含浮层/弹窗） | 是否注入 JSDOM (`installDom`) | 断言方式 |
| :--- | :--- | :---: | :--- |
| [`test/core/model-fingerprint/ui-model.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/ui-model.test.ts#L239-L499) | `FingerprintMatrix`, `FingerprintCheckDetail`, `ModelFingerprintSection`, `ToolbarUtils`, `FingerprintCheckPanel`, `FingerprintCheckTimeline` | **否**（`typeof document === "undefined"`） | `assert.ok(html.includes(...))` |
| [`test/app/components/model-modal/model-modal-markup.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/model-modal/model-modal-markup.test.ts#L80-L109) | `ModelModal`（主看板核心模态窗） | **否** | `expectFixture` 逐字节比对 `ModelModal-*.html` |
| [`test/app/components/model-modal/profile-matrix.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/model-modal/profile-matrix.test.ts#L56-L64) | `ModelModal`（多上游 vs 单上游） | **否** | `assert.match(multi, /class="profile-matrix"/)` |
| [`test/app/config/data-repo-panel.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/config/data-repo-panel.test.ts#L190-L202) | `DataRepoPanel` + `DataRepoPushDialog`（`initialShowPushDialog: true`） | **否** | 逐字节比对 `push-confirm-open.html` + 正则断言 |
| [`test/app/components/run-control/run-control-markup.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/run-control/run-control-markup.test.ts#L33-L115) | `RunOnceMenu`, `StopRunButton`, `AutoRunToggle`, `RunForecast` | **否** | 逐字节比对 `RunOnceMenu-*.html`, `StopRunButton-*.html` |

### 2.2 直接使用 `createPortal(..., document.body)` 的四重连环故障

方案 §3.1 原语 5（[`DESIGN_SYSTEM_AND_COMPONENT_PLAN.md:257`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md#L257)）写道：
> “1. 内部统一通过 `createPortal(..., document.body)` 挂载，彻底根治 `RunOnceProfileModal` 嵌套在带 `transform: translate(-50%, -50%)` 的 `.run-once-panel` 内导致 `position: fixed` 遮罩被困在父面板内的 CSS Containing Block 缺陷”

如果按该描述直接实现 `Modal`（及 `Drawer`），将依次触发以下 4 个问题：

1. **故障一：Node.js 无 DOM 环境下直接抛 `ReferenceError`**  
   在 `renderToStaticMarkup` 执行期间，`useEffect` 不会运行，但组件函数体同步执行。此时 `globalThis.document` 为 `undefined`，求值 `document.body` 立即抛出 `ReferenceError: document is not defined`。
2. **故障二：即使在测试前调用 `installDom()`，`react-dom/server` 依然抛错拒绝渲染 Portal**  
   React 19 的 `react-dom/server` 在服务端序列化树时遇到 `createPortal` 创建的 `REACT_PORTAL_TYPE` 节点，会直接抛出错误：
   ```text
   Error: Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.
   ```
3. **故障三：若采用 `if (typeof document === "undefined") return null` 或 `const [mounted, setMounted] = useState(false); if (!mounted) return null` 规避，会导致所有模态窗单测失明**  
   在 `renderToStaticMarkup` 下，`useEffect` 不会触发，`mounted` 永远为 `false`。若未挂载时返回 `null`：
   - [`model-modal-markup.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/model-modal/model-modal-markup.test.ts#L80-L109) 渲染 `<ModelModal>` 将得到空字符串 `""`；
   - [`profile-matrix.test.ts:56-64`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/components/model-modal/profile-matrix.test.ts#L56-L64) 对 `<ModelModal>` 的正则断言将全部失败；
   - [`data-repo-panel.test.ts:190-202`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/app/config/data-repo-panel.test.ts#L190-L202) 中 `initialShowPushDialog: true` 场景下的 `<DataRepoPushDialog>` 将从输出 HTML 中彻底消失；
   - 任何針對 `FingerprintCheckModal`、`RunOnceProfileModal`、`FingerprintSampleDrawer` 以及 Phase 1 `test/ui/*` 的 `renderToStaticMarkup` 测试都将无法验证弹窗内容！
4. **故障四：原生 DOM `pointerdown` 物理树包含检查击穿父级 `Menu`**  
   查看 [`src/app/components/menu/use-menu-dismiss.ts:13-20`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/use-menu-dismiss.ts#L13-L20)：
   ```ts
   const onPointerDown = (event: PointerEvent): void => {
     if (root.current !== null && !root.current.contains(event.target as Node)) onClose();
   };
   document.addEventListener("pointerdown", onPointerDown);
   ```
   因为 `document.addEventListener("pointerdown", ...)` 是**原生 DOM 事件**而非 React 合成事件，`root.current.contains(event.target as Node)` 检查的是**物理 DOM 树**。如果 `Menu` 内部的子组件通过 `createPortal(..., document.body)` 挂载到 `document.body`，其 DOM 节点不在 `<div className="menu" ref={root}>` 内部，用户在 Modal 内点击勾选框时会直接触发 `useMenuDismiss` 的 `onClose()`！

### 2.3 最稳健的工程解法（双重策略：结构提升 + 渐进式 SSR-Safe Portal）

应同时采取**组件树解耦（治本）**与**渐进式客户端 Portal（兜底）**两项措施：

#### 第一步：组件树结构解耦——将 `RunOnceProfileModal` 移出 `.run-once-panel`（无需 Portal 即可根治包含块陷阱）
`RunOnceProfileModal` 之所以掉进 `transform: translate(-50%, -50%)` 包含块陷阱，唯一原因是 [`RunOnceMenu.tsx:98-110`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceMenu.tsx#L98-L110) 与 [`FingerprintCheckPanel.tsx:224-233`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckPanel.tsx#L224-L233) 将它作为 `children` 塞进了 `.menu-panel.run-once-panel` 内部。
- **解法**：在 `Menu.tsx` 中增加可选的 `overlaySlot?: React.ReactNode`（渲染在 `<div className="menu" ref={root}>` 内部、但位于 `<div className="menu-panel run-once-panel">` **外部的兄弟位置**），或者直接在 `RunOnceMenu` / `FingerprintCheckPanel` 中与 `<Menu>` 并列渲染 `<RunOnceProfileModal>`。
- **收益**：
  1. `div.menu` 本身只有 `position: relative`、**没有任何 `transform` / `filter` / `backdrop-filter`**，因此作为 `.menu-panel` 兄弟节点的 `<RunOnceProfileModal>` 的 `position: fixed; inset: 0` 天然相对于视口（Viewport）全屏定位，完全不受 `.run-once-panel` 的 `transform: translate(-50%, -50%)` 影响！
  2. 如果挂在 `div.menu` 内部（与 `.menu-panel` 兄弟），物理 DOM 依然满足 `root.current.contains(event.target)`，连原生 `pointerdown` 外点检测都天然兼容！

#### 第二步：`Modal` 与 `Drawer` 采用「SSR/静态渲染原位输出 + 客户端按需 Portal」策略
在 `src/app/components/ui/Modal.tsx`（及 `Drawer.tsx`）中：
```tsx
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * 默认 false（原位渲染，完美兼容 SSR 与 renderToStaticMarkup）。
   * 当设为 true 时：SSR / renderToStaticMarkup 阶段仍原位输出完整 DOM 树以保证测试可断言；
   * 浏览器端 useEffect 挂载后自动通过 createPortal 提升至 document.body。
   */
  portal?: boolean;
  // ...
}

export function Modal(props: ModalProps) {
  const { open, portal = false } = props;
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (portal && typeof document !== "undefined") {
      setPortalTarget(document.body);
    } else {
      setPortalTarget(null);
    }
  }, [portal]);

  if (!open) return null;

  const dialogNode = (
    <div className="ui-modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && props.onClose()}>
      {/* ... */}
    </div>
  );

  return portalTarget !== null ? createPortal(dialogNode, portalTarget) : dialogNode;
}
```
同时，在 `useOverlayStack`（`src/app/components/ui/use-overlay-stack.ts`）中导出 `hasActiveOverlay(): boolean`，并在 [`use-menu-dismiss.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/menu/use-menu-dismiss.ts#L13-L18) 中增加一行守卫：当 `hasActiveOverlay()` 为 `true` 时，顶层 `Menu` 自动忽略 `pointerdown` 和 `Escape`，彻底淘汰业务组件里手工维护的 `choosingRef` 锁。

---

## 三、 8 个 UI 原语的 Props 契约完备性与边界挑刺

### 3.1 原语 1：`PageHeader` vs 首页 `Toolbar` —— 警惕过度抽象

- **问题诊断**：
  方案 §3.1 原语 1（[`DESIGN_SYSTEM_AND_COMPONENT_PLAN.md:199`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md#L199)）提出用 `PageHeader` “消除 5 个页面 4 套互不兼容的顶栏（`.toolbar`、幽灵类 `.masthead`、`.viewer-head`、`.fp-header`）”。
  然而对比代码可见：
  - **首页 `/` 的 [`Toolbar.tsx`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/toolbar/Toolbar.tsx#L69-L105)** 是高度定制的 4 区响应式工作台顶栏：包含 `ToolbarBrand`（品牌区，`order: 1`）、`ToolbarMenus`（日历菜单 + 多维筛选器菜单，`order: 2`）、`ToolbarCenter`（当日轮次/作品/成功率统计 + `RunOnceMenu` + `AutoRunToggle` + `RunStatus`，`order: 3`）、`ToolbarUtils`（导出菜单 + 时钟跳至现在 + 时区菜单 + 指纹入口 + 配置/配对入口 + 语言切换，`order: 4`），并在窄屏下通过 `.toolbar-top-row` 从 `display: contents` 切换为双行布局。
  - **其余 4 个二级页面（`/fingerprint`、`/config`、`/view`、`/pair`）** 则是标准的「左标题/副标题 + 返回链接 + 右侧操作区」结构。
- **审查结论与修正建议**：
  1. **不要用 `PageHeader` 硬套首页 `Toolbar.tsx`**：若强行把首页 4 区 `order` 重排塞进 `PageHeader`，要么把 `PageHeader` 变成充满首页专属槽位的臃肿组件，要么沦为无意义的薄包装壳（重蹈 `DashboardToolbar.tsx` 的覆辙）。
  2. **明确职责边界**：`PageHeader` **专职统一 4 个二级/工具页面（`/fingerprint`、`/config`、`/view`、`/pair`）的顶栏**；首页继续使用领域组件 `Toolbar.tsx`，二者在底层共享 `Button`、`StatusPill`、`Menu`、`RunStatus` 与 `LanguageSwitch`。
  3. **补齐 `PageHeaderProps` 对 `/view` 页的适配槽位**：[`ArtViewerHead.tsx:47-76`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L47-L76) 除了主标题和右侧按钮外，还在标题下方渲染了多维元数据行（`.viewer-meta`）、变量绑定胶囊行（`.badges`）以及水平居中区的同轮多上游切换条（`<ArtViewerSiblings />`）。因此 `PageHeaderProps` 的 `subtitle` 应允许传入任意块级元数据节点（使用 `<div>` 而非 `<p>` 容器包裹，避免 `<p>` 内嵌 `<div>` 触发 HTML 嵌套与 SSR 水合报错！），并充分利用 `centerSlot` 承载 `<ArtViewerSiblings />`。
  4. **强制使用 Next.js `<Link>` 渲染 `backHref`**：修复 [`FingerprintDashboard.tsx:269-270`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L269-L270) 使用原生 `<a href="/">` 导致整页硬刷新的问题。

### 3.2 原语 7：`DataTable` —— 如何优雅兼顾双列 Sticky 与紧凑表而不膨胀 Props？

- **问题诊断**：
  1. 在 [`fingerprint-matrix.css:39-79`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/fingerprint-matrix.css#L39-L79) 中，`FingerprintMatrix` 需要前两列横向滚动冻结：第 1 列 `.fp-col-model`（`left: 0; width: 200px`），第 2 列 `.fp-col-cli`（`left: 200px; width: 148px; box-shadow: 2px 0 6px ...`），且 `thead th`（`z-index: 3; background: var(--surface-hi)`）与 `tbody td`（`z-index: 2; background: var(--surface)`）层级和背景色不同。
  2. 而在 [`FingerprintCheckTechDrawer.tsx:85,142`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L85)、[`CheckProbeAttemptsSection:214`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckSections.tsx#L214)、[`TargetTable.tsx:55`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/TargetTable.tsx#L55)、[`JudgeDrawer.tsx:63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L63)、[`DeviceTable.tsx:15`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DeviceTable.tsx#L15) 中，表格均为普通流式表，不需要 sticky 列，且在 `310px` 多列对比卡或 `680px` 模态窗中**绝对不能有 `min-width: 980px`**。
- **审查结论与工程设计**：
  切忌把 `DataTable` 设计成接收 `columns: ColumnDef[]` 的重型配置化表格（那样既会突破 300 行限制，又无法兼容 `TargetRow` 复杂的表单单元格）。应采用**「轻量语义包装器 + CSS 变量驱动的通用 Sticky 工具类」**设计：
  ```tsx
  export interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    /**
     * matrix: 独立边框网格（border-collapse: separate），支持横向滚动与 .ui-col-sticky-1 / .ui-col-sticky-2 冻结列
     * compact: 100% 自适应父容器宽度（无 min-width 限制），适合弹窗/抽屉内嵌明细表与配置页表格
     */
    variant?: "matrix" | "compact";
    /** 覆盖第一列 sticky 宽度（供第二列计算 left 偏移，默认 "200px"） */
    stickyFirstColWidth?: string;
    wrapClassName?: string;
    children: React.ReactNode;
  }
  ```
  在 `data-table.css` 中通过 CSS 变量优雅解耦双列 Sticky：
  ```css
  .ui-table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .ui-table--matrix {
    --ui-sticky-col-1-w: 200px;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: var(--text-base);
  }
  .ui-table--compact {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }
  /* 通用双列 Sticky 契约：仅当业务方的 th/td 主动挂上类名时生效 */
  .ui-table--matrix .ui-col-sticky-1 {
    position: sticky;
    left: 0;
    width: var(--ui-sticky-col-1-w);
    min-width: var(--ui-sticky-col-1-w);
    max-width: var(--ui-sticky-col-1-w);
  }
  .ui-table--matrix .ui-col-sticky-2 {
    position: sticky;
    left: var(--ui-sticky-col-1-w);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.25);
  }
  .ui-table--matrix thead th.ui-col-sticky-1,
  .ui-table--matrix thead th.ui-col-sticky-2 {
    background: var(--surface-hi);
    z-index: var(--z-sticky-head);
  }
  .ui-table--matrix tbody td.ui-col-sticky-1,
  .ui-table--matrix tbody td.ui-col-sticky-2 {
    background: var(--surface);
    z-index: var(--z-sticky-cell);
  }
  ```
  这样 `DataTable.tsx` 本体仅需 **35 行代码**，既不耦合任何业务字段，又彻底消除了 `CheckTechDrawer` 套用 `.fp-matrix-table`（`min-width: 980px`）导致的爆表 Bug，同时淘汰配置页冲突的 `<table className="matrix">`。

### 3.3 其余 6 个原语的 Props 契约漏洞清单

1. **原语 2 `Button` & `ConfirmButton`**：
   - **漏洞 A（缺少链接按钮 `ButtonLink`）**：全站有多处外观为标准按钮但语义为路由跳转或文件下载的 `<a>` / `<Link>`（如 [`PairSignedInCard.tsx:28`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/pair/PairSignedInCard.tsx#L28) 的 `<a className="button" href="/">`、[`ArtViewerHead.tsx:80-85`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/ArtViewerHead.tsx#L80-L85) 的下载链接、[`FingerprintDashboard.tsx:269-270`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintDashboard.tsx#L269-L270) 的导航按钮）。应在 `Button.tsx` 中同时导出共享 `.ui-btn` 样式的 `ButtonLink`（支持 Next.js `<Link>` 或原生 `<a download / target="_blank">`），防止业务层再次手写散装链接按钮类。
   - **漏洞 B（`ConfirmButtonProps` 缺少 `confirmPrompt` 与异步 `busy` / `error` 支持）**：对照 [`FingerprintSampleDrawer.tsx:131-142`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintSampleDrawer.tsx#L131-L142)（展开确认时需在确认按钮左侧显示警告语 `fp.drawer.resetConfirmText`）和 [`StopRunButton.tsx:18-45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/StopRunButton.tsx#L18-L45)（需支持 `stopping` 外部锁定态与异步 `onConfirm: () => Promise<void> | void`），`ConfirmButtonProps` 必须补充：
     ```tsx
     export interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
       confirmLabel: React.ReactNode;
       cancelLabel?: React.ReactNode;
       confirmPrompt?: React.ReactNode; // 展开二次确认时显示的警示文案
       onConfirm: () => Promise<void> | void;
     }
     ```
2. **原语 3 `FormControls`**：
   - **笔误修正**：方案 [`DESIGN_SYSTEM_AND_COMPONENT_PLAN.md:237`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md#L237) 路径写成了 `src/app/components/ui/ form-controls.css`（多了一个空格），需修正。
   - **补充 `FormFieldProps` 接口**：为替代 [`ModelFingerprintSection.tsx:118-143`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/ModelFingerprintSection.tsx#L118-L143) 中的内联样式 `NumericInputField`，`FormField` 应支持 `layout?: "stack" | "inline"`（`inline` 对应左右两端对齐 `justify-content: space-between` 的紧凑表单项）。
3. **原语 4 `StatusPill`**：
   - **补充交互态支持**：[`ModelModalHeader.tsx:58-66`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModalHeader.tsx#L58-L66) 的 `.modal-standard-pill` 是可点击展开黄金标准的 `<button>` 胶囊。`StatusPillProps` 应增加可选的 `onClick?: () => void`（传入时渲染 `<button type="button" className="ui-pill is-interactive">`，未传时渲染 `<span>`）。
4. **原语 5 `Modal`**：
   - **补充 `ariaLabel`、`subHeader`、`footer` 与 `portal` 属性**：
     - [`FingerprintCheckModal.tsx:58,62-67`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckModal.tsx#L58) 的 `title` 包含复杂的 `<ProfileName>` 交互组件，因此需要独立的纯文本 `ariaLabel?: string` 作为 `<section role="dialog" aria-label={...}>` 的无障碍名称；
     - [`ModelModal.tsx:63`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/model-modal/ModelModal.tsx#L63) 在 `.modal-head` 与滚动区 `.modal-body` 之间夹了一层固定不随卡片滚动的 `<ModelStandardPanel />`，因此 `ModalProps` 需提供 `subHeader?: React.ReactNode`；
     - [`RunOnceProfileModal.tsx:78-94`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/components/run-control/RunOnceProfileModal.tsx#L78-L94) 与 [`DataRepoPushDialog.tsx:70-77`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/config/DataRepoPushDialog.tsx#L70-L77) 均包含固定在模态窗底部的操作栏，因此 `ModalProps` 需提供 `footer?: React.ReactNode`。
5. **原语 6 `Drawer` & `Collapsible`**：
   - **`CollapsibleProps` 必须支持右侧摘要槽 `summaryExtra`**：在 [`FingerprintCheckTechDrawer.tsx:33-38`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L33-L38)（右侧显示 `record.appliedEffort`）和 [`JudgeDrawer.tsx:30-45`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/view/JudgeDrawer.tsx#L30-L45)（右侧显示 `<JudgeStatusBadge />` 与 `.judge-meta`）中，`<summary>` 均为左标题（带旋转三角）+ 右侧元数据布局。`CollapsibleProps` 应定义为：
     ```tsx
     export interface CollapsibleProps {
       title: React.ReactNode;
       summaryExtra?: React.ReactNode;
       defaultOpen?: boolean;
       className?: string;
       children: React.ReactNode;
     }
     ```
6. **原语 8 `AlertBanner` & `EmptyState`**：
   - `AlertBannerProps` 应明确支持 `tone?: "info" | "ok" | "warn" | "err"`、`title?: React.ReactNode`、`actions?: React.ReactNode`、`onDismiss?: () => void`，从而统一承载 `FillPlanPreviewBox`（带 Profile 下拉框与确认/取消按钮）、`MatrixBundleBanner`（带关闭按钮）与错误提示横幅。

---

## 四、 代码长度门禁（`config/code-length-policy.yaml`）合规性预审

根据 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L4-L11) 与 [`scripts/code-length/checker.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/checker.ts#L18-L27)，门禁硬上限为：
- **文件行数**：`.ts` ≤ 500 行，`.tsx` ≤ 300 行，`.css` ≤ 300 行；
- **函数行数**：`.ts` 命名函数 ≤ 50 行，`.tsx` 命名函数/组件 ≤ 80 行。

### 4.1 致命门禁冲突 1：单个 `ui.css` 必然突破 `.css` 300 行红线

方案 §3.1 第 195 行写明“在 `src/app/components/ui/ui.css` 汇总”，同时在各原语小节又列出了 `page-header.css`、`button.css`、`form-controls.css`、`status-pill.css`、`modal.css`、`drawer.css`、`data-table.css`、`feedback.css` 共 8 个 CSS 文件。
- **行数测算**：8 个原语的完整 CSS 规则（含 hover / focus / disabled 状态、语义色变体与 `@media (max-width: 640px)` 响应式规则）合计约 **430～470 行**。若全部写入单个 `ui.css`，将直接超出 300 行上限约 150 行！
- **反碎片化收敛方案**：不要建 8 个碎片 CSS 文件再加 1 个空壳 `ui.css`（那会重演 [`02-line-limit-driven-fragmentation.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/pelican-component-architecture/02-line-limit-driven-fragmentation.md#L19-L36) 批评的 `@import` 空壳聚合器反模式）。应将 `src/app/components/ui/` 的样式按职责内聚为 **3 个独立的 `.css` 文件**（由 `src/app/globals.css` 直接 `@import`）：

| CSS 文件路径 | 覆盖的原语范围 | 预计行数 | 门禁上限 | 余量评估 |
| :--- | :--- | :---: | :---: | :--- |
| `src/app/components/ui/ui-controls.css` | `Button`, `ConfirmButton`, `ButtonLink`, `FormControls` (`.ui-field`, `.ui-input`, `.ui-select`, `.ui-check-row`), `StatusPill` | ~165 行 | 300 行 | 安全（余 ~135 行） |
| `src/app/components/ui/ui-overlays.css` | `Modal` (`.ui-modal-backdrop`, `.ui-modal`, 尺寸变体与移动端 `@media`), `Drawer`, `Collapsible` | ~155 行 | 300 行 | 安全（余 ~145 行） |
| `src/app/components/ui/ui-layout.css` | `PageShell`, `PageHeader`, `DataTable` (`matrix` + `compact` + sticky 列), `AlertBanner`, `EmptyState` | ~160 行 | 300 行 | 安全（余 ~140 行） |

### 4.2 致命门禁冲突 2：方案 §4.1 并入组件后的 `.tsx` 文件与函数行数超限风险

方案 §4.1（[`DESIGN_SYSTEM_AND_COMPONENT_PLAN.md:310-313`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/ui/DESIGN_SYSTEM_AND_COMPONENT_PLAN.md#L310-L313)）计划拆解 `FingerprintCheckSections.tsx`（240 行）：
1. **风险点 A：`CheckLauncherFooter`（45 行）+ `UnreadyBaselineNote`（31 行）直接并入 `FingerprintCheckPanel.tsx`（当前 237 行）**：
   - `237 + 45 + 31 = 313 行` > **300 行上限（超限 13 行！）**。
   - **前置减重动作**：在并入前，必须先让 `FingerprintCheckPanel.tsx` 复用主看板的 `RunOnceHeadBar`（通过给 `RunOnceHeadBar` 增加可选的 `secondColumnTitle?: string` 属性，省去 `FingerprintCheckPanel.tsx:199-209` 重复手写的头部 JSX），并将 `FingerprintCheckPanel.tsx` 中与 `useRunOnceProfiles` 重复的选择状态机收敛，使 `FingerprintCheckPanel.tsx` 总行数控制在 **210 行以内**。
2. **风险点 B：`CheckProbeAttemptsSection`（52 行）并入 `FingerprintCheckTechDrawer.tsx`（当前 174 行）**：
   - 文件总行数 `174 + 52 = 226 行`（经过 `Collapsible` 与 `DataTable` 原语替换后约 **185 行**，低于 300 行上限）。
   - **函数行数红线提醒**：`CheckProbeAttemptsSection`（约 45 行）、`ProbeBreakdownTable`（约 55 行）、`CandidateComparisonTable`（约 35 行）**必须保持为文件内的独立命名子组件函数**，严禁内联进 `CheckTechDrawer` 主函数，以确保每个函数均远低于 `.tsx` 80 行函数上限。

### 4.3 `src/app/components/ui/` 各原语文件与函数行数预算表

| 文件路径 | 导出符号 | 预计文件行数 | 文件上限 | 最大单函数预计行数 | 函数上限 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `ui/use-overlay-stack.ts` | `useOverlayBehavior`, `hasActiveOverlay` | ~75 行 | 500 行 (`.ts`) | ~38 行 | 50 行 (`.ts`) |
| `ui/PageHeader.tsx` | `PageShell`, `PageHeader` | ~70 行 | 300 行 (`.tsx`) | ~45 行 | 80 行 (`.tsx`) |
| `ui/Button.tsx` | `Button`, `ButtonLink`, `ConfirmButton` | ~115 行 | 300 行 (`.tsx`) | ~45 行 | 80 行 (`.tsx`) |
| `ui/FormField.tsx` | `FormField`, `CheckboxField` | ~65 行 | 300 行 (`.tsx`) | ~30 行 | 80 行 (`.tsx`) |
| `ui/StatusPill.tsx` | `StatusPill` | ~45 行 | 300 行 (`.tsx`) | ~30 行 | 80 行 (`.tsx`) |
| `ui/Modal.tsx` | `Modal` | ~95 行 | 300 行 (`.tsx`) | ~60 行 | 80 行 (`.tsx`) |
| `ui/Drawer.tsx` | `Drawer`, `Collapsible` | ~90 行 | 300 行 (`.tsx`) | ~45 行 | 80 行 (`.tsx`) |
| `ui/DataTable.tsx` | `DataTable` | ~45 行 | 300 行 (`.tsx`) | ~30 行 | 80 行 (`.tsx`) |
| `ui/AlertBanner.tsx` | `AlertBanner`, `EmptyState` | ~80 行 | 300 行 (`.tsx`) | ~40 行 | 80 行 (`.tsx`) |

---

## 五、 针对 `DESIGN_SYSTEM_AND_COMPONENT_PLAN.md` 的具体修订清单

### Must-Fix（阻断性问题，合入或开工前必须修订方案）

1. **[Must-Fix 1] 修订 §3.1 原语 5（`Modal`）与原语 6（`Drawer`）的 Portal 策略与组件树位置**：
   - 删除“内部统一无条件通过 `createPortal(..., document.body)` 挂载”的表述；
   - 改为：**（a）在组件树层面将 `RunOnceProfileModal` 上移至 `.run-once-panel` 外部（作为 `Menu` 内与 `.menu-panel` 并列的兄弟节点或 `RunOnceMenu` 根部兄弟节点），从根源消除 `transform` 包含块陷阱**；**（b）`Modal` 与 `Drawer` 提供 `portal?: boolean`（默认 `false`），且当 `portal={true}` 时仅在客户端 `useEffect` 挂载后调用 `createPortal`，在 SSR 与 `renderToStaticMarkup` 阶段一律原位渲染完整 DOM 子树**；**（c）`useMenuDismiss` 接入 `hasActiveOverlay()`，当存在栈顶浮层时自动忽略外部 `pointerdown` 与 `Escape`**。
2. **[Must-Fix 2] 修订 §3.1 的 CSS 文件组织方案，消除 `ui.css` 突破 300 行门禁的风险**：
   - 将 `src/app/components/ui/` 的样式明确划分为 `ui-controls.css`、`ui-overlays.css`、`ui-layout.css` 3 个内聚样式文件（每个约 150～165 行，均低于 300 行门禁），并在 `src/app/globals.css` 中直接引入，避免单文件超 300 行或制造 8 个碎片 CSS 文件。
3. **[Must-Fix 3] 修订 §3.1 原语 1（`PageHeader`）的适用范围**：
   - 明确 `PageHeader` **专职统一 4 个二级/工具页面（`/fingerprint`、`/config`、`/view`、`/pair`）**，不强行包裹首页 `/` 的 4 区 `Toolbar.tsx`；首页 `Toolbar` 保持领域组件定位，在内部复用 `ui/Button`、`ui/StatusPill`、`Menu`、`RunStatus` 与 `LanguageSwitch`。
   - `PageHeader` 的 `subtitle` 容器改用 `<div className="ui-page-subtitle">` 而非 `<p>`，以合法容纳 `/view` 页的 `.viewer-meta` 与 `.badges` 块级元素。
4. **[Must-Fix 4] 在 §4.1 与 §六 补充 `FingerprintCheckPanel.tsx` 行数减重前置步骤及 51 个 HTML 特征测试夹具的更新规范**：
   - 在将 `CheckLauncherFooter` 并入 `FingerprintCheckPanel.tsx`（当前 237 行）之前，先复用参数化后的 `RunOnceHeadBar`（新增 `secondColumnTitle?: string`）并抽离重复的 Profile 选择计算，防止合并后突破 `.tsx` 300 行门禁；
   - 在 §六 Phase 2 与 Phase 3 验收标准中明确：当重构 `ModelModal`、`DataRepoPushDialog`、`TargetTable`、`PairForm`、`ArtViewer`、`StopRunButton` 等受 `test/fixtures/markup/wp-{f,g,h,l,p}/*.html` 保护的组件时，须審查 HTML diff 并通过 `UPDATE_FIXTURES=1` / `UPDATE_MARKUP_FIXTURES=1` 同步更新特征夹具，同时同步更新 `test/core/model-fingerprint/ui-model.test.ts` 中的类名断言。

### Should-Fix（重要改进建议，提升 API 完备性与防呆能力）

1. **[Should-Fix 1] 完善 `DataTable` 的双列 Sticky 解耦机制（§3.1 原语 7）**：
   - 在 `DataTableProps` 中提供 `variant?: "matrix" | "compact"` 与 `stickyFirstColWidth?: string`，并通过 `.ui-col-sticky-1` / `.ui-col-sticky-2` + `--ui-sticky-col-1-w` CSS 变量实现双列冻结，同时将 `--ui-sticky-col-1-w` 加入 §五 规则 `UI-01` 的 `--*` 动态 CSS 变量白名单。
2. **[Should-Fix 2] 补齐 `ModalProps` 的 `ariaLabel`、`subHeader` 与 `footer` 插槽（§3.1 原语 5）**：
   - 满足 `FingerprintCheckModal`（标题内含 `<ProfileName>` 按钮，需独立纯文本 `aria-label`）、`ModelModal`（头部下方固定 `<ModelStandardPanel />`）与 `RunOnceProfileModal` / `DataRepoPushDialog`（底部固定操作栏）的真实结构需求。
3. **[Should-Fix 3] 补齐 `ButtonLink` 以及 `ConfirmButtonProps.confirmPrompt`（§3.1 原语 2）**：
   - 导出共享 `.ui-btn` 样式的 `ButtonLink`（兼容 `<Link>` 与 `<a download>`），并在 `ConfirmButtonProps` 中支持 `confirmPrompt?: React.ReactNode` 与异步 `onConfirm: () => Promise<void> | void`。
4. **[Should-Fix 4] 补齐 `CollapsibleProps.summaryExtra` 与 `StatusPillProps.onClick`（§3.1 原语 4、6）**：
   - 让 `Collapsible` 原生支持 `<summary>` 右侧的徽章/元数据槽（替代 `JudgeDrawer` 与 `CheckTechDrawer` 的手写 `<summary>`），让 `StatusPill` 支持可点击胶囊（替代 `.modal-standard-pill`）。
5. **[Should-Fix 5] 修正 §3.1 原语 3 的路径笔误并补齐 `FormField` 接口**：
   - 将 `src/app/components/ui/ form-controls.css` 修正为归入 `ui-controls.css`，并定义 `FormField` 的 `layout?: "stack" | "inline"` 属性以消解 `ModelFingerprintSection.tsx` 的 18 处静态内联样式。
