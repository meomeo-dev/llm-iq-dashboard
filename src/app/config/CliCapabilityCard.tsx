import type { CliCapability } from "@/capabilities/types";

export function CliCapabilityCard({ capability }: { capability: CliCapability }) {
  return (
    <div className="cli-card">
      <div className="cli-head">
        <strong>{capability.cli}</strong>
        <span className={capability.available ? "cli-availability ok" : "cli-availability error"}>
          {capability.available ? "可用" : "不可用"}
        </span>
      </div>
      <div className="cli-body">
        <div>
          模型 <b>{capability.models.length}</b> 个
        </div>
        <div>强度 {capability.efforts.join(" / ")}</div>
        {capability.notes.map((note) => (
          <div key={note} className="note">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
