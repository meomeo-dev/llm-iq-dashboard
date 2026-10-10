# 验收记录

设计文档与 issue 说"要什么"，工单（`../workorders/`）说"怎么施工"，本目录说
**"做完了没有、证据是什么、欠了什么"**。一张工单一份验收（与工单同名），一个 Sprint 一份收口
（与总览同名）。台账 `acceptance.catalog.jsonl` 与下方索引表由
`.claude/skills/sprint-acceptance/scripts/acceptance.mjs` 维护，不手改。

## 什么时候才能标 ✅

1. **跑过真实数据路径才能 ✅。** 执行链的改动要有冒烟轮次
   （`PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once`）的 `data/runs/<runId>/run.json`
   作证；看板的改动要有 :3000 上的页面读数或截图作证。`pnpm lint` 与 `pnpm build` 通过
   只是必要条件，不能单独撑起一个 ✅。
2. **部分交付写限定语，结论封顶「有条件通过」。** 括号里写清欠的是什么，并在
   「已知限制与技术债」给出去向。
3. **工单 ✅ 不能顶替功能点逐条验收。** §2 的功能点集合必须等于总览「工单构成」声明的集合。
4. **填不出证据就 ⏳。** 状态只用 ✅ / ⚠️ / ⏳ / ❌；"已完成""符合预期"不是证据。

宁可低报，不可虚报：低报可以补，虚报会被下一个 Sprint 当成既有能力去依赖。

不属于任何 Sprint 的技术债记进 `tech-debt.md`（条目 `TD-NN`）。

## 索引

<!-- acceptance-index:start -->
| 工单 / Sprint | 主题 | 结论 | 日期 | commit |
|---|---|---|---|---|
| [M1-01](M1-01-register-viral-prompts.md) | 核心题库注册：经典与2026-09题目录入 | 通过 | 2026-10-10 | `bc9dcdf` |
| [M1-02](M1-02-grouping-classic-and-september.md) | 看板运行控制分类与2026-09分组 | 通过 | 2026-10-10 | `5c5cec4` |
| [M1-03](M1-03-benchmark-provenance-and-acceptance.md) | 基准出处台账更新与全量质量门禁验收 | 待定 | — | — |
<!-- acceptance-index:end -->
