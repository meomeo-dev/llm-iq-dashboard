# 验收 M1-02：看板运行控制分类与2026-09分组

> 完成看板运行控制面板的题目分组与分类逻辑：Q05/Q06 加入经典基准，其余 8 题归属 2026-09 分组并排在微观物理之后，单元测试全绿。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M1-02](../workorders/M1-02-grouping-classic-and-september.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-10 |
| 验收结论 | 通过 |
| commit | `5c5cec4` |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | CLASSIC_PROMPT_IDS 扩展 Q05/Q06 | Set 包含 animated-armadillo-fishnet-mars-v1 与 animated-lemur-scooter-front-v1 | 已扩展并完成单测验证 | `src/app/components/run-control/run-once-grouping.ts` | ✅ |
| 2 | 新增 2026-09 分组及 SEPTEMBER_2026_PROMPT_IDS 集合 | 8 题 ID 精确映射到 '2026-09' | 已定义集合并在 classifyPrompt 精准分类 | `test/app/components/run-control/run-once-grouping.test.ts` | ✅ |
| 3 | groupPrompts 分组展示顺序 | '2026-09' 紧随 '微观物理与前沿探索' 之后展示 | 初始化字典中精确位于微观物理之后、自定义提示词之前 | `test/app/components/run-control/run-once-grouping.test.ts` | ✅ |
| 4 | 单元测试覆盖分组与排序 | pnpm test 全绿且覆盖 2026-09 单测 | 11/11 单元测试通过，拓扑排位硬断言通过 | `pnpm exec tsx --test test/app/components/run-control/run-once-grouping.test.ts` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm test
pnpm lint
pnpm check:length
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm test` | 通过 (911/911 passed) | 无 |
| `pnpm lint` | 通过 (0 errors) | 无 |
| `pnpm check:length` | 通过 (0 violations) | 无 |

## 4. 交付物

修改 `src/app/components/run-control/run-once-grouping.ts` 与 `test/app/components/run-control/run-once-grouping.test.ts`。

## 5. 与计划的偏差

无。

## 6. 技术决策

采用精确 `ReadonlySet<string>` 集合查找判定，彻底避免前缀匹配歧义；按固定字典初始化顺序保证展示拓扑序。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

## 8. 风险与下一步

无阻断风险，完成本单后推进 M1-03（基准出处台账更新与全量质量门禁验收）。
