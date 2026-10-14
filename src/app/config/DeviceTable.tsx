import type { SessionView } from "@/app/api/session/route";
import { useI18n } from "@/i18n/context";
import { formatDeviceTime } from "./device-panel-model";

export function DeviceTable({
  devices,
  onRevoke,
}: {
  devices: SessionView["devices"];
  onRevoke: (id: string, current: boolean) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <table className="device-table">
      <thead>
        <tr>
          <th>{isEn ? "Device" : "设备"}</th>
          <th>{isEn ? "Issued" : "签发"}</th>
          <th>{isEn ? "Last Active" : "最近使用"}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={device.id}>
            <td>
              {device.name}
              {device.current && (
                <span className="device-current">
                  {isEn ? " (this browser)" : "（本浏览器）"}
                </span>
              )}
            </td>
            <td>{formatDeviceTime(device.issuedAt)}</td>
            <td>{formatDeviceTime(device.lastSeenAt)}</td>
            <td>
              <button
                type="button"
                onClick={() => void onRevoke(device.id, device.current)}
              >
                {device.current
                  ? isEn
                    ? "Sign Out"
                    : "退出"
                  : isEn
                    ? "Revoke"
                    : "吊销"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
