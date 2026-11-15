# CLI 命令端 UX 整合与全链路可用性改进方案（Final v2 — 经三方审查修订）

> **状态**：Final v2（已合并 3 份联网理论与代码实证审查报告的全部 Must-Fix / Should-Fix 修订项）
> **配套审查报告**：
> - [01-command-tree-and-flags-review.md](./01-command-tree-and-flags-review.md) — 命令拓扑、参数正交性、`pnpm` 透传机制与 Node `parseArgs` 边界审查
> - [02-safety-tty-and-automation-review.md](./02-safety-tty-and-automation-review.md) — 安全护栏、TTY 感知、自动化兼容性与 `ACR-024` 架构边界审查
> - [03-ergonomics-help-and-codebase-review.md](./03-ergonomics-help-and-codebase-review.md) — 零配置直跑、渐进式披露、存量单测兼容与代码长度门禁预审

---

## 一、现状诊断与真机实测暴露的核心问题

在 `/tmp` 隔离环境下使用 `agy` CLI（`gemini-3.8-flash` · `low`）对「鹈鹕基准」与「模型指纹」全套 CLI 命令进行端到端实测与代码走查后，定位出以下 5 类核心问题：

### 1.1 高危安全缺陷：`--help` 与未知参数被静默忽略，直接触发真实扣费或写盘副作用
目前仓库内 `src/bin/` 与 `scripts/` 下的 11 个 CLI 入口各自手写（甚至不写）参数解析，没有任何一个入口支持 `--help` / `-h`：

| 命令 | 当前传入 `--help` 或拼错参数（如 `--dryrun`）的实际后果 | 风险等级 |
| :--- | :--- | :--- |
| `pnpm run:once` | [`src/bin/run-once.ts`](../../../src/bin/run-once.ts) **完全不读 `process.argv`**，静默忽略 `--help` 或 `--cli agy ...`，直接按 `pelican.config.yaml` 启动整轮真实模型调用并消耗配额 | **P0（直接扣费）** |
| `pnpm sync:data` | [`src/bin/sync-data.ts`](../../../src/bin/sync-data.ts#L40-L75) 的 `for` 循环对未识别参数静默跳过，`dryRun` 保持 `false`，直接向数据仓写入并生成 `git commit` | **P0（误写数据仓）** |
| `pnpm pair` | [`src/bin/pair.ts`](../../../src/bin/pair.ts) 仅用 `argv.includes` 查已知开关，传 `--help` 会直接开启 10 分钟配对窗口并落盘配对码 | **P1（误开权限窗口）** |
| `pnpm scheduler` / `runner` / `preflight` / `pricing:sync` | 忽略 `--help` 直接启动常驻守护进程或发起 CLI 探测 / 联网拉取 | **P1（误起进程/网络）** |
| `pnpm fingerprint:*` | [`src/bin/model-fingerprint.ts`](../../../src/bin/model-fingerprint.ts#L134-L166) 在校验开关合法性前先调 `consumeFlagValue`，导致 `pnpm fingerprint:status -- --help` 报错 `参数 --help 缺少取值`，`-h` 报错 `无法识别的位置参数：-h` | **P1（报错误导）** |
| `pnpm judge:backfill` | [`scripts/judge-backfill.ts`](../../../scripts/judge-backfill.ts#L41-L56) 报错 `未知参数：--help`（Exit Code 1），用户必须翻源码才能知道支持哪些参数 | **P2（可发现性差）** |

### 1.2 Web 端「▶ 跑一次」与 CLI 端 `pnpm run:once` 的能力断层
- **Web 端（`RunOnceMenu` + `POST /api/run`）**：支持勾选目标模型（含配置中 `enabled: false` 的备选目标）、多选渠道 Profile、指定提示词题目、固定候选集场景（`candidateOverrides`），并在底部实时展示预计花费与 `findActiveWork()` 互斥状态。
- **CLI 端（`pnpm run:once`）**：写死调用 `scheduledRound(loadConfig(path))`，**不支持任何命令行过滤参数**。当开发者或运维人员想在终端执行“用 `agy` 的 `gemini-3.8-flash` (`low`) 跑一次 `classic-v1`”时，被迫手写临时 YAML 并拼接 `PELICAN_CONFIG=/tmp/xxx.yaml PELICAN_DATA_DIR=/tmp/data pnpm run:once`。

### 1.3 「鹈鹕基准」与「模型指纹」两套 CLI 的命令结构与参数词典割裂
1. **入口碎片化与 `pnpm` `--` 习惯负担**：
   - `package.json` 中模型指纹拆成了 7 个平行脚本（`fingerprint:status` ～ `fingerprint:import`），没有统一的 `pnpm fingerprint <subcmd>` 或 `pnpm pelican <cmd>` 主入口。
2. **目标定位参数不一致**：
   - 模型指纹支持 `--cli`、`--model`、`--profile`、`--probes`，但**不支持 `--effort`**（硬编码只读 YAML 中的 `modelFingerprint.effort`）；
   - 鹈鹕基准 `run:once` 则完全不支持 `--cli`、`--model`、`--effort`、`--profile`、`--prompt`。
3. **免改 YAML（Ad-hoc Target）解析行为在子命令间不一致**：
   - 在模型指纹中，当 `agy/gemini-3.8-flash` 未写入 YAML `references` 且磁盘尚无样本时，`fingerprint:fill -- --cli agy --model gemini-3.8-flash --dry-run` 会自动合成临时目标，而 `fingerprint:status -- --cli agy --model gemini-3.8-flash` 却因为 [`planFingerprintStatus`](../../../src/core/model-fingerprint/plan.ts#L284-L324) 只遍历 `configuredReferences ∪ onDiskSampleSets` 而输出 0 行。
   - 当用户只传 `--model gemini-3.8-flash`（未传 `--cli`）时，不会从 `config.targets` / `capabilities.json` / `builtinModels` 自动反查 `cli`，而是静默输出 `0 项` 并以退出码 `0` 结束。

### 1.4 安全护栏、TTY 感知与成本可观测性缺陷
- `run-once.ts` 缺 `findActiveWork()` 互斥检查、缺 `--dry-run` 预演、跑前不打印预计费用、跑后不打印每次调用的耗时/Token/折算官价 `$USD`。
- `model-fingerprint.ts` 的 `defaultInteractiveConfirm` 未检查 `process.stdin.isTTY && process.stdout.isTTY`：在后台管道或非交互子进程中未传 `--yes` 时，要么永久挂起（infinite hang），要么在 EOF 时抛出未捕获的 `AbortError: readline was closed`，且用户选 `N` 取消时返回退出码 `0` 而非 `1`。

### 1.5 真机实测发现：`agy` 指纹采样因工具调用被拒导致 ~80% `empty_output`
- `agy --print --sandbox` 无法通过 CLI 参数剥离工具声明，始终向模型注入 `run_command` 等 56 个工具定义，且 `--print` 模式忽略工作目录的 `GEMINI.md`（见 [`src/adapters/agy.ts`](../../../src/adapters/agy.ts#L16)）。
- 在指纹 `uuid` 探针中，`gemini-3.8-flash` 有约 80% 概率选择调用 `run_command` 执行 `python3 -c "import uuid..."`，在 `--sandbox` 下触发 `permission check failed` 直接终止回合，导致 `result.response` 为 `""`，并在 `result.denied_actions`（映射为 `reply.notes`）留下拒绝记录。
- [`buildProbeAttemptRecord`](../../../src/core/model-fingerprint/collect-core.ts#L150-L179) 未检查 `reply.notes`，将工具被拒误归类为 `empty_output`；且 `handleCheckCommand` 结束时未打印 `record.failedProbes`。

---

## 二、经三方审查修订的核心设计决策（Key Revisions in v2）

对照 [clig.dev](https://clig.dev/)、POSIX.1-2024、GNU CLI Standards 及本仓库架构约束（`AGENTS.md`、`ACR-024`、`config/code-length-policy.yaml`），对 Draft v1 做出以下 6 项关键修正：

1. **【修正 1：`pnpm` 参数透传与 `"--"` 全量剥离】**
   - 经核查 `pnpm` `@pnpm/parse-cli-args` 源码，非内置脚本名（如 `pelican`、`fingerprint`、`run:once`）会触发 `escapeArgs`，放在脚本名之后的参数（含 `--help`、`--config`）100% 透传给脚本；若用户加了 `--`，`"--"` 会原样进入子进程 `argv` 且下标随子命令深度游走（`argv[0]` / `argv[1]` / `argv[2]`）。
   - 因此解析器统一使用 `argv.filter((arg) => arg !== "--")` 全量剥离，并在帮助文档中引导不带 `--` 的简洁写法（如 `pnpm pelican run --cli agy ...` 或 `pnpm fingerprint check --cli agy ...`），同时 100% 兼容带 `--` 的写法。
2. **【修正 2：移除高危 `-d` 短参数，支持单复数别名与多值合并】**
   - 移除 `--data-dir` 的 `-d` 短参（防止用户误以为 `-d` 是 `--dry-run` 或 `--declared` 而把后续参数写进 `PELICAN_DATA_DIR`）；仅保留全仓零歧义的 3 个短参：`-h`（`--help`）、`-y`（`--yes`）、`-c`（`--config`）。
   - 目标与内容参数以单数为主名，100% 兼容复数及历史别名（`--cli`/`--clis`、`--model`/`--models`/`--declared`、`--effort`/`--efforts`、`--profile`/`--profiles`、`--prompt`/`--prompts`、`--probe`/`--probes`），且同时支持逗号分隔（`--probe uuid,seed`）、重复传参（`--probe uuid --probe seed`）与 `--key=value` 写法。
3. **【修正 3：确认策略分级与非交互 TTY Fail-Fast 防挂起】**
   - **保持 `pnpm run:once`（`pelican run`）默认免交互直跑**：`run:once` 历史上一直是零交互命令（见 `AGENTS.md` 冒烟命令 `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once`），且内部已有 `openBudget()` 预算门禁保护。因此 `run:once` 跑前打印 `forecastRound` 预计成本后直接执行（支持 `--dry-run` 预演，并兼容接收 `--yes` / `-y` 不报错）。
   - **仅对 4 类高成本/外发操作要求确认**：`fingerprint fill`、`fingerprint check`、`judge --ai|--ai-only`、`sync --push`。
   - **TTY 感知确认器（`confirmOrAbort`）**：当需要确认且未传 `--yes` 时，先检查 `Boolean(process.stdin.isTTY && process.stdout.isTTY)`；若非 TTY，**严禁调用 `readline.question()`**，立即向 `stderr` 打印提示（`请显式追加 --yes 确认执行，或追加 --dry-run 预演`）并以退出码 `1` 退出；交互取消时同样设置非零退出码 `1`。
4. **【修正 4：将 `agy` 指纹零工具直出指令隔离在 `src/adapters/agy.ts`，绝不改动全局探针模板】**
   - **不修改** `src/core/model-fingerprint/probes/*.ts` 中 6 个探针的默认提示词模板，从而 100% 保护 `claude` 与 `codex` 存量基准样本及已导出基准包的可比性与 Prompt Cache 前缀。
   - 仅在 [`src/adapters/agy.ts`](../../../src/adapters/agy.ts#L108) 的 `buildAgyArgs` 中，当 `request.fingerprint === true` 时，在提示词末尾 `\n[req:...]` 之前注入零工具直出指令（保持 `agy` 的 `fill` 与 `check` 完全同环境，且静态前缀在同批次采样中 100% 命中缓存）。
   - 在 [`src/core/model-fingerprint/collect-core.ts`](../../../src/core/model-fingerprint/collect-core.ts#L150-L179) 的 `buildProbeAttemptRecord` 中，将 `reply.notes.length > 0`（含 `agy` headless 拒绝工具记录）并入 `wroteFile: true`，使其在 `Probe.resolveRejectionReason` 中准确归类为 `tool_write_instead_of_inline`，不再误报为 `empty_output`。
5. **【修正 5：CLI 临时目标合成与 Web `narrowConfig` 严格隔离】**
   - 保持 [`src/core/run-selection.ts`](../../../src/core/run-selection.ts) 中的 `narrowConfig`“只收窄不放宽”契约不变（保护 `POST /api/run` 与 `test/core/run-selection.test.ts`）。
   - 新增面向 CLI 的 `resolveCliRunConfig(config, catalog, filter)`：支持四层 `cli` 自动反查链（`config.targets` $\rightarrow$ `capabilities.json` $\rightarrow$ `config.customModels` $\rightarrow$ `builtinModels(cli)`），并使用标准 `buildTargetId(cli, model, effort, profile)`（强制 `extraArgs: []`）合成临时目标。
   - 在 `runModelFingerprintCli` 入口，当传入 `--effort` 时直接构造覆写 `modelFingerprint.effort` 的内存 `AppConfig` 副本，确保 `status` / `fill` / `check` / `self-test` / `export` 及底层 `resolveFingerprintTarget` 全链路生效。
6. **【修正 6：拆分 `src/bin/model-fingerprint.ts` 以严守 500 行文件门禁与 50 行函数门禁】**
   - `src/bin/model-fingerprint.ts` 当前已达 500/500 AST 行（剩余裕量 0 行）。将其拆分为：
     - `src/bin/model-fingerprint.ts`（主入口与重导出，保持 `parseFingerprintCliArgs` / `runModelFingerprintCli` 导出签名 100% 兼容 `test/core/model-fingerprint/collect-and-cli.test.ts`）
     - `src/bin/fingerprint-cli-args.ts`（参数解析、校验与 `--help` 文本）
     - `src/bin/fingerprint-cli-handlers.ts`（7 个子命令处理函数与格式化输出）

---

## 三、统一命令树与参数词典规范

### 3.1 统一命令树（Command Hierarchy）

```text
# 1. 统一主入口（新增 package.json "pelican": "tsx src/bin/pelican.ts"）
pnpm pelican <command> [subcommand] [flags]
  ├─ run [flags]                         # 手动执行一轮或单点鹈鹕基准（兼容别名 run:once）
  ├─ fingerprint | fp <subcmd> [flags]   # 模型指纹子命令集（兼容别名 fingerprint:<subcmd>）
  │    ├─ status                         # 查看基准样本完整度、缺口、收敛度与预计补齐费用
  │    ├─ fill                           # 采集并补齐基准样本缺口（或 --reset / --exclude / --include）
  │    ├─ check                          # 采样待测渠道并执行指纹核验
  │    ├─ self-test                      # 留一自检与跨模型成对可区分性报告
  │    ├─ rescore <checkId>              # 用当前最新基准样本重算历史核验记录
  │    ├─ export                         # 导出脱敏基准样本包 (.tar.gz)
  │    └─ import <bundlePath>            # 校验并导入外部基准样本包
  ├─ judge [flags]                       # 作品静态/渲染/AI 评审回填（兼容别名 judge:backfill）
  ├─ sync [flags]                        # 脱敏同步至公开数据仓（兼容别名 sync:data）
  ├─ preflight [flags]                   # CLI 探针、登录态、价格目录与预算自查
  ├─ onboard [cli]                       # 引导 CLI 交互登录（支持位置参数或 --cli）
  ├─ pair [open|list|revoke|revoke-all]  # 设备配对管理（兼容 --list / --revoke / --revoke-all）
  ├─ pricing [sync] [flags]              # 同步模型价格目录（兼容别名 pricing:sync）
  ├─ prompts [validate]                  # 题库校验（兼容别名 validate:prompts）
  ├─ scheduler                           # 启动定时调度器
  ├─ runner                              # 启动分容器执行器
  └─ help [command]                      # 查看总览或指定子命令帮助

# 2. 指纹聚合入口（新增 package.json "fingerprint": "tsx src/bin/model-fingerprint.ts"）
pnpm fingerprint <status|fill|check|self-test|rescore|export|import> [flags]

# 3. 既有兼容入口（package.json 100% 保留）
pnpm run:once [flags]
pnpm fingerprint:status | fingerprint:fill | fingerprint:check | ... [flags]
pnpm judge:backfill | sync:data | preflight | onboard | pair | pricing:sync | validate:prompts
```

### 3.2 跨命令共享参数词典（Unified Flag Dictionary）

| 参数类别 | 标准主名称 | 兼容别名 / 短参 | 适用命令 | 行为与默认值规范 |
| :--- | :--- | :--- | :--- | :--- |
| **帮助** | `--help` | `-h`, `help` | **全部命令** | 最高优先级拦截；打印用法、示例與参数表并 `exit(0)`，零副作用 |
| **全局路径** | `--config <path>`<br>`--data-dir <path>` | `-c <path>`<br>（无 `-d` 短参） | **全部命令** | 在进程内设置 `PELICAN_CONFIG` / `PELICAN_DATA_DIR` |
| **执行控制** | `--dry-run`<br>`--yes` | `-y` | `run`, `fp fill/check/import`, `judge`, `sync` | `--dry-run` 仅输出计划与预计成本（不被 `findActiveWork` 阻塞）；`--yes` 跳过确认 |
| **目标四元组** | `--cli <cli,...>`<br>`--model <m,...>`<br>`--effort <e,...>`<br>`--profile <p,...>` | `--clis`<br>`--models`, `--declared`<br>`--efforts`<br>`--profiles` | `run`, `fp status/fill/check/self-test/export`, `preflight` | 支持逗号分隔与重复传参；支持四层反查 `cli` 与内存合成临时目标 |
| **基准内容** | `--prompt <id,...>`<br>`--candidate <k=v>` | `--prompts` | `run` | 覆盖本轮执行的题目 ID 列表与候选集固定项 |
| **指纹内容** | `--probe <id,...>`<br>`--count <n>` | `--probes` | `fp status/fill/check/self-test/export` | 选择指纹探针子集；`--count` 限制 `fill` 单次新增样本条数 |
| **记录定位** | `--run <runId>`<br>`--id <checkId>` | `--only <text>`（`judge`） | `sync`, `judge`<br>`fp rescore` | 过滤特定轮次或核验记录 ID |

---

## 四、分模块实施清单与代码长度预算

所有新增与修改文件严格控制在 `config/code-length-policy.yaml` 阈值内（TS 文件 $\le 500$ 行，函数 $\le 50$ 行）：

| 模块路径 | 预计行数 | 核心职责 |
| :--- | :--- | :--- |
| `src/bin/cli-args.ts`（新增） | ~240 行 | 通用参数切词（剥离 `"--"`、展开 `--k=v`）、`--help`/`-h` 优先拦截、全局 `--config`/`--data-dir` 注入、Damerau-Levenshtein 相似词推荐、TTY 感知确认器 `confirmOrAbort` |
| `src/bin/pelican.ts`（新增） | ~140 行 | 统一 CLI 入口分发器（支持 `run`, `fp`, `judge`, `sync`, `preflight`, `onboard`, `pair`, `pricing`, `prompts`, `scheduler`, `runner`, `help` 及冒号别名） |
| `src/core/cli-run-selection.ts`（新增） | ~180 行 | `resolveCliRunConfig(config, catalog, filter)`：四层 `cli` 反查链、配置内匹配与免改 YAML 的 Ad-hoc `Target` 合成（使用 `buildTargetId`，隔离 Web `narrowConfig`） |
| `src/bin/run-once.ts`（改造） | ~190 行 | 接入 `--cli`/`--model`/`--effort`/`--profile`/`--prompt`/`--candidate`/`--dry-run`/`--yes`/`--help`；跑前 `findActiveWork` + `forecastRound` 成本预估；跑后打印每条调用耗时/Token/`$USD` 汇总 |
| `src/bin/model-fingerprint.ts`（拆分瘦身） | ~120 行 | 入口调度、内存 `--effort` 覆写与向后兼容重导出（`parseFingerprintCliArgs`, `runModelFingerprintCli`） |
| `src/bin/fingerprint-cli-args.ts`（拆分新增） | ~230 行 | 指纹 CLI 参数解析（支持 `--effort`、`--probe`/`--probes`、`--help`）与分级帮助文本生成 |
| `src/bin/fingerprint-cli-handlers.ts`（拆分新增） | ~280 行 | `status` / `fill` / `check` / `self-test` / `rescore` / `export` / `import` 处理函数（修复 `status` 标题、空目标提示与 `check` 失败探针诊断输出） |
| `src/core/model-fingerprint/plan.ts`（微调） | ~480 行 | `planFingerprintStatus` 对齐 `resolveFillTargets`，支持显式 `(cliFilter, modelFilter)` 的未入库目标展示 `0/target` 状态 |
| `src/adapters/agy.ts` + `src/core/model-fingerprint/collect-core.ts`（微调） | 原文件内 +15 行 | `agy` 在 `request.fingerprint === true` 时于 `\n[req:...]` 前注入零工具直出约束；`buildProbeAttemptRecord` 将 `reply.notes` 工具拒绝记入 `wroteFile: true` |
| `src/bin/sync-data.ts`, `pair.ts`, `preflight.ts`, `onboard.ts`, `pricing-sync.ts`, `validate-prompts.ts`, `scheduler.ts`, `runner.ts`, `scripts/judge-backfill.ts`（补齐护栏） | 各 +15~35 行 | 补齐 `--help`/`-h` 拦截与未知 `--flag` 严格报错，消除静默吞参触发副作用的隐患 |
