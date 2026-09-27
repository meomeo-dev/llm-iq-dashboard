"use client";

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
  const groups = groupPrompts(prompts);
  return (
    <>
      {groups.map((group) => (
        <PromptGroupSection
          key={group.name}
          group={group}
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
  picked: ReadonlySet<string>;
  candidateOverrides: Record<string, string>;
  onPick: (next: ReadonlySet<string>) => void;
  onOverrideCandidate: (promptId: string, candidateId: string) => void;
}

function PromptGroupSection({
  group,
  picked,
  candidateOverrides,
  onPick,
  onOverrideCandidate,
}: PromptGroupSectionProps) {
  return (
    <div className="run-once-group">
      <div className="run-once-group-header">{group.name}</div>
      {group.items.map((prompt) => (
        <PromptItemRow
          key={prompt.id}
          prompt={prompt}
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
  isChecked: boolean;
  overrideCandidateId: string;
  onToggle: () => void;
  onOverrideCandidate: (candidateId: string) => void;
}

function PromptItemRow({
  prompt,
  isChecked,
  overrideCandidateId,
  onToggle,
  onOverrideCandidate,
}: PromptItemRowProps) {
  const hasCandidates = (prompt.candidates?.length ?? 0) > 0;
  return (
    <div className="run-once-prompt-item">
      <label className="menu-row">
        <input type="checkbox" checked={isChecked} onChange={onToggle} />
        <span className="checkbox" aria-hidden="true" />
        {/* 名字与 id 分两行：场景轮换题的名字截断后只能靠 id 区分 */}
        <span className="menu-row-name run-once-prompt" title={prompt.label}>
          {prompt.label}
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
            aria-label={`${prompt.label} 指定场景`}
          >
            <option value="">随机 / 每日轮换（默认）</option>
            {prompt.candidates!.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
