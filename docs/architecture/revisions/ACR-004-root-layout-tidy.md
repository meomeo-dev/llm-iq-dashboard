# ACR-004: 根目录只留工具约定入口，Docker 文件归入 docker/，生成物不入库（Root Holds Only Tool Entry Points）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-26 |
| 变更类型 | structure-change |
| 触发来源 | 口头：用户问为什么有代码文件放在仓库根目录 |
| 基线 | ARCH-001 |
| 影响章节 | §7 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：根目录混有三类文件。第一类是工具按固定位置查找的入口（`package.json`、`pnpm-lock.yaml`、
  `pnpm-workspace.yaml`、`tsconfig.json`、`next.config.ts`、`compose.yaml`、`.nvmrc`），挪走就要给每条命令
  加参数；第二类是可以归位的构建定义（`Dockerfile`、`.dockerignore`），`docker/` 目录已存在却只放了脚本；
  第三类是工具生成物：`next-env.d.ts` 由 `next dev` / `next build` 每次重写却被提交，`tsconfig.tsbuildinfo`
  （`tsc` 增量缓存）虽被忽略，仍落在根目录。
- 不动的代价：根目录没有可陈述的规则，新文件无从判断该放哪里；生成物入库会随 Next.js 升级产生无意义的 diff。
- 为什么现在：用户检查目录结构时提出；此时 Docker 文件刚改过一轮，引用点少（2 处文档、1 处注释）。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 沿用 create-next-app 模板的约定：`next-env.d.ts` 与 `*.tsbuildinfo` 不入库；配合 BuildKit 的 Dockerfile 同名忽略文件（`docker/Dockerfile.dockerignore`）把 Docker 文件归入 `docker/` | npm:create-next-app | 16.3 | MIT | 2026-09-22 | active | 1 个模块（src/core，仅注释） | 低：沿用上游约定，不加依赖 | adopt | - |
| 只把 Dockerfile 挪进 `docker/`，`.dockerignore` 留在根目录 | github:moby/buildkit | 0.33 | Apache-2.0 | 2026-09-02 | active | 1 个模块（src/core，仅注释） | 中：构建定义与它的忽略规则分处两地，改一处容易漏另一处 | reject | 维护成本：Dockerfile 与忽略规则分处两个目录，同一次构建的输入要到两处核对 |
| 保持现状，只在 README 解释各文件为什么在根目录 | self | - | - | - | - | 0 个模块 | 中：生成物继续入库，每次升级 Next.js 都可能带出无关 diff | reject | 维护成本：`next-env.d.ts` 由 Next.js 每次 dev / build 按当前版本重写（现引用 `.next/types/routes.d.ts`），入库即随升级产生无关 diff |

> **结论**：沿用上游约定 —— 根目录只留工具按约定查找的入口；Docker 构建定义连同忽略规则归入 `docker/`；生成物不入库、缓存写进 `.next/cache`。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `Dockerfile` | move | 挪到 `docker/Dockerfile` | no |
| `docker/Dockerfile` | add | 由根目录挪入，内容不变；构建上下文仍是仓库根 | no |
| `.dockerignore` | move | 挪到 `docker/Dockerfile.dockerignore` | no |
| `docker/Dockerfile.dockerignore` | add | BuildKit 按 Dockerfile 同名查找的忽略文件；`tsconfig.tsbuildinfo` 一行改为 `*.tsbuildinfo` | no |
| `compose.yaml` | modify | `build: .` 改为 `context: .` + `dockerfile: docker/Dockerfile`；`docker compose up -d --build` 用法不变 | no |
| `next-env.d.ts` | remove | 取消跟踪；本地文件仍由 Next.js 生成 | no |
| `.gitignore` | modify | 增加 `next-env.d.ts` | no |
| `tsconfig.json` | modify | 增加 `tsBuildInfoFile: .next/cache/tsc.tsbuildinfo`，增量缓存不再落在根目录 | no |
| `src/core/command-hint.ts` | modify | 注释里的 `Dockerfile` 路径 | no |
| `docs/deploy-docker.md` | modify | 版本钉定处的文件路径 | no |
| `README.md` | modify | 目录结构说明 | no |
| `docs/architecture/architecture.md` | modify | §7 目录结构补充根目录规则 | no |

**不动的东西**：

- `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`tsconfig.json`、`next.config.ts`、`compose.yaml`、`.nvmrc`
  的位置：pnpm、tsc / tsx / 编辑器、Next.js、docker compose、nvm 只在项目根查找它们。
- 镜像内容、卷、容器名与 `docker compose up -d --build` / `docker exec …` 等用户命令。
- `.ip-compliance/reports/` 下已出具的审查报告与补充说明：它们记录审查时的状态，不随目录调整改写。

## 兼容与回归

**兼容策略**：直接替换 —— 只挪文件位置与忽略规则，没有外部调用方引用这些路径；用户命令不变，回归覆盖构建与容器启动。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | b45f349 | |
| `pnpm test` | node:test 单元测试（90 项） | pass | pass | b45f349 | |
| `pnpm build` | Next.js 看板生产构建；构建后根目录不应出现 `tsconfig.tsbuildinfo` | pass | pass | b45f349 | |
| `PELICAN_PORT=3100 docker compose up -d --build` | 按新路径构建镜像并替换容器；忽略规则生效（`data/` 不进构建上下文） | pass | pass | b45f349 | |
| `sleep 30 && curl -fsS -o /dev/null http://127.0.0.1:3100/ && docker exec llm-iq-dashboard ls /app/data/pelican.config.yaml` | 容器启动后看板可访问、数据卷仍挂载 | pass | pass | b45f349 | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、变量注入、强度折叠 | skip | skip | b45f349 | 冒烟调用 codex，按约定不消耗其额度；本单只挪文件位置、不触及调用链，调用链由第 4、5 行的容器构建与启动覆盖 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | Docker 构建定义归入 `docker/`：挪 `Dockerfile` 与忽略文件，改 `compose.yaml` 与文档、注释引用；重建容器 | revert 本 commit |
| 2 | 生成物不入库：取消跟踪 `next-env.d.ts`、加进 `.gitignore`；`tsconfig.json` 设 `tsBuildInfoFile` | revert 本 commit |
| 3 | 回填 `architecture.md` §7 与 README 目录结构，本单改 done | revert 本 commit |

## 回滚方案

- 触发条件：`docker compose build` 找不到 Dockerfile 或构建上下文带进 `data/`；`pnpm lint` / `pnpm build` 因类型声明缺失失败。
- 步骤：按步 revert 对应 commit，三步互不依赖，可单独回退。
- 数据：无需迁移；卷与 `data/` 不受影响。

## 人工确认

### 方案摘要

1. 要动什么：`Dockerfile`、`.dockerignore` 挪进 `docker/`；`next-env.d.ts` 不再入库；tsc 缓存改写到 `.next/cache`。涉及 1 个模块（src/core，仅注释）
2. 不动什么：pnpm、TypeScript、Next.js、docker compose 的入口文件仍在根目录；镜像内容与所有用户命令不变
3. 为什么现在：用户检查目录结构时提出；Docker 文件刚调整过，引用点只有 3 处
4. 风险与回滚：最坏是容器构建找不到文件或忽略规则失效；三步各一个 commit，单独 revert
5. 成本：3 步，约半小时；不加依赖

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-26 | xumetide-dev | approved | 按方案三步实施 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §7 | 目录树补 `docker/` 的职责，增加根目录规则：只放工具按约定查找的入口，生成物不入库 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-004 | 已回填 |
| ADR（/adr-curator） | 不适用：文件位置可随时挪回，非难逆转 | 不适用 |
