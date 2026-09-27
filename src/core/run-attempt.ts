/**
 * 单次调用：在干净的临时工作目录里向 CLI 提问，落盘转录与作品，把所有失败路径
 * 收敛为一条完整的 Attempt 记录，不抛错。
 */

import { mkdir } from "node:fs/promises";
import { installHouseRules } from "./house-rules";
import type { LeakGuard } from "./leak-guard";
import { scratchDir } from "./paths";
import type { Job } from "./run-plan";
import { writeArtifact } from "./store";
import { extractSvg, extractSvgFilePath, type ExtractedSvg } from "./svg";
import type { Attempt } from "./types";
import type { AgentReply, SessionPool } from "../adapters/index";
import { readWrittenFile } from "../adapters/written-files";
import { usageFromTranscript } from "../pricing/usage";

/** 一轮内所有调用共用的上下文 */
export interface AttemptContext {
  runId: string;
  sessions: SessionPool;
  signal: AbortSignal;
  /** 本轮开始时构建的凭据指纹，输出落盘前比对 */
  leakGuard: LeakGuard;
}

/** 命中凭据指纹时记录里的失败说明；作品与转录都不落盘 */
export const LEAK_BLOCKED = "输出含凭据指纹，已拦截：作品与转录未保存";

/** 执行单个任务；所有失败路径都经 buildAttempt 返回完整记录，不抛错 */
export async function runAttempt(job: Job, context: AttemptContext): Promise<Attempt> {
  const { runId, sessions, signal, leakGuard } = context;
  const { target, prompt, appliedEffort, effortAdjustable } = job;
  const startedAt = new Date();
  // 同一目标回答多条提示词，产物文件名带提示词 id 以免互相覆盖
  const artifactId = `${target.id}__${prompt.promptId}`;
  const workdir = scratchDir(runId, artifactId);

  try {
    await mkdir(workdir, { recursive: true });
    // 考场规则写入工作目录，提示词保持逐字不变
    await installHouseRules(workdir);

    const reply = await sessions.sessionFor(target.cli).ask({
      target,
      promptText: prompt.text,
      workdir,
      appliedEffort,
      effortAdjustable,
      timeoutMs: target.timeoutMs,
      signal,
    });
    // 用量随记录落盘；成本由看板按价格目录另算
    const usage = usageFromTranscript(target.cli, reply.transcript);
    // 落盘前先查泄漏：转录含全部事件流，回答与写出的文件都在其中
    if (leaks(reply, leakGuard)) {
      return buildAttempt(job, startedAt, { status: "error", error: LEAK_BLOCKED, effortHonored: reply.effortHonored, usage });
    }
    const rawFile = await writeArtifact(runId, `${artifactId}.txt`, reply.transcript);
    const svg = await findSvg(reply);

    // 作品优先：超时前已交出的 SVG 仍是有效结果（如画完后卡在校验文件上）
    if (svg !== null) {
      const svgFile = await writeArtifact(runId, `${artifactId}.svg`, svg.source);
      return buildAttempt(job, startedAt, {
        status: "ok",
        rawFile,
        svgFile,
        effortHonored: reply.effortHonored,
        svgBytes: svg.bytes,
        usage,
      });
    }
    return buildAttempt(job, startedAt, {
      ...classifyFailure(reply, target.timeoutMs),
      rawFile,
      effortHonored: reply.effortHonored,
      usage,
    });
  } catch (cause) {
    // 调用链本身出错（可执行文件缺失、磁盘不可写），记为 error 以区别于 no-svg
    return buildAttempt(job, startedAt, {
      status: "error",
      error: cause instanceof Error ? cause.message : String(cause),
    });
  }
}

/** 回答、写出的文件与转录任一含凭据指纹即视为泄漏 */
function leaks(reply: AgentReply, guard: LeakGuard): boolean {
  if (guard.size === 0) return false;
  return guard.hits(reply.text) || reply.writtenFiles.some((file) => guard.hits(file.content)) || guard.hits(reply.transcript);
}

/**
 * 没有作品时区分超时、CLI 报错（运维故障）与模型未给出可用 SVG（基准结果），
 * 后两者混同会使成功率失真。
 */
function classifyFailure(
  reply: AgentReply,
  timeoutMs: number,
): Pick<Attempt, "status" | "error"> {
  if (reply.timedOut) {
    return {
      status: "timeout",
      error:
        `超过 ${Math.round(timeoutMs / 1000)} 秒未返回，已终止。` +
        "该 CLI 的延迟可能随时段波动，可在配置的 run.timeoutByCli 或 run.timeoutByEffort 中单独调高",
    };
  }
  if (reply.error !== null) return { status: "error", error: reply.error };

  // 优先用适配器从事件流得到的具体原因（如工具调用被拒）
  const reason = reply.notes.length > 0 ? reply.notes.join("；") : null;
  return { status: "no-svg", error: reason ?? "回答中未找到成对的 <svg>…</svg>" };
}

/**
 * 按可信度依次寻找作品：回答中的内联 SVG → 模型写出的文件（从最后写的一份起）
 * → 回答里给出的 `file://…/*.svg` 路径。文件内容同样经 extractSvg 校验，
 * 须含成对的 <svg>…</svg> 才算作品。
 */
async function findSvg(reply: AgentReply): Promise<ExtractedSvg | null> {
  const inline = extractSvg(reply.text);
  if (inline !== null) return inline;

  for (const file of [...reply.writtenFiles].reverse()) {
    const fromFile = extractSvg(file.content);
    if (fromFile !== null) return fromFile;
  }

  const linkedPath = extractSvgFilePath(reply.text);
  if (linkedPath === null) return null;
  const linked = await readWrittenFile(linkedPath);
  return linked === null ? null : extractSvg(linked.content);
}

type AttemptOverrides = Pick<Attempt, "status"> &
  Partial<Pick<Attempt, "rawFile" | "svgFile" | "svgBytes" | "error" | "effortHonored" | "usage">>;

export function buildAttempt(
  job: Job,
  startedAt: Date,
  overrides: AttemptOverrides,
): Attempt {
  const finishedAt = new Date();
  const { target, prompt, appliedEffort } = job;

  return {
    targetId: target.id,
    promptId: prompt.promptId,
    cli: target.cli,
    model: target.model,
    effort: target.effort,
    appliedEffort,
    // 调用未发出就失败时（如可执行文件缺失）按“生效”记录
    effortHonored: overrides.effortHonored ?? true,
    label: target.label,
    status: overrides.status,
    svgFile: overrides.svgFile ?? null,
    rawFile: overrides.rawFile ?? null,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    svgBytes: overrides.svgBytes ?? null,
    error: overrides.error ?? null,
    usage: overrides.usage ?? null,
  };
}
