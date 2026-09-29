/**
 * 评测目标矩阵（targets）解析与超时优先级计算
 */

import {
  buildTargetId, CLI_KINDS, DEFAULT_PROFILE, EFFORT_LEVELS,
  type CliKind, type EffortLevel, type Target,
} from "../types";
import type { ProfileConfig, RunConfig } from "./types";
import { asRecord, isCliKind, isEffortLevel, optionalNumber, optionalString } from "./parsers-common";
import { profileDisplayName, profileExists } from "./profiles";

export function parseExtraArgs(raw: unknown, where: string, errors: string[]): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((arg) => typeof arg !== "string")) {
    errors.push(`${where}.extraArgs 必须是字符串数组`);
    return [];
  }
  return raw as string[];
}

export interface TargetFields {
  cli: CliKind;
  profile: string;
  model: string;
  effort: EffortLevel;
}

function validateTargetFields(
  node: Record<string, unknown>,
  where: string,
  profiles: readonly ProfileConfig[],
  errors: string[],
): TargetFields | null {
  const cli = optionalString(node.cli);
  const profile = optionalString(node.profile) ?? DEFAULT_PROFILE;
  const model = optionalString(node.model);
  const effort = optionalString(node.effort);

  if (!isCliKind(cli)) {
    errors.push(`${where}.cli 必须是 ${CLI_KINDS.join(" / ")}，当前为 ${cli}`);
    return null;
  }
  if (!profileExists(profiles, cli, profile)) {
    errors.push(`${where}.profile 引用了 profiles 里没有的 ${cli} profile：${profile}`);
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
  return { cli, profile, model, effort };
}

/** 默认 profile 的显示名与引入 profile 之前相同，非默认的把 profile 的显示名附在最后 */
export function defaultLabel(fields: TargetFields, profiles: readonly ProfileConfig[]): string {
  const base = `${fields.model} · ${fields.effort}`;
  if (fields.profile === DEFAULT_PROFILE) return base;
  const profile = profiles.find((item) => item.cli === fields.cli && item.name === fields.profile);
  return `${base} · ${profile === undefined ? fields.profile : profileDisplayName(profile)}`;
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

interface TargetParseContext {
  run: RunConfig;
  profiles: readonly ProfileConfig[];
  seen: Set<string>;
  errors: string[];
}

function parseTargetItem(item: unknown, index: number, ctx: TargetParseContext): Target | null {
  const { run, profiles, seen, errors } = ctx;
  const where = `targets[${index}]`;
  const node = asRecord(item);
  if (!node) {
    errors.push(`${where} 必须是一个映射`);
    return null;
  }

  const fields = validateTargetFields(node, where, profiles, errors);
  if (!fields) return null;

  const { cli, profile, model, effort } = fields;
  const id = buildTargetId(cli, model, effort, profile);
  if (seen.has(id)) {
    errors.push(`${where} 与前面的条目重复：${id}`);
    return null;
  }
  seen.add(id);

  return {
    id,
    cli,
    // 默认 profile 不写字段，Target 与引入 profile 之前形状相同
    ...(profile === DEFAULT_PROFILE ? {} : { profile }),
    model,
    effort,
    label: optionalString(node.label) ?? defaultLabel(fields, profiles),
    timeoutMs: resolveTargetTimeout(node, run, cli, effort),
    extraArgs: parseExtraArgs(node.extraArgs, where, errors),
    enabled: node.enabled !== false,
  };
}

export function parseTargets(
  raw: unknown,
  run: RunConfig,
  profiles: readonly ProfileConfig[],
  errors: string[],
): Target[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push("targets 必须是非空数组");
    return [];
  }

  const ctx: TargetParseContext = { run, profiles, seen: new Set<string>(), errors };
  const targets: Target[] = [];

  raw.forEach((item, index) => {
    const target = parseTargetItem(item, index, ctx);
    if (target) targets.push(target);
  });

  if (!targets.some((target) => target.enabled) && errors.length === 0) {
    errors.push("targets 中没有任何已启用的条目：定时任务至少要有一项");
  }
  return targets;
}
