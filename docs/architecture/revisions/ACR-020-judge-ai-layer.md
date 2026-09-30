# ACR-020: AI 语义层评审与权重重配（AI judging layer and weight rebalance）

| 项 | 内容 |
|---|---|
| 状态 | implementing |
| 日期 | 2026-09-30 |
| 变更类型 | new-module |
| 触发来源 | 口头：代码层误判太严重却占 60 分，两幅脚不踩脚踏的作品也能拿 60 过线；AI 语义层至今未实现，作品永远停在「待复核」 |
| 基线 | ARCH-001 |
| 影响章节 | §3 §4 §7 |
| 改造面上限 | 7 个模块（src/core、src/adapters、src/app 三个源模块；test/core、test/app 与源模块同构；docker/Dockerfile 只加一个 apt 包与两个环境变量；数据仓校验器在另一仓库，不计） |
| 取代 / 被取代 | 无 |

本 ACR 是 ACR-019 预留的第二半：给适配器加「评审模式」，轮次定稿后在执行进程里串行请裁判 CLI
看联系图打 C5–C8，并把代码层权重从 60 分压到 30 分。

## 动机

- 现状：ACR-019 的代码层只量几何与时序（轮心、曲柄、循环、脚与脚踏的距离变化），读不出鹈鹕像不像、
  坐没坐稳；它在复杂作品上还会误判，却占 60 分，与 60 分及格线相等，于是代码层满分的作品不经任何
  语义核对就贴上「智商在线」。C5–C8 从未有人填分，44 幅本地作品全部停在「待复核」或「降智」。
- 不动的代价：看板标签不可信；`contactSheet` 图件清单与细节联系表做好了却没有读者。
- 为什么现在：用户复核两幅 60 分作品均为假阳（脚与脚踏不同步），并要求 AI 层做到最终状态。

## 方案评估

裁判本身就是本仓库已接入的三家 CLI（走各自登录态与配额，不另开 API 账号），要评估的是
「LLM 打分框架」值不值得引入。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| promptfoo：LLM 评测框架，含 llm-rubric 打分 | npm:promptfoo | 0.123.1 | MIT | 2026-09-18 | active | 2 个模块（src/core 接 provider，src/adapters 要包成 promptfoo provider） | 高：依赖树很大（自带 CLI、Web UI、数十家 provider）；打分走 API key 而非 CLI 登录态 | reject | 改造面：要把三家 CLI 再包一层 promptfoo provider，且它不认 CLI 登录态；本项目只需两句提示词与一次 JSON 解析 |
| autoevals：Braintrust 的 LLM-as-judge 评分器集合 | npm:autoevals | 0.3.0 | MIT | 2026-06-09 | active | 2 个模块 | 中：评分器绑定 OpenAI 兼容 API 客户端 | reject | 改造面：只支持 API 调用，联系图是本地文件、裁判是 CLI；能复用的只有「打分提示词模板」，而口径已由题目自带 |
| openai：官方 SDK 直调多模态 API 当裁判 | npm:openai | 7.25.0 | Apache-2.0 | 2026-09-29 | active | 1 个模块 | 中：另开 API 账号与计费 | reject | 维护成本：本项目所有调用走 CLI 登录态（ACR-006 考场约束、ACR-014 profile），另开 API 通道要再做一套凭据与预算 |
| 自研：适配器加评审模式，`src/core/judge/ai-*` 三个文件（提示词与解析、单件评审、轮后队列） | self | - | - | - | - | 2 个模块（src/core、src/adapters） | 低：约 300 行，全部单测覆盖，无新依赖 | adopt | - |

> **结论**：自研 —— 裁判就是已接入的 CLI，评审只是「两次提问 + 解析 JSON」，任何框架都要先把 CLI
> 再包一层；零新依赖。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/adapters/types.ts` | modify | `AgentRequest.review?: ReviewMode`：声明工作目录里可读的文件 | no |
| `src/adapters/claude.ts` | modify | 评审模式 `--tools Read`，否则仍 `--tools ""` | no |
| `src/adapters/codex.ts` | modify | 评审模式 `approvalPolicy: never`（只读沙箱内读取放行），否则仍 `untrusted` | no |
| `src/adapters/agy.ts` | modify | 注释：评审模式不改参数，工作目录内文件本就可读 | no |
| `src/core/judge/schema.ts` | modify | rubric 升 `version: 3`：C1 10 / C2 8 / C3 4 / C4 8（代码层 30），C5 15 / C6 15 / C7 20 / C8 20（AI 层 70）；历史记录须 `judge:backfill` 重算 | yes |
| `src/core/judge/ai-prompt.ts` | add | 盲描述与逐项判定的提示词、回答 JSON 解析、C6 盲描述核对 | no |
| `src/core/judge/ai-judge.ts` | add | 单件评审：挑裁判、准入、临时目录放联系图、两次提问、并分、落盘、转录存档 | no |
| `src/core/judge/ai-round.ts` | add | 轮后队列：本轮通过闸门的「待复核」作品串行评审 | no |
| `src/core/runner.ts` | modify | `finishRunRecord` 之后调用 `judgeRoundWithAi`，被停止的轮次不评 | no |
| `src/core/config/types.ts` | modify | `JudgeConfig` 增 `ai: { enabled, judges[], timeoutMs }` | no |
| `src/core/config/loader.ts` | modify | 解析与校验 `judge.ai`（缺省关闭；开启但无裁判报错）；`judge.enabled` 缺省改为关闭 | yes |
| `src/core/config-writer.ts` | modify | `ConfigPatch.judge`：配置页整段写回 | no |
| `src/core/data-repo/contract.ts` | modify | `PublicJudgement` 与 `PublicAttempt.judge?`：评审记录去掉联系图与转录引用后随调用发布；只增可选字段不升版本 | no |
| `src/core/sync/export-run.ts` | modify | 导出时读 `.judge.json` 内嵌进公开调用 | no |
| `src/core/data-source/remote.ts` | modify | 只读展台从公开记录取 `judge`，不再恒为 null | no |
| `src/core/judge/browser.ts` | modify | `PELICAN_BROWSER_NO_SANDBOX=1` 给容器内 chromium | no |
| `src/app/config/JudgePanel.tsx` | add | 配置页「作品评审」区块：两个开关、裁判清单、超时 | no |
| `src/app/config/ConfigEditor.tsx` | modify | 挂上作品评审区块 | no |
| `src/app/config/config-editor-model.ts` | modify | `EditableConfig.judge` 与提交体 | no |
| `src/app/config/config-nav-items.ts` | modify | 侧边导航增「作品评审」 | no |
| `src/app/config/page.tsx` | modify | 初始配置带 `judge` | no |
| `src/app/view/JudgeDrawer.tsx` | modify | 细节表清单缺失时按空处理（公开记录没有联系图） | no |
| `src/app/api/config/route.ts` | modify | GET 带 `judge` | no |
| `docker/Dockerfile` | modify | 装 chromium 与字体，设 `PELICAN_BROWSER_PATH` / `PELICAN_BROWSER_NO_SANDBOX` | no |
| `test/app/config/` | modify | 夹具补 `judge` | no |
| `test/core/sync/export-run.test.ts` | modify | 内嵌评审记录的导出用例 | no |
| `test/core/config-writer.test.ts` | modify | judge 段写回用例 | no |
| `scripts/judge-backfill.ts` | modify | `--ai`（代码层后接 AI 层）与 `--ai-only`（只补 AI 层） | no |
| `config/pelican.example.yaml` | modify | 注释说明 `judge.ai` | no |
| `test/core/judge/ai-judge.test.ts` | add | 挑裁判、准入、提示词、解析、并分 | no |
| `test/core/judge/` | modify | v3 权重的分数断言 | no |
| `test/core/config-judge.test.ts` | modify | `judge.ai` 解析用例 | no |
| `test/core/run/` | modify | 配置夹具补 `ai` | no |
| `test/core/sync/` | modify | 配置夹具补 `ai` | no |
| `AGENTS.md` | modify | 架构速览增 AI 语义层一条 | no |
| `docs/architecture/architecture.md` | modify | §3 AI 层与评审模式、§4 `.judge-ai.txt`、§7 目录说明 | no |
| `docs/research/judge/` | modify | 权重表、§4 运行方式、§7 步骤、schema 的 `judges[].id` 口径 | no |
| `docs/deploy-docker.md` | modify | 容器内 chromium 与评审 | no |
| `docs/deploy-public-showcase.md` | modify | 展台显示评审结果 | no |
| `docs/data-sync-architecture.md` | modify | 导出内嵌评审记录 | no |
| `docs/development.md` | modify | 运行产物增评审文件 | no |

数据仓 `meomeo-dev/llm-iq-data` 同步改动（另一仓库，本地提交 1718103）：`schemas/public-run.schema.json` 与
`scripts/lib/schema-validators.mjs` 认 `attempts[].judge`，拒收 `contactSheet` 与 `judges[].rawFile`。

**不动的东西**：

- `Attempt` 与 `RunRecord` 的字段：AI 分只写 `.judge.json`，`run.json` 逐字不变。
- 考场约束（ACR-006）：考生调用不带 `review`，参数与之前逐字相同；评审模式只在裁判调用上生效。
- 静态层与渲染层的判法、联系图的类别与布局（ACR-019）：只改权重常量。
- `src/bin`、`src/capabilities`：入口与探针不碰；看板只加配置页区块，卡片与抽屉已能显示 AI 分与理由。
- 数据仓布局与 `DATA_REPO_SCHEMA_VERSION`：不加文件、不升版本；联系图与裁判转录永不发布。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— `judge.ai` 缺省关闭，关闭时行为与 ACR-019 完全一致；开启后只对
「待复核」记录追加分数与一条 `judges[]`，失败保持「待复核」。权重变化经 rubric `version: 3` 标出，
旧记录由 `pnpm judge:backfill` 全量重算。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | 1a3723b | |
| `pnpm test` | node:test 单测，含新增 `test/core/judge/ai-judge.test.ts` | pass | pass | 1a3723b | 830 用例 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | 1a3723b | |
| `pnpm check:length` | 文件与函数长度阈值 | pass | pass | 1a3723b | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链 | skip | skip | | 真实调用 CLI 消耗配额，须先征得同意再跑 |
| `pnpm judge:backfill` | 本地 44 幅按 v3 权重重算代码层 | pass | pass | 1a3723b | 变更前为 v2 权重；v3 后 35 幅待复核、9 幅降智，无一幅能只凭代码层过线 |
| `pnpm judge:backfill -- --ai-only --only {runId}` | 对一轮真实调用裁判 CLI，记录得到 C5–C8 与 `judges[].kind = ai` | skip | pass | 1a3723b | 变更前该参数不存在；轮次 20260929T161834Z 7 幅由 agy/gemini-3.8-flash@high 评：3 幅在线（100 / 95 / 66）、4 幅降智（45 / 44 / 35 / 31），claude 未登录时自动换下一个裁判 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 适配器评审模式 + 配置 `judge.ai` + `ai-prompt` / `ai-judge` / `ai-round` + runner 钩子 + 权重 v3 + 单测 + backfill `--ai` + 配置页区块 + 公开记录内嵌评审 + 容器 chromium（1a3723b） | revert 本 commit |
| 2 | 本地 44 幅重算代码层，对一轮真实跑 AI 层核对分布；回填文档 | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；裁判调用拖慢轮次（单幅两次问答超过 `timeoutMs`）；裁判分与人工复核系统性不符。
- 步骤：先把配置 `judge.ai.enabled` 关掉即止血；彻底回滚按步逆序 revert，最多 2 个 commit，再
  `pnpm judge:backfill` 重算回 v2 权重。
- 数据：`.judge-ai.txt` 是附加文件，回滚后留在 `data/runs/` 里不碍事；`run.json` 未改无需迁回。

## 人工确认

### 方案摘要

1. 要动什么：适配器加评审模式，`src/core/judge` 加 AI 层三个文件与轮后队列，权重改成代码层 30 / AI 层 70；配置页加「作品评审」区块；评审记录随公开 `run.json` 发布；容器镜像装 chromium。涉及 3 个模块。
2. 不动什么：本地 `run.json`、考生调用参数、静态与渲染层判法、数据仓布局与版本号。
3. 为什么现在：两幅假阳 60 分作品暴露代码层不该独自过线；AI 层是用户要求的最终状态。
4. 风险与回滚：裁判分不稳则先关 `judge.ai.enabled`；最坏 2 个 commit 逆序 revert 加一次 backfill。
5. 成本：2 步；零新依赖；每幅作品两次裁判问答的配额。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-30 | 用户 | approved | 口头：「不是说做到最终状态吗？现在 AI 层还是没实现呢。分数不合理，代码检查误判太严重，但是它分占了 60 分」——要求一口做完，不中途确认 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | 增 AI 语义层一条；ACR-006 工具约束补评审模式例外 | 已回填 |
| architecture.md §4 | `runs/{runId}/` 增 `{attemptKey}.judge-ai.txt` | 已回填 |
| architecture.md §7 | `judge/` 目录说明补 AI 裁判 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-020 | 已回填 |
| ADR（/adr-curator） | 不适用：开关可关、可整体回滚 | 不适用 |
