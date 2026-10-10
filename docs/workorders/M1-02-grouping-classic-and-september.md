# 施工单 M1-02：看板运行控制分类与2026-09分组

> 调整看板单轮运行控制（Run Control）中的题目分组与分类逻辑：将犰狳与狐猴并入经典基准，其余 8 题建立独立 "2026-09" 分组并在看板中紧随微观物理之后展示，并配套完善单元测试。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M1-00](M1-00-viral-eval-prompts-grouping.md) |
| 覆盖功能点 | （本单不挂功能点：看板运行控制面板的分组分类逻辑与测试扩展） |
| 依赖工单 | [M1-01](M1-01-register-viral-prompts.md) |
| 验收文件 | [M1-02](../acceptance/M1-02-grouping-classic-and-september.md) |

## 现状（已定位）

实测日期：2026-10-10

- **已有且够用**：
  - `src/app/components/run-control/run-once-grouping.ts`（109 行）：实现了 `classifyPrompt`、`groupPrompts` 以及 `GroupKey` 类型；
  - `test/app/components/run-control/run-once-grouping.test.ts`（81 行）：已有 node:test 单测，覆盖了各现有分组分类。
- **已有但需扩展**：
  - `GroupKey` 联合类型目前有 7 个成员，缺少 `'2026-09'`；
  - `CLASSIC_PROMPT_IDS` 目前为包含 3 个经典题目 ID（`classic-v1`, `upgraded-v2`, `animated-pelican-v1`）的 `ReadonlySet<string>`，缺少 `animated-armadillo-fishnet-mars-v1` 和 `animated-lemur-scooter-front-v1`；
  - 尚无针对 8 道新题（Q01–Q04、Q07–Q10）的 ID 识别集合，导致这些题目若传入会被误判为 `'自定义提示词'`；
  - `groupPrompts` 初始化字典中缺少 `'2026-09'` 分组及精确排位。

## ⚠️ 关键落地约束（必须先验证）

1. **精准分组归属**：
   - Q05（`animated-armadillo-fishnet-mars-v1`）与 Q06（`animated-lemur-scooter-front-v1`）必须 100% 归入 `'经典基准'`；
   - 其余 8 道（Q01–Q04、Q07–Q10）必须 100% 归入 `'2026-09'`；
2. **精确展示顺序**：
   - `groupPrompts` 返回的 `Record<GroupKey, ...>` 键枚举顺序必须满足：`"经典基准"` -> `"四大名著（文学与叙事构图）"` -> `"世界地标（微缩景观）"` -> `"2026 前沿工程评测 (FE-1 ~ FE-8)"` -> `"2026 前沿视觉特效 (VFX)"` -> `"微观物理与前沿探索"` -> `"2026-09"` -> `"自定义提示词"`；
   - `"2026-09"` 必须严格放置在 `"微观物理与前沿探索"` 的下一位。
3. **行数与质量门禁**：
   - `run-once-grouping.ts` 修改后须保持在 150 行以内（规范上限 300 行）；
   - 函数保持在 30 行以内；
   - `pnpm test` 与 `pnpm lint` 必须完全通过。

## 任务

### 1. 看板运行控制分组逻辑扩展

- 在 `src/app/components/run-control/run-once-grouping.ts` 中：
  - 扩展 `GroupKey` 联合类型增加 `'2026-09'`；
  - 在 `CLASSIC_PROMPT_IDS: ReadonlySet<string>` 集合中追加 `'animated-armadillo-fishnet-mars-v1'` 与 `'animated-lemur-scooter-front-v1'`；
  - 新增 `SEPTEMBER_2026_PROMPT_IDS: ReadonlySet<string>` 集合，包含 Q01–Q04 与 Q07–Q10 的 8 个 ID；
  - 更新 `classifyPrompt` 函数，对 `SEPTEMBER_2026_PROMPT_IDS.has(p.id)` 匹配返回 `'2026-09'`；
  - 更新 `groupPrompts` 函数，在 `groups` 初始字典中将 `'2026-09': []` 置于 `'微观物理与前沿探索'` 之后、`'自定义提示词'` 之前。

### 2. 单元测试用例完善

- 在 `test/app/components/run-control/run-once-grouping.test.ts` 中：
  - 增加用例：断言犰狳与狐猴被 `classifyPrompt` 正确分类为 `'经典基准'`；
  - 增加用例：断言 8 道新题均被正确分类为 `'2026-09'`；
  - 增加用例：断言 `groupPrompts` 产出的分组键名顺序中，`'2026-09'` 恰好紧邻 `'微观物理与前沿探索'` 之后。

### 不改的地方（红线）

- 不改动现有 7 个分组的既有映射与分类规则；
- 不修改看板组件的 CSS 样式或 DOM 渲染层；
- 不修改执行器与 API 数据契约。

### 测试

- 执行 `pnpm test`，所有单测绿灯且包含本次新增用例；
- 覆盖率验证：8 道新题分类全部断言通过，Q05/Q06 经典分类断言通过，字典键序列绝对位置断言通过。

## 验收

```bash
pnpm test
pnpm lint
pnpm check:length
```

## 回报格式

1. `pnpm test` 单元测试运行通过证明；
2. `src/app/components/run-control/run-once-grouping.ts` 改动内容与行数变化；
3. `test/app/components/run-control/run-once-grouping.test.ts` 新增用例列表。

## 边界

- 允许修改：`src/app/components/run-control/run-once-grouping.ts`、`test/app/components/run-control/run-once-grouping.test.ts`；
- 禁止修改：执行引擎、配置系统、CLI 适配器。

## 依赖

- 依赖 [M1-01](M1-01-register-viral-prompts.md) 注册的题目 ID 契约。
