# 鹈鹕看板设计系统与 CSS Token 治理深度审计（二）：设计文档脱节与 CSS 架构缺陷

## 1. 设计文档与代码现实脱节审计

通过对 `docs/ui/` 目录下的全部存量文件与 `.agents/skills/` 中定义的 UI 技能规范逐一交叉核对，证实：**全局设计系统文档在仓库中完全不存在，现有文档仅包含一份已废弃方案的局部草案和一份聚焦防溢出测试的交互状态表，且二者均与真实 CSS 代码发生严重漂移。**

### 1.1 技能声称的设计系统产物 100% 缺失

`.agents/skills/ui-design-system/SKILL.md:56-68` 与 `.agents/skills/ui-assets/SKILL.md:22-24, 53-58` 明确声明仓库以 `docs/ui/看板/design-system.md`、`docs/ui/看板/ui-elements-kit.md`、`Design System Blueprint`、`UI Elements Kit` 作为设计系统规范与风格基准。

然而，在仓库根目录实测运行技能自带的校验脚本 `.agents/skills/ui-design-system/scripts/ui-design.mjs`，结果如下：

1. **声称的 `docs/ui/看板/` 目录根本不存在**：
   - 执行 `node .agents/skills/ui-design-system/scripts/ui-design.mjs check 看板` 直接报错：`错误：端不存在：docs/ui/看板，先 init`。
   - 三个 UI 技能文件（`ui-design-system/SKILL.md:57`、`ui-design-brief/SKILL.md:18`、`ui-assets/SKILL.md:53`）全部硬编码指向 `docs/ui/看板/`，而实际目录为 `docs/ui/dashboard/`。
2. **`docs/ui/dashboard/` 下 7 份核心规范文档与 5 张规范大图全部为 0**：
   - 对实际目录执行 `node .agents/skills/ui-design-system/scripts/ui-design.mjs check dashboard`，输出 **12 个 ERROR（markdown 0/7，图 0/5）**：
     - 缺失 `docs/ui/dashboard/design-system.md`（设计系统 / Token 真相源）
     - 缺失 `docs/ui/dashboard/ui-elements-kit.md`（组件清单 / UI Elements Kit）
     - 缺失全部 5 份 Brief：`briefs/design-system-blueprint.brief.md`、`briefs/ui-elements-kit.brief.md`、`briefs/home.brief.md`、`briefs/info.brief.md`、`briefs/empty-error.brief.md`
     - 缺失全部 5 张规范图：`assets/design-system-blueprint.png`、`assets/ui-elements-kit.png`、`assets/home.png`、`assets/info.png`、`assets/empty-error.png`
3. **台账文件完全不存在**：
   - `docs/ui/ui.catalog.jsonl` 与 `docs/ui/ui-assets.catalog.json` 均未创建，`ui-design.mjs validate` 输出 `[validate] 0 条记录，0 个端`。

### 1.2 `docs/ui/` 存量文档逐项审计

当前 `docs/ui/` 目录下仅有 4 个文件，均无法承担设计系统职责：

| 文件路径 | 文档性质 | 与代码实现的真实差距 |
| :--- | :--- | :--- |
| `docs/ui/README.md` | 仅 9 行的索引表 | 全表仅登记了 1 行（指向 `dashboard/dial-design-brief.md`），主看板时间线、模态窗、配置中心 `/config`、作品查看器 `/view`、设备配对 `/pair`、模型指纹 `/fingerprint` 的设计 Brief 全部空白。 |
| `docs/ui/dashboard/dial-design-brief.md` | 已废弃的“24 小时圆形表盘（玫瑰图）”局部草案 | 1. **方案未采用**：文档第 4 行自述“表盘方案未采用，首页现为时间线布局”。<br>2. **Token 表严重漂移**：第 80-87 行记录的色值与 `src/app/globals.css:4-11` 现行值全部对不上：<br>　- `--bg`：文档写 `#0f1115` vs 代码 `#0b0f17`<br>　- `--surface`：文档写 `#171a21` vs 代码 `#10161f`<br>　- `--surface-hi`：文档写 `#1e222b` vs 代码 `#182030`<br>　- `--border`：文档写 `#2a2f3a` vs 代码 `#232d3d`<br>　- `--accent`：文档写 `#6ea8fe` vs 代码 `#4f8df7` |
| `docs/ui/UX_STATE_MAP.md` | 页面路由与浮层防溢出状态矩阵 | 仅关注路由流转与移动端视口不横向溢出，**无任何色彩、字阶、间距、圆角、组件样式契约**，且多处断言与真实 CSS 直接冲突（详下表）。 |
| `docs/ui/ux_coverage_report.json` | 2026-09-26 跑出的视口宽度检测快照 | 1. 第 269-273 行 `STATE_PAIR_PAGE` 在 `mobile_iphone16` 下状态为 `"FAIL"`（`error_feedback_visible=False`）。<br>2. 所有截图路径均指向开发者本机私有缓存目录 `/Users/luojin/.gemini/antigravity-cli/brain/0d231da9-...`，仓库内不可复现。 |

#### `docs/ui/UX_STATE_MAP.md` 与真实 CSS 代码的 5 处直接背离

1. **移动端触控高度虚假声明**：
   - 文档声称（`UX_STATE_MAP.md:22`）：“移动端（≤ 768px）所有可点击按钮触控区域均 ≥ 40px 高度”。
   - 代码真相：全站大量移动端可点击按钮高度固定在 **24px ~ 32px**，且在 `@media (max-width: 768px)` 或 `640px` 下没有任何增高规则：
     - `24px × 24px`：`.filter-panel-close-btn` (`menu-panels.css:28-29`)、`.day-panel-close-btn` (`menu-panels.css:111-112`)、`.run-panel-close-btn` (`run-status-panel.css:75-76`)
     - `26px × 26px`：`.calendar-nav` (`calendar.css:20-21`)
     - `28px × 28px`：`.run-once-close` (`run-control-stop.css:50-51`)
     - `30px` 高：`.lang-switch` (`globals.css:114`)
     - `32px` 高：`.icon-link` (`toolbar-elements.css:106-107`)、`.calendar-day` (`calendar.css:52`)、`.modal-close` (`model-modal-content.css:3-4`)、`.modal-standard-btn` (`model-modal-standard.css:5`)
2. **状态语义色描述错误**：
   - 文档声称（`UX_STATE_MAP.md:162`）：`status-no-svg` 视觉识别为“灰标”。
   - 代码真相：`timeline-track.css:108` (`background: var(--warn)`)、`cards-frame.css:58-60` (`color: var(--warn)`)、`cards-footer.css:23-25` (`color: var(--warn)`) 全部将 `no-svg` 绑定为黄色 `#fbbf24`。
3. **响应式断点规范与代码实际断点脱节**：
   - 文档第 6 节（`UX_STATE_MAP.md:173-195`）定义断点体系为 `344px / 360px / 480px / 640px / 768px / 1024px / 1440px / 1920px`。
   - 代码真相：43 个 CSS 文件实际编写了 **9 个散装断点**：`380px` (`menu-panels.css:167`)、`400px` (`globals.css:51,88`)、`440px` (`run-status-calls.css:20`)、`640px`（7 处）、`767px` (`profile.css:243`)、`768px`（6 处）、`769px` (`menu-base.css:66`)、`900px`（3 处）、`1080px` (`toolbar-responsive.css:2`)。文档所列的 `344px, 360px, 480px, 1024px, 1440px` 在 CSS 中从未出现；文档声称“超窄折叠外屏（≤ 360px）：筛选左侧边栏由 136px 自动压缩为 108px”（`UX_STATE_MAP.md:195`），而 `menu-panels.css:167-169` 实际写的是 `@media (max-width: 380px) { grid-template-columns: 100px minmax(0, 1fr); }`。
4. **全局溢出属性描述不一致**：
   - 文档声称（`UX_STATE_MAP.md:192`）：“全局强制 `overflow-x: hidden`”。
   - 代码真相：`src/app/globals.css:73` 为 `overflow-x: clip;`。
5. **遗漏重要路由与二级弹窗**：
   - 自称“全站唯一事实来源”（`UX_STATE_MAP.md:4`），但完全遗漏了 `/fingerprint` 路由（`src/app/fingerprint/page.tsx`）以及“跑一次”流程中的二级 Profile 选择模态窗（`src/app/components/run-control/run-control-profiles.css:3-23`）。

---

## 2. CSS 架构与可维护性问题审计

本项目未使用 CSS Modules、Tailwind CSS 或 CSS-in-JS，而是采用**全局扁平 CSS 类名 + 组件/页面直接 `import "*.css"`** 的原始模式。由于缺乏命名空间规范（如 BEM）和分层架构（如 ITCSS / `@layer`），已产生实质性的全局样式污染与跨模块碰撞。

### 2.1 命名空间缺失与四套命名风格各自为政

各模块由不同时期按不同习惯编写，形成 4 种互不统属的命名风格：
1. **无前缀通用名词**（极易冲突）：`.page` (`globals.css:76`)、`.workspace` (`toolbar-layout.css:3`)、`.brand` (`toolbar-layout.css:30`)、`.menus` / `.menu` (`menu-base.css:3,8`)、`.checkbox` / `.radio` (`menu-rows.css:47,102`)、`.board` / `.matrix` / `.track` (`timeline-board.css:3,60`, `timeline-track.css:2`)、`.folder` (`folder.css:4`)、`.card` / `.frame` / `.badges` / `.badge` (`cards-base.css:11,41,51`, `cards-frame.css:3`)、`.stack` (`config-base.css:33`)、`.actions` / `.status` / `.alert` (`config-actions.css:4,19,35`)。
2. **组件短前缀**：`.toolbar-*`、`.calendar-*`、`.modal-*`、`.run-*`、`.cli-*`。
3. **页面级短前缀**：`.viewer-*` (`src/app/view/`)、`.config-*` (`src/app/config/`)、`.pair-*` (`src/app/pair/`)、`.fp-*` (`src/app/fingerprint/`)。
4. **深层业务全称前缀**：`.data-repo-pipeline-step-badge` (`config-data-repo-pipeline.css:34`)、`.schedule-runtime-notice` (`config-schedule.css:58`)。

`src/app/components/toolbar/toolbar-elements.css:28` 的代码注释直接暴露了无命名空间的后果：
> `/* 两行小字的堆叠块：上行为值，下行为说明。.stack 已被配置页占用 */`

### 2.2 跨文件同名选择器冲突与样式串扰（铁证清单）

在 Next.js App Router 中，客户端路由跳转（`<Link href="/config">`、`<Link href="/">`、`<Link href="/pair">`）在同一个浏览器文档中共享全局样式表，已注入的 CSS 规则在切换页面后依然残留，导致以下同名选择器直接互相覆盖：

| 冲突选择器 | 定义位置 A | 定义位置 B | 冲突后果与破坏性表现 |
| :--- | :--- | :--- | :--- |
| `.profile-card`<br>`.profile-card-head`<br>`.profile-name` | `src/app/components/profile/profile.css:49, 68, 17`<br>（定义为 `position: absolute; top: calc(100% + 6px); z-index: 300; width: 320px; box-shadow: ...` 的悬浮气泡卡；窄屏 `767px` 下为 `position: fixed; bottom: 0` 抽屉） | `src/app/config/config-profiles.css:37, 51, 62`<br>（定义为配置页“上游 Profile”章节中 `display: flex; flex-direction: column; gap: 12px; background: var(--bg)` 的静态表单大卡片） | **高危样式碰撞**：两个文件定义了完全同名的 `.profile-card`、`.profile-card-head`、`.profile-name`！在主看板与 `/config` 之间客户端路由切换时，`profile.css:49` 的 `position: absolute; width: 320px; z-index: 300` 与 `config-profiles.css:37` 的静态块级卡片属性直接互相覆盖，窄屏下甚至会把配置页的表单卡片变成 `position: fixed; bottom: 0` 的底部固定抽屉。 |
| `.matrix` | `src/app/components/timeline/timeline-board.css:60`<br>（`display: grid; grid-template-columns: var(--lane-label-width) minmax(0, 1fr); margin-top: 8px;`） | `src/app/config/config-matrix.css:13`<br>（`width: 100%; border-collapse: collapse;` 的 `<table>` 表格） | 主看板与配置页共用 `.matrix` 类名。当两份样式同时在页面生效时，配置页的 `<table className="matrix">` 会被强行设为 `display: grid; grid-template-columns: 176px minmax(0, 1fr)`，破坏表格布局。 |
| `.actions` | `src/app/config/config-actions.css:4`<br>（`position: sticky; bottom: 0; z-index: 5; padding: 12px 20px; border: 1px solid var(--border); background: var(--surface); box-shadow: 0 -6px 16px rgb(0 0 0 / 35%)`） | `src/app/pair/pair.css:21`<br>（`.pair-card .actions { display: flex; align-items: center; gap: 12px; }`） | 配置页将吸底操作栏直接命名为全局 `.actions`，而 `/pair` 页表单内的按钮容器也叫 `className="actions"` (`PairCodeForm.tsx:36`, `PairSignedInCard.tsx:27`)。从 `/config` 重定向或跳转到 `/pair` 时，配对卡片内的按钮行会继承 `config-actions.css:4` 的吸底边框、背景和负向阴影。 |
| `.checkbox`<br>`.radio` | `src/app/components/menu/menu-rows.css:47, 102`<br>（`width: 17px; height: 17px; border: 1.5px solid var(--text-faint)` 的自定义勾选框图标） | `src/app/config/config-base.css:59-60`<br>（`label.checkbox, label.radio`，包裹复选框与整行文字的 `<label>` 容器） | 同一类名在菜单组件中代表 17px 的图形框，在配置页中代表整行 `<label>` 容器。若在配置页引入 `menu.css`，所有 `<label className="checkbox">` 立即被锁定为 `17px × 17px` 方框，导致标签文字溢出。 |
| `.standard-tag`<br>`.standard-tag.gt`<br>`.standard-tag.eval`<br>`.standard-heading`<br>`.standard-desc` | `src/app/components/model-modal/model-modal-standard.css:100-139` | `src/app/view/viewer-drawers.css:94-133` | 整段 CSS 代码在两个文件中被原样复制粘贴。且 `.standard-desc` 在 `model-modal-standard.css:138` 中为 `color: var(--text-dim)`，在 `viewer-drawers.css:132` 中为 `color: var(--text)`，造成同组件跨页颜色不一致与全局选择器冗余。 |

### 2.3 配置页裸元素选择器全局污染与 `/pair` 页面样式缺失

`src/app/config/config-base.css:51-122` 在没有任何 `.config` 作用域限定的情况下，直接对全局 HTML 标签编写了样式规则：
- `label` (`config-base.css:51-57`)：`display: flex; flex-direction: column; gap: 4px; color: var(--text-dim); font-size: 12.5px;`
- `input[type="text"], input[type="number"], select, textarea` (`config-base.css:67-78`)
- `button` (`config-base.css:94-103`)：`padding: 7px 14px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-hi); color: var(--text);`

这一反模式引发了双重问题：
1. **对内**：同在配置页的 `src/app/config/config-data-repo-pending.css:18-26` 不得不写长选择器 `.data-repo-pending label.data-repo-pending-all` 并附注释抱怨：`/* 配置页的通用 label 规则是纵向排布，这里的勾选行要横排 */`；一旦客户端导航后 `config-base.css` 驻留内存，主看板所有未显式声明 `padding` / `border` / `background` 的 `<button>` 和 `<label>` 全部受其污染。
2. **对外（`/pair` 页面样式裸奔）**：`src/app/pair/page.tsx:10` 仅导入了 `./pair.css`（共 30 行），未导入 `config-base.css`。而 `src/app/pair/PairCodeForm.tsx:24-39` 中的 `<label>`、`<input className="pair-code">`（甚至没写 `type="text"`）、`<button type="submit">` 以及 `PairSignedInCard.tsx:31` 的 `<button type="button">` 在 `pair.css` 中完全没有定义背景色、边框色和文字色。当用户直接打开 `/pair` 页面时，输入框与按钮直接渲染为浏览器默认的白底黑字原生控件，与 `#0b0f17` 深色页面格格不入。

### 2.4 TSX 中的“幽灵类名”（有 HTML 调用、无 CSS 实现）

代码库中存在多处 TSX 组件声明了 `className`，但在全仓所有 CSS 文件中 **0 处定义**的“幽灵类名”：
- `.masthead`：出现在 `src/app/config/ConfigPageHeader.tsx:10`（`<header className="masthead">`）和 `src/app/pair/PairPageHeader.tsx:10`（`<header className="masthead">`），全仓无任何 `.masthead` 样式规则。
- `.prompt`：出现在 `src/app/config/ConfigPageHeader.tsx:19`（`<p className="prompt">`）和 `src/app/pair/PairPageHeader.tsx:19`（`<p className="prompt">`），全仓无任何 `.prompt` 样式规则。
- `.button`：出现在 `src/app/pair/PairSignedInCard.tsx:28`（`<a className="button" href={returnTo}>`），全仓无 `.button` 类定义（`config-base.css:94` 写的是元素选择器 `button` 而非类选择器 `.button`），导致该“继续”按钮退化为普通带下划线的浏览器默认链接。

### 2.5 跨目录 CSS `@import` 耦合与特异性对抗

由于没有抽取公共基础组件样式层，各页面通过相对路径跨目录强行 `@import` 其它业务组件的样式文件：
- **详情页跨目录导入**：`src/app/view/[runId]/[file]/page.tsx:18-19` 直接通过 `import "../../../components/card/cards.css"` 和 `import "../../../components/profile/profile.css"` 借用主看板卡片与上游浮层样式。
- **指纹页跨目录导入 9 个看板组件 CSS**：`src/app/fingerprint/fingerprint.css:2-6` 与 `src/app/fingerprint/fingerprint-timeline.css:2-5` 跨目录 `@import` 了 `../components/toolbar/toolbar-elements.css`、`../components/menu/menu.css`、`../components/run-status/run-status.css`、`../components/run-control/run-control.css`、`../components/profile/profile.css`、`../components/timeline/timeline.css`、`../components/timeline/folder.css`、`../components/toolbar/calendar.css`、`../components/model-modal/model-modal.css`，随后在 `fingerprint-timeline.css:18` 中对 `.folder` 的固定 216px 几何布局进行强行覆写。
- **加载顺序依赖**：`src/app/components/toolbar/toolbar-elements.css:86-87` 明确记载：`/* 双类选择器：menu.css 在本文件之后载入，同级选择器会被覆盖 */ .menu-button.menu-button-small { ... }`。组件样式的正确性被迫依赖父级 `Dashboard.tsx:12-13` 中 `import` 语句的先后顺序。

### 2.6 缺乏原子级 UI 契约导致的重复实现

因为没有任何原子级组件类（如 `.ui-btn`、`.ui-badge`、`.ui-dialog`、`.ui-close-btn`），全站在 43 个 CSS 文件中反复手写高度相似却细节迥异的同类控件：
- **按钮（Button）被重复实现了 12 套**：`.lang-switch` (`globals.css:110`)、`.menu-button` (`menu-base.css:12`)、`.check-bulk button` (`menu-rows.css:81`)、`.modal-export-btn` (`model-modal-dialog.css:62`)、`.modal-standard-btn` (`model-modal-standard.css:1`)、`.run-once-start` (`run-control-foot.css:49`)、`.run-stop` / `.run-stop-cancel` (`run-control-stop.css:9`)、`.profile-modal-cancel` (`run-control-profiles.css:100`)、`.cli-banner button` (`cli-status.css:39`)、`.viewer-actions a` (`viewer-base.css:48`)、`config-base.css` 的裸 `button` (`L94`) / `a.secondary-link` (`L135`)、`.data-repo-btn-*` (`config-data-repo.css:213,249`)、`.data-repo-pipeline-btn` (`config-data-repo-pipeline.css:120`)、`.schedule-toggle-btn` (`config-schedule.css:87`)、`.btn-preset` (`config-timeout.css:20`)。
- **弹窗右上角关闭按钮（Close `×`）被重复实现了 5 套**：
  - `.modal-close` (`model-modal-content.css:1`)：`32×32px`，`border: 1px solid var(--border)`，`border-radius: 8px`，`font-size: 20px`
  - `.run-once-close` (`run-control-stop.css:45`)：`28×28px`，`border: 1px solid var(--border)`，`border-radius: 6px`，`font-size: 13px`
  - `.filter-panel-close-btn` / `.day-panel-close-btn` / `.run-panel-close-btn` (`menu-panels.css:24,107`, `run-status-panel.css:71`)：`24×24px`，`border: 0`，`border-radius: 4px`，`font-size: 14px`
  - `.profile-modal-close` (`run-control-profiles.css:49`)：无固定宽高，`padding: 0 6px`，`border: none`，`font-size: 18px`
  - `.profile-card-close` (`profile.css:81`)：无固定宽高，`padding: 0 4px`，`border: none`，`font-size: 18px`
- **徽章与胶囊（Badge / Pill）被重复实现了 9 套**：`.badge` (`cards-base.css:51`)、`.badge-readonly` (`toolbar-elements.css:119`)、`.verdict-badge` (`folder.css:81`)、`.judge-tag` (`cards-footer.css:77`)、`.judge-pill` (`viewer-judge.css:3`)、`.standard-tag` (`viewer-drawers.css:107`)、`.data-repo-health-badge` (`config-data-repo.css:32`)、`.data-repo-github-badge` (`config-data-repo.css:241`)、`.schedule-badge` (`config-schedule.css:37`)、`.tier-badge` (`config-timeout.css:59`)，其圆角在 `4px`、`5px`、`6px`、`12px`、`999px` 之间随机摇摆，字号在 `9px`、`10.5px`、`11px`、`11.5px`、`12px` 之间随机摇摆。
