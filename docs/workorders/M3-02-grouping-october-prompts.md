# 施工单 M3-02：看板运行控制分类与 2026-10 分组呈现

> 在看板运行控制分类逻辑中建立独立的 `'2026-10'` 题目分组，将 8 道新题正确归类并排在 `'2026-09'` 之后展示，同步添加中英双语国际化标签并编写完整的排序与分类单元测试。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M3-00](M3-00-viral-prompts-2026-10.md) |
| 覆盖功能点 | （本单不挂功能点：看板分类扩展，独立自闭环） |
| 依赖工单 | M3-01 |
| 验收文件 | [M3-02](../acceptance/M3-02-grouping-october-prompts.md) |

## 现状（已定位）

实测日期：2026-11-12

- **已有且够用**：
  - 看板运行控制分组逻辑 `src/app/components/run-control/run-once-grouping.ts`（132 行），定义了 `GroupKey` 联合类型、`classifyPrompt` 与 `groupPrompts` 分组迭代逻辑；
  - 国际化题库字典 `src/core/prompt/i18n/index.ts`，集中维护了所有 `GroupKey` 的中英双语名称映射；
  - 单元测试文件 `test/app/components/run-control/run-once-grouping.test.ts`（114 行），包含 11 个测试用例，覆盖经典、前沿、微观物理、2026-09 与自定义提示词的分类与拓扑排序。
- **已有但未包含新分组**：
  - `GroupKey` 联合类型尚未包含 `'2026-10'`；
  - 缺少 `OCTOBER_2026_PROMPT_IDS` 集合；
  - `classifyPrompt` 尚未映射 8 道新题；
  - `groupPrompts` 初始化字典中尚未挂载 `'2026-10'` 键。

## ⚠️ 关键落地约束（必须先验证）

1. **类型安全性与代码长度**：
   - `run-once-grouping.ts` 保持纯函数设计，修改后代码控制在 160 行以内（远低于 300 行上限）；
   - `GroupKey` 必须与 `groupPrompts` 的初始化顺序和 `i18n` 映射保持 100% 同构，杜绝运行时未定义行为。
2. **严格的拓扑顺序**：
   - 字典初始化顺序必须严格为：`"经典基准"` -> `"四大名著（文学与叙事构图）"` -> `"世界地标（微缩景观）"` -> `"2026 前沿工程评测 (FE-1 ~ FE-8)"` -> `"2026 前沿视觉特效 (VFX)"` -> `"微观物理与前沿探索"` -> `"2026-09"` -> `"2026-10"` -> `"自定义提示词"`；
   - 必须通过单元测试对 `'2026-10'` 在 `'2026-09'` 之后、`'自定义提示词'` 之前的顺序进行硬断言。

## 任务

### 1. 看板运行控制分组与分类器扩展

- 在 `src/app/components/run-control/run-once-grouping.ts` 中：
  - 扩展 `GroupKey`：加入联合分支 `'2026-10'`；
  - 定义常量 `OCTOBER_2026_PROMPT_IDS = new Set<string>([...8题ID...])`；
  - 在 `classifyPrompt` 中加入对 `OCTOBER_2026_PROMPT_IDS` 的判定，返回 `'2026-10'`；
  - 在 `groupPrompts` 初始化字典中，将 `'2026-10'` 精确插入在 `'2026-09'` 之后、`'自定义提示词'` 之前。

### 2. 展示层双语国际化名称登记

- 在 `src/core/prompt/i18n/index.ts` 中：
  - 为 `'2026-10'` 分组配置统一标签：`"2026-10"`（中英文保持一致）。

### 3. 分组与排序单元测试扩充

- 在 `test/app/components/run-control/run-once-grouping.test.ts` 中：
  - 新增测试用例：验证 8 道新题目均被 `classifyPrompt` 正确归类到 `'2026-10'`；
  - 新增测试用例：验证 `groupPrompts` 返回的分组键列表中，`'2026-10'` 紧随 `'2026-09'` 之后，并排在 `'自定义提示词'` 之前。

### 不改的地方（红线）

- 不改动既有 8 个分组的分类判定逻辑与相对排位；
- 不破坏客户端无题目时的空数组过滤；
- 保持 `pnpm test` 全绿与 `pnpm lint` 零错误。

### 测试

- 执行 `pnpm test`，断言包括 `run-once-grouping.test.ts` 在内的全量测试 100% 通过；
- 执行 `pnpm lint`，断言 TypeScript 静态检查零错误。

## 验收

```bash
pnpm exec tsx --test test/app/components/run-control/run-once-grouping.test.ts
pnpm test
pnpm lint
```

## 回报格式

1. `test/app/components/run-control/run-once-grouping.test.ts` 单元测试通过结果；
2. 看板分组键顺序与分类逻辑 diff；
3. `pnpm lint` 零错误报告。

## 边界

- 允许修改：`src/app/components/run-control/run-once-grouping.ts`、`src/core/prompt/i18n/index.ts`、`test/app/components/run-control/run-once-grouping.test.ts`；
- 禁止修改：既有分组判定逻辑与无关页面代码。

## 依赖

- 前置依赖：[M3-01](M3-01-register-october-viral-prompts.md)；
- 依赖 8 道新题 ID 集合。
