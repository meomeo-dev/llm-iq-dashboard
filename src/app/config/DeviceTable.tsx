import type { SessionView } from "@/app/api/session/route";
import { formatDeviceTime } from "./device-panel-model";

export function DeviceTable({
  devices,
  onRevoke,
}: {
  devices: SessionView["devices"];
  onRevoke: (id: string, current: boolean) => void;
}) {
  return (
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
        {devices.map((device) => (
          <tr key={device.id}>
            <td>
              {device.name}
              {device.current && <span className="device-current">（本浏览器）</span>}
            </td>
            <td>{formatDeviceTime(device.issuedAt)}</td>
            <td>{formatDeviceTime(device.lastSeenAt)}</td>
            <td>
              <button
                type="button"
                onClick={() => void onRevoke(device.id, device.current)}
              >
                {device.current ? "退出" : "吊销"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
