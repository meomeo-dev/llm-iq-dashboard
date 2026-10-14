import type { EffortLevel } from "@/core/types";
import { useI18n } from "@/i18n";
import { formatSeconds, type EffortTierDefinition } from "./timeout-form-model";

export function TimeoutTierCard({
  cardClassName,
  badgeClassName,
  badgeText,
  noteText,
  items,
  currentEfforts,
  onSetEffort,
}: {
  cardClassName: string;
  badgeClassName: string;
  badgeText: string;
  noteText: string;
  items: EffortTierDefinition[];
  currentEfforts: Partial<Record<EffortLevel, number>>;
  onSetEffort: (effort: EffortLevel, seconds: number | null) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className={cardClassName}>
      <div className="tier-header">
        <span className={badgeClassName}>{badgeText}</span>
        <span className="note">{noteText}</span>
      </div>
      <div className="field-row">
        {items.map(({ level, label, desc, defaultSec }) => {
          const override = currentEfforts[level];
          return (
            <label key={level} title={desc}>
              {isEn ? `${label} Timeout (s)` : `${label} 超时（秒）`}
              <input
                type="number"
                min={1}
                value={formatSeconds(override)}
                placeholder={isEn ? `Rec. ${defaultSec}` : `推荐 ${defaultSec}`}
                onChange={(e) =>
                  onSetEffort(
                    level,
                    e.target.value.trim() === "" ? null : Number(e.target.value),
                  )
                }
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
