# CLI 方案审查报告 01：命令拓扑、参数正交性与业界 CLI 规范（clig.dev / POSIX / gh）

> **审查对象**：[`docs/review/cli/CLI_UX_UNIFICATION_PLAN.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/cli/CLI_UX_UNIFICATION_PLAN.md)
> **关联代码**：[`package.json`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/package.json)、[`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts)、[`src/bin/run-once.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/run-once.ts)、[`src/bin/sync-data.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/sync-data.ts)、[`src/bin/pair.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/pair.ts)、[`scripts/judge-backfill.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/judge-backfill.ts)、[`src/core/run-selection.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts)
> **参考标准**：[Command Line Interface Guidelines (clig.dev)](https://clig.dev/)、POSIX.1-2017 Utility Conventions (Guideline 1–14)、GitHub CLI (`gh`) / Heroku Oclif / Stripe CLI 规范、Node.js 22 `node:util` `parseArgs` 规范、pnpm 10/11 `@pnpm/parse-cli-args` 源码机制。

---

## 一、命令树拓扑与心智模型审查（Command Hierarchy）

### 1.1 对照 `clig.dev` 与 `gh` / `docker` / `oclif`：§3.1 三层入口设计评估

在现代 CLI 架构中，存在两种主流命令树模式：
1. **纯 `noun verb`（资源-动作）拓扑**：如 `gh pr create`、`stripe customers list`，适合管理多类平级领域实体（PR、Issue、Repo、Customer）的平台型工具。
2. **核心动词置顶 + 子系统 `noun verb` 混合拓扑**：如 `docker`（核心动作 `docker run` / `build` / `pull` 置顶，多操作子系统采用 `docker container ls` / `docker volume prune`）与 `git`。

**结论**：本项目的核心领域是「鹈鹕基准（Pelican Benchmark）」，方案 §3.1 提出的 **「`pnpm pelican <cmd>` 主入口 + `pnpm fingerprint <subcmd>` 聚合入口 + 100% 保留 `package.json` 既有冒号脚本」** 属于第二种混合拓扑，整体心智模型合理，但在词性一致性、无参/帮助子命令及冒号别名兼容上存在 **4 处结构性缺陷**：

| 编号 | 发现问题 | 规范依据（clig.dev / gh / oclif） | 修订建议 |
| :--- | :--- | :--- | :--- |
| **H-1** | **顶层子命令词性混杂（动词 vs 名词）**：<br>`run`、`judge`、`sync`、`preflight`、`onboard` 是**动词**；`fingerprint` 是带二级动词的**资源名词**；但 `pricing` 与 `prompts` 是**纯名词**却无二级动词，直接隐式执行 `pricing:sync` 与 `validate:prompts`。用户看到 `pelican prompts` 无法直觉判断是“列出题目”还是“校验题目”。 | `clig.dev` *Subcommands*：同层级命令应保持可预测的动词/名词语义，避免歧义。 | 1. 将 `pricing` 与 `prompts` 支持显式二级动词（默认兼容省略）：<br>   - `pelican pricing [sync]`（同时兼容 `pelican pricing:sync`）<br>   - `pelican prompts [validate\|check]`（同时兼容 `pelican validate:prompts`）<br>2. 在 `pelican` 主分发器中**原样兼容所有既有 `package.json` 冒号脚本名**（如 `pnpm pelican run:once`、`pnpm pelican sync:data`、`pnpm pelican judge:backfill`、`pnpm pelican fingerprint:check`），消除用户记忆切换成本。 |
| **H-2** | **`pair` 命令使用开关切换动作（`--list` / `--revoke` / `--revoke-all`）**：<br>[`src/bin/pair.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/pair.ts#L12-L25) 采用 POSIX 早期 `gpg` 风格的动作型 flag，且与 `fingerprint <subcmd>` 的子命令心智不一致。 | `clig.dev` *Subcommands* & `gh auth`：对同一资源的查询与写操作（`open` / `list` / `revoke`）优先使用子命令而非互斥动作开关。 | 在保留 `pnpm pair --list` / `--revoke <id>` / `--revoke-all` 100% 向后兼容的前提下，同时支持子命令形式：`pnpm [pelican] pair [open \| list \| revoke <id> \| revoke-all]`。 |
| **H-3** | **缺失无参引导与 `help [subcmd]` 子命令**：<br>当前 [`parseFingerprintCliArgs`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts#L112-L117) 在用户裸敲 `pnpm fingerprint` 时直接报错 `未知或缺失子命令：` 并以 Exit Code `1` 退出；§3.1 亦未定义 `pnpm pelican`（无参）与 `pnpm pelican help <cmd>` 的行为。 | `clig.dev` *Help*：<br>1. 需要子命令的程序在无参调用时应打印简明帮助；<br>2. 类 `git` 多子命令工具必须同时支持 `myapp help <subcmd>`、`myapp <subcmd> --help`、`-h`。 | 1. 裸敲 `pnpm pelican` 或 `pnpm fingerprint`（无任何参数）时，输出简明命令树与常用示例（退出码 `0`）；<br>2. 支持 `pnpm pelican help [cmd]` 与 `pnpm fingerprint help [subcmd]`，等价于对应命令的 `--help`。 |
| **H-4** | **`src/bin/model-fingerprint.ts` 已触及 500 行门禁上限**：<br>[`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts) 当前已达 **501 行**，而 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml#L4-L11) 强制要求 `.ts` 文件 ≤ 500 行、函数 ≤ 50 行。直接在原文件追加 `--help`、`--effort` 将触发 `pnpm check:length` 失败。 | 仓库质量门禁 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml) | 方案 §4 必须明确模块拆分计划：将共享解析器抽至 `src/bin/cli-args.ts`，并将模型指纹 CLI 的参数解析/帮助文案拆至 `src/bin/model-fingerprint-args.ts`（或按子命令拆分子模块），确保所有 `.ts` 文件严格 ≤ 500 行、函数 ≤ 50 行。 |

---

### 1.2 `pnpm` 参数透传与截留机制深度核查（`pnpm <script> --flag` vs `pnpm <script> -- --flag`）

结合本机 `pnpm`（`engines: pnpm >= 10`，实测 `pnpm 11.24.0`）的 `@pnpm/parse-cli-args` + `nopt` 源码剖析与真机命令实测，方案必须明确以下 **4 条真实机制与防坑规则**：

#### 机制 1：`pnpm <script> --flag`（不加 `--`）时，`<script>` 之后的参数会发生什么？
- **真实行为**：与 `npm run <script> --flag`（`npm` 会吞掉 `--flag` 并转为 `npm_config_*` 环境变量）完全不同，`pnpm` 在解析命令时将 `"run"` 列入 `SPECIALLY_ESCAPED_CMDS`，并在第二阶段调用 `nopt` 时将 `<script>` 名称注入 `escapeArgs: [<script>]`。
- 一旦 `nopt` 扫描到 `<script>`（例如 `run:once`、`pelican`、`fingerprint`、`sync:data`），**立即执行 `break` 停止解析 pnpm 自身选项**，将 `<script>` 之后的**全部参数原封不动追加给底层脚本**。
- **实测验证**：
  ```bash
  # 以下参数放在脚本名之后、不加 `--` 时，pnpm 均【不会截留】，100% 传给底层脚本：
  pnpm run:once --cli agy --config foo.yaml --filter bar --silent --help -h -c foo.yaml -d /tmp -y
  ```

#### 机制 2：哪些情况下参数或命令会被 `pnpm` 自身截留？（三大截留雷区）
1. **雷区 A：参数被写在 `<script>` 名称之前（`pnpm <flag> <script>`）**：
   - 若用户写成 `pnpm --config foo.yaml run:once` 或 `pnpm -c foo.yaml run:once`，`pnpm` 会在进入脚本前报错：`[ERROR] Unknown option: 'config' / 'c'`。
   - 若用户写成 `pnpm --filter foo run:once`（或 `-F`）、`pnpm --silent run:once`（或 `-s`）、`pnpm -d run:once`（被 `pnpm` 解释为 `--loglevel=info`）、`pnpm -C /tmp run:once`（或 `--dir`）、`pnpm -y run:once`、`pnpm -h run:once`，这些位于 `<script>` 之前的参数会被 `pnpm` 自身截留消费，**永远不会传给脚本**。
   - **防坑结论**：在帮助文档与错误提示中，必须引导用户将 `--config` / `-c`、`--data-dir` 等所有参数写在 `pnpm pelican <cmd>` 或 `pnpm <script>` **之后**。
2. **雷区 B：`package.json` 脚本名与 `pnpm` 内置命令或短别名重名**：
   - `pnpm` 只有在首个位置参数不属于内置命令时，才会触发 `fallbackCommand = "run"`。
   - 若在 `package.json` 中定义与 `pnpm` 内置命令同名的脚本（如 `run`、`import`、`config`、`env`、`init`、`fetch`、`prune`、`clean`、`list`、`ls`、`why`、`deploy`、`pack`、`publish`），执行 `pnpm <name>` 会直接调用 `pnpm` 内置命令而非 `package.json` 脚本！
   - 若执行 `pnpm start --help`（`start` 是 `pnpm` 内置命令且不在 `SPECIALLY_ESCAPED_CMDS` 中），`--help` 会被 `pnpm` 截留并打印 `pnpm start` 的帮助。
   - **防坑结论**：严禁在 `package.json` 顶层新增 `run`、`import`、`config` 等同名脚本；必须通过 `pnpm pelican run` / `pnpm run:once` 以及 `pnpm fingerprint import` / `pnpm fingerprint:import` 暴露。
3. **雷区 C：跨包管理器的肌肉记忆（`npm run` 习惯带入 `pnpm`）**：
   - 习惯 `npm` 或遵循本仓库旧文档（如 `AGENTS.md` 中 `pnpm judge:backfill -- --dry-run`、`pnpm issue:new -- --type feat`）的用户会主动输入 `--`。

#### 机制 3：`pnpm <script> -- --flag`（加 `--`）的真实副作用与 `"--"` 游走位置陷阱
- **真实行为**：自 `pnpm v7+`（含 `pnpm 10` / `pnpm 11`）起，当用户执行 `pnpm <script> -- --flag` 时，`pnpm` **不会剥离首个 `"--"`**，而是将 `"--"` 作为字面量参数原样传进子进程的 `process.argv`！
- **关键陷阱（`"--"` 出现在不同下标位置）**：
  不同入口下，字面量 `"--"` 在 `process.argv.slice(2)` 中的下标位置**并不固定在 `argv[0]`**：
  1. `pnpm run:once -- --cli agy --help`
     → `process.argv.slice(2)` 为 `["--", "--cli", "agy", "--help"]`（`"--"` 在 **`argv[0]`**）
  2. `pnpm fingerprint:check -- --cli agy --help`（因 `package.json` 定义为 `"tsx src/bin/model-fingerprint.ts check"`）
     → `process.argv.slice(2)` 为 `["check", "--", "--cli", "agy", "--help"]`（`"--"` 在 **`argv[1]`**）
  3. `pnpm pelican run -- --cli agy --help`
     → `process.argv.slice(2)` 为 `["run", "--", "--cli", "agy", "--help"]`（`"--"` 在 **`argv[1]`**）
  4. `pnpm pelican fp check -- --cli agy --help`
     → `process.argv.slice(2)` 为 `["fp", "check", "--", "--cli", "agy", "--help"]`（`"--"` 在 **`argv[2]`**）
- **防坑要求**：方案 §4.1 的 `stripPnpmSeparator(argv)` **绝对不能只剥离 `argv[0] === "--"`**，必须对整个 `argv` 过滤掉 `"--"`（`argv.filter((arg) => arg !== "--")`，与现有 [`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts#L113) 及 [`scripts/issue-lib.mjs`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/issue-lib.mjs#L192) 保持一致），并在帮助文档中统一展示免 `--` 的现代简写（如 `pnpm pelican run --cli agy`、`pnpm fingerprint check --cli agy`），同时底层 100% 兼容带 `--` 的调用。

---

## 二、参数词典正交性与单复数/别名规范（Flag Orthogonality）

### 2.1 现有方案 §3.2 的参数正交性问题诊断

审查方案 §3.2 参数表与各脚本现有实现，发现 **4 处不一致与命名冲突隐患**：

1. **单复数主名称不一致**：
   - 方案 §3.2 中，`--cli`、`--model`、`--effort`、`--profile`、`--prompt`、`--run` 均以**单数**作为主参数名；唯独探针选择以**复数** `--probes` 作为主参数名（`--probe` 为别名）。
   - 同时，`--model`、`--effort`、`--profile`、`--run`、`--candidate` 未提供复数别名（当用户输入 `--models a,b` 或 `--runs id1,id2` 时会报错）。
2. **多值传参方式不统一**：
   - [`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts#L176-L186) 的 `--probes`、`--exclude`、`--include` 仅支持逗号分隔 `a,b`，若用户按 POSIX / `gh` 习惯重复传参 `--probe uuid --probe seed`，后者会直接覆盖前者！
   - 反之，[`src/bin/sync-data.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/sync-data.ts#L66-L70) 的 `--run` 仅支持重复传参 `--run id1 --run id2`，不支持逗号分隔 `--run id1,id2`！
3. **短参数 `-d` 严重污染与误触风险（高危）**：
   - 方案 §3.2 将 `-d <path>` 作为 `--data-dir <path>` 的全局短参数。
   - 对照 `clig.dev` 标准短参数表：`-d` 在业界通用代表 `--debug`；而在本项目中，用户极易将 `-d` 误认为 `--dry-run` 或 `--declared`！
   - 一旦用户输入 `pnpm pelican run -d --cli agy`（本意为 `--dry-run`），或 `pnpm fingerprint check -d gemini-3.8-flash`（本意为 `--declared`），`-d` 会把 `--cli` 或模型名静默设为 `PELICAN_DATA_DIR` 环境变量并继续真机执行！
4. **文件参数与过滤参数在子命令间不对称**：
   - `fingerprint export` 与 `fingerprint import`：[`model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts#L156-L190) 中 `import` 支持位置参数 `<bundlePath>` 或 `--file` / `--out`，而 `export` 只支持 `--out` / `--file`、不支持位置参数 `[bundlePath]` 也不支持 `clig.dev` 标准 `-o, --output <path>`。
   - `run` 缺少 `--target <targetId,...>`：Web 端 [`RunSelection`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts#L21-L30) 以 `targetIds` 为核心，CLI 端除支持四元组 `--cli` / `--model` / `--effort` / `--profile` 外，也应支持直接按 `--target` / `--targets` 指定目标 ID。
   - `judge`（[`scripts/judge-backfill.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/judge-backfill.ts)）僅有 `--only <text>` 子串匹配，缺少与 `sync` / `run` 对齐的 `--run <runId>` 及 `--cli` / `--model` / `--effort` / `--prompt` 精确筛选。

### 2.2 正交参数词典修订规范（Recommended Orthogonal Specification）

#### 规则 1：单复数双通 + 多值三合一（CSV + 重复传参 + `=` 赋值）
所有集合/列表型筛选参数统一遵循 **「文档主推单数，解析器双通单复数，取值同时支持逗号分隔与多次重复传参并保序去重」**：

| 语义维度 | 标准主名（单数） | 兼容别名（复数/历史别名） | 支持的传参形态（全部等价并合并去重） |
| :--- | :--- | :--- | :--- |
| **CLI 适配器** | `--cli` | `--clis` | `--cli agy,codex` / `--cli agy --cli codex` / `--cli=agy` |
| **模型标识** | `--model` | `--models`, `--declared` | `--model m1,m2` / `--model m1 --model m2` / `--declared m1` |
| **思考强度** | `--effort` | `--efforts` | `--effort low,high` / `--effort low --effort high` |
| **上游渠道** | `--profile` | `--profiles` | `--profile default,p1` / `--profile default --profile p1` |
| **目标 ID** | `--target` | `--targets` | `--target id1,id2` / `--target id1 --target id2` |
| **提示词题目** | `--prompt` | `--prompts` | `--prompt classic-v1,fe-ai-v1` / `--prompt classic-v1 --prompt fe-ai-v1` |
| **候选固定项** | `--candidate` | `--candidates` | `--candidate p1=c1,p2=c2` / `--candidate p1=c1 --candidate p2=c2` |
| **指纹探针** | `--probe` | `--probes` | `--probe uuid,seed` / `--probes uuid,seed` / `--probe uuid --probe seed` |
| **轮次 ID** | `--run` | `--runs` | `--run r1,r2` / `--run r1 --run r2` |
| **样本排除/包含** | `--exclude` / `--include` | — | `--exclude req1,req2` / `--exclude req1 --exclude req2` |

> **向后兼容注意**：[`test/core/model-fingerprint/collect-and-cli.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/collect-and-cli.test.ts#L336) 断言了 `--reset` 的报错文本 `/--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,\.\.\.>/`。因此解析层应同时接受 `--probe` 与 `--probes`，且该条特定校验错误文案需保留 `--probes <probe,...>` 字样以确保既有测试 100% 通过。

#### 规则 2：语义角色别名冲突校验与位置参数对称化
1. **`--model` vs `--declared`**：当用户同时传入 `--model` 与 `--declared` 且值不一致时，必须显式报错 `不能同时指定不一致的 --model 与 --declared`，不可静默覆盖。
2. **`-o, --output` vs `--out` vs `--file` vs `[bundlePath]`**：
   - `fingerprint export [bundlePath]`：支持 `-o <path>`、`--output <path>`、`--out <path>`、`--file <path>` 以及可选位置参数 `[bundlePath]`。
   - `fingerprint import <bundlePath>`：支持位置参数 `<bundlePath>`、`--file <path>`、`-f <path>`（兼容 `--out` / `--output`）。
3. **`fingerprint rescore <checkId>`**：同时支持位置参数 `<checkId>` 与 `--id <checkId>`（若两者同时提供且不一致则报错）。

#### 规则 3：克制且无歧义的短参数分配（遵循 `clig.dev`）
- **保留的短参数**：
  - `-h` → `--help`（全局唯一含义，严禁挪用）
  - `-c <path>` → `--config <path>`（全局配置文件路径覆盖）
  - `-y` → `--yes`（跳过交互式确认）
  - `-n` → `--dry-run`（可选，遵循 POSIX `make -n` / `rsync -n` / `clig.dev` 规范）
  - `-o <path>` → `--output <path>`（`fingerprint export` 输出文件路径）
- **必须移除的短参数**：
  - **移除 `-d <path>`（`--data-dir` 仅保留长参数 `--data-dir <path>`）**，彻底杜绝用户误把 `-d` 当作 `--dry-run`、`--debug` 或 `--declared` 造成数据目录错位与真实扣费。

---

## 三、Node 22 内置 `node:util` `parseArgs` 适用性与边界核查

### 3.1 实测暴露的 `node:util` `parseArgs`（`strict: true`）五大边界陷阱

在 Node.js 22 环境下对 `node:util` 的 `parseArgs({ strict: true, allowPositionals: true })` 进行真机实测后，验证出 **不能直接裸调 `parseArgs` 替代手写解析器**，原因在于以下 5 个边界行为：

| 陷阱编号 | 输入用例 | Node 22 `parseArgs` 原生行为 | 为什么在当前项目中不可接受 |
| :--- | :--- | :--- | :--- |
| **P-1** | `["--", "--cli", "agy", "--dry-run"]`<br>（由 `pnpm run:once -- --cli agy --dry-run` 产生） | 将 `"--"` 视为 POSIX 选项终止符，后续全部落入 `positionals: ["--cli", "agy", "--dry-run"]`，`values.dryRun` 为 `undefined`！ | 若命令允许位置参数（如 `rescore`、`import`、`onboard` 或带子命令的入口），`--dry-run` 与 `--help` 会被静默吞进 `positionals`！ |
| **P-2** | `["--cli", "--help"]` 或 `["--cli", "-h"]` 或 `["--bad-flag", "--help"]` | 抛出 `ERR_PARSE_ARGS_INVALID_OPTION_VALUE: Option '--cli' argument is ambiguous` 或 `ERR_PARSE_ARGS_UNKNOWN_OPTION`，**拒绝打印帮助**（Exit Code `1`）。 | 违反 `clig.dev` 铁律（*"you should be able to add `-h` to the end of anything and it should show help"*）及方案 §2.3 目标。 |
| **P-3** | `["--count", "-1"]` | 抛出英文异常 `ERR_PARSE_ARGS_INVALID_OPTION_VALUE: Option '--count' argument is ambiguous`（将 `-1` 误判为短选项 `-1`）。 | 原有 [`model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts#L178-L180) 能识别 `-1` 并抛出清晰的中文领域错误 `--count 必须为非负整数，收到：-1`。 |
| **P-4** | `["--cli="]` 或 `["--model", "   "]` | `parseArgs` 正常通过并返回 `values.cli = ""` 或 `"   "`。 | 必须配合后置 `requireNonEmptyTrimmed` 拦截空字符串。 |
| **P-5** | 长参数别名（`--probe` / `--probes`）与中文报错契约 | 1. `options` 不支持多长名指向同一属性；<br>2. 未知选项抛英文 `Unknown option '--foo'`。 | 仓库全套 CLI 与单测均约定中文错误消息（如 `未知选项：--foo`、`参数 --cli 缺少取值`）。 |

### 3.2 推荐解析器架构：基于 Schema 的轻量封装（`src/bin/cli-args.ts`）

无论是底层调用 `parseArgs({ tokens: true })` 还是采用表驱动（Schema-driven）状态机，`src/bin/cli-args.ts` 都应采用统一的声明式 Schema 接口，严格执行以下 **4 步流水线**：

```ts
export interface CliFlagSpec {
  /** 主参数名（不含 --，如 "probe"） */
  name: string;
  /** 兼容长别名（不含 --，如 ["probes"]）与短别名（不含 -，如 ["c"]） */
  aliases?: readonly string[];
  short?: string;
  type: "boolean" | "string" | "string[]";
}
```

1. **Step 1：剥离 `pnpm` `"--"` 分隔符**：
   - `const tokens = rawArgv.filter((arg) => arg !== "--");`（消除任意下标位置的 `"--"`）。
2. **Step 2：最高优先级扫描 `--help` / `-h` 与 `help` 子命令**：
   - 只要 `tokens` 中包含 `"--help"` 或 `"-h"`，或者首词为 `"help"`（如 `pelican help run` / `fingerprint help check`），**无视其余未闭合参数或未知参数**，立即定位目标命令/子命令并输出其帮助文档，以退出码 `0` 结束。
3. **Step 3：统一展开 `--key=value` 并按 Schema 严格校验**：
   - 将 `--flag=val` 规范化拆分为 `flag` + `val`（注意保留 `--candidate p1=c1` 中值内部的 `=`）；
   - 若遇到未知的 `-*` / `--*`（且不是合法负数值），立即抛出中文错误 `未知选项：${flag}（运行 --help 查看可用参数）`，并可附带编辑距离 ≤ 2 的 `Did you mean --xxx?` 提示；
   - 若键值型参数后方缺失值，或紧跟另一个已知 `--flag` / `-short`，抛出 `参数 ${flag} 缺少取值`；
   - 对 `type: "string[]"` 的参数，自动支持重复传参与逗号分隔（`flattenCsvFlagValues`）。
4. **Step 4：注入全局路径覆盖与校验位置参数上限**：
   - 若解析出 `--config` / `-c`，立即写入 `process.env.PELICAN_CONFIG`；若解析出 `--data-dir`，立即写入 `process.env.PELICAN_DATA_DIR`（必须在调用 `loadConfig()` 与 `configPath()` 之前执行）；
   - 校验剩余 `positionals` 数量是否超出当前命令允许的上限，超出时立即抛出 `无法识别的位置参数：${arg}`。

---

## 四、针对 `CLI_UX_UNIFICATION_PLAN.md` 的修订清单（Actionable Checklist）

### Must-Fix（阻塞性问题，必须在方案定稿与编码前修正）

- [ ] **[MF-1] 移除 `--data-dir` 的 `-d` 短参数**：在方案 §3.2 与 §4.1 中，将全局数据目录参数定为仅长参数 `--data-dir <path>`（保留 `-c, --config <path>`），防止用户误敲 `-d`（误以为是 `--dry-run`、`--debug` 或 `--declared`）导致静默篡改 `PELICAN_DATA_DIR`。
- [ ] **[MF-2] 修正 `stripPnpmSeparator` 規則以覆盖非首位的 `"--"`**：在方案 §4.1 中明确 `pnpm fingerprint:check -- --cli agy` 的 `"--"` 位于 `argv[1]`、`pnpm pelican fp check -- --cli agy` 的 `"--"` 位于 `argv[2]`，因此必须使用 `argv.filter((arg) => arg !== "--")` 全量过滤，严禁只判断 `argv[0] === "--"`。
- [ ] **[MF-3] 明确 `pnpm` 参数截留边界与防坑说明**：在方案 §3.1 / §4.1 补充说明：
  1. `pnpm <script> --flag`（参数在脚本名之后）无需加 `--`，`pnpm 10/11` 会将包括 `--config`、`--help`、`-c` 在内的所有参数原样传给脚本；
  2. 只有当参数写在 `<script>` **之前**（如 `pnpm --filter foo <script>`、`pnpm -c foo <script>`）或脚本名与 `pnpm` 内置命令冲突（如 `run`、`import`、`start`）时才会被 `pnpm` 截留；
  3. 帮助文档示例统一采用不带 `--` 的简洁写法（如 `pnpm pelican run --cli agy`、`pnpm fingerprint check --cli agy`）。
- [ ] **[MF-4] 统一多值参数的单复数双通与「逗号 + 重复传参」三合一归一化**：在方案 §3.2 与 §4.1 中，将 `--probe` / `--probes`、`--prompt` / `--prompts`、`--model` / `--models` / `--declared`、`--effort` / `--efforts`、`--profile` / `--profiles`、`--target` / `--targets`、`--run` / `--runs`、`--candidate` / `--candidates` 全部设为单复数互通，且统一支持 `--probe a,b` 与 `--probe a --probe b` 混用去重（同时保留 `--reset` 报错文案中的 `--probes <probe,...>` 以兼容既有测试）。
- [ ] **[MF-5] 规避 `node:util` `parseArgs` 的 5 个严格模式陷阱**：在方案 §4.1 中明确 `--help` / `-h` 必须在参数值消费前以最高优先级短路返回（确保 `pnpm pelican run --cli --help` 也能正常展示帮助而非报 `missing value`），并正确处理 `--count -1` 与 `--flag=` 空串校验。
- [ ] **[MF-6] 制定满足 `config/code-length-policy.yaml`（≤500 行/文件、≤50 行/函数）的模块拆分方案**：[`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts) 已达 501 行，方案 §4 必须明确将其拆分为 `src/bin/cli-args.ts`（通用解析与帮助渲染）+ `src/bin/model-fingerprint-args.ts`（指纹参数与帮助定义）+ `src/bin/model-fingerprint.ts`（命令执行编排）。

### Should-Fix（体验与一致性增强建议）

- [ ] **[SF-1] 补齐 `help` 子命令与裸命令（No-Arg）帮助行为**：支持 `pnpm pelican`（无参）、`pnpm fingerprint`（无参）、`pnpm pelican help [cmd]`、`pnpm fingerprint help [subcmd]` 均输出帮助并以 Exit Code `0` 退出。
- [ ] **[SF-2] 消除 `pelican` 顶层子命令的名词/动词歧义并兼容冒号别名**：`pelican pricing` 支持可选动词 `pelican pricing [sync]`，`pelican prompts` 支持 `pelican prompts [validate]`，`pelican pair` 支持 `pair [open|list|revoke <id>|revoke-all]`；且 `pnpm pelican <cmd>` 直接兼容 `run:once`、`sync:data`、`judge:backfill`、`pricing:sync`、`validate:prompts`、`fingerprint:*` 冒号写法。
- [ ] **[SF-3] 对称化 `fingerprint export` 与 `import` 的文件参数**：为 `export` 补充标准 `-o, --output <path>` 与可选位置参数 `[bundlePath]`，与 `import <bundlePath>` 保持对称。
- [ ] **[SF-4] 为 `pelican run` 补充 `--target <id,...>` 并为 `pelican judge` 补充 `--run` 与目标四元组过滤**：使 `run`、`judge`、`sync`、`fingerprint` 四大核心命令的过滤词典完全正交。
