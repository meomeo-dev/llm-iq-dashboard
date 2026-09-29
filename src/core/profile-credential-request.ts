/**
 * 写入或删除 profile 的 API key：校验 profile 已登记后落到凭据目录。
 * 本机直跑时看板进程直接调用 applyProfileCredential；分容器时看板经请求文件交给执行器，
 * 执行器以 handleProfileCredential 处理（见 core/requests.ts 的 profile-credential）。
 */

import type { AppConfig } from "./config";
import { deleteProfileKey, validateApiKey, writeProfileKey } from "./profile-credentials";
import { completeRequest, failRequest, type ProfileCredentialAction, type RunnerRequest } from "./requests";

export async function applyProfileCredential(
  action: ProfileCredentialAction,
  config: AppConfig,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const registered = config.profiles.some((profile) => profile.cli === action.cli && profile.name === action.name);
  // 只接受已保存到配置里的 profile：key 文件名取自 profile 名，防止任意路径写入
  if (!registered) return { ok: false, error: `配置里没有 ${action.cli} profile ${action.name}，请先保存配置` };

  if (action.op === "delete") {
    await deleteProfileKey(action.cli, action.name);
    return { ok: true };
  }
  const checked = validateApiKey(action.apiKey);
  if (!checked.ok) return checked;
  await writeProfileKey(action.cli, action.name, checked.key);
  return { ok: true };
}

export async function handleProfileCredential(request: RunnerRequest, config: AppConfig): Promise<void> {
  const action = request.profileCredential;
  if (action === undefined || action === null) {
    await failRequest(request.id, "缺少 profile 凭据载荷");
    return;
  }
  const outcome = await applyProfileCredential(action, config).catch((cause: unknown) => ({
    ok: false as const,
    error: cause instanceof Error ? cause.message : String(cause),
  }));
  if (outcome.ok) await completeRequest(request.id, {});
  else await failRequest(request.id, outcome.error);
}
