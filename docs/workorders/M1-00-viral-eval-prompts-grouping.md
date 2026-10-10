# Sprint 总览 M1-00：2026秋季流行评测题库注册与看板分组

> 将 2026 年秋季社区流行的 10 道评测题目正式接入仓库核心题库并实现看板分类呈现：犰狳与狐猴两题并入经典基准，其余 8 题建立 2026-09 专属分组并置于微观物理分组之后。

| 项 | 内容 |
|---|---|
| Sprint 目标 | 注册 10 道流行评测题目到核心题库；Q05/Q06 加入经典基准分组；剩余 8 题建立 2026-09 分组并在看板紧随微观物理展示；更新出处台账并通过全套质量门禁 |
| 关联 issue | 无（基于社区评测研究成果与用户指令直接立项的Sprint任务） |
| 范围来源 | `docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/` 目录下定稿的 10 份题目文档与 PromptSpec 契约 |
| 前置 | 10 道题目的 Markdown 规范与评测真值已在 `final_10_outcome/` 中经 3 轮审查定稿 |
| 周期 | 2026-10-10 |
| 收口文件 | [M1-00](../acceptance/M1-00-viral-eval-prompts-grouping.md)（Sprint 收口时由 `/sprint-acceptance` 生成） |

## 目标与已定决策

1. **核心题库扩展架构**：
   - 遵从既有 `src/core/prompt/` 模块分拆规范，单文件行数不超过 500 行；
   - Q05（`animated-armadillo-fishnet-mars-v1`）与 Q06（`animated-lemur-scooter-front-v1`）由于其高辨识度与流行度，正式并入经典基准数据模块 `src/core/prompt/data-classic.ts`；
   - 剩余 8 题（复古PC、橙屏CRT、服务器机架、相机爆炸图、人体机械手、鱼跃入云、海岛宝箱、树下读者）在独立的新模块 `src/core/prompt/data-2026-09.ts` 中录入；
   - `src/core/prompt/builtin.ts` 汇聚导出至 `BUILTIN_PROMPTS`，`src/core/prompt.ts` 集中向外部暴露常量。
2. **看板运行控制分组体系**：
   - 修改 `src/app/components/run-control/run-once-grouping.ts`，扩展 `GroupKey` 联合类型新增 `'2026-09'`；
   - 将 Q05 与 Q06 追加进 `CLASSIC_PROMPT_IDS`，归类至「经典基准」；
   - 为剩余 8 题建立 `NEW_2026_09_PROMPT_IDS`，分类至 `'2026-09'`；
   - 分组展示顺序：`"经典基准"` -> `"四大名著（文学与叙事构图）"` -> `"世界地标（微缩景观）"` -> `"2026 前沿工程评测 (FE-1 ~ FE-8)"` -> `"2026 前沿视觉特效 (VFX)"` -> `"微观物理与前沿探索"` -> `"2026-09"` -> `"自定义提示词"`；确保 `"2026-09"` 紧随 `"微观物理与前沿探索"` 之后展示。
3. **数据安全性与质量红线**：
   - 严禁任何 `<script>` 注入；所有样式以 CDATA 保护；
   - 全程通过 `pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm check:length`、`pnpm check:secrets`。

## 现状（已定位）

实测日期：2026-10-10

| 能力/模块 | 当前状态 | 真实落点 | 判定 |
|---|---|---|---|
| 经典基准题库 | 已有 6 题独立 export 常量 | `src/core/prompt/data-classic.ts` (176 行) | 已有且够用，可安全追加 Q05/Q06 常量 export |
| 2026-09 专属模块 | 目前尚未创建 | `src/core/prompt/data-2026-09.ts` | 完全没有，需新建 |
| 题库内置登记 | 已登记 36 题内置题目 | `src/core/prompt/builtin.ts` (76 行) | 已有但未包含本次 10 题 |
| 提示词模块重新导出 | 集中 export 核心类型与常量 | `src/core/prompt.ts` (62 行) | 已有但未 export 本次 10 题 |
| 看板分组与分类器 | `GroupKey` 有 7 个分组，`CLASSIC_PROMPT_IDS` 为 3 项的 ReadonlySet | `src/app/components/run-control/run-once-grouping.ts` (109 行) | 已有但缺少 2026-09 分组与新题 ID |
| 分组单元测试 | 现有 5 个测试用例覆盖前沿与自定义 | `test/app/components/run-control/run-once-grouping.test.ts` (86 行) | 已有且全绿，需扩展 2026-09 测试 |
| 基准出处台账 | 登记了 Pelican、四大名著、地标等出处 | `docs/benchmark-provenance.md` | 已有但缺少本次 10 题的出处登记 |

## 关键落地约束（必须先验证）

1. **题目规范与类型约束**：每道题目的 `PromptSpec` 必须具备严格合法的 `PromptStandard`，含 `coreKey`、`groundTruth`（必须具备首尾闭合与动量下界门禁）、`evaluationCriteria`（Pass/Partial/Fail 三态），必须能通过 `pnpm validate:prompts`。
2. **代码行数约束**：
   - `data-classic.ts` 当前 143 行，追加 2 题后预计约 210 行，远低于 500 行上限；
   - `data-2026-09.ts` 新建 8 题，预计约 300 行，低于 500 行上限；
   - `run-once-grouping.ts` 当前 105 行，修改后预计约 130 行，远低于 300 行 UI 组件/逻辑上限；
   - 每道题的 groundTruth 与 criteria 确保纯数据对象，无超长函数。
3. **展示顺序约束**：UI 分组排序必须严格按固定映射键顺序迭代，将 `"2026-09"` 精确置于 `"微观物理与前沿探索"` 之后。

## 工单构成

| 工单 | 名称 | 覆盖功能编号 | 依赖 | 可并行性 |
|---|---|---|---|---|
| [M1-01](M1-01-register-viral-prompts.md) | 核心题库注册：经典与2026-09题目录入 |  | 无 | 否 |
| [M1-02](M1-02-grouping-classic-and-september.md) | 看板运行控制分类与2026-09分组 |  | M1-01 | 否 |
| [M1-03](M1-03-benchmark-provenance-and-acceptance.md) | 基准出处台账更新与全量质量门禁验收 |  | M1-02 | 否 |

## Sprint 完成判定

| # | 判定条目 | 证据形式 |
|---|---|---|
| 1 | 10 道题目经 `pnpm validate:prompts` 校验 100% 通过无格式与校验契约错误 | 终端运行 `pnpm validate:prompts` 输出 0 错误 |
| 2 | TypeScript 类型检查通过，无类型定义缺失或接口不匹配 | 终端运行 `pnpm lint` 退出码 0 |
| 3 | 看板分组与分类器单元测试全部通过，覆盖 2026-09 分组及排序验证 | 终端运行 `pnpm test` 全部通过 |
| 4 | 代码与文件长度策略符合规范，无文件或函数超标 | 终端运行 `pnpm check:length` 退出码 0 |
| 5 | 无任何敏感凭据或私钥泄漏 | 终端运行 `pnpm check:secrets` 退出码 0 |
| 6 | 基准出处文档与台账记录齐备，真实反映题目背景与许可状态 | `docs/benchmark-provenance.md` 包含 10 道题目的详细条目 |

## 边界

- **不做**：
  - 本 Sprint 不改动既有 36 道题目的提示词模板与评分标准；
  - 不修改任何 CLI 适配器（`src/adapters/`）；
  - 不修改执行器逻辑（`src/core/runner.ts`、`src/core/scheduler.ts`）；
  - 不修改数据仓同步契约（`src/core/data-repo/contract.ts`）。
- **允许修改**：
  - `src/core/prompt/data-classic.ts`
  - `src/core/prompt/data-2026-09.ts`（新建）
  - `src/core/prompt/builtin.ts`
  - `src/core/prompt.ts`
  - `src/app/components/run-control/run-once-grouping.ts`
  - `test/app/components/run-control/run-once-grouping.test.ts`
  - `docs/benchmark-provenance.md`
  - `docs/workorders/` 与 `docs/acceptance/` 下的相关施工与验收文件。

## 依赖

- 前置：`docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/` 目录下定稿的 10 份题目文档与 PromptSpec 契约定义；
- 环境：Node 22+ 与 pnpm 10+ 环境。
