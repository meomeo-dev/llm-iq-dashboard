# 验收 M3-01：核心题库注册：2026-10 题目录入与 TypeScript 模块实现

> 将 2026 年 10 月社区流行的 8 道高难度评测题目（简森步行机构、跳蛛起跳、蜈蚣行波、开放差速器、摩天轮自水平、章鱼管风琴、孔雀骑车、鹦鹉螺螺线）正式录入核心题库代码：新建 `src/core/prompt/bank/benchmarks/2026-10/` 模块，录入完整 PromptSpec 与 PromptStandard，并在题库总入口注册与集中暴露。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M3-01](../workorders/M3-01-register-october-viral-prompts.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-11-12 |
| 验收结论 | 通过 |
| commit | 2a29880 |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 2026-10 专属题库数据模块创建 | 新建 `src/core/prompt/bank/benchmarks/2026-10/index.ts`，导出 8 道题目常量与 `PROMPTS_2026_10` | 文件创建，包含 8 道 PromptSpec 常量与 PROMPTS_2026_10 数组导出 | `pnpm exec tsx -e 'import { PROMPTS_2026_10 } from "./src/core/prompt"; console.log(PROMPTS_2026_10.length)'` 输出 8 | ✅ |
| 2 | 英文展示标准建立与合并 | 新建 `display-en.ts`，在 `standards-en.ts` 中合并 `OCTOBER_2026_STANDARDS_EN`，0 CJK | 英文标准导出完成，英文字典 100% 纯英文无 CJK 字符 | `test/i18n/i18n-integrity.test.ts` 与 `test/i18n/prompt-judge-i18n.test.ts` 通过 | ✅ |
| 3 | 题库总入口集中注册 | `src/core/prompt/bank/index.ts` 集中注册并展开至 `BUILTIN_PROMPTS` | `BUILTIN_PROMPTS` 扩充至 31 道题，可通过 `src/core/prompt` 直接解构引用 | `pnpm validate:prompts` 报告 31 道内置题目通过严格校验 | ✅ |
| 4 | 全量规范与门禁校验 | `pnpm validate:prompts`、`pnpm lint`、`pnpm check:length` 100% 通过 | 全部门禁 0 错误、0 警告、0 超标项 | 控制台输出：31 道内置题目通过、tsc 0 error、708 文件 0 超标 | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | 核心题库扩展与数据定义 | 8 道新题录入且通过 schema 校验 | ✅ | `pnpm validate:prompts` 全部通过 |

## 3. 自动化验证汇总（可复跑）

```bash
pnpm validate:prompts
pnpm lint
pnpm check:length
pnpm exec tsx --test test/bin/validate-prompts.test.ts test/core/prompt-characterization.test.ts test/i18n/prompt-judge-i18n.test.ts test/i18n/i18n-integrity.test.ts
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm validate:prompts` | 通过（31 道内置题目 + 140 前沿题目 + 1140 候选） | 无 |
| `pnpm lint` | 通过（tsc --noEmit 0 错误） | 无 |
| `pnpm check:length` | 通过（708 文件 0 超标） | 无 |
| `pnpm exec tsx --test test/i18n/i18n-integrity.test.ts` | 通过（5/5 测试通过） | 无 |

## 4. 交付物

- `src/core/prompt/bank/benchmarks/2026-10/index.ts`：8 道 2026-10 提示词数据规范（310 行）；
- `src/core/prompt/bank/benchmarks/2026-10/display-en.ts`：8 道题目的英文评测标准字典（64 行）；
- `src/core/prompt/bank/index.ts`：导出 `benchmarks/2026-10` 并注册至 `BUILTIN_PROMPTS`；
- `src/core/prompt/i18n/standards-en.ts`：合并 `OCTOBER_2026_STANDARDS_EN`；
- `test/`：同步内置题库数量（23 -> 31）与 SHA256 锁。

## 5. 与计划的偏差

无。完全按照工单要求建立独立月度目录与集中导出。

## 6. 技术决策

- 保持与 `2026-09` 结构一致的月度隔离方案（`benchmarks/<YYYY-MM>/index.ts` + `display-en.ts`）；
- 严格遵循代码行数限制（单文件 310 行 < 500 行，展示字典 64 行 < 100 行）；
- 内置题库 SHA-256 指纹更新为 `bf12680ee13f84a6f0fb3565aca53eef6ce5207ca047bbf83b4135508c2799af` 锁定。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|
| 1 | 前端运行控制台分组尚未包含 2026-10 | 单次运行面板目前仅显示为未归类或自定义 | 由 [M3-02](../workorders/M3-02-grouping-october-prompts.md) 施工接手 |

## 8. 风险与下一步

- 风险：无；
- 下一步：开展 M3-02 施工，在看板与运行控制台注册 `'2026-10'` 分组。
