"use client";

import { useCallback, useState } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { Menu } from "../menu/Menu";
import { prefetchRunOptions } from "./run-once-api";
import { RunOnceFooter } from "./RunOnceFooter";
import { RunOnceHeadBar } from "./RunOnceHeadBar";
import { ModelRows } from "./RunOnceModelRows";
import { RunOncePrompts } from "./RunOncePrompts";
import { UnavailableNote } from "./UnavailableNote";
import { useRunOnceLauncher } from "./use-run-once-launcher";
import { useRunOnceOptions } from "./use-run-once-options";
import { useActiveRunId, useIsStopping } from "./use-run-once-progress";
import { useRunOnceSelection } from "./use-run-once-selection";

export { prefetchRunOptions };

interface RunOnceMenuProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * “跑一次”：选范围（CLI · 模型 × 强度）与题目，发起一轮单次批任务。
 * 前端缓存（localStorage）记住用户的最后一次选择；
 * 首次进入/无缓存时默认模型全选，题目仅勾选“动态鹈鹕车”。
 */
export function RunOnceMenu({ open, onToggle, onClose }: RunOnceMenuProps) {
  const selection = useRunOnceSelection();
  const launcher = useRunOnceLauncher(selection.targets, selection.prompts, selection.candidateOverridesRef);
  const onResolved = useCallback((next: RunOptionsView) => selection.applyResolved(next), [selection]);
  const { options } = useRunOnceOptions(open, onResolved, launcher.setNotice);
  const [mobileTab, setMobileTab] = useState<"models" | "prompts">("models");

  const activeRunId = useActiveRunId(options, launcher.startedRunId);
  const ownRunActive = activeRunId !== null && activeRunId === launcher.startedRunId;
  const stopping = useIsStopping(activeRunId);
  const calls = selection.targets.size * selection.prompts.size;

  return (
    <Menu label={<span className="run-once-label">▶ 跑一次</span>} align="right" panelClassName="run-once-panel" open={open} onToggle={onToggle} onClose={onClose}>
      {options === null && launcher.notice === null && <p className="run-empty">正在读取可选范围…</p>}
      {options !== null && (
        <>
          <RunOnceHeadBar
            mobileTab={mobileTab}
            onSelectTab={setMobileTab}
            targetCount={selection.targets.size}
            allTargetIds={options.targets.map((t) => t.id)}
            onPickTargets={selection.updateTargets}
            promptCount={selection.prompts.size}
            allPromptIds={options.prompts.map((p) => p.id)}
            onPickPrompts={selection.updatePrompts}
            onClose={onClose}
          />
          <div className="run-once-body">
            <section className={`run-once-col run-once-col-models ${mobileTab === "models" ? "tab-visible" : ""}`}>
              <ModelRows targets={options.targets} picked={selection.targets} onPick={selection.updateTargets} />
              <UnavailableNote unavailable={options.unavailable} />
            </section>
            <section className={`run-once-col run-once-col-prompts ${mobileTab === "prompts" ? "tab-visible" : ""}`}>
              <RunOncePrompts
                prompts={options.prompts}
                picked={selection.prompts}
                candidateOverrides={selection.candidateOverrides}
                onPick={selection.updatePrompts}
                onOverrideCandidate={selection.updateCandidateOverride}
              />
            </section>
          </div>
        </>
      )}
      <RunOnceFooter
        options={options}
        targetIds={[...selection.targets]}
        promptCount={selection.prompts.size}
        notice={launcher.notice}
        activeRunId={activeRunId}
        ownRunActive={ownRunActive}
        stopping={stopping}
        busy={launcher.busy}
        calls={calls}
        onStart={() => void launcher.start()}
      />
    </Menu>
  );
}
