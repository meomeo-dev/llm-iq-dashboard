/**
 * 一轮的执行计划：渲染本轮题面，展开 `提示词 × 目标` 为任务，按 CLI × 模型分道，
 * 并给出进度文件的初始形态。只做纯计算与读缓存，不发起调用。
 */

import type { AppConfig } from "./config";
import type { RunProgress } from "./progress";
import { resolvePrompt, type PromptCandidate, type PromptSpec } from "./prompt";
import type { Logger } from "./runner";
import { DEFAULT_PROFILE, EFFORT_LEVELS, foldEffort, type CliKind, type EffortLevel, type RunRecord, type Target } from "./types";
import {
  pickCandidate,
  renderPrompt,
  rotationKey,
  type RenderedPrompt,
  type RotationConfig,
  type RotationDraw,
  type RotationLedger,
} from "./variables";
import {
  // 重命名以免与 Job 解构出的同名字段互相遮蔽
  effortAdjustable as isEffortAdjustable,
  effortsFor,
  readCachedCatalog,
  refreshCatalog,
} from "../capabilities/catalog";
import type { CapabilitySnapshot } from "../capabilities/types";

/** 一个待执行单元：某个目标回答某条已渲染的提示词 */
export interface Job {
  target: Target;
  prompt: RenderedPrompt;
  appliedEffort: EffortLevel;
  /** 该模型是否接受强度调节，见 adapters/types.ts */
  effortAdjustable: boolean;
}

export interface LaneItem {
  job: Job;
  /** 在 jobs 中的原始下标 */
  index: number;
}

/**
 * 取能力目录，缓存优先：重新探测需十几秒（agy 的模型列表要联网），
 * 模型清单在两轮之间基本不变。无缓存时现场探测。
 */
export async function loadCatalog(
  config: AppConfig,
  forceRefresh: boolean,
  log: Logger,
): Promise<CapabilitySnapshot | null> {
  if (forceRefresh) {
    log("正在探测 CLI 能力目录…");
    return refreshCatalog(config.customModels);
  }

  const cached = await readCachedCatalog();
  if (cached !== null) return cached;

  log("未找到能力目录缓存，首次探测…");
  return refreshCatalog(config.customModels);
}

/**
 * 手动轮次在“每轮一换”下只预览下一格：定时序列靠游标保证 N 轮内覆盖全部取值，
 * 手动插队记账会让它跳格。“每天一换”照常记账：当天首轮确立取值，同日其余轮次
 * （定时或手动）都沿用它，游标每天只进一格，与谁先跑无关。
 */
export function rotationLedgerFor(trigger: RunRecord["trigger"], rotation: RotationConfig): RotationLedger {
  return trigger === "manual" && rotation.period === "run" ? "preview" : "advance";
}

export interface RenderOptions {
  trigger: RunRecord["trigger"];
  /** 单次执行时手动指定候选题目的映射（promptId -> candidateId） */
  candidateOverrides?: Readonly<Record<string, string>>;
}

export async function renderAll(
  config: AppConfig,
  now: Date,
  log: Logger,
  options: RenderOptions,
): Promise<RenderedPrompt[]> {
  const rendered: RenderedPrompt[] = [];
  const { rotation } = config.run;
  const period = rotationKey(rotation, now);
  const draw: RotationDraw = { rotation, now, ledger: rotationLedgerFor(options.trigger, rotation) };

  for (const promptId of config.run.promptIds) {
    const spec = resolvePrompt(promptId, config.customPrompts);
    const overrideCandidateId = options.candidateOverrides?.[spec.id];
    const result =
      spec.candidates.length > 0
        ? await renderCandidate(spec, draw, overrideCandidateId)
        : await renderPrompt(spec.id, spec.template, spec.variables, draw);
    if (Object.keys(result.bindings).length > 0) {
      const scope = overrideCandidateId
        ? "单次指定"
        : period === null
          ? draw.ledger === "preview" ? "本轮（预览，不推进轮换）" : "本轮"
          : `${period}（${rotation.timeZone}）`;
      log(`提示词 ${spec.id} ${scope}取值：${formatBindings(result.bindings)}`);
    }
    rendered.push(result);
  }
  return rendered;
}

/** 看板卡片以 bindings 作徽章，候选集条目借此显示抽中的回目 */
const CANDIDATE_BADGE = "回目";

/** 候选集条目：单次指定时直接使用；未指定时按轮换周期抽一条，逐字发送该条的完整文本 */
async function renderCandidate(
  spec: PromptSpec,
  draw: RotationDraw,
  overrideCandidateId?: string,
): Promise<RenderedPrompt> {
  let candidate: PromptCandidate | undefined;
  if (overrideCandidateId) {
    candidate = spec.candidates.find((item) => item.id === overrideCandidateId);
    if (candidate === undefined) {
      throw new Error(`提示词 ${spec.id} 指定了不存在的候选 ${overrideCandidateId}`);
    }
  } else {
    const pickedId = await pickCandidate(
      spec.id,
      spec.candidates.map((candidate) => candidate.id),
      draw,
    );
    candidate = spec.candidates.find((item) => item.id === pickedId);
    if (candidate === undefined) throw new Error(`提示词 ${spec.id} 抽中了不存在的候选 ${pickedId}`);
  }
  return { promptId: spec.id, text: candidate.text, bindings: { [CANDIDATE_BADGE]: candidate.label } };
}

/**
 * 展开 `提示词 × 目标` 并逐项折叠思考强度。折叠依据该模型探测到的能力而非所属 CLI
 * （如 codex 的 gpt-6-astra 支持到 ultra，gpt-5.5 只到 xhigh），因此集中在此处。
 */
export function buildJobs(
  config: AppConfig,
  prompts: readonly RenderedPrompt[],
  catalog: CapabilitySnapshot | null,
  log: Logger,
): Job[] {
  const jobs: Job[] = [];

  for (const prompt of prompts) {
    for (const target of config.targets) {
      const supported = effortsFor(catalog, target.cli, target.model);
      const appliedEffort = foldEffort(target.effort, supported);

      if (appliedEffort !== target.effort) {
        log(
          `${target.id}：${target.model} 不支持 ${target.effort}，折叠为 ${appliedEffort}` +
            `（可用 ${supported.join("/")}）`,
        );
      }
      jobs.push({
        target,
        prompt,
        appliedEffort,
        effortAdjustable: isEffortAdjustable(catalog, target.cli, target.model),
      });
    }
  }
  return jobs;
}

/**
 * 按 CLI × profile × 模型分道，道内按强度从低到高排列（同强度保持原顺序），
 * 低档先出结果，耗时最长的 max 放在最后。同一模型经不同上游是不同的道：
 * 限速按上游计，彼此不必排队。
 */
export function groupIntoLanes(jobs: readonly Job[]): LaneItem[][] {
  const lanes = new Map<string, LaneItem[]>();
  jobs.forEach((job, index) => {
    const key = `${job.target.cli}::${job.target.profile ?? DEFAULT_PROFILE}::${job.target.model}`;
    const lane = lanes.get(key) ?? [];
    lane.push({ job, index });
    lanes.set(key, lane);
  });

  const rank = (item: LaneItem) => EFFORT_LEVELS.indexOf(item.job.target.effort);
  return [...lanes.values()].map((lane) => lane.sort((a, b) => rank(a) - rank(b) || a.index - b.index));
}

export interface LaneIdentity {
  cli: CliKind;
  model: string;
  /** 非默认 profile 才有；默认 profile 的道与引入 profile 之前逐字相同 */
  profile?: string;
}

/** 道的 CLI、模型与 profile；groupIntoLanes 不产出空道，遇到空道直接抛错 */
export function laneIdentity(lane: readonly LaneItem[]): LaneIdentity {
  const head = lane[0];
  if (head === undefined) throw new Error("分道为空：groupIntoLanes 的不变量被破坏");
  const { cli, model, profile } = head.job.target;
  return profile === undefined ? { cli, model } : { cli, model, profile };
}

/** 进度文件的初始形态：全部调用排队中，顺序与实际执行顺序一致 */
export function describeProgress(
  runId: string,
  trigger: RunRecord["trigger"],
  startedAt: Date,
  laneLimit: number,
  lanes: readonly LaneItem[][],
): Omit<RunProgress, "updatedAt" | "finishedAt" | "pid"> {
  return {
    runId,
    trigger,
    startedAt: startedAt.toISOString(),
    laneLimit,
    lanes: lanes.map((lane) => ({
      ...laneIdentity(lane),
      calls: lane.map(({ job }) => ({
        targetId: job.target.id,
        promptId: job.prompt.promptId,
        effort: job.target.effort,
        state: "queued",
        startedAt: null,
        timeoutMs: job.target.timeoutMs,
        status: null,
        durationMs: null,
      })),
    })),
  };
}

function formatBindings(bindings: Record<string, string>): string {
  return Object.entries(bindings)
    .map(([name, value]) => `${name}=${value}`)
    .join(", ");
}
