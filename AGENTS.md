# llm-iq-dashboard 代理须知

本文件记录在本仓库工作的长期规则，适用于所有编码代理与协作者。

## 常用命令

需要 Node 22+ 与 pnpm 10+。

```bash
pnpm lint                                   # tsc --noEmit，含 test/
pnpm test                                   # node:test 跑 test/**/*.test.ts
pnpm exec tsx --test test/core/budget.test.ts   # 单个测试文件
pnpm dev --port 3001                        # 开发看板；3000 留给生产看板
pnpm dashboard:prod                         # 生产看板 :3000，只构建已提交的 HEAD
PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once   # 冒烟，会真实调用 CLI、消耗配额
pnpm issue:new -- --type feat "标题"         # 本地 issue；另有 issue:check / issue:worktree
```

- `pnpm test` 不调用 CLI、不读本机 `data/`、不读宿主机配置；涉及文件系统的用例用临时目录。
  SVG 净化测试依赖 jsdom（`test/support/dom.ts`）。
- `pnpm run:once` 与 `pnpm scheduler` 会调用真实 CLI，执行前先征得同意。
- `PELICAN_CONFIG` 覆盖配置路径，`PELICAN_DATA_DIR` 覆盖产物目录。本机配置
  `config/pelican.config.yaml` 不入库，首次加载时由 `pelican.example.yaml` 生成。

## 架构速览

权威记录是 `docs/architecture/architecture.md`（每次架构迭代在 `docs/architecture/revisions/`
立 ACR 变更单）；设计取舍见 `docs/design-notes.md`，目录、产物与接口见 `docs/development.md`。

- **进程只经文件协作**：看板（Next.js 15 + React 19）、调度器（`src/bin/scheduler.ts`，croner）、
  `run:once`、分容器时的 `runner` 互不直接通信，只读写 `data/`（`PELICAN_DATA_DIR`）。
  执行方写 `data/runs/<runId>/progress.json`，看板用 chokidar 监听后经 SSE（`/api/events`）
  推送，前端不轮询。停止一轮写 `cancel.json`；分容器时看板把请求写进 `data/requests/` 交给 runner。
- **分层依赖**：`src/app` → `src/core`（+ `src/capabilities` 的类型与缓存）；`src/app` 不引用
  `src/adapters`，调用 CLI 只经 `src/core`；`src/core` 不依赖 `src/app`。
- **编排**：提示词 × 目标（CLI × 模型 × 思考强度），按模型分道并发、道内从 low 到 max 串行；
  超时优先级 `targets[].timeoutMs` > `timeoutByEffort` > `timeoutByCli` > `defaultTimeoutMs`；
  预算按历史成本预估逐次放行。手动与定时轮次互斥。
- **适配器**：`src/adapters/` 每家 CLI 一个，实现 `AgentAdapter`（codex 用长驻 `codex app-server`）。
  新增一家需同时改 `src/adapters/index.ts`、`src/core/types.ts` 的 `CLI_KINDS` 与
  `src/capabilities/catalog.ts` 的探针列表。
- **考场约束**：每次调用在空的临时工作目录里执行，模型不给任何工具；失败分为
  `ok` / `no-svg` / `error` / `timeout` 分开记录；输出经凭据指纹比对，命中即不落盘。
- **提示词**：`classic-v1` 是 Simon Willison 原文，逐字锁定不可改；题库登记在
  `src/core/prompt*`，题目数据在 `src/core/prompts/`，改动后跑 `pnpm validate:prompts`。
- **作品评审**（ACR-019，缺省关闭，配置页「作品评审」区块开）：有评分标准的题目在 `ok` 落盘后由 `src/core/judge` 打分，写独立的
  `<attemptKey>.judge.json`、帧序联系表 `.sheet.png` 与各类细节联系表 `.sheet.<kind>.png`（同帧号），
  不改 `run.json`；静态层用 jsdom，渲染层用 playwright-core 驱动本机 Chromium（没有则跳过）。
  `pnpm judge:backfill -- --dry-run` 对本地历史预演。评分标准在 `src/core/judge/schema.ts`，改口径要升
  `version`。页面内跑的量测函数（`render-page.ts`）只能引用参数、DOM 与 `PAGE_HELPERS`。
- **AI 语义层**（ACR-020）：代码层只占 30 分，判「待复核」的作品在整轮定稿后由 `src/core/judge/ai-judge`
  交给配置 `judge.ai.judges` 里第一个厂商不同的裁判 CLI（作品之间并行，`judge.ai.concurrency` 是每个裁判同时评的件数，
  缺省 5），以适配器「评审模式」（临时目录只放联系图，
  只放开读文件）先盲描述、再看首帧给五类部位的像素框由程序重切细节表（ACR-021，失败退回几何推断的表）、
  最后按 C5–C9 打 70 分，转录存 `<attemptKey>.judge-ai.txt`。评审进程中途退出的队列由下一个执行进程启动时
  `resumeInterruptedJudging` 续评（已落盘结论的只补标记），看板在此之前显示「评审中断」。裁判调用真实消耗配额，
  历史作品不补评、不主动提议补评；`pnpm judge:backfill -- --ai-only` 只在用户明确要求时按轮运行。评审记录去掉联系图与转录后随公开
  `run.json` 的调用发布（`PublicAttempt.judge`），数据仓 validator 同步认这个字段；容器镜像装了
  chromium（`PELICAN_BROWSER_PATH` / `PELICAN_BROWSER_NO_SANDBOX`）给渲染层用。
- **模型产物不可信**：SVG 在浏览器端净化（`src/app/components/card/`），`/art` 路由以 CSP
  sandbox 返回原图。
- **写入与权限**：JSON 一律写临时文件后原子替换；配置页写回在 YAML 语法树上改值并保留注释。
  写接口只对配对设备开放（`pnpm pair`）；`PELICAN_READONLY=1` 或
  `PELICAN_DATA_SOURCE=remote` 为只读展台模式。

## 代码与数据分离

- 评测运行产物（`data/`，含 `data/runs/`）不进入本仓库。
- 运行结果只经 `pnpm sync:data` 脱敏后写入公开数据仓
  [`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data)，
  本地工作副本位于同级目录 `../llm-iq-data`。
- 向数据仓推送（`--push` 或 `git push`）会公开发布数据，须先经人工确认。
- 数据仓布局与记录格式的唯一契约是 `src/core/data-repo/contract.ts`；改动契约时同步更新
  数据仓的 `schemas/` 与 `scripts/lib/validator.mjs`。

## 永不发布的题目

- 题库不收录以真实人物为主体的题目。`leijun-v1` 已从题库移除，其 id 仍保留在下述两处清单中，
  拦截任何残留的本地历史结果。
- 规则由两处代码强制，二者须保持一致：
  - 本仓库 `src/core/data-repo/contract.ts` 的 `UNPUBLISHABLE_PROMPT_IDS`：同步时剔除；
  - 数据仓 `scripts/lib/validator.mjs` 的 `UNPUBLISHABLE_PROMPT_IDS`：CI 拒收。
- 新增仅供本地测试的题目时，加入上述两处清单。
- 不要用 `--run` 指定、手工复制或其他方式绕过这条规则。

## 质量门

提交前运行：`pnpm lint`、`pnpm test`、`pnpm validate:prompts`、`pnpm build`、
`pnpm check:length`（文件与函数长度阈值见 `config/code-length-policy.yaml`）。
改动只读部署或远程数据源时，另跑 `pnpm showcase:smoke`。
