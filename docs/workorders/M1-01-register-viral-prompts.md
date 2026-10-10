# 施工单 M1-01：核心题库注册：经典与2026-09题目录入

> 将 2026 年秋季社区流行的 10 道评测题目正式录入核心题库代码：Q05（犰狳）与 Q06（狐猴）并入经典基准模块，其余 8 题建立独立 2026-09 数据模块，并全量集成到内置题库与导出入口。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M1-00](M1-00-viral-eval-prompts-grouping.md) |
| 覆盖功能点 | （本单不挂功能点：核心题库扩展与数据定义，独立自闭环） |
| 依赖工单 | 无 |
| 验收文件 | [M1-01](../acceptance/M1-01-register-viral-prompts.md) |

## 现状（已定位）

实测日期：2026-10-10

- **已有且够用**：
  - 经典基准题库模块 `src/core/prompt/data-classic.ts`（176 行），包含 6 个独立 export 的 `PromptSpec` 常量（CLASSIC_PROMPT, UPGRADED_PROMPT, CLOCK_PROMPT, ANIMATED_PELICAN_PROMPT, PENROSE_PROMPT, ICE_WATER_PROMPT）。追加 2 题常量 export 后预计约为 250 行，完全符合单文件 < 500 行的规范；
  - 题库验证脚本 `scripts/validate-prompts.ts`，内置对 prompt 结构的强契约检验。
- **已有但未包含新题**：
  - `src/core/prompt/builtin.ts`（76 行）：逐个导入经典题目并在 `BUILTIN_PROMPTS` 数组中聚合，当前包含 36 题，尚未包含本次 10 题；
  - `src/core/prompt.ts`（62 行）：集中向外 export 各题库常量，尚未包含本次 10 题。
- **完全没有**：
  - `src/core/prompt/data-2026-09.ts`：尚无此模块，需新建以承载 Q01–Q04 及 Q07–Q10 共 8 道题目常量及 `PROMPTS_2026_09` 数组。

## ⚠️ 关键落地约束（必须先验证）

1. **类型契约严密性**：每道题目的 `PromptSpec` 必须具备严格合法的 `PromptStandard`，含 `coreKey`、`groundTruth`（必须具备首尾闭合与动量下界门禁）、`evaluationCriteria`（Pass/Partial/Fail 三态），必须能通过 `pnpm validate:prompts`。
2. **代码行数约束**：
   - `data-classic.ts` 追加后控制在 260 行以内；
   - 新建的 `data-2026-09.ts` 承载 8 道题目，控制在 350 行以内，远低于 500 行限制；
   - 避免冗余辅助函数，仅作常量规格声明。
3. **零脚本与安全约束**：
   - 模板内一律禁止 `<script>`；
   - 样式一律以 CDATA 包裹，不包含任何外部网络资源依赖。

## 任务

### 1. 经典基准题库录入 Q05 与 Q06

- 在 `src/core/prompt/data-classic.ts` 中新增 export 常量：
  - `ANIMATED_ARMADILLO_FISHNET_MARS_PROMPT`（Q05，`animated-armadillo-fishnet-mars-v1`）；
  - `ANIMATED_LEMUR_SCOOTER_FRONT_PROMPT`（Q06，`animated-lemur-scooter-front-v1`）；
- 在 `src/core/prompt/builtin.ts` 中从 `./data-classic` 导入这两个常量并加入 `BUILTIN_PROMPTS` 数组。

### 2. 新建 2026-09 专属题库数据模块

- 新建 `src/core/prompt/data-2026-09.ts`，严格遵循单文件行数限制（< 500 行）；
- 录入其余 8 道题目的 `PromptSpec` 常量：
  - `ANIMATED_ISO_VINTAGE_PC_PROMPT`（Q01，`animated-iso-vintage-pc-v1`）；
  - `ANIMATED_ISO_AMBER_CRT_PROMPT`（Q02，`animated-iso-amber-crt-v1`）；
  - `ANIMATED_ISO_SERVER_RACK_PROMPT`（Q03，`animated-iso-server-rack-v1`）；
  - `ANIMATED_ISO_CAMERA_EXPLODED_PROMPT`（Q04，`animated-iso-camera-exploded-v1`）；
  - `ANIMATED_HUMAN_HAND_KINETIC_PROMPT`（Q07，`animated-human-hand-kinetic-v1`）；
  - `ANIMATED_FISH_CLOUD_AMODAL_PROMPT`（Q08，`animated-fish-cloud-amodal-v1`）；
  - `ANIMATED_ISLAND_CHEST_CONTAINMENT_PROMPT`（Q09，`animated-island-chest-containment-v1`）；
  - `ANIMATED_TREE_READER_OCCLUSION_PROMPT`（Q10，`animated-tree-reader-occlusion-v1`）；
- 导出 `PROMPTS_2026_09` 数组。

### 3. 题库内置登记与集中导出集成

- 修改 `src/core/prompt/builtin.ts`：导入 `PROMPTS_2026_09`，并在 `BUILTIN_PROMPTS` 数组中展开；
- 修改 `src/core/prompt.ts`：集中导出新增的 10 个 `PromptSpec` 常量及 `PROMPTS_2026_09` 数组。

### 不改的地方（红线）

- 既有 36 道题目的 ID、标题、模板和打分标准逐字不动；
- 不修改执行器逻辑 `src/core/runner.ts` 与调度器 `src/core/scheduler.ts`；
- 不触动适配器 `src/adapters/`；
- 保持 `pnpm lint` 零错误、`pnpm validate:prompts` 零警告。

### 测试

- 执行 `pnpm validate:prompts`，断言 46 道题目（36 既有 + 10 新增）全部通过校验且 0 失败；
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

- 允许修改：`src/core/prompt/data-classic.ts`、`src/core/prompt/builtin.ts`、`src/core/prompt.ts`；
- 允许新建：`src/core/prompt/data-2026-09.ts`；
- 禁止修改：既有题目定义、适配器模块、执行引擎。

## 依赖

- 无前置工单依赖；
- 依赖 `docs/research/x-viral-ai-evals-2026-sep-oct/final_10_outcome/` 目录下已定稿的 TypeScript PromptSpec 规范。
