"use client";

import type { SessionView } from "@/app/api/session/route";
import { useDevicePanel } from "./use-device-panel";
import { DeviceTable } from "./DeviceTable";

/** 配置页末尾的已配对设备列表：可逐台吊销；吊销当前设备等于退出 */
export function DevicePanel({
  pairCommand,
  initialView,
}: {
  pairCommand: string;
  initialView?: SessionView | null;
}) {
  const hookResult = useDevicePanel();
  const view = initialView !== undefined ? initialView : hookResult.view;
  const error = hookResult.error;
  const revoke = hookResult.revoke;

  if (view === null || !view.owner) return null;

  return (
    <section id="devices" className="config-section">
      <header>
        <h2>已配对设备</h2>
        <p>
          每台配对过的浏览器一条。再配对一台：<code>{pairCommand}</code>；清空：<code>{pairCommand} --revoke-all</code>。
        </p>
      </header>
      <DeviceTable devices={view.devices} onRevoke={revoke} />
      {error !== null && <p className="device-error">{error}</p>}
    </section>
  );
}
