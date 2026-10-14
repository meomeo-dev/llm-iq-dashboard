import type { CliCapability } from "@/capabilities/types";
import { useI18n } from "@/i18n";

export function CliCapabilityCard({ capability }: { capability: CliCapability }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="cli-card">
      <div className="cli-head">
        <strong>{capability.cli}</strong>
        <span className={capability.available ? "cli-availability ok" : "cli-availability error"}>
          {capability.available ? (isEn ? "Available" : "可用") : isEn ? "Unavailable" : "不可用"}
        </span>
      </div>
      <div className="cli-body">
        <div>
          {isEn ? (
            <>
              Models: <b>{capability.models.length}</b>
            </>
          ) : (
            <>
              模型 <b>{capability.models.length}</b> 个
            </>
          )}
        </div>
        <div>
          {isEn ? "Efforts" : "强度"} {capability.efforts.join(" / ")}
        </div>
        {capability.notes.map((note) => (
          <div key={note} className="note">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
