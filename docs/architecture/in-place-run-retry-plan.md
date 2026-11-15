# 同轮次原地重跑（In-Place Run Retry & Single-Attempt Retry）设计与实施方案

## 1. 背景与决策结论

在鹈鹕自行车基准（Pelican Riding a Bicycle Benchmark）中，单次评测调用（Attempt）可能因网络抖动、上游 API 限流、CLI 进程卡死或偶发未输出 `<svg>` 而产生 `error`、`timeout`、`no-svg`，或因整轮中途取消（`cancel.json`）/ 进程中断而遗留未跑完的 `(targetId, promptId)` 组合。

经双路代码走查与架构评估，确定采用 **Run 级原地补跑 + Attempt 级全新单轮重跑（Retry）**，而不采用 CLI 会话级断点续传（`--resume`）：

1. **评测公平性与零样本可比性**：本基准核心规则是单轮零样本直出（Single-Turn Zero-Shot）。若对失败或超时的 CLI 会话执行 `--resume` 追加提示词，不仅破坏单轮可比性，还会将前序半截 `<svg>` 残片混入上下文导致拼接污染。
2. **三家 CLI 会话机制差异**：`codex app-server` 当前显式以 `ephemeral: true` 运行（不落盘会话历史）；`claude` 虽在 JSON 事件流中吐出 `session_id` 但与无痕考场隔离冲突；`agy` 无稳定机器可读会话 ID。
3. **同轮次（`runId`）原地重跑的价值**：在既有 `data/runs/<runId>/run.json` 内原地替换失败项或补跑缺失项，既保留该轮次已成功的作品（不重复消耗 Token 配额、不生成碎片化新时间线列），又能严格锁定该轮次首次抽样确定的提示词（`RenderedPrompt[]` 含 `candidateId`）与考场直出守卫（`harnessGuard`）。

---

## 2. 核心不变量与数据完整性设计

### 2.1 锁定 `RenderedPrompt[]` 与 `harnessGuard`
- 原地重跑直接复用 `existingRecord.prompts` 与 `existingRecord.harnessGuard`，**绝不重新调用 `selectPrompts`**，从而保证随机变量题或题池抽样题在重跑时使用与同轮其他模型完全一致的题目文本与 `candidateId`。
- 保持 `existingRecord.startedAt` 不变，仅在重跑收尾时更新 `finishedAt`。

### 2.2 预填 `slots` 防止既有成功记录被清空
- `src/core/runner.ts` 中 `createRunSnapshot` 通过 `slots.filter((a) => a !== undefined)` 生成 `run.json` 的 `attempts` 数组。
- 在原地重跑（`src/core/run/retry.ts`）中：
  1. 将 `existingRecord.attempts` 中**不在本次重跑范围内**的记录作为 `keptAttempts` 预填至 `slots[0 .. keptAttempts.length - 1]`；
  2. 为本次待重跑的 `Job` 分配 `slots[keptAttempts.length + jobIndex] = undefined`；
  3. 每次调用完成落盘时，写入对应 `slots` 下标并原子更新 `run.json` 与 `progress.json`。

### 2.3 清理旧产物文件（`cleanAttemptArtifacts`）
- 在重跑某个 `(targetId, promptId)` 之前，先清理 `data/runs/<runId>/` 下匹配 `${targetId}__${promptId}.*` 的旧文件（包括 `.svg`、`.txt`、`.judge.json`、`.judge-ai.txt`、`.sheet*.png`），防止重跑若变为 `error` / `timeout` 时残留上一次的 `.svg` 或 `.judge.json` 幽灵文件。

### 2.4 实时进度合并（`mergeLiveProgress`）支持既有卡片覆盖
- 现状：`src/app/components/dashboard/merge-live-progress.ts` 仅当 `(runId, targetId, promptId)` 不在 `existingKeys` 中时才合成 `liveState: "running" | "queued"` 卡片。
- 修复：在 `mergeLiveProgress` 中收集所有活跃轮次中状态为 `queued` 或 `running` 的调用映射表 `activeCallMap`。
  - 若 `cards` 中已有同 `(runId, targetId, promptId)` 的卡片（例如重跑启动瞬间或并发落盘期间），将其克隆并覆盖 `runInProgress: true` 与 `liveState: call.state`；
  - 若 `cards` 中尚无该键（重跑已将待重跑项从 `slots` 置为 `undefined`，或补跑缺失项），则按原逻辑生成 `toSyntheticCard` 占位卡片。

---

## 3. 接口、CLI 与架构分层设计

### 3.1 `RunSelection` 扩展（零侵入复用分容器请求队列）
在 `src/core/run-selection.ts` 中为 `RunSelection` 增加可选重试字段：
```ts
export interface RunSelection {
  targetIds: readonly string[];
  promptIds: readonly string[];
  candidateOverrides?: Readonly<Record<string, string>>;
  profiles?: readonly string[];
  /** 指定原地重跑的既有轮次 ID（如 2026-04-19T12-00-00Z） */
  retryRunId?: string;
  /** 可选：仅重跑该轮中不算 non-svg 的失败项，或设为 true 连同 no-svg 一并重跑 */
  includeNoSvg?: boolean;
}
```
- 当 `retryRunId` 存在时：
  - 若 `targetIds` / `promptIds` 非空，则仅重跑匹配的 `(targetId, promptId)` 子集（用于**单卡重试**或**单四宫格/指定目标重试**）；
  - 若 `targetIds` 与 `promptIds` 均为空数组 `[]`，则自动扫描 `existingRecord` 中所有 `status === "error" | "timeout"`（当 `includeNoSvg: true` 时含 `"no-svg"`）的失败调用，以及因取消/中断而缺失的 `(targetId, promptId)` 组合进行**整轮补跑**。
- 分容器模式下，`enqueueRequest("run", selection)` 直接复用 `RunnerRequest.selection` 落盘至 `data/requests/`，无需改动 `src/core/requests.ts`。

### 3.2 核心模块 `src/core/run/retry.ts`
新增 `src/core/run/retry.ts`（与 `src/core/run/prepare.ts` 同级），导出：
- `planRunRetry(config: AppConfig, selection: RunSelection, log?: (line: string) => void): Promise<PreparedRetry>`
  - 读取并校验 `loadRun(retryRunId)`；
  - 从 `config.targets` 查找目标配置（若某历史 target 已从当前配置移除，则基于 `existingRecord.attempts` 中的 `cli` / `model` / `effort` 与当前 `config.run` 超时规则合成回退 `Target`，确保历史轮次仍可重试）；
  - 计算 `keptAttempts` 与待重跑 `jobs: Job[]`、`lanes: LaneItem[][]`。
- `executeRunRetry(config: AppConfig, selection: RunSelection, options?: RunOptions): Promise<RunRecord>`
  - 执行 `cleanAttemptArtifacts` 清理待重跑项旧文件；
  - 预填 `slots` 并先写一版包含 `keptAttempts` 的 `run.json` 与初始 `progress.json`；
  - 复用 `runner.ts` 的 `executeLanes` 与 `finishRunRecord` 完成并发执行、静态/渲染层打分、AI 语义层复核及公开数据仓自动同步。

### 3.3 HTTP API 与 CLI
- **`POST /api/run`**（`src/app/api/run/run-request.ts` & `src/app/api/run/route.ts`）：
  - `parseRunRequestBody` 支持 `{ retryRunId: string, targetIds?: string[], promptIds?: string[], includeNoSvg?: boolean }`；
  - `route.ts` 与 `src/bin/runner.ts` 检测到 `selection?.retryRunId` 时调用 `executeRunRetry(full, selection, ...)`。
- **CLI**（`src/bin/run-once.ts`）：
  - 新增 `--retry <runId>` 与 `--include-no-svg` 参数；
  - 支持搭配 `--target <id>`、`--prompt <id>` 过滤特定重跑项，以及搭配 `--dry-run` 预览将重跑的调用清单与预估成本。

### 3.4 看板前端入口
1. **单卡原地重试（`CardRetryButton.tsx`）**：
   - 在 `PelicanCard` 底部栏（`CardFooter`）及四宫格详情弹窗中，当卡片处于非成功终态（`status === "error" | "timeout" | "no-svg"` 且 `!isLive`）且当前用户为已配对所有者（`owner && !readonly`）时，渲染紧凑重试按钮 `↻ 重试 / ↻ Retry`。
   - 点击后调用 `POST /api/run`，传入 `{ retryRunId: card.runId, targetIds: [card.targetId], promptIds: [card.promptId], includeNoSvg: true }`。
2. **轮次级/弹窗级批量重试（`RetryRunButton.tsx`）**：
   - 在顶部 `RunStatus` 折叠面板中，当最近一轮已结束（`finished` / `cancelled` / `interrupted`）且存在失败或未完成项时，为 `owner` 提供「重试失败项（N）」按钮；
   - 在四宫格详情模态窗 `ModelModalHeader` 右上角操作区，当该四宫格内存在失败强度卡片时，为 `owner` 提供「重试失败项」按钮，一键重跑该模型在该轮下的失败强度。

---

## 4. 文件长度与代码卫生预算

严格遵守 `config/code-length-policy.yaml`（TS 文件 ≤ 500 行、UI 组件 `.tsx` ≤ 300 行、函数 ≤ 30~50 行）与 `pnpm check:ui`：

| 文件路径 | 现状行数 | 改动策略与目标行数 |
| --- | --- | --- |
| `src/core/run/retry.ts` | 新增 | ~210 行，封装重跑规划、产物清理与执行编排 |
| `src/core/runner.ts` | 293 行 | 导出内部可复用的 `executeLanes` / `finishRunRecord` 辅助结构，保持 ≤ 300 行 |
| `src/core/store.ts` | 258 行 | 新增 `cleanAttemptArtifacts`（~20 行），总计 ~280 行 |
| `src/core/run-selection.ts` | 177 行 | `RunSelection` 接口新增 `retryRunId?`、`includeNoSvg?`，~190 行 |
| `src/app/components/card/PelicanCard.tsx` | 292 行 | 抽离 `LiveFrame` / `RedactedFrame` / `FailureFrame` 至 `CardFrames.tsx`，降至 ~210 行 |
| `src/app/components/card/CardFrames.tsx` | 新增 | ~110 行，承载卡片非 SVG 状态帧渲染 |
| `src/app/components/card/CardRetryButton.tsx` | 新增 | ~75 行，承载单卡原地重试按钮与请求状态 |
| `src/app/components/run-control/RetryRunButton.tsx` | 新增 | ~85 行，承载轮次/四宫格失败项批量重试按钮 |
| `src/app/components/run-status/RunStatus.tsx` | 261 行 | 挂载 `RetryRunButton`，保持 ≤ 275 行 |
| `src/app/components/model-modal/ModelModal.tsx` | 82 行 | 头部 `actions` 挂载 `RetryRunButton`（针对当前四宫格失败项），~110 行 |
