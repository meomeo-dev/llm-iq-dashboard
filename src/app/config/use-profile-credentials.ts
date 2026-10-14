import { useState } from "react";
import type { CliKind } from "@/core/types";
import type { ProfileCredentialTable } from "@/core/profile-credentials";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../components/action-fetch";
import { describeError } from "./config-editor-model";

const ENDPOINT = "/api/profiles/credential";

export type CredentialOutcome = { ok: true } | { ok: false; error: string };
export type ModelSyncOutcome = { ok: true; models: string[] } | { ok: false; error: string };

const PROFILE_API_ERRORS_EN: Record<string, string> = {
  "请求体不是合法 JSON": "Request body is not valid JSON",
  "缺少 cli 或 name": "Missing cli or name",
  "需要所有者登录": "Owner sign-in required",
  "只读部署": "Read-only deployment",
  "还没有填 API key": "API key has not been set yet",
  "上游响应过大，不像模型列表接口": "Upstream response is too large to be a model list endpoint",
  "上游响应不是 JSON；检查接口地址是否指向 API 而不是官网":
    "Upstream response is not JSON; check that baseUrl points to the API endpoint rather than the website",
  "上游没有返回任何模型": "Upstream returned no models",
  "执行器未响应，API key 未保存": "Runner did not respond; API key was not saved",
  "执行器未响应，未能拉取模型清单": "Runner did not respond; failed to fetch model list",
  "缺少 profile 凭据载荷": "Missing profile credential payload",
  "缺少 profile 载荷": "Missing profile payload",
  "apiKey 必须是字符串": "apiKey must be a string",
  "apiKey 不能为空": "apiKey cannot be empty",
  "apiKey 不能含空白或控制字符": "apiKey cannot contain whitespace or control characters",
  "同步失败": "Sync failed",
  "操作失败": "Operation failed",
};

export function localizeProfileApiError(error: string, locale: Locale = "zh-CN"): string {
  if (locale !== "en") return error;
  if (error in PROFILE_API_ERRORS_EN) return PROFILE_API_ERRORS_EN[error]!;
  const missingMatch = /^配置里没有 (\S+) profile (.+)，请先保存配置$/.exec(error);
  if (missingMatch) return `Profile ${missingMatch[2]} for ${missingMatch[1]} is not in the config; save config first`;
  const upstreamHttp = /^上游返回 HTTP (\d+)；检查接口地址是否含 \/v1 与 key 是否有效$/.exec(error);
  if (upstreamHttp) return `Upstream returned HTTP ${upstreamHttp[1]}; check whether baseUrl includes /v1 and key is valid`;
  if (error.startsWith("请求上游失败：")) return `Upstream request failed: ${error.slice("请求上游失败：".length)}`;
  const keyLenMatch = /^apiKey 超过 (\d+) 个字符$/.exec(error);
  if (keyLenMatch) return `apiKey exceeds ${keyLenMatch[1]} characters`;
  if (error.startsWith("写操作须带请求头 ")) return `Write action requires header ${error.slice("写操作须带请求头 ".length)}`;
  return error;
}

/** 向上游拉模型清单；只读，不改配置 */
export async function requestModelSync(
  cli: CliKind,
  name: string,
  locale: Locale = "zh-CN",
): Promise<ModelSyncOutcome> {
  try {
    const response = await actionFetch("/api/profiles/models", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cli, name }),
    });
    const payload = (await response.json()) as { error?: string; models?: string[] };
    if (!response.ok) {
      const fallback = locale === "en" ? "Sync failed" : "同步失败";
      return { ok: false, error: localizeProfileApiError(payload.error ?? fallback, locale) };
    }
    return { ok: true, models: payload.models ?? [] };
  } catch (cause) {
    return { ok: false, error: describeError(cause) };
  }
}

/**
 * profile 的 API key 状态与写入。key 立即提交，不随"保存配置"走：
 * 配置文件里不出现 key，服务端只回"已填"的时刻。
 */
export function useProfileCredentials(initial: ProfileCredentialTable) {
  const { locale } = useI18n();
  const [credentials, setCredentials] = useState<ProfileCredentialTable>(initial);

  const send = async (
    method: "PUT" | "DELETE",
    body: { cli: CliKind; name: string; apiKey?: string },
  ): Promise<CredentialOutcome> => {
    try {
      const response = await actionFetch(ENDPOINT, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { error?: string; credentials?: ProfileCredentialTable };
      if (!response.ok) {
        const fallback = locale === "en" ? "Operation failed" : "操作失败";
        return { ok: false, error: localizeProfileApiError(payload.error ?? fallback, locale) };
      }
      if (payload.credentials !== undefined) setCredentials(payload.credentials);
      return { ok: true };
    } catch (cause) {
      return { ok: false, error: describeError(cause) };
    }
  };

  return {
    credentials,
    saveKey: (cli: CliKind, name: string, apiKey: string) => send("PUT", { cli, name, apiKey }),
    deleteKey: (cli: CliKind, name: string) => send("DELETE", { cli, name }),
    syncModels: (cli: CliKind, name: string, syncLocale: Locale = locale) =>
      requestModelSync(cli, name, syncLocale),
  };
}
