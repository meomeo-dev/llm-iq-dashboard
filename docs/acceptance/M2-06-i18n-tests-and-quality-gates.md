# 验收 M2-06：双语完整性单测与全量质量门禁收口

> 完成全栈双语完整性回归测试套件（`test/i18n/i18n-integrity.test.ts`）与全部 7 项仓库质量门禁全量验证，验收通过。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-06](../workorders/M2-06-i18n-tests-and-quality-gates.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-14 |
| 验收结论 | 通过 |
| commit | a579bbc |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | `en` 与 `zh-CN` 字典对称性与插值占位符检查 | 叶子键 100% 一致、无空串、`{placeholder}` 集合一致 | 叶子键集合完全一致且无空串，`{placeholder}` 插值集合 100% 匹配 | `test/i18n/i18n-integrity.test.ts` 用例 1 通过 | ✅ |
| 2 | 54 道内置题目与 300 条候选条目双语展示及不可变性 | 全部具备中英双语标题与标准，且 `template` 与 `candidates[].text` 零修改 | 54 道内置题与 300 条候选展示字段均非空，`localizePromptSpec` 未改动任何题面原文 | `test/i18n/i18n-integrity.test.ts` 用例 2 + `pnpm validate:prompts` (194 项 0 缺失) | ✅ |
| 3 | 核心对外双语文档互链检查 | 6 组核心文档中英成对存在且顶部互链 | `README`、`development`、`design-notes`、`deploy-docker`、`deploy-public-showcase`、`data-sync-architecture` 共 6 组中英文文档存在且前 10 行含双向切换链接 | `test/i18n/i18n-integrity.test.ts` 用例 3 通过 | ✅ |
| 4 | 导出图（横版/竖版时间线与结果集）双语渲染验证 | `locale: "en"` 与 `"zh-CN"` 输出对应语种标签 | 横版含 `Models`/`Tile corners`/`Now 12:30` 与 `模型`/`格内位置`/`现在 12:30`；竖版含 `1 results · 1 ok` 与 `1 个结果 · 成功 1`；结果集含 `Scheduled` 与 `定时` | `test/i18n/i18n-integrity.test.ts` 用例 4 通过 | ✅ |
| 5 | 关键 UI 组件双语挂载渲染与全量 7 项质量门禁 | 组件按 `I18nProvider` 语言渲染；7 项门禁全绿 | `ConfigPageHeader`、`EmptyDay`、`PairCodeForm` 双语断言通过；`lint`、`test` (154 suites / 940 pass / 0 fail)、`validate:prompts`、`check:length` (437 files / 0 违规)、`check:secrets` (886 files / 0 问题)、`build`、`showcase:smoke` 全部通过 | `test/i18n/i18n-integrity.test.ts` 用例 5 + 7 项门禁实跑输出 | ✅ |

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
pnpm check:secrets
pnpm build
pnpm showcase:smoke
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm validate:prompts` | 通过（54 道内置题 + 140 道前沿单题 + 16 套题 220 候选，共 194 项 0 缺失） | Node 22+ |
| `pnpm lint` | 通过（`tsc --noEmit` 0 errors） | Node 22+ |
| `pnpm test` | 通过（154 suites / 940 tests pass / 0 fail，含 `i18n-integrity.test.ts`） | Node 22+ |
| `pnpm check:length` | 通过（扫描 437 个文件，超标 0 项） | Node 22+ |
| `pnpm check:secrets` | 通过（扫描 886 个已跟踪文件，白名单 7 个，问题 0 项） | Node 22+ |
| `pnpm build` | 通过（Next.js 15.5.25 生产构建成功，全路由表无变更） | Node 22+ |
| `pnpm showcase:smoke` | 通过（13 项只读展台端到端防线与健康检查全绿） | Node 22+ |

## 4. 交付物

- 新增 `test/i18n/i18n-integrity.test.ts`：覆盖双语字典对称性与插值占位符、54 道内置题目及 300 条候选条目双语元数据与不可变性、6 组核心双语文档互链、三类 SVG 导出图双语渲染、以及关键 UI 组件双语 SSR 渲染验证。
- 跑通全仓 7 项质量门禁（`validate:prompts`、`lint`、`test`、`check:length`、`check:secrets`、`build`、`showcase:smoke`）。

## 5. 与计划的偏差

无。

## 6. 技术决策

- 使用 `react-dom/server` 的 `renderToStaticMarkup` 搭配 `<I18nProvider initialLocale="...">` 在 Node 单测中直接验证组件双语渲染，零新增外部测试依赖。
- 文档回填检查点：`README.md`、`README.zh-CN.md` 及 `docs/*.md` / `docs/*.zh-CN.md` 已在 M2-02 完成回填并通过本单自动化互链测试守护（已回填）。

## 7. 已知限制与技术债

无。

## 8. 风险与下一步

M2-01 至 M2-06 全部工单已交付并通过门禁，下一步执行 Sprint M2 整体验收收口（`M2-00`）。
