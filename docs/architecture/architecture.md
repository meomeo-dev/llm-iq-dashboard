# LLM IQ Dashboard 架构设计（Architecture）

| 项 | 内容 |
|---|---|
| 选型依据 | ARCH-001（accepted） |
| 最近回填 | 2026-09-26 |

### 变更记录

基线之上的每一次架构迭代都有一份变更单，见 [`revisions/`](revisions/)。本表只记已 `done`
并回填进本文的变更单。

| 变更单 | 日期 | 变更 | 影响章节 |
|---|---|---|---|
| [ACR-002](revisions/ACR-002-dashboard-live-push.md) | 2026-09-25 | 看板状态改为 SSE 推送 | §0 §1 |
| [ACR-003](revisions/ACR-003-dashboard-lazy-art.md) | 2026-09-25 | 看板作品按需加载，去掉定时整页刷新 | §1 §4 |
| [ACR-004](revisions/ACR-004-root-layout-tidy.md) | 2026-09-26 | 根目录只留工具约定入口，Docker 文件归入 docker/，生成物不入库 | §7 |
| [ACR-005](revisions/ACR-005-component-and-docs-layout.md) | 2026-09-26 | 界面文档路径改为英文，看板组件按职责归入子目录 | §7 |
| [ACR-006](revisions/ACR-006-model-guardrails.md) | 2026-09-26 | CLI 调用不给模型工具，宿主机上限与输出泄漏拦截 | §3 §6 |

## 0. 技术选型总览

依赖以 `package.json` 为准，本表只记架构级选择。

| 层 | 技术项 | 版本 | 许可证 | 定位 |
|---|---|---|---|---|
| Web 框架 | Next.js（App Router） | 15.5 | MIT | 看板页面与 `/api` 路由同一进程 |
| UI 库 | React | 19.3 | MIT | 服务端组件渲染时间线，客户端组件承载交互 |
| 前端状态 | React `useSyncExternalStore` + 原生 EventSource | — | MIT | 整页一条 SSE 连接，执行进度与自动任务状态共用一份浏览器端存储 |
| 服务端推送 | better-sse | 0.16 | MIT | `/api/events` 的 SSE 会话与频道广播 |
| 文件监听 | chokidar | 5.0 | MIT | 看板进程监听 `data/` 运行态文件，变化后推送 |
| 定时调度 | croner | 9.1 | MIT | 调度器进程内的 cron 触发，支持时区 |
| 配置读写 | yaml | 2.9 | ISC | 读写 `config/*.yaml`，写回保留注释 |
| TS 运行器 | tsx | 4.23 | MIT | 调度器、run-once 与单元测试免构建运行 |
| 语言 | TypeScript | 5.9 | Apache-2.0 | 全仓 |

## 1. 系统总体架构

两个长期进程加一个一次性入口，只通过 `data/` 下的文件交换状态：

```
浏览器 ──HTTP──▶ 看板进程（Next.js）──读写──▶ data/
                    │ 手动执行在进程内调用编排              ▲
                    └─ 按需拉起 ──▶ 调度器进程（tsx）──写──┘
                                     │
run-once（tsx）──写──▶ data/        └─ 调用 ──▶ claude / codex / agy CLI
```

- 浏览器与看板之间：页面由服务端组件渲染；执行状态、自动任务开关经 SSE（`GET /api/events`）
  推送：连上即推全量快照，之后只在内容变化时推送，断线由浏览器自动重连；发起执行、拨动开关、
  保存配置走 HTTP 请求。前端不轮询。
- 页面数据不携带 SVG 源码：卡片只带作品地址，浏览器在作品进入视口附近时经 `/art/{runId}/{file}`
  取源码、按地址缓存，在浏览器端净化后挂进 DOM。整页数据刷新只由推送的完成数变化触发，
  没有定时刷新（ACR-003）。
- 推送的来源：看板进程用 chokidar 监听 `auto-run.json`、`scheduler.json` 与最近几轮的
  `progress.json`，写入方是哪个进程都一样；执行进程被直接杀掉、下一次触发点到期这两种不落盘的
  变化，由看板进程内的计时器复核后推送。
- 执行进程与看板互不相识：执行方写 `data/runs/{runId}/progress.json`，看板按 pid 判断执行进程
  是否存活。
- 手动执行与定时执行互斥：看板与调度器都先查进度文件里有无存活的未结束轮次。
- 停止一轮（`POST /api/run/cancel`）同样只经文件：看板写 `data/runs/{runId}/cancel.json`，执行
  这一轮的进程（看板或调度器）每秒检查一次，接住后不再发起排队中的调用、按超时的同一路径终止
  执行中的调用，整轮以 `cancelledAt` 结束。

## 2. 端与进程

| 端 | 形态 | 入口 | 面向谁 | 模块 |
|---|---|---|---|---|
| dashboard | web | `pnpm dashboard:prod`（生产，:3000）/ `pnpm dev --port 3001`（开发） | 看板读者、配置维护者 | timeline, run-status, run-control, config-editor, art-viewer, export |
| scheduler | worker | `pnpm scheduler`（`src/bin/scheduler.ts`） | 无人值守 | schedule, auto-run-switch, orchestration, retention |
| run-once | cli | `pnpm run:once`（`src/bin/run-once.ts`） | 仓库所有者 | orchestration |

三个端都是 TypeScript：看板为 Next.js 15 + React 19；调度器与 run-once 为 Node 22 + tsx，
与看板共用 `src/core`。

## 3. 领域模块与硬约束

- `src/adapters`：每家 CLI 一个适配器，实现同一契约；codex 使用长驻 `codex app-server`。
- `src/capabilities`：探测各 CLI 的模型与强度，结果缓存在 `data/capabilities.json`；
  每轮开始前预检各 CLI 是否已安装、已登录，只拦确定的问题。
- `src/core`：编排（提示词 × 目标，按模型分道并发、道内串行）、强度折叠“不越级加码”、
  提示词登记（Simon Willison 原文与四大名著候选集，均不可编辑）、轮换状态、存储与进度、
  按历史成本预测并逐次放行的预算上限。
- 失败分类：`ok` / `no-svg` / `error` / `timeout` 分开记录。
- CLI 调用不给模型任何工具（ACR-006）：claude `--tools ""`，codex `untrusted` 审批且适配器一律拒绝，
  agy 仅 `--sandbox`。
- 宿主机上限高于配置（ACR-006）：`PELICAN_CEILING_*` 定预算上限，`extraArgs` 默认不放行。

## 4. 数据与存储

- 纯文件存储，根目录由 `PELICAN_DATA_DIR` 覆盖，默认 `data/`。
- `runs/{runId}/`：`run.json`（结果证据）、`progress.json`（逐调用状态与执行进程 pid）、
  每次调用的 `.svg` 与原始事件流 `.txt`。`runId` 由 UTC 时刻派生，字典序即时间序。
  看板首页只读 `run.json`；`.svg` 由浏览器按需经 `/art` 读取，单件作品页由服务端直接读取。
  `cancel.json` 是停止请求，只写不删；被停下的轮次在 `run.json` 与 `progress.json` 里带
  `cancelledAt`，被取消的调用不进 `attempts`；因预算上限没有发起的调用同样不进
  `attempts`，第一次的原因记为 `budgetStop`。
- 运行态：`auto-run.json`（自动任务开关，不存在即关闭）、`scheduler.json`（调度器 pid）、
  `variable-state.json`（候选集与变量的轮换状态）、`capabilities.json`。
- JSON 一律写临时文件后原子替换；保留期由 `retention.days` 控制。

## 5. 配置与运行参数

- `config/pelican.config.yaml`：调度节奏、提示词、并发、超时、轮换周期、成本上限、被测
  目标；`PELICAN_CONFIG` 覆盖路径。本机配置不入库，不存在时由同目录的
  `pelican.example.yaml`（起步模板）生成。配置页写回时在 YAML 语法树上改值，保留注释，
  先校验后替换。
- `config/pricing-catalog.lock.json`：价格目录 Release 的 tag 与附件 sha256。
- `config/smoke.config.yaml`：端到端冒烟配置。

## 6. 安全边界

- 模型产物不可信：SVG 经净化后展示，`/art` 路由以 CSP 沙箱返回原图。
- 每次调用一个空的临时工作目录，避免 CLI 读到仓库里的 `CLAUDE.md` / `AGENTS.md`。
- 每轮以凭据文件的滑窗 HMAC 指纹比对模型输出，命中即拦截且作品与转录不落盘（ACR-006）。
- 看板只监听本机，不对公网开放。

## 7. 目录结构

**仓库形态**：单应用（Next.js + pnpm，单包）。三个端共用 `src/core` 的类型与读盘逻辑，一人维护。

```
llm_iq_dashboard/
├── src/
│   ├── app/            ← 看板页面与 /api 路由；components/ 按功能分目录
│   ├── bin/            ← scheduler、run-once 入口
│   ├── core/           ← 领域逻辑
│   ├── adapters/       ← 三家 CLI 适配器
│   ├── capabilities/   ← 能力探测与就绪预检
│   └── pricing/        ← 用量解析与成本折算
├── config/             ← 调度策略与被测矩阵（YAML）
├── data/               ← 运行产物与运行态，不入库
├── test/               ← node:test 单元测试，与 src/ 同构
├── docs/               ← 出处、界面、部署、架构文档
├── docker/             ← 镜像定义与构建忽略规则、容器入口、CLI 安装脚本
├── issues/             ← 本地 issue
└── scripts/            ← 生产启动脚本（dashboard-prod）与本地 issue、治理脚本
```

- `src/app` 依赖 `src/core`，并读取 `src/capabilities` 的能力目录、就绪缓存与类型；
  不引用 `src/adapters`，调用 CLI 只经 `src/core` 的执行入口。客户端组件经 `/api` 取数，
  不直接读文件。
- `src/core` 不依赖 `src/app`；`src/adapters` 只被 `src/core` 调用。
- `src/app/components/` 根目录只放页面装配入口 `Dashboard.tsx`，其余按功能分目录：`card/`（结果卡片、
  作品框与 SVG 净化）、`toolbar/`（工具栏、筛选、月历）、`menu/`（共用下拉菜单）、`timeline/`、
  `run-control/`、`run-status/`、`model-modal/`、`export/`、`cli-status/`、`live-state/`。
- `data/` 是两个进程交换状态的唯一通道。
- 根目录只放工具按固定位置查找的入口：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`
  （pnpm），`tsconfig.json`（tsc、tsx 与编辑器），`next.config.ts`（Next.js），`compose.yaml`
  （docker compose），`.nvmrc`，以及 README、许可证与第三方声明。其余代码按职责放进子目录；
  工具生成物（`next-env.d.ts`、`*.tsbuildinfo`）不入库，tsc 增量缓存写在 `.next/cache`。

## 8. 部署与运行形态

- 部署形态 local：本机直跑看板与调度器；配置用到的 CLI 必须已安装在 `PATH` 上并已登录，
  `pnpm preflight` 自查，`pnpm onboard` 引导登录。
- 部署形态 Docker：单容器（看板、调度器与三家 CLI），登录态与 `data/` 放在命名卷，
  端口只绑定 127.0.0.1；见 `docs/deploy-docker.md`。看板启动时若自动任务开着而调度器
  不在，会拉起调度器。进程存活按 pid 加启动标记（Linux 的 /proc starttime）认定，
  容器重启后 pid 重新分配不会造成误判。
- 看板以生产模式手动启动（`pnpm dashboard:prod`）：在同级 worktree `../<仓库名>-deploy` 按已提交的
  HEAD 构建并 `next start`，`PELICAN_DATA_DIR`、`PELICAN_CONFIG` 指回本仓库；仓库根的 `.next` 留给
  `next dev`。不做开机常驻。
- 调度器可手动 `pnpm scheduler` 启动，也可由看板在打开自动任务时拉起（脱离的子进程，日志写
  `data/scheduler.log`）；同一时刻只允许一个调度器。
- K8s：no。单机单用户的两个进程。复议条件：需要多人共用一套部署，或常驻进程增加到 5 个以上。

## 9. 待确认事项

| # | 事项 | 状态 | 来源 |
|---|---|---|---|
| 1 | 前端各组件各自轮询、无共享缓存 | 已实施（ACR-002），端到端冒烟通过后关闭 | ARCH-001 |
| 2 | croner 维护状态为 slow，本地 9.x，上游已到 10.x | 待确认 | ARCH-001 |
