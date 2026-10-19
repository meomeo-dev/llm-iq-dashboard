import type { SessionView } from "@/app/api/session/route";
import { ConfirmButton } from "@/app/components/ui/Button";
import { useI18n } from "@/i18n";
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
              <ConfirmButton
                size="sm"
                confirmLabel={
                  device.current
                    ? isEn
                      ? "Confirm Sign Out"
                      : "确认退出"
                    : isEn
                      ? "Confirm Revoke"
                      : "确认吊销"
                }
                onConfirm={() => onRevoke(device.id, device.current)}
              >
                {device.current
                  ? isEn
                    ? "Sign Out"
                    : "退出"
                  : isEn
                    ? "Revoke"
                    : "吊销"}
              </ConfirmButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
