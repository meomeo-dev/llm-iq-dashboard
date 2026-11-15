# CLI 方案专项审查报告（二）：安全护栏、TTY 感知、自动化兼容性与架构约束（AGENTS.md / ACR-024）

| 审查维度 | 结论与评级 |
| :--- | :--- |
| **审查角色** | CLI 方案审查员 2（安全护栏、TTY 感知、自动化兼容性与架构约束挑刺官） |
| **审查对象** | [`docs/review/cli/CLI_UX_UNIFICATION_PLAN.md`](./CLI_UX_UNIFICATION_PLAN.md)（Draft v1） |
| **对标基准** | [Command Line Interface Guidelines (clig.dev)](https://clig.dev/)、POSIX / BSD `sysexits.h`、Terraform / Pulumi / GitHub CLI (`gh`) 自动化规范、[`AGENTS.md`](../../../AGENTS.md)、[`ACR-024`](../../architecture/revisions/ACR-024-model-fingerprint.md)、[`model-fingerprint-design.md`](../../research/model-fingerprint/model-fingerprint-design.md) |
| **总体结论** | **有条件通过（需完成 5 项 Must-Fix 与 4 项 Should-Fix 修订后方可进入实施）** |

---

## 一、业界 CLI 工程标准对标（安全护栏、TTY 感知与退出码）

结合 [clig.dev](https://clig.dev/) 以及 Terraform（`-auto-approve` / `-input=false`）、Pulumi（`--yes` / `--non-interactive`）、GitHub CLI（`gh`）在破坏性/计费操作（Cost-incurring & Mutating Operations）上的工程实践，现代 CLI 必须同时满足**「人类交互防呆」**与**「CI / 定时任务 / AI Agent 无人值守零挂起」**两条硬约束：

1. **TTY 上下文感知铁律（Prompt if you can, never hang a pipe）**：
   - 任何交互式询问（如 `[y/N]`）发起前必须同时检查 `Boolean(process.stdin.isTTY && process.stdout.isTTY)`。
   - 当处于非交互环境（`!process.stdin.isTTY`，如 CI 流水线、子代理 `run_command` 管道、后台重定向、Docker 无 `-it` 容器）且未传 `--yes` 时，**严禁调用 `readline.question()` 等待输入**——否则在管道保持打开但无写入时会**永久挂起（infinite hang）**，在 `stdin` 为 `/dev/null` 或立即关闭（EOF）时会在 Node.js `node:readline/promises` 中抛出未捕获的 `AbortError: readline was closed`（`ERR_USE_AFTER_CLOSE`）。
2. **区分「单步直跑命令（Run Verb）」与「批量采样/外部变更命令（Batch / Push Verb）」**：
   - 本身语义即为「立即执行一次且受预算门禁保护」的动作命令（如 `pnpm run:once`）应保持非交互直跑，通过跑前预检摘要 + `--dry-run` 提供可观测性，同时兼容接收 `--yes` / `-y`（作为幂等无副作用开关），不破坏既有自动化脚本。
   - 单次可能发起数十上百次调用且不受 `budget.perRoundUsd` 约束的批量采样（`fingerprint fill/check`）、消耗裁判配额的批量 AI 回填（`judge --ai` / `--ai-only`）、以及公开发布数据的远端推送（`sync --push`），才需要安全确认护栏。
3. **语义化退出码（POSIX & `sysexits.h`）**：
   - `0`（`EX_OK`）：成功执行，或显式请求 `--help` / `--dry-run` 正常完成。
   - `1`：运行时错误、活跃作业互斥冲突（`findActiveWork()`）、或**用户在交互确认中选 `N` 取消 / 非 TTY 缺少 `--yes` 被拦截**（绝不能在未执行请求动作时返回 `0`，否则 `cmd1 && cmd2` 链式脚本会在 `cmd1` 被取消后继续错误执行 `cmd2`）。
   - `2`（或 `64` `EX_USAGE`）：命令行参数语法错误（未知 `--flag`、缺少必填参数、互斥参数冲突）；在 `sync:data` 中需注意与既有的「存在被拒轮次/冲突（Exit Code 2）」兼容。

---

## 二、重点问题一：交互确认 `[y/N]` 与非交互（CI / 定时 / 子代理）兼容性陷阱核查

### 2.1 给 `pnpm run:once` 加上强制 `[y/N]` 确认是否会破坏既有脚本与无 TTY 环境？

**结论：会直接破坏既有工作流与无人值守脚本，属于 P0 级回归隐患。**

具体证据链如下：
1. **既有契约一直是零交互直跑**：
   - [`src/bin/run-once.ts`](../../../src/bin/run-once.ts#L14-L33) 历史上从不弹出 `[y/N]`，而是加载配置后直接调用 `executeRun(config, { trigger: "manual" })`。
   - [`AGENTS.md`](../../../AGENTS.md)「常用命令」以及 `.agents/skills/arch-revision/SKILL.md`、`.agents/skills/sprint-acceptance/SKILL.md` 中的回归与验收标准命令全部写死为：
     ```bash
     PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once
     ```
   - 方案 [`CLI_UX_UNIFICATION_PLAN.md`](./CLI_UX_UNIFICATION_PLAN.md#L112) 在 §3.2 参数表中将 `--yes, -y`（跳过交互式 `[y/N]` 确认）列为适用 `run, fp fill, fp check, fp import, judge, sync`，而 §4.2 又未明确 `run:once` 默认是否弹框。若对 `run:once` 默认开启 `[y/N]` 拦截，所有未带 `--yes` 的冒烟命令、子代理调用与管道脚本都会立即挂起或失败。
2. **`run:once` 已有内建预算闸门保护**：
   - 与模型指纹不同，[`executeRun`](../../../src/core/runner.ts#L226) 在启动时已接入 `openBudget(config.budget, startedAt)`（受 `budget.perRoundUsd`、`budget.perDayUsd` 及宿主机 `PELICAN_CEILING_*` 强制约束）。
3. **无副作用或纯本地操作同样不应乱加 `[y/N]`**：
   - `judge:backfill` 在**未传 `--ai` / `--ai-only`** 时仅运行本地静态 AST 解析与无头 Chromium 渲染量测（[`scripts/judge-backfill.ts`](../../../scripts/judge-backfill.ts#L116-L152)），零模型配额消耗；
   - `sync:data` 在**未传 `--push`** 时仅向本地 `../llm-iq-data` 仓库导出提交（[`src/bin/sync-data.ts`](../../../src/bin/sync-data.ts#L226-L255)），不触发公开发布；
   - `fingerprint import` 会自动将将被覆盖的探针移入 `archive/`（[`src/bin/model-fingerprint.ts`](../../../src/bin/model-fingerprint.ts#L434-L457)），零配额消耗且可逆。
   - 若对这三者的默认模式加 `[y/N]`，同样会破坏现有的单测与本地脚本。

### 2.2 `model-fingerprint.ts` 中 `defaultInteractiveConfirm` 在 `!process.stdin.isTTY` 下的真实行为剖析

查看 [`src/bin/model-fingerprint.ts`](../../../src/bin/model-fingerprint.ts#L214-L222) 现有实现：

```ts
async function defaultInteractiveConfirm(promptText: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${promptText} [y/N]: `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    rl.close();
  }
}
```

当在非交互环境（`!process.stdin.isTTY`，例如后台任务、CI 或管道未传 `--yes`）触发该函数时，按父进程对 `stdin` 的处理方式会出现**三种反直觉故障**：

| 非 TTY 场景 | Node.js `readline/promises` 实际行为 | 当前代码后果 | 严重度 |
| :--- | :--- | :--- | :--- |
| **场景 1：`stdin` 为打开的管道但无输入写入**（如后台任务、部分 Agent 执行器、无 `-i` 容器） | `rl.question()` 向 `stdout` 打印提示词后**无限期等待 `stdin` 数据** | **进程永久挂起（Hang）**，直至外部超时强杀 | **P0** |
| **场景 2：`stdin` 为 `/dev/null` 或空流立即 EOF**（如 `< /dev/null`、CI 默认闭合流） | `readline` 在收到换行符前触发 `close` 事件，`rl.question()` 直接 reject 抛出 `AbortError: readline was closed`（或 `ERR_USE_AFTER_CLOSE`） | 因未捕获 `rl.question` 异常，直接崩溃打印生硬的英文内部错误 `readline was closed`（Exit Code 1），**无任何 `--yes` 引导提示** | **P1** |
| **场景 3：`stdin` 含空换行后 EOF**（如 `echo "" \| pnpm fingerprint:fill`）或用户在 TTY 按 `N` | `rl.question()` 返回 `""`，`defaultInteractiveConfirm` 返回 `false`，打印 `已取消补齐作业。` 后正常 `return` | **进程以退出码 `0`（成功）退出！** 上游自动化脚本误以为 `fill` / `check` 已成功完成 | **P1** |

### 2.3 TTY vs 非 TTY 确认策略精细化设计矩阵（最佳实践方案）

建议在共享基底 `src/bin/cli-args.ts`（或 `src/bin/cli-confirm.ts`）中统一实现 TTY 感知确认器，并按命令风险分级 적용：

| 命令与模式 | 是否接受 `--yes` / `-y` | TTY 交互终端（`stdin.isTTY && stdout.isTTY`）默认行为 | 非 TTY 环境（`!stdin.isTTY`）未传 `--yes` 时行为 |
| :--- | :--- | :--- | :--- |
| `run` (`run:once`) | 接受（幂等兼容，免报错） | **直接执行**（跑前打印目标、题目与 `forecastRound()` 预计费用；已有 `budget` 门禁保护，不弹 `[y/N]`） | **直接执行**（100% 兼容 `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once`） |
| `fp fill`（`plannedCalls > 0`）<br>`fp check`（`executableProbes > 0`） | 接受（跳过确认） | 打印计划与预计 `$USD` 后弹出 `[y/N]`；选 `N` 或 `Ctrl+D` 时打印取消提示并设 **`process.exitCode = 1`** | **禁止调 `readline`！立即向 `stderr` 报错**：<br>`非交互终端无法弹出确认，请显式传入 --yes（或 -y）确认执行，或传入 --dry-run 仅预演计划` 并以 **退出码 `1`** 退出 |
| `judge`（仅当传了 `--ai` 或 `--ai-only`） | 接受（跳过确认） | 跑前统计待送 AI 裁判的件数，弹出 `[y/N]` 确认（符合 `AGENTS.md`「裁判调用真实消耗配额…只在用户明确要求时按轮运行」） | 未传 `--yes` 时立即向 `stderr` 报错并退出码 `1`（不传 `--ai` 的纯代码层回填始终免确认直跑） |
| `sync`（仅当传了 `--push`） | 接受（跳过确认） | 导出完成后、执行 `git push` 公开发布前，若未传 `--yes` 则弹出 `[y/N]` 确认（符合 `AGENTS.md`「向数据仓推送会公开发布数据，须先经人工确认」） | 未传 `--yes` 时拒绝推送并报错退出码 `1`（不传 `--push` 的本地同步始终免确认直跑） |
| `fp import` / `fp status` / `fp self-test` / `fp rescore` / `fp export` | `fp import` 接受 `--yes`（幂等兼容） | **直接执行**（零模型配额消耗，`import` 自动归档旧样本至 `archive/`） | **直接执行** |

**推荐的 `confirmExecution` 标准实现**：
```ts
export async function confirmExecution(
  promptText: string,
  options: { yes?: boolean; customConfirm?: (prompt: string) => Promise<boolean> },
): Promise<boolean> {
  if (options.yes) return true;
  if (options.customConfirm) return options.customConfirm(promptText);
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      `${promptText}\n错误：当前为非交互终端（stdin/stdout 非 TTY），无法等待人工确认。` +
        "若确认发起调用，请追加 --yes（或 -y）；若仅预演计划，请追加 --dry-run。",
    );
  }
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  try {
    const answer = await rl.question(`${promptText} [y/N]: `);
    return /^y(es)?$/i.test(answer.trim());
  } catch {
    // 捕获 Ctrl+D / EOF 导致的 AbortError ("readline was closed")，按取消处理
    return false;
  } finally {
    rl.close();
  }
}
```
> **注意**：交互提示输出流建议使用 `output: process.stderr`，避免污染重定向的 `stdout`；且当 `confirmExecution` 返回 `false` 时，调用方应设置 `process.exitCode = 1`。

---

## 三、重点问题二：修改探针提示词（方案 §4.4）的架构合规性与根因核查

### 3.1 根因对比：为什么 `agy` 在鹈鹕基准（`run:once`）能画出 SVG，而在指纹 `uuid` 探针里却试图调 `run_command`？

通过对比鹈鹕基准链路（[`src/core/run-attempt.ts`](../../../src/core/run-attempt.ts)、[`src/core/house-rules.ts`](../../../src/core/house-rules.ts)）与模型指纹链路（[`src/core/model-fingerprint/collect-core.ts`](../../../src/core/model-fingerprint/collect-core.ts)、[`src/adapters/agy.ts`](../../../src/adapters/agy.ts)），可以精确定位出四层差异：

| 对比维度 | 鹈鹕基准（`run:once`，`fingerprint: undefined`） | 模型指纹（`fingerprint:*`，`fingerprint: true`） | 导致 `agy` 在 `uuid` 探针中失败的直接机制 |
| :--- | :--- | :--- | :--- |
| **1. CLI 侧工具暴露面** | `claude` 传 `--tools ""`（0 工具）；`codex` 用 `read-only` + `untrusted`；**`agy --print --sandbox` 无关闭工具定义的 CLI 参数，仍向模型暴露 `run_command`、`write_to_file` 等 56 个工具** | 同左（`agy` 仅追加 `--disable-slash-commands`，56 个内置工具定义仍在系统提示词中） | `gemini-3.8-flash` 看到上下文里有 `run_command` 工具声明 |
| **2. 任务性质对工具的诱发强度** | 创作一段 `<svg>...</svg>` 矢量图形标记：模型倾向直接生成 XML 或调 `write_to_file` 保存 `.svg` 文件 | 生成 **RFC 4122 v4 随机 UUID**（`uuid`）或 16 位十六进制种子：在编码代理系统提示下，模型强烈倾向调用 `run_command` 执行 `python3 -c "import uuid..."` | 若允许跑 Python 生成 UUID，测出的是宿主机随机数发生器（OS CSPRNG）而非 LLM 权重分布！`--sandbox` 拦截了 `run_command` |
| **3. `--sandbox` 对两类工具的拦截差异** | `agy` 在 `--sandbox` 下**允许 `write_to_file` 免审批落盘**，且 [`absorbEvent`](../../../src/adapters/agy.ts#L171-L176) 会从 `~/.gemini/antigravity-cli/scratch/` 读回写出的 `.svg` 算作成功 | `run_command` 在 `--sandbox` 下触发 `permission check failed`（记入 `result.denied_actions`），`agy` 直接中止回合并返回 `response: ""`；且指纹模式显式禁止读盘（`write_to_file` 记 `wroteFile: true` 判拒） | `run_command` 被拒后既无正文输出，也未触发 `write_to_file`，导致 `reply.text === ""` 且 `reply.writtenFiles` 为空 |
| **4. 规则与直出约束注入** | 虽 `agy --print` 不读工作目录的 `GEMINI.md`（见 [`agy.ts` L16](../../../src/adapters/agy.ts#L16)），但开启 `run.harnessGuard` 时提示词末尾附有 `do not run or test any code...` | 指纹模式固定使用空目录 `data/scratch/model-fingerprint`，不写 `house-rules`，也不附 `harnessGuard`；探针题面仅写 `Output only the <answer>...</answer> block`，**未明确禁止调用工具** | `agy` 既没被剥夺工具定义，又没收到“禁止调用工具”指令，故 ~80% 概率尝试调 `run_command` 被拒 |

### 3.2 方案 §4.4「直接修改全部 6 个探针默认提示词模板」的架构合规性评估

方案 §4.4 提议直接在 6 个探针源码（[`uuid.ts`](../../../src/core/model-fingerprint/probes/uuid.ts) 等）的 `build*PromptTemplate` 中追加 `Do not call any tools, execute any commands, or write any files. Output the text directly.`。对照 [`AGENTS.md`](../../../AGENTS.md)、[`ACR-024`](../../architecture/revisions/ACR-024-model-fingerprint.md) 与 [`model-fingerprint-design.md`](../../research/model-fingerprint/model-fingerprint-design.md)，该做法存在以下两方面问题：

1. **对 `claude` 与 `codex` 既有基准样本可比性的影响（统计分布一致性风险）**：
   - 虽然模型指纹不同于 `classic-v1`（`AGENTS.md` 规定 `classic-v1` 逐字锁定不可改，而指纹模块在 [`model-fingerprint-design.md` §2](../../research/model-fingerprint/model-fingerprint-design.md#L47) 中明确设计为「样本集不计算提示词哈希、不设版本号门禁」），但 **JSD 分布核验的核心前提是「基准采集（`fill`）与待检核验（`check`）处于严格相同的调用环境与提示词分布下」**（见 [`model-fingerprint-design.md` §2 L51](../../research/model-fingerprint/model-fingerprint-design.md#L51)）。
   - `claude`（已通过 `--tools ""` 彻底剥离工具定义）和 `codex`（已通过 `read-only` + `untrusted` + `project_doc_max_bytes = 0` 隔离）本来就**不存在** `agy` 暴露 56 个工具的问题。
   - 若直接修改全局 `defaultCodec` 的提示词模板，会导致 `claude` 和 `codex` 在改动后执行的 `check` 查询（或增量 `fill`）使用**新提示词**，而磁盘上已采集的 `claude`/`codex` 基准样本（或已导出的 `.tar.gz` 基准包）使用的是**旧提示词**，人为引入「基准 vs 查询」之间的提示词差异！
   - （注：至于单次作业内的 **Prompt Cache 前缀命中**，由于 [`RegexPromptCodec.buildPrompt`](../../../src/core/model-fingerprint/probes/codec.ts#L62-L68) 将动态的 `\n[req:${reqId}]` 拼在模板最末尾，在模板末尾、`[req:${reqId}]` 之前加固定文本并不会打断同一次作业内的静态前缀缓存；真正的问题是**跨批次对 `claude`/`codex` 既有样本的分布干扰**。）
2. **违背 `ACR-024` 职责分层设计（适配器缺陷应在适配器层或按 CLI 最小化补偿）**：
   - 根据 [`architecture.md` §3 L200](../../architecture/architecture.md#L200) 与 [`ACR-024`](../../architecture/revisions/ACR-024-model-fingerprint.md#L66-L67)，「剥离工具与宿主环境隔离」是**各 CLI 适配器在 `request.fingerprint === true` 下的职责**：`claude.ts` 加 `--tools "" --safe-mode --no-session-persistence`，`codex.ts` 建最小 `CODEX_HOME`。
   - `agy` 之所以试图调 `run_command`，完全是因为 **`agy` 二进制缺乏类似 `--tools ""` 的命令行开关，且在 `--print` 模式下忽略工作目录指令文件**。这是 `agy` 适配器独有的隔离短板，不应通过污染全局 6 个探针的 `defaultCodec` 让 `claude` 和 `codex` 陪绑。

### 3.3 推荐的最小化干预方案（零污染 `claude` / `codex`）

1. **方案 A（首选，适配器层隔离补偿）：仅在 `src/adapters/agy.ts` 的 `request.fingerprint === true` 分支注入直出约束**
   - 在 [`src/adapters/agy.ts`](../../../src/adapters/agy.ts#L108-L123) 的 `buildAgyArgs(request)` 中，当 `request.fingerprint === true` 时，将无工具约束注入到末尾 `\n[req:...]` 之前（保持 `agy` 同一探针多次调用间的静态前缀 100% 一致，不影响 Prompt Cache）：
     ```ts
     const AGY_FINGERPRINT_NO_TOOLS_GUARD =
       "Important: Do not call any tools, do not run any commands, and do not read or write any files. Respond with the text directly.";

     function composeAgyFingerprintPrompt(promptText: string): string {
       const reqTagMatch = /\n\[req:[^\]]+\]$/.exec(promptText);
       if (reqTagMatch && reqTagMatch.index !== undefined) {
         const body = promptText.slice(0, reqTagMatch.index);
         const reqTag = promptText.slice(reqTagMatch.index);
         return `${body}\n- ${AGY_FINGERPRINT_NO_TOOLS_GUARD}${reqTag}`;
       }
       return `${promptText}\n- ${AGY_FINGERPRINT_NO_TOOLS_GUARD}`;
     }
     ```
   - **优势**：
     - `claude` 与 `codex` 的提示词逐字节不变，既有基准样本与导出包 100% 保持严格同分布；
     - `agy` 指纹采集（`fill`）与指纹核验（`check`）均走 `request.fingerprint === true`，二者提示词完全一致（且静态前缀位于 `[req:...]` 之前，不影响缓存）；
     - 完美符合 `ACR-024`「在适配器层封装各 CLI 的 `fingerprint` 隔离差异」的架构边界。
2. **修复工具调用被拒时的诊断分类（避免误报为 `empty_output`）**：
   - 在 [`src/core/model-fingerprint/collect-core.ts`](../../../src/core/model-fingerprint/collect-core.ts#L150-L179) 的 `buildProbeAttemptRecord` 中，当前仅检查 `reply.writtenFiles.length > 0` 来设置 `wroteFile: true`，完全丢弃了 `reply.notes`（如 `agy.ts` / `claude.ts` 的 `"模型调用的工具被 headless 模式拒绝：run_command"` 或 `codex.ts` 的 `"模型尝试写文件（只读沙箱已拦截）"`）。
   - **修复方式**：当 `reply.writtenFiles.length > 0` **或** `reply.notes` 含工具拒绝/沙箱拦截记录时，统一标记 `wroteFile: true`（或在 `ProbeAttempt` 上新增可选诊断字段 `toolDenied?: string[]` 并在 `Probe.resolveRejectionReason` 中优先归入 `tool_write_instead_of_inline`，同时将 [`src/i18n/messages/fingerprint.ts`](../../../src/i18n/messages/fingerprint.ts#L184) 的文案微调为 `"违规调用工具或写文件而非直接输出文本"`）。这样既不破坏 `REJECTION_REASONS` 的 6 枚举契约，又能让用户在终端和抽屉里一眼看出是「模型违规调工具被拒」而非「模型返回空文本」。

---

## 四、其他架构与代码健康门禁挑刺（Code Length & Security Ceiling）

1. **`src/bin/model-fingerprint.ts` 已达 501 行，直接加代码必破 `pnpm check:length` 门禁**：
   - 根据 [`config/code-length-policy.yaml`](../../../config/code-length-policy.yaml#L6) 与 [`AGENTS.md`](../../../AGENTS.md)，TypeScript 源文件硬上限为 **500 行**、函数硬上限为 **50 行**（pre-commit 钩子强制拦截）。
   - [`src/bin/model-fingerprint.ts`](../../../src/bin/model-fingerprint.ts) 当前已是 **501 行**（500 行有效内容）。方案 §4.3 计划在该文件中新增 `--effort`、`--help`、`--config`、`--data-dir`、动态标题与 `failedProbes` 输出，若不先拆分模块（例如将参数解析与帮助文本拆至 `src/bin/fingerprint-args.ts` 或 `src/bin/cli-args.ts`），必定触发 `pnpm check:length` 报错。
2. **CLI 临时合成目标（Ad-hoc Target）必须遵守 `ACR-006` 宿主机上限与 Web 边界隔离**：
   - 方案 §4.2 提出当 CLI 传入未在 `pelican.config.yaml` 登记的 `--cli` 与 `--model` 时，在内存中合成临时 `Target`。
   - 必须明确两条安全边界：
     1. **严禁污染 Web 端 `narrowConfig`**：[`src/core/run-selection.ts`](../../../src/core/run-selection.ts#L45) 的 `narrowConfig` 被 `POST /api/run` 使用，承载「只收窄不放宽」的安全职责；CLI 的临时目标合成必须封装在独立的 `resolveCliRunSelection` 函数中，仅供本地命令行 `run-once.ts` 调用。
     2. **合成目标的 `extraArgs` 必须强制为空数组 `[]`**，且合成后的 `AppConfig` 仍须经过 `openBudget` 与 `findActiveWork()` 检查，不得绕过 [`ACR-006`](../../architecture/architecture.md#L204) 的 `PELICAN_CEILING_*` 预算上限。

---

## 五、针对 `docs/review/cli/CLI_UX_UNIFICATION_PLAN.md` 的具体修订清单

### Must-Fix（必须修订，否则导致回归故障、挂起或违反架构门禁）

- **[MF-1] 修正 §1.4 / §3.2 / §4.2 中 `run:once`、`judge`、`sync`、`fp import` 的确认策略，严禁对 `run:once` 默认加 `[y/N]` 交互拦截**：
  - 明确 `pnpm run:once`（及 `pnpm pelican run`）在跑前执行 `findActiveWork()` 互斥检查并打印目标/题目/预计费用摘要，但**默认直接开跑、不弹 `[y/N]`**，100% 保持 `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` 等脚本与子代理调用的向后兼容；同时支持 `--dry-run`（打印预检后以 `0` 退出）并接受 `--yes` / `-y` 作为幂等兼容参数。
  - 明确 `judge` 仅在传入 `--ai` / `--ai-only`（真实消耗裁判配额）时要求确认；`sync` 仅在传入 `--push`（公开发布至远端数据仓）时要求确认；`fp import` 免交互确认。
- **[MF-2] 在 §4.1 / §4.3 中新增非 TTY 环境（`!process.stdin.isTTY || !process.stdout.isTTY`）的 Fail-Fast 防挂起保护**：
  - 替换 `src/bin/model-fingerprint.ts` 中的裸 `defaultInteractiveConfirm`：在需要人工确认的命令（`fp fill`、`fp check`、`judge --ai`、`sync --push`）中，若未传 `--yes` 且检测到 `!process.stdin.isTTY || !process.stdout.isTTY`，**严禁调用 `readline.question()`**，立即向 `stderr` 打印引导报错（提示追加 `--yes` 或 `--dry-run`）并以非零退出码（`1`）退出。
  - 对交互模式下的 `rl.question()` 增加 `try/catch` 捕获 `EOF`（`AbortError: readline was closed`），且当用户选择 `N` 取消作业时设置 `process.exitCode = 1`（防止 `&&` 链式脚本误判成功）。
- **[MF-3] 修订 §4.4：将「无工具直出约束」收敛至 `src/adapters/agy.ts` 的 `request.fingerprint === true` 分支，不改动全部 6 个探针的全局默认提示词模板**：
  - 保持 `src/core/model-fingerprint/probes/*.ts` 中 6 个探针的默认模板不变，避免改变 `claude` 与 `codex` 的提示词分布或影响磁盘已有基准样本的可比性。
  - 在 [`src/adapters/agy.ts`](../../../src/adapters/agy.ts#L108) `buildAgyArgs` 中，当 `request.fingerprint === true` 时在提示词末尾 `\n[req:...]` 之前注入零工具直出指令（同时保住 `agy` 的 Prompt Cache 静态前缀）。
- **[MF-4] 修订 §4.4 第 2 点：在 `collect-core.ts` 中将 `reply.notes` 的工具被拒记录映射为 `tool_write_instead_of_inline`（而非仅写 `errorMessage`）**：
  - `ProbeAttempt` 的磁盘 Schema（[`src/core/model-fingerprint/types.ts`](../../../src/core/model-fingerprint/types.ts#L180-L194)）并没有 `errorMessage` 字段！应当在 `buildProbeAttemptRecord` 中检测 `reply.writtenFiles.length > 0 || reply.notes.length > 0`（含 headless 工具拒绝记录）时标记 `wroteFile: true`（或记录 `toolDenied: true` 并在 `Probe.resolveRejectionReason` 中归为 `tool_write_instead_of_inline`），使 `fill` 与 `check` 准确统计为工具违例而非 `empty_output`。
- **[MF-5] 在 §4.1 / §4.3 中增加文件行数拆分方案，守住 `config/code-length-policy.yaml` 的 500 行红线**：
  - [`src/bin/model-fingerprint.ts`](../../../src/bin/model-fingerprint.ts) 已达 501 行。方案必须明确将参数解析与帮助渲染抽离至 `src/bin/cli-args.ts` / `src/bin/fingerprint-args.ts`，确保所有 `.ts` 文件 ≤ 500 行、所有函数 ≤ 50 行。

### Should-Fix（强烈建议一并采纳的工程改进）

- **[SF-1] 明确 CLI 临时目标合成（§4.2）与 Web `narrowConfig` 的隔离边界**：
  - 保持 `src/core/run-selection.ts` 中 `narrowConfig()` 的「只收窄不放宽」契约供 Web API 使用；为 CLI 新增独立的 `resolveCliRunConfig()`，且合成目标的 `extraArgs` 固定为 `[]`。
- **[SF-2] 统一退出码契约（Exit Code Contract）并在方案 §3.2 显式立表**：
  - 约定 `0` = 成功 / `--help` / `--dry-run`；`1` = 运行异常 / `findActiveWork()` 互斥拦截 / 用户取消确认 / 非 TTY 缺 `--yes`；`2` = `sync:data` 存在被拒轮次或冲突（保持 `sync-data.ts` 既有退出码语义兼容）。
- **[SF-3] 规范标准输出流（`stdout` vs `stderr`）与 `NO_COLOR` 支持**：
  - 错误信息、互斥锁冲突与交互式 `[y/N]` 提示统一输出至 `stderr`；当 `process.env.NO_COLOR !== undefined` 或 `!process.stdout.isTTY` 时禁用 ANSI 颜色转义序列（如 `validate-prompts.ts`）。
- **[SF-4] `run-once.ts` 跑前预算与活跃作业检查顺序**：
  - 在 `run-once.ts` 中先执行参数解析与 `--help`，再加载配置，若为 `--dry-run` 则仅计算并打印 `forecastRound` 成本预估（不因 `findActiveWork()` 阻塞 `--dry-run` 查看计划！）；仅在实际发起执行前拦截 `findActiveWork()`。
