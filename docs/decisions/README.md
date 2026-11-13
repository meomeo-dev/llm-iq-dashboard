# 架构决策记录（ADR）

> 这个目录记的**不是**"我们选了什么"——那在根 [`README.md`](../../README.md) 的「设计要点」。
> 这里记的是"我们**排除了**什么、为什么不要走回去、走回去了怎么被发现"。
> 每一份都是已经犯过并修掉的错，或一次难以逆转的取舍。
> **改 CLI 调用方式（src/adapters）、轮次数据模型与存储（src/core/types.ts、src/core/store.ts）、
> 配置写回（src/core/config-writer.ts）、SVG 净化边界（src/app/components/svg-sanitize.ts）前先读相关 ADR。**

## 收录判准（严格：可以少，不要滥）

只有两种东西能进来，各自三条全中才立：

**A. repeated-failure —— 同一根因反复发作**
1. 事故台账 [`incidents.jsonl`](incidents.jsonl) 里同一 `topic` **累计 ≥ 3 条**，且日期或 commit 互异
   （同一次事故拆成三条不算）；
2. 光看代码**看不出**"为什么不那样做"——被排除的路径在代码里没有痕迹；
3. **给得出违反时的检出命令**，或在同一次改动里把闸门建起来。

**B. major-decision —— 难逆转的取舍**
1. 逆转它要动轮次数据模型（`data/runs/<runId>/run.json` 的形状）/ CLI 调用协议 / 存储布局 /
   安全边界（SVG 净化、art 路由 CSP 沙箱）/ 依赖方向之一，成本以天计，或会作废历史基准结果；
2. **至少一个方案被认真考虑过并否决**，且否决理由不是"没时间"；
3. 同上：给得出检出命令。

**不收**（各有各的家）：

| 内容 | 去处 |
|---|---|
| 怎么跑、端口、CLI 安装与登录、"这个命令别用" | 根 `README.md` |
| 系统长什么样、为什么这样设计 | 根 `README.md`「设计要点」、`docs/` |
| 这次做了什么、证据是什么、欠了什么 | 对应 issue（`issues/<NNNN>-<type>-<slug>.md`）与 commit message |
| 只发生过一两次的错 | `incidents.jsonl`（**先记，攒到 3 次再说**） |
| 个人偏好、会话上下文 | memory |
| 没有检出方式的"约定" | 不收——它守不住 |

判断不清时的试金石：**这条决策让什么变难了？** 答不出代价的不是决策，是常识。

## 目录结构

```
docs/decisions/
├── README.md                        # 本文：判准 + 结构 + 索引（索引段由脚本重写）
├── ADR-NNN-<slug>.md                # 一份决策一份文件；superseded / deprecated 原地保留，改状态不删
├── decisions.catalog.jsonl          # 一行一 ADR 的登记表（机器读，脚本维护）
├── decisions.catalog.schema.json    # 台账行的数据契约
├── incidents.jsonl                  # 事故台账 = 证据池 = ADR 的上游；一行一次事故
└── incidents.schema.json            # 事故行的数据契约
```

不分子目录、不按年份分——数量应该始终少到一屏看得完。

## 命名

- 文件：`ADR-NNN-<slug>.md`。`NNN` 三位补零，一经分配不复用；`slug` **英文 kebab-case**，名词短语，
  说的是"决策是什么"而不是"修了什么"
  （`one-long-lived-codex-app-server-per-run` ✓，`fix-codex-exec-hang` ✗）。
- 事故 `topic`：英文 kebab-case，**根因指纹**——同一根因必须同一 topic，否则计数失效。
  记之前先 `adr.mjs incident topics` 看已有的，别新造近义词（脚本会拦相近的）。
- 事故 `id`：`INC-NNNN`；台账 `tags`：英文 kebab-case，≥2 个，供查重与检索。
- 标题：`# ADR-NNN: 中文标题（English Title In Title Case）`。

## ADR 结构（为什么是这几节）

| 节 | 必填 | 它回答的问题 |
|---|---|---|
| 表头（状态/类型/日期/影响范围/**检出**/取代） | ✓ | 十秒内知道它管哪儿、怎么验 |
| **决策** | ✓ | 一句祈使句，读到这里就能照做 |
| 证据 › **事故实例** | A 型 ≥3 行 | 为什么信这条——带日期、commit、**数字** |
| 证据 › **被否决的方案** | B 型 ≥1 行 | 代码里读不出的那半边：不走哪条路、为什么、何时重新考虑 |
| **代价** | ✓ ≥1 | 这条决策让什么变难了 |
| 合规 › 违反怎么被发现 | ✓ | 命令 + 报错形状 |
| 合规 › 新增同类事物的步骤 | 条件 | 以后再加 X（如第四个 CLI 适配器）时按这个走 |
| **引用本 ADR 的位置** | ✓ ≥1 | 没有代码 / 配置指回来的 ADR 没有落点 |
| 相关 | 选 | 其它 ADR / README § / issue / memory |

有意**删掉**的：单独的「背景」（并进证据）、「理由」（并进被否决的方案——理由只有在对照下才有信息量）、
「正面后果」（全是好话，零信息）、「参考」（并进引用与相关）。

## 工作流

```bash
A=.claude/skills/adr-curator/scripts/adr.mjs
node $A incident add --topic <t> --summary "…" --root-cause "…" --ref commit:<sha>  # 每次踩坑先记
node $A recall --auto --error "<报错>"   # 犯错后先回顾（adr-recall 技能）
node $A find <词...>                    # 登记过吗？同 topic 攒了几次？
node $A tally                           # 谁到 3 次了
node $A new <slug> --title … --title-en … --type … --scope …   # 取号 + 按模板生成
node $A check ADR-NNN                   # 结构检查
node $A dupes ADR-NNN                   # 查重
node $A register ADR-NNN --tags=a-b,c-d # 登记 + 反挂事故 + 重写索引
node $A validate                        # 全量：结构 / schema / hash / 悬空 / 相互查重 / 索引
```

`register` 会拒绝结构不合规与疑似重复（相似度 ≥ 0.6）的文件。改过 ADR 正文必须重新 `register`（台账记 hash）。
两个技能：`adr-curator`（写端：记事故、立 / 维护 ADR）与 `adr-recall`（读端：犯错后回顾）。

## 索引

<!-- adr-index:start -->
| ADR | 决策 | 类型 | 状态 | 日期 | 事故数 | 检出 |
|---|---|---|---|---|---|---|
| （无） | | | | | | |

**候选（事故台账里尚未立 ADR 的 topic）**

| topic | 次数 | 事故 |
|---|---|---|
| `background-event-streams-exhaust-browser-connections` | 1 / 3 | INC-0001 |
<!-- adr-index:end -->
