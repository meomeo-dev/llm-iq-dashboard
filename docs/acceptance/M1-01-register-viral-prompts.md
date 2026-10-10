# 验收 M1-01：核心题库注册：经典与2026-09题目录入

> 完成 10 道秋季流行题目的核心题库注册：Q05/Q06 并入经典题库，其余 8 题录入 2026-09 专属题库，并通过格式与类型门禁。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M1-01](../workorders/M1-01-register-viral-prompts.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-10 |
| 验收结论 | 通过 |
| commit | bc9dcdf |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | Q05 与 Q06 录入 data-classic.ts 并导出 | 成功导出 ANIMATED_ARMADILLO_FISHNET_MARS_PROMPT 与 ANIMATED_LEMUR_SCOOTER_FRONT_PROMPT | 成功在 data-classic.ts (241 行) 导出两道题目常量 | `src/core/prompt/data-classic.ts L181-L241` | ✅ |
| 2 | 新建 data-2026-09.ts 录入 8 题并导出 PROMPTS_2026_09 | 包含 Q01-Q04 及 Q07-Q10 共 8 题规范定义 | 新建 data-2026-09.ts (283 行) 导出全部 8 题常量及 PROMPTS_2026_09 数组 | `src/core/prompt/data-2026-09.ts` | ✅ |
| 3 | builtin.ts 与 prompt.ts 集中注册与导出 | BUILTIN_PROMPTS 包含 54 题，prompt.ts 集中导出新增常量 | BUILTIN_PROMPTS 扩充至 54 题，prompt.ts 集中导出 10 个新增常量及数组 | `src/core/prompt/builtin.ts` 与 `src/core/prompt.ts` | ✅ |
| 4 | 题库规范性校验与类型检查通过 | pnpm validate:prompts 0 错误，pnpm lint 0 错误 | 题库全量体检通过 0 项属性缺失，类型检查 0 错误 | `pnpm validate:prompts && pnpm lint 退出码 0` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm validate:prompts
pnpm lint
pnpm check:length
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm validate:prompts` | 通过（54 道内置题目通过校验，0 属性缺失） | 题库数据录入就绪 |
| `pnpm lint` | 通过（tsc --noEmit 退出码 0） | 无 |
| `pnpm check:length` | 通过（扫描 422 文件，0 超标） | 无 |

## 4. 交付物

核心题库数据文件（`src/core/prompt/data-classic.ts`, `src/core/prompt/data-2026-09.ts`, `src/core/prompt/builtin.ts`, `src/core/prompt.ts`）。

## 5. 与计划的偏差

无。

## 6. 技术决策

题库模块拆分遵循单文件行数限制（< 500 行），Q05/Q06 并入经典，其余 8 题独立建 2026-09 模块。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

## 8. 风险与下一步

无阻断风险，完成本单后推进 M1-02（看板运行控制分类与 2026-09 分组）。
