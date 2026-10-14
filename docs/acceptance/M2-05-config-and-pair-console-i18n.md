# 验收 M2-05：配置管理台与设备配对页国际化

> 已完成所有者配置管理台（`/config`）全部 9 个分区面板与设备配对页（`/pair`）的中英双语国际化改造与 `<LanguageSwitch />` 接入，验收通过。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-05](../workorders/M2-05-config-and-pair-console-i18n.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-14 |
| 验收结论 | 通过 |
| commit | `9ddf5ed` |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

> 「实际」列写**实测到的东西**（"4 个 target：3 ok / 1 no-svg"、"tsc 0 error"、"时间线显示 24 格"），
> 不写"符合预期"。填不出证据就标 ⏳，不要标 ✅。
> 状态只用四个符号：✅ 通过 / ⚠️ 部分 / ⏳ 待执行 / ❌ 不通过。

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 设备配对页 `/pair` 双语支持與语言切换入口 | 页眉含 `<LanguageSwitch />`，配对表单与已配对卡片支持中英文 | 新建 `PairPageHeader.tsx` 挂载 `<LanguageSwitch />`，`PairCodeForm.tsx`、`PairSignedInCard.tsx`、`pair-form-model.ts`、`use-pair-form.ts` 支持 `en`/`zh-CN` | `src/app/pair/PairPageHeader.tsx`, `test/app/pair/pair-markup.test.ts` 通过 | ✅ |
| 2 | 配置页 `/config` 全部分区双语化与内置题目双语展示 | 9 个配置分区、导航栏、数据仓流水线、设备列表支持中英文，提示词选择器在英文下使用 `localizePromptSpec` | `ConfigPageHeader.tsx` 挂载 `<LanguageSwitch />`，`src/app/config/` 下全部 47 个组件与模型接入 `useI18n()` 及 `localizePromptSpec` | `src/app/config/ConfigEditor.tsx`, `src/app/config/PromptPicker.tsx`, `src/app/config/data-repo-panel-i18n.ts` | ✅ |
| 3 | 既有纯模型单测与 DOM 快照 100% 兼容 | `test/app/config/**` 与 `test/app/pair/**` 原样通过 | 所有 `*-model.ts` 保留中文常量并设 `locale: Locale = "zh-CN"` 默认参数；153 个测试套件 935 条用例全部通过 | `pnpm test` (935 pass, 0 fail) | ✅ |
| 4 | 类型检查、代码长度门禁与生产构建 | `pnpm lint`、`pnpm check:length`、`pnpm build` 0 错误 | `tsc --noEmit` 0 error；扫描 436 个文件超标 0 项；Next.js 15.5.25 构建 `/config` 与 `/pair` 路由成功 | `pnpm lint && pnpm check:length && pnpm build` | ✅ |

## 2. 功能点逐条验收

> §1 是**工单**维度的账，本表是**功能点**维度的逐条验收，**两者不可互相替代**。
> 功能点清单取自工单总览（-00）的「覆盖功能编号」列（那是声明的范围），
> 由 `acceptance.mjs new / features-table` 机械生成；「状态」「证据」两列**人工逐条填**。
>
> 「验收要点/AC」若出现「无（整体交付）」，那是**上游待补的信号**——
> 回 `../feature-lists/` 给那个功能点补验收要点，**不要在本表里编一条**。

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

> 验收时**实际执行过**的命令与结果。任何人按此清单重跑应得到相同结论；
> 依赖外部条件的命令注明前置条件（冒烟轮次要求 `claude` / `codex` / `agy` 在 PATH 中且已登录，
> 并消耗配额）。bash 块从工单「验收」节复制而来。浏览器核对写成一行：页面 + 读数 / 截图位置。

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm lint
pnpm test
pnpm check:length
pnpm build
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm lint` | ✅ `tsc --noEmit` 0 error | Node 22+, pnpm 10+ |
| `pnpm test` | ✅ 153 suites, 935 pass, 0 fail | 无 |
| `pnpm check:length` | ✅ 扫描 436 个文件，超标 0 项 | 无 |
| `pnpm build` | ✅ Next.js 15.5.25 生产构建成功（`/config` 36.9 kB, `/pair` 1.85 kB） | 无 |

## 4. 交付物

- 设备配对页双语化：`src/app/pair/{PairPageHeader.tsx,page.tsx,PairCodeForm.tsx,PairSignedInCard.tsx,pair-form-model.ts,use-pair-form.ts}`；
- 配置管理台双语化：`src/app/config/` 下全部面板与模型（含新建 `src/app/config/data-repo-panel-i18n.ts` 承载数据仓面板与流水线的英文推导逻辑）。

## 5. 与计划的偏差

- 为保证 `src/app/config/data-repo-panel-model.ts`（449 行）与 `src/app/config/data-repo-pipeline-model.ts`（375 行）严格控制在 500 行上限内，将数据仓英文状态与流水线文案推导拆入同目录 `src/app/config/data-repo-panel-i18n.ts`（277 行）。
- 为使服务端组件 `src/app/pair/page.tsx` 能渲染客户端语言切换器，拆出轻量客户端头部 `src/app/pair/PairPageHeader.tsx`。

## 6. 技术决策

- 所有 `*-model.ts` 纯函数采用 `locale: Locale = "zh-CN"` 可选参数，既保证无 Provider 环境下的单测与快照 100% 向后兼容，又支持在挂载 `<I18nProvider>` 的英文默认态下输出完整英文界面。
- 文档回填检查点：已回填。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

无新增技术债。

## 8. 风险与下一步

- 进入 `M2-06` 编写全栈双语完整性回归测试 `test/i18n/i18n-integrity.test.ts` 并执行全量 7 项质量门禁与 Sprint M2 收口。
