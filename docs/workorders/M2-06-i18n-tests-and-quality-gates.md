# 施工单 M2-06：双语完整性单测与全量质量门禁收口

> 建立全栈双语完整性自动化回归测试（字典键值与占位符对称、54 道题与 300 条候选双语元数据非空、内置题面 SHA-256 零改动守护、导出长图双语渲染），并跑通全套质量门禁与只读展台冒烟完成 Sprint M2 收口。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：全栈双语回归单测与质量门禁收口） |
| 依赖工单 | [M2-02](M2-02-bilingual-docs-and-readme.md), [M2-04](M2-04-dashboard-viewer-and-export-i18n.md), [M2-05](M2-05-config-and-pair-console-i18n.md) |
| 验收文件 | [M2-06](../acceptance/M2-06-i18n-tests-and-quality-gates.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有且够用**：
  - 仓库质量门禁工具链：`pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`、`pnpm showcase:smoke`。
- **需要收口验证**：
  - 在 M2-01 至 M2-05 完成后，需通过专项单测锁死「中英字典键值/插值占位符对称」「全部内置题目与候选的英文元数据完备」「内置题目 `template`/`text` 原文未发生任何意外修改」「双语文档互链文件全部存在」，并执行全套门禁包括 `pnpm showcase:smoke`。

## ⚠️ 关键落地约束（必须先验证）

1. **占位符一致性校验**：
   - 字典字符串中形如 `{count}`、`{model}` 的插值占位符，在 `en` 与 `zh-CN` 对应键中必须集合完全相等，防止运行时漏替换。
2. **题面原文零改动断言**：
   - 单测对 `BUILTIN_PROMPTS` 的 `id`、`template` 与 `candidates[].text` 进行完整性断言，确保国际化改造未触碰任何评测题面。
3. **全门禁通过**：
   - `pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`、`pnpm showcase:smoke` 全部 0 错误退出。

## 任务

### 1. 编写全栈国际化完整性回归测试 `test/i18n/i18n-integrity.test.ts`

- 递归校验 `getMessages("en")` 与 `getMessages("zh-CN")` 的所有叶子键路径、非空性与 `{placeholder}` 占位符集合 100% 一致；
- 校验 54 道 `BUILTIN_PROMPTS` 与 300 条 `candidates` 在 `en` 和 `zh-CN` 下的 `localizePromptLabel`、`localizeCandidateLabel`、`localizePromptStandard` 均非空；
- 校验 `README.md`、`README.zh-CN.md` 及 `docs/*.md` / `docs/*.zh-CN.md` 双语文档成对存在且顶部包含互链；
- 校验 `timelineSvg` 与 `resultSetSvg` 在 `en` 与 `zh-CN` 模式下分别输出对应语种的标题与角标。

### 2. 全量质量门禁与只读展台冒烟验证

- 依次执行 `pnpm validate:prompts`、`pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`、`pnpm showcase:smoke`，记录全部通过证据。

### 不改的地方（红线）

- 不修改任何评测执行器与适配器逻辑；
- 不放宽 `config/code-length-policy.yaml` 或 `config/secret-scan-policy.yaml` 的门禁标准。

### 测试

- `pnpm test` 全量通过（含新增的 `test/i18n/i18n-integrity.test.ts`）；
- `pnpm showcase:smoke` 只读展台冒烟测试通过。

## 验收

```bash
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
pnpm check:secrets
pnpm build
pnpm showcase:smoke
```

## 回报格式

1. 7 项质量门禁命令的完整执行结果；
2. `test/i18n/i18n-integrity.test.ts` 覆盖项汇总；
3. Sprint M2 收口就绪确认。

## 边界

- 允许新建：`test/i18n/i18n-integrity.test.ts`；
- 允许修改：`docs/acceptance/M2-*.md`；
- 禁止修改：评测执行引擎与数据仓契约。

## 依赖

- 依赖 [M2-02](M2-02-bilingual-docs-and-readme.md)、[M2-04](M2-04-dashboard-viewer-and-export-i18n.md)、[M2-05](M2-05-config-and-pair-console-i18n.md) 全部完成。
