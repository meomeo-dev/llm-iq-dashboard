# 开发

> [English](development.md) | **简体中文**

目录职责、运行产物、HTTP 接口、扩展新的 CLI 与运行测试。

## 目录结构

```
config/          起步配置模板、冒烟配置、价格目录锁文件、长度门与密钥扫描策略；本机配置 pelican.config.yaml 不入库
docs/            基准来源考证、设计要点、部署、数据同步与架构记录（对外文档按 .md 英文主版与 .zh-CN.md 简体中文版成对互链）
docker/          镜像定义、构建忽略规则与容器入口、CLI 安装脚本（编排见根目录 compose.yaml）
scripts/         生产看板启动、长度门、密钥扫描、评审补跑、展台冒烟与本地 issue 脚本
src/core/        领域逻辑：配置与写回、提示词与变量、编排、调度、存储、SVG 提取、跨作业互斥（active-work.ts）
src/core/prompt/bank/ 内置题库，题面、逐题标准与英文展示数据按题组存放
src/core/prompt/i18n/ 题库展示层本地化与英文数据索引
src/core/judge/  作品评审：静态解析、渲染量测、AI 裁判与评审记录读写
src/core/model-fingerprint/ 模型指纹（ACR-024）：面向对象探针体系（probes/）、以 2 为底 JSD 相似度、无重叠自检、四态判决、并发安全样本存储与增量采集
src/core/sync/   数据仓同步：脱敏导出、台账、发布确认与本地副本核对
src/core/data-repo/ 数据仓布局与记录格式的契约
src/core/data-source/ 看板读数的数据源抽象：本地 data/ 与远程数据仓
src/core/auth/、github-auth/ 所有者配对与设备凭据；GitHub App 授权与推送令牌
src/capabilities/ CLI 能力探测与多源合并、安装与登录预检
src/adapters/    每家 CLI 一个适配器，实现统一的 AgentAdapter 契约
src/pricing/     用量解析与按价格目录折算成本
src/i18n/        中英双语（en / zh-CN）国际化：类型契约（types.ts）、服务端与客户端语言协商及 React Context（context.tsx）、
                 词条字典（messages/）与评审标准 G1–G5 / C1–C9 及确定性证据展示层本地化（judge-rubric.ts、judge-evidence-en.ts）
src/bin/         命令行入口：run-once、scheduler、runner（分容器时的执行器，含 runner-sync.ts）、model-fingerprint、pair、preflight、onboard、
                 pricing-sync、sync-data 与 validate-prompts
src/app/         Next.js 看板（/）、模型指纹控制台（/fingerprint）、配置界面（/config）、单件查看（/view）、配对（/pair）、
                 原图（/art）与评审联系图（/sheet）
src/types/       无官方类型的依赖的最小声明（jsdom）
test/            单元测试，目录与 src/ 同构
data/runs/       运行产物（已 gitignore）
data/model-fingerprint/ 模型指纹样本集、归档、核验记录与作业状态（已 gitignore，绝不同步至公开数据仓）
data/pricing/    价格目录附件缓存（已 gitignore，由 pnpm pricing:sync 下载）
```

按题组查找并维护题目。四大名著位于
[`literature/`](../src/core/prompt/bank/literature/)，每回的静态与动态题面
同卷存放，对应英文展示数据也位于同一部名著目录。
在[题库入口](../src/core/prompt/bank/index.ts)的在用或归档清单登记题目。
归档时移动登记条目，历史记录仍可按原 ID 解析。完成编辑后运行 `pnpm validate:prompts`。

根目录只放 pnpm、TypeScript、Next.js、docker compose、lefthook 按固定位置查找的入口文件，以及
`README.md`（英文主版）/ `README.zh-CN.md`（简体中文版）、`AGENTS.md`、`CHANGELOG.md`、`handoff.md` 与许可证文件；对外说明文档遵循 `.md`（English primary）⇄ `.zh-CN.md`（Simplified Chinese）双语成对互链约定；`next-env.d.ts` 由 Next.js 生成，不入库。

## 运行产物

产物是纯文件，可以直接用编辑器打开、用 git 比对、用 rsync 搬走：

```
data/runs/<runId>/run.json          一次调度的全部元信息（进行中逐次更新，inProgress 标记）
data/runs/<runId>/progress.json     逐调用的执行状态：排队 / 执行中 / 已完成、执行进程 pid；judging 段为 AI 层评审队列
data/runs/<runId>/<attemptKey>.svg  提取出的作品；attemptKey 为 <targetId>__<promptId>
data/runs/<runId>/<attemptKey>.txt  CLI 原始事件流与 stderr，失败时的唯一线索
data/runs/<runId>/cancel.json       停止请求（点“停止本轮”时写入）
data/runs/<runId>/<attemptKey>.judge.json     评审记录（有评分标准的题目，ACR-019 / ACR-020）
data/runs/<runId>/<attemptKey>.sheet.png      帧序联系表；.sheet.<kind>.png 各类细节联系表
data/runs/<runId>/<attemptKey>.judge-ai.txt   AI 层裁判三次问答（盲描述、定位、打分）的转录
data/scratch/<runId>/<attemptKey>/  每次调用的空工作目录，整轮结束后删除
data/scratch/model-fingerprint/     模型指纹调用复用的固定空工作目录（保持 Prompt Cache 前缀命中，孤儿清理跳过）
data/model-fingerprint/samples/<cli>-<effort>/<model>/<probe>.json  基准样本集（逐次追加原始回答与元数据，读取时实时提取）
data/model-fingerprint/archive/<cli>-<effort>/<model>/<probe>.<timestamp>.json  --reset 归档的样本集快照（供 rescore 回退）
data/model-fingerprint/checks/<yyyy-mm>/<checkId>.json  单次模型指纹核验记录与离线重算历史 rescores[]
data/model-fingerprint/jobs/<jobId>.json、.cancel.json  运行中指纹作业的心跳进度与取消标记
data/requests/                      分容器时看板交给执行器的请求文件
data/auto-run.json                  自动任务开关（不存在即关闭）
data/scheduler.json                 常驻调度器的 pid 与启动时刻；日志追加到 data/scheduler.log
data/runner.json                    分容器时执行器的心跳（15 秒一次）
data/variable-state.json            候选集当前周期的取值与洗牌顺序
data/capabilities.json              CLI 能力探测缓存
data/readiness.json                 CLI 安装与登录状态缓存
data/sync-state.json                数据仓同步台账
data/data-repo-last-action.json     数据仓面板最近一次动作的结果
data/profile-credentials.json       各 profile 是否已填 key（不含 key 本身）
data/devices.json、server.key       已配对设备与签发设备凭据的服务端密钥
data/audit.log                      写操作的审计日志
```

`runId` 由 UTC 时刻派生（`20260922T113920Z`），字典序即时间序，列目录即得到倒序历史。
按天载入与过期清理都直接从 `runId` 取时刻，不必读 `run.json`。

## 接口

写接口只对配对设备（所有者）开放，请求须带 `X-Pelican-Action: 1` 头；只读部署下写接口一律 403。

| 接口 | 说明 |
| --- | --- |
| `GET /api/health` | 部署模式、远程数据仓连通性（仅 remote 模式）与版本号；公开、无副作用 |
| `POST /api/pair` | 以 `pnpm pair` 打印的配对码配对设备，成功即写设备凭据 cookie；每个 IP 10 分钟内最多 5 次 |
| `GET` / `DELETE /api/session` | 是否所有者及设备列表；退出当前设备 |
| `DELETE /api/devices/<id>` | 吊销设备，吊销自己等同退出 |
| `GET /api/runs?limit=20` | 看板数据的只读接口 |
| `GET /api/events` | SSE：连上先推全量快照，之后在执行进度、自动任务或指纹作业（`fingerprint-job`）状态变化时推送 |
| `GET /api/progress` | 最近 3 轮的逐调用执行进度，附执行进程是否存活 |
| `GET /view/<runId>/<svgFile>` | 单件作品的单独查看页：作品按窗口放大，附元信息与提示词 |
| `GET /art/<runId>/<svgFile>` | 模型写出的原始 SVG，带 CSP `sandbox` 响应头：脚本不执行、外链不加载 |
| `GET /sheet/<runId>/<file>` | 评审联系图（帧序表或某类细节表）的 PNG |
| `GET` / `PUT /api/config` | 读取配置；按补丁写回（校验不过返回 400，文件不动） |
| `GET` / `POST /api/capabilities` | 读取能力缓存；重新探测 CLI |
| `GET /api/run` | 单次执行的可选范围（目标、题目及默认勾选）与正在执行的轮次 |
| `POST /api/run` | 发起一轮，进度文件写好后返回 202；请求体 `{ targetIds, promptIds, profiles }` 可省略（省略即按配置跑整轮，`profiles` 为本轮要跑的上游）；已有一轮或指纹作业在跑时返回 409，每台设备每小时超限返回 429，分容器时执行器未响应返回 503 |
| `POST /api/run/cancel` | 请求停止正在执行的一轮，请求体 `{ runId }`；写下停止请求即返回 202，该轮不在执行中时返回 409 |
| `GET /api/fingerprint` | 所有者专属（`requireOwner`；只读/远程模式下 403）：模型指纹矩阵汇总、最近核验记录、自检摘要与活动作业；传 `?sampleDetail=<cli>:<model>:<probe>`（或 `?cli&model&probe`）时返回该单元单条样本详情与留一相似度；传 `?checkId=<checkId>` 时返回单条核验记录详情 |
| `POST /api/fingerprint` | 所有者写接口（`requireOwnerAction`）：`plan`（预检预览）、`fill`（补齐/重置样本集）、`check`（发起模型核验）、`self-test`（运行交叉验证自检）、`rescore`（离线重算历史核验记录）、`cancel`（停止运行中指纹作业）；与评测轮次或另一指纹作业冲突时 409 |
| `PATCH /api/fingerprint/samples` | 所有者写接口（`requireOwnerAction`）：按 `{ cli, model, probe, exclude?, include?, reset? }` 剔除/恢复样本 `reqId` 或归档重置单个 `(cli, model, probe)` 样本集 |
| `GET` / `POST /api/readiness` | 读取 CLI 安装与登录状态的缓存；重新检查 |
| `GET` / `PUT /api/auto-run` | 自动任务开关状态、调度器 pid 与下一次触发；`{ enabled }` 拨开关，打开时按需拉起调度器 |
| `GET /api/data-repo` | 数据仓面板的聚合状态（工作副本、上游差距、待同步轮次）；不 fetch 远端 |
| `POST /api/data-repo/sync` | 数据仓动作：演练、导出、发布确认、推送、丢弃与恢复；动作并发或推送确认的提交不一致时 409 |
| `GET /api/data-repo/github/connect` | 发起 GitHub App 创建，或已有应用时跳转安装 |
| `GET /api/data-repo/github/app-created`、`/callback` | GitHub App 创建与安装授权后的回跳，换取并保存令牌后重定向回 `/config` |
| `POST /api/data-repo/github/disconnect` | 断开 GitHub 连接并清除本地凭据 |
| `GET` / `PUT` / `DELETE /api/profiles/credential` | 非默认 profile 的 API key：查询是否已填、写入、删除 |
| `POST /api/profiles/models` | 从 profile 的上游拉取模型清单，不改配置；分容器时经请求文件交给执行器代拉 |

## 新增一家 CLI

1. 在 `src/adapters/` 下实现 `AgentAdapter` 契约：`openSession()` 返回会话，`ask()` 返回回答正文、
   写出的文件、原始记录与失败原因；
2. 在 `src/adapters/index.ts` 的注册表里补一行；
3. 在 `src/core/types.ts` 的 `CLI_KINDS` 中加入新种类；
4. 在 `src/capabilities/` 下实现能力探针并加入 `catalog.ts` 的探针列表。

编排逻辑与看板都不需要改动。

## 测试

```bash
pnpm lint                                               # tsc --noEmit（含 test/）
pnpm test                                               # node:test 经 tsx 运行 test/**/*.test.ts
pnpm validate:prompts                                   # 题库与标准 schema 校验
pnpm check:length                                       # 文件与函数长度门禁（config/code-length-policy.yaml）
pnpm check:secrets                                      # 已跟踪文件密钥扫描（config/secret-scan-policy.yaml）
pnpm build                                              # Next.js 生产构建检查
pnpm showcase:smoke                                     # 只读展台端到端冒烟校验
pnpm fingerprint:status                                 # 本地模型指纹矩阵与缺口汇总（0 次 CLI 调用）
pnpm fingerprint:self-test                              # 离线配对交叉验证自检（0 次 CLI 调用）
pnpm fingerprint:fill -- --dry-run                      # 预览基准样本补采调用次数与估算费用
pnpm fingerprint:check -- --cli codex --model gpt-5.5 --dry-run
                                                        # 预览指定 profile 模型核验计划与自检一致率
```

用 Node 内置的 `node:test` 运行器，经已有的 `tsx` 执行 `test/**/*.test.ts`。测试不启动
看板、不调用三家 CLI、不读本机 `data/`；涉及文件系统的用例在临时目录里进行。`tsx` 只转译
不做类型检查，`test/` 已纳入 `tsconfig.json`，由 `pnpm lint` 一并检查。

当前覆盖的约束：`classic-v1` 逐字不变、SVG 提取、强度折叠、四层超时优先级、`runId` 与
时区分日、考场规则三份一致、过期清理、SVG 净化与挂载、用量解析与成本折算、CLI 就绪预检的
判定、预算的预测与放行；另覆盖作品评审的静态与渲染判定、模型指纹（`test/core/model-fingerprint/`：面向对象 `Probe` & `PromptCodec` 提取与校验、JSD 相似度、无重叠自检与四态判决、纯函数规划器、三家适配器指纹隔离模式、跨作业双向互斥、并发文件锁与归档重算、5 个 CLI 子命令与 Web API）、数据仓同步与台账、远程数据源、
配对鉴权与 GitHub 授权、调度排队、上游 profile、直出约束、导出合成图，以及中英双语国际化
（`test/i18n/locale.test.ts` 语言协商与持久化、`test/i18n/prompt-judge-i18n.test.ts` 提示词与评审标准展示层本地化及题面不变性、`test/i18n/i18n-integrity.test.ts` 词条完整性与双语文档链接校验）。模型画得好不好属于
观测数据，不进 `pnpm test`；调用链是否还通，用冒烟配置手动验证：

```bash
PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once
```

提交与推送前的门禁由 Git 钩子自动跑（lefthook，配置在仓库根 `lefthook.yml`，ACR-022）：
`pnpm install` 时装进 `.git/hooks`，同一仓的各 worktree 共用这一份；pre-commit 并行跑
`check:secrets`、`lint`、`check:length`（约 3 秒），pre-push 跑 `validate:prompts` 与 `test`（约
40 秒）。钩子没装上时 `pnpm lefthook install` 补装；确认是误报要先过时 `LEFTHOOK=0 git commit`
绕过一次，事后把假值登记进对应策略文件的白名单。

jsdom 是运行时依赖：作品评审的静态层在 Node 中用它解析 SVG 与样式；SVG 净化依赖浏览器的
`DOMParser`，测试里也由它提供（见 `test/support/dom.ts`）。

| 项 | 说明 |
| --- | --- |
| 用途 | 评审静态层解析 SVG 与样式；测试中为 `svg-sanitize.ts` 提供 `DOMParser` 与 `document.importNode` |
| 理由 | 净化的正确性取决于 XML/SVG 解析保真度；jsdom 走命名空间感知的解析器，近两年无安全公告 |
| 替代方案 | happy-dom：DOMParser 解析 SVG、`importNode` 有未关闭的偏差，近两年有多起高危公告；Vitest 5 / Jest 30：为现有纯逻辑用例引入整套工具链，收益不抵依赖量 |
| 版本 | 锁在 29.x：30.x 要求 Node ≥ 22.22.2；jsdom 29 不带类型，`src/types/jsdom.d.ts` 声明所用的最小接口 |
| 退出条件 | Node 升到 ≥ 22.22.2 后改用 jsdom 30 + `@types/jsdom`，删除本地声明；组件测试超过约 5 个、需要稳定的模块 mock 或覆盖率门禁时，整体迁到 Vitest，只保留一个运行器 |
