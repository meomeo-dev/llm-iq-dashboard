"use client";

import {
  localizeCandidateLabel,
  localizePromptGroupLabel,
  localizePromptLabel,
  useI18n,
  type Locale,
} from "@/i18n";
import { groupPrompts, type PromptGroup, type PromptOption } from "./run-once-grouping";
import { toggled } from "./run-once-selection-utils";

interface RunOncePromptsProps {
  prompts: readonly PromptOption[];
  picked: ReadonlySet<string>;
  candidateOverrides: Record<string, string>;
  onPick: (next: ReadonlySet<string>) => void;
  onOverrideCandidate: (promptId: string, candidateId: string) => void;
}

export function RunOncePrompts({
  prompts,
  picked,
  candidateOverrides,
  onPick,
  onOverrideCandidate,
}: RunOncePromptsProps) {
  const { locale } = useI18n();
  const groups = groupPrompts(prompts);
  return (
    <>
      {groups.map((group) => (
        <PromptGroupSection
          key={group.name}
          group={group}
          locale={locale}
          picked={picked}
          candidateOverrides={candidateOverrides}
          onPick={onPick}
          onOverrideCandidate={onOverrideCandidate}
        />
      ))}
    </>
  );
}

interface PromptGroupSectionProps {
  group: PromptGroup;
  locale: Locale;
  picked: ReadonlySet<string>;
  candidateOverrides: Record<string, string>;
  onPick: (next: ReadonlySet<string>) => void;
  onOverrideCandidate: (promptId: string, candidateId: string) => void;
}

function PromptGroupSection({
  group,
  locale,
  picked,
  candidateOverrides,
  onPick,
  onOverrideCandidate,
}: PromptGroupSectionProps) {
  return (
    <div className="run-once-group">
      <div className="run-once-group-header">{localizePromptGroupLabel(group.name, locale)}</div>
      {group.items.map((prompt) => (
        <PromptItemRow
          key={prompt.id}
          prompt={prompt}
          locale={locale}
          isChecked={picked.has(prompt.id)}
          overrideCandidateId={candidateOverrides[prompt.id] ?? ""}
          onToggle={() => onPick(toggled(picked, [prompt.id]))}
          onOverrideCandidate={(candidateId) => onOverrideCandidate(prompt.id, candidateId)}
        />
      ))}
    </div>
  );
}

interface PromptItemRowProps {
  prompt: PromptOption;
  locale: Locale;
  isChecked: boolean;
  overrideCandidateId: string;
  onToggle: () => void;
  onOverrideCandidate: (candidateId: string) => void;
}

function PromptItemRow({
  prompt,
  locale,
  isChecked,
  overrideCandidateId,
  onToggle,
  onOverrideCandidate,
}: PromptItemRowProps) {
  const isEn = locale === "en";
  const hasCandidates = (prompt.candidates?.length ?? 0) > 0;
  const displayLabel = localizePromptLabel(prompt.id, prompt.label, locale);
  return (
    <div className="run-once-prompt-item">
      <label className="menu-row">
        <input type="checkbox" checked={isChecked} onChange={onToggle} />
        <span className="checkbox" aria-hidden="true" />
        <span className="menu-row-name run-once-prompt" title={displayLabel}>
          {displayLabel}
          <small>{prompt.id}</small>
        </span>
      </label>
      {hasCandidates && isChecked && (
        <div className="run-once-candidate-picker">
          <select
            id={`candidate-${prompt.id}`}
            className="candidate-picker-select"
            value={overrideCandidateId}
            onChange={(e) => onOverrideCandidate(e.target.value)}
            aria-label={isEn ? `${displayLabel} specific scene` : `${displayLabel} 指定场景`}
          >
            <option value="">{isEn ? "Random / Daily Rotation (Default)" : "随机 / 每日轮换（默认）"}</option>
            {prompt.candidates!.map((c) => (
              <option key={c.id} value={c.id}>
                {localizeCandidateLabel(c.id, c.label, locale)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
