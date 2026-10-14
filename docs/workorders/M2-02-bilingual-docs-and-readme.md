# 施工单 M2-02：英文主 README 与对外核心文档双语化

> 按国际开源项目惯例将 `README.md` 切换为英文主入口，原中文移至 `README.zh-CN.md` 并添加顶部双语互链；同时为对外核心部署、开发与设计文档建立英文主版与 `.zh-CN.md` 中文版互链，并更新 `package.json` 与 `config/pelican.example.yaml` 注释。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：开源仓库文档体系双语化） |
| 依赖工单 | [M2-01](M2-01-i18n-core-and-locale-context.md) |
| 验收文件 | [M2-02](../acceptance/M2-02-bilingual-docs-and-readme.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有但仅有中文**：
  - `README.md`（418 行）：完整介绍基准出处、快速开始、Docker 部署、公网只读展台、配置、题库、评审、数据仓同步、成本与目录结构，但仅有中文版；
  - `docs/deploy-docker.md`（232 行）：Docker 双容器部署与升级指南，仅中文；
  - `docs/deploy-public-showcase.md`（140 行）：公网只读展台部署指南，仅中文；
  - `docs/development.md`（141 行）：本地开发、目录结构、产物格式与 HTTP 接口说明，仅中文；
  - `docs/design-notes.md`（103 行）：核心架构与工程设计取舍，仅中文；
  - `docs/data-sync-architecture.md`（308 行）：公开数据仓脱敏与发布流水线架构，仅中文；
  - `docs/benchmark-provenance.md`（1716 行）：基准出处与题库考证长文档，仅中文；
  - `package.json`（61 行）：第 11 行 `description` 为中文；
  - `config/pelican.example.yaml`（184 行）：配置模板注释仅中文。
- **完全没有**：
  - `README.zh-CN.md` 及 `docs/*.zh-CN.md` 尚不存在，英文版 README 与核心运行文档尚不存在。

## ⚠️ 关键落地约束（必须先验证）

1. **命令、配置字段与路径零偏差**：
   - 英文版文档中的所有命令代码块（`pnpm install`、`pnpm preflight`、`docker compose up -d --build` 等）、环境变量名（`PELICAN_*`）、YAML 配置键名与文件相对链接必须与中文版及代码真实实现 100% 一致。
2. **双向语言切换导航**：
   - 每份双语文档首行标题下方均放置 `English | [简体中文](...)` 或 `[English](...) | 简体中文` 导航链接，且中文归档文档内部的相对链接指向对应的 `.zh-CN.md`。
3. **首次加载配置模板兼容性**：
   - `config/pelican.example.yaml` 被 `src/core/config/loader.ts` 用于首次生成 `config/pelican.config.yaml` 及被配置单测读取，双语化注释不得改动任何有效 YAML 键值或结构。

## 任务

### 1. 切换 `README.md` 为英文主入口并归档 `README.zh-CN.md`

- 将当前 `README.md` 完整保留至 `README.zh-CN.md`，在标题下增加 `[English](README.md) | **简体中文**` 切换栏，并将正文中指向对外核心文档的链接更新为 `.zh-CN.md`；
- 编写完整的英文版 `README.md`（含 `**English** | [简体中文](README.zh-CN.md)` 切换栏），完整覆盖 Attribution、Quick Start、Docker Deployment、Public Read-Only Showcase、Configuration、Prompts & Rotation、Artwork Judging、Public Data Repo Sync、API-Equivalent Cost、Design Notes 与 Directory Layout；
- 在 `docs/benchmark-provenance.md` 顶部补充双语导读说明与章节索引，确保英文读者可直接检索全部 54 道题目的学术/社区出处与开放许可。

### 2. 核心部署与开发文档双语化及配置模板更新

- 为以下 5 份对外核心文档建立 `.zh-CN.md` 中文归档并将原路径更新为英文版（顶部双向互链）：
  - `docs/deploy-docker.md` ⇄ `docs/deploy-docker.zh-CN.md`
  - `docs/deploy-public-showcase.md` ⇄ `docs/deploy-public-showcase.zh-CN.md`
  - `docs/development.md` ⇄ `docs/development.zh-CN.md`
  - `docs/design-notes.md` ⇄ `docs/design-notes.zh-CN.md`
  - `docs/data-sync-architecture.md` ⇄ `docs/data-sync-architecture.zh-CN.md`
- 更新 `package.json` 的 `description` 为英文描述；
- 更新 `config/pelican.example.yaml` 注释为清晰的中英双语对照注释。

### 不改的地方（红线）

- 不翻译内部治理文档（`AGENTS.md`、`docs/workorders/`、`docs/acceptance/`、`docs/architecture/revisions/`）；
- 不修改 `config/pelican.example.yaml` 中的任何 YAML 配置键或默认值；
- 不修改 `package.json` 的 `scripts`、`dependencies` 或 `devDependencies`。

### 测试

- 运行 `pnpm test`，确认读取 `config/pelican.example.yaml` 的所有配置测试 100% 通过；
- 运行 `pnpm check:secrets`，确认新增文档无误报凭据。

## 验收

```bash
pnpm lint
pnpm test
pnpm check:secrets
```

## 回报格式

1. `pnpm lint`、`pnpm test`、`pnpm check:secrets` 执行结果；
2. 新增与更新的双语文档清单及行数对照；
3. 互链与配置模板兼容性核验说明。

## 边界

- 允许修改：`README.md`、`package.json`、`config/pelican.example.yaml`、`docs/{deploy-docker,deploy-public-showcase,development,design-notes,data-sync-architecture,benchmark-provenance}.md`；
- 允许新建：`README.zh-CN.md`、`docs/{deploy-docker,deploy-public-showcase,development,design-notes,data-sync-architecture}.zh-CN.md`；
- 禁止修改：`src/` 下业务代码。

## 依赖

- 依赖 [M2-01](M2-01-i18n-core-and-locale-context.md)。
