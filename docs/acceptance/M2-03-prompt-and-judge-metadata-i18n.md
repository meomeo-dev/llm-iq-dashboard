# 验收 M2-03：题库展示元数据与评审标准双语映射

> 为 54 道内置题目、300 条候选、题龄计算（`promptLifecycle`）、题库分组标题及作品评审标准（`G1`–`G5`、`C1`–`C9` 与联系图部位名）建立纯展示层的 `en` / `zh-CN` 双语映射函数，保持题面原文与落盘 JSON 契约零改动，全部门禁通过。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-03](../workorders/M2-03-prompt-and-judge-metadata-i18n.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-13 |
| 验收结论 | 通过 |
| commit | `94c0d8a` |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 54 道题目与 300 条候选双语标题定位 | `en` 与 `zh-CN` 下均返回非空字符串，且 `en` 下无中文残留，不改 `template` 与 `text` | 54 道题目与 300 条候选在 `en` 与 `zh-CN` 下全部通过非空与零中文残留断言，`template` 与 `text` 零变动 | `pnpm exec tsx --test test/i18n/prompt-judge-i18n.test.ts`（4 tests pass） | ✅ |
| 2 | 黄金参考标准（`PromptStandard`）与题龄双语化 | `localizePromptStandard` 与 `promptLifecycle` 支持 `en` / `zh-CN` | 274 条 `PromptStandard` 在双语下均返回非空 `coreKey`/`groundTruth`/`evaluationCriteria`；`promptLifecycle` 在 `en` 下输出 `ago` / `Added today` | `src/core/prompts/i18n/standards-en.ts`、`src/core/prompt/lifecycle.ts` | ✅ |
| 3 | 评审标准（`G1`–`G5`、`C1`–`C9`、部位名、结论）双语化 | 按 ID/kind 动态返回英文标题与标准 | `G1`–`G5`、`C1`–`C9`、7 类 `DetailKind` 及 `online`/`degraded`/`pending` 均支持双语转换 | `src/i18n/judge-rubric.ts` | ✅ |
| 4 | 题库完整性校验与代码长度门禁 | `pnpm validate:prompts`、`pnpm lint`、`pnpm check:length` 0 错误 | 194 项提示词与候选 0 属性缺失，`tsc --noEmit` 0 error，433 个文件 0 超标 | `pnpm validate:prompts && pnpm lint && pnpm check:length` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm validate:prompts` | ✅ 通过（54 道内置题目 + 140 道前沿单题 + 220 个候选条目 0 缺失） | 无 |
| `pnpm lint` | ✅ 通过（`tsc --noEmit` 0 error） | 无 |
| `pnpm test` | ✅ 通过（`test/i18n/prompt-judge-i18n.test.ts` 4/4 pass） | 无 |
| `pnpm check:length` | ✅ 通过（扫描 433 个文件，超标 0 项） | 无 |

## 4. 交付物

- 新增 `src/core/prompts/i18n/labels-en.ts`、`src/core/prompts/i18n/standards-en.ts`、`src/core/prompts/i18n/index.ts`；
- 更新 `src/core/prompt/lifecycle.ts` 支持 `locale: Locale = "zh-CN"`；
- 新增 `src/i18n/judge-rubric.ts` 并在 `src/i18n/index.ts` 统一导出；
- 新增 `test/i18n/prompt-judge-i18n.test.ts`。

## 5. 与计划的偏差

无。

## 6. 技术决策

- 保持 `PromptSpec.template` 与 `PromptCandidate.text` 100% 原始不可变，仅在展示层通过 `localizePromptLabel`、`localizeCandidateLabel`、`localizePromptStandard`、`localizePromptSpec` 生成当前语言视图。
- 评审标准按 `gate.id`（`G1`–`G5`）、`criterion.id`（`C1`–`C9`）与 `detail.kind` 动态回表，历史已落盘的中文 `.judge.json` 无需迁移即可在英文界面完整展示英文标题与标准。

## 7. 已知限制与技术债

无。

## 8. 风险与下一步

- 下一步进入 [M2-04](../workorders/M2-04-dashboard-viewer-and-export-i18n.md)，将主看板、作品详情页、评审抽屉与社交分享导出图接入双语字典与元数据映射函数。
