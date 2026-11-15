# 指纹模块 TSX 内联样式（`style={{ ... }}`）与魔法数值普查报告

## 1. 全量统计与横向对比

对 `src/app/fingerprint/*.tsx`（共 12 个 TSX 文件）及 `src/app/config/ModelFingerprintSection.tsx` 进行全量静态扫描，共检出 **62 处 `style=` 内联样式属性**（其中 `src/app/fingerprint/*.tsx` 44 处，`src/app/config/ModelFingerprintSection.tsx` 18 处）。

排除 8 处合理的数据驱动动态几何/哈希色值绑定（如进度条宽度百分比 `width: `${row.barPercent}%``、时间线横坐标 `left: x`、上游颜色点 `background: profileColor(...)`），其余 **54 处（占比 87.1%）全部是静态布局、字号、字重、颜色、间距或跨组件样式冲突的硬编码内联补丁**。

### 1.1 与仓库其余模块的密度对比

- **配置页 `/config` 目录对比**：`src/app/config/` 下共 40 个 `.tsx` 文件，其中 **38 个文件 `style=` 数量为 0**，[TimeoutForm.tsx](../../../../src/app/config/TimeoutForm.tsx#L137) 仅 1 处，而 **[ModelFingerprintSection.tsx](../../../../src/app/config/ModelFingerprintSection.tsx) 单文件就有 18 处**，占整个 `/config` 目录内联样式总数的 **94.7%（18/19）**。
- **主看板组件库 `src/app/components/` 对比**：`src/app/components/` 下全部 TSX 文件的 `style=` 绝大多数仅用于时间线坐标（`left`、`width`）与 `profileColor()` 动态圆点着色；而 `src/app/fingerprint/` 将 Flex/Grid 容器布局、表头/单元格字重、次要说明文字字号与颜色、横幅状态色全部写进了 JSX `style={{ ... }}`。

### 1.2 逐文件内联样式数量汇总表

| 序号 | 文件路径 | 总行数 | `style=` 总数 | 静态样式/覆盖补丁数 | 动态数据绑定数 |
| --- | --- | --- | --- | --- | --- |
| 1 | [src/app/config/ModelFingerprintSection.tsx](../../../../src/app/config/ModelFingerprintSection.tsx) | 294 | **18** | **18** | 0 |
| 2 | [src/app/fingerprint/FingerprintSampleDrawer.tsx](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx) | 210 | **10** | **10** | 0 |
| 3 | [src/app/fingerprint/FingerprintCheckTechDrawer.tsx](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx) | 174 | **9** | **9** | 0 |
| 4 | [src/app/fingerprint/FingerprintCheckTile.tsx](../../../../src/app/fingerprint/FingerprintCheckTile.tsx) | 164 | **5** | **3** | 2 |
| 5 | [src/app/fingerprint/FingerprintMatrix.tsx](../../../../src/app/fingerprint/FingerprintMatrix.tsx) | 231 | **4** | **4** | 0 |
| 6 | [src/app/fingerprint/FingerprintMatrixHead.tsx](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx) | 235 | **4** | **4** | 0 |
| 7 | [src/app/fingerprint/FingerprintCheckModal.tsx](../../../../src/app/fingerprint/FingerprintCheckModal.tsx) | 136 | **4** | **3** | 1 |
| 8 | [src/app/fingerprint/FingerprintCheckSections.tsx](../../../../src/app/fingerprint/FingerprintCheckSections.tsx) | 240 | **3** | **3** | 0 |
| 9 | [src/app/fingerprint/FingerprintCheckDetail.tsx](../../../../src/app/fingerprint/FingerprintCheckDetail.tsx) | 233 | **2** | 0 | 2 |
| 10 | [src/app/fingerprint/FingerprintCheckTimeline.tsx](../../../../src/app/fingerprint/FingerprintCheckTimeline.tsx) | 288 | **2** | 0 | 2 |
| 11 | [src/app/fingerprint/FingerprintDashboard.tsx](../../../../src/app/fingerprint/FingerprintDashboard.tsx) | 281 | **1** | **1** | 0 |
| 12 | [src/app/fingerprint/FingerprintCheckPanel.tsx](../../../../src/app/fingerprint/FingerprintCheckPanel.tsx) | 237 | **0** | 0 | 0 |
| 13 | [src/app/fingerprint/page.tsx](../../../../src/app/fingerprint/page.tsx) | 112 | **0** | 0 | 0 |
| **合计** | — | **2,635** | **62** | **55**（含混合项） | **7**（纯动态） |

> 注：[FingerprintCheckModal.tsx:106-111](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L106-L111) 的 `style` 对象同时包含动态 CSS 变量 `"--upstream-count": records.length` 与覆盖主看板列宽的硬编码 `gridTemplateColumns: \`repeat(${records.length}, minmax(310px, 1fr))\``；[FingerprintCheckTile.tsx:80](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L80) 同时包含动态 `background: profileColor(normProf)` 与冗余静态属性 `flex: "none"`（`.profile-dot` 在 [profile.css:4](../../../../src/app/components/profile/profile.css#L4) 中已声明 `flex: none`）。

---

## 2. 逐文件内联样式与魔法数值完整清单

### 2.1 [src/app/config/ModelFingerprintSection.tsx](../../../../src/app/config/ModelFingerprintSection.tsx)（共 18 处，全部为静态布局/排版样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L80](../../../../src/app/config/ModelFingerprintSection.tsx#L80) | `<div className="field-row">` | `style={{ justifyContent: "space-between" }}` | 在 `.field-row` 上重复手写两端对齐（同文件 L80、L226、L272 重复 3 次） |
| [L91](../../../../src/app/config/ModelFingerprintSection.tsx#L91) | `<div className="stack">` | `style={{ gap: "8px" }}` | 覆写 [config-base.css:36](../../../../src/app/config/config-base.css#L36) `.stack` 的 `gap: 12px` |
| [L92](../../../../src/app/config/ModelFingerprintSection.tsx#L92) | `<span>` | `style={{ fontSize: "12.5px", color: "var(--text-dim)" }}` | 手写小节标题字号与颜色（同文件 L92、L227、L273 逐字重复 3 次） |
| [L94-L98](../../../../src/app/config/ModelFingerprintSection.tsx#L94-L98) | `<div>` | `style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px 16px" }}` | 探针复选框网格直接内联硬编码，`minmax(220px, 1fr)` 与间距 `8px 16px` 未抽类 |
| [L128](../../../../src/app/config/ModelFingerprintSection.tsx#L128) | `<label>` | `style={{ justifyContent: "space-between" }}` | 在 `NumericInputField` 的列向 `<label>` 上写 `justifyContent: "space-between"` |
| [L129](../../../../src/app/config/ModelFingerprintSection.tsx#L129) | `<span>` | `style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}` | 单行截断省略三联属性直接内联手写 |
| [L165-L170](../../../../src/app/config/ModelFingerprintSection.tsx#L165-L170) | `<div className="grid-fields">` | `style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", alignItems: "end", gap: "12px" }}` | `.grid-fields` 在全仓 CSS 中**未定义**；此处用 `minmax(190px, 1fr)` + `gap: 12px`，与 L96 的 `220px` / `8px 16px` 及 L240 的 `220px` / `10px 12px` 形成同一组件内 3 种不同的 Grid 参数 |
| [L172](../../../../src/app/config/ModelFingerprintSection.tsx#L172) | `<label>` | `style={{ justifyContent: "space-between" }}` | 与 L128 重复 |
| [L225](../../../../src/app/config/ModelFingerprintSection.tsx#L225) | `<div className="stack">` | `style={{ gap: "8px", paddingTop: "6px", borderTop: "1px dashed var(--border)" }}` | 分隔虚线与内边距直接手写（注意此处 `paddingTop: "6px"`，而 L271 同一结构却写成 `paddingTop: "10px"`，且 [config-matrix.css:38-39](../../../../src/app/config/config-matrix.css#L38-L39) 已有 `.manual-model { padding-top: 10px; border-top: 1px dashed var(--border); }`，[config-timeout.css:10-11](../../../../src/app/config/config-timeout.css#L10-L11) 也有相同模式） |
| [L226](../../../../src/app/config/ModelFingerprintSection.tsx#L226) | `<div className="field-row">` | `style={{ justifyContent: "space-between" }}` | 与 L80、L272 重复 |
| [L227](../../../../src/app/config/ModelFingerprintSection.tsx#L227) | `<span>` | `style={{ fontSize: "12.5px", color: "var(--text-dim)" }}` | 与 L92、L273 重复 |
| [L238-L243](../../../../src/app/config/ModelFingerprintSection.tsx#L238-L243) | `<div className="grid-fields">` | `style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", alignItems: "end", gap: "10px 12px" }}` | 再次挂未定义的 `.grid-fields` 并手写第 3 套 Grid 列宽与间距参数 |
| [L271](../../../../src/app/config/ModelFingerprintSection.tsx#L271) | `<div className="stack">` | `style={{ gap: "8px", paddingTop: "10px", borderTop: "1px dashed var(--border)" }}` | 与 L225 结构完全相同，但 `paddingTop` 从 `6px` 变成 `10px` |
| [L272](../../../../src/app/config/ModelFingerprintSection.tsx#L272) | `<div className="field-row">` | `style={{ justifyContent: "space-between" }}` | 与 L80、L226 重复 |
| [L273](../../../../src/app/config/ModelFingerprintSection.tsx#L273) | `<span>` | `style={{ fontSize: "12.5px", color: "var(--text-dim)" }}` | 与 L92、L227 重复 |
| [L274](../../../../src/app/config/ModelFingerprintSection.tsx#L274) | `<div className="field-row">` | `style={{ gap: "8px" }}` | 覆写 `.field-row` 默认的 `gap: 12px` |
| [L279](../../../../src/app/config/ModelFingerprintSection.tsx#L279) | `<p className="note">` | `style={{ margin: 0 }}` | [config-base.css:124-127](../../../../src/app/config/config-base.css#L124-L127) `.note` 未归零 `<p>` 默认外边距，此处临时用内联 `margin: 0` 修补 |
| [L283](../../../../src/app/config/ModelFingerprintSection.tsx#L283) | `<div className="field-row">` | `style={{ gap: "6px" }}` | 同一组件内 `.field-row` 出现默认 `12px`、L274 `8px`、L283 `6px` 三种间距 |

---

### 2.2 [src/app/fingerprint/FingerprintSampleDrawer.tsx](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx)（共 10 处，全部为静态布局/排版/状态色样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L75](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L75) | `<p>` | `style={{ color: "var(--text-dim)" }}` | 空状态文案未复用空状态类，直接内联颜色（注意 [FingerprintMatrix.tsx:73](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L73) 写的是 `style={{ color: "var(--text-dim)", margin: 0 }}`，此处漏写 `margin: 0`） |
| [L77](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L77) | `<div>` | `style={{ display: "flex", flexDirection: "column", gap: "10px" }}` | 抽屉内采样记录列表容器未在 `fingerprint.css` 定义类名，直接内联 Flex 列布局 |
| [L108](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L108) | `<div className="fp-btn-row">` | `style={{ justifyContent: "space-between" }}` | 把原本用于按钮组的 `.fp-btn-row`（`display: inline-flex`）当成整行两端对齐容器使用 |
| [L114](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L114) | `<span>` | `style={{ color: "var(--text-dim)" }}` | 次要统计文字内联改色 |
| [L118](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L118) | `<div>` | `style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}` | 探针内自相似度说明文字内联写死 `12px` 与 `marginTop: "2px"` |
| [L136](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L136) | `<span>` | `style={{ fontSize: "12px", color: "var(--warn)" }}` | 二次确认警告文字直接内联写死字号与语义色 |
| [L166](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L166) | `<div className="fp-btn-row">` | `style={{ justifyContent: "space-between" }}` | 与 L108 重复，在 `.fp-attempt-item` 顶栏强行覆盖 `.fp-btn-row` 对齐方式 |
| [L174](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L174) | `<span>` | `style={{ fontSize: "11px", color: "var(--text-dim)" }}` | 采样卡片元数据行内联写死 `11px` 次要字色 |
| [L197](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L197) | `<div>` | `style={{ fontSize: "12px", color: "var(--err)" }}` | 拒绝原因报错文本未定义 `.fp-attempt-error` 类，直接内联 |
| [L201](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L201) | `<div>` | `style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "2px" }}` | 有效样本值列表标题内联写死 `11px` 与 `marginBottom: "2px"` |

---

### 2.3 [src/app/fingerprint/FingerprintCheckTechDrawer.tsx](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx)（共 9 处，全部为静态表格/标题排版样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L83](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L83) | `<h3>` | `style={{ margin: "0 0 8px", fontSize: "13px" }}` | 抽屉内子表标题未在 `.fp-tech-body h3` 中定义，直接内联写死 |
| [L95](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L95) | `<tr>` | `style={{ background: "var(--surface-hi)" }}` | 均值汇总行背景色直接内联，未抽为 `.fp-row-summary` 类 |
| [L96](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L96) | `<td>` | `style={{ fontWeight: 600 }}` | 汇总行首列加粗内联手写 |
| [L104](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L104) | `<td key={m}>` | `style={{ fontWeight: 600 }}` | 汇总行数值列加粗内联手写 |
| [L107](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L107) | `<span>` | `style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}` | 在 `fontWeight: 600` 的 `<td>` 内为了抵消父级加粗，再内联写 `fontWeight: 400`（与 [FingerprintMatrixHead.tsx:219, 223](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L219-L223) 完全相同的反模式） |
| [L121](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L121) | `<td key={m}>` | `style={{ fontWeight: m === record.declaredModel ? 600 : 400 }}` | 声明模型列高亮未使用语义类名（如 `.is-declared`），直接三元运算写内联 `fontWeight` |
| [L140](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L140) | `<h3>` | `style={{ margin: "0 0 8px", fontSize: "13px" }}` | 与 L83 逐字重复 |
| [L159](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L159) | `<td>` | `style={{ fontWeight: 600 }}` | 候选模型自相似分列内联加粗 |
| [L160](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L160) | `<td>` | `style={{ color: c.scoreDiff < 0 ? "var(--text)" : "var(--text-dim)", fontWeight: c.scoreDiff < 0 ? 600 : 400 }}` | 差值列状态样式不用 modifier class，直接在 JSX 内写双三元表达式拼装 `style` |

---

### 2.4 [src/app/fingerprint/FingerprintCheckTile.tsx](../../../../src/app/fingerprint/FingerprintCheckTile.tsx)（共 5 处：2 处动态绑定 + 3 处静态布局/冲突覆盖）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L70](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L70) | `<button className="folder fp-folder ...">` | `style={{ left: x }}` | **合理动态绑定**：时间轴横坐标定位 |
| [L76](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L76) | `<span className="fp-folder-verdict ...">` | `style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}` | **静态样式遗漏**：[fingerprint-timeline.css:43-48](../../../../src/app/fingerprint/fingerprint-timeline.css#L43-L48) 已定义 `.fp-folder-verdict`，却把 `display: inline-flex; align-items: center; gap: 5px` 留在了 TSX 内联样式中（且导致 `display: inline-flex` 与 CSS 中的 `text-overflow: ellipsis` 互相冲突，使外层省略号失效） |
| [L80](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L80) | `<span className="profile-dot">` | `style={{ background: profileColor(normProf), flex: "none" }}` | **混合项**：`background` 为动态绑定，但 `flex: "none"` 与 [profile.css:4](../../../../src/app/components/profile/profile.css#L4) 的 `.profile-dot { flex: none; }` 重复 |
| [L87](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L87) | `<span>` | `style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}` | **静态布局内联**：`.fp-folder-head` 右侧包裹元素未命名类名，直接手写 `inline-flex` |
| [L89](../../../../src/app/fingerprint/FingerprintCheckTile.tsx#L89) | `<span className="folder-count">` | `style={{ position: "static" }}` | **跨组件样式冲突补丁**：强行覆盖 [profile.css:151](../../../../src/app/components/profile/profile.css#L151) `.folder-count` 的 `position: absolute; top: 5px; left: 6px;` |

---

### 2.5 [src/app/fingerprint/FingerprintMatrix.tsx](../../../../src/app/fingerprint/FingerprintMatrix.tsx)（共 4 处，全部为静态样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L73](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L73) | `<p>` | `style={{ color: "var(--text-dim)", margin: 0 }}` | 矩阵空状态文本内联硬编码 |
| [L123](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L123) | `<div>` | `style={{ fontWeight: 600 }}` | `.fp-col-model` 内的模型名未定义类名，直接内联加粗 |
| [L124](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L124) | `<div>` | `style={{ fontSize: "11px", color: "var(--text-dim)" }}` | `.fp-col-model` 内的可用探针计数副标题直接内联 `11px` 与次要字色（而紧邻的 `.fp-col-cli` 却在 [fingerprint-matrix.css:61-67](../../../../src/app/fingerprint/fingerprint-matrix.css#L61-L67) 定义了 `.fp-col-cli-ver { font-size: 11px; color: var(--text-dim); }`，紧挨着的两列一列走 CSS 类、一列走内联样式） |
| [L196](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L196) | `<div className="fp-job-banner">` | `style={{ flexWrap: "wrap" }}` | [fingerprint.css:63-73](../../../../src/app/fingerprint/fingerprint.css#L63-L73) 定义 `.fp-job-banner` 时漏写了 `flex-wrap: wrap`，导致此处用内联修补 |

---

### 2.6 [src/app/fingerprint/FingerprintMatrixHead.tsx](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx)（共 4 处，全部为静态样式/状态色覆盖）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L145](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L145) | `<input type="file">` | `style={{ display: "none" }}` | 隐藏文件输入框内联样式（可用 `hidden` HTML 属性或 `.sr-only` / `.is-hidden` 类替代） |
| [L186](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L186) | `<div className="fp-job-banner">` | `style={{ borderColor: isOk ? "var(--ok)" : "var(--err)", color: isOk ? "var(--text)" : "var(--err)" }}` | `.fp-job-banner` 缺少 `.tone-ok` / `.tone-err` 状态修饰类，直接在 JSX 内拼接 `borderColor` 与 `color`（与 [FingerprintDashboard.tsx:274](../../../../src/app/fingerprint/FingerprintDashboard.tsx#L274) 重复） |
| [L219](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L219) | `<span>` | `style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}` | 在 `<th>`（`font-weight: 600`）内部手写 `fontWeight: 400`、`fontSize: "11px"` 抵消表头样式 |
| [L223](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L223) | `<div>` | `style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}` | 与 L219 完全相同，在相邻 4 行内连续复制粘贴两次 |

---

### 2.7 [src/app/fingerprint/FingerprintCheckModal.tsx](../../../../src/app/fingerprint/FingerprintCheckModal.tsx)（共 4 处：1 处动态变量 + 3 处静态/覆盖样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L49 / L55](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L49-L55) | `<section className="modal fp-check-modal ...">` | `const modalStyle = { "--upstream-count": ordered.length } as CSSProperties;` → `style={modalStyle}` | **合理动态绑定**：向 CSS 传递上游列数变量 |
| [L62](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L62) | `<h2 className="modal-title">` | `style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}` | **静态样式覆盖**：直接用内联样式改写主看板 [model-modal-dialog.css:42-46](../../../../src/app/components/model-modal/model-modal-dialog.css#L42-L46) `.modal-title` 的布局盒子 |
| [L106-L111](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L106-L111) | `<div className="profile-matrix">` | `const style = { "--upstream-count": records.length, gridTemplateColumns: \`repeat(${records.length}, minmax(310px, 1fr))\` } as CSSProperties;` → `style={style}` | **跨组件样式冲突补丁**：强行覆盖 [model-modal-content.css:38](../../../../src/app/components/model-modal/model-modal-content.css#L38) `.profile-matrix` 的 `56px repeat(var(--upstream-count), minmax(260px, 1fr))`，并将列最小宽度从 `260px` 硬编码改为 `310px` |
| [L125](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L125) | `<div key={rec.checkId}>` | `style={{ minWidth: 0 }}` | **静态样式遗漏**：[model-modal-content.css:44-46](../../../../src/app/components/model-modal/model-modal-content.css#L44-L46) 只写了 `.profile-matrix > .card { min-width: 0; }`，指纹页子项不是 `.card`，于是内联补 `minWidth: 0`（尽管 `.fp-check-card` 在 [fingerprint-check-modal.css:29](../../../../src/app/fingerprint/fingerprint-check-modal.css#L29) 已经有 `min-width: 0`，此处外层又多包了一层无类名 `<div>`） |

---

### 2.8 [src/app/fingerprint/FingerprintCheckSections.tsx](../../../../src/app/fingerprint/FingerprintCheckSections.tsx)（共 3 处，全部为静态样式）

| 行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [L194](../../../../src/app/fingerprint/FingerprintCheckSections.tsx#L194) | `<div>` | `style={{ display: "flex", flexDirection: "column", gap: "8px" }}` | 探针原始调用区块容器直接手写 Flex 列布局 |
| [L196](../../../../src/app/fingerprint/FingerprintCheckSections.tsx#L196) | `<div>` | `style={{ fontSize: "12px", color: "var(--text-dim)" }}` | 跳过/失败探针提示行直接手写 `12px` 与次要字色 |
| [L229](../../../../src/app/fingerprint/FingerprintCheckSections.tsx#L229) | `<code>` | `style={{ wordBreak: "break-all" }}` | 表格内原始输出文本折行直接内联手写 |

---

### 2.9 [src/app/fingerprint/FingerprintDashboard.tsx](../../../../src/app/fingerprint/FingerprintDashboard.tsx)、[FingerprintCheckDetail.tsx](../../../../src/app/fingerprint/FingerprintCheckDetail.tsx)、[FingerprintCheckTimeline.tsx](../../../../src/app/fingerprint/FingerprintCheckTimeline.tsx)（共 5 处：1 处静态 + 4 处动态绑定）

| 文件与行号 | 挂载元素 | 内联样式原文 | 缺陷类别与审查说明 |
| --- | --- | --- | --- |
| [FingerprintDashboard.tsx:274](../../../../src/app/fingerprint/FingerprintDashboard.tsx#L274) | `<div className="fp-job-banner">` | `style={{ borderColor: "var(--err)", color: "var(--err)" }}` | **静态状态覆盖**：`.fp-job-banner` 缺少 `.error` 修饰类，直接内联改色（且与 [FingerprintMatrixHead.tsx:186](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L186) 重复） |
| [FingerprintCheckDetail.tsx:140](../../../../src/app/fingerprint/FingerprintCheckDetail.tsx#L140) | `<div className="fp-sim-fill">` | `style={{ width: \`${row.barPercent}%\` }}` | **合理动态绑定**：相似度条宽度百分比 |
| [FingerprintCheckDetail.tsx:144](../../../../src/app/fingerprint/FingerprintCheckDetail.tsx#L144) | `<div className="fp-sim-bound-tick">` | `style={{ left: \`${row.boundPercent}%\` }}` | **合理动态绑定**：合格线刻度横坐标百分比 |
| [FingerprintCheckTimeline.tsx:126](../../../../src/app/fingerprint/FingerprintCheckTimeline.tsx#L126) | `<div>` | `style={{ width: st.width }}` | **合理动态绑定**：24 小时时间轴画布总宽度 |
| [FingerprintCheckTimeline.tsx:242](../../../../src/app/fingerprint/FingerprintCheckTimeline.tsx#L242) | `<span className="profile-dot">` | `style={{ background: profileColor(name) }}` | **合理动态绑定**：上游 Profile 哈希色点 |

---

## 3. “随手写 `style={{ ... }}`”对视觉一致性与可维护性的系统性破坏

通过对上述 54 处静态内联样式的归类分析，可以清晰看到缺乏原子样式类与组件原语所带来的四类工程退化：

### 3.1 同一视觉角色在不同组件（甚至同一文件）中参数漂移

因为没有抽离原子类或小组件，开发者每次凭记忆手写 `style={{ ... }}`，导致同类元素的视觉参数在不知不觉中发生偏移：
- **配置页自适应表单网格（3 处内联写出 3 套不同参数）**：
  - [ModelFingerprintSection.tsx:94-98](../../../../src/app/config/ModelFingerprintSection.tsx#L94-L98)：`gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px 16px"`
  - [ModelFingerprintSection.tsx:165-170](../../../../src/app/config/ModelFingerprintSection.tsx#L165-L170)：`gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", alignItems: "end", gap: "12px"`
  - [ModelFingerprintSection.tsx:238-243](../../../../src/app/config/ModelFingerprintSection.tsx#L238-L243)：`gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", alignItems: "end", gap: "10px 12px"`
  - 而 [fingerprint.css:202-206](../../../../src/app/fingerprint/fingerprint.css#L202-L206) 中明明定义了 `.fp-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }` 却一次都未被使用。
- **配置页分段虚线间距不一致**：
  - [ModelFingerprintSection.tsx:225](../../../../src/app/config/ModelFingerprintSection.tsx#L225) 写 `paddingTop: "6px", borderTop: "1px dashed var(--border)"`；
  - 相隔仅 46 行的 [ModelFingerprintSection.tsx:271](../../../../src/app/config/ModelFingerprintSection.tsx#L271) 写 `paddingTop: "10px", borderTop: "1px dashed var(--border)"`。
- **列表纵向间距（Column Stack Gap）随意取值**：
  - [FingerprintSampleDrawer.tsx:77](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L77) 写 `gap: "10px"`；
  - [FingerprintCheckSections.tsx:194](../../../../src/app/fingerprint/FingerprintCheckSections.tsx#L194) 写 `gap: "8px"`；
  - [fingerprint-check-modal.css:28, 268](../../../../src/app/fingerprint/fingerprint-check-modal.css#L28) 写 `gap: 12px`；
  - [fingerprint.css:106, 173](../../../../src/app/fingerprint/fingerprint.css#L106) 写 `gap: 14px`。

### 3.2 高频重复样板散落 JSX，丧失单点修改能力

- `style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}` 及其子集 `{ fontSize: "11px", color: "var(--text-dim)" }` 在 [FingerprintMatrix.tsx:124](../../../../src/app/fingerprint/FingerprintMatrix.tsx#L124)、[FingerprintMatrixHead.tsx:219, 223](../../../../src/app/fingerprint/FingerprintMatrixHead.tsx#L219-L223)、[FingerprintSampleDrawer.tsx:174, 201](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L174)、[FingerprintCheckTechDrawer.tsx:107](../../../../src/app/fingerprint/FingerprintCheckTechDrawer.tsx#L107) 中重复手写了 **6 次**。
- `style={{ fontSize: "12.5px", color: "var(--text-dim)" }}` 在 [ModelFingerprintSection.tsx:92, 227, 273](../../../../src/app/config/ModelFingerprintSection.tsx#L92) 中重复手写了 **3 次**。
- `style={{ justifyContent: "space-between" }}` 在 [ModelFingerprintSection.tsx:80, 128, 172, 226, 272](../../../../src/app/config/ModelFingerprintSection.tsx#L80) 与 [FingerprintSampleDrawer.tsx:108, 166](../../../../src/app/fingerprint/FingerprintSampleDrawer.tsx#L108) 中重复手写了 **7 次**。

### 3.3 掩盖组件抽象缺失与 CSS 契约冲突

当已有 CSS 类与当前场景不匹配时（例如 `.profile-matrix` 预设了左侧 `56px` 行头列、`.folder-count` 预设了 `position: absolute`、`.fp-job-banner` 预设了蓝框且未支持 `flex-wrap` 或错误态），开发者没有去重构 CSS 选择器或提取修饰类（Modifier Class），而是直接在 TSX 中使用更高优先级的内联 `style={{ ... }}` 强行覆盖。这导致：
1. 阅读 CSS 文件时完全无法得知某组件的真实渲染表现（例如看 `profile.css` 以为 `.folder-count` 一定是绝对定位，看 `model-modal-content.css` 以为 `.profile-matrix` 一定有 `56px` 首列）；
2. 媒体查询（`@media`）无法覆盖内联样式（除非动用 `!important`），彻底阻断了窄屏响应式适配（例如 [FingerprintCheckModal.tsx:108](../../../../src/app/fingerprint/FingerprintCheckModal.tsx#L108) 内联写死 `minmax(310px, 1fr)` 后，窄屏下无法通过 CSS `@media` 收窄列宽）。
