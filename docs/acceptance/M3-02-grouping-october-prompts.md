# 验收 M3-02：看板运行控制分类与 2026-10 分组呈现

> 在看板运行控制分类逻辑中建立独立的 `'2026-10'` 题目分组，将 8 道新题正确归类并排在 `'2026-09'` 之后展示，同步添加中英双语国际化标签并编写完整的排序与分类单元测试。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M3-02](../workorders/M3-02-grouping-october-prompts.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-11-12 |
| 验收结论 | 通过 |
| commit | 79e8799 |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 看板分组联合类型与分类器扩展 | `GroupKey` 包含 `'2026-10'`，`classifyPrompt` 正确识别 8 道新题 ID | `OCTOBER_2026_PROMPT_IDS` 覆盖 8 题，`classifyPrompt` 映射为 `'2026-10'` | `test/app/components/run-control/run-once-grouping.test.ts` 8 题分类测试通过 | ✅ |
| 2 | 分组拓扑排序与空分组过滤 | `groupPrompts` 将 `'2026-10'` 排在 `'2026-09'` 之后、`'自定义提示词'` 之前 | 字典初始化键严格排位，空分组自动过滤 | 单元测试对 groupPrompts 顺序深比较断言通过 | ✅ |
| 3 | 展示层双语国际化标签注册 | `'2026-10'` 配置中英文组名，en 与 zh-CN 均正确本地化 | `GROUP_LABELS_EN` 与 `GROUP_LABELS_ZH` 登记完毕 | `test/i18n/prompt-judge-i18n.test.ts` 双语断言通过 | ✅ |
| 4 | 代码行数与类型门禁 | 单文件行数低于上限，`pnpm lint` 零错误 | `run-once-grouping.ts` 为 135 行（< 300 行），tsc 0 error | `pnpm check:length` 与 `pnpm lint` 100% 绿灯 | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | 看板分类扩展 | 8 道新题目正确归入 2026-10 分组并在运行面板中排序有序 | ✅ | `run-once-grouping.test.ts` 13/13 测试通过 |

## 3. 自动化验证汇总（可复跑）

```bash
pnpm exec tsx --test test/app/components/run-control/run-once-grouping.test.ts test/i18n/prompt-judge-i18n.test.ts
pnpm lint
pnpm check:length
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm exec tsx --test test/app/components/run-control/run-once-grouping.test.ts` | 通过（13/13 测试全绿） | 无 |
| `pnpm exec tsx --test test/i18n/prompt-judge-i18n.test.ts` | 通过（4/4 测试全绿） | 无 |
| `pnpm lint` | 通过（tsc 0 错误） | 无 |
| `pnpm check:length` | 通过（708 文件 0 超标） | 无 |

## 4. 交付物

- `src/app/components/run-control/run-once-grouping.ts`：增加 `'2026-10'` 分组键与 `OCTOBER_2026_PROMPT_IDS` 集合判定；
- `src/core/prompt/i18n/index.ts`：注册 `'2026-10'` 双语展示字典；
- `test/app/components/run-control/run-once-grouping.test.ts`：新增 2026-10 分类与排序硬断言；
- `test/i18n/prompt-judge-i18n.test.ts`：新增 2026-10 双语标签断言。

## 5. 与计划的偏差

无。严格遵循拓扑顺序与纯函数设计。

## 6. 技术决策

- `GroupKey` 保持原内部键名，国际化由 `localizePromptGroupLabel` 负责，避免影响下游序列化；
- 在 `i18n/index.ts` 中通过 `GROUP_LABELS_ZH` 映射中文全名（`2026-10 流行力学与拓扑`），英文为 `2026-10 Viral Kinematics & Topology`。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|
| 1 | 出处文档 `docs/benchmark-provenance.md` 尚未登记 8 道新题 | 用户或外部读者无法从出处文档追溯题目雪花 ID 与来源 | 由 [M3-03](../workorders/M3-03-benchmark-provenance-and-acceptance.md) 施工接手 |

## 8. 风险与下一步

- 风险：无；
- 下一步：开展 M3-03 施工，更新出处台账并完成 Sprint M3 全量收口。
