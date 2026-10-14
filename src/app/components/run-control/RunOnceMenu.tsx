"use client";

import { useCallback, useState } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { PROFILE_CLIS } from "@/core/config/profiles";
import { useI18n, type Locale } from "@/i18n";
import { Menu } from "../menu/Menu";
import { prefetchRunOptions } from "./run-once-api";
import { describeRound } from "./run-once-profiles";
import { RunOnceFooter } from "./RunOnceFooter";
import { RunOnceHeadBar } from "./RunOnceHeadBar";
import { ModelRows } from "./RunOnceModelRows";
import { RunOncePrompts } from "./RunOncePrompts";
import { RunOnceProfileModal } from "./RunOnceProfileModal";
import { UnavailableNote } from "./UnavailableNote";
import { useRunOnceLauncher } from "./use-run-once-launcher";
import { useRunOnceOptions } from "./use-run-once-options";
import { useRunOnceProfiles } from "./use-run-once-profiles";
import { useActiveRunId, useIsStopping } from "./use-run-once-progress";
import { useRunOnceSelection } from "./use-run-once-selection";

export { prefetchRunOptions };

interface RunOnceMenuProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/** 范围里不支持上游、只跑登录态的组合 */
function loginOnlyNote(options: RunOptionsView, picked: ReadonlySet<string>, locale: Locale): string | null {
  const names = options.targets
    .filter((target) => picked.has(target.id) && !(PROFILE_CLIS as readonly string[]).includes(target.cli))
    .map((target) => `${target.cli} ${target.model}`);
  if (names.length === 0) return null;
  const uniq = [...new Set(names)];
  return locale === "en" ? `${uniq.join(", ")} run on official login only` : `${uniq.join("、")} 只跑登录态`;
}

/**
 * “跑一次”：选范围（CLI · 模型 × 强度）与题目，发起一轮单次批任务。
 */
export function RunOnceMenu({ open, onToggle, onClose }: RunOnceMenuProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const selection = useRunOnceSelection();
  const launcher = useRunOnceLauncher(selection.targets, selection.prompts, selection.candidateOverridesRef, locale);
  const { applyResolved } = selection;
  const onResolved = useCallback((next: RunOptionsView) => applyResolved(next), [applyResolved]);
  const { options } = useRunOnceOptions(open, onResolved, launcher.setNotice, locale);
  const [mobileTab, setMobileTab] = useState<"models" | "prompts">("models");
  const activeRunId = useActiveRunId(options, launcher.startedRunId);
  const ownRunActive = activeRunId !== null && activeRunId === launcher.startedRunId;
  const stopping = useIsStopping(activeRunId);
  const profiles = useRunOnceProfiles({
    options,
    targets: selection.targets,
    promptCount: selection.prompts.size,
    storedProfiles: selection.profiles,
    start: launcher.start,
    onClosePanel: onClose,
    locale,
  });

  return (
    <Menu
      label={<span className="run-once-label">{isEn ? "▶ Run Once" : "▶ 跑一次"}</span>}
      align="right"
      panelClassName="run-once-panel"
      open={open}
      onToggle={onToggle}
      onClose={profiles.closePanel}
    >
      {options === null && launcher.notice === null && (
        <p className="run-empty">{isEn ? "Loading available targets…" : "正在读取可选范围…"}</p>
      )}
      {options !== null && (
        <RunOnceOptionsBody
          options={options}
          mobileTab={mobileTab}
          onSelectTab={setMobileTab}
          selection={selection}
          onClose={onClose}
        />
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
        mode={profiles.mode}
        onStart={profiles.onStart}
      />
      {profiles.choosing && options !== null && (
        <RunOnceProfileModal
          round={describeRound(options, selection.targets, selection.prompts, locale)}
          choices={profiles.choices}
          picked={profiles.pickedProfiles}
          calls={profiles.chosenCalls}
          loginOnlyNote={loginOnlyNote(options, selection.targets, locale)}
          busy={launcher.busy}
          onPick={selection.updateProfiles}
          onStart={profiles.startChosen}
          onCancel={profiles.closeModal}
        />
      )}
    </Menu>
  );
}

function RunOnceOptionsBody({
  options,
  mobileTab,
  onSelectTab,
  selection,
  onClose,
}: {
  options: RunOptionsView;
  mobileTab: "models" | "prompts";
  onSelectTab: (tab: "models" | "prompts") => void;
  selection: ReturnType<typeof useRunOnceSelection>;
  onClose: () => void;
}) {
  return (
    <>
      <RunOnceHeadBar
        mobileTab={mobileTab}
        onSelectTab={onSelectTab}
        pickedTargets={selection.targets}
        allTargetIds={options.targets.map((t) => t.id)}
        onPickTargets={selection.updateTargets}
        pickedPrompts={selection.prompts}
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
  );
}
