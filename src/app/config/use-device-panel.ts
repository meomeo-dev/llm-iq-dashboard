import { useEffect, useState } from "react";
import type { SessionView } from "@/app/api/session/route";
import { useI18n } from "@/i18n/context";
import { actionFetch } from "../components/action-fetch";

export function useDevicePanel() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [view, setView] = useState<SessionView | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = async (): Promise<void> => {
    const response = await fetch("/api/session", { cache: "no-store" });
    if (response.ok) setView((await response.json()) as SessionView);
  };

  useEffect(() => {
    void reload();
  }, []);

  const revoke = async (id: string, current: boolean): Promise<void> => {
    const confirmMsg = current
      ? isEn
        ? "Revoking the current device will sign you out immediately. Continue?"
        : "吊销当前设备将立即退出登录，继续？"
      : isEn
        ? "Revoke this device?"
        : "吊销该设备？";
    if (!window.confirm(confirmMsg)) return;
    const response = await actionFetch(`/api/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? (isEn ? "Failed to revoke device" : "吊销失败"));
      return;
    }
    if (current) {
      window.location.assign("/");
      return;
    }
    await reload();
  };

  return { view, error, revoke };
}
