/**
 * 从第三方上游拉取模型清单：OpenAI 兼容接口的 `GET {baseUrl}/models`，
 * 响应形如 `{ data: [{ id }] }`。key 只放在请求头里，不进 URL、不进返回值与错误信息。
 *
 * 本机直跑时看板进程直接调用；分容器时看板读不到凭据目录，经 profile-models 请求交给执行器。
 */

import type { AppConfig } from "./config";
import { readProfileKey } from "./profile-credentials";
import type { CliKind } from "./types";

const FETCH_TIMEOUT_MS = 15_000;
/** 响应体上限：模型清单通常几十 KB，超出多半不是模型列表接口 */
const MAX_BODY_BYTES = 2_000_000;

export type ModelListOutcome = { ok: true; models: string[] } | { ok: false; error: string };

export function modelsUrl(baseUrl: string, queryParams: Record<string, string>): string {
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/models`);
  for (const [key, value] of Object.entries(queryParams)) url.searchParams.set(key, value);
  return url.toString();
}

/** 取 data[].id（OpenAI 形状），兼容少数上游直接返回 models[] 或字符串数组；去重排序 */
export function parseModelIds(body: unknown): string[] {
  const record = body !== null && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const list = Array.isArray(body) ? body : Array.isArray(record.data) ? record.data : record.models;
  if (!Array.isArray(list)) return [];
  const ids = list
    .map((item) => (typeof item === "string" ? item : (item as Record<string, unknown> | null)?.id))
    .filter((id): id is string => typeof id === "string" && id.trim() !== "")
    .map((id) => id.trim());
  return [...new Set(ids)].sort();
}

export async function fetchUpstreamModels(
  cli: CliKind,
  name: string,
  config: AppConfig,
): Promise<ModelListOutcome> {
  const profile = config.profiles.find((item) => item.cli === cli && item.name === name);
  if (profile === undefined) return { ok: false, error: `配置里没有 ${cli} profile ${name}，请先保存配置` };
  const key = await readProfileKey(cli, name);
  if (key === null) return { ok: false, error: "还没有填 API key" };

  let response: Response;
  try {
    response = await fetch(modelsUrl(profile.baseUrl, profile.queryParams), {
      headers: { authorization: `Bearer ${key}`, "api-key": key, accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "error",
    });
  } catch (cause) {
    return { ok: false, error: `请求上游失败：${cause instanceof Error ? cause.message : String(cause)}` };
  }
  if (!response.ok) return { ok: false, error: `上游返回 HTTP ${response.status}；检查接口地址是否含 /v1 与 key 是否有效` };

  const text = await response.text();
  if (text.length > MAX_BODY_BYTES) return { ok: false, error: "上游响应过大，不像模型列表接口" };
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, error: "上游响应不是 JSON；检查接口地址是否指向 API 而不是官网" };
  }
  const models = parseModelIds(body);
  if (models.length === 0) return { ok: false, error: "上游没有返回任何模型" };
  return { ok: true, models };
}
