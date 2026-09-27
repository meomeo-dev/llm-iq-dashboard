import type { RotationConfig } from "@/core/variables";
import { TIME_ZONE_SUGGESTIONS } from "./rotation-constants";

/** 变量轮换周期；当前周期的取值落盘，重启或中断后同一周期内沿用 */
export function RotationForm({
  value,
  onChange,
}: {
  value: RotationConfig;
  onChange: (next: RotationConfig) => void;
}) {
  return (
    <div className="stack">
      <div className="field-row">
        <span>变量轮换</span>
        <label className="radio">
          <input
            type="radio"
            name="rotation-period"
            checked={value.period === "day"}
            onChange={() => onChange({ ...value, period: "day" })}
          />
          每天一换
        </label>
        <label className="radio">
          <input
            type="radio"
            name="rotation-period"
            checked={value.period === "run"}
            onChange={() => onChange({ ...value, period: "run" })}
          />
          每轮一换
        </label>
        <TimeZoneField
          timeZone={value.timeZone}
          disabled={value.period !== "day"}
          onChange={(timeZone) => onChange({ ...value, timeZone })}
        />
      </div>
      <p className="note">
        每天一换：同一天的各轮共用同一组取值，便于横向对照；顺序变量每天前进一格，随机变量每天抽一次。
        取值记录在 <code>data/variable-state.json</code>，重启或中断后同一天内照旧沿用。
      </p>
    </div>
  );
}

function TimeZoneField({
  timeZone,
  disabled,
  onChange,
}: {
  timeZone: string;
  disabled: boolean;
  onChange: (timeZone: string) => void;
}) {
  return (
    <label>
      按此时区划分“一天”
      <input
        type="text"
        list="rotation-time-zones"
        value={timeZone}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.trim())}
      />
      <datalist id="rotation-time-zones">
        {TIME_ZONE_SUGGESTIONS.map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>
    </label>
  );
}
