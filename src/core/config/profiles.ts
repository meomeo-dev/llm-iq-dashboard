/**
 * profiles 与 upstreamTypes 解析与校验。每个 profile 是一家 CLI 通往某个第三方上游的
 * 一套配置；隐式的默认 profile（登录态）不在列表里，名字 `default` 保留。
 */

import { CLI_KINDS, DEFAULT_PROFILE, type CliKind } from "../types";
import { asRecord, isCliKind, optionalNumber, optionalString } from "./parsers-common";
import { DEFAULT_UPSTREAM_TYPES, type ProfileConfig, type ProfilePricing } from "./types";

/** 首期只有 codex 适配器认识 profile；其余 CLI 的目标只能走默认 profile */
export const PROFILE_CLIS: readonly CliKind[] = ["codex"];

/** kebab-case：小写字母与数字，连字符分隔；同时是产物文件名的一段 */
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const DEFAULT_PRICING: ProfilePricing = { multiplier: 1, overrides: {} };

/** 未配置即起步清单；配置了就以配置为准，每项须是 kebab-case 且不重复 */
export function parseUpstreamTypes(raw: unknown, errors: string[]): string[] {
  if (raw === undefined || raw === null) return [...DEFAULT_UPSTREAM_TYPES];
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push("upstreamTypes 必须是非空数组");
    return [...DEFAULT_UPSTREAM_TYPES];
  }
  const types: string[] = [];
  raw.forEach((item, index) => {
    const value = optionalString(item);
    if (value === null || !NAME_PATTERN.test(value)) {
      errors.push(`upstreamTypes[${index}] 必须是 kebab-case 字符串，当前为 ${String(item)}`);
    } else if (types.includes(value)) {
      errors.push(`upstreamTypes[${index}] 与前面的条目重复：${value}`);
    } else {
      types.push(value);
    }
  });
  return types;
}

export function parseProfiles(
  raw: unknown,
  upstreamTypes: readonly string[],
  errors: string[],
): ProfileConfig[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    errors.push("profiles 必须是数组");
    return [];
  }

  const seen = new Set<string>();
  const profiles: ProfileConfig[] = [];
  raw.forEach((item, index) => {
    const profile = parseProfileItem(item, `profiles[${index}]`, upstreamTypes, errors);
    if (profile === null) return;
    if (seen.has(profile.name)) {
      errors.push(`profiles[${index}].name 与前面的条目重复：${profile.name}`);
      return;
    }
    seen.add(profile.name);
    profiles.push(profile);
  });
  return profiles;
}

function parseProfileItem(
  item: unknown,
  where: string,
  upstreamTypes: readonly string[],
  errors: string[],
): ProfileConfig | null {
  const node = asRecord(item);
  if (node === null) {
    errors.push(`${where} 必须是一个映射`);
    return null;
  }

  const name = parseName(node.name, where, errors);
  const cli = parseCli(node.cli, where, errors);
  const upstreamType = parseEnum(node.upstreamType, upstreamTypes, `${where}.upstreamType`, errors);
  const baseUrl = parseHttpsUrl(node.baseUrl, `${where}.baseUrl`, errors);
  if (node.baseUrl === undefined) errors.push(`${where}.baseUrl 缺失`);
  const models = parseModels(node.models, where, errors);
  if (models.length === 0) errors.push(`${where}.models 缺失：第三方上游探测不到模型，须手工列出`);
  if (node.enabled !== undefined && typeof node.enabled !== "boolean") {
    errors.push(`${where}.enabled 必须是布尔值`);
  }
  if (name === null || cli === null || upstreamType === null || baseUrl === null) return null;

  return {
    name,
    cli,
    upstreamType,
    group: optionalString(node.group),
    website: parseHttpsUrl(node.website, `${where}.website`, errors),
    baseUrl,
    queryParams: parseStringMap(node.queryParams, `${where}.queryParams`, errors),
    models,
    pricing: parsePricing(node.pricing, `${where}.pricing`, errors),
    enabled: node.enabled !== false,
  };
}

function parseName(raw: unknown, where: string, errors: string[]): string | null {
  const name = optionalString(raw);
  if (name === null) {
    errors.push(`${where}.name 缺失`);
    return null;
  }
  if (name === DEFAULT_PROFILE) {
    errors.push(`${where}.name 不能是 ${DEFAULT_PROFILE}：它是隐式的登录态 profile`);
    return null;
  }
  if (!NAME_PATTERN.test(name)) {
    errors.push(`${where}.name 必须是 kebab-case（小写字母、数字、连字符），当前为 ${name}`);
    return null;
  }
  return name;
}

function parseCli(raw: unknown, where: string, errors: string[]): CliKind | null {
  const cli = optionalString(raw);
  if (!isCliKind(cli)) {
    errors.push(`${where}.cli 必须是 ${CLI_KINDS.join(" / ")}，当前为 ${cli}`);
    return null;
  }
  if (!PROFILE_CLIS.includes(cli)) {
    errors.push(`${where}.cli 目前只支持 ${PROFILE_CLIS.join(" / ")} 的 profile，当前为 ${cli}`);
    return null;
  }
  return cli;
}

function parseEnum(
  raw: unknown,
  allowed: readonly string[],
  where: string,
  errors: string[],
): string | null {
  const value = optionalString(raw);
  if (value !== null && allowed.includes(value)) return value;
  errors.push(`${where} 必须是 ${allowed.join(" / ")}，当前为 ${value}`);
  return null;
}

/** 未填返回 null；填了但不是 https 地址报错 */
function parseHttpsUrl(raw: unknown, where: string, errors: string[]): string | null {
  if (raw === undefined || raw === null) return null;
  const text = optionalString(raw);
  if (text === null) {
    errors.push(`${where} 不能为空字符串`);
    return null;
  }
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    errors.push(`${where} 不是合法的 URL：${text}`);
    return null;
  }
  if (url.protocol !== "https:") {
    errors.push(`${where} 必须是 https 地址：${text}`);
    return null;
  }
  return text;
}

function parseModels(raw: unknown, where: string, errors: string[]): string[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw) || raw.some((model) => optionalString(model) === null)) {
    errors.push(`${where}.models 必须是非空字符串数组`);
    return [];
  }
  return raw.map((model) => String(model).trim());
}

function parseStringMap(raw: unknown, where: string, errors: string[]): Record<string, string> {
  if (raw === undefined || raw === null) return {};
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`${where} 必须是字符串到字符串的映射`);
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(node)) {
    if (typeof value !== "string") {
      errors.push(`${where}.${key} 必须是字符串`);
      continue;
    }
    result[key] = value;
  }
  return result;
}

function parsePricing(raw: unknown, where: string, errors: string[]): ProfilePricing {
  if (raw === undefined || raw === null) return DEFAULT_PRICING;
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`${where} 必须是一个映射`);
    return DEFAULT_PRICING;
  }

  let multiplier = DEFAULT_PRICING.multiplier;
  if (node.multiplier !== undefined) {
    const parsed = optionalNumber(node.multiplier);
    if (parsed === null || parsed <= 0) errors.push(`${where}.multiplier 必须是大于 0 的数`);
    else multiplier = parsed;
  }
  return { multiplier, overrides: parseOverrides(node.overrides, `${where}.overrides`, errors) };
}

/** 形如 `{ "gpt-5.5": { input: 1.25, output: 10 } }`，单价为每百万 token 的 USD */
function parseOverrides(
  raw: unknown,
  where: string,
  errors: string[],
): Record<string, Record<string, number>> {
  if (raw === undefined || raw === null) return {};
  const node = asRecord(raw);
  if (node === null) {
    errors.push(`${where} 必须是模型到单价表的映射`);
    return {};
  }
  const result: Record<string, Record<string, number>> = {};
  for (const [model, table] of Object.entries(node)) {
    const meters = asRecord(table);
    if (meters === null) {
      errors.push(`${where}.${model} 必须是计价项到单价的映射`);
      continue;
    }
    result[model] = {};
    for (const [meter, price] of Object.entries(meters)) {
      const parsed = optionalNumber(price);
      if (parsed === null || parsed < 0) errors.push(`${where}.${model}.${meter} 必须是不小于 0 的数`);
      else result[model][meter] = parsed;
    }
  }
  return result;
}

/** 目标引用的 profile 是否存在：默认 profile 对每家 CLI 都存在，其余按 (cli, name) 查 */
export function profileExists(profiles: readonly ProfileConfig[], cli: CliKind, name: string): boolean {
  if (name === DEFAULT_PROFILE) return true;
  return profiles.some((profile) => profile.cli === cli && profile.name === name);
}

export type { ProfileConfig };
