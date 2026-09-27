# 开发

目录职责、运行产物、HTTP 接口、扩展新的 CLI 与运行测试。

## 目录结构

```
config/          起步配置模板、冒烟配置与价格目录锁文件；本机配置 pelican.config.yaml 不入库
docs/            基准来源考证、设计要点、Docker 部署与架构记录
docker/          镜像定义、构建忽略规则与容器入口、CLI 安装脚本（编排见根目录 compose.yaml）
src/core/        领域逻辑：配置与写回、提示词与变量、编排、调度、存储、SVG 提取
src/capabilities/ CLI 能力探测与多源合并、安装与登录预检
src/adapters/    每家 CLI 一个适配器，实现统一的 AgentAdapter 契约
src/pricing/     用量解析与按价格目录折算成本
src/bin/         命令行入口：run-once、scheduler、runner（分容器时的执行器）、pair、preflight、onboard 与 pricing-sync
src/app/         Next.js 看板（/）与配置界面（/config）
test/            单元测试，目录与 src/ 同构
data/runs/       运行产物（已 gitignore）
data/pricing/    价格目录附件缓存（已 gitignore，由 pnpm pricing:sync 下载）
```

根目录只放 pnpm、TypeScript、Next.js、docker compose 按固定位置查找的入口文件；
`next-env.d.ts` 由 Next.js 生成，不入库。

## 运行产物

产物是纯文件，可以直接用编辑器打开、用 git 比对、用 rsync 搬走：

```
data/runs/<runId>/run.json          一次调度的全部元信息（进行中逐次更新，inProgress 标记）
data/runs/<runId>/progress.json     逐调用的执行状态：排队 / 执行中 / 已完成、执行进程 pid
data/runs/<runId>/<targetId>.svg    提取出的作品
data/runs/<runId>/<targetId>.txt    CLI 原始事件流与 stderr，失败时的唯一线索
data/runs/<runId>/cancel.json       停止请求（点“停止本轮”时写入）
data/auto-run.json                  自动任务开关（不存在即关闭）
data/scheduler.json                 常驻调度器的 pid 与启动时刻
```

`runId` 由 UTC 时刻派生（`20260922T113920Z`），字典序即时间序，列目录即得到倒序历史。
按天载入与过期清理都直接从 `runId` 取时刻，不必读 `run.json`。

## 接口

| 接口 | 说明 |
| --- | --- |
| `GET /api/runs?limit=20` | 看板数据的只读接口 |
| `GET /api/events` | SSE：连上先推全量快照，之后在执行进度或自动任务状态变化时推送 |
| `GET /api/progress` | 最近 3 轮的逐调用执行进度，附执行进程是否存活 |
| `GET /view/<runId>/<svgFile>` | 单件作品的单独查看页：作品按窗口放大，附元信息与提示词 |
| `GET /art/<runId>/<svgFile>` | 模型写出的原始 SVG，带 CSP `sandbox` 响应头：脚本不执行、外链不加载 |
| `GET` / `PUT /api/config` | 读取配置；按补丁写回（校验不过返回 400，文件不动） |
| `GET` / `POST /api/capabilities` | 读取能力缓存；重新探测 CLI |
| `GET /api/run` | 单次执行的可选范围（目标、题目及默认勾选）与正在执行的轮次 |
| `POST /api/run` | 发起一轮，进度文件写好后返回 202；请求体 `{ targetIds, promptIds }` 可省略（省略即按配置跑整轮）；已有一轮在跑时返回 409 |
| `POST /api/run/cancel` | 请求停止正在执行的一轮，请求体 `{ runId }`；写下停止请求即返回 202，该轮不在执行中时返回 409 |
| `GET` / `POST /api/readiness` | 读取 CLI 安装与登录状态的缓存；重新检查 |
| `GET` / `PUT /api/auto-run` | 自动任务开关状态、调度器 pid 与下一次触发；`{ enabled }` 拨开关，打开时按需拉起调度器 |

## 新增一家 CLI

1. 在 `src/adapters/` 下实现 `AgentAdapter` 契约：`openSession()` 返回会话，`ask()` 返回回答正文、
   写出的文件、原始记录与失败原因；
2. 在 `src/adapters/index.ts` 的注册表里补一行；
3. 在 `src/core/types.ts` 的 `CLI_KINDS` 中加入新种类；
4. 在 `src/capabilities/` 下实现能力探针并加入 `catalog.ts` 的探针列表。

编排逻辑与看板都不需要改动。

## 测试

```bash
pnpm test
```

用 Node 内置的 `node:test` 运行器，经已有的 `tsx` 执行 `test/**/*.test.ts`。测试不启动
看板、不调用三家 CLI、不读本机 `data/`；涉及文件系统的用例在临时目录里进行。`tsx` 只转译
不做类型检查，`test/` 已纳入 `tsconfig.json`，由 `pnpm lint` 一并检查。

当前覆盖的约束：`classic-v1` 逐字不变、SVG 提取、强度折叠、四层超时优先级、`runId` 与
时区分日、考场规则三份一致、过期清理、SVG 净化、用量解析与成本折算、CLI 就绪预检的
判定，以及预算的预测与放行。模型画得好不好属于观测数据，不进 `pnpm test`；调用链是否
还通，用冒烟配置手动验证：

```bash
PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once
```

SVG 净化依赖浏览器的 `DOMParser`，测试里由 jsdom 提供（见 `test/support/dom.ts`）。
测试层只有这一个额外依赖：

| 项 | 说明 |
| --- | --- |
| 用途 | 在 Node 中为 `svg-sanitize.ts` 提供 `DOMParser` 与 `document.importNode` |
| 理由 | 净化的正确性取决于 XML/SVG 解析保真度；jsdom 走命名空间感知的解析器，近两年无安全公告 |
| 替代方案 | happy-dom：DOMParser 解析 SVG、`importNode` 有未关闭的偏差，近两年有多起高危公告；Vitest 5 / Jest 30：为现有纯逻辑用例引入整套工具链，收益不抵依赖量 |
| 版本 | 锁在 29.x：30.x 要求 Node ≥ 22.22.2；jsdom 29 不带类型，`test/types/jsdom.d.ts` 声明所用的最小接口 |
| 退出条件 | Node 升到 ≥ 22.22.2 后改用 jsdom 30 + `@types/jsdom`，删除本地声明；组件测试超过约 5 个、需要稳定的模块 mock 或覆盖率门禁时，整体迁到 Vitest，只保留一个运行器 |
