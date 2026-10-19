import { useEffect, useState } from "react";
import type { SessionView } from "@/app/api/session/route";
import { useI18n } from "@/i18n";
import { actionFetch } from "../components/action-fetch";

export function useDevicePanel() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [view, setView] = useState<SessionView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/session", { cache: "no-store" });
      if (!response.ok) {
        setError(isEn ? `Failed to load devices (HTTP ${response.status})` : `读取设备列表失败（HTTP ${response.status}）`);
        return;
      }
      setView((await response.json()) as SessionView);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : isEn ? "Failed to load devices" : "读取设备列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const revoke = async (id: string, current: boolean): Promise<void> => {
    try {
      const response = await actionFetch(`/api/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? (isEn ? "Failed to revoke device" : "吊销失败"));
        return;
      }
      if (current) {
        window.location.assign("/");
        return;
      }
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : isEn ? "Failed to revoke device" : "吊销失败");
    }
  };

  return { view, loading, error, revoke };
}
