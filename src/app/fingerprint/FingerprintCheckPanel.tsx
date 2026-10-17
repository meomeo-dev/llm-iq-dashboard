"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu } from "@/app/components/menu/Menu";
import { PickerHead } from "@/app/components/run-control/RunOnceHeadBar";
import { ModelRows } from "@/app/components/run-control/RunOnceModelRows";
import { RunOnceProfileModal } from "@/app/components/run-control/RunOnceProfileModal";
import { RunOncePrompts } from "@/app/components/run-control/RunOncePrompts";
import type { ModelFingerprintConfig } from "@/core/config";
import type { FingerprintJobView } from "@/core/model-fingerprint/job";
import type { ModelStatusEntry, VerificationCheckPlan } from "@/core/model-fingerprint/plan";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import type { FingerprintCheckRecord } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { useI18n } from "@/i18n";
import { CheckLauncherFooter, UnreadyBaselineNote } from "./FingerprintCheckSections";
import {
  buildCheckBatchDrafts,
  buildCheckProbeOptions,
  buildCheckTargetsView,
  computeCheckSelectionState,
  reconcileCheckTargets,
  type CheckTargetDraft,
} from "./fingerprint-check-model";
import type { FingerprintProfileSummary } from "./fingerprint-model";

export type { CheckTargetDraft as CheckFormDraft };

export interface FingerprintCheckPanelProps {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  selfTest?: SelfTestReport | null;
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>;
  profiles: readonly FingerprintProfileSummary[];
  checks?: readonly FingerprintCheckRecord[];
  activeJob?: FingerprintJobView | null;
  busy: boolean;
  rescoringId?: string | null;
  pendingPlan: VerificationCheckPlan | null;
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onPreviewPlan: (drafts: readonly CheckTargetDraft[]) => void;
  onStartCheck: (drafts: readonly CheckTargetDraft[]) => void;
  onCancelJob?: () => void;
  onRescore?: (checkId: string) => void;
}

function useCheckSelectorState(props: FingerprintCheckPanelProps) {
  const { config, matrix, selfTest, selfTestByCli, profiles } = props;
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const targetsView = useMemo(
    () => buildCheckTargetsView({ config, matrix, selfTest, selfTestByCli }),
    [config, matrix, selfTest, selfTestByCli],
  );
  const probeView = useMemo(() => buildCheckProbeOptions(config, fp), [config, fp]);
  const initializedRef = useRef(false);
  const [pickedTargets, setPickedTargets] = useState<ReadonlySet<string>>(() =>
    reconcileCheckTargets(targetsView.targets, new Set(), false),
  );
  const [pickedProbes, setPickedProbes] = useState<ReadonlySet<string>>(
    () => new Set(probeView.defaultIds),
  );
  const [storedProfiles, setStoredProfiles] = useState<readonly string[] | null>(null);
  const [choosingProfile, setChoosingProfile] = useState(false);

  useEffect(() => {
    setPickedTargets((prev) => {
      const next = reconcileCheckTargets(targetsView.targets, prev, initializedRef.current);
      if (targetsView.targets.length > 0) initializedRef.current = true;
      return next;
    });
  }, [targetsView.targets]);

  const selectionState = useMemo(
    () =>
      computeCheckSelectionState({
        config,
        targets: targetsView.targets,
        probeOptions: probeView.items,
        profiles,
        pickedTargets,
        pickedProbes,
        storedProfiles,
        locale,
      }),
    [config, targetsView.targets, probeView.items, profiles, pickedTargets, pickedProbes, storedProfiles, locale],
  );

  return {
    locale,
    t,
    fp,
    targetsView,
    probeView,
    pickedTargets,
    setPickedTargets,
    pickedProbes,
    setPickedProbes,
    setStoredProfiles,
    choosingProfile,
    setChoosingProfile,
    selectionState,
  };
}

export function FingerprintCheckPanel(props: FingerprintCheckPanelProps) {
  const { activeJob = null, busy, pendingPlan, open = true, onToggle = () => {}, onClose = () => {}, onPreviewPlan, onStartCheck, onCancelJob } = props;
  const st = useCheckSelectorState(props);
  const isEn = st.locale === "en";
  const nothingToRun =
    st.selectionState.mode.kind === "none" ||
    (st.selectionState.mode.kind === "direct" && st.selectionState.mode.calls === 0);

  const handleClose = () => {
    st.setChoosingProfile(false);
    onClose();
  };

  const makeDrafts = (profiles?: readonly string[]) =>
    buildCheckBatchDrafts({
      targets: st.targetsView.targets,
      pickedTargets: st.pickedTargets,
      pickedProbes: st.pickedProbes,
      profiles,
    });

  const handleStart = () => {
    if (st.selectionState.mode.kind === "choose") {
      st.setChoosingProfile(true);
      return;
    }
    if (st.selectionState.mode.kind === "direct") {
      const drafts = makeDrafts(st.selectionState.mode.profiles);
      if (drafts.length > 0) {
        onStartCheck(drafts);
        handleClose();
      }
    }
  };

  const handlePreview = () => {
    const profiles =
      st.selectionState.mode.kind === "choose"
        ? [...st.selectionState.pickedProfiles]
        : st.selectionState.mode.kind === "direct"
          ? st.selectionState.mode.profiles
          : undefined;
    const drafts = makeDrafts(profiles);
    if (drafts.length > 0) onPreviewPlan(drafts);
  };

  return (
    <Menu
      label={<span className="run-once-label">{isEn ? "▶ Run Once" : "▶ 跑一次"}</span>}
      align="right"
      panelClassName="run-once-panel"
      open={open}
      onToggle={onToggle}
      onClose={handleClose}
    >
      <CheckLauncherBody
        st={st}
        pendingPlan={pendingPlan}
        busy={busy}
        activeJob={activeJob}
        nothingToRun={nothingToRun}
        onClose={handleClose}
        onPreview={handlePreview}
        onStart={handleStart}
        onCancelJob={onCancelJob}
        onStartChosen={(drafts) => {
          onStartCheck(drafts);
          handleClose();
        }}
      />
    </Menu>
  );
}

function CheckLauncherBody(props: {
  st: ReturnType<typeof useCheckSelectorState>;
  pendingPlan: VerificationCheckPlan | null;
  busy: boolean;
  activeJob: FingerprintJobView | null;
  nothingToRun: boolean;
  onClose: () => void;
  onPreview: () => void;
  onStart: () => void;
  onCancelJob?: () => void;
  onStartChosen: (drafts: readonly CheckTargetDraft[]) => void;
}) {
  const { st, pendingPlan, busy, activeJob, nothingToRun, onClose, onPreview, onStart, onCancelJob, onStartChosen } = props;
  const isEn = st.locale === "en";
  const [mobileTab, setMobileTab] = useState<"models" | "prompts">("models");
  const allTargetIds = useMemo(() => st.targetsView.targets.map((item) => item.id), [st.targetsView.targets]);
  const closeText = st.t.common.actions.close;

  return (
    <>
      <div className="run-once-head-bar">
        <div className={`run-once-head-cell ${mobileTab === "models" ? "tab-active" : ""}`} onClick={() => setMobileTab("models")}>
          <PickerHead title={isEn ? "Targets" : "范围"} picked={st.pickedTargets} all={allTargetIds} onPick={st.setPickedTargets} />
        </div>
        <div className={`run-once-head-cell ${mobileTab === "prompts" ? "tab-active" : ""}`} onClick={() => setMobileTab("prompts")}>
          <PickerHead title={st.fp.check.probesLabel} picked={st.pickedProbes} all={st.probeView.allIds} onPick={st.setPickedProbes} />
        </div>
        <button type="button" className="run-once-close" onClick={onClose} title={closeText} aria-label={closeText}>
          ✕
        </button>
      </div>
      <div className="run-once-body">
        <section className={`run-once-col run-once-col-models ${mobileTab === "models" ? "tab-visible" : ""}`}>
          <ModelRows targets={st.targetsView.targets} picked={st.pickedTargets} onPick={st.setPickedTargets} />
          <UnreadyBaselineNote unready={st.targetsView.unreadyModels} locale={st.locale} />
        </section>
        <section className={`run-once-col run-once-col-prompts ${mobileTab === "prompts" ? "tab-visible" : ""}`}>
          <RunOncePrompts prompts={st.probeView.items} groups={st.probeView.groups} picked={st.pickedProbes} onPick={st.setPickedProbes} />
        </section>
      </div>
      <CheckLauncherFooter
        forecast={st.selectionState.forecast} pendingPlan={pendingPlan} mode={st.selectionState.mode}
        busy={busy} activeJob={activeJob} nothingToRun={nothingToRun} locale={st.locale}
        onPreview={onPreview} onStart={onStart} onCancelJob={onCancelJob}
      />
      {st.choosingProfile && st.selectionState.choices.length > 0 && (
        <RunOnceProfileModal
          round={st.selectionState.roundDescription} choices={st.selectionState.choices}
          picked={st.selectionState.pickedProfiles} calls={st.selectionState.chosenCalls}
          loginOnlyNote={st.selectionState.loginOnlyNote} busy={busy}
          onPick={(next) => st.setStoredProfiles([...next])}
          onStart={() => {
            const drafts = buildCheckBatchDrafts({
              targets: st.targetsView.targets, pickedTargets: st.pickedTargets,
              pickedProbes: st.pickedProbes, profiles: [...st.selectionState.pickedProfiles],
            });
            st.setChoosingProfile(false);
            if (drafts.length > 0) onStartChosen(drafts);
          }}
          onCancel={() => st.setChoosingProfile(false)}
        />
      )}
    </>
  );
}
