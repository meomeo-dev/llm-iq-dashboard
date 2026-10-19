# 鹈鹕看板设计系统与 CSS Token 治理深度审计（一）：Token 体系与散装数值实证

## 1. 设计系统真实性判定

**核心结论：当前项目不存在成体系的设计系统（Design System）。**

对 `src/app/globals.css` 及主看板、大图查看页、配置页、配对页共 13 个目录 / 模块下的 **43 个 CSS 文件**逐行审计后确认：项目所谓的“全局 Token”仅仅是在 `src/app/globals.css:3-42` 的 `:root` 块中声明了 **11 个基础颜色变量**、**4 个基础尺寸变量**和 **11 个仅服务于主页卡片与时间线网格的业务几何常量**（合计 26 个 CSS 自定义属性）。

对照现代 Web 工程标准的设计系统要素，当前代码库的真实状态如下：

| 设计系统核心维度 | 规范要求 | 当前代码库现状 (`src/app/globals.css`) | 完备度判定 |
| :--- | :--- | :--- | :--- |
| **色彩与语义交互态 (Color & State Tokens)** | 基础色板 + 语义色（背景/文本/边框分层）+ 交互态（hover/active/focus/disabled）+ 遮罩层色 | 仅有 8 个基础色（`--bg`, `--surface`, `--surface-hi`, `--border`, `--text`, `--text-dim`, `--text-faint`, `--accent`）和 3 个单值状态色（`--ok`, `--warn`, `--err`）。**无任何半透明状态底色、状态边框色、悬停态或遮罩 Token** | **残缺**（引发全仓 116 处色值硬编码，同一语义分裂出 3~4 套冲突色板） |
| **字阶与排版 (Typography Scale)** | 字号阶梯（如 xs/sm/base/lg/xl）、行高阶梯、字重阶梯、等宽与无衬线字体栈 Token | **0 个排版 Token**。仅在 `html, body` (`globals.css:68-71`) 写死 `font-size: 14px; line-height: 1.55`，等宽字体栈在 5 个文件里各自手抄 | **完全缺失**（全仓出现 16 种不同字号，含 5 种 `.5px` 半像素字号） |
| **间距阶 (Spacing Scale)** | 4px/8px 基准的间距阶梯 Token（如 `--space-1` 至 `--space-8`） | 仅 1 个 `--gap: 16px` (`globals.css:21`)，且全仓仅被引用 4 次 | **完全缺失**（全仓出现 23 种 `gap` 写法、97 种不同 `padding` 组合） |
| **圆角阶 (Radius Scale)** | 统一圆角档位并在全站强制复用 | 声明了 `--radius: 10px`、`--radius-md: 7px`、`--radius-sm: 6px` (`globals.css:17-19`)，但 **`--radius-md` 和 `--radius-sm` 在受审的 43 个文件中被引用 0 次** | **名存实亡**（全仓出现 16 种硬编码圆角值，连 `globals.css` 自身都硬编码 `7px`） |
| **阴影与海拔 (Elevation & Shadow)** | 浮层、下拉菜单、模态窗、吸底栏的分级阴影 Token | **0 个阴影 Token** | **完全缺失**（全仓 24 处 `box-shadow` 全部手写） |
| **层级阶 (Z-Index Scale)** | 粘性表头、下拉面板、抽屉、一级/二级模态窗的统一层级变量 | **0 个 `z-index` Token** | **完全缺失**（散落 `1, 5, 10, 20, 50, 80, 85, 100, 200, 300, 1000` 共 11 个魔术数字） |
| **响应式断点 (Breakpoints)** | 统一的视口断点契约（mobile / tablet / desktop） | 无统一规范，各文件按需随手写 `@media` | **混乱**（43 个文件中出现 `380px, 400px, 440px, 640px, 767px, 768px, 769px, 900px, 1080px` 共 9 个断点） |
| **原子组件契约 (Atomic UI Primitives)** | Button、Input、Select、Badge、Pill、Dialog、Drawer、Table 等跨页复用样式 | **0 个跨页原子组件样式层**。每个业务模块各自重写按钮、徽章、弹窗、表格样式 | **完全缺失** |

---

## 2. `src/app/globals.css` 全局变量定义与真实使用率审计

`src/app/globals.css:3-42` 定义的 26 个变量分为两类：

### 2.1 基础外观变量（15 个）与“僵尸 Token”现象

| 变量名 | 定义位置与取值 | 受审 43 个 CSS 文件引用次数 | 审计发现 |
| :--- | :--- | :--- | :--- |
| `--border` | `globals.css:7` (`#232d3d`) | 112 次 | 高频使用，但虚线分隔与亮色分隔多次被硬编码 `rgba(255,255,255,0.06~0.08)` 绕过 |
| `--text-dim` | `globals.css:9` (`#9aa2b1`) | 91 次 | 高频使用 |
| `--text` | `globals.css:8` (`#e6e8ee`) | 75 次 | 高频使用，但实心按钮/徽章上的白色文字全数硬编码为 `#fff`（16 处） |
| `--text-faint` | `globals.css:10` (`#6b7385`) | 70 次 | 高频使用 |
| `--accent` | `globals.css:11` (`#4f8df7`) | 63 次 | 仅主色可用；次级强调色、浅底色被 `#60a5fa`、`#93c5fd`、`#2563eb` 硬编码替代 |
| `--surface-hi` | `globals.css:6` (`#182030`) | 49 次 | 高频使用 |
| `--surface` | `globals.css:5` (`#10161f`) | 33 次 | 高频使用 |
| `--err` | `globals.css:15` (`#f87171`) | 28 次 | 仅文本/描边可用；浅底色与部分错误态被 `rgba(239,68,68,*)` 及 `--danger` 绕过 |
| `--radius` | `globals.css:17` (`10px`) | 20 次 | 另有 6 处直接硬编码 `border-radius: 10px` |
| `--ok` | `globals.css:13` (`#4ade80`) | 17 次 | 仅单色；配置页与弹窗中另行硬编码了 `#3fb950` 和 `rgba(16,185,129,*)` |
| `--bg` | `globals.css:4` (`#0b0f17`) | 16 次 | 正常使用 |
| `--warn` | `globals.css:14` (`#fbbf24`) | 16 次 | 仅单色；配置页硬编码了 `#d97706`、`#e3b341` 等不同黄/橙色系 |
| `--gap` | `globals.css:21` (`16px`) | 4 次 | 仅 `toolbar-layout.css:6`、`timeline-board.css:6`、`cards-base.css:6`、`model-modal-content.css:39` 使用；其余 7 处 `16px` 间距直接写死字面量 |
| `--radius-md` | `globals.css:18` (`7px`) | **0 次** | **僵尸 Token**：受审范围内 0 引用，而全仓有 **8 处**直接硬编码 `border-radius: 7px`（含 `globals.css:117` 自身） |
| `--radius-sm` | `globals.css:19` (`6px`) | **0 次** | **僵尸 Token**：受审范围内 0 引用，而全仓有 **18 处**直接硬编码 `border-radius: 6px` |
| `--control-height` | `globals.css:20` (`32px`) | **0 次** | **僵尸 Token**：受审范围内 0 引用，而 `toolbar-elements.css:107`、`calendar.css:52`、`model-modal-dialog.css:63`、`model-modal-content.css:4`、`model-modal-standard.css:5` 直接硬编码 `32px` |

### 2.2 业务耦合几何常量（11 个）

`globals.css:25-41` 将主页卡片与时间线矩阵的局部几何尺寸直接塞入全局 `:root`：
- 卡片专用：`--badge-height: 21px` (`L25`)、`--card-header-height: 120px` (`L26`)、`--card-footer-height: 70px` (`L28`)。
- 时间线专用：`--lane-label-width: 176px` (`L30`)、`--cell-width: 232px` (`L33`)、`--cell-height: 236px` (`L34`)、`--tile-size: 216px` (`L35`)、`--folder-padding: 16px` (`L36`)、`--folder-gap: 12px` (`L37`)、`--axis-height: 56px` (`L39`)、`--head-height: 30px` (`L40`)、`--lane-head-height: 36px` (`L41`)。

这些属于特定业务组件的局部布局参数，而非通用设计系统 Token。

---

## 3. 定量统计与铁证（精确到文件路径与行号）

### 3.1 绕过 Token 的硬编码色值（共 116 处）

除 `globals.css:3-16` 外，受审 CSS 文件中共检出 **116 处**硬编码色值（`#hex`、`rgba(...)`、`rgb(...)`）。最严重的问题是**同一语义在全站分裂出 3~4 套不同来源的色板（Tailwind 色板、GitHub Primer 色板、手调 Hex）**，以及**引用根本不存在的 CSS 变量并回退到浅色主题色值**。

#### （1）未定义变量（幽灵 Token）与浅色背景回退值事故
- `src/app/pair/pair.css:9`：`border: 1px solid var(--line, #d9d9d9);` —— `globals.css` 从未定义 `--line`（实际定义为 `--border: #232d3d`），导致深色背景（`#0b0f17`）上回退渲染出刺眼的浅灰白边框 `#d9d9d9`。
- `src/app/pair/pair.css:28`：`color: var(--danger, #b42318);` —— `globals.css` 从未定义 `--danger`（实际定义为 `--err: #f87171`），回退为暗红 `#b42318`，在深色背景上对比度严重不足。
- `src/app/config/config-actions.css:75`：`color: var(--danger, #b42318);` —— 同上，设备表错误提示使用了未定义的 `--danger`。
- `src/app/components/card/cards-footer.css:102`：`color: var(--warn, #e0a442);` —— 为已定义的 `--warn` (`#fbbf24`) 写了不一致的回退色值 `#e0a442`。

#### （2）成功态（Green）分裂为 3 套互不兼容的色值
`globals.css:13` 定义 `--ok: #4ade80`（RGB `74, 222, 128`），但各组件各自硬编码：
1. **Tailwind Green-400 (`74, 222, 128` / `#4ade80`)**：
   - `src/app/components/model-modal/model-modal-standard.css:123-125`：`background: rgba(74, 222, 128, 0.12);`、`color: #4ade80;`、`border: 1px solid rgba(74, 222, 128, 0.28);`
   - `src/app/view/viewer-drawers.css:117-119`：`background: rgba(74, 222, 128, 0.12);`、`color: #4ade80;`、`border: 1px solid rgba(74, 222, 128, 0.28);`
   - `src/app/components/run-control/run-control-auto.css:41`：`box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);`
2. **Tailwind Emerald-500 (`16, 185, 129`)**：
   - `src/app/config/config-data-repo.css:41`：`background: rgba(16, 185, 129, 0.15);`
   - `src/app/config/config-data-repo.css:95-96`：`border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05);`
   - `src/app/config/config-data-repo.css:242`：`background: rgba(16, 185, 129, 0.15);`
   - `src/app/config/config-data-repo-pipeline.css:49-50`：`background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3);`
3. **GitHub Primer Green (`46, 160, 67` / `#3fb950`)**：
   - `src/app/config/config-schedule.css:47-49`：`background: rgba(46, 160, 67, 0.15); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.3);`
   - `src/app/config/config-schedule.css:76-78`：`background: rgba(46, 160, 67, 0.12); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.25);`
   - `src/app/config/config-timeout.css:68-70`：`background: rgba(46, 160, 67, 0.15); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.3);`

#### （3）警告态（Yellow / Amber）分裂为 3 套色值
`globals.css:14` 定义 `--warn: #fbbf24`（RGB `251, 191, 36`），但配置页硬编码了两套完全不同的黄色：
1. **Tailwind Amber-500/600 (`245, 158, 11` / `#d97706`，其中 `#d97706` 为浅色主题暗琥珀色）**：
   - `src/app/config/config-data-repo.css:46-47`：`background: rgba(245, 158, 11, 0.15); color: #d97706;`
   - `src/app/config/config-data-repo.css:114, 116`：`border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.04);`
   - `src/app/config/config-data-repo.css:243`：`background: rgba(245, 158, 11, 0.15); color: #d97706;`
   - `src/app/config/config-data-repo-pipeline.css:96-97`：`background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2);`
   - `src/app/config/config-data-repo-pipeline.css:142`：`color: #d97706;`
2. **GitHub Primer Attention (`210, 153, 34` / `#e3b341`)**：
   - `src/app/config/config-schedule.css:70-72`：`background: rgba(210, 153, 34, 0.12); color: #e3b341; border: 1px solid rgba(210, 153, 34, 0.25);`
   - `src/app/config/config-timeout.css:74-76`：`background: rgba(210, 153, 34, 0.15); color: #e3b341; border: 1px solid rgba(210, 153, 34, 0.3);`

#### （4）主强调色（Blue）分裂为 3 套色值
`globals.css:11` 定义 `--accent: #4f8df7`（RGB `79, 141, 247`），但各文件混用：
1. **基于 `79, 141, 247` 的手写 `rgba`**：
   - `src/app/components/run-control/run-control-menu.css:158`：`background: rgba(79, 141, 247, 0.16);`
   - `src/app/components/run-status/run-status-panel.css:39, 42`：`rgba(79, 141, 247, 0.55)`、`rgba(79, 141, 247, 0)`
   - `src/app/config/config-base.css:152`：`background: rgba(79, 141, 247, 0.1);`
   - `src/app/config/config-timeout.css:26, 48`：`rgba(79, 141, 247, 0.1)`、`rgba(79, 141, 247, 0.35)`
2. **Tailwind Blue-300/400 (`#93c5fd` / `#60a5fa` / `96, 165, 250`)**：
   - `src/app/components/model-modal/model-modal-standard.css:21, 26-27, 46-48, 57-58, 65, 129-131, 158`：共 13 处硬编码 `rgba(96, 165, 250, *)`、`#93c5fd`、`#60a5fa`。
   - `src/app/view/viewer-drawers.css:123-125`：`background: rgba(96, 165, 250, 0.12); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.28);`
3. **Tailwind Blue-600 (`#2563eb`)**：
   - `src/app/config/config-data-repo.css:228, 230`：`.data-repo-btn-confirm` 硬编码 `background: #2563eb; border-color: #2563eb;`，而同文件第 250 行 `.data-repo-btn-primary` 却写 `background: var(--accent);`。
   - `src/app/config/config-data-repo-pipeline.css:129`：`.data-repo-pipeline-btn-primary` 硬编码 `background: #2563eb; border-color: #2563eb;`。

#### （5）错误态（Red）、面板底色、边框与遮罩硬编码清单
- **Tailwind Red-500 (`239, 68, 68`)**：`src/app/config/config-data-repo.css:51, 100-101`（`rgba(239, 68, 68, 0.15 / 0.3 / 0.05)`）。
- **散装深色背景**：
  - `src/app/components/timeline/folder.css:23`：`.folder:hover { background: #1f2940; }`
  - `src/app/components/model-modal/model-modal-standard.css:72`：`background: rgba(15, 23, 42, 0.6);`
  - `src/app/config/config-timeout.css:49`：`background: rgba(16, 24, 38, 0.8);`
- **散装次级灰与虚线边框**：
  - `src/app/config/config-data-repo.css:244`：`rgba(100, 116, 139, 0.15)`
  - `src/app/config/config-schedule.css:53, 82`：`rgba(139, 148, 158, 0.15)`、`rgba(139, 148, 158, 0.08)`
  - `src/app/components/toolbar/toolbar-responsive.css:59`：`border-top: 1px solid rgba(255, 255, 255, 0.06);`
  - `src/app/components/model-modal/model-modal-standard.css:144`、`src/app/components/run-control/run-control-menu.css:183`：`1px dashed rgba(255, 255, 255, 0.08)`
- **4 种互不统一的模态遮罩底色**：
  - `rgba(3, 6, 12, 0.72)`：`src/app/components/model-modal/model-modal-dialog.css:11`、`src/app/components/profile/profile.css:156`
  - `rgba(0, 0, 0, 0.5)`：`src/app/components/menu/menu-base.css:61`
  - `rgba(0, 0, 0, 0.55)`：`src/app/components/run-control/run-control-profiles.css:10`
  - `rgba(0, 0, 0, 0.6)`：`src/app/config/config-data-repo.css:149`
- **纯白字面量 `#fff`（共 22 处）**：用于画布白底（`timeline-track.css:119`, `cards-frame.css:26`, `viewer-base.css:74`, `config-data-repo-pending.css:159`）及实心按钮/徽章反白字（`calendar.css:80,94`, `run-control-auto.css:81`, `run-control-foot.css:54`, `run-control-menu.css:232`, `run-control-stop.css:29`, `menu-base.css:45`, `menu-rows.css:58-59`, `config-data-repo-pipeline.css:57,129`, `config-data-repo.css:229,250`, `config-schedule.css:108`, `config-timeout.css:34`）。

---

### 3.2 随手拍脑袋的字号（16 种字号档位、193 处硬编码）

全仓无任何字号 Token，共出现 **16 种**不同字号（从 `9px` 到 `20px` 外加 `1.1rem`），在 `10px`~`15px` 区间内更是以 **0.5px 为步长**密集分布（`10px, 10.5px, 11px, 11.5px, 12px, 12.5px, 13px, 13.5px, 14px, 14.5px, 15px`），完全取决于编写具体文件时的主观直觉：

| 字号值 | 出现次数 | 精确文件路径与行号分布 |
| :--- | :--- | :--- |
| `9px` | 2 处 | `toolbar/calendar.css:89`, `timeline/folder.css:99`（突破了 `ui-design-system` 声称的 `11px` 最小字号底线） |
| `10px` | 1 处 | `timeline/timeline-track.css:154` |
| `10.5px` | 3 处 | `model-modal/model-modal-standard.css:117`, `view/viewer-drawers.css:111`, `view/viewer-judge.css:145` |
| `11px` | 24 处 | `toolbar/calendar.css:46`, `toolbar/toolbar-elements.css:45,93`, `timeline/folder.css:160,167`, `timeline/timeline-board.css:117`, `timeline/timeline-track.css:145,150`, `card/cards-base.css:57`, `model-modal/model-modal-standard.css:35`, `run-control/run-control-menu.css:147,172,178`, `run-status/run-status-panel.css:164`, `profile/profile.css:158`, `view/viewer-drawers.css:30,190`, `view/viewer-judge.css:34,121,135`, `config/config-data-repo-pending.css:195`, `config/config-data-repo-pipeline.css:41`, `config/config-data-repo.css:241`, `config/config-timeout.css:63` |
| `11.5px` | 17 处 | `card/cards-footer.css:12`, `model-modal/model-modal-standard.css:50`, `run-control/run-control-menu.css:166,212`, `run-status/run-status-calls.css:35`, `view/viewer-drawers.css:74,139`, `view/viewer-judge.css:7,97`, `config/config-base.css:126`, `config/config-data-repo-pending.css:80,137`, `config/config-matrix.css:21`, `config/config-prompt.css:33,47`, `config/config-schedule.css:43,90` |
| `12px` | 41 处 | `globals.css:120`, `toolbar/toolbar-elements.css:123`, `toolbar/toolbar-layout.css:53`, `timeline/folder.css:128,138`, `timeline/timeline-board.css:92`, `model-modal/model-modal-content.css:109`, `model-modal/model-modal-standard.css:145`, `run-control/run-control-foot.css:22,38`, `run-control/run-control-profiles.css:77`, `run-control/run-control-stop.css:40`, `run-status/run-status-panel.css:133`, `menu/menu-base.css:36`, `menu/menu-panels.css:174`, `menu/menu-rows.css:35,88,124,137`, `profile/profile.css:134,175`, `cli-status/cli-status.css:36,46`, `view/viewer-judge.css:45`, `config/capability.css:30`, `config/config-actions.css:47`, `config/config-base.css:163`, `config/config-data-repo-pending.css:30,97,110`, `config/config-data-repo-pipeline.css:76,92,142`, `config/config-data-repo.css:37,77,126,184,197,203`, `config/config-profiles.css:71`, `config/config-prompt.css:40`, `config/config-schedule.css:34,63`, `config/config-timeout.css:22` |
| `12.5px` | 32 处 | `timeline/timeline-board.css:104`, `timeline/timeline-track.css:50,74,85`, `card/cards-frame.css:39,74`, `model-modal/model-modal-content.css:73`, `model-modal/model-modal-dialog.css:69`, `model-modal/model-modal-standard.css:12,136`, `run-control/run-control-profiles.css:43,91`, `run-status/run-status-panel.css:182`, `profile/profile.css:61,187`, `view/viewer-base.css:38`, `view/viewer-drawers.css:9,130`, `config/config-actions.css:20`, `config/config-base.css:30,56,144`, `config/config-data-repo-pending.css:66,204`, `config/config-data-repo.css:29,82,91,174,245,247`, `config/config-nav.css:102`, `config/config-profiles.css:26` |
| `13px` | 41 处 | `globals.css:99`, `toolbar/calendar.css:58`, `toolbar/toolbar-elements.css:39`, `timeline/timeline-track.css:158`, `card/cards-frame.css:53,88`, `model-modal/model-modal-content.css:57`, `model-modal/model-modal-dialog.css:51`, `model-modal/model-modal-standard.css:31,108`, `run-control/run-control-auto.css:16,25`, `run-control/run-control-foot.css:56`, `run-control/run-control-menu.css:58`, `run-control/run-control-profiles.css:107`, `run-control/run-control-stop.css:17,58`, `run-status/run-status-panel.css:101,116`, `menu/menu-panels.css:20,69,103`, `cli-status/cli-status.css:15`, `view/viewer-base.css:53`, `view/viewer-drawers.css:61,102`, `config/capability.css:22`, `config/config-actions.css:54`, `config/config-base.css:77,101`, `config/config-data-repo-pending.css:15`, `config/config-data-repo-pipeline.css:61,117,123`, `config/config-data-repo.css:12,121,218,249`, `config/config-nav.css:45`, `config/config-profiles.css:100`, `config/config-schedule.css:25` |
| `13.5px` | 5 处 | `toolbar/calendar.css:16`, `run-status/run-status-panel.css:67`, `menu/menu-base.css:22`, `menu/menu-rows.css:15`, `profile/profile.css:77` |
| `14px` | 10 处 | `globals.css:70`, `toolbar/toolbar-elements.css:80`, `timeline/timeline-track.css:131`, `run-control/run-control-profiles.css:35`, `run-control/run-control-stop.css:140`, `run-status/run-status-panel.css:82`, `menu/menu-panels.css:35,118`, `config/config-data-repo-pipeline.css:87`, `config/config-profiles.css:63` |
| `14.5px` | 1 处 | `card/cards-base.css:33` |
| `15px` | 4 处 | `timeline/timeline-board.css:86`, `timeline/timeline-track.css:141`, `model-modal/model-modal-content.css:105`, `config/config-base.css:24` |
| `16px` | 2 处 | `toolbar/toolbar-layout.css:59`, `config/config-data-repo.css:168` |
| `17px` | 1 处 | `view/viewer-base.css:28` |
| `18px` | 6 处 | `toolbar/calendar.css:28`, `timeline/folder.css:54`, `timeline/timeline-board.css:27`, `model-modal/model-modal-dialog.css:44`, `run-control/run-control-profiles.css:57`, `profile/profile.css:87` |
| `20px` | 2 处 | `timeline/folder.css:41`, `model-modal/model-modal-content.css:10` |
| `1.1rem` | 1 处 | `pair/pair.css:16`（全站唯一使用 `rem` 单位的规则） |

---

### 3.3 五花八门的 `border-radius`（17 种写法、114 处声明）

尽管 `globals.css:17-19` 定义了 `--radius: 10px`、`--radius-md: 7px`、`--radius-sm: 6px`，但各 CSS 文件仅使用 `var(--radius)` 20 次（其中 `config-nav.css:43` 还写了与实际值 `10px` 矛盾的回退值 `var(--radius, 6px)`），其余 **94 处**全部硬编码字面量：

| 圆角声明 | 出现次数 | 精确文件路径与行号分布 |
| :--- | :--- | :--- |
| `2px` | 1 处 | `run-status/run-status-panel.css:146` |
| `3px` | 1 处 | `view/viewer-judge.css:142` |
| `4px` | 17 处 | `toolbar/toolbar-elements.css:7`, `card/cards-footer.css:79`, `model-modal/model-modal-standard.css:116`, `run-control/run-control-menu.css:98`, `run-status/run-status-panel.css:79`, `menu/menu-panels.css:32,115`, `menu/menu-rows.css:52`, `cli-status/cli-status.css:32`, `view/viewer-drawers.css:110`, `view/viewer-judge.css:112,119`, `config/config-base.css:131`, `config/config-data-repo-pending.css:158`, `config/config-data-repo-pipeline.css:95`, `config/config-data-repo.css:35,241` |
| `5px` | 3 处 | `card/cards-base.css:54`, `config/config-base.css:160`, `config/config-schedule.css:92` |
| `6px` | 18 处 | `toolbar/calendar.css:24`, `toolbar/toolbar-elements.css:66,91,128`, `timeline/timeline-track.css:118`, `run-control/run-control-menu.css:143,208`, `run-control/run-control-stop.css:54`, `run-status/run-status-calls.css:33`, `menu/menu-rows.css:84`, `profile/profile.css:24`, `cli-status/cli-status.css:42`, `config/config-base.css:73,141`, `config/config-data-repo.css:182`, `config/config-profiles.css:69,96`, `config/config-schedule.css:66`, `config/config-timeout.css:24`（全部绕过 `--radius-sm`） |
| `7px` | 8 处 | `globals.css:117`, `toolbar/calendar.css:54`, `toolbar/toolbar-layout.css:50`, `timeline/folder.css:97`, `menu/menu-panels.css:65`, `menu/menu-rows.css:11`, `config/config-base.css:97`, `config/config-prompt.css:15`（全部绕过 `--radius-md`） |
| `8px` | 19 处 | `toolbar/toolbar-elements.css:109`, `toolbar/toolbar-responsive.css:84`, `model-modal/model-modal-content.css:6`, `model-modal/model-modal-dialog.css:66`, `model-modal/model-modal-standard.css:8`, `run-control/run-control-foot.css:52`, `run-control/run-control-profiles.css:103`, `run-control/run-control-stop.css:13`, `menu/menu-base.css:18`, `profile/profile.css:155,210`, `view/viewer-base.css:51`, `view/viewer-drawers.css:5`, `config/capability.css:13`, `config/config-data-repo.css:71`, `config/config-prompt.css:58`, `config/config-schedule.css:8`, `config/config-timeout.css:40`, `pair/pair.css:10` |
| `10px` | 6 处 | `toolbar/toolbar-responsive.css:23`, `timeline/timeline-track.css:137`, `model-modal/model-modal-content.css:95`, `menu/menu-base.css:82`, `profile/profile.css:57`, `view/viewer-base.css:73`（直接写死 `10px` 而未用 `var(--radius)`） |
| `12px` | 7 处 | `toolbar/toolbar-layout.css:20`, `run-control/run-control-menu.css:21`, `run-control/run-control-profiles.css:19`, `run-status/run-status-calls.css:12`, `menu/menu-panels.css:144,163`, `config/config-schedule.css:42` |
| `12px 12px 0 0` | 1 处 | `profile/profile.css:251` |
| `14px` | 2 处 | `timeline/timeline-board.css:13`, `model-modal/model-modal-dialog.css:21` |
| `18px` | 2 处 | `timeline/folder.css:34,40` |
| `44px` | 1 处 | `timeline/folder.css:15` |
| `999px` vs `9999px` | 9 处 | 胶囊圆角混用 `999px`（`model-modal-standard.css:45`, `run-control-auto.css:57`, `menu-base.css:43`, `viewer-drawers.css:71,188`, `viewer-judge.css:5`, `config-profiles.css:24`, `config-timeout.css:62`）与 `9999px`（`config-nav.css:99`），另在 `config-schedule.css:42` 用 `12px` 充当胶囊圆角 |
| `50%` | 10 处 | 圆形状态点与单选框（`folder.css:87`, `timeline-track.css:58,101`, `model-modal-standard.css:64`, `run-control-auto.css:35,70`, `run-status-panel.css:14`, `menu-rows.css:108`, `profile.css:8`, `config-data-repo-pipeline.css:40`） |

---

### 3.4 随意的 `gap` 与 `padding`（无间距阶梯约束）

- **`gap` 共出现 23 种不同取值（137 处声明）**：
  - 引用 `var(--gap)` 仅 4 处（`toolbar-layout.css:6`, `timeline-board.css:6`, `cards-base.css:6`, `model-modal-content.css:39`），引用 `var(--folder-gap)` 1 处（`folder.css:10`）。
  - 单值硬编码覆盖了从 `0` 到 `32px` 的几乎每一个整数：`0`（2 处）、`1px`（2 处）、`2px`（6 处）、`3px`（2 处）、`4px`（17 处）、`5px`（5 处）、`6px`（24 处）、`7px`（`config-base.css:63`）、`8px`（33 处）、`10px`（18 处）、`12px`（19 处）、`14px`（4 处）、`16px`（7 处）、`22px`（`config-base.css:6`, `config-nav.css:15`）、`32px`（`config-nav.css:7`）。
  - 双值复合 `gap` 另有 9 种随手组合：`2px 8px`、`2px 12px`、`4px 10px`、`4px 12px`、`4px 14px`、`6px 8px`、`6px 12px`、`8px 12px`、`10px 14px`。
- **`padding` 共出现 97 种不同取值组合（198 处声明）**：
  - 仅以按钮内边距为例，全站同样扮演“次要操作按钮”的控件就有 11 种不同的 `padding`：`0 10px` (`globals.css:115`)、`6px 10px` (`menu-base.css:16`)、`0 12px` (`model-modal-dialog.css:64`)、`6px 14px` (`run-control-foot.css:50`)、`6px 12px` (`run-control-stop.css:11`)、`3px 9px` (`menu-rows.css:82`)、`2px 10px` (`cli-status.css:40`)、`7px 14px` (`config-base.css:95`)、`4px 9px` (`config-base.css:120`)、`5px 11px` (`config-base.css:139`)、`4px 10px` (`config-schedule.css:89`)。

---

### 3.5 混乱的 `z-index` 层级与 `box-shadow`（无统一海拔规范）

全站无任何 `z-index` 变量，14 处声明散落在 11 个不同的数值上，且存在**遮罩层与浮层层级倒挂**的隐患：

| `z-index` 值 | 精确位置 | 绑定选择器与用途 | 架构隐患 |
| :--- | :--- | :--- | :--- |
| `1` | `model-modal/model-modal-content.css:51` | `.profile-matrix-col`（弹窗内粘性表头） | 局部粘性层 |
| `5` | `config/config-actions.css:7` | `.actions`（配置页底部常驻保存栏） | 若配置页内有高于 `5` 的局部元素会穿透保存栏 |
| `10` | `toolbar/toolbar-layout.css:12` | `.toolbar`（主看板顶部粘性工具栏） | 工具栏内的下拉菜单（`z-index: 80/85/100`）受 `.toolbar` 创建的层叠上下文（stacking context）约束 |
| `20` | `config/config-nav.css:78` | `.config-side-nav`（窄屏顶部粘性导航条） | 高于底部 `.actions` (`z-index: 5`) |
| `50` | `model-modal/model-modal-dialog.css:6` | `.modal-backdrop`（单轮多强度对比大弹窗） | 低于 `.menu-backdrop` (`80`) 与 `.profile-card` (`300`) |
| `80` | `menu/menu-base.css:60` | `.menu-backdrop`（折叠菜单全屏透明/半透明遮罩） | 与移动端 `z-index: 100` 面板配合，但桌面端亦渲染该遮罩 |
| `85` | `menu/menu-base.css:78` | `.menu-panel`（桌面端通用下拉面板） | — |
| `100` | `run-control/run-control-menu.css:13`<br>`run-status/run-status-calls.css:8`<br>`menu/menu-panels.css:139, 159` | `.menu-panel.run-once-panel`（跑一次弹窗）<br>`.menu-panel.run-panel`（移动端执行状态弹窗）<br>`.menu-panel.filter-panel` / `.day-panel`（移动端） | 4 类弹窗共用硬编码 `100` |
| `200` | `run-control/run-control-profiles.css:6` | `.profile-modal-backdrop`（跑一次二级 Profile 弹窗） | 由于 `.run-once-panel` 位于 `.toolbar` (`z-index: 10`) 层叠上下文内，该 `200` 仅在 `.toolbar` 内部比较 |
| `300` | `profile/profile.css:53` | `.profile-card`（上游信息卡浮层） | 在主看板行标题或弹窗内弹出时固定为 `300` |
| `1000` | `config/config-data-repo.css:150` | `.data-repo-dialog-backdrop`（数据仓推送确认弹窗） | 突然跳升至 `1000` |

同样，全站 **24 处 `box-shadow`** 全部手写，仅浮层投影就存在 6 种不同参数：
- `0 24px 64px rgba(0, 0, 0, 0.55)` (`model-modal-dialog.css:23`)
- `0 24px 64px rgba(0, 0, 0, 0.65)` (`run-control-menu.css:23`, `run-control-profiles.css:21`)
- `0 24px 64px rgba(0, 0, 0, 0.75)` (`run-status-calls.css:11`, `menu-panels.css:143,162`)
- `0 16px 40px rgba(0, 0, 0, 0.5)` (`profile.css:59`)
- `0 12px 32px rgba(0, 0, 0, 0.45)` (`menu-base.css:84`)
- `0 8px 30px rgba(0, 0, 0, 0.3)` (`config-data-repo.css:163`)
- `0 -6px 16px rgb(0 0 0 / 35%)` (`config-actions.css:16`，此处又混用现代 `rgb( / )` 语法)
