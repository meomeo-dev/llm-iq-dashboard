# 鹈鹕看板组件规范

通用组件位于 [`src/app/components/ui/`](../../../src/app/components/ui/)。
组件消费[设计系统](design-system.md)的 Token，由业务页面提供文案、状态和数据。
在开发环境的 `/design-system` 中可操作首批样例。

| 组件 | 何时使用 | 变体与关键行为 | 验收条件 |
| --- | --- | --- | --- |
| [`PageShell`、`PageHeader`](../../../src/app/components/ui/PageHeader.tsx) | 需要页面边距、主标题、返回入口和页头操作 | `wide` / `narrow` / `full`；可选吸顶 | 标题、返回入口、操作在窄屏可换行，交互元素在标题之外 |
| [`Button`、`ButtonLink`、`ConfirmButton`](../../../src/app/components/ui/Button.tsx) | 触发操作、导航或请求二次确认 | `default` / `primary` / `danger` / `ghost`；支持 `busy` 与 `disabled` | 焦点可见；忙碌态不可重复触发；危险操作可取消；实心字色和底色配对 |
| [`FormField`、`CheckboxField`](../../../src/app/components/ui/FormField.tsx) | 为表单控件提供标签、提示和错误信息 | `stack` / `inline`；输入类为 `.ui-input` / `.ui-select` / `.ui-textarea` | 标签与控件关联；调用方用 `aria-describedby` 关联说明，用 `aria-invalid` 标记错误；焦点和错误同时可辨 |
| [`StatusPill`](../../../src/app/components/ui/StatusPill.tsx) | 展示简短状态或标签 | `neutral` / `accent` / `ok` / `warn` / `err`；`subtle` / `outline` / `solid`；可带圆点 | 状态文字独立可辨；可点击时有按钮语义；`solid` 使用中性实底 |
| [`Modal`](../../../src/app/components/ui/Modal.tsx) | 任务需要独立对话框或集中比较多件作品 | `sm` / `md` / `lg` / `columns`；可用 Portal | 有可访问名称；关闭按钮和 Esc 关闭栈顶；退出后回到原焦点 |
| [`Drawer`、`Collapsible`](../../../src/app/components/ui/Drawer.tsx) | 需查看侧栏详情或在原位展开补充信息 | 抽屉和模态框共享浮层栈；折叠面板可受控 | 抽屉打开时锁定背景滚动；折叠触发器反映展开状态 |
| [`DataTable`](../../../src/app/components/ui/DataTable.tsx) | 有明确行列关系的结果或配置数据 | `compact` 适合嵌入面板；`matrix` 提供横向滚动和冻结列 | 列标题可识别；超宽内容在表格容器内滚动 |
| [`AlertBanner`、`EmptyState`](../../../src/app/components/ui/AlertBanner.tsx) | 提供操作结果、错误原因或空结果引导 | 横幅可用 `status` / `alert`；空状态可提供操作 | 错误和空结果文案说明原因或下一步；可关闭横幅有按钮名称 |

控件样式在 [`ui-controls.css`](../../../src/app/components/ui/ui-controls.css)，
浮层样式在 [`ui-overlays.css`](../../../src/app/components/ui/ui-overlays.css)，
页面、表格和反馈样式在 [`ui-layout.css`](../../../src/app/components/ui/ui-layout.css)。
业务布局的样式与业务组件同目录。

## 首批样例走查

- **设计基础**：色样来自根节点 Token；字阶直接渲染 `--text-*`。
- **操作**：用鼠标和 Tab 检查主按钮、次按钮和禁用态。对比主按钮默认、主按钮
  悬停、危险按钮悬停时的字色和背景。
- **表单**：激活标签检查输入焦点；用 Tab 进入错误字段，确认焦点环、错误边框
  和错误文字同时可见。
- **浮层**：打开对话框或抽屉，按 Esc 关闭，确认焦点回到打开它的按钮。
- **调用结果**：核对四种调用结果的文字；取消清空操作后表格仍在，
  确认清空后显示反馈与空状态，恢复操作重新显示原表格。
- **窄屏**：色样重排、组件堆叠，主页面无横向溢出；检查中英文两种文案。
