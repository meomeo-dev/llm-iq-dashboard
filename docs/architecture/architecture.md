# LLM IQ Dashboard 架构设计（Architecture）

| 项 | 内容 |
|---|---|
| 选型依据 | ARCH-001（accepted） |
| 最近回填 | 2026-09-29 |

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
| [ACR-007](revisions/ACR-007-owner-pairing-auth.md) | 2026-09-27 | 所有者配对登录，公开视角只读 | §1 §2 §6 |
| [ACR-008](revisions/ACR-008-split-web-runner.md) | 2026-09-27 | 看板与执行器分容器，凭据只在执行器 | §2 §8 |
| [ACR-009](revisions/ACR-009-public-data-repo-showcase.md) | 2026-09-27 | 运行结果脱敏同步到公开数据仓，只读展台读远程数据 | §4 §6 §8 |
| [ACR-010](revisions/ACR-010-web-data-repo-panel.md) | 2026-09-27 | 配置页数据仓面板：状态聚合、预演 / 导出 / 确认 / 推送经请求通道交给执行器 | §2 §4 §6 |
| [ACR-011](revisions/ACR-011-data-repo-push-token.md) | 2026-09-27 | 网页授权 GitHub App，执行器持仅限数据仓的用户令牌完成推送 | §6 §8 |
| [ACR-012](revisions/ACR-012-publish-lifecycle-and-calendar.md) | 2026-09-27 | 台账 skipped 状态与修剪分级，中断轮次启动收尾，展台日历拉取上界 | §4 |
| [ACR-013](revisions/ACR-013-codex-profile-config-model.md) | 2026-09-29 | codex 多 profile 的配置模型与目标标识；运行时另见 ACR-014 | §3 §5 |
| [ACR-014](revisions/ACR-014-codex-profile-runtime.md) | 2026-09-29 | 每个 codex profile 一个 app-server 进程与临时 home，profile 间并行 | §3 §5 §6 |
| [ACR-015](revisions/ACR-015-run-once-profiles.md) | 2026-09-29 | 跑一次：开始前多选上游，服务端按组合 × 上游展开本轮目标 | §1 §3 §5 |
| [ACR-016](revisions/ACR-016-profile-compare-view.md) | 2026-09-29 | 看板的上游对比视图与信息卡：格子计数与色点、上游 × 强度矩阵、大图页同轮切换、上游筛选 | §1 §3 |
| [ACR-017](revisions/ACR-017-modal-gif-export.md) | 2026-09-29 | 结果集弹窗导出 PNG / SVG / GIF：合成图纯函数、时刻烘焙取帧、modern-gif 编码 | §0 §1 |
| [ACR-018](revisions/ACR-018-data-repo-profile-publish.md) | 2026-09-30 | 数据仓发布 profile 结果（记录带八字段公开视图）、题目白名单、面板按轮次勾选导出 | §4 §6 §8 |
| [ACR-019](revisions/ACR-019-judge-scoring.md) | 2026-09-30 | 动态鹈鹕车代码层评审：静态解析 + 无头 Chromium 渲染量测，卡片贴智商在线 / 降智标签，引入 playwright-core | §3 §4 §7 |
| [ACR-020](revisions/ACR-020-judge-ai-layer.md) | 2026-09-30 | 评审 AI 语义层：适配器评审模式，轮次定稿后裁判 CLI 看联系图打 C5–C8；代码层权重降到 30 分 | §3 §4 §7 |
| [ACR-021](revisions/ACR-021-judge-ai-locate.md) | 2026-10-01 | 裁判先看首帧定位四类部位的取景框，程序按框重切细节表再打分；几何推断只作兜底 | §3 §4 |

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
| GIF 编码 | modern-gif | 2.1 | MIT | 浏览器端把结果集的逐帧画布编成 GIF，编码在 Web Worker 里进行（ACR-017） |
| SVG 解析 | jsdom | 29.1 | MIT | 评审静态层在 Node 里解析 SVG 与样式；单测里也为 SVG 净化提供 DOM（ACR-019） |
| 无头浏览器 | playwright-core | 1.63 | Apache-2.0 | 评审渲染层定格动画、量位置、截联系图；浏览器二进制运行时下载，不入仓库（ACR-019） |
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
  是否存活；分容器部署时看不到对方的 pid，改按执行器心跳判断（ACR-008）。
- 看板分公开与所有者两个视角（ACR-007）：没有设备 cookie 的请求只能读结果；配置、发起与停止
  执行、自动任务开关要求配对过的设备。
- 手动执行与定时执行互斥：看板与调度器都先查进度文件里有无存活的未结束轮次。
- “跑一次”的范围是组合（`cli · model · effort`）× 题目 × 上游：范围里有支持上游的 CLI 且可用
  上游不止一个时，开始前在二级模态里勾选上游；服务端把组合 × 上游展开成本轮目标，矩阵没有的
  按组合合成，合成目标只存在于本轮、不写回配置（ACR-015）。
- 多上游结果的呈现（ACR-016）：首页行仍按 `cli · model × 题目`，同一角有多个上游时取登录态
  （否则配置顺序第一个）作缩略图并标 `×N`；点格子打开的弹窗在多上游时改为列 = 上游、行 = 强度
  的矩阵，列标题与大图页标题上的上游名可点开信息卡；大图页可用左右键切同一轮同组合的其余上游；
  筛选加"上游"维度（登录态记为 `default`）；进度面板的分道按上游分组。只有登录态时一切与引入
  上游之前相同。
- 结果集弹窗可整图导出 PNG / SVG / GIF（ACR-017）：合成图是纯函数生成的 SVG，标题、卡片框、
  文字与作品一并画进不透明底色，横向滚动看不到的列也在图里；GIF 的帧不靠实时录制，而是把时刻
  烘进作品副本（SMIL `begin` 减 t、CSS 动画负延时并暂停）逐帧解码后画进作品框，标签页不可见时
  也正确。作品源码走与看板相同的净化。
- 两种轮次读同一份配置、同一时机：都在发起时读。调度器每个触发点重读配置按最新的定时目标与
  题目开轮，节奏（cron / 间隔 / 时区）每 30 秒核对一次、变了即重建定时器，不必重启。
  `schedule` 只定节奏，到点是否执行只看 `auto-run.json`。
- 变量与候选轮换的状态（`variable-state.json`）是定时序列的账本：手动轮次在“每轮一换”下只预览
  下一格、不落盘，定时序列的覆盖顺序不受插队影响。
- 停止一轮（`POST /api/run/cancel`）同样只经文件：看板写 `data/runs/{runId}/cancel.json`，执行
  这一轮的进程（看板或调度器）每秒检查一次，接住后不再发起排队中的调用、按超时的同一路径终止
  执行中的调用，整轮以 `cancelledAt` 结束。

## 2. 端与进程

| 端 | 形态 | 入口 | 面向谁 | 模块 |
|---|---|---|---|---|
| dashboard | web | `pnpm dashboard:prod`（生产，:3000）/ `pnpm dev --port 3001`（开发） | 看板读者、配置维护者 | timeline, run-status, run-control, config-editor, art-viewer, export |
| scheduler | worker | `pnpm scheduler`（`src/bin/scheduler.ts`） | 无人值守 | schedule, auto-run-switch, orchestration, retention |
| run-once | cli | `pnpm run:once`（`src/bin/run-once.ts`） | 仓库所有者 | orchestration |
| runner | worker | `pnpm runner`（`src/bin/runner.ts`），分容器部署时代替 scheduler | 无人值守 | schedule, requests, orchestration, sync, github-auth |
| pair | cli | `pnpm pair`（`src/bin/pair.ts`） | 仓库所有者 | auth |

各端都是 TypeScript：看板为 Next.js 15 + React 19；其余为 Node 22 + tsx，与看板共用 `src/core`。
看板分两个视角（ACR-007）：公开只读结果；配对过的浏览器是所有者，可配置、跑一次与开关自动任务。
分容器部署时看板不在进程内执行调用（`PELICAN_RUNNER=external`），把请求写成 `data/requests/`
下的文件交给 runner（ACR-008）。数据仓动作（预演 / 导出 / 确认发布 / 推送）、CLI 就绪检查与
GitHub 授权的令牌交换同样经请求文件交给 runner，看板只持有动作互斥锁与结果（ACR-010、ACR-011）。

## 3. 领域模块与硬约束

- `src/adapters`：每家 CLI 一个适配器，实现同一契约；codex 使用长驻 `codex app-server`。
- `src/capabilities`：探测各 CLI 的模型与强度，结果缓存在 `data/capabilities.json`；
  每轮开始前预检各 CLI 是否已安装、已登录，只拦确定的问题：没装拦这家的全部调用，
  没登录只拦登录态调用，经 profile 的调用用 API key 鉴权照常发起。
- 目标身份是 `cli × profile × model × effort`，profile 缺省为该 CLI 的登录态（`default`），
  不进目标 id；非默认 profile 是配置里登记的第三方上游，id 追加一段（ACR-013）。首期只有
  codex 允许登记 profile。
- 每个非默认 profile 一个独立的 `codex app-server` 进程（ACR-014）：临时目录同时作
  `CODEX_HOME` 与 `HOME`，内有生成的 `config.toml`（唯一 provider 指向该上游、`env_key` 读
  key），key 只进该进程环境，会话结束删除目录。会话池与分道按 `cli × profile` 分开，
  profile 组间并行、组内按模型分道；停用、未登记或缺 key 的 profile 调用记 error 不发起，
  不回落到登录态。
- `RunSelection.profiles`（ACR-015）：`default` 表示登录态；每个上游须已登记、启用、CLI 支持上游，
  且组合的模型在其模型清单里（清单为空不限）；不支持上游的 CLI 只跑登录态一次。不带该字段时
  `targetIds` 即目标 id，与引入上游之前相同。
- 页面数据只下发上游的公开视图 `ProfileView`（名字、显示名、CLI、类型、分组、官网、倍率、启用；
  ACR-016）：接口地址、查询参数、key 状态与模型清单不进页面，信息卡因此也不可能显示它们。
  倍率只用于信息卡里的折算显示，卡片与统计仍按官价。
- `src/core`：编排（提示词 × 目标，按 profile × 模型分道并发、道内串行）、强度折叠“不越级加码”、
  提示词登记（Simon Willison 原文与四大名著候选集，均不可编辑）、轮换状态、存储与进度、
  按历史成本预测并逐次放行的预算上限。
- 失败分类：`ok` / `no-svg` / `error` / `timeout` 分开记录。
- 作品评审（ACR-019）：有评分标准的题目（首期 `animated-pelican-v1`）在 `ok` 落盘后由 `src/core/judge`
  按题目口径打分，结果只写独立的评审记录，不改 `Attempt`。代码层分静态解析（jsdom：XML 合法、
  有动画、自包含三道闸门，车轮轴心、曲柄、循环、腿部同步四条标准）与渲染量测（playwright-core
  驱动无头 Chromium：一个周期取 8 帧，判在动、不出画布，量轮心漂移、循环闭合与脚是否踩在脚踏上——
  首帧脚踏点随曲柄刚体搬到各帧后应始终贴在腿上——与静态分取低）；联系图分帧序表（一行 8 帧整幅）
  与按类别（鹈鹕整体、头与喙、脚踏与脚、座垫与臀、左右轮）各一张的细节表，同帧号、同取样时刻，
  帧间留灰色间隔，`judge.json` 的 `contactSheet` 就是给 AI 层的图件清单；
  闸门任一不过判「降智」，关键标准 C8、C9 任一低于 6 分即不计那一项并判「降智」，总分 ≥ 78 判「智商在线」（及格线与门槛不升 rubric 版本，旧记录展示时按当前规则重定结论），AI 层标准未判前为「待复核」。浏览器不可用时只出
  静态分；评审缺省关闭，`judge.enabled: true` 开启（ACR-020 把缺省从开改为关）。
- AI 语义层（ACR-020）：代码层 C1–C4 只占 30 分，C5–C9（自行车结构、主体是鹈鹕、坐姿与脚位、
  踩踏可信、翅膀扶住车把）共 70 分由裁判 CLI 判，因此没有 AI 层的作品只能是「待复核」或「降智」。轮次记录定稿后
  `src/core/judge/ai-round` 处理本轮通过全部闸门的「待复核」作品（作品之间并行，`judge.ai.concurrency`
  是每个裁判同时评的件数、缺省 5、不同裁判各算各的槽位，同一轮共用一个会话池）：取 `judge.ai.judges` 里第一个
  厂商与作品不同的裁判，把联系图复制进临时目录，以适配器「评审模式」先只给帧序表要盲描述、再给
  首帧整幅画面（640px）要鹈鹕整体、头与喙、座垫与臀、脚踏与脚、翅与车把五类部位的像素框，程序经根元素的
  屏幕矩阵换算到 viewBox 后重切 8 帧细节表（`details[].locatedBy = ai`，定位失败沿用代码层几何推断
  的表，ACR-021）、最后给全部联系图与题目要 C5–C9 的 JSON 分（解析失败重试一次）；盲描述没认出
  鹈鹕则 C6 上限减半。
  转录存 `<attemptKey>.judge-ai.txt`，任一步失败记录保持「待复核」。评审队列写在本轮 `progress.json`
  的 `judging` 段（逐件排队 / 评审中 / 结论），随 SSE 推送：状态胶囊显示「评审中 k/n」，面板列出每件，
  卡片与作品页在队列里时显示「待评审 / 评审中…」，出分后触发整页刷新。评审进程中途退出时队列停在半途，
  看板按进程存活把排队 / 评审中的作品显示为「评审中断」；下一个执行进程（`pnpm runner` / `pnpm scheduler`）
  启动时经 `recoverInterruptedRuns` 找出这些轮次，由 `ai-round.resumeInterruptedJudging` 在后台接手：
  pid 换成新进程、已落盘结论的直接标结论、AI 层已关闭的标未评、其余重新请裁判，队列最终总会收尾。裁判全部问答的 token 用量从转录
  解析后记在 `judges[]` 的 AI 那条（`usage`、`asks`），成本与作品同口径按价格目录在读取时折算
  （`DashboardCard.judgeCost`），卡片悬停、作品页标题行与评审抽屉都显示。历史作品不自动补评；
  `pnpm judge:backfill -- --ai` / `--ai-only` 仅在人工明确要求时按轮运行。
- CLI 调用不给模型任何工具（ACR-006）：claude `--tools ""`，codex `untrusted` 审批且适配器一律拒绝，
  agy 仅 `--sandbox`。评审模式（ACR-020）是唯一例外：`AgentRequest.review` 声明工作目录里可读的
  联系图文件，claude 改 `--tools Read`，codex 改 `never` 审批（只读沙箱内读取放行、写盘仍拦），
  agy 不变；仍不给写盘与执行命令。
- 宿主机上限高于配置（ACR-006）：`PELICAN_CEILING_*` 定预算上限，`extraArgs` 默认不放行。

## 4. 数据与存储

- 纯文件存储，根目录由 `PELICAN_DATA_DIR` 覆盖，默认 `data/`。
- `runs/{runId}/`：`run.json`（结果证据）、`progress.json`（逐调用状态与执行进程 pid；开 AI 层时
  另有 `judging` 段记评审队列，ACR-020）、
  每次调用的 `.svg` 与原始事件流 `.txt`；有评审的调用另有 `<attemptKey>.judge.json`（评审记录，
  结构见 `docs/research/judge/judge.schema.json`）、`<attemptKey>.sheet.png`（帧序联系表）与
  `<attemptKey>.sheet.<kind>.png`（各类细节联系表），随轮次目录一起保留与删除；
  看板经 `/sheet/<runId>/<file>` 读联系图（ACR-019）。经 AI 层评审的作品另有
  `<attemptKey>.judge-ai.txt`（裁判三次问答的转录：盲描述、定位、打分，ACR-020 / ACR-021）。联系图与转录不进数据仓；评审记录
  去掉这两样后内嵌进公开 `run.json` 的对应调用（`PublicAttempt.judge`，可选字段、不升契约版本），
  只读展台因此与本地看板显示同样的标签与逐项分，只是抽屉里没有联系图（ACR-020）。`runId` 由 UTC 时刻派生，字典序即时间序。
  看板首页只读 `run.json`；`.svg` 由浏览器按需经 `/art` 读取，单件作品页由服务端直接读取。
  `cancel.json` 是停止请求，只写不删；被停下的轮次在 `run.json` 与 `progress.json` 里带
  `cancelledAt`，被取消的调用不进 `attempts`；因预算上限没有发起的调用同样不进
  `attempts`，第一次的原因记为 `budgetStop`。
- 运行态：`auto-run.json`（自动任务开关，不存在即关闭）、`scheduler.json`（调度器 pid）、
  `variable-state.json`（候选集与变量的轮换状态）、`capabilities.json`。
- JSON 一律写临时文件后原子替换；保留期由 `retention.days` 控制，修剪按台账分级：过期且
  `published`、`skipped/unpublishable-prompt`、`skipped/empty` 删除；`skipped/rejected` 永不自动删；
  缺 `run.json` 的残轮超过保留期两倍记 `skipped/abandoned` 后删除；其余未发布轮次保留（ACR-009、ACR-012）。
- 执行进程启动时先收尾上次没跑完的轮次：有 `run.json` 的按已停止收尾（保留已完成调用）并自动导出，
  只有 `progress.json` 的空目录删除（ACR-012）。
- 公开数据仓 `meomeo-dev/llm-iq-data`：`pnpm sync:data` 把已结束轮次脱敏导出为
  `runs/YYYY/MM/DD/<runId>/`（UTC 分区，只追加），不含原始转录；布局契约是
  `src/core/data-repo/contract.ts`。台账 `sync-state.json` 记 exported / published / skipped（原因
  `unpublishable-prompt` / `rejected` / `abandoned` / `empty`），推送并确认远端包含后才为 published；
  一次调用都没完成的轮次不导出。仅供本地测试的题目永不发布（见仓库根 `AGENTS.md`）。
  只读展台的日历只拉取最近 62 天的日索引，更早按清单计数（ACR-012）。
- 记录里的上游（ACR-018）：非登录态调用带 `profile` 名，记录顶层 `profiles` 是这些 profile 的
  公开视图（名字、显示名、CLI、上游类型、分组、倍率、启停，按导出时配置快照，只含本轮用到的；
  官网不发布，展台不为第三方上游导流）；
  导出时配置里已不存在的 profile 其调用扣下不发布。契约只增可选字段、不升版本号：只有登录态的记录
  与引入前逐字相同，旧展台照常读。只读展台没有配置，上游的显示名与倍率从已读记录里汇总。
- 发布什么由两层选择决定（ACR-018）：`dataRepo.publishPrompts` 题目白名单（缺省全部，不在清单里的
  题目连同调用剔除，剩空整轮跳过）；配置页数据仓面板列出待导出轮次逐个勾选，展开一轮可预览每次调用
  的作品并只勾其中一部分，导出、演练与推送只带勾选的轮次与调用。部分导出的子集记入同步台账，
  之后再评估这一轮沿用同一子集，数据仓里的记录保持幂等。数据仓只追加，一轮导出后不再补发当时
  扣下的题目、上游或未勾的调用。
- 不要的轮次在面板上丢弃：台账记为 `skipped/discarded`，不再列入待导出，任何同步（含不带清单的
  整批同步与自动导出）都不导出它；可在"已丢弃"里恢复。本地目录过了保留期按不发布轮次删除。

## 5. 配置与运行参数

- `config/pelican.config.yaml`：调度节奏、提示词、并发、超时、轮换周期、成本上限、上游类型
  清单 `upstreamTypes`、第三方上游 `profiles`（名字、CLI、上游类型、分组、官网、接口地址、模型、
  倍率与手填单价、启停；API key 不在配置里）、被测目标（`targets[].profile` 缺省为登录态）、
  同时在跑的 profile 数上限 `run.profileConcurrency`（缺省 5，登录态也算一个）；“跑一次”的范围、
  题目与上游勾选只记在浏览器本地存储，不进配置；
  `PELICAN_CONFIG` 覆盖路径。本机配置不入库，不存在时由同目录的
  `pelican.example.yaml`（起步模板）生成。配置页写回时在 YAML 语法树上改值，保留注释，
  先校验后替换。作品评审 `judge`（缺省关闭）：代码层开关、AI 层开关、裁判清单
  `judge.ai.judges[]`（`cli × model × effort`，须与被评作品厂商不同）与单次问答超时，配置页
  「作品评审」区块可改（ACR-020）。
- `config/pricing-catalog.lock.json`：价格目录 Release 的 tag 与附件 sha256。
- `config/smoke.config.yaml`：端到端冒烟配置。

## 6. 安全边界

- 模型产物不可信：SVG 经净化后展示，`/art` 路由以 CSP 沙箱返回原图。
- 每次调用一个空的临时工作目录，避免 CLI 读到仓库里的 `CLAUDE.md` / `AGENTS.md`。
- 每轮以凭据文件的滑窗 HMAC 指纹比对模型输出，命中即拦截且作品与转录不落盘（ACR-006）；
  指纹同时覆盖全部已登记 profile 的 API key，运行阶段与同步阶段同一口径（ACR-014、ACR-018）。
- profile 的 API key 只存在 `PELICAN_SECRETS_DIR` 下（目录 700 / 文件 600），运行时只交给该
  profile 的子进程环境；发布到数据仓的记录只带 profile 的七字段公开视图，官网、接口地址、查询参数与
  key 状态不进任何公开面，数据仓 CI 对多余字段拒收（ACR-018）。
- 写操作与配置类读取只对配对设备开放：凭据只以服务端密钥的 HMAC 落盘，写请求另需
  `X-Pelican-Action` 头，每个写操作追加审计日志（ACR-007）。
- 看板默认只监听本机；公网暴露的分层方案见 `docs/security/public-exposure-design.md`。
- 发布前对 run.json 与 SVG 做泄漏规则与凭据指纹双重扫描，命中的作品不发布；数据仓 CI 再校验一次。
- `PELICAN_READONLY=1` 在服务端强制只读：不承认会话、写接口 403、配对 404、不拉起调度器（ACR-009）。
- 数据仓推送凭据是所有者在浏览器里注册并安装的 GitHub App 用户令牌（仅授权数据仓一个仓库），
  只存在 runner 专用卷 `runner-secrets`（目录 700 / 文件 600），经 `GIT_ASKPASS` 只在推送时交给 git；
  web 容器不挂该卷、不持有任何凭据。推送前面板列出将公开的提交由所有者确认（ACR-010、ACR-011）。

## 7. 目录结构

**仓库形态**：单应用（Next.js + pnpm，单包）。三个端共用 `src/core` 的类型与读盘逻辑，一人维护。

```
llm_iq_dashboard/
├── src/
│   ├── app/            ← 看板页面与 /api 路由；components/ 按功能分目录
│   ├── bin/            ← scheduler、run-once 入口
│   ├── core/           ← 领域逻辑；judge/ 为作品评审（静态解析、渲染量测、AI 裁判、记录读写）
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
- 部署形态 Docker（ACR-008）：两个容器共用一个镜像——web 只跑看板、开端口、只挂 `data/`；
  runner 装三家 CLI、挂登录态卷、不开端口，常驻调度器并消费看板的请求文件。端口只绑定
  127.0.0.1；见 `docs/deploy-docker.md`。看板看不见 runner 的 pid，按 runner 心跳
  （`data/runner.json`，15 秒一次、45 秒过期）加登记的 pid 判断某轮的执行进程是否还在；
  本机直跑仍按 pid 加启动标记（Linux 的 /proc starttime）认定。
- 看板以生产模式手动启动（`pnpm dashboard:prod`）：在同级 worktree `../<仓库名>-deploy` 按已提交的
  HEAD 构建并 `next start`，`PELICAN_DATA_DIR`、`PELICAN_CONFIG` 指回本仓库；仓库根的 `.next` 留给
  `next dev`。不做开机常驻。
- 调度器可手动 `pnpm scheduler` 启动，也可由看板在打开自动任务时拉起（脱离的子进程，日志写
  `data/scheduler.log`）；同一时刻只允许一个调度器。
- 部署形态只读展台（ACR-009）：`PELICAN_DATA_SOURCE=remote` 从公开数据仓读清单、日索引与
  run.json，作品由服务端 `/art` 代理；只展示、不运行评测，适合 serverless 托管（如 Vercel）。
  `pnpm showcase:smoke` 端到端自检，`/api/health` 报告数据仓连通性；见
  `docs/deploy-public-showcase.md`。
- Docker 部署的数据仓同步：叠加 `compose.data-repo.yaml` 把宿主机数据仓挂入 runner；`autoSync`
  开启时轮次结束后 runner 自动导出并本地提交，关闭时在配置页数据仓面板勾选轮次后导出（ACR-018）；
  推送在面板确认后由 runner 用 GitHub App 令牌完成（ACR-010、ACR-011）；未连接 GitHub 时仍可在
  宿主机推送并以 `--confirm-published` 回填发布状态。
- K8s：no。单机单用户的两个进程。复议条件：需要多人共用一套部署，或常驻进程增加到 5 个以上。

## 9. 待确认事项

| # | 事项 | 状态 | 来源 |
|---|---|---|---|
| 1 | 前端各组件各自轮询、无共享缓存 | 已实施（ACR-002），端到端冒烟通过后关闭 | ARCH-001 |
| 2 | croner 维护状态为 slow，本地 9.x，上游已到 10.x | 待确认 | ARCH-001 |
