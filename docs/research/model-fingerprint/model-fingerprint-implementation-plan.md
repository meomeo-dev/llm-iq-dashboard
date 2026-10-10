# 模型指纹模块实施计划（草稿）

| 项 | 内容 |
|---|---|
| 状态 | 草稿（draft），随方法设计一起评审 |
| 日期 | 2026-10-07 |
| 方法设计 | [model-fingerprint-design.md](model-fingerprint-design.md) |
| 现状依据 | [which-llm-baseline.md](which-llm-baseline.md) |

本文给出模型指纹模块的落地安排：模块划分、命令、现有代码的改动面、配置、分期与
验收标准。探针、打分、通道与数据布局的设计取舍见
[model-fingerprint-design.md](model-fingerprint-design.md)。逐文件的改动清单与回归
清单在 ACR 中给出。

## 1. 模块划分

```text
src/core/model-fingerprint/
├── probes/          每个探针一个文件，写全题面；index.ts 汇总并计算身份
├── extract.ts       标记提取、唯一候选、格式校验
├── ngram.ts         字符 n-gram 语言模型
├── score.ts         逐探针 raw、逐对比较、排名、结论
├── self-test.ts     交叉验证自检；比较对的门槛、探针组合的预期一致率
├── plan.ts          解析探针组合、跳过不可用探针、确定比较对象、计算缺口与调用次数
├── store.ts         样本集、核验记录、作业文件的读写
├── collect.ts       并发调用、调用上限、取消、用量与费用记录
└── job.ts           作业生命周期，与鹈鹕轮次互斥
src/bin/model-fingerprint.ts      命令入口
test/core/model-fingerprint/      单元与黄金测试，不调用 CLI
```

源码估计 1,200–1,500 行，不含测试；单个文件低于 `config/code-length-policy.yaml`
的 500 行上限。`plan.ts` 是纯函数，`fingerprint:status` 的状态表与补齐、核验前的
报告都由它计算。模块不复用鹈鹕轮次的编排（`executeRun`）：那条路径会写入考场规则、
按 SVG 提取作品，并进入时间线、预算历史与数据仓同步。模块经 `src/core` 调用适配器，
`src/app` 不直接引用 `src/adapters`，与现有分层一致。

## 2. 命令

| 命令 | 作用 | 调用模型 |
|---|---|---|
| `pnpm fingerprint:status` | 列出模型 × 探针的样本集状态与补齐所需调用次数 | 否 |
| `pnpm fingerprint:fill -- --cli codex --model <模型> [--probes <探针>]` | 补齐该模型缺的样本集，可只补所选探针；先显示调用次数与估算费用并确认 | 是 |
| `pnpm fingerprint:check -- --cli codex --profile <profile> --model <模型> [--probes <探针>]` | 核验一条线路；先显示将核验与跳过的探针、比较对象、调用次数、估算费用与预期一致率 | 是 |
| `pnpm fingerprint:self-test -- [--model <模型>] [--probes <探针>]` | 自检：各探针的区分力、各比较对的门槛、所选组合的预期一致率与误判率，以及推荐组合 | 否 |
| `pnpm fingerprint:rescore -- <checkId>` | 用当前规则重算历史核验 | 否 |

- `--probes` 取探针名，逗号分隔，如 `--probes uuid,dice,shuffle`；任意非空子集均可，
  缺省取配置 `probes`。
- `--profile` 缺省为 `default`，即该 CLI 的登录态。

会调用模型的命令遵守 AGENTS.md 的规定：运行前征得同意。

## 3. 现有代码的改动面

| 位置 | 改动 |
|---|---|
| `src/core/paths.ts` | 增加本模块的数据根目录函数 |
| `src/core/store.ts` | 增加按任意路径原子写 JSON 的函数；现有 `writeJsonAtomic` 只写轮次目录，`src/core/auth/store.ts` 的 `writeJsonFile` 只建数据根目录 |
| `src/core/run-cancel.ts` | 停止检查改为可按作业目录使用；现有 `requestCancel`、`watchCancel` 只认 `runId` |
| `src/core/progress.ts` | `findActiveRun` 同时识别进行中的指纹作业；看板、执行器、调度器三处入口沿用现有的拒绝与排队规则 |
| `src/core/runner.ts` | 把组装 profile 启动参数的 `launchFor` 抽出共用 |
| `src/adapters/` 的 codex 部分 | 默认 profile 增加最小配置的启动方式，只供指纹调用使用 |
| `src/core/config/` | 新文件解析 `modelFingerprint` 配置段，`loader.ts`（427 行）只负责接入 |
| `package.json` | 增加 `fingerprint:*` 脚本 |
| `src/core/requests.ts`、`src/bin/runner.ts`（第 2 期） | `RequestKind` 增加指纹作业，分容器部署时由 runner 执行；处理函数放进新文件 |
| `src/app/api/events/live-hub.ts`、`src/app/components/live-state/live-store.ts`（第 2 期） | 增加指纹作业的 SSE 事件 |

直接复用的现有函数：

- `openSessionPool`（`src/adapters/index.ts`）：按 CLI 与 profile 开会话；
- `buildLeakGuard`（`src/core/leak-guard.ts`）：应答落盘前的凭据指纹比对；
- `foldEffort`（`src/core/types.ts`）：按能力目录折叠思考强度；
- `usageFromTranscript`、`estimateCost`（`src/pricing/`）：用量与估算费用。

不改：鹈鹕轮次编排、题库、评审、数据仓契约与同步。分容器部署要改的
`src/bin/runner.ts` 已有 492 行，第 2 期接入前先拆分该文件。

## 4. 配置

```yaml
modelFingerprint:
  enabled: false
  effort: low           # 指纹调用统一的思考强度，按能力目录折叠
  samplesPerProbe: 20   # 参照每个探针的目标 accepted 值数，打分时各模型取同样条数
  probes: []            # 核验不指定探针时的缺省组合；空表示全部探针
  valuesPerCheck: 1     # 核验时每个探针取的值数
  checkAttempts: 3      # 核验时每个探针最多尝试的次数
  targetAccuracy: 0.95  # 自检中判对方向的比例目标，各比较对的门槛由此推出
  maxCallsFactor: 3     # 一个样本集一次补齐最多调用（目标条数 × 3）次
  concurrency: 5
  references:           # 要建参照的模型，经各 CLI 的可信线路采集
    - cli: codex
      model: gpt-5.6-sol
```

单次调用的超时沿用看板对目标的解析顺序（`targets[].timeoutMs`、`timeoutByEffort`、
`timeoutByCli`、`defaultTimeoutMs`，靠前者优先）。

## 5. 分期

| 期 | 内容 | 是否调用模型 |
|---|---|---|
| 0 | 评审方法设计与本计划；登记 issue；立 ACR；把算法来源登记进 `.ip-compliance/ingress-ledger.jsonl` | 否 |
| 1 | 内核与命令行：探针、提取、n-gram、逐对比较、核验计划、存储、补齐、核验、自检、重算，样本集与核验记录的 schema，以及黄金测试。另用 which_llm 已有的 R12、R16 样本做一次离线自检（一次性脚本，不进模块），先回答三个问题：gpt-5.6 三个模型在同一通道下能否区分；只用 1 个、3 个探针时预期一致率比 6 个低多少；raw 差逐对比较与 V3 min-max 总分哪个更准 | 测试与离线自检不调用；首次补齐参照前征得同意 |
| 2 | 看板页面（参照矩阵、核验历史与详情；发起补齐与核验时勾选探针，显示将核验与跳过的探针、调用次数、估算费用与预期一致率）、配置页区块、SSE 进度、分容器请求。接口读用 `requireOwner`、写用 `requireOwnerAction`；只读展台模式（`PELICAN_READONLY=1` 或 `PELICAN_DATA_SOURCE=remote`）不显示本模块 | 由使用者发起时调用 |
| 3 | 监测：鹈鹕轮次结束后对用到的中转线路顺带核验（默认关闭）、时间线标记、按时间窗与探针组合汇总不一致率与区间、混合比例估计 | 按配置调用 |

第 1 期与第 2 期分别立 ACR，与 codex 多 profile 设计分成多份 ACR 实施的做法一致。

## 6. 验收标准（AC）

1. 只改一个探针题面时，只有该探针的身份变化；`fingerprint:status` 报告每个参照
   模型缺 1 个样本集；不含该探针的探针组合无需补采即可核验。
2. 修改提取规则或打分公式后，`fingerprint:self-test` 与 `fingerprint:rescore`
   不发起 CLI 调用；测试中用计数的假适配器验证。
3. n-gram 实现对 which_llm 黄金样例（训练值 `ab`、`a😀`，查询值 `ac`、`😀`）给出
   raw = −2.8240082794732513，二进制表示为 `0xc0069791a71fc449`。
4. 分别选 1 个、3 个、6 个探针核验时，调用次数为参与核验的探针数 × `valuesPerCheck`
   （不计重试）；结论只用所选探针，未选探针的样本集缺失、受阻或身份变化不影响结果。
5. 所选探针中，声称模型没有可用样本集或其他模型都没有的探针跳过，并列出补齐所需
   调用次数，其余探针照常核验；核验中失败的探针不参与打分，其余探针照常出结论。
   只有没有可核验的探针或没有比较对象时才不发起调用。
6. 某模型只有部分探针的样本集时，按它与声称模型共有的探针参与逐对比较，不被整体
   排除；新增或删除一个参照模型，不改变其他比较对的对数似然比与门槛。
7. 每个比较对的门槛由自检计算；核验前显示所选组合的预期一致率，有分不开的比较对时
   提示；参与探针为 0 时结论为「不可比」。
8. `fingerprint:fill --probes` 只补所选探针；一个样本集达到调用上限时标记为受阻
   并给出原因分布，其他探针照常采集。
9. 每次调用记录用量与估算费用；补齐与核验前显示调用次数与估算费用，没有历史费用时
   只显示次数。
10. 命令行与页面只接受模型名、profile 名与探针名，不提供题面编辑入口。
11. 鹈鹕轮次在跑时指纹作业拒绝启动；指纹作业在跑时，手动轮次被拒绝、定时轮次排队。
12. 应答落盘前经凭据指纹比对，命中即不落盘。
13. `pnpm lint`、`pnpm test`、`pnpm build`、`pnpm check:length`、`pnpm check:secrets`
    通过；测试不调用 CLI、不读本机 `data/`。测试夹具中的样本值不放在 `token`、
    `secret`、`credential` 等键下，`scripts/check-secrets.ts` 的赋值启发会拦截这类键后
    32 字符以上的值。
