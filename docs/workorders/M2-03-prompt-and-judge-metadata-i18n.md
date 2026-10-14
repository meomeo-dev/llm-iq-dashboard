# 施工单 M2-03：题库展示元数据与评审标准双语映射

> 为 54 道内置题目、300 条候选、题龄计算（`promptLifecycle`）、题库分组标题及作品评审标准（`G1`–`G3`、`C1`–`C9` 与联系图部位名）建立纯展示层的 `en` / `zh-CN` 双语映射函数，严格保持题面原文与落盘 JSON 契约零改动。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：题库与评审元数据展示层双语化） |
| 依赖工单 | [M2-01](M2-01-i18n-core-and-locale-context.md) |
| 验收文件 | [M2-03](../acceptance/M2-03-prompt-and-judge-metadata-i18n.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有且够用**：
  - `src/core/prompt/builtin.ts`（90 行）：汇聚 54 道 `BUILTIN_PROMPTS`（含 300 条 `candidates`、274 条 `PromptStandard`）；
  - 其中 30 道单题与 14 套 FE/VFX 题组的 `label` 已内含 `中文名 (English Name)` 双语括号格式。
- **已有但不支持多语言展示**：
  - 8 套四大名著（`shuihu`/`xiyou`/`sanguo`/`honglou` 静动态共 80 条候选）与 2 套城市地标（`landmarks-v1`/`landmarks-anim-v1` 共 80 条候选）的 `label` 为纯中文；
  - `PromptStandard`（`coreKey`、`groundTruth`、`evaluationCriteria`）的说明段落为中文（夹杂 LaTeX 公式与英文术语）；
  - `src/core/prompt/lifecycle.ts`（60 行）：`formatMonthsElapsed` 与 `formatDaysElapsed` 硬编码返回中文（如 `"3个月前"`、`"收录 15 天"`）；
  - `src/app/components/run-control/run-once-grouping.ts`（124 行）与 `src/app/components/toolbar/toolbar-filter-groups.tsx`（55 行）：分组标题硬编码中文；
  - `src/core/judge/schema.ts`（230 行）：`PELICAN_GATES`（`G1`–`G3`）、`PELICAN_CRITERIA`（`C1`–`C9`）的 `title`/`standard` 与联系图部位名 `subject` 仅中文。

## ⚠️ 关键落地约束（必须先验证）

1. **题面原文零改动红线**：
   - `PromptSpec.template` 与 `PromptCandidate.text` 严禁做任何字符改动；
   - `pnpm validate:prompts` 必须保持 100% 通过。
2. **展示层纯函数映射**：
   - 新增 `localizePromptLabel(id: string, rawLabel: string, locale: Locale): string`、`localizeCandidateLabel(id: string, rawLabel: string, locale: Locale): string`、`localizePromptStandard(id: string, standard: PromptStandard | null | undefined, locale: Locale): PromptStandard | null`；
   - 对已含 `中文 (English)` 的标题自动按 `locale` 提取对应语种名称（或使用显式映射表覆盖），对四大名著 80 回与城市地标 40 景在 `src/core/prompts/i18n/` 提供精确英文标题与标准说明映射。
3. **评审标准按 ID 动态回表**：
   - 历史 `.judge.json` 已落盘中文 `title` 与 `standard`；新增 `localizeGateResult(gate: GateResult, locale: Locale)` 与 `localizeCriterionResult(criterion: CriterionResult, locale: Locale)` 及 `localizeDetailSubject(kind: DetailKind, fallback: string, locale: Locale)`，在 `en` 模式下按 `gate.id` / `criterion.id` / `detail.kind` 返回英文标题与标准描述。

## 任务

### 1. 题库展示元数据与生命周期双语化

- 在 `src/core/prompts/i18n/` 下新建英文元数据字典与解析器（置于 `src/core/prompts/**` 路径下，模块化拆分）：
  - `src/core/prompts/i18n/labels-en.ts`：54 道题与四大名著 80 回、城市地标 40 景、FE/VFX 候选的英文 `label` 映射与括号提取器；
  - `src/core/prompts/i18n/standards-en.ts`：各题与候选 `PromptStandard`（`coreKey`、`groundTruth`、`evaluationCriteria`）的英文映射与术语转换；
  - `src/core/prompts/i18n/index.ts`：导出 `localizePromptLabel`、`localizeCandidateLabel`、`localizePromptStandard`、`localizePromptSpec`、`localizePromptGroupLabel`。
- 修改 `src/core/prompt/lifecycle.ts`：`promptLifecycle(spec, now?, locale: Locale = "zh-CN")` 支持传入 `locale`，在 `"en"` 下输出 `"just now"`、`"{n}mo ago"`、`"{n}y {m}mo ago"`、`"added today"`、`"{n}d in bench"`。

### 2. 评审标准（`G1`–`G3` / `C1`–`C9`）与部位名双语化

- 新建 `src/i18n/judge-rubric.ts`：
  - 为 `G1`–`G3`、`C1`–`C9` 提供英文 `title` 与 `standard` 字典；
  - 为 `DetailKind`（`pelican`、`head`、`crank`、`saddle`、`handlebar`、`wheel-left`、`wheel-right`）及常见静态证据模板提供英文映射函数 `localizeGate`、`localizeCriterion`、`localizeDetailSubject`、`localizeVerdictLabel`。

### 不改的地方（红线）

- 不修改任何内置题目的 `id`、`template`、`candidates[].id`、`candidates[].text`、`originDate`、`registeredAt`；
- 不修改 `src/core/judge/static-judge.ts`、`render-judge.ts`、`ai-judge.ts` 的打分逻辑与落盘格式；
- 不修改 `GroupKey` 的内部键值（保持现有键值供逻辑判断，仅在展示层通过 `localizePromptGroupLabel(key, locale)` 渲染双语组名）。

### 测试

- 新增 `test/i18n/prompt-judge-i18n.test.ts`：
  - 遍历全部 54 道 `BUILTIN_PROMPTS` 与 300 条 `candidates`，断言在 `en` 与 `zh-CN` 下 `localizePromptLabel`、`localizeCandidateLabel` 均返回非空字符串，且 `en` 模式下不含未翻译的纯中文标题；
  - 断言 `G1`–`G3` 与 `C1`–`C9` 在 `en` 与 `zh-CN` 下均能正确返回对应语言的标题与判据。

## 验收

```bash
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
```

## 回报格式

1. `pnpm validate:prompts`、`pnpm lint`、`pnpm test`、`pnpm check:length` 执行结果；
2. 54 道题与 300 条候选双语映射覆盖统计；
3. 评审标准双语映射函数说明。

## 边界

- 允许新建：`src/core/prompts/i18n/**`、`src/i18n/judge-rubric.ts`、`test/i18n/prompt-judge-i18n.test.ts`；
- 允许修改：`src/core/prompt/lifecycle.ts`、`src/i18n/index.ts`；
- 禁止修改：题面原文、评测执行链、适配器。

## 依赖

- 依赖 [M2-01](M2-01-i18n-core-and-locale-context.md)。
