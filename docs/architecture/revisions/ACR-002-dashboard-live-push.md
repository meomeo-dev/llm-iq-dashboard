# ACR-002: 看板状态改为 SSE 推送（Push Dashboard State Over SSE）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-25 |
| 变更类型 | add-dependency |
| 触发来源 | 口头：点击“开始”后顶部栏执行状态不变；要求前后端状态改为 SSE 或 WebSocket 推送，不要轮询 |
| 基线 | ARCH-001 |
| 影响章节 | §0 §1 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 取代 ACR-001 |

## 动机

- 现状：看板的服务端状态由三个客户端组件各自轮询：执行状态（`/api/progress`，5 秒 / 30 秒）、
  自动任务开关（`/api/auto-run`，60 秒）、跑一次面板（打开时取）。三处各写一套定时器，互不共享；
  “刚发起一轮”靠自定义 `window` 事件通知。
- 不动的代价：同一类竞态缺陷出现两次：发起后首次取数赶在进度文件之前，胶囊要等 30 秒；插队取数与
  在途请求并存，生成一条不停止的重复轮询链。轮询间隔也决定了状态最多滞后 5 到 60 秒。
- 为什么现在：仓库所有者要求状态改为推送、不用轮询；ACR-001 的 SWR 方案仍是轮询，已否决。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| SSE：better-sse（服务端）+ chokidar（监听 data/）+ 浏览器原生 EventSource | npm:better-sse | 0.16.1 | MIT | 2025-12-29 | slow | 2 个模块（src/app、src/core） | 中：better-sse 官方支持 Next.js 的 Fetch API 路由，自带广播频道与保活；chokidar 5.0.0（MIT，2025-11-25，slow，1 个传递依赖）监听文件；两者都只在一个服务端模块里使用，可替换 | adopt | - |
| WebSocket：next-ws | npm:next-ws | 2.2.16 | MIT | 2026-09-24 | active | 2 个模块 + package.json 的 prepare 脚本 | 高：每次安装都要改写 node_modules 里的 Next.js，升级 Next 必须等它适配 | reject | 维护成本：靠改写 Next.js 安装产物实现，与框架升级强耦合；状态只需服务端单向推送，用不到双向通道 |
| WebSocket：ws / socket.io + 自定义服务器 | npm:ws | 8.21.3 | MIT | 2026-08-07 | active | 2 个模块 + 启动方式 | 高：须以自定义服务器取代 `next start` / `next dev` | reject | 改造面：要换掉看板的启动与运行方式，属部署细节之外的结构变化；状态只需单向推送 |
| SWR 轮询（ACR-001） | npm:swr | 2.5.1 | MIT | 2026-08-12 | active | 1 个模块（src/app） | 低 | reject | 维护成本：仍是定时轮询，不满足“不要轮询”的要求 |
| SSE 自研（ReadableStream + fs.watch） | self | - | - | - | - | 2 个模块（src/app、src/core） | 中：保活、断线清理、广播扇出、Linux 下递归监听的差异都要自己维护 | reject | 维护成本：广播、保活与跨平台文件监听已有成熟开源实现 |

> **结论**：SSE（better-sse + chokidar + 原生 EventSource）。服务端监听 `data/` 的文件变化，
> 推送最新的执行进度与自动任务状态；浏览器一条长连接接收，断线由 EventSource 自动重连并先收到全量快照。
> 发起执行、拨动开关等命令仍走原有 HTTP 接口。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| package.json | modify | dependencies 增加 better-sse ^0.16、chokidar ^5 | no |
| pnpm-lock.yaml | modify | 锁定两项依赖及 chokidar 的 1 个传递依赖 | no |
| src/core/progress.ts | modify | 新增 `listProgressViews()`：最近几轮进度 + 执行进程是否存活（从 /api/progress 路由挪入） | no |
| src/core/auto-run.ts | modify | 新增 `describeAutoRun()` 与 `AutoRunView` 类型（从 /api/auto-run 路由挪入） | no |
| src/app/api/progress/route.ts | modify | 改调 `listProgressViews()`，响应不变 | no |
| src/app/api/auto-run/route.ts | modify | 改调 `describeAutoRun()`，响应不变 | no |
| src/app/api/events/route.ts | add | SSE 端点：连上即推全量快照，之后按变化推送 `progress` 与 `auto-run` 两类事件 | no |
| src/app/api/events/live-hub.ts | add | 进程内单例：chokidar 监听 `data/`，去抖后重算快照、有变化才经 better-sse 频道广播；有未结束轮次时每 5 秒在服务端复核执行进程是否存活；到下一次 cron 触发点时重算自动任务状态 | no |
| test/app/api/live-hub-watch.test.ts | add | 监听范围单测：只放行运行态文件、较新轮次与 progress.json | no |
| src/app/components/live-state/live-store.ts | add | 浏览器端单例：一条 EventSource，`useSyncExternalStore` 供组件订阅进度与自动任务状态 | no |
| src/app/components/run-status/useRunProgress.ts | modify | 改读 live-store，删除定时轮询；完成数变化时 `router.refresh()` 保留 | no |
| src/app/components/run-control/AutoRunToggle.tsx | modify | 改读 live-store，删除 60 秒轮询；拨动仍走 `PUT /api/auto-run` | no |
| src/app/components/run-control/RunOnceMenu.tsx | modify | 是否有轮次在跑改读 live-store；可选范围仍在打开面板时取一次 | no |
| src/app/components/run-control/run-events.ts | remove | 自定义 `window` 事件由服务端推送取代 | no |

**不动的东西**：

- 现有 `/api` 路由的路径、请求与响应结构；`GET /api/progress`、`GET /api/auto-run` 保留供脚本与排查使用。
- 执行、调度与写进度的代码（`src/core/runner.ts`、`src/core/scheduler.ts`、`src/bin`、`src/adapters`、`src/capabilities`）。
- `data/runs/{runId}/progress.json`、`run.json`、`auto-run.json`、`scheduler.json` 的格式。
- 页面数据（时间线卡片）仍由服务端组件渲染，完成数变化时 `router.refresh()`。
- 配置页（`src/app/config/`）的取数与保存方式。

## 兼容与回归

**兼容策略**：并行运行 + 开关。第 1 步只加 SSE 端点，旧的轮询照常工作，可先用 curl 验证推送；
第 2 步前端切到推送，旧 GET 接口保留，回滚只需 revert 前端那一步。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | a2048fc | |
| `pnpm test` | node:test 单元测试（40 项） | pass | pass | a2048fc | 变更后 45 项（新增监听范围单测 5 项） |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | a2048fc | 在 rsync 出的工作区副本中以 `next build` 执行，避免覆盖运行中 dev server 的 .next；首页 First Load JS 变更前后均为 119 kB |
| `curl -fsS http://localhost:3000/api/progress` | 旧进度接口仍可用 | pass | pass | a2048fc | 需看板在运行 |
| `curl -sN --max-time 3 -o /tmp/pelican-sse.txt http://localhost:3000/api/events; grep -q "event:progress" /tmp/pelican-sse.txt` | SSE 端点连上即推送进度快照 | fail | pass | a2048fc | 变更前端点不存在 |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、候选集抽取、强度折叠 | skip | skip | a2048fc | 冒烟调用 codex，按约定不消耗其额度；本变更不触及执行链路，由看板上 claude 与 agy 的实际轮次覆盖 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 加 better-sse、chokidar；视图函数挪入 src/core；新增 `/api/events` 与 live-hub。前端不动，旧轮询照常；curl 验证推送 | revert 本 commit |
| 2 | 新增 live-store；执行状态、自动任务开关、跑一次面板改读推送，删除轮询与 run-events.ts；浏览器核对胶囊、开关与跨进程（调度器）状态变化 | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；或看板状态不再更新、SSE 连接反复断开。
- 步骤：先 revert 第 2 步恢复前端轮询（旧接口一直在）；仍有问题再 revert 第 1 步并 `pnpm install`。
- 数据：无需迁移，不涉及任何落盘格式。

## 人工确认

### 方案摘要

1. 要动什么：看板状态由轮询改为 SSE 推送；服务端监听 data/ 变化后广播，浏览器一条 EventSource 接收；涉及 2 个模块（src/app、src/core）。
2. 不动什么：现有 /api 接口与响应、执行与调度代码、所有落盘格式、配置页、时间线的服务端渲染。
3. 为什么现在：要求“不要轮询”；现有三处轮询已出两次竞态缺陷，状态最多滞后 5 到 60 秒。
4. 风险与回滚：最坏情况是状态不更新或连接反复断开；先 revert 前端一步即回到轮询，最多 revert 2 个 commit，无数据迁移。
5. 成本：2 步、约 1 天；新增 2 个依赖（better-sse、chokidar，均 MIT、维护状态 slow），各只在一个服务端模块使用。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-25 | 仓库所有者 | approved | 批准实施并按步提交；本会话之前的未提交工作先分批提交 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §0 | 技术选型总览增加 better-sse、chokidar；前端状态改为推送 | 已回填 |
| architecture.md §1 | 看板与服务端的状态同步：SSE 推送（`/api/events`），命令走 HTTP | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-002 | 已回填 |
| ADR（/adr-curator） | 不适用：非难逆转，旧接口保留，回滚仅 revert 两个 commit | 已回填 |
