# Sprint 收口 M3-00：2026年10月流行评测题库注册与看板分组呈现

> 完成 2026 年 10 月社区流行的 8 道高难度评测题目（简森步行机构、跳蛛起跳、蜈蚣行波、开放差速器、摩天轮自水平、章鱼管风琴、孔雀骑车、鹦鹉螺螺线）接入：3 张工单全部通过验收，核心题库、看板运行控制分组、出处台账与全套质量防御门禁全绿，无遗留技术债。

| 项 | 内容 |
|---|---|
| 对应总览 | [M3-00](../workorders/M3-00-viral-prompts-2026-10.md) |
| 工单数 | 3 |
| 收口日期 | 2026-11-12 |
| 结论 | 通过 |
| commit | b75e53f |
| 完成判定 | 验了 6 条 / 共 6 条 |

## 1. Sprint 完成判定逐条

| # | 判定条目 | 实际 | 证据 | 状态 | 去向 |
|---|---|---|---|---|---|
| 1 | 8 道题目经 `pnpm validate:prompts` 校验 100% 通过无格式与校验契约错误 | `src/core/prompt/bank/benchmarks/2026-10/` 包含 8 道 PromptSpec 与配对 display-en.ts，`BUILTIN_PROMPTS` 扩充至 31 道 | `pnpm validate:prompts` 扫描 171 项 0 缺失通过、[M3-01 验收](M3-01-register-october-viral-prompts.md) | ✅ | — |
| 2 | TypeScript 类型检查通过，无类型定义缺失或接口不匹配 | 全量 TypeScript 编译通过，无类型错误 | `pnpm lint`（`tsc --noEmit`）退出码 0 | ✅ | — |
| 3 | 看板分组与分类器单元测试全部通过，覆盖 2026-10 分组及排序验证 | `run-once-grouping.ts` 扩展 `'2026-10'` 分组，测试断言 8 题分类与紧随 `'2026-09'`、排在 `'自定义提示词'` 之前的拓扑顺序 | `test/app/components/run-control/run-once-grouping.test.ts` 13/13 测试通过、[M3-02 验收](M3-02-grouping-october-prompts.md) | ✅ | — |
| 4 | 代码与文件长度策略符合规范，无文件或函数超标 | 新增与修改文件均在额度内（`index.ts` 310 行 < 500 行，`display-en.ts` 64 行 < 100 行，`run-once-grouping.ts` 135 行 < 300 行） | `pnpm check:length` 扫描 708 文件 0 超标 | ✅ | — |
| 5 | 无任何敏感凭据或私钥泄漏 | 密钥扫描零命中 | `pnpm check:secrets` 扫描 1685 个已跟踪文件 0 问题 | ✅ | — |
| 6 | 基准出处文档与台账记录齐备，真实反映题目背景与许可状态 | `docs/benchmark-provenance.md` 第一章总览表追加 8 行（序号 181–188），新建 §二十五 详细记录 8 题出处链接、核心机制与一票否决规则，后续章节顺延 | `docs/benchmark-provenance.md` 包含 §二十五 完整条目、[M3-03 验收](M3-03-benchmark-provenance-and-acceptance.md) | ✅ | — |

## 2. 工单一览

| 工单 | 名称 | 验收结论 | commit | 验收文件 |
|---|---|---|---|---|
| [M3-01](../workorders/M3-01-register-october-viral-prompts.md) | 核心题库注册：2026-10 题目录入与 TypeScript 模块实现 | 通过 | 2a29880 | [M3-01](M3-01-register-october-viral-prompts.md) |
| [M3-02](../workorders/M3-02-grouping-october-prompts.md) | 看板运行控制分类与 2026-10 分组呈现 | 通过 | 79e8799 | [M3-02](M3-02-grouping-october-prompts.md) |
| [M3-03](../workorders/M3-03-benchmark-provenance-and-acceptance.md) | 基准出处台账更新与全量质量门禁验收 | 通过 | 15675de | [M3-03](M3-03-benchmark-provenance-and-acceptance.md) |

## 3. 功能点汇总

| 功能点 | 状态 | 出自工单 |
|---|---|---|
| （本 Sprint 不挂功能点） | — | — |

## 4. 技术债入账

无。所有工单内部技术依赖均已自闭环解决。

## 5. 回流

- [x] `docs/acceptance/README.md` 索引已更新
- [x] 本 Sprint 改变的题目数量与分组拓扑已回填至 `docs/benchmark-provenance.md`
- [x] 8 道题目的中英双语展示标准已同步至 `src/core/prompt/i18n/`

## 6. 下一步

Sprint M3（2026年10月流行评测题库注册与看板分组呈现）已完整收口；题库随时可供调度器运行评测或在看板单次运行中选择测试。
