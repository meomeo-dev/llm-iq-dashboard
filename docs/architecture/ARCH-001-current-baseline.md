# ARCH-001: 现状基线补记（Current State Baseline）

| 项 | 内容 |
|---|---|
| 状态 | accepted |
| 日期 | 2026-09-25 |
| 需求来源 | 现状：23c3c53 已构建代码（基线补记），含 2026-09-25 工作区内的运行控制与候选集改动 |
| 项目规模 | prototype |
| 部署形态 | local |
| K8s | no |
| 取代 / 被取代 | 无 |
| 回填目标 | architecture.md §0 §2 §7 §8 |

## 输入与约束

- 用户与网络：仓库所有者一人，在本机浏览器访问 `http://localhost:3000`；不对公网开放。
- 团队与既有栈：单人维护，全栈 TypeScript（Node 22、pnpm 11）。
- 时限与预算：无服务器预算；运行成本是三家 agent CLI 的调用额度，每轮调用数 = 提示词条数 × 目标数。
- 合规 / 私有化：无合规要求；CLI 登录态与运行产物只留在本机。
- 实时性 / 有后果动作 / 多模态：每次执行都真实消耗额度，属有后果动作；看板进度允许秒级延迟，
  当前以 HTTP 轮询实现（执行中 5 秒、空闲 30 秒）。
- 外部前置条件：`claude`、`codex`、`agy` 三个 CLI 必须安装在运行机的 `PATH` 上并已登录。

## 端拆分

| 端 | 形态 | 面向谁 | 为什么单独一个端 | 模块 |
|---|---|---|---|---|
| dashboard | web | 看板读者、配置维护者 | 浏览器运行环境；按需启动，重启不打断正在执行的基准 | timeline, run-status, run-control, config-editor, art-viewer, export |
| scheduler | worker | 无人值守 | 常驻进程，到点触发有副作用的基准调用；崩溃不带走看板 | schedule, auto-run-switch, orchestration, retention |
| run-once | cli | 仓库所有者 | 手动补跑与排查的一次性入口，与调度器共用编排代码，退出码语义不同 | orchestration |

三个端共用 `src/core`、`src/adapters`、`src/capabilities`；看板的手动执行在 Next.js
进程内调用同一套编排代码。

### 模块组织

```
src/app/                      ← dashboard（Next.js App Router）
├── components/timeline/      ← 时间线、文件夹格子、时区
├── components/run-status/    ← 执行状态胶囊与分道进度面板（轮询 /api/progress）
├── components/run-control/   ← 跑一次、自动任务开关
├── components/export/        ← 时间线 PNG / SVG 导出
├── config/                   ← 配置页
├── view/ art/                ← 单张大图与 SVG 沙箱路由
└── api/                      ← runs / progress / run / auto-run / config / capabilities

src/bin/                      ← scheduler 与 run-once 的入口
src/core/                     ← 编排、调度、配置、提示词与候选集、存储、进度、保留期
src/adapters/                 ← claude / codex / agy 适配器
src/capabilities/             ← 各 CLI 的模型与强度探测
```

## 目录结构

**仓库形态**：单应用（Next.js + pnpm，单包）—— 三个端共用 `src/core` 的类型与读盘逻辑，
一人维护，没有独立发布节奏。

```
llm_iq_dashboard/
├── src/
│   ├── app/            ← 看板页面与 /api 路由
│   ├── bin/            ← scheduler、run-once 入口
│   ├── core/           ← 领域逻辑
│   ├── adapters/       ← 三家 CLI 适配器
│   └── capabilities/   ← 能力探测
├── config/             ← 调度策略与被测矩阵（YAML）
├── data/               ← 运行产物与运行态，不入库
├── test/               ← node:test 单元测试，与 src/ 同构
├── docs/               ← 出处、界面、架构文档
├── issues/             ← 本地 issue
└── scripts/            ← issue 与治理脚本
```

- `src/app`：只依赖 `src/core` 的类型与读盘函数；客户端组件经 `/api` 取数，不直接读文件。
- `src/core`：不依赖 `src/app`；是三个端共享的唯一领域层。
- `src/adapters`、`src/capabilities`：只被 `src/core` 调用，不认识看板。
- `config/`：人改的策略；看板配置页写回时保留注释。
- `data/`：`runs/{runId}/` 结果与进度、`auto-run.json` 开关、`scheduler.json` 调度器登记、
  `variable-state.json` 轮换状态；两个进程只通过这里交换状态。
- `test/`：`pnpm test` 以 `tsx --test` 执行，不引入测试框架依赖。
- `docs/`：`benchmark-provenance.md`、`ui/`、`architecture/`。

## 部署方式

| 候选 | 类型 | 免费额度 / 成本 | 硬限制 | 判定 |
|---|---|---|---|---|
| Vercel | paas-free | Hobby 免费 | 函数时限远短于一轮基准；无常驻调度进程；无法预装并登录三家 CLI | reject |
| 本机直跑 `pnpm dev` / `pnpm scheduler` | local | 零成本，占用本机 | 本机休眠或关机即停跑；单机单用户 | adopt |
| 本地 docker compose | local-docker | 零成本 | CLI 登录态要搬进容器，OAuth 登录流程难以在容器内完成 | reject |

> **结论**：local —— 三家 CLI 的登录态只存在于本机，使用者即运维者。

## K8s 判定

| 判据 | 本项目 |
|---|---|
| 长期运行的服务 ≥ 5 个且需独立伸缩 | 否，2 个进程 |
| 有 SLA 承诺，需多副本与滚动发布 | 否 |
| 多租户 / ≥3 套环境隔离 | 否 |
| 团队已有人在运维 K8s | 否 |
| 已有集群可复用 | 否 |
| 合规要求 GitOps 审计发布 | 否 |

> **结论**：no —— 单机单用户的两个进程，容器编排没有收益。

复议条件：需要多人共用一套部署，或常驻进程增加到 5 个以上时复议。

## 语言与框架

| 端 / 层 | 语言 | 框架 | TypeScript | 理由 |
|---|---|---|---|---|
| dashboard | TypeScript | Next.js 15（App Router）+ React 19 | yes | 页面与 /api 路由同一进程，服务端组件直接调用 `src/core` 读盘 |
| scheduler | TypeScript | Node 22 + tsx + croner | yes | 与看板共用 `src/core`，tsx 免构建直接运行 |
| run-once | TypeScript | Node 22 + tsx | yes | 与 scheduler 同一套编排代码 |

## 技术栈

| 层 | 技术项 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 成熟度 | 判定 | 替换成本 |
|---|---|---|---|---|---|---|---|---|---|
| Web 框架 | Next.js | npm:next | 15.5.25 | MIT | 2026-09-22 | active | Vercel 维护，React 官方推荐的全栈框架 | adopt | 换框架 = 重写 src/app |
| UI 库 | React | npm:react | 19.3.0 | MIT | 2026-09-09 | active | Meta 维护 | adopt | 随 Next.js 绑定 |
| 前端状态与取数 | React 内置 hooks + fetch 轮询 | - | - | MIT | 2026-09-09 | active | 随 React 发布；各组件各自轮询，无共享缓存 | adopt | 只动 src/app 的客户端组件 |
| 定时调度 | croner | npm:croner | 9.1.0 | MIT | 2026-02-01 | slow | 零依赖 cron 库，支持时区 | adopt | 只动 src/core/scheduler.ts |
| 配置读写 | yaml | npm:yaml | 2.9.1 | ISC | 2026-09-11 | active | 保留注释的 YAML 语法树读写 | adopt | 只动 src/core 的配置读写 |
| TS 运行器 | tsx | npm:tsx | 4.23.15 | MIT | 2026-09-20 | active | esbuild 驱动，免构建运行 TS | adopt | 改 package.json scripts |
| 语言 | TypeScript | npm:typescript | 5.9.3 | Apache-2.0 | 2026-07-08 | active | Microsoft 维护 | adopt | 全仓 |

## 被否决的方案

| 方案 | 否决理由 | 重新考虑的条件 |
|---|---|---|
| `codex exec` 调用 codex | 多个 codex 调用同时在跑时会卡死，改用长驻 `codex app-server` | 上游修复并发卡死并有回归验证时 |
| 数据库存储运行结果 | 结果要人工核查、git 比对、rsync 搬迁，纯文件更直观；`runId` 字典序即时间序 | 需要跨轮次聚合查询或多进程并发写冲突时 |
| 看板进程内运行定时调度 | 重启看板会打断正在进行的基准；调度器崩溃会带走看板 | 不再需要看板随时重启时 |

## 风险与待确认

| # | 事项 | 状态 | 影响章节 |
|---|---|---|---|
| 1 | 前端各组件各自轮询、无共享缓存，发起执行后状态胶囊出现过最长 30 秒的延迟 | 处理中（ACR-002） | 技术栈 |
| 2 | croner 维护状态为 slow（8 个月无发布），本地为 9.x，上游已到 10.x | 待确认 | 技术栈 |

## 回填清单

| 本文章节 | architecture.md 章节 | 状态 |
|---|---|---|
| 技术栈 | §0 技术选型总览 | 已回填 |
| 端拆分 / 语言与框架 | §2 端与进程 | 已回填 |
| 目录结构 | §7 目录结构 | 已回填 |
| 部署方式 / K8s 判定 | §8 部署与运行形态 | 已回填 |
