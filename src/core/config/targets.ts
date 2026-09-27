/**
 * 评测目标矩阵（targets）解析与超时优先级计算
 */

import { buildTargetId, CLI_KINDS, EFFORT_LEVELS, type CliKind, type EffortLevel, type Target } from "../types";
import type { RunConfig } from "./types";
import { asRecord, isCliKind, isEffortLevel, optionalNumber, optionalString } from "./parsers-common";

export function parseExtraArgs(raw: unknown, where: string, errors: string[]): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((arg) => typeof arg !== "string")) {
    errors.push(`${where}.extraArgs 必须是字符串数组`);
    return [];
  }
  return raw as string[];
}

interface TargetFields {
  cli: CliKind;
  model: string;
  effort: EffortLevel;
}

function validateTargetFields(
  node: Record<string, unknown>,
  where: string,
  errors: string[],
): TargetFields | null {
  const cli = optionalString(node.cli);
  const model = optionalString(node.model);
  const effort = optionalString(node.effort);

  if (!isCliKind(cli)) {
    errors.push(`${where}.cli 必须是 ${CLI_KINDS.join(" / ")}，当前为 ${cli}`);
    return null;
  }
  if (model === null) {
    errors.push(`${where}.model 缺失`);
    return null;
  }
  if (!isEffortLevel(effort)) {
    errors.push(`${where}.effort 必须是 ${EFFORT_LEVELS.join(" / ")}，当前为 ${effort}`);
    return null;
  }
  return { cli, model, effort };
}

function resolveTargetTimeout(
  node: Record<string, unknown>,
  run: RunConfig,
  cli: CliKind,
  effort: EffortLevel,
): number {
  return (
    optionalNumber(node.timeoutMs) ??
    run.timeoutByEffort[effort] ??
    run.timeoutByCli[cli] ??
    run.defaultTimeoutMs
  );
}

function parseTargetItem(
  item: unknown,
  index: number,
  run: RunConfig,
  seen: Set<string>,
  errors: string[],
): Target | null {
  const where = `targets[${index}]`;
  const node = asRecord(item);
  if (!node) {
    errors.push(`${where} 必须是一个映射`);
    return null;
  }

  const fields = validateTargetFields(node, where, errors);
  if (!fields) return null;

  const { cli, model, effort } = fields;
  const id = buildTargetId(cli, model, effort);
  if (seen.has(id)) {
    errors.push(`${where} 与前面的条目重复：${id}`);
    return null;
  }
  seen.add(id);

  return {
    id,
    cli,
    model,
    effort,
    label: optionalString(node.label) ?? `${model} · ${effort}`,
    timeoutMs: resolveTargetTimeout(node, run, cli, effort),
    extraArgs: parseExtraArgs(node.extraArgs, where, errors),
    enabled: node.enabled !== false,
  };
}

export function parseTargets(raw: unknown, run: RunConfig, errors: string[]): Target[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push("targets 必须是非空数组");
    return [];
  }

  const seen = new Set<string>();
  const targets: Target[] = [];

  raw.forEach((item, index) => {
    const target = parseTargetItem(item, index, run, seen, errors);
    if (target) targets.push(target);
  });

  if (!targets.some((target) => target.enabled) && errors.length === 0) {
    errors.push("targets 中没有任何已启用的条目：定时任务至少要有一项");
  }
  return targets;
}
