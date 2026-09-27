"use client";

interface PickerHeadProps {
  title: string;
  picked: number;
  all: string[];
  onPick: (next: ReadonlySet<string>) => void;
}

export function PickerHead({ title, picked, all, onPick }: PickerHeadProps) {
  return (
    <div className="run-once-head">
      <b>{title}</b>
      <span className="menu-row-count">
        {picked}/{all.length}
      </span>
      <div className="check-bulk">
        <button type="button" onClick={() => onPick(new Set(all))} disabled={picked === all.length}>
          全选
        </button>
        <button type="button" onClick={() => onPick(new Set())} disabled={picked === 0}>
          清空
        </button>
      </div>
    </div>
  );
}

interface RunOnceHeadBarProps {
  mobileTab: "models" | "prompts";
  onSelectTab: (tab: "models" | "prompts") => void;
  targetCount: number;
  allTargetIds: string[];
  onPickTargets: (next: ReadonlySet<string>) => void;
  promptCount: number;
  allPromptIds: string[];
  onPickPrompts: (next: ReadonlySet<string>) => void;
  onClose: () => void;
}

export function RunOnceHeadBar({
  mobileTab,
  onSelectTab,
  targetCount,
  allTargetIds,
  onPickTargets,
  promptCount,
  allPromptIds,
  onPickPrompts,
  onClose,
}: RunOnceHeadBarProps) {
  return (
    <div className="run-once-head-bar">
      <div
        className={`run-once-head-cell ${mobileTab === "models" ? "tab-active" : ""}`}
        onClick={() => onSelectTab("models")}
      >
        <PickerHead title="范围" picked={targetCount} all={allTargetIds} onPick={onPickTargets} />
      </div>
      <div
        className={`run-once-head-cell ${mobileTab === "prompts" ? "tab-active" : ""}`}
        onClick={() => onSelectTab("prompts")}
      >
        <PickerHead title="题目" picked={promptCount} all={allPromptIds} onPick={onPickPrompts} />
      </div>
      <button
        type="button"
        className="run-once-close"
        onClick={onClose}
        title="关闭"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}
