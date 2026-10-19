"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu } from "@/app/components/menu/Menu";
import { ConfirmButton } from "@/app/components/ui/Button";
import { RunOnceHeadBar } from "@/app/components/run-control/RunOnceHeadBar";
import { ModelRows } from "@/app/components/run-control/RunOnceModelRows";
import { RunOnceProfileModal } from "@/app/components/run-control/RunOnceProfileModal";
import { RunOncePrompts } from "@/app/components/run-control/RunOncePrompts";
import type { StartMode } from "@/app/components/run-control/run-once-profiles";
import type { ModelFingerprintConfig } from "@/core/config";
import type { FingerprintJobView } from "@/core/model-fingerprint/job";
import type { ModelStatusEntry, VerificationCheckPlan } from "@/core/model-fingerprint/plan";
import type { SelfTestReport } from "@/core/model-fingerprint/self-test";
import type { CliKind } from "@/core/types";
import { formatText, useI18n, type Locale } from "@/i18n";
import {
  buildCheckBatchDrafts, buildCheckProbeOptions, buildCheckTargetsView, checkStartLabel,
  computeCheckSelectionState, readStoredCheckProfiles, readStoredCheckSelection, reconcileCheckTargets,
  resolveCheckProbes, writeStoredCheckProfiles, writeStoredCheckSelection,
  type CheckForecastSummary, type CheckTargetDraft, type UnreadyCheckModel,
} from "./fingerprint-check-model";
import { formatPercent, type FingerprintProfileSummary } from "./fingerprint-model";

export type { CheckTargetDraft as CheckFormDraft };
export { checkStartLabel };

export interface FingerprintCheckPanelProps {
  config: ModelFingerprintConfig;
  matrix: readonly ModelStatusEntry[];
  selfTest?: SelfTestReport | null;
  selfTestByCli?: Partial<Record<CliKind, SelfTestReport>>;
  profiles: readonly FingerprintProfileSummary[];
  activeJob?: FingerprintJobView | null;
  busy: boolean;
  pendingPlan: VerificationCheckPlan | null;
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onSwitchToMatrix?: () => void;
  onStartCheck: (drafts: readonly CheckTargetDraft[]) => void;
  onCancelJob?: () => void;
}

function UnreadyBaselineNote(props: {
  unready: readonly UnreadyCheckModel[];
  locale: Locale;
  onSwitchToMatrix?: () => void;
}) {
  if (props.unready.length === 0) return null;
  const isEn = props.locale === "en";
  const names = props.unready.map((m) => `${m.cli} ${m.model}`).join(isEn ? ", " : "、");
  if (!props.onSwitchToMatrix) {
    return (
      <p className="run-once-unavailable">
        {isEn ? `${names}: baseline samples not collected yet (fill in matrix first)` : `${names} 尚未采集基准样本（先在「基准样本矩阵」补齐后可核验）`}
      </p>
    );
  }
  return (
    <p className="run-once-unavailable">
      {isEn ? `${names}: baseline samples not collected yet (` : `${names} 尚未采集基准样本（先在`}
      <button type="button" className="matrix-empty-link" onClick={props.onSwitchToMatrix}>
        {isEn ? "fill in Baseline Matrix" : "「基准样本矩阵」"}
      </button>
      {isEn ? " first)" : "补齐后可核验）"}
    </p>
  );
}

function CheckLauncherFooter(props: {
  forecast: CheckForecastSummary;
  pendingPlan: VerificationCheckPlan | null;
  mode: StartMode;
  busy: boolean;
  activeJob: FingerprintJobView | null;
  nothingToRun: boolean;
  notice?: string | null;
  locale: Locale;
  onStart: () => void;
  onCancelJob?: () => void;
}) {
  const { forecast, pendingPlan, mode, busy, activeJob, nothingToRun, notice, locale, onStart, onCancelJob } = props;
  const fp = useI18n().t.fingerprint;
  return (
    <footer className="run-once-foot">
      <p className="run-once-forecast">
        <span>{formatText(fp.check.planEstimatedCalls, { calls: forecast.totalEstimatedCalls })}</span>
        {(pendingPlan?.totalEstimatedCostUsd ?? forecast.estimatedCostUsd) != null && (
          <span>{formatText(fp.check.planEstimatedUsd, { usd: (pendingPlan?.totalEstimatedCostUsd ?? forecast.estimatedCostUsd)!.toFixed(4) })}</span>
        )}
        {forecast.expectedConsistency !== null && (
          <span>{formatText(fp.check.planExpectedConsistency, { rate: formatPercent(forecast.expectedConsistency) })}</span>
        )}
      </p>
      {notice && <p className="run-once-notice error">{notice}</p>}
      {activeJob !== null && onCancelJob && (
        <ConfirmButton variant="danger" size="sm" className="run-stop" confirmLabel={locale === "en" ? "Confirm Cancel" : "确认取消"} onConfirm={onCancelJob}>{fp.matrix.cancelJobBtn}</ConfirmButton>
      )}
      <button type="button" className="run-once-start" disabled={busy || nothingToRun || activeJob !== null} onClick={onStart}>
        {checkStartLabel(mode, busy, activeJob !== null, locale)}
      </button>
    </footer>
  );
}

function useCheckSelectorState(props: FingerprintCheckPanelProps) {
  const { config, matrix, selfTest, selfTestByCli, profiles } = props;
  const { locale, t } = useI18n();
  const fp = t.fingerprint;
  const targetsView = useMemo(
    () => buildCheckTargetsView({ config, matrix, profiles, selfTest, selfTestByCli }),
    [config, matrix, profiles, selfTest, selfTestByCli],
  );
  const probeView = useMemo(() => buildCheckProbeOptions(config, fp), [config, fp]);
  const initializedRef = useRef(false);
  const [pickedTargets, setPickedTargetsState] = useState<ReadonlySet<string>>(() =>
    reconcileCheckTargets(targetsView.targets, new Set(), false),
  );
  const [pickedProbes, setPickedProbesState] = useState<ReadonlySet<string>>(() =>
    new Set(probeView.defaultIds),
  );
  const [storedProfiles, setStoredProfilesState] = useState<readonly string[] | null>(null);
  const [choosingProfile, setChoosingProfile] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const setPickedTargets = (next: ReadonlySet<string>) => {
    setPickedTargetsState(next);
    writeStoredCheckSelection(next, pickedProbes);
  };
  const setPickedProbes = (next: ReadonlySet<string>) => {
    setPickedProbesState(next);
    writeStoredCheckSelection(pickedTargets, next);
  };
  const setStoredProfiles = (next: readonly string[] | null) => {
    setStoredProfilesState(next);
    if (next !== null) writeStoredCheckProfiles(next);
  };

  useEffect(() => {
    const storedSelection = readStoredCheckSelection();
    if (!initializedRef.current) {
      if (storedSelection?.probes) {
        setPickedProbesState(resolveCheckProbes(probeView.allIds, probeView.defaultIds, storedSelection.probes));
      }
      const savedProfiles = readStoredCheckProfiles();
      if (savedProfiles !== null) setStoredProfilesState(savedProfiles);
    }
    setPickedTargetsState((prev) => {
      const storedTargets = initializedRef.current ? undefined : storedSelection?.targets;
      const next = reconcileCheckTargets(targetsView.targets, prev, initializedRef.current, storedTargets);
      if (targetsView.targets.length > 0) initializedRef.current = true;
      return next;
    });
  }, [targetsView.targets, probeView.allIds, probeView.defaultIds]);

  const selectionState = useMemo(
    () =>
      computeCheckSelectionState({
        config, targets: targetsView.targets, probeOptions: probeView.items,
        profiles, pickedTargets, pickedProbes, storedProfiles, locale,
      }),
    [config, targetsView.targets, probeView.items, profiles, pickedTargets, pickedProbes, storedProfiles, locale],
  );

  return {
    locale, t, fp, targetsView, probeView, pickedTargets, setPickedTargets,
    pickedProbes, setPickedProbes, setStoredProfiles, choosingProfile,
    setChoosingProfile, notice, setNotice, selectionState,
  };
}

export function FingerprintCheckPanel(props: FingerprintCheckPanelProps) {
  const { activeJob = null, busy, pendingPlan, open = false, onToggle = () => {}, onClose = () => {}, onSwitchToMatrix, onStartCheck, onCancelJob } = props;
  const st = useCheckSelectorState(props);
  const isEn = st.locale === "en";
  const nothingToRun =
    st.selectionState.mode.kind === "none" ||
    (st.selectionState.mode.kind === "direct" && st.selectionState.mode.calls === 0);

  const handleClose = () => {
    st.setChoosingProfile(false);
    st.setNotice(null);
    onClose();
  };

  const handleMenuClose = () => {
    if (!st.choosingProfile) {
      st.setNotice(null);
      onClose();
    }
  };

  const launchWithProfiles = (profiles?: readonly string[]) => {
    const drafts = buildCheckBatchDrafts({
      targets: st.targetsView.targets, pickedTargets: st.pickedTargets,
      pickedProbes: st.pickedProbes, profiles, availableProfiles: props.profiles,
    });
    if (drafts.length === 0) {
      st.setNotice(isEn ? "Selected models have no baseline samples yet; collect them in the matrix first." : "所选模型尚未采集基准样本，请先在「基准样本矩阵」补齐后再发起核验。");
      return;
    }
    st.setNotice(null);
    onStartCheck(drafts);
  };

  const handleStart = () => {
    if (st.selectionState.mode.kind === "choose") st.setChoosingProfile(true);
    else if (st.selectionState.mode.kind === "direct") launchWithProfiles(st.selectionState.mode.profiles);
  };

  return (
    <Menu
      label={<span className="run-once-label">{isEn ? "▶ Run Once" : "▶ 跑一次"}</span>}
      align="right"
      panelClassName="run-once-panel"
      open={open}
      onToggle={onToggle}
      onClose={handleMenuClose}
      afterPanel={
        st.choosingProfile && st.selectionState.choices.length > 0 ? (
          <RunOnceProfileModal
            round={st.selectionState.roundDescription}
            choices={st.selectionState.choices}
            picked={st.selectionState.pickedProfiles}
            calls={st.selectionState.chosenCalls}
            loginOnlyNote={st.selectionState.loginOnlyNote}
            busy={busy}
            onPick={(next) => st.setStoredProfiles([...next])}
            onStart={() => {
              st.setChoosingProfile(false);
              launchWithProfiles([...st.selectionState.pickedProfiles]);
            }}
            onCancel={() => st.setChoosingProfile(false)}
          />
        ) : null
      }
    >
      <CheckLauncherBody
        st={st} pendingPlan={pendingPlan} busy={busy} activeJob={activeJob} nothingToRun={nothingToRun}
        onClose={handleClose}
        onSwitchToMatrix={onSwitchToMatrix ? () => { handleClose(); onSwitchToMatrix(); } : undefined}
        onStart={handleStart} onCancelJob={onCancelJob}
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
  onSwitchToMatrix?: () => void;
  onStart: () => void;
  onCancelJob?: () => void;
}) {
  const { st, pendingPlan, busy, activeJob, nothingToRun, onClose, onSwitchToMatrix, onStart, onCancelJob } = props;
  const [mobileTab, setMobileTab] = useState<"models" | "prompts">("models");
  const allTargetIds = useMemo(() => st.targetsView.targets.map((item) => item.id), [st.targetsView.targets]);

  return (
    <>
      <RunOnceHeadBar
        mobileTab={mobileTab}
        onSelectTab={setMobileTab}
        pickedTargets={st.pickedTargets}
        allTargetIds={allTargetIds}
        onPickTargets={(next) => { st.setNotice(null); st.setPickedTargets(next); }}
        pickedPrompts={st.pickedProbes}
        allPromptIds={st.probeView.allIds}
        onPickPrompts={st.setPickedProbes}
        secondColumnTitle={st.fp.check.probesLabel}
        onClose={onClose}
      />
      <div className="run-once-body">
        <section className={`run-once-col run-once-col-models ${mobileTab === "models" ? "tab-visible" : ""}`}>
          <ModelRows targets={st.targetsView.targets} picked={st.pickedTargets} onPick={(next) => { st.setNotice(null); st.setPickedTargets(next); }} />
          <UnreadyBaselineNote unready={st.targetsView.unreadyModels} locale={st.locale} onSwitchToMatrix={onSwitchToMatrix} />
        </section>
        <section className={`run-once-col run-once-col-prompts ${mobileTab === "prompts" ? "tab-visible" : ""}`}>
          <RunOncePrompts prompts={st.probeView.items} groups={st.probeView.groups} picked={st.pickedProbes} onPick={st.setPickedProbes} />
        </section>
      </div>
      <CheckLauncherFooter
        forecast={st.selectionState.forecast} pendingPlan={pendingPlan} mode={st.selectionState.mode}
        busy={busy} activeJob={activeJob} nothingToRun={nothingToRun} notice={st.notice} locale={st.locale}
        onStart={onStart} onCancelJob={onCancelJob}
      />
    </>
  );
}
