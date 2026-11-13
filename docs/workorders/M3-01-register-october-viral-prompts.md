# 施工单 M3-01：核心题库注册：2026-10 题目录入与 TypeScript 模块实现

> 将 2026 年 10 月社区流行的 8 道高难度评测题目（简森步行机构、跳蛛起跳、蜈蚣行波、开放差速器、摩天轮自水平、章鱼管风琴、孔雀骑车、鹦鹉螺螺线）正式录入核心题库代码：新建 `src/core/prompt/bank/benchmarks/2026-10/` 模块，录入完整 PromptSpec 与 PromptStandard，并在题库总入口注册与集中暴露。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M3-00](M3-00-viral-prompts-2026-10.md) |
| 覆盖功能点 | （本单不挂功能点：核心题库扩展与数据定义，独立自闭环） |
| 依赖工单 | 无 |
| 验收文件 | [M3-01](../acceptance/M3-01-register-october-viral-prompts.md) |

## 现状（已定位）

实测日期：2026-11-12

- **已有且够用**：
  - 2026-09 批次题库模块 `src/core/prompt/bank/benchmarks/2026-09/index.ts` 与 `display-en.ts`，为独立月度题库提供了清晰的标准代码骨架；
  - 题库验证脚本 `scripts/validate-prompts.ts`（经 `pnpm validate:prompts` 触发），内置对 prompt 结构、生命周期日期与 PromptStandard 的严格校验。
- **已有但未包含新题**：
  - `src/core/prompt/bank/index.ts`：汇集导出所有内置题目与归档题目，当前尚未导入 2026-10 题库；
  - `src/core/prompt.ts`：集中向外 export 核心常量，尚未包含 2026-10 题库。
- **完全没有**：
  - `src/core/prompt/bank/benchmarks/2026-10/` 目录尚未创建，需新建 `index.ts`（录入 8 题常量并导出 `PROMPTS_2026_10` 数组）及 `display-en.ts`（导出英文展示标准字典）。

## ⚠️ 关键落地约束（必须先验证）

1. **类型契约严密性**：每道题目的 `PromptSpec` 必须具备严格合法的 `PromptStandard`，含 `coreKey`、`groundTruth`（必须具备首尾闭合与动量下界门禁）、`evaluationCriteria`（Pass/Partial/Fail 三态），必须能通过 `pnpm validate:prompts`。
2. **代码行数约束**：
   - `src/core/prompt/bank/benchmarks/2026-10/index.ts` 控制在 350 行以内，远低于 500 行限制；
   - `display-en.ts` 控制在 100 行以内；
   - 避免冗余辅助函数，仅作常量规格声明。
3. **零脚本与安全约束**：
   - 模板内一律禁止 `<script>`；
   - 样式一律以 CDATA 包裹，不包含任何外部网络资源依赖。

## 任务

### 1. 新建 2026-10 专属题库数据模块

- 新建 `src/core/prompt/bank/benchmarks/2026-10/index.ts`，严格遵循单文件行数限制（< 500 行）；
- 录入 8 道题目的 `PromptSpec` 常量：
  - `ANIMATED_JANSEN_WALKER_PROMPT`（`animated-jansen-walker-v1`）；
  - `ANIMATED_JUMPING_SPIDER_LEAP_PROMPT`（`animated-jumping-spider-leap-v1`）；
  - `ANIMATED_CENTIPEDE_WAVE_GAIT_PROMPT`（`animated-centipede-wave-gait-v1`）；
  - `ANIMATED_OPEN_DIFFERENTIAL_PROMPT`（`animated-open-differential-v1`）；
  - `ANIMATED_FERRIS_LEVELING_PROMPT`（`animated-ferris-leveling-v1`）；
  - `ANIMATED_OCTOPUS_ORGAN_PROMPT`（`animated-octopus-organ-v1`）；
  - `ANIMATED_PEACOCK_BICYCLE_PROMPT`（`animated-peacock-bicycle-v1`）；
  - `ANIMATED_NAUTILUS_SPIRAL_PROMPT`（`animated-nautilus-spiral-v1`）；
- 导出 `PROMPTS_2026_10` 数组。

### 2. 建立英文标准展示字典

- 新建 `src/core/prompt/bank/benchmarks/2026-10/display-en.ts`；
- 导出 `OCTOBER_2026_STANDARDS_EN: Record<string, PromptStandard>`；
- 在 `src/core/prompt/i18n/standards-en.ts` 中引入并合并。

### 3. 题库总入口注册与集中导出

- 修改 `src/core/prompt/bank/index.ts`：导入 `PROMPTS_2026_10` 并在 `BUILTIN_PROMPTS` 数组中展开；
- 修改 `src/core/prompt.ts`：集中导出新增的 8 个 `PromptSpec` 常量及 `PROMPTS_2026_10` 数组。

### 不改的地方（红线）

- 既有题目的 ID、标题、模板和打分标准逐字不动；
- 不修改执行器逻辑 `src/core/runner.ts` 与调度器 `src/core/scheduler.ts`；
- 不触动适配器 `src/adapters/`；
- 保持 `pnpm lint` 零错误、`pnpm validate:prompts` 零警告。

### 测试

- 执行 `pnpm validate:prompts`，断言新题及全库题目全部通过校验且 0 失败；
- 执行 `pnpm lint`，断言 TypeScript 类型检查 100% 绿灯；
- 执行 `pnpm check:length`，断言所有文件与函数长度未超标。

## 验收

```bash
pnpm validate:prompts
pnpm lint
pnpm check:length
```

## 回报格式

1. `pnpm validate:prompts`、`pnpm lint` 与 `pnpm check:length` 的执行结果；
2. 题目常量与数据数组导出清单；
3. 行数与安全性自检报告。

## 边界

- 允许新建：`src/core/prompt/bank/benchmarks/2026-10/index.ts`、`src/core/prompt/bank/benchmarks/2026-10/display-en.ts`；
- 允许修改：`src/core/prompt/bank/index.ts`、`src/core/prompt.ts`、`src/core/prompt/i18n/standards-en.ts`；
- 禁止修改：既有题目定义、适配器模块、执行引擎。

## 依赖

- 无前置工单依赖；
- 依赖 `docs/research/x-viral-ai-evals-2026-10/final_8_outcome/` 目录下已定稿的题目规范。
