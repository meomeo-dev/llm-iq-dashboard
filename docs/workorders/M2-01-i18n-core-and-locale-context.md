# 施工单 M2-01：双语字典核心底座与全局语言上下文

> 建立零外部依赖的 `src/i18n/` 中英双语（`en` / `zh-CN`）类型安全底座，提供 Cookie / `localStorage` 持久化、`Accept-Language` 首屏协商、`I18nProvider`、`useI18n()` Hook 与 `<LanguageSwitch />` 组件，并接入 `src/app/layout.tsx`。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：双语核心底座与全局上下文基础设施） |
| 依赖工单 | 无 |
| 验收文件 | [M2-01](../acceptance/M2-01-i18n-core-and-locale-context.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有且够用**：
  - `src/app/layout.tsx`（20 行）：根布局组件，包裹全部页面路由（`/`、`/view`、`/config`、`/pair`）。
- **已有但不对**：
  - `src/app/layout.tsx` 第 4–8 行硬编码中文 `metadata`（`title: "鹈鹕自行车基准 · LLM IQ Dashboard"`），第 16 行硬编码 `<html lang="zh-CN" suppressHydrationWarning>`，不支持按语种切换。
- **完全没有**：
  - `src/i18n/` 目录尚不存在，缺少 `Locale` 类型定义、语言探测与持久化、分域双语字典、`I18nProvider` 及语言切换按钮组件 `<LanguageSwitch />`。

## ⚠️ 关键落地约束（必须先验证）

1. **零外部依赖与编译期类型对齐**：
   - 不引入 `next-intl` 或 `i18next` 等第三方库；
   - 定义统一的 `Messages` 接口，令 `zhCNMessages` 与 `enMessages` 同时实现 `Messages`，缺失任何字段在 `pnpm lint`（`tsc --noEmit`）时立即报错。
2. **首屏协商与无闪烁切换**：
   - 优先级：`pelican_locale` Cookie / `localStorage` 显式值 > `Accept-Language` 请求头 / `navigator.language`（匹配 `zh*` 时取 `zh-CN`，否则取 `en`）；
   - `I18nProvider` 切换语言时同步更新 `document.documentElement.lang`、`document.title`、`localStorage` 与 `document.cookie`（`path=/; max-age=31536000; SameSite=Lax`）。
3. **代码行数门禁**：
   - `src/i18n/` 下每个 `.ts` 文件严格控制在 400 行以内，每个 `.tsx` 文件控制在 150 行以内，单函数不超过 40 行。

## 任务

### 1. 建立 `src/i18n/` 类型、探测与分域字典

- 新建 `src/i18n/types.ts`：定义 `export type Locale = "en" | "zh-CN"`、`DEFAULT_LOCALE: Locale = "en"`、`LOCALE_COOKIE = "pelican_locale"`，以及 `resolveLocale(raw?: string | null, acceptLanguage?: string | null): Locale` 与模板插值函数 `formatText(template: string, params?: Record<string, string | number>): string`。
- 新建分域双语字典文件：
  - `src/i18n/messages/common.ts`（全局元数据、通用按钮、状态码 `ok`/`no-svg`/`error`/`timeout`、强度档位说明、时间与单位格式）
  - `src/i18n/messages/toolbar.ts`（顶部工具栏、日历、时区菜单、筛选器、运行控制与状态横幅）
  - `src/i18n/messages/viewer.ts`（模型对比弹窗、大图详情页、评审抽屉、导出菜单与长图/GIF 文案）
  - `src/i18n/messages/config.ts`（`/config` 页面头部、侧边栏、能力目录、被测矩阵、Profile、调度、轮换、超时、直出约束、评审、数据仓与设备管理）
  - `src/i18n/messages/pair.ts`（`/pair` 设备配对页与错误提示）
- 新建 `src/i18n/index.ts`：聚合导出 `getMessages(locale: Locale)`、`useI18n()`、`I18nProvider`、`<LanguageSwitch />` 及全部辅助函数。

### 2. 建立 `I18nProvider`、`<LanguageSwitch />` 并接入 `src/app/layout.tsx`

- 新建 `src/i18n/context.tsx`：
  - 实现客户端 `I18nProvider`，接收服务端初始 `initialLocale?: Locale`，并在挂载后校验 `localStorage` / Cookie，提供 `{ locale, setLocale, t: Messages, format }`；
  - 实现紧凑的 `<LanguageSwitch className?: string />` 按钮组件（显示 `EN` / `中文` 切换，带无障碍 `aria-label` 与 `title`）。
- 修改 `src/app/layout.tsx`：
  - 通过 `cookies()` 与 `headers()`（Next.js 15 `await cookies()` / `await headers()`，对静态导出/无请求上下文安全 try-catch 回退）解析初始 `locale`，动态生成 `generateMetadata()` 并设置 `<html lang={locale} suppressHydrationWarning>`，使用 `<I18nProvider initialLocale={locale}>` 包裹 `{children}`。

### 不改的地方（红线）

- 不修改任何现有路由路径（`/`、`/view`、`/config`、`/pair`、`/art`、`/sheet`、`/api/*`）；
- 不修改 `package.json` 的 `dependencies`（零新增依赖）；
- 不修改 `src/core/`、`src/adapters/` 或 `data/` 下的任何文件。

### 测试

- 新增 `test/i18n/locale.test.ts`：
  - 断言 `resolveLocale` 对显式 Cookie（`en`、`zh-CN`）、`Accept-Language`（`zh-CN,zh;q=0.9`、`en-US,en;q=0.9`、空值）的解析结果符合预期；
  - 断言 `getMessages("en")` 与 `getMessages("zh-CN")` 的全部嵌套键路径 100% 对称且无空字符串。

## 验收

```bash
pnpm lint
pnpm test
pnpm check:length
```

## 回报格式

1. `pnpm lint`、`pnpm test`、`pnpm check:length` 执行结果；
2. `src/i18n/` 新增文件清单与行数统计；
3. `src/app/layout.tsx` 改动说明。

## 边界

- 允许新建：`src/i18n/**`、`test/i18n/locale.test.ts`；
- 允许修改：`src/app/layout.tsx`、`src/app/globals.css`（仅语言切换按钮所需基础样式）；
- 禁止修改：`src/core/`、`src/adapters/`、`config/`。

## 依赖

- 无。
