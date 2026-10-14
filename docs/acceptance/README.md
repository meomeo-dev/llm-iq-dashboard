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
| [M2-00](M2-00-bilingual-i18n-support.md) | 中英双语全栈国际化改造 | 通过 | 2026-10-14 | `794f1a5` |
| [M2-01](M2-01-i18n-core-and-locale-context.md) | 双语字典核心底座与全局语言上下文 | 通过 | 2026-10-13 | `25731ea` |
| [M2-02](M2-02-bilingual-docs-and-readme.md) | 英文主 README 与对外核心文档双语化 | 通过 | 2026-10-13 | `23627eb` |
| [M2-03](M2-03-prompt-and-judge-metadata-i18n.md) | 题库展示元数据与评审标准双语映射 | 通过 | 2026-10-13 | `94c0d8a` |
| [M2-04](M2-04-dashboard-viewer-and-export-i18n.md) | 主看板、作品详情页与社交分享导出图国际化 | 通过 | 2026-10-14 | `e1601d0` |
| [M2-05](M2-05-config-and-pair-console-i18n.md) | 配置管理台与设备配对页国际化 | 通过 | 2026-10-14 | `9ddf5ed` |
| [M2-06](M2-06-i18n-tests-and-quality-gates.md) | 双语完整性单测与全量质量门禁收口 | 通过 | 2026-10-14 | `794f1a5` |
| [M1-01](M1-01-register-viral-prompts.md) | 核心题库注册：经典与2026-09题目录入 | 通过 | 2026-10-10 | `bc9dcdf` |
| [M1-02](M1-02-grouping-classic-and-september.md) | 看板运行控制分类与2026-09分组 | 通过 | 2026-10-10 | `5c5cec4` |
| [M1-03](M1-03-benchmark-provenance-and-acceptance.md) | 基准出处台账更新与全量质量门禁验收 | 通过 | 2026-10-10 | `9713d49` |
<!-- acceptance-index:end -->
