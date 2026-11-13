# Sprint 总览 M3-00：2026年10月流行评测题库注册与看板分组呈现

> 将 2026 年 10 月社区流行的 8 道高难度评测题目（简森步行机构、跳蛛起跳、蜈蚣行波、开放差速器、摩天轮自水平、章鱼管风琴、孔雀骑车、鹦鹉螺螺线）正式接入仓库核心题库并实现看板分类呈现：建立独立的 2026-10 分组并紧随 2026-09 分组之后展示，更新出处台账并通过全套质量防御门禁。

| 项 | 内容 |
|---|---|
| Sprint 目标 | 注册 8 道 2026 年 10 月流行评测题目到核心题库；建立独立的 2026-10 分组并在看板紧随 2026-09 展示；更新出处考证台账并通过全套质量门禁 |
| 关联 issue | 无（基于社区评测研究成果与用户指令直接立项的Sprint任务） |
| 范围来源 | `docs/research/x-viral-ai-evals-2026-10/final_8_outcome/` 目录下定稿的 8 份题目文档与 PromptSpec 契约 |
| 前置 | 8 道题目的 Markdown 规范与评测真值已在 `final_8_outcome/` 中完成 52 轮检索与去重审查定稿 |
| 周期 | 2026-11-12 |
| 收口文件 | [M3-00](../acceptance/M3-00-viral-prompts-2026-10.md)（Sprint 收口时由 `/sprint-acceptance` 生成） |

## 目标与已定决策

1. **核心题库扩展架构（符合 ACR-025 规范）**：
   - 遵循 `src/core/prompt/bank/` 模块分拆规范，单文件行数不超过 500 行；
   - 新建目录 `src/core/prompt/bank/benchmarks/2026-10/`，创建 `index.ts` 承载 8 道题目常量及 `PROMPTS_2026_10` 数组，创建配对的英文国际化标准字典 `display-en.ts`；
   - 在 `src/core/prompt/bank/index.ts` 集中导入并注册到 `BUILTIN_PROMPTS`，在 `src/core/prompt.ts` 集中向外部暴露常量。
2. **看板运行控制分组体系**：
   - 修改 `src/app/components/run-control/run-once-grouping.ts`，扩展 `GroupKey` 联合类型新增 `'2026-10'`；
   - 为 8 道新题建立 `OCTOBER_2026_PROMPT_IDS` 集合，在 `classifyPrompt` 中分类至 `'2026-10'`；
   - 分组展示顺序：`"经典基准"` -> `"四大名著（文学与叙事构图）"` -> `"世界地标（微缩景观）"` -> `"2026 前沿工程评测 (FE-1 ~ FE-8)"` -> `"2026 前沿视觉特效 (VFX)"` -> `"微观物理与前沿探索"` -> `"2026-09"` -> `"2026-10"` -> `"自定义提示词"`；确保 `"2026-10"` 紧随 `"2026-09"` 之后展示；
   - 在 `src/core/prompt/i18n/index.ts` 注册 `'2026-10'` 的中英双语标签。
3. **数据安全性与质量红线**：
   - 严禁任何 `<script>` 注入；所有样式以 CDATA 保护；
   - 全程通过 `pnpm validate:prompts`、`pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm check:secrets`。

## 现状（已定位）

实测日期：2026-11-12

| 能力/模块 | 当前状态 | 真实落点 | 判定 |
|---|---|---|---|
| 2026-09 专属模块 | 已包含 8 道秋季独立题目及 display-en.ts | `src/core/prompt/bank/benchmarks/2026-09/` | 已有且稳定，可作为 2026-10 架构模版 |
| 2026-10 专属目录 | 尚未创建 | `src/core/prompt/bank/benchmarks/2026-10/` | 完全没有，需新建 index.ts 与 display-en.ts |
| 题库集中登记入口 | 已汇聚 54 项内置题目定义 | `src/core/prompt/bank/index.ts` | 已有但尚未引入 2026-10 题库 |
| 提示词模块重新导出 | 集中 export 核心类型与常量 | `src/core/prompt.ts` | 已有但未 export 本次 8 题 |
| 看板分组与分类器 | `GroupKey` 联合类型当前有 8 个分组，未包含 2026-10 | `src/app/components/run-control/run-once-grouping.ts` | 已有但缺少 2026-10 分组与新题 ID 映射 |
| 分组单元测试 | 现有 11 个测试用例覆盖前沿、2026-09 与自定义 | `test/app/components/run-control/run-once-grouping.test.ts` | 已有且全绿，需扩展 2026-10 排序测试 |
| 基准出处台账 | 登记了至 2026-09 批次出处 | `docs/benchmark-provenance.md` | 已有但缺少本次 8 题的出处登记 |

## 关键落地约束（必须先验证）

1. **题目规范与类型约束**：每道题目的 `PromptSpec` 必须具备严格合法的 `PromptStandard`，含 `coreKey`、`groundTruth`（必须具备首尾闭合与动量下界门禁）、`evaluationCriteria`（Pass/Partial/Fail 三态），必须能通过 `pnpm validate:prompts`。
2. **代码行数约束**：
   - `src/core/prompt/bank/benchmarks/2026-10/index.ts` 新建 8 题，预计约 300 行，低于 500 行上限；
   - `display-en.ts` 预计约 80 行，低于 500 行上限；
   - `run-once-grouping.ts` 当前 132 行，修改后预计约 150 行，远低于 300 行 UI 组件/逻辑上限；
   - 每道题的 groundTruth 与 criteria 确保纯数据对象，无超长函数。
3. **展示顺序约束**：UI 分组排序必须严格按固定映射键顺序迭代，将 `"2026-10"` 精确置于 `"2026-09"` 之后。

## 工单构成

| 工单 | 名称 | 覆盖功能编号 | 依赖 | 可并行性 |
|---|---|---|---|---|
| [M3-01](M3-01-register-october-viral-prompts.md) | 核心题库注册：2026-10 题目录入与 TypeScript 模块实现 | （本单不挂功能点：核心题库扩展，独立自闭环） | 无 | 否 |
| [M3-02](M3-02-grouping-october-prompts.md) | 看板运行控制分类与 2026-10 分组呈现 | （本单不挂功能点：看板分类扩展，独立自闭环） | M3-01 | 否 |
| [M3-03](M3-03-benchmark-provenance-and-acceptance.md) | 基准出处台账更新与全量质量门禁验收 | （本单不挂功能点：台账更新与全量回归验收） | M3-02 | 否 |

## Sprint 完成判定

| # | 判定条目 | 证据形式 |
|---|---|---|
| 1 | 8 道题目经 `pnpm validate:prompts` 校验 100% 通过无格式与校验契约错误 | 终端运行 `pnpm validate:prompts` 输出 0 错误 |
| 2 | TypeScript 类型检查通过，无类型定义缺失或接口不匹配 | 终端运行 `pnpm lint` 退出码 0 |
| 3 | 看板分组与分类器单元测试全部通过，覆盖 2026-10 分组及排序验证 | 终端运行 `pnpm test` 全部通过 |
| 4 | 代码与文件长度策略符合规范，无文件或函数超标 | 终端运行 `pnpm check:length` 退出码 0 |
| 5 | 无任何敏感凭据或私钥泄漏 | 终端运行 `pnpm check:secrets` 退出码 0 |
| 6 | 基准出处文档与台账记录齐备，真实反映题目背景与许可状态 | `docs/benchmark-provenance.md` 包含 8 道题目的详细条目 |

## 边界

- **不做**：
  - 本 Sprint 不改动既有题目的提示词模板与评分标准；
  - 不修改任何 CLI 适配器（`src/adapters/`）；
  - 不修改执行器逻辑（`src/core/runner.ts`、`src/core/scheduler.ts`）；
  - 不修改数据仓同步契约（`src/core/data-repo/contract.ts`）。
- **允许修改**：
  - `src/core/prompt/bank/benchmarks/2026-10/`（新建目录、`index.ts` 与 `display-en.ts`）
  - `src/core/prompt/bank/index.ts`
  - `src/core/prompt.ts`
  - `src/core/prompt/i18n/index.ts`
  - `src/core/prompt/i18n/standards-en.ts`
  - `src/app/components/run-control/run-once-grouping.ts`
  - `test/app/components/run-control/run-once-grouping.test.ts`
  - `docs/benchmark-provenance.md`
  - `docs/workorders/` 与 `docs/acceptance/` 下的相关施工与验收文件。

## 依赖

- 前置：`docs/research/x-viral-ai-evals-2026-10/final_8_outcome/` 目录下定稿的 8 份题目文档与 PromptSpec 契约定义；
- 环境：Node 22+ 与 pnpm 10+ 环境。
