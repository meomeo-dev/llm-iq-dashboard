# Sprint 收口 M2-00：中英双语全栈国际化改造

> 完成 `llm-iq-dashboard` 全栈中英双语（`en` / `zh-CN`）国际化改造：6 张工单全部通过验收，7 项仓库质量门禁全绿，无遗留技术债。

| 项 | 内容 |
|---|---|
| 对应总览 | [M2-00](../workorders/M2-00-bilingual-i18n-support.md) |
| 工单数 | 6 |
| 收口日期 | 2026-10-14 |
| 结论 | 通过 |
| commit | 794f1a5 |
| 完成判定 | 验了 6 条 / 共 6 条 |

## 1. Sprint 完成判定逐条

| # | 判定条目 | 实际 | 证据 | 状态 | 去向 |
|---|---|---|---|---|---|
| 1 | `src/i18n/` 提供完整 `en` / `zh-CN` 类型安全字典、语言上下文与 `<LanguageSwitch />`，`src/app/layout.tsx` 支持双语 `<html lang>` 与 metadata | 已实现 `src/i18n/` 类型安全字典与 `I18nProvider` / `LanguageSwitch`，`src/app/layout.tsx` 按请求 Cookie 与 `Accept-Language` 解析初始语言并输出对应 `<html lang>` 与双语 metadata | commit `25731ea`、[M2-01 验收](M2-01-i18n-core-and-locale-context.md)、`test/i18n/locale.test.ts` 与 `test/i18n/i18n-integrity.test.ts` 全通过 | ✅ | — |
| 2 | `README.md` 切换为英文主入口并保留 `README.zh-CN.md` 互链，对外核心部署与开发文档具备英文版与 `.zh-CN.md` 互链 | `README.md` 及 `development`、`design-notes`、`deploy-docker`、`deploy-public-showcase`、`data-sync-architecture` 共 6 组文档完成英文主版与 `.zh-CN.md` 顶部互链 | commit `23627eb`、[M2-02 验收](M2-02-bilingual-docs-and-readme.md)、`test/i18n/i18n-integrity.test.ts` 用例 3 通过 | ✅ | — |
| 3 | 54 道内置题目与 300 条候选的展示层 `label`、`PromptStandard`、题龄文案、分组标题以及评审标准 `G1`–`G3` / `C1`–`C9` 支持 `en` / `zh-CN` 双语输出，且题面 `template` / `text` 零字节改动 | 54 道内置题目、300 条候选、274 条 `PromptStandard`、题龄与分组标题、`G1`–`G5` 门槛与 `C1`–`C9` 判据均支持 `en` / `zh-CN` 双语映射；`src/core/prompt.ts` 题面原文零字节修改 | commit `94c0d8a`、[M2-03 验收](M2-03-prompt-and-judge-metadata-i18n.md)、`pnpm validate:prompts` 194 项 0 缺失、`test/i18n/prompt-judge-i18n.test.ts` 通过 | ✅ | — |
| 4 | 主看板（`/`）、作品详情页（`/view`）与 SVG/PNG/GIF 社交分享导出图完整支持 `en` / `zh-CN` 切换 | 主看板顶栏、筛选栏、跑一次弹窗、预算与自动运行弹窗、详情页与评审抽屉、横版/竖版时间线及结果集 SVG/PNG/GIF 导出图均支持 `en` / `zh-CN` 切换 | commit `e1601d0`、[M2-04 验收](M2-04-dashboard-viewer-and-export-i18n.md)、`test/i18n/i18n-integrity.test.ts` 用例 4 通过 | ✅ | — |
| 5 | 配置管理台（`/config`）与设备配对页（`/pair`）完整支持 `en` / `zh-CN` 切换 | `/config` 侧边栏与 9 个配置区块（53 个文件）及 `/pair` 配对码、已授权设备管理页均支持 `en` / `zh-CN` 实时切换 | commit `9ddf5ed`、[M2-05 验收](M2-05-config-and-pair-console-i18n.md)、`test/i18n/i18n-integrity.test.ts` 用例 5 通过 | ✅ | — |
| 6 | 全套质量门禁（`pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`、`pnpm showcase:smoke`）全部绿灯通过 | `pnpm lint` 0 error、`pnpm test` 154 suites / 940 pass / 0 fail、`pnpm validate:prompts` 194 项 0 缺失、`pnpm check:length` 437 文件 0 超标、`pnpm check:secrets` 896 文件 0 问题、`pnpm build` 成功、`pnpm showcase:smoke` 13 项只读防线全绿 | commit `794f1a5`、[M2-06 验收](M2-06-i18n-tests-and-quality-gates.md) | ✅ | — |

## 2. 工单一览

| 工单 | 名称 | 验收结论 | commit | 验收文件 |
|---|---|---|---|---|
| [M2-01](../workorders/M2-01-i18n-core-and-locale-context.md) | 双语字典核心底座与全局语言上下文 | 通过 | 25731ea | [M2-01](M2-01-i18n-core-and-locale-context.md) |
| [M2-02](../workorders/M2-02-bilingual-docs-and-readme.md) | 英文主 README 与对外核心文档双语化 | 通过 | 23627eb | [M2-02](M2-02-bilingual-docs-and-readme.md) |
| [M2-03](../workorders/M2-03-prompt-and-judge-metadata-i18n.md) | 题库展示元数据与评审标准双语映射 | 通过 | 94c0d8a | [M2-03](M2-03-prompt-and-judge-metadata-i18n.md) |
| [M2-04](../workorders/M2-04-dashboard-viewer-and-export-i18n.md) | 主看板、作品详情页与社交分享导出图国际化 | 通过 | e1601d0 | [M2-04](M2-04-dashboard-viewer-and-export-i18n.md) |
| [M2-05](../workorders/M2-05-config-and-pair-console-i18n.md) | 配置管理台与设备配对页国际化 | 通过 | 9ddf5ed | [M2-05](M2-05-config-and-pair-console-i18n.md) |
| [M2-06](../workorders/M2-06-i18n-tests-and-quality-gates.md) | 双语完整性单测与全量质量门禁收口 | 通过 | 794f1a5 | [M2-06](M2-06-i18n-tests-and-quality-gates.md) |

## 3. 功能点汇总

| 功能点 | 状态 | 出自工单 |
|---|---|---|
| （本 Sprint 不挂功能点） | — | — |

## 4. 技术债入账

无。M2-04 阶段临时指向 M2-05 的 `/config` 与 `/pair` 页面国际化已在 M2-05 完整交付并清零。

## 5. 回流

- [x] `docs/acceptance/README.md` 索引行已更新（`acceptance.mjs index`）
- [x] 本 Sprint 为基于用户确认方案直接立项的 Sprint，无关联 issue
- [x] 本 Sprint 改变了的行为已回填到仓库根 `README.md` / `README.zh-CN.md` 与 `docs/*.md` / `docs/*.zh-CN.md`

## 6. 下一步

Sprint M2（中英双语全栈国际化改造）已完整收口；后续新增题目或新增 UI 组件时，由 `pnpm lint`（字典类型对称）与 `test/i18n/i18n-integrity.test.ts`（双语完整性单测）自动守护双语覆盖率。
