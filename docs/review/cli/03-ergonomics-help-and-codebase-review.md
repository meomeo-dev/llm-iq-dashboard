# CLI 方案审查报告 3：零配置直跑体验、渐进式披露、帮助排版与代码库落地可行性

> **审查员角色**：CLI 方案审查员 3（零配置直跑体验、渐进式披露、帮助排版与代码库落地可行性审查员）
> **审查对象**：[`docs/review/cli/CLI_UX_UNIFICATION_PLAN.md`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/docs/review/cli/CLI_UX_UNIFICATION_PLAN.md)
> **参考业界规范**：[Command Line Interface Guidelines (`clig.dev`)](https://clig.dev/)（Help、Errors、Output、Arguments and flags、Configuration）、Cobra / Git 编辑距离拼写纠错实践、终端渐进式披露（Progressive Disclosure）分层设计。

---

## 一、零配置直跑（Ad-hoc Target Synthesis）的边界情况审计

### 1.1 `run-selection.ts` 扩展边界：隔离 Web API 收窄契约与 CLI 合成能力

#### 现状与冲突点
- [`narrowConfig`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts#L45-L61) 的设计契约（见文件头注释及 [`test/core/run-selection.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/run-selection.test.ts#L45-L53)）明确规定**“只收窄不放宽：目标与提示词（内置或自定义）必须已在配置中登记”**。
- Web 端 [`POST /api/run`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/app/api/run/route.ts#L130) 与分容器执行器 [`startRun`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/runner.ts#L201) 依赖 `narrowConfig` 拦截任何不在 `pelican.config.yaml` 的 `targets` 中的 `targetId`（报错 `配置里没有：目标 ...`）。
- 若直接修改 `narrowConfig` 放宽未知目标校验，会破坏 Web API 的白名单边界并导致 [`test/core/run-selection.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/run-selection.test.ts#L49-L52) 回归失败。

#### 落地方案：保持 `narrowConfig` 不变，新增 `resolveCliRunConfig`
在 [`src/core/run-selection.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts)（或独立模块 `src/core/cli-run-selection.ts`）中新增面向 CLI 的 `resolveCliRunConfig(config, catalog, filter)`，其决策树与边界条件如下：

```ts
export interface CliRunSelection {
  clis?: readonly CliKind[];
  models?: readonly string[];
  efforts?: readonly EffortLevel[];
  profiles?: readonly string[];
  promptIds?: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
}
```

1. **零过滤参数（Level 1 默认路径）**：
   - 当 `clis`、`models`、`efforts`、`profiles`、`promptIds`、`candidateOverrides` 均未传时，直接调用 `scheduledRound(config)`，保持与定时任务 100% 一致。
2. **仅传 `--model <m>` 未传 `--cli` 时的三层反查与歧义消解**：
   - Draft v1 第 4.2 节提到“在 `config.targets` 及 `capabilities.json` 中反查 `cli`”，但遗漏了**冷启动无 `capabilities.json` 缓存**的场景（首次 clone 尚未运行 `preflight` 时 [`readCachedCatalog()`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/capabilities/catalog.ts#L64-L73) 返回 `null`）。
   - **完整反查顺序**：
     1. 查 `config.targets` 中 `t.model === m` 的 `cli` 集合；
     2. 查 `catalog?.clis`（`data/capabilities.json`）中 `c.models.some(mod => mod.id === m)` 的 `cli` 集合；
     3. 查 `config.customModels` 与 [`builtinModels(cli)`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/capabilities/builtin-models.ts) 内置模型清单；
   - **判定规则**：
     - 唯一命中 1 个 `cli`：自动补全 `cli`；
     - 命中多个 `cli`：报错 `模型 "${m}" 在多个 CLI 中存在（${matched.join(", ")}），请显式指定 --cli <cli>`；
     - 命中 0 个 `cli`：报错 `无法自动识别模型 "${m}" 所属的 CLI，请显式添加 --cli <claude|codex|agy>`。
3. **已有配置目标复用 vs 内存临时 `Target` 合成**：
   - 对于解析出的每个 `(cli, model)`：
     - **情况 A（`config.targets` 中已存在该 `cli + model`）**：
       - 若未传 `--effort`：优先取该模型下 `enabled: true` 的配置目标；若该模型在配置中全部为 `enabled: false`（如备选目标），则因用户已显式指定 `--model` 而激活这些目标。
       - 若传了 `--effort`：在配置中查找匹配的 `(cli, model, effort)` 以沿用其自定义 `label`、`timeoutMs` 与 `extraArgs`；若某个请求的 `effort` 档位未在配置中登记，则以同 `(cli, model)` 的首个配置目标为模板合成该档位。
     - **情况 B（`config.targets` 中不存在该 `cli + model`，即零配置 Ad-hoc Target）**：
       - 若未传 `--effort`：默认使用 `["low"]`（最低成本、最快响应，符合渐进式披露原则）；若传了 `--effort`，按所传档位列表逐个合成。
       - 合成 `Target` 的字段规范：
         - `id`：**必须调用 [`buildTargetId(cli, model, effort, profile)`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/types.ts)**（生成 `cli__model__effort` 或 `cli__model__effort__profile`），确保落盘的 `run.json`、`<targetId>.svg` 与 Web 看板卡片渲染 100% 兼容（切勿使用模型指纹专用的 `fingerprint-...` ID 格式）。
         - `label`：调用 [`defaultLabel({ cli, profile, model, effort }, config.profiles)`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/config/targets.ts#L60-L65)。
         - `timeoutMs`：按 `config.run.timeoutByEffort[effort] ?? config.run.timeoutByCli[cli] ?? config.run.defaultTimeoutMs` 计算。
         - `extraArgs`：`[]`，`enabled`：`true`。
4. **Profile 与候选集边界校验**：
   - 当传入非 `default` 的 `--profile <name>` 时，必须复用 [`assertProfileUsable(config, cli, model, name)`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts#L151-L158) 校验该 `profile` 已登记、未停用且模型在其白名单内；对不支持 `profiles` 的 CLI（不在 `PROFILE_CLIS` 内），若用户显式同时传了 `--cli claude --profile xxx`，应直接报错提示 `CLI claude 不支持自定义上游 profile`，避免静默退回登录态造成误解。
   - 当传入 `--candidate <promptId=candidateId>` 但未传 `--prompt` 时：若 `promptId` 不在默认 `config.run.promptIds` 中，应报错提示需同时通过 `--prompt <promptId>` 包含该题目（或当仅传 `--candidate` 时自动以该 `promptId` 作为本轮题目）。

---

### 1.2 模型指纹 CLI 在 `modelFingerprint.enabled: false` 与未登记模型下的行为核查

#### 核查结论 1：`modelFingerprint.enabled: false` 不会拦截 CLI 执行
经核查 [`src/core/config/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/config/model-fingerprint.ts#L28-L42)、[`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts) 与 [`src/core/model-fingerprint/collect.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/collect.ts#L138-L162)：
- `DEFAULT_MODEL_FINGERPRINT_CONFIG.enabled` 默认为 `false`；
- **`executeFingerprintFill`、`executeFingerprintCheck`、`executeFingerprintCheckBatch` 以及 `runModelFingerprintCli` 均未检查 `fpCfg.enabled`**（`enabled` 仅用于控制 Web 看板导航栏是否展示入口）。
- 因此，即使 `pelican.config.yaml` 中未开启 `modelFingerprint.enabled`，CLI 端目前已经可以直接运行 `fill` 与 `check`。

#### 核查结论 2：真正阻碍零配置体验的 3 个代码级断点（Must-Fix）
1. **`planFingerprintStatus` 未对齐 `resolveFillTargets` 的临时目标合成**：
   - 在 [`src/core/model-fingerprint/plan.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/plan.ts#L225-L247) 中，`resolveFillTargets` 当 `cliFilter` 与 `modelFilter` 同时传入时，直接返回 `[{ cli: cliFilter, model: trimmedModel }]`（支持未登记模型零配置 `fill`）。
   - 但 [`planFingerprintStatus`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/plan.ts#L284-L324) 只遍历 `configuredReferences ∪ onDiskSampleSets`。当新模型既不在 `references`（或 `config.targets` 派生列表）中、磁盘也尚无样本时，`fingerprint:status -- --cli agy --model gemini-3.8-flash` 返回空数组 `[]`。
   - **修复方法**：在 `planFingerprintStatus` 中，当 `options.cliFilter` 与 `options.modelFilter` 同时非空且 `allTargets` 未包含该键时，将其插入 `allTargets`（标记 `configuredInReferences: false, onDisk: false`）。
2. **仅传 `--model` 未传 `--cli` 时 `resolveFillTargets` 缺乏 `config.targets` / `capabilities` 反查**：
   - 当 `modelFingerprint.references` 非空（只配了部分模型）时，[`resolveModelFingerprintConfig`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/config/model-fingerprint.ts#L60-L71) 不会合并 `config.targets`。若用户运行 `fingerprint:fill -- --model gemini-3.8-flash` 且漏传 `--cli`，`resolveFillTargets` 查不到 `cli` 即静默返回 `[]`（输出 `待补齐探针 0 项` 并以退出码 `0` 结束）。
   - **修复方法**：在 CLI 入口层（`model-fingerprint.ts`）统一执行与 `run-once` 相同的 `inferCliForModel(model, config, catalog)` 反查；若过滤后目标列表仍为空，必须输出明确警告或报错退出，禁止静默输出 0 项。
3. **`--effort` 覆盖在底层 `collect.ts` / `collect-core.ts` 中的穿透断裂（Draft v1 遗漏的关键问题）**：
   - Draft v1 第 4.3 节提出在 `model-fingerprint.ts` 支持 `--effort <level>`。
   - **隐患**：在 [`src/core/model-fingerprint/collect-core.ts` 第 104 行](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/collect-core.ts#L97-L105) 的 `resolveFingerprintTarget`、[`src/core/model-fingerprint/collect.ts` 第 87/151/303/435 行](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/collect.ts#L87) 的 `applyDiskMutationsForFill` / `executeFingerprintFill` / `prepareCheckBatch` / `executeFingerprintCheck` 中，全部通过 `resolveModelFingerprintConfig(config).effort` 直接从 `config` 读取 `effort`！
   - **最佳落地方式**：不要在 10 余个内部函数签名上逐层透传 `effort`，而是在 `runModelFingerprintCli` 加载 `config` 后，若 `args.effort !== undefined`，立即在内存中构造覆写后的配置副本：
     ```ts
     const effectiveConfig: AppConfig = args.effort
       ? { ...config, modelFingerprint: { ...resolveModelFingerprintConfig(config), effort: args.effort } }
       : config;
     ```
     如此一来，`status`、`fill`、`check`、`self-test`、`export` 以及底层 `resolveFingerprintTarget`、`listAllSampleSets` 全链路自动读取同一个 `effort`，零签名侵入且无遗漏。

---

## 二、`--help` 输出规范、错误可操作性（Actionable Errors）与拼写纠错设计

对照 [clig.dev — Help & Errors](https://clig.dev/#help) 原则（“Lead with examples”、“Display the most common flags first”、“Catch errors and rewrite them for humans”、“If the user did something wrong and you can guess what they meant, suggest it”），设计以下统一规范：

### 2.1 渐进式披露（Progressive Disclosure）的 `--help` 模板结构

所有命令响应 `--help` / `-h` 时，统一向 `stdout` 输出 5 段式结构并以退出码 `0` 退出（当管道重定向或 `NO_COLOR` 非空或非 TTY 时自动剥离 ANSI 转义序列）：

```text
<命令名> — <一句话职责说明（明确是否调用模型/消耗配额/写盘）>

用法 (USAGE)
  $ <标准调用形式>

核心示例 (EXAMPLES)                              <-- clig.dev: Lead with examples，按 Level 1 -> Level 3 递进
  # 1. [Level 1 零配置预演] 仅预览计划与预计费用，不调用模型
  $ pnpm pelican run --cli agy --model gemini-3.8-flash --dry-run

  # 2. [Level 2 单点直跑] 免改 YAML 直接用指定模型跑一道题
  $ pnpm pelican run --cli agy --model gemini-3.8-flash --effort low --prompt classic-v1

  # 3. [Level 3 按配置跑整轮] 执行 pelican.config.yaml 中所有已启用目标
  $ pnpm pelican run

目标选择参数 (TARGET SELECTION)                  <-- 跨命令统一四元组，置于最前
  --cli <claude|codex|agy>       指定 CLI 适配器（可逗号分隔多项）
  --model <model,...>            指定模型 ID（单模型唯一归属时可省略 --cli）
  --effort <low|medium|high|max|xhigh|ultra>  指定思考强度（合成目标默认 low）
  --profile <name,...>           指定渠道 Profile（默认 default 登录态）

任务与执行控制 (EXECUTION OPTIONS)
  --prompt <id,...>              指定题目 ID（默认取配置 run.promptIds）
  --candidate <promptId=candId>  固定多候选套题的候选项
  --dry-run                      仅打印执行计划与预计成本，不发起调用
  -y, --yes                      跳过交互式确认提示

全局选项 (GLOBAL OPTIONS)
  -c, --config <path>            覆盖配置文件路径（同 PELICAN_CONFIG）
  -d, --data-dir <path>          覆盖数据目录路径（同 PELICAN_DATA_DIR）
  -h, --help                     显示本帮助信息并退出
```

> **无参数默认行为区分（clig.dev 准则）**：
> - 对于需要必选子命令或必选参数的入口（如 `pnpm pelican`、`pnpm fingerprint`、`pnpm fingerprint rescore`、`pnpm fingerprint import`），**无参数裸跑时直接打印精简帮助与子命令列表**（退出码 `1`，提示缺少子命令/参数）。
> - 对于本身定义为“按配置文件执行默认作业”的入口（`pnpm run:once`、`pnpm fingerprint:status`、`pnpm preflight`），无参数运行保持既有行为以保证向下兼容。

### 2.2 错误可操作性（Actionable Errors）三段式模板与 `stderr` 分离

所有参数错误与运行前置拦截统一输出到 `stderr`（`console.error`），遵循 **“发生了什么 + 为什么/最接近的候选 + 下一步修复命令”** 三段式结构：

```text
✖ 错误：未知选项 --dryrun
  ↳ 你是否想输入：--dry-run ？
  ↳ 运行 `pnpm pelican run --help` 查看全部可用参数。
```

```text
✖ 错误：声明模型 agy/gemini-3.8-flash 在所选探针上尚无满额基准样本集（有效 0/6 项），无法发起核验。
  ↳ 下一步修复：请先运行以下命令采集基准样本：
    pnpm fingerprint fill --cli agy --model gemini-3.8-flash
```

### 2.3 Damerau-Levenshtein 拼写纠错（Did-you-mean）规则设计

在共享参数解析器 `src/bin/cli-args.ts` 中内置零依赖的受限编辑距离匹配函数 `suggestClosest(input: string, candidates: readonly string[]): string | null`：
- **适用范围**：
  1. 顶层命令与指纹子命令（如 `statu` $\rightarrow$ `status`，`chekc` $\rightarrow$ `check`）；
  2. 命令行 Flag（如 `--dryrun` $\rightarrow$ `--dry-run`，`--probe`（若未设别名）或 `--porfile` $\rightarrow$ `--profile`）；
  3. 探针 ID（`--probes uid` $\rightarrow$ `uuid`，与现有枚举 `uuid | number | seed | palette | words-en | words-zh` 比对）；
  4. 题目 ID（`--prompt clasic-v1` $\rightarrow$ `classic-v1`，与 `listPrompts(config.customPrompts).map(p => p.id)` 比对）；
  5. 模型 ID 与 Profile 名（当配置或能力目录中存在编辑距离 $\le 2$ 的同名近似项时提示）。
- **阈值控制（防止荒谬推荐）**：
  - 归一化后计算编辑距离 $d$（支持相邻字符交换 transposition 计为 1 次编辑，或子串前缀匹配）；
  - 仅当 $d \le \max(1, \min(3, \lfloor \text{target.length} / 3 \rfloor))$ 时给出 `你是否想输入：... ？` 提示；超出阈值时直接列出枚举可选值或引导 `--help`。

---

## 三、存量单元测试兼容性与代码长度门禁预审

### 3.1 存量单元测试对 CLI 错误信息与输出文本的断言清单

经对 `test/` 全目录检索，涉及 CLI 文本断言的存量测试共有 3 处，改造时**必须保持错误文案前缀兼容**：

| 测试文件与位置 | 存量测试调用与正则/子串断言 | 兼容性约束与改造要求 |
| :--- | :--- | :--- |
| [`test/core/model-fingerprint/collect-and-cli.test.ts#L330-L337`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/collect-and-cli.test.ts#L330-L337) | `runModelFingerprintCli(["fill", "--reset", "--cli", "codex"])`<br>断言：`/--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,\.\.\.>/` | **必须保留原句**，不可改写 `--reset` 报错中的参数占位符格式 |
| [`test/core/model-fingerprint/collect-and-cli.test.ts#L341-L353`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/collect-and-cli.test.ts#L341-L353) | `runModelFingerprintCli(["check", "--cli", "codex", "--declared", "ref-model-1"])`<br>断言：`/pnpm fingerprint:fill/` | **关键陷阱**：如果把无样本报错里的提示改成 `pnpm fingerprint fill`（去掉冒号），该测试会直接挂掉！必须保留 `pnpm fingerprint:fill`（或同时写出 `pnpm fingerprint:fill（或 pnpm pelican fp fill）`），且必须保留 `--declared` 作为 `--model` 的兼容别名 |
| [`test/core/model-fingerprint/collect-and-cli.test.ts#L377-L407`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/collect-and-cli.test.ts#L377-L407) | `status` 输出含 `"ref-model-1"`；`rescore` 输出含 `"重算完成"` | 修改 `status` 标题（Draft v1 4.3.3）时不影响行内模型名，但必须保持 `重算完成` 字样 |
| [`test/bin/sync-data.test.ts#L84-L115`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/bin/sync-data.test.ts#L84-L115) & [`L239-L248`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/bin/sync-data.test.ts#L239-L248) | 导出符号 `parseCliArgs`、`runSyncCli`；断言错误包含 `"未指定 --repo"`、`"互斥，不能同时使用"` | `src/bin/sync-data.ts` 接入共享参数解析器时，**必须保留 `parseCliArgs` 与 `runSyncCli` 的函数签名与原有返回值字段** |
| [`test/core/model-fingerprint/plan.test.ts#L223`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/plan.test.ts#L223) | `resolveSelectedProbes(["invalid-only"], ["seed"])`<br>断言：`/Invalid probe filter/` | `plan.ts` 内部的 `resolveSelectedProbes` 抛错信息需保留 `Invalid probe filter` |

> **补充发现**：尽管任务说明中提到 `test/core/model-fingerprint/cli.test.ts`，但仓库内实际文件名为 [`test/core/model-fingerprint/collect-and-cli.test.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/test/core/model-fingerprint/collect-and-cli.test.ts)，且目前**尚未对 `parseFingerprintCliArgs` 的 `未知或缺失子命令`、`未知选项`、`参数 ... 缺少取值` 建立专门的单测覆盖**。本次改造应在 `test/bin/cli-args.test.ts` 中补齐这组断言。

---

### 3.2 代码长度门禁（`config/code-length-policy.yaml`）精确水位预审与模块拆分方案

根据 [`config/code-length-policy.yaml`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/config/code-length-policy.yaml) 与 [`scripts/code-length/ast.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/scripts/code-length/ast.ts) 的 AST 统计规则（**.ts 文件硬上限 500 行，.ts 命名函数硬上限 50 行**），对本次方案涉及的所有目标文件进行实测水位扫描：

| 文件路径 | 当前 AST 行数 / 上限 | 剩余文件裕量 | 当前最大函数（行数 / 50L 上限） | 直接按 Draft v1 塞代码的后果 |
| :--- | :---: | :---: | :--- | :--- |
| [`src/bin/model-fingerprint.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/model-fingerprint.ts) | **500 / 500** | **0 行** | `handleSelfTestCommand` (**47L**)<br>`handleStatusCommand` (**43L**)<br>`handleFillCommand` (**42L**) | **立即触发 `pnpm check:length` 失败**（哪怕多加 1 行代码或给 `handleStatusCommand` 加 8 行动态标题逻辑都会双双超标） |
| [`src/core/model-fingerprint/plan.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/plan.ts) | **473 / 500** | **27 行** | `planVerificationCheck` (**49L**)<br>`computeProbeSampleGap` (**43L**) | `plan.ts` 仅剩 27 行裕量，若在 `planFingerprintStatus` 和 `resolveFillTargets` 中直接堆砌反查逻辑极易突破 500 行 |
| [`src/core/model-fingerprint/collect.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/collect.ts) | **444 / 500** | 56 行 | `runFillJobExecution` (**45L**)<br>`executeFingerprintCheckBatch` (**45L**) | 两个核心函数距 50 行上限仅差 5 行 |
| [`src/core/model-fingerprint/collect-core.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/model-fingerprint/collect-core.ts) | **406 / 500** | 94 行 | `invokeSingleProbeCall` (**49L**)<br>`executeWarmablePool` (**43L**) | `invokeSingleProbeCall` 仅剩 1 行裕量；修改 `buildProbeAttemptRecord`（30L）处理 `denied_actions` 时不可写入 `invokeSingleProbeCall` |
| [`src/core/run-selection.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/run-selection.ts) | **177 / 500** | 323 行 | `expandProfiles` (27L) | 文件裕量充足，可直接扩展或拆子模块 |
| [`src/bin/run-once.ts`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/bin/run-once.ts) | **38 / 500** | 462 行 | `main` (20L) | 文件裕量充足，但需注意单函数 ≤ 50 行 |

#### 必选模块拆分架构（确保 100% 通过 `pnpm check:length`）

为了在不触碰 `allowlist` 豁免的前提下干净通过 `pnpm check:length`（文件 ≤ 500 行、函数 ≤ 50 行），实施方案必须采用以下模块拆分结构：

1. **拆分 `src/bin/model-fingerprint.ts`（当前 500 行 $\rightarrow$ 拆分为 3 个文件，每文件 ~180–240 行）**：
   - `src/bin/model-fingerprint.ts`（~220 行）：保留对外导出入口 `parseFingerprintCliArgs`、`runModelFingerprintCli`、`ParsedFingerprintCliArgs`、`FingerprintCliCommand`、`FingerprintCliDeps`（100% 兼容存量测试 import），以及参数解析与路由分发；
   - `src/bin/fingerprint-commands.ts`（~220 行）：承载 `handleStatusCommand`、`handleFillCommand`、`handleCheckCommand`、`handleSelfTestCommand`、`handleRescoreCommand`、`handleExportCommand`、`handleImportCommand` 执行逻辑；
   - `src/bin/fingerprint-format.ts`（~120 行）：抽离终端格式化与帮助文本函数（如 `formatStatusHeader`、`formatStatusRow`、`formatCheckSummary`、`formatFailedProbesHint`、`FINGERPRINT_HELP_TEXT`），同时把 `handleSelfTestCommand`（47L）和 `handleStatusCommand`（43L）降至 25 行以内！
2. **新建共享 CLI 基础设施 `src/bin/cli-args.ts`（~200 行）与总入口 `src/bin/pelican.ts`（~150 行）**：
   - `src/bin/cli-args.ts`：提供 `stripPnpmSeparator`、全局 `--config` / `--data-dir` 提取、带白名单前置校验的 `consumeFlagValue`、Levenshtein `suggestClosest`、以及统一 `--help` 渲染器 `renderCommandHelp`；
   - `src/bin/pelican.ts`：实现 `pnpm pelican <cmd>` 聚合路由转发。
3. **控制 `src/core/model-fingerprint/plan.ts`（当前 473 行）不超标**：
   - `planFingerprintStatus` 对齐 `resolveFillTargets` 时，直接复用 `resolveFillTargets` 或用 ≤ 10 行的辅助逻辑合并显式 `(cliFilter, modelFilter)`；
   - 将“仅传 `--model` 从 `config.targets` / `capabilities.json` 反查 `cli`”的逻辑放在 CLI 目标解析层（如 `src/core/cli-run-selection.ts` 或 `src/bin/cli-args.ts`），不要塞进已经 473 行的 `plan.ts`。

---

## 四、针对 `CLI_UX_UNIFICATION_PLAN.md` 的具体修订清单

### Must-Fix（阻塞落地或会导致回归失败，必须合入方案）

1. **[MF-1] 明确 `src/bin/model-fingerprint.ts`（500/500 行）与 `plan.ts`（473/500 行）的拆分方案**：
   - 在方案第四节补充模块拆分表：将 `src/bin/model-fingerprint.ts` 拆分为 `model-fingerprint.ts`（解析与入口导出）+ `fingerprint-commands.ts`（子命令处理器）+ `fingerprint-format.ts`（输出排版与 `--help` 文本），防止直接触发 `pnpm check:length` 门禁失败。
2. **[MF-2] 明确 `resolveCliRunConfig` 与 `narrowConfig` 的职责隔离**：
   - 在方案 4.2 节写明：**绝不修改 `narrowConfig` 对未知目标的严格校验**（保护 `POST /api/run` 与 `test/core/run-selection.test.ts`），而是新增 `resolveCliRunConfig` 专供 CLI 端筛选与合成临时 `Target`，且合成目标的 `id` 必须使用 `buildTargetId(cli, model, effort, profile)`。
3. **[MF-3] 修复模型指纹 `--effort` 覆盖在 `collect.ts` / `collect-core.ts` 内部失效的问题**：
   - 在方案 4.3.1 节明确：当命令行传入 `--effort <level>` 时，在 `runModelFingerprintCli` 中通过构造内存 `AppConfig` 覆写 `config.modelFingerprint.effort`，从而让 `resolveFingerprintTarget`、`executeFingerprintFill`、`executeFingerprintCheck` 与 `listAllSampleSets` 全链路自动生效。
4. **[MF-4] 保护存量测试断言兼容（`--declared`、`--reset` 报错与 `pnpm fingerprint:fill` 提示）**：
   - 在方案 4.3 节写明：保持 `check` 无满额样本报错中包含 `pnpm fingerprint:fill` 子串（兼容 `test/core/model-fingerprint/collect-and-cli.test.ts#L352`），保持 `--reset` 三元组报错原文不变（兼容 `L336`），保持 `sync-data.ts` 导出 `parseCliArgs` 与 `runSyncCli`。
5. **[MF-5] 补齐 `--model` 反查 `--cli` 的冷启动兜底（`builtinModels`）**：
   - 在方案 4.2.1 与 4.3.2 节明确：反查顺序为 `config.targets` $\rightarrow$ `capabilities.json` 缓存 $\rightarrow$ `config.customModels` $\rightarrow$ `builtinModels(cli)`，确保无 `capabilities.json` 缓存的新环境也能唯一反查出 `cli`。

### Should-Fix（显著提升开发者体验与排版一致性的改进建议）

1. **[SF-1] 规范化 5 段式 `--help` 渐进式披露模板与 `stderr` 三段式错误格式**：
   - 在方案第三节增加 `--help` 标准输出模板（以 Level 1 `--dry-run` $\rightarrow$ Level 2 单模型直跑 $\rightarrow$ Level 3 整轮执行的 `EXAMPLES` 领衔）及 Damerau-Levenshtein 拼写纠错阈值规则（编辑距离 $\le 2$ 时提示 `你是否想输入：...`）。
2. **[SF-2] 统一 `run-once.ts` 跑后成本摘要表排版**：
   - 在方案 4.2.2 节细化跑后摘要格式：对齐模型指纹的汇总风格，按道/调用输出 `✓/✗ <targetId> @<promptId>  <status>  <duration>s  <in/out tokens>  $<usd>`，并在末行打印 `整轮耗时 / 成功率 / 累计折算官价 $USD / 产物目录`。
3. **[SF-3] 修正方案第五节中的测试文件路径引用**：
   - 将方案第 167 行中的 `test/core/model-fingerprint/cli.test.ts` 修正为真实路径 `test/core/model-fingerprint/collect-and-cli.test.ts`，并规划新增 `test/bin/cli-args.test.ts`。
