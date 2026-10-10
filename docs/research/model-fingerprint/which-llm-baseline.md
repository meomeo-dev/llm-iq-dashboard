# which_llm 现状（模型指纹提炼依据）

| 项 | 内容 |
|---|---|
| 对象 | which_llm（meomeo-dev），commit `889e7f2`（2026-08-28） |
| 统计日期 | 2026-10-07，对其工作副本只读统计 |
| 用途 | [模型指纹模块设计](model-fingerprint-design.md) 的事实依据 |

本文记录 which_llm 中与模型指纹有关的现状：算法、身份链、语料、耗费与已知问题。
文中路径相对 which_llm 仓库根目录。设计取舍见
[模型指纹模块设计](model-fingerprint-design.md)。

## 1. 算法沿革

| 阶段 | 内容 | 状态 |
|---|---|---|
| whorl 复刻 | 外部开源项目 whorl 的字符 n-gram 方法：password 题，100 训练、5 留出、5 查询，1–3 阶，α = 0.1 | 由 V3 取代；复刻度报告见 `docs/parity/20260702_reference_replication_99_report.md` |
| LLM-Fingerprinter | 31 题 embedding 指纹加集成分类 | v1.0.0 删除 |
| Meta-Whorl V2 | 自然分布语料 | 停用，源文件冻结 |
| Meta-Whorl V3 | 格式受控的随机值，逐类打分后等权聚合 | 在用，最新修订 R16 |
| mixture-assay-v1 | 逐响应证据，单纯形约束 EM 估计混合比例，bootstrap 区间 | 只有设计；`docs/model-mixture-detection/algorithm.md` 自注为历史方案、待重基线 |
| 联想骨架归因 | 开放集，需要 logprobs 或重复采样 | 延期提案（`docs/proposals/llm-attribution/`） |

在用的两个工作流：

- `scripts/detect-codex-vendors.sh`：逐个 Codex profile 做一次 V3 检测（6 个
  查询），打印第一名与分数；是否与请求模型一致由人工比对。检测结果写在临时目录，
  脚本退出时删除。
- `scripts/monitor-codex-auth.mjs`：按间隔对官方 Codex 登录态做 V3 检测，记录第一名
  的 family 是否与请求一致，汇总不一致率与 Wilson 区间。

## 2. V3 R16 的测量方式

- 6 个 subtype：uuid、number、nonce、seed、dice、shuffle。参照每类 20 训练、
  5 留出，检测时每类 1 个查询。
- 题面：格式说明、可见要求、样本标签 `ctx-…`、`⟦VALUE⟧…⟦/VALUE⟧` 标记，单条
  928–1121 字节。样本标签由计划种子、subtype、序号与 split 派生，同一槽位固定不变。
- 生成参数：单条 user 消息，无系统提示词，不设 temperature；provider 路径
  `maxOutputTokens` 为 32768，并传 `reasoning: "none"`（见
  `src/provider/whorlV3Collector.ts`，2026-07-14 的 `f038916` 引入；R12 标准参照于
  同日稍晚发布，artifact 未记录采集所用的代码版本）；Codex 路径 effort 为 `low`，
  带 Codex 自身指令（`src/provider/codexAppServer.ts`）。
- 落盘：只保存提取值 `canonicalPayload` 与应答原文的 SHA-256 `responseDigest`，
  不保存原文；artifact 中没有 token 用量或费用字段。

打分公式（`src/domain/ngram.ts`、`src/domain/whorlV3Scoring.ts`）：

- 字符为 UTF-16 码元；每条值左补 n−1 个 `\0`，不加结束符；词表 V 为该参照训练值
  中出现过的字符；重复值不去重。
- P_n(c | ctx) = (count(ctx, c) + 0.1) / (count(ctx) + 0.1 × |V|)，n = 1、2、3。
- raw(m, s)：对每个查询值，求三个阶的 log P_n(值) / 值的码点数 的平均，再对查询值
  取平均。
- 每类在候选间做 min-max 归一（全相等取 0.5），6 类各乘 1/6 求和得总分；同分按
  raw 之和，再按模型名。
- 黄金样例 `docs/designs/fixtures/whorl_v3_ngram_raw_score_golden.json`：训练值
  `ab`、`a😀`，查询值 `ac`、`😀`，raw = −2.8240082794732513。
- 留出集不参与在线打分，只用于就绪判定与离线实验。在线结果没有不确定度；which_llm
  看板另用"第一名 < 0.7 或第一、二名分差 < 0.15"判低置信
  （`web/src/pages/commitmentVerdict.ts`）。

规模：`src/` 共 34,480 行。n-gram、打分、格式规则与提取这部分内核约 400–900 行，
其余是身份、checkpoint、lease、发布、实验与 Web 设施。

## 3. 身份链与耦合

| 身份 | 覆盖内容 |
|---|---|
| `taskHash` | 修订、规格修订、taskId、可见规则、模板身份 |
| `promptHash` | 单个槽位题面的 UTF-8 字节 |
| `planHash` | 计划的规范 JSON，含 promptRevision、planId、各 split 数量、maxOutputTokens、planSeed |
| `slotId` | protocol、planHash、subtype、split、序号 |

- 打分要求查询与全部参照的 `planHash` 完全相同。`planHash` 一变，所有 subtype 的
  `slotId` 随之改变。
- 参照按（模型, 计划, 角色）整份发布：150 个槽位全部 accepted 才发布，artifact
  之间不合并、不互补。
- 检测打分前校验查询证据：冻结的查询槽位（每类 1 个，共 6 个）须全部 accepted 并与
  证据一一对应，否则抛出原因码为 `missing_query` 的错误（`src/domain/whorlV3QueryState.ts`
  的 `isWhorlV3QueryEvidenceComplete`，由 `src/core/whorlV3DetectionRunner.ts` 调用）。
  不能只测部分 subtype；任一类没有 accepted 值，整次检测不出结果。官方线路监测中有
  2 次检测因此不可比（见第 6 节）。
- R14、R15 相对 R13 只改了 claude-fable-5 的 hash 一类题面
  （`src/domain/whorlV3SubtypeSpecifications.ts` 注释）。R13 与 R15 的
  claude-opus-5 参照，150 个 `promptHash` 完全相同，`slotId` 交集为 0，R15 仍整套
  重采了 150 个值。
- 打分数学逐 subtype 独立：raw 只依赖该类的训练值与查询值，耦合只出现在类内的跨
  候选归一化与最后的等权求和。整套重采与"6 类齐备才打分"来自身份、发布与检测
  校验，不来自数学。

## 4. 语料现状

`samples/whorl-v3/corpus/artifacts/reference/` 下共 15 份参照：

| planHash 前缀 | 计划 | 模型 | 每份 accepted | 尝试次数 |
|---|---|---|---|---|
| `280af8fa` | R12，每类 5 训练 + 2 留出 | gpt-5.6-luna / sol / terra | 42 | 62 / 42 / 52 |
| `74a35df5` | R12，每类 20 训练 + 5 留出 | gpt-5.6-luna / sol / terra | 150 | 220 / 152 / 225 |
| `f4ef2b4b` | R13 | claude-opus-4.8 / opus-5 / sonnet-5 | 150 | 340 / 154 / 156 |
| `c4cacc8a` | R15 | claude-fable-5 / opus-5 / sonnet-5 | 150 | 217 / 170 / 165 |
| `02b94508` | R16 | claude-opus-4.8 / opus-5 / sonnet-5 | 150 | 318 / 160 / 174 |

- 5 个 `planHash` 互不可比。claude-opus-5 与 claude-sonnet-5 各有 3 份参照，
  分属 R13、R15、R16。
- gpt-5.6 参照（R12）与 claude 参照（R16）没有共同的 `planHash`，不能进同一候选
  集合。
- 15 份参照共 1,926 个 accepted 值、2,607 次尝试。查询 artifact 745 份，每份
  6 个值。
- 代码默认计划 `defaultWhorlV3Plan` 仍是 R15，`docs/samples.yaml` 写的默认修订是
  R16；R16 计划要显式传 `--whorl-v3-plan`。
- 检测按"含声称模型、且至少 2 份参照"挑选 cohort（`src/application/whorlV3Web.ts`
  的 `latestReferenceCohort`），候选集合随声称模型变化。

## 5. 采集耗费与问题

- R16 的 claude-opus-4.8 参照用 318 次尝试拿到 150 个值：nonce 首次尝试 19/25
  失败（输出 20–23 位，要求 24 位），shuffle 12/25 输出多行
  （`issues/0004-feat-r17-subtype-output-robustness.md`）。
- hash 类题面的内容过滤为概率性触发，补齐靠反复执行 `whorl v3-recover` 开新 epoch
  （`docs/whorl-v3-sampling-and-detection.md` 第 2 节）。
- R17（issue 0004，open）只改值格式与提取规则；按现有身份规则，参照与查询仍要
  整体迁移重采。

## 6. 官方线路监测结果

来源：`.which_llm_data/codex-auth-monitor/codex-auth-comparison.summary.json`，
2026-08-26 至 08-28，官方 Codex 登录态。

| 请求模型 | 可比次数 | 第一名 sol | 第一名 terra | 第一名 luna | 不一致率（Wilson 95%） |
|---|---|---|---|---|---|
| gpt-5.6-sol | 208 | 50 | 55 | 103 | 76.0%（69.7%–81.3%） |
| gpt-5.6-luna | 191 | 9 | 33 | 149 | 22.0%（16.7%–28.4%） |

- 所用参照为 R12 cohort `74a35df5`，经 OpenRouter Responses API 采集；查询经
  Codex app-server，带 Codex 自身指令，effort 为 `low`。参照与查询不是同一通道。
- 每次检测 6 个查询值；监测脚本没有套用低置信门槛。
- 两个模型共 10 次检测不可比：`missing_query` 2 次，`recovery_claim_superseded`
  （run 的 owner claim 或 lease 校验失败）8 次。原因取自同目录 `monitor.sqlite3`
  的 `monitor_observations` 表。
- which_llm 中没有同一通道下这三个模型的混淆矩阵。上表不足以区分"官方线路换了
  模型"与"方法在该通道组合下分不开"；汇总文件自身注明
  `does_not_establish_provider_intent`。

## 7. 沿用的经验规则

- 题面对所有模型相同；按候选改写题面会把候选身份带进测量（R16 删除 hash 类的原因）。
- 新增题面避开密码学与凭据词，改用掷骰、洗牌、抽号语义（which_llm `AGENTS.md`）。
- 未校准的分数不称为概率或置信度；相近的对数分数不展示为极端百分比。
- 同族相邻版本接近时输出低置信，不强行给出单一模型。
- 路由名不等于模型身份；可信识别依赖经可信线路采得的参照。
- 监测要发现的是服务商间歇性替换或掺用其他模型。

## 8. 不移植的设施

- lease、epoch、owner claim、fencing、CURRENT / OWNER 指针与 checkpoint 链；
- commit marker、发布回填、同设备证明、内容寻址语料与 release / volume manifest；
- 实验框架（10/20/40/80/105 分级、leave-topic / leave-artifact、bootstrap 停止规则）；
- rotation set、R1–R15 历史渲染器、V2 冻结门；
- 约 30 个 AI SDK provider 的注册表、Web 监控服务、进程内调度器与密钥存储：看板已有
  对应设施，或不需要。
