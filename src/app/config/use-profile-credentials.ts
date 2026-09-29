import { useState } from "react";
import type { CliKind } from "@/core/types";
import type { ProfileCredentialTable } from "@/core/profile-credentials";
import { actionFetch } from "../components/action-fetch";
import { describeError } from "./config-editor-model";

const ENDPOINT = "/api/profiles/credential";

export type CredentialOutcome = { ok: true } | { ok: false; error: string };
export type ModelSyncOutcome = { ok: true; models: string[] } | { ok: false; error: string };

/** 向上游拉模型清单；只读，不改配置 */
async function requestModelSync(cli: CliKind, name: string): Promise<ModelSyncOutcome> {
  try {
    const response = await actionFetch("/api/profiles/models", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cli, name }),
    });
    const payload = (await response.json()) as { error?: string; models?: string[] };
    if (!response.ok) return { ok: false, error: payload.error ?? "同步失败" };
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
      if (!response.ok) return { ok: false, error: payload.error ?? "操作失败" };
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
    syncModels: requestModelSync,
  };
}
