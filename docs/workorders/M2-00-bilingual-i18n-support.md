# Sprint 总览 M2-00：中英双语全栈国际化改造

> 在不改动任何评测提示词原文、不破坏历史运行记录与公开数据仓 Schema、不改变现有 URL 路由且零新增第三方依赖的前提下，完成 `llm-iq-dashboard` 的文档体系（English-First README + 核心文档）、主看板与导出长图/GIF、题库展示元数据与评审抽屉、以及 `/config` 与 `/pair` 管理台的中英双语（`en` / `zh-CN`）国际化改造。

| 项 | 内容 |
|---|---|
| Sprint 目标 | 建立 `src/i18n/` 类型安全双语底座；将 `README.md` 切换为英文主入口并保留 `README.zh-CN.md` 及核心双语文档；完成 54 道题与 300 条候选的展示元数据与评审标准双语映射；完成主看板、详情页、导出图、`/config` 与 `/pair` 全界面中英双语切换，并通过全量质量门禁 |
| 关联 issue | 无（基于用户确认的全栈国际化方案直接立项的 Sprint 任务） |
| 范围来源 | 用户确认的 `i18n_plan.md` 全栈双语方案（涵盖文档 + 全部前端界面含 `/config` 管理页 + 题库展示元数据，英文为主 README，支持 `en` / `zh-CN`） |
| 前置 | Sprint M1 已收口，全库 54 道内置题目与 300 条候选已定稿并通过 `pnpm validate:prompts` |
| 周期 | 2026-10-13 |
| 收口文件 | [M2-00](../acceptance/M2-00-bilingual-i18n-support.md)（Sprint 收口时由 `/sprint-acceptance` 生成） |

## 目标与已定决策

1. **四条不可妥协的工程红线**：
   - **基准可比性红线（题面原文零改动）**：`src/core/prompt.ts` 中登记的 54 道内置题目（`PromptSpec.template`）与 300 条候选（`PromptCandidate.text`）、`src/core/house-rules.ts` 的默认直出约束原文、`src/core/judge/ai-prompt.ts` 的裁判提示词逐字锁定不翻译；仅对面向人类读者的展示层字段（`label`、分类组名、`standard.coreKey` / `groundTruth` / `evaluationCriteria`、题龄文案）提供双语映射。
   - **数据仓与历史产物兼容红线（Schema 零破坏）**：`src/core/data-repo/contract.ts` 的 `DATA_REPO_SCHEMA_VERSION = 1`、本地 `data/runs/<runId>/run.json` 与 `<attemptKey>.judge.json` 结构保持不变；评审门槛（`G1`–`G3`）与分项标准（`C1`–`C9`）在展示层按固定 ID 动态映射中英文标题与判据说明。
   - **零路由破坏与零外部重依赖**：不采用 `/en/...`、`/zh-CN/...` 路径前缀路由，保持 `/`、`/view`、`/config`、`/pair`、`/art`、`/sheet`、`/api/*` 全部 URL 不变；在 `src/i18n/` 下使用纯 TypeScript 类型安全字典 + React Context + Cookie / `localStorage`（`pelican_locale`）+ `Accept-Language` 首屏协商。
   - **代码长度门禁合规**：严守 `config/code-length-policy.yaml`（`.ts ≤ 500 行`、`.tsx ≤ 300 行`、`.css ≤ 300 行`、函数 `≤ 50/80 行`）。
2. **文档主语言策略**：
   - `README.md` 改为英文主文档，原中文移至 `README.zh-CN.md`，首行放置 `English | 简体中文` 互链；对外核心文档（`docs/deploy-docker.md`、`docs/deploy-public-showcase.md`、`docs/development.md`、`docs/design-notes.md`、`docs/data-sync-architecture.md`）提供英文主版与 `.zh-CN.md` 中文版互链。

## 现状（已定位）

实测日期：2026-10-13

| 能力/模块 | 当前状态 | 真实落点与实测行数 | 判定 |
|---|---|---|---|
| 全局根布局与 `<html lang>` | 硬编码 `lang="zh-CN"` 与中文 `metadata` | `src/app/layout.tsx` (20 行) | 已有但不支持双语，需接入 Cookie / `Accept-Language` 与 `I18nProvider` |
| 轻量双语引擎与字典 | 仓库尚无 `src/i18n/` 目录 | `src/i18n/` (0 文件) | 完全没有，需新建类型安全字典与 Context |
| 对外 README 与核心文档 | 全部仅中文版本 | `README.md` (418 行)、`docs/deploy-docker.md` (232 行)、`docs/deploy-public-showcase.md` (140 行)、`docs/development.md` (141 行)、`docs/design-notes.md` (103 行)、`docs/data-sync-architecture.md` (308 行) | 已有中文但无英文主版与 `.zh-CN.md` 互链 |
| 题库展示元数据与生命周期 | 54 道题、300 条候选、274 条 `PromptStandard`；30 道单题与 14 套 FE/VFX `label` 含 `中文 (English)`，名著与地标及 `standard` 为中文；题龄仅中文 | `src/core/prompt/lifecycle.ts` (60 行)、`src/app/components/run-control/run-once-grouping.ts` (124 行)、`src/app/components/toolbar/toolbar-filter-groups.tsx` (55 行) | 已有中文与部分双语括号，缺少展示层按 `locale` 提取与映射 |
| 评审标准与部位名 | `G1`–`G3`、`C1`–`C9` 及 `DetailKind` 标题/标准仅中文 | `src/core/judge/schema.ts` (230 行)、`src/app/view/JudgeDrawer.tsx` (103 行) | 已有中文，需按 ID 提供展示层双语映射 |
| 主看板、详情页与导出图 | 全部界面文案与 SVG/PNG/GIF 导出标题硬编码中文 | `src/app/components/toolbar/Toolbar.tsx` (102 行)、`src/app/components/export/timeline-svg.ts` (357 行)、`result-set-svg.ts` (314 行)、`src/app/view/ArtViewer.tsx` (43 行) | 已有但硬编码中文，需接入 `useI18n` 与 `locale` 参数 |
| `/config` 与 `/pair` 管理台 | 全部表单、导航与提示硬编码中文 | `src/app/config/page.tsx` (86 行)、`ConfigSideNav.tsx` (104 行)、`src/app/pair/page.tsx` (42 行) | 已有但硬编码中文，需接入 `useI18n` |

## 关键落地约束（必须先验证）

1. **类型期键值对称性**：`en` 与 `zh-CN` 字典必须共享同一套 TypeScript 接口类型，任何一侧漏翻或错拼键名必须直接触发 `pnpm lint`（`tsc --noEmit`）编译错误。
2. **SSR 与客户端水合一致性**：`src/app/layout.tsx` 为异步或读取 `cookies()` / `headers()` 的 Server Component（或客户端安全同步读取初始属性），确保首屏 SSR 输出的文本与客户端首次渲染 `locale` 一致，不产生 React hydration error；同时兼容 `pnpm showcase:smoke` 静态/只读构建。
3. **文件与函数长度红线**：`src/app/components/export/timeline-svg.ts` 已达 357 行、`result-set-svg.ts` 已达 314 行（上限 500 行），字典抽离到 `src/i18n/messages/export.ts` 可避免导出文件膨胀；所有 `.tsx` 组件保持在 300 行以内。

## 工单构成

⚠️ **前三列列序固定**（后面想加列随意），脚本只认这个形状：
第一列含工单号、第二列名称、第三列功能编号。**本表是"这个 Sprint 声明覆盖哪些功能点"的权威源**——
验收的功能点表、`workorders.mjs features` 都从这里取。

| 工单 | 名称 | 覆盖功能编号 | 依赖 | 可并行性 |
|---|---|---|---|---|
| [M2-01](M2-01-i18n-core-and-locale-context.md) | 双语字典核心底座与全局语言上下文 |  | 无 | 最先动工 |
| [M2-02](M2-02-bilingual-docs-and-readme.md) | 英文主 README 与对外核心文档双语化 |  | M2-01 | 可与 M2-03 并行 |
| [M2-03](M2-03-prompt-and-judge-metadata-i18n.md) | 题库展示元数据与评审标准双语映射 |  | M2-01 | 可与 M2-02 并行 |
| [M2-04](M2-04-dashboard-viewer-and-export-i18n.md) | 主看板、作品详情页与社交分享导出图国际化 |  | M2-01, M2-03 | 依赖 M2-01、M2-03 |
| [M2-05](M2-05-config-and-pair-console-i18n.md) | 配置管理台与设备配对页国际化 |  | M2-01, M2-03 | 可与 M2-04 并行 |
| [M2-06](M2-06-i18n-tests-and-quality-gates.md) | 双语完整性单测与全量质量门禁收口 |  | M2-02, M2-04, M2-05 | 收尾合拢 |

本仓库未建立 `docs/feature-lists/` 功能清单，「覆盖功能编号」列按规范留空，由各工单独立承接对应模块改造。

## Sprint 完成判定

| # | 判定条目 | 证据形式 |
|---|---|---|
| 1 | `src/i18n/` 提供完整 `en` / `zh-CN` 类型安全字典、语言上下文与 `<LanguageSwitch />`，`src/app/layout.tsx` 支持双语 `<html lang>` 与 metadata | `pnpm lint` 退出码 0 + `test/i18n/` 单测通过 |
| 2 | `README.md` 切换为英文主入口并保留 `README.zh-CN.md` 互链，对外核心部署与开发文档具备英文版与 `.zh-CN.md` 互链 | 文档文件存在且 Markdown 互链核验通过 |
| 3 | 54 道内置题目与 300 条候选的展示层 `label`、`PromptStandard`、题龄文案、分组标题以及评审标准 `G1`–`G3` / `C1`–`C9` 支持 `en` / `zh-CN` 双语输出，且题面 `template` / `text` 零字节改动 | `pnpm validate:prompts` 0 错误 + 单测哈希校验通过 |
| 4 | 主看板（`/`）、作品详情页（`/view`）与 SVG/PNG/GIF 社交分享导出图完整支持 `en` / `zh-CN` 切换 | `pnpm build` 与 `pnpm test` 通过 |
| 5 | 配置管理台（`/config`）与设备配对页（`/pair`）完整支持 `en` / `zh-CN` 切换 | `pnpm build` 与 `pnpm test` 通过 |
| 6 | 全套质量门禁（`pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`、`pnpm showcase:smoke`）全部绿灯通过 | 终端执行全部门禁命令退出码 0 |

## 边界

- **不做**：
  - 不翻译或修改任何发给被测模型的 `PromptSpec.template`、`PromptCandidate.text`、`house-rules.ts` 默认直出约束原文或 `ai-prompt.ts` 裁判提示词；
  - 不修改 `src/core/data-repo/contract.ts` 数据仓契约版本号，不重跑或重写 `data/runs/` 下的历史 `run.json` 与 `.judge.json`；
  - 不修改任何 CLI 适配器（`src/adapters/`）及执行器编排逻辑（`src/core/runner.ts`、`src/core/scheduler.ts`）；
  - 不翻译内部工程过程记录（`docs/workorders/`、`docs/acceptance/`、`docs/architecture/revisions/`、`AGENTS.md`）。

## 依赖

- 前置：Sprint M1 已完成并合入；
- 环境：Node 22+ 与 pnpm 10+。
