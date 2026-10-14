# 验收 M2-04：主看板、作品详情页与社交分享导出图国际化

> 完成主看板（`/`）、模型对比弹窗、作品独立详情页（`/view`）、评审抽屉以及横版/竖版/结果集导出 SVG 长图的 `en` / `zh-CN` 双语化改造，验收通过。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-04](../workorders/M2-04-dashboard-viewer-and-export-i18n.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-14 |
| 验收结论 | 通过 |
| commit | `e1601d0` |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

> 「实际」列写**实测到的东西**（"4 个 target：3 ok / 1 no-svg"、"tsc 0 error"、"时间线显示 24 格"），
> 不写"符合预期"。填不出证据就标 ⏳，不要标 ✅。
> 状态只用四个符号：✅ 通过 / ⚠️ 部分 / ⏳ 待执行 / ❌ 不通过。

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 顶部工具栏与筛选控制双语化 | 挂载 `<LanguageSwitch />`，日期导航、日历、时区、筛选菜单、跑一次、自动任务与 CLI 状态条均随 `locale` 切换 | `ToolbarUtils.tsx` 已挂载 `<LanguageSwitch />`；工具栏、筛选面板、手动触发与运行状态条等 30+ 组件全部接入 `useI18n()` | `src/app/components/toolbar/*`, `src/app/components/run-control/*` | ✅ |
| 2 | 时间线矩阵、卡片与对比弹窗双语化 | 泳道头、通过率、卡片徽章与成本/评审悬停提示、对比弹窗与黄金标准面板支持中英切换 | `RunGrid`、`PelicanCard`、`card-format`、`ModelModal`、`ModelStandardPanel` 全部支持 `en` 与 `zh-CN`，且题干原文保持逐字不变 | `src/app/components/timeline/*`, `src/app/components/card/*`, `src/app/components/model-modal/*` | ✅ |
| 3 | 作品详情页（`/view`）与评审抽屉双语化 | 页头挂载语言切换器（有 Provider 时），页脚抽屉与 `JudgeDrawer`（G1–G5、C1–C9、联系图说明）支持双语 | `ArtViewerHead`、`ArtViewerFoot`、`ArtViewerSiblings`、`JudgeDrawer` 已接入 `useI18n()` 与 `localizeGate` / `localizeCriterion` / `localizeDetailSubject` | `src/app/view/{ArtViewerHead,ArtViewerFoot,ArtViewerSiblings,JudgeDrawer}.tsx` | ✅ |
| 4 | 社交分享导出图（横版/竖版/结果集）双语化 | `timeline-svg.ts`、`timeline-portrait-svg.ts`、`result-set-svg.ts` 接收 `locale?: Locale` 并输出对应语言标题、副标题、图例与通过率 | `ExportMenu` 与 `ModelExportMenu` 将当前 `locale` 传入导出渲染器，三种导出 SVG 完整支持中英双语且缺省保持 `zh-CN` 兼容 | `src/app/components/export/{ExportMenu.tsx,timeline-svg.ts,timeline-portrait-svg.ts,result-set-svg.ts}` | ✅ |
| 5 | 特征快照与全量门禁零回归 | 既有 935 条单测（含 `test/fixtures/markup/**` 逐字节比对）、类型检查、长度门禁与生产构建全部通过 | `tsc --noEmit` 0 错误；`check-code-length` 434 文件 0 超标；`pnpm test` 935 pass / 0 fail；`pnpm build` 编译通过 | `pnpm lint && pnpm check:length && pnpm test && pnpm build` | ✅ |

## 2. 功能点逐条验收

> §1 是**工单**维度的账，本表是**功能点**维度的逐条验收，**两者不可互相替代**。
> 功能点清单取自工单总览（-00）的「覆盖功能编号」列（那是声明的范围），
> 由 `acceptance.mjs new / features-table` 机械生成；「状态」「证据」两列**人工逐条填**。
>
> 「验收要点/AC」若出现「无（整体交付）」，那是**上游待补的信号**——
> 回 `../feature-lists/` 给那个功能点补验收要点，**不要在本表里编一条**。

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

> 验收时**实际执行过**的命令与结果。任何人按此清单重跑应得到相同结论；
> 依赖外部条件的命令注明前置条件（冒烟轮次要求 `claude` / `codex` / `agy` 在 PATH 中且已登录，
> 并消耗配额）。bash 块从工单「验收」节复制而来。浏览器核对写成一行：页面 + 读数 / 截图位置。

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm lint
pnpm test
pnpm check:length
pnpm build
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm lint` | ✅ `tsc --noEmit` 0 errors | Node 22+, pnpm 10+ |
| `pnpm test` | ✅ 153 suites, 935 tests pass, 0 fail | Node 22+, pnpm 10+ |
| `pnpm check:length` | ✅ 扫描 434 个文件，超标 0 项 | Node 22+, pnpm 10+ |
| `pnpm build` | ✅ Next.js 15.5.25 生产构建成功（`/` 44.6 kB，`/view/[runId]/[file]` 4.23 kB） | Node 22+, pnpm 10+ |

## 4. 交付物

- 上下文扩展：`src/i18n/context.tsx`（增加 `hasProvider: boolean`，无 Provider 裸渲染回退 `zh-CN` 以保障既有 HTML 快照单测 100% 兼容，挂载 `<I18nProvider>` 时默认 `DEFAULT_LOCALE = "en"`）。
- 主看板与工具栏组件：`src/app/components/dashboard/*`、`src/app/components/toolbar/*`、`src/app/components/timeline/*`、`src/app/components/card/*`、`src/app/components/run-control/*`、`src/app/components/run-status/{RunStatus,RunStatusLanes}.tsx`、`src/app/components/cli-status/CliStatusBanner.tsx`、`src/app/components/model-modal/*`、`src/app/components/profile/ProfileInfoCard.tsx`。
- 作品独立详情页：[`src/app/view/ArtViewerHead.tsx`](../../src/app/view/ArtViewerHead.tsx)、[`src/app/view/ArtViewerFoot.tsx`](../../src/app/view/ArtViewerFoot.tsx)、[`src/app/view/ArtViewerSiblings.tsx`](../../src/app/view/ArtViewerSiblings.tsx)、[`src/app/view/JudgeDrawer.tsx`](../../src/app/view/JudgeDrawer.tsx)。
- 导出图流水线：[`src/app/components/export/ExportMenu.tsx`](../../src/app/components/export/ExportMenu.tsx)、[`src/app/components/export/timeline-svg.ts`](../../src/app/components/export/timeline-svg.ts)、[`src/app/components/export/timeline-portrait-svg.ts`](../../src/app/components/export/timeline-portrait-svg.ts)、[`src/app/components/export/result-set-svg.ts`](../../src/app/components/export/result-set-svg.ts)。

## 5. 与计划的偏差

- 将 `RunStatus.tsx` 中的泳道详情拆分为同目录子组件 `src/app/components/run-status/RunStatusLanes.tsx`，以确保双语化后单个 `.tsx` 文件与函数行数严格低于 `config/code-length-policy.yaml` 阈值。

## 6. 技术决策

- **无 Provider 裸渲染回退策略**：仓库内有 40+ 个既有组件级单测直接调用 `renderToStaticMarkup(<Component />)` 并与 `test/fixtures/markup/wp-{f,g,h,l,p}/*.html` 逐字节比对。通过将 `createContext` 的裸默认值设为 `locale: "zh-CN", hasProvider: false`，而真实应用根布局挂载的 `<I18nProvider>` 默认 `initialLocale = "en", hasProvider: true`，在不改动任何既有 HTML 快照的前提下实现了应用默认英文与全量单测零回归。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|
| 1 | `/config` 与 `/pair` 页面尚未接入双语切换 | 配置页与配对页仍显示中文文案 | 由下一单 `M2-05` 接手实现 |

## 8. 风险与下一步

- 下一步执行 `M2-05`（配置管理台 `/config` 与设备配对页 `/pair` 国际化）。
