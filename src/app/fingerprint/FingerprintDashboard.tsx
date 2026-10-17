"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLiveFingerprintJob } from "@/app/components/live-state/live-store";
import { ProfilesProvider } from "@/app/components/profile/profiles-context";
import { RunStatus } from "@/app/components/run-status/RunStatus";
import { useStoredTimeZone } from "@/app/components/timeline/use-stored-time-zone";
import type {
  FillPlan,
  ProbeGapSummary,
  VerificationCheckPlan,
} from "@/core/model-fingerprint/plan";
import type { DecodedAttemptSummary, ProbeId } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { LanguageSwitch, useI18n } from "@/i18n";
import { FingerprintCheckPanel, type CheckFormDraft } from "./FingerprintCheckPanel";
import { FingerprintMatrix } from "./FingerprintMatrix";
import { FingerprintSampleDrawer } from "./FingerprintSampleDrawer";
import {
  buildCheckRequestBody,
  buildFillRequestBody,
  buildSampleMutationBody,
  fetchFingerprintSnapshot,
  patchSampleJson,
  postFingerprintJson,
  toProfileViews,
  type FingerprintApiSnapshot,
  type ProbeCellDetailResponse,
  type SelectedProbeCell,
} from "./fingerprint-model";
import "./fingerprint.css";

export interface FingerprintDashboardProps {
  initialSnapshot: FingerprintApiSnapshot;
}

interface DrawerState {
  cell: SelectedProbeCell;
  attempts: DecodedAttemptSummary[];
  gap: ProbeGapSummary | null;
}

interface FillTargetState {
  cli?: CliKind;
  model?: string;
  probes?: ProbeId[];
  plan: FillPlan;
}

function useFingerprintController(initialSnapshot: FingerprintApiSnapshot) {
  const [snapshot, setSnapshot] = useState<FingerprintApiSnapshot>(initialSnapshot);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fillTarget, setFillTarget] = useState<FillTargetState | null>(null);
  const [checkPlan, setCheckPlan] = useState<VerificationCheckPlan | null>(null);
  const [rescoringId, setRescoringId] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null);
  const [statusOpen, setStatusOpen] = useState<boolean>(initialSnapshot.activeJob !== null);
  const liveJob = useLiveFingerprintJob();

  const refreshAll = useCallback(async () => {
    try {
      setSnapshot(await fetchFingerprintSnapshot());
    } catch {
      /* ignore background refresh errors */
    }
  }, []);

  const loadDrawerCell = useCallback(async (cell: SelectedProbeCell) => {
    const qs = new URLSearchParams({ cli: cell.cli, model: cell.model, probe: cell.probe });
    const res = await fetch(`/api/fingerprint?${qs.toString()}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as ProbeCellDetailResponse;
    setDrawerState({ cell, attempts: data.attempts, gap: data.gap });
  }, []);

  const activeJobId = liveJob?.jobId ?? null;
  const completedCalls = liveJob?.completedCalls ?? 0;
  useEffect(() => {
    if (activeJobId !== null) setStatusOpen(true);
    void refreshAll();
  }, [activeJobId, completedCalls, refreshAll]);

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      await fn();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return {
    snapshot,
    liveJob: liveJob ?? snapshot.activeJob,
    busy,
    errorMsg,
    fillTarget,
    setFillTarget,
    checkPlan,
    setCheckPlan,
    rescoringId,
    setRescoringId,
    drawerState,
    setDrawerState,
    statusOpen,
    setStatusOpen,
    refreshAll,
    loadDrawerCell,
    runAction,
  };
}

function useDashboardHandlers(ctrl: ReturnType<typeof useFingerprintController>) {
  const requestFillPlan = (opts: { cli?: CliKind; model?: string; probes?: ProbeId[] }) =>
    ctrl.runAction(async () => {
      const data = await postFingerprintJson<{ fillPlan: FillPlan }>(
        buildFillRequestBody({ action: "plan", ...opts }),
      );
      ctrl.setFillTarget({ ...opts, plan: data.fillPlan });
    });

  const confirmFill = () =>
    ctrl.runAction(async () => {
      if (!ctrl.fillTarget) return;
      ctrl.setStatusOpen(true);
      await postFingerprintJson(buildFillRequestBody({ action: "fill", ...ctrl.fillTarget }));
      ctrl.setFillTarget(null);
      await ctrl.refreshAll();
    });

  const handleCheck = (action: "plan" | "check", drafts: readonly CheckFormDraft[]) =>
    ctrl.runAction(async () => {
      const first = drafts[0];
      if (!first) return;
      const body = buildCheckRequestBody({ action, ...first, targets: drafts });
      if (action === "plan") {
        const data = await postFingerprintJson<{ checkPlan: VerificationCheckPlan }>(body);
        ctrl.setCheckPlan(data.checkPlan);
      } else {
        ctrl.setCheckPlan(null);
        ctrl.setStatusOpen(true);
        await postFingerprintJson(body);
        await ctrl.refreshAll();
      }
    });

  const cancelJob = () =>
    ctrl.runAction(async () => {
      if (!ctrl.liveJob) return;
      await postFingerprintJson(JSON.stringify({ action: "cancel", jobId: ctrl.liveJob.jobId }));
      await ctrl.refreshAll();
    });

  const mutateSample = (action: "exclude" | "include" | "reset", reqId?: string) =>
    ctrl.runAction(async () => {
      if (!ctrl.drawerState) return;
      await patchSampleJson(buildSampleMutationBody({ action, ...ctrl.drawerState.cell, reqId }));
      await Promise.all([ctrl.loadDrawerCell(ctrl.drawerState.cell), ctrl.refreshAll()]);
    });

  const rescoreCheck = (checkId: string) =>
    ctrl.runAction(async () => {
      ctrl.setRescoringId(checkId);
      try {
        await postFingerprintJson(JSON.stringify({ action: "rescore", checkId }));
        await ctrl.refreshAll();
      } finally {
        ctrl.setRescoringId(null);
      }
    });

  return { requestFillPlan, confirmFill, handleCheck, cancelJob, mutateSample, rescoreCheck };
}

export function FingerprintDashboard({ initialSnapshot }: FingerprintDashboardProps) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  const [tab, setTab] = useState<"matrix" | "check">("matrix");
  const [storedTz] = useStoredTimeZone();
  const timeZone = storedTz ?? "Asia/Shanghai";
  const ctrl = useFingerprintController(initialSnapshot);
  const actions = useDashboardHandlers(ctrl);
  const isJobRunning = ctrl.liveJob !== null || ctrl.busy;
  const profileValue = useMemo(() => ({ profiles: toProfileViews(ctrl.snapshot.profiles), owner: true }), [ctrl.snapshot.profiles]);
  const snap = ctrl.snapshot;

  return (
    <ProfilesProvider value={profileValue}>
      <main className="fp-page">
        <FingerprintHeader
          timeZone={timeZone}
          statusOpen={ctrl.statusOpen}
          onToggleStatus={() => ctrl.setStatusOpen((o) => !o)}
          onCloseStatus={() => ctrl.setStatusOpen(false)}
          errorMsg={ctrl.errorMsg}
        />
        <div className="fp-tabs">
          <button type="button" className={`fp-tab ${tab === "matrix" ? "active" : ""}`} onClick={() => setTab("matrix")}>
            {fp.tabs.matrix}
          </button>
          <button type="button" className={`fp-tab ${tab === "check" ? "active" : ""}`} onClick={() => setTab("check")}>
            {fp.tabs.check} ({snap.checks.length})
          </button>
        </div>
        {tab === "matrix" ? (
          <FingerprintMatrix
            config={snap.modelFingerprint} matrix={snap.matrix} fillPlan={snap.fillPlan} selfTest={snap.selfTest}
            busy={isJobRunning} pendingPlan={ctrl.fillTarget?.plan ?? null}
            onSelectCell={(cell) => void ctrl.loadDrawerCell(cell)}
            onRequestFillPlan={(opts) => void actions.requestFillPlan(opts)}
            onConfirmFill={() => void actions.confirmFill()}
            onCancelPlan={() => ctrl.setFillTarget(null)}
          />
        ) : (
          <FingerprintCheckPanel
            config={snap.modelFingerprint} matrix={snap.matrix} selfTest={snap.selfTest} selfTestByCli={snap.selfTestByCli}
            profiles={snap.profiles} checks={snap.checks} activeJob={ctrl.liveJob} busy={isJobRunning}
            rescoringId={ctrl.rescoringId} pendingPlan={ctrl.checkPlan}
            onPreviewPlan={(drafts) => void actions.handleCheck("plan", drafts)}
            onStartCheck={(drafts) => void actions.handleCheck("check", drafts)}
            onCancelJob={() => void actions.cancelJob()}
            onRescore={(checkId) => void actions.rescoreCheck(checkId)}
          />
        )}
        {ctrl.drawerState && (
          <FingerprintSampleDrawer
            cell={ctrl.drawerState.cell} attempts={ctrl.drawerState.attempts} gap={ctrl.drawerState.gap}
            targetSamples={snap.modelFingerprint.samplesPerProbe} busy={isJobRunning}
            onClose={() => ctrl.setDrawerState(null)}
            onFillProbe={() => {
              const cell = ctrl.drawerState!.cell;
              ctrl.setDrawerState(null);
              void actions.requestFillPlan({ cli: cell.cli, model: cell.model, probes: [cell.probe] });
            }}
            onToggleExclude={(reqId, ex) => void actions.mutateSample(ex ? "include" : "exclude", reqId)}
            onResetProbe={() => void actions.mutateSample("reset")}
          />
        )}
      </main>
    </ProfilesProvider>
  );
}

function FingerprintHeader(props: {
  timeZone: string;
  statusOpen: boolean;
  onToggleStatus: () => void;
  onCloseStatus: () => void;
  errorMsg: string | null;
}) {
  const { t } = useI18n();
  const fp = t.fingerprint;
  return (
    <>
      <header className="fp-header">
        <div className="fp-header-titles">
          <h1>{fp.pageTitle}</h1>
          <p>{fp.pageSubtitle}</p>
        </div>
        <div className="fp-header-actions">
          <RunStatus
            timeZone={props.timeZone}
            owner={true}
            open={props.statusOpen}
            onToggle={props.onToggleStatus}
            onClose={props.onCloseStatus}
          />
          <LanguageSwitch />
          <a href="/config#model-fingerprint" className="fp-nav-link">{fp.configLink}</a>
          <a href="/" className="fp-nav-link">{fp.backLink}</a>
        </div>
      </header>
      {props.errorMsg && (
        <div className="fp-job-banner" style={{ borderColor: "var(--err)", color: "var(--err)" }}>
          <span>{props.errorMsg}</span>
        </div>
      )}
    </>
  );
}
