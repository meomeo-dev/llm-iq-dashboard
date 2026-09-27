"use client";

import { useEffect, useState } from "react";
import type { SessionView } from "@/app/api/session/route";
import { actionFetch } from "../components/action-fetch";

/** 配置页末尾的已配对设备列表：可逐台吊销；吊销当前设备等于退出 */
export function DevicePanel({ pairCommand }: { pairCommand: string }) {
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
    if (!window.confirm(current ? "吊销当前设备将立即退出登录，继续？" : "吊销该设备？")) return;
    const response = await actionFetch(`/api/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "吊销失败");
      return;
    }
    if (current) {
      window.location.assign("/");
      return;
    }
    await reload();
  };

  if (view === null || !view.owner) return null;
  return (
    <section className="config-section">
      <header>
        <h2>已配对设备</h2>
        <p>
          每台配对过的浏览器一条。再配对一台：<code>{pairCommand}</code>；清空：<code>{pairCommand} --revoke-all</code>。
        </p>
      </header>
      <table className="device-table">
        <thead>
          <tr>
            <th>设备</th>
            <th>签发</th>
            <th>最近使用</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {view.devices.map((device) => (
            <tr key={device.id}>
              <td>
                {device.name}
                {device.current && <span className="device-current">（本浏览器）</span>}
              </td>
              <td>{device.issuedAt.slice(0, 16).replace("T", " ")}</td>
              <td>{device.lastSeenAt.slice(0, 16).replace("T", " ")}</td>
              <td>
                <button type="button" onClick={() => void revoke(device.id, device.current)}>
                  {device.current ? "退出" : "吊销"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error !== null && <p className="device-error">{error}</p>}
    </section>
  );
}
