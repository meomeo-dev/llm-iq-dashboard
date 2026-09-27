# ACR-005: 界面文档路径改为英文，看板组件按职责归入子目录（English UI Doc Paths and Grouped Dashboard Components）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-26 |
| 变更类型 | structure-change |
| 触发来源 | 口头：目录结构评审，用户同意按“界面文档改英文路径 → 组件分组 → 超长文件拆分”的顺序调整 |
| 基线 | ARCH-001 |
| 影响章节 | §7 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：`docs/ui/看板/表盘设计Brief.md` 是仓库里唯一的非 ASCII 路径；README 截图单独放在 `docs/screenshots/`，
  与界面文档分处两地。`src/app/components/` 根目录平铺 18 个文件（卡片与 SVG 处理、工具栏与筛选、公共菜单、页面装配），
  其余功能（timeline、run-control、run-status 等）都有各自的子目录；`run-phase` 的测试没有按源码子目录放。
- 不动的代价：中文路径在命令行、URL 与部分工具里需要转义；组件根目录继续平铺，改一处要在 18 个文件里分辨归属，
  SVG 净化这类安全边界代码与普通展示组件混在一起。
- 为什么现在：目录结构评审提出，用户已同意调整。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 按 Next.js 项目结构指南的做法，组件按功能分目录、就近放置；文档路径用英文 kebab-case | npm:next | 15.5 | MIT | 2026-09-22 | active | 1 个模块（src/app），另动 test/app 的镜像路径 | 低：只挪文件与改引用，不加依赖 | adopt | - |
| 在上述基础上引入 eslint-plugin-boundaries 强制目录边界 | npm:eslint-plugin-boundaries | 7.2 | MIT | 2026-08-09 | active | 1 个模块，另加 ESLint 及其配置 | 中：仓库尚无 ESLint，要新增一套 lint 工具链与规则维护 | reject | 维护成本：为约束 5 个组件目录引入 ESLint 全套工具链；分层规则已由 architecture.md §7 陈述、tsc 保证引用可解析 |
| 保持平铺，只在 README 说明各文件归属 | self | - | - | - | - | 0 个模块 | 中：说明与文件归属靠人同步 | reject | 维护成本：归属写在文档里而不是目录上，新增文件时容易放错 |

> **结论**：按功能分目录 —— 组件根目录只留页面装配入口 `Dashboard.tsx`，卡片、工具栏、公共菜单各成子目录；界面文档与截图统一放在 `docs/ui/` 的英文路径下。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `docs/ui` | modify | 中文子目录（设计 Brief 与概念图）改名为 `dashboard/`，Brief 文件名改为 `dial-design-brief.md` | no |
| `docs/ui/dashboard/dial-design-brief.md` | add | 由原中文路径挪入；文中组件路径同步 | no |
| `docs/ui/dashboard/assets/dial-concept-dark-2k.png` | add | 由原中文路径挪入，内容不变 | no |
| `docs/screenshots` | move | 四张截图挪到 `docs/ui/screenshots/` | no |
| `docs/ui/screenshots` | add | 由上一行挪入，内容不变 | no |
| `docs/ui/README.md` | modify | 索引路径 | no |
| `docs/design-notes.md` | modify | `svg-sanitize.ts` 的链接路径 | no |
| `README.md` | modify | 截图与设计稿路径 | no |
| `.ip-compliance/asset-ledger.jsonl` | modify | 按新路径追加两条素材登记（台账只追加） | no |
| `src/app/components/card` | add | 卡片与 SVG 处理：PelicanCard、SvgFrame、LazySvgFrame、art-source、card-format、svg-sanitize、svg-scope、cards.css | no |
| `src/app/components/toolbar` | add | 工具栏与筛选：Toolbar、FilterMenu、Calendar、CheckList、filters、toolbar.css、calendar.css | no |
| `src/app/components/menu` | add | 公共菜单：Menu、menu.css | no |
| `src/app/components` | modify | 根目录只留 Dashboard.tsx；各处 import 路径同步 | no |
| `src/app/view` | modify | ArtViewer 与单件作品页的 import 路径 | no |
| `src/app/globals.css` | modify | 注释里的样式文件路径 | no |
| `test/app/components` | modify | card-format、svg-sanitize 测试挪到 `card/`，run-phase 测试挪到 `run-status/` | no |

**不动的东西**：

- 组件的实现、导出名与样式规则：只改文件位置与 import 路径。
- SVG 安全边界：净化仍在浏览器端经 `sanitizeSvg`，`/art` 的 CSP 沙箱不变。
- `/api` 路由、`src/core` 及其他模块、产物格式。
- `.ip-compliance/reports/` 下已出具的报告保留原路径。

## 兼容与回归

**兼容策略**：直接替换 —— 只挪文件与改引用，没有外部调用方；tsc 与构建能发现遗漏的引用。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门），能发现断掉的 import | pass | pass | 609898a | |
| `pnpm test` | node:test 单元测试（90 项） | pass | pass | 609898a | |
| `pnpm build` | Next.js 看板生产构建，含 CSS import | pass | pass | 609898a | |
| `find src/app/components -maxdepth 1 -type f ! -name Dashboard.tsx -exec false {} +` | 组件根目录只留页面装配入口 | fail | pass | 609898a | 变更前根目录平铺 18 个文件，即本单要解决的问题 |
| `LC_ALL=C find docs -name '*[! -~]*' -exec false {} +` | docs 下没有非 ASCII 路径 | fail | pass | 609898a | 变更前有中文路径 `docs/ui/看板/`，即本单要解决的问题 |
| `PELICAN_PORT=3100 docker compose up -d --build && sleep 30 && curl -fsS -o /dev/null http://127.0.0.1:3100/` | 容器按新路径构建，看板可访问 | pass | pass | 609898a | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、变量注入、强度折叠 | skip | skip | 609898a | 冒烟调用 codex，按约定不消耗其额度；本单只挪文件、不触及调用链 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 界面文档与截图归入 `docs/ui/` 的英文路径，更新引用，按新路径追加素材登记 | revert 本 commit |
| 2 | 组件按卡片、工具栏、公共菜单归入子目录，测试按源码路径归位，更新 import；浏览器核对看板、导出与单件作品页 | revert 本 commit |

## 回滚方案

- 触发条件：tsc 或构建因引用断裂失败；看板样式缺失（CSS import 路径错误）。
- 步骤：按步 revert 对应 commit，两步互不依赖。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：界面文档与截图挪到 `docs/ui/` 的英文路径；看板组件分入 card、toolbar、menu 三个子目录。涉及 1 个模块（src/app）
2. 不动什么：组件实现与导出、SVG 安全边界、`/api`、`src/core`、产物格式、已出具的审查报告
3. 为什么现在：目录结构评审提出，用户同意按顺序调整
4. 风险与回滚：最坏是遗漏的 import 或样式路径，tsc 与构建会拦下；两步各一个 commit，单独 revert
5. 成本：2 步，约 1 小时；不加依赖

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-26 | xumetide-dev | approved | 目录结构评审后在对话中同意按 1 → 2 → 3 的顺序调整 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §7 | 目录树补 `src/app/components` 的分组规则 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-005 | 已回填 |
| ADR（/adr-curator） | 不适用：文件位置可随时挪回，非难逆转 | 不适用 |
