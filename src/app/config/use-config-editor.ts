import { useState } from "react";
import { useRouter } from "next/navigation";
import { actionFetch } from "../components/action-fetch";
import {
  type EditableConfig,
  type ConfigEditorStatus,
  describeError,
  buildConfigPatchBody,
} from "./config-editor-model";

async function requestSaveConfig(
  draft: EditableConfig,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await actionFetch("/api/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: buildConfigPatchBody(draft),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) return { ok: false, error: body.error ?? "保存失败" };
    return { ok: true };
  } catch (cause) {
    return { ok: false, error: describeError(cause) };
  }
}

async function requestRunNow(): Promise<
  { ok: true; calls: number } | { ok: false; error: string }
> {
  try {
    const response = await actionFetch("/api/run", { method: "POST" });
    const body = (await response.json()) as { error?: string; calls?: number };
    if (!response.ok) return { ok: false, error: body.error ?? "执行失败" };
    return { ok: true, calls: body.calls ?? 0 };
  } catch (cause) {
    return { ok: false, error: describeError(cause) };
  }
}

export function useConfigEditor(draft: EditableConfig) {
  const [status, setStatus] = useState<ConfigEditorStatus>({ kind: "idle" });
  const router = useRouter();

  const save = async (): Promise<void> => {
    setStatus({ kind: "busy", message: "正在保存…" });
    const result = await requestSaveConfig(draft);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setStatus({ kind: "ok", message: "已保存。调度器会在下一次触发前重新读取配置。" });
    router.refresh();
  };

  const runNow = async (): Promise<void> => {
    setStatus({ kind: "busy", message: "正在发起一轮…" });
    const result = await requestRunNow();
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setStatus({ kind: "ok", message: `已开始，共 ${result.calls} 次调用；进度见首页执行状态。` });
  };

  return { status, save, runNow };
}
