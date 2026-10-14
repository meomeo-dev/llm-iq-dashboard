import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n, type Locale } from "@/i18n";
import { actionFetch } from "../components/action-fetch";
import {
  type EditableConfig,
  type ConfigEditorStatus,
  describeError,
  buildConfigPatchBody,
} from "./config-editor-model";

async function requestSaveConfig(
  draft: EditableConfig,
  locale: Locale,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await actionFetch("/api/config", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: buildConfigPatchBody(draft),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) return { ok: false, error: body.error ?? (locale === "en" ? "Save failed" : "保存失败") };
    return { ok: true };
  } catch (cause) {
    return { ok: false, error: describeError(cause) };
  }
}

async function requestRunNow(locale: Locale): Promise<
  { ok: true; calls: number } | { ok: false; error: string }
> {
  try {
    const response = await actionFetch("/api/run", { method: "POST" });
    const body = (await response.json()) as { error?: string; calls?: number };
    if (!response.ok) return { ok: false, error: body.error ?? (locale === "en" ? "Run failed" : "执行失败") };
    return { ok: true, calls: body.calls ?? 0 };
  } catch (cause) {
    return { ok: false, error: describeError(cause) };
  }
}

export function useConfigEditor(draft: EditableConfig) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [status, setStatus] = useState<ConfigEditorStatus>({ kind: "idle" });
  const router = useRouter();

  /** 返回是否保存成功，供"先存配置再写 key"这类连续操作判断 */
  const save = async (): Promise<boolean> => {
    setStatus({ kind: "busy", message: isEn ? "Saving…" : "正在保存…" });
    const result = await requestSaveConfig(draft, locale);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return false;
    }
    setStatus({
      kind: "ok",
      message: isEn ? "Saved. The scheduler will reload the config before the next trigger." : "已保存。调度器会在下一次触发前重新读取配置。",
    });
    router.refresh();
    return true;
  };

  const runNow = async (): Promise<void> => {
    setStatus({ kind: "busy", message: isEn ? "Starting a round…" : "正在发起一轮…" });
    const result = await requestRunNow(locale);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setStatus({
      kind: "ok",
      message: isEn
        ? `Started (${result.calls} calls); check execution status on the dashboard.`
        : `已开始，共 ${result.calls} 次调用；进度见首页执行状态。`,
    });
  };

  return { status, save, runNow };
}
