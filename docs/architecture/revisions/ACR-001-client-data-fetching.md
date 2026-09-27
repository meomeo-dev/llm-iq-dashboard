# ACR-001: 前端状态与取数改用 SWR（Client Data Fetching With SWR）

| 项 | 内容 |
|---|---|
| 状态 | rejected |
| 日期 | 2026-09-25 |
| 变更类型 | add-dependency |
| 触发来源 | 口头：点击“开始”后顶部栏执行状态不变，要求选型后改造 |
| 基线 | ARCH-001 |
| 影响章节 | §0 §1 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 被 ACR-002 取代 |

## 动机

- 现状：看板的服务端状态由三个客户端组件各自轮询：执行状态（`/api/progress`，5 秒 / 30 秒）、
  自动任务开关（`/api/auto-run`，60 秒）、跑一次面板（`/api/run`，打开时取）。三处各写一套
  `fetch`、错误处理与定时器，彼此不共享结果；“刚发起一轮”靠自定义 `window` 事件通知。
- 不动的代价：同一类竞态缺陷出现两次：发起后首次取数赶在进度文件之前，胶囊要等 30 秒；插队
  取数与在途请求并存，生成一条不停止的重复轮询链。两处都靠手写补丁（落盘后再返回 202、
  轮询代数计数）解决，新增取数组件还要重复一遍。
- 为什么现在：触发缺陷出在这三处的交界；在增加组件之前统一取数层成本最低。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| SWR | npm:swr | 2.5.1 | MIT | 2026-08-12 | active | 1 个模块（src/app） | 低：Vercel 维护，与 Next.js 同源；gzip 5.7 KB，2 个传递依赖 | adopt | - |
| TanStack Query | npm:@tanstack/react-query | 5.103.2 | MIT | 2026-09-21 | active | 1 个模块（src/app） | 中：须在 layout 挂 QueryClientProvider；gzip 13.8 KB，约为 SWR 的 2.4 倍 | reject | 维护成本：突变、分页、离线等能力本项目用不到，包体为 SWR 的 2.4 倍且多一层 Provider |
| WebSocket 推送 | npm:ws | 8.21.3 | MIT | 2026-08-07 | active | 2 个模块（src/app、src/core）+ 部署 | 高：App Router 路由不能升级 WebSocket，须以自定义服务器取代 `next start` | reject | 改造面：要换掉 `next start` 的运行方式，属部署形态变更，超出 ACR 范围 |
| SSE 推送（自研） | self | - | - | - | - | 2 个模块（src/app、src/core） | 高：进度文件由另一进程写，服务端仍要监听或轮询文件；dev 热重载下要管理长连接 | reject | 改造面：延迟从 5 秒降到 1 秒左右并非刚需，却要新增文件监听与连接管理 |
| 维持现状（自研 hooks） | self | - | - | - | - | 0 | 高：三处各自维护轮询、去重与错误处理，已出两次竞态缺陷 | reject | 维护成本：每新增一个取数组件都要再写一套定时器与去重 |

> **结论**：SWR。传输层保持 HTTP 轮询不变，只把三处手写轮询收敛到一个带共享缓存与请求去重的取数层；
> 发起执行后以 `mutate` 刷新进度，取代自定义事件。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| package.json | modify | dependencies 增加 swr ^2.5 | no |
| pnpm-lock.yaml | modify | 锁定 swr 及其 2 个传递依赖 | no |
| src/app/components/fetch-json.ts | add | 共享的 JSON 取数函数：非 2xx 时抛出带服务端错误信息的异常 | no |
| src/app/components/run-status/useRunProgress.ts | modify | 改用 `useSWR('/api/progress')`，按是否有轮次在跑动态取 5 秒 / 30 秒刷新间隔；完成数变化时 `router.refresh()` 的行为保留 | no |
| src/app/components/run-control/RunOnceMenu.tsx | modify | 可选范围改用 `useSWR`（面板打开时才取）；是否有轮次在跑改读 `/api/progress` 的共享缓存；发起后 `mutate('/api/progress')` | no |
| src/app/components/run-control/AutoRunToggle.tsx | modify | 改用 `useSWR('/api/auto-run')`，60 秒刷新；拨动后以返回值写回缓存 | no |
| src/app/components/run-control/run-events.ts | remove | 自定义 `window` 事件由 SWR 的 `mutate` 取代 | no |

**不动的东西**：

- 全部 `/api` 路由的路径、请求与响应结构（包括 `GET /api/run` 的 `activeRunId` 字段）。
- `src/core`、`src/adapters`、`src/capabilities`、`src/bin`：执行、调度与进度文件的写法。
- `data/runs/{runId}/progress.json` 与 `run.json` 的格式。
- 轮询节奏：执行中 5 秒、空闲 30 秒、自动任务开关 60 秒。
- 配置页（`src/app/config/`）的取数与保存方式。

## 兼容与回归

**兼容策略**：直接替换。改动只在三个客户端组件内部，没有外部调用方；接口与数据格式不变，
回归由类型检查、构建、单元测试与接口请求覆盖。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | - | | |
| `pnpm test` | node:test 单元测试（40 项） | pass | - | | |
| `pnpm build` | Next.js 看板生产构建 | pass | - | | 在 rsync 出的工作区副本中以 `next build` 执行，避免覆盖运行中 dev server 的 .next；变更前首页 First Load JS 119 kB |
| `curl -fsS http://localhost:3000/api/progress` | 看板进度接口可用 | pass | - | | 需看板在运行 |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、候选集抽取、强度折叠 | skip | - | | 真实消耗三家 CLI 额度，且本变更不触及执行链路；由人决定何时跑 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 加 swr 依赖与 `fetch-json.ts`；`useRunProgress` 改用 `useSWR`，其余组件不动 | revert 本 commit |
| 2 | `RunOnceMenu`、`AutoRunToggle` 改用 `useSWR` 与 `mutate`，删除 `run-events.ts`；跑回归并在浏览器核对胶囊、面板、开关 | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；或看板上执行状态、自动任务开关不再刷新。
- 步骤：按步倒序 revert 两个 commit，`pnpm install` 恢复锁文件。
- 数据：无需迁移，不涉及任何落盘格式。

## 人工确认

### 方案摘要

1. 要动什么：引入 SWR，把看板三处手写轮询收敛为共享缓存的取数层；涉及 1 个模块（src/app）。
2. 不动什么：/api 接口与响应结构、执行与调度代码、进度文件格式、轮询节奏、配置页。
3. 为什么现在：“点开始后状态不变”暴露出三处轮询互不共享、靠自定义事件通知的问题，已出两次竞态缺陷。
4. 风险与回滚：最坏情况是看板状态不刷新；回滚 = revert 2 个 commit，无数据迁移。
5. 成本：2 步、约半天；新增 1 个依赖（gzip 5.7 KB，Vercel 维护，MIT）。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-25 | 仓库所有者 | rejected | 要求前后端状态改为 SSE 或 WebSocket 推送，不要轮询；改由 ACR-002 推送方案取代 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §0 | 技术选型总览增加“前端状态与取数：SWR” | 待回填 |
| architecture.md §1 | 看板与服务端的状态同步方式：SWR 共享缓存 + HTTP 轮询 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-001 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转，回滚仅 revert 两个 commit | 待回填 |
