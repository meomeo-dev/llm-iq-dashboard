# 验收 M2-01：双语字典核心底座与全局语言上下文

> 建立零外部依赖的 `src/i18n/` 中英双语底座、首屏语言协商与 `I18nProvider` / `<LanguageSwitch />`，并完成 `src/app/layout.tsx` 接入与单测验收。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-01](../workorders/M2-01-i18n-core-and-locale-context.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-13 |
| 验收结论 | 通过 |
| commit | 25731ea |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 建立 `src/i18n/` 类型、语言协商与分域字典 | 导出 `Locale`、`resolveLocale`、`formatText` 及 5 个分域双语字典 | 新建 `src/i18n/types.ts` (78 行) 与 `messages/{common,toolbar,viewer,config,pair,index}.ts`，`en` 与 `zh-CN` 字典全部叶子键 100% 对称 | `src/i18n/types.ts`、`src/i18n/messages/index.ts` | ✅ |
| 2 | 实现 `I18nProvider`、`useI18n` 与 `<LanguageSwitch />` 并接入 `src/app/layout.tsx` | 根布局动态输出 `<html lang={locale}>` 与双语 `metadata` | `src/i18n/context.tsx` (122 行) 与 `src/app/layout.tsx` (46 行) 已接入，`tsc --noEmit` 0 错误 | `src/app/layout.tsx L14-L45` | ✅ |
| 3 | 单测与代码长度门禁通过 | `test/i18n/locale.test.ts` 全绿，`pnpm check:length` 0 超标 | 5 个测试用例全部通过（2.35ms），扫描 432 文件 0 超标 | `pnpm exec tsx --test test/i18n/locale.test.ts` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm lint
pnpm test
pnpm check:length
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm lint` | 通过（tsc --noEmit 退出码 0） | 无 |
| `pnpm test` | 通过（`test/i18n/locale.test.ts` 5/5 pass） | 无 |
| `pnpm check:length` | 通过（扫描 432 个文件，超标 0 项） | 无 |

## 4. 交付物

- `src/i18n/{types.ts,context.tsx,index.ts}`
- `src/i18n/messages/{common,toolbar,viewer,config,pair,index}.ts`
- `src/app/layout.tsx`、`src/app/globals.css`
- `test/i18n/locale.test.ts`

## 5. 与计划的偏差

无。

## 6. 技术决策

采用 Cookie (`pelican_locale`) + `localStorage` + `Accept-Language` 首屏协商替代路径前缀路由，保持全部 URL 路由不变，零外部依赖。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

## 8. 风险与下一步

无阻断风险，继续推进 M2-02（英文主 README 与对外核心文档双语化）。
