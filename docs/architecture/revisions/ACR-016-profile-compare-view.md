# ACR-016: 上游 profile 的对比视图与信息卡（Upstream Profile Comparison View and Info Card）

| 项 | 内容 |
|---|---|
| 状态 | implementing |
| 日期 | 2026-09-29 |
| 变更类型 | structure-change |
| 触发来源 | 口头：profile 怎么显示、点它要出信息卡，首页、模态弹窗、大图详情页如何展示；设计见 docs/profiles/profile-display-ux.md §3–§8，前置 ACR-015 |
| 基线 | ARCH-001 |
| 影响章节 | §1 §3 |
| 改造面上限 | 4 个模块（测试目录与源模块同构：src/app、src/core 各带一个 test 目录） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：首页行键 `cli/model/promptId` 不含 profile，三个上游的同强度作品挤进同一角只见一张；弹窗把三个上游
  报成"3 个强度"；卡片只在截断的 `label` 里带上游名；大图页与进度面板完全不显示上游。
- 不动的代价：多上游跑出来的结果无法并排比较，也看不出每张作品来自哪家上游、几折。
- 为什么现在：ACR-015 之后用户能发起多上游对比，结果必须能看。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 用 Radix Popover 做上游信息卡浮层 | npm:@radix-ui/react-popover | 1.1.23 | MIT | 2026-07-24 | active | 2 个模块（src/app 与 package.json） | 中：新增依赖树；仓库已有模态行为实现，两套并存 | reject | 改造面：为一个浮层引入组件库；复用 `use-modal-behavior` 与既有菜单的外点关闭（`use-menu-dismiss`）只动 src/app 1 个模块 |
| 自研：页数据下发 `profiles` 公开字段；格子角计数标与行标题色点；弹窗改上游 × 强度矩阵；大图页标题带上游名与同轮切换；筛选加"上游"；进度面板按上游分组；信息卡复用既有浮层行为 | self | - | - | - | - | 2 个模块（src/app、src/core） | 低：只用仓库既有组件与配置模型 | adopt | - |

> **结论**：自研 —— 全部是本仓库特有的呈现逻辑，浮层与外点关闭行为已有实现。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/profile-view.ts` | add | `ProfileView`（名字、显示名、CLI、上游类型、分组、官网、倍率、启用）与从配置组装的函数；不含接口地址、查询参数、key | no |
| `src/app/components/dashboard/dashboard-page-data.ts` | modify | `readDashboardSettings` 增 `profiles` | no |
| `src/app/page.tsx` | modify | 把 `profiles` 传给看板 | no |
| `src/app/components/Dashboard.tsx` | modify | 用 `ProfilesProvider` 把 `profiles` 与 `owner` 提供给工具栏、网格、弹窗与进度面板 | no |
| `src/app/components/profile/profiles-context.tsx` | add | 上游清单与所有者视角的 React context，避免逐层透传 | no |
| `src/app/components/profile/ProfileName.tsx` | add | 上游名按钮（色点 + 显示名，`aria-haspopup="dialog"`）；点击打开信息卡 | no |
| `src/app/components/profile/ProfileInfoCard.tsx` | add | 信息卡：显示名、标识与类型、分组、倍率、官网、本件耗时与成本、配对设备的"在配置页编辑" | no |
| `src/app/components/profile/profile-color.ts` | add | 名字散列到固定调色板 | no |
| `src/app/components/profile/profile.css` | add | 名字按钮、信息卡浮层与窄屏抽屉 | no |
| `src/app/components/timeline/effort-slots.ts` | modify | 每角多个上游时取登录态、否则取配置顺序第一个；增每角计数 | yes |
| `src/app/components/timeline/FolderTile.tsx` | modify | 角上 `×N` 计数标 | no |
| `src/app/components/timeline/RunGrid.tsx` | modify | 行标题右侧上游色点 | no |
| `src/app/components/export/timeline-svg.ts` | modify | 导出图画色点与 `×N` | no |
| `src/app/components/export/ExportMenu.tsx` | modify | 从 context 取上游清单传给导出图 | no |
| `src/app/components/model-modal/ModelModal.tsx` | modify | 多上游时改为列 = 上游、行 = 强度的矩阵 | yes |
| `src/app/components/model-modal/ModelModalHeader.tsx` | modify | 副标题按上游数与可见列计数 | no |
| `src/app/components/model-modal/ProfileMatrix.tsx` | add | 矩阵布局与列标题 | no |
| `src/app/components/model-modal/model-modal-content.css` | modify | 矩阵样式 | no |
| `src/app/components/card/PelicanCard.tsx` | modify | 非默认上游的副标题只留 `model · effort`；成本行注明"未乘倍率" | yes |
| `src/app/components/card/card-format.ts` | modify | 成本说明文字 | no |
| `src/app/view/[runId]/[file]/page.tsx` | modify | 载入同轮同模型同强度同题的其余上游作品 | no |
| `src/app/view/ArtViewer.tsx` | modify | 传上游与同轮切换 | no |
| `src/app/view/ArtViewerHead.tsx` | modify | 标题带上游名，同轮上游切换条与左右键 | no |
| `src/app/components/toolbar/filters.ts` | modify | 增 `profile` 维度（登录态记为 `default`） | no |
| `src/app/components/toolbar/toolbar-filter-groups.tsx` | modify | "上游"一节 | no |
| `src/app/components/run-status/RunStatus.tsx` | modify | 分道按上游分组，组标题为上游名 | no |
| `test/core/profile-view.test.ts` | add | 公开字段白名单 | no |
| `test/app/components/timeline/effort-slots-profile.test.ts` | add | 多上游落角与计数 | no |
| `test/app/components/model-modal/profile-matrix.test.ts` | add | 矩阵行列与计数 | no |
| `test/app/components/profile/profile-info-card.test.ts` | add | 信息卡不含接口地址与 key；配对设备才有编辑链接 | no |
| `test/app/components/toolbar/filters-profile.test.ts` | add | 上游筛选 | no |

**不动的东西**：

- 首页行键与分行规则；只有登录态时格子、弹窗、卡片、大图页与现在逐字相同。
- `src/core/data-source` 与公开数据仓契约：远程展台在契约支持前没有上游结果，所有上游元素不出现。
- 计价：折算成本仍按官价，倍率只显示不参与计算（留给凭据与计价变更单）。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 卡片没有 `profile` 字段时走原有路径；`profiles` 为空数组时工具栏与弹窗不显示任何上游元素。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | - | | 6797610 |
| `pnpm test` | node:test 全量 | pass | - | | 6797610，722 项 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | - | | 6797610 |
| `pnpm build` | Next.js 看板生产构建 | pass | - | | bd14e0d |
| `PELICAN_CONFIG=data/profile-smoke.config.yaml pnpm run:once` | 端到端冒烟：3 个 profile 同轮并行（动态鹈鹕车），产出供看板核对 | pass | - | | 轮次 20260929T140327Z |

看板呈现在分步实施里用开发服务器与截图核对：三上游格子计数、弹窗矩阵、信息卡不含接口地址、大图页切换。

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 页数据与信息卡：`profile-view`、`ProfileName`、`ProfileInfoCard`、色点 | revert 本 commit |
| 2 | 首页与弹窗：落角计数、行标题色点、导出图、上游 × 强度矩阵、卡片表头与成本说明 | revert 本 commit |
| 3 | 大图页、筛选、进度面板分组 | revert 本 commit |
| 4 | 本单登记与 architecture.md 回填（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；只有登录态的页面出现任何呈现差异。
- 步骤：逆序 revert 三个代码 commit；无持久化状态（筛选记在浏览器本地存储，多出的键被忽略）。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：页数据下发上游公开字段；首页格子角计数与行标题色点；弹窗改上游 × 强度矩阵、列标题可点开信息卡；大图页标题带上游名与同轮切换；筛选加上游；进度面板按上游分组；涉及 src/core、src/app 及其测试 4 个模块。
2. 不动什么：行键与分行；只有登录态时一切逐字相同；数据源与数据仓契约；计价。
3. 为什么现在：ACR-015 之后能发起多上游对比，结果必须能并排看。
4. 风险与回滚：最坏是信息卡泄露接口地址——页数据只组装白名单字段并有测试守住；回滚 = 逆序 revert 3 个 commit。
5. 成本：4 步 4 个 commit；无新依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-29 | luojin | approved | 设计文档 docs/profiles/profile-display-ux.md（6797610）已确认，AskUserQuestion 批准 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §1 | 看板：多上游时弹窗为上游 × 强度矩阵，大图页可切同轮上游 | 待回填 |
| architecture.md §3 | 页数据只下发上游公开字段 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-016 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转 | 待回填 |
