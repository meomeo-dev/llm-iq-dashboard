"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLiveFingerprintJob } from "@/app/components/live-state/live-store";
import { ProfilesProvider } from "@/app/components/profile/profiles-context";
import { listDays, type DayOption } from "@/app/components/timeline/moments";
import { useNow } from "@/app/components/timeline/use-now";
import { useStoredTimeZone } from "@/app/components/timeline/use-stored-time-zone";
import { listTimeZones, zonedDayKey } from "@/app/components/timeline/zoned-time";
import { ToolbarDayMenu } from "@/app/components/toolbar/ToolbarMenus";
import { WorkspaceToolbar } from "@/app/components/toolbar/WorkspaceToolbar";
import { AlertBanner } from "@/app/components/ui/AlertBanner";
import type { FillPlan, ProbeGapSummary, VerificationCheckPlan } from "@/core/model-fingerprint/plan";
import type { DecodedAttemptSummary } from "@/core/model-fingerprint/types";
import type { CliKind } from "@/core/types";
import { useI18n } from "@/i18n";
import { FingerprintCheckPanel, type CheckFormDraft } from "./FingerprintCheckPanel";
import { FingerprintCheckTimeline } from "./FingerprintCheckTimeline";
import { FingerprintMatrix } from "./FingerprintMatrix";
import { FingerprintSampleDrawer } from "./FingerprintSampleDrawer";
import {
  buildCheckRequestBody, buildFillRequestBody, buildSampleMutationBody, defaultFillProfilesByCli,
  fetchFingerprintSnapshot, isRecordCheckPassed, patchSampleJson, postFingerprintJson, sortCheckRecordsDescending,
  toProfileViews, type FillRequestOptions, type FingerprintApiSnapshot, type ProbeCellDetailResponse, type SelectedProbeCell,
} from "./fingerprint-model";
import "./fingerprint.css";

export interface FingerprintDashboardProps {
  initialSnapshot: FingerprintApiSnapshot;
  owner?: boolean;
  readonly?: boolean;
}
interface DrawerState { cell: SelectedProbeCell; attempts: DecodedAttemptSummary[]; gap: ProbeGapSummary | null; }
interface FillTargetState extends FillRequestOptions { plan: FillPlan; }

function useFingerprintController(initialSnapshot: FingerprintApiSnapshot, canOperate: boolean) {
  const [snapshot, setSnapshot] = useState<FingerprintApiSnapshot>(initialSnapshot);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fillProfiles, setFillProfiles] = useState<Partial<Record<CliKind, string>>>(() =>
    defaultFillProfilesByCli(initialSnapshot.profiles, initialSnapshot.matrix),
  );
  const [fillTarget, setFillTarget] = useState<FillTargetState | null>(null);
  const [checkPlan, setCheckPlan] = useState<VerificationCheckPlan | null>(null);
  const [rescoringId, setRescoringId] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const refreshSeqRef = useRef(0);
  const liveJob = useLiveFingerprintJob();
  const toggleMenu = useCallback((id: string) => setOpenMenu((p) => (p === id ? null : id)), []);
  const setCliFillProfile = useCallback((cli: CliKind, profile: string) => setFillProfiles((p) => ({ ...p, [cli]: profile })), []);

  useEffect(() => { setSnapshot(initialSnapshot); }, [initialSnapshot]);

  const refreshAll = useCallback(async () => {
    if (!canOperate) return;
    const seq = ++refreshSeqRef.current;
    try {
      const next = await fetchFingerprintSnapshot();
      if (seq === refreshSeqRef.current) setSnapshot(next);
    } catch (err) {
      if (seq === refreshSeqRef.current) setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }, [canOperate]);

  const loadDrawerCell = useCallback(async (cell: SelectedProbeCell) => {
    try {
      const qs = new URLSearchParams({ cli: cell.cli, model: cell.model, probe: cell.probe });
      const res = await fetch(`/api/fingerprint?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as ProbeCellDetailResponse;
      setDrawerState({ cell, attempts: data.attempts, gap: data.gap });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const effectiveLiveJob = liveJob === undefined ? snapshot.activeJob : liveJob;
  const jobSyncKey = effectiveLiveJob ? `${effectiveLiveJob.jobId}:${effectiveLiveJob.finishedAt ?? ""}:${effectiveLiveJob.checkIds?.length ?? 0}:${effectiveLiveJob.kind === "fill" ? effectiveLiveJob.completedCalls : 0}` : "idle";
  const prevJobSyncKeyRef = useRef(jobSyncKey);
  useEffect(() => {
    if (prevJobSyncKeyRef.current === jobSyncKey) return;
    prevJobSyncKeyRef.current = jobSyncKey;
    if (canOperate) void refreshAll();
  }, [jobSyncKey, canOperate, refreshAll]);

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErrorMsg(null);
    try { await fn(); }
    catch (err) { setErrorMsg(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  };

  return {
    snapshot, liveJob: effectiveLiveJob, busy, errorMsg, setErrorMsg,
    fillProfiles, setCliFillProfile, fillTarget, setFillTarget, checkPlan, setCheckPlan,
    rescoringId, setRescoringId, drawerState, setDrawerState, openMenu, setOpenMenu, toggleMenu,
    refreshAll, loadDrawerCell, runAction,
  };
}

function useDashboardHandlers(ctrl: ReturnType<typeof useFingerprintController>, onCheckStarted: () => void) {
  const requestFillPlan = (opts: FillRequestOptions) =>
    ctrl.runAction(async () => {
      const merged: FillRequestOptions = { ...opts, profile: opts.profile ?? (opts.cli ? ctrl.fillProfiles[opts.cli] : undefined), profilesByCli: opts.profilesByCli ?? ctrl.fillProfiles };
      const data = await postFingerprintJson<{ fillPlan: FillPlan }>(buildFillRequestBody({ action: "plan", ...merged }));
      ctrl.setFillTarget({ ...merged, plan: data.fillPlan });
    });

  const confirmFill = () =>
    ctrl.runAction(async () => {
      if (!ctrl.fillTarget) return;
      const merged: FillRequestOptions = { ...ctrl.fillTarget, profile: ctrl.fillTarget.cli ? ctrl.fillProfiles[ctrl.fillTarget.cli] : ctrl.fillTarget.profile, profilesByCli: ctrl.fillProfiles };
      await postFingerprintJson(buildFillRequestBody({ action: "fill", ...merged }));
      ctrl.setFillTarget(null);
      await ctrl.refreshAll();
    });

  const startCheck = (drafts: readonly CheckFormDraft[]) =>
    ctrl.runAction(async () => {
      const first = drafts[0];
      if (!first) return;
      await postFingerprintJson(buildCheckRequestBody({ action: "check", ...first, targets: drafts }));
      ctrl.setCheckPlan(null);
      ctrl.setOpenMenu(null);
      onCheckStarted();
      await ctrl.refreshAll();
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

  return { requestFillPlan, confirmFill, startCheck, cancelJob, mutateSample, rescoreCheck };
}

export function FingerprintDashboard({ initialSnapshot, owner = true, readonly = false }: FingerprintDashboardProps) {
  const { locale } = useI18n();
  const canOperate = owner && !readonly;
  const [tab, setTab] = useState<"check" | "matrix">("check");
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [storedTz, setStoredTz] = useStoredTimeZone();
  const nowDate = useNow();
  const ctrl = useFingerprintController(initialSnapshot, canOperate);
  const snap = ctrl.snapshot;
  const timeZone = storedTz ?? snap.defaultTimeZone ?? "Asia/Shanghai";
  const timeZones = useMemo(() => listTimeZones(null, locale), [locale]);
  const actions = useDashboardHandlers(ctrl, () => setTab("check"));
  const isJobRunning = ctrl.liveJob !== null || ctrl.busy;
  const profileValue = useMemo(() => ({ profiles: toProfileViews(snap.profiles), owner }), [snap.profiles, owner]);
  const sortedChecks = useMemo(() => sortCheckRecordsDescending(snap.checks), [snap.checks]);
  const days = useMemo(() => listDays(sortedChecks.map((c) => c.createdAt), timeZone), [sortedChecks, timeZone]);
  const todayKey = nowDate ? zonedDayKey(nowDate, timeZone) : (days[0]?.dayKey ?? "1970-01-01");
  const defaultDayKey = days.some((d) => d.dayKey === todayKey) ? todayKey : (days[0]?.dayKey ?? todayKey);
  const activeDayKey = pickedDay !== null && (pickedDay === todayKey || days.some((d) => d.dayKey === pickedDay)) ? pickedDay : defaultDayKey;
  const hasReadyBaselines = useMemo(() => snap.matrix.some((m) => m.usableProbes.length > 0), [snap.matrix]);

  return (
    <ProfilesProvider value={profileValue}>
      <div className="page">
        <div className="workspace">
          <FingerprintWorkspaceToolbar
            owner={owner} readonly={readonly} canOperate={canOperate} tab={tab} onSelectTab={setTab}
            timeZone={timeZone} timeZones={timeZones} onPickTimeZone={setStoredTz}
            dayKey={activeDayKey} days={days} todayKey={todayKey} onPickDay={(d) => { setPickedDay(d); setTab("check"); }}
            onJumpToNow={() => { setPickedDay(todayKey); setTab("check"); }}
            openMenu={ctrl.openMenu} onToggleMenu={ctrl.toggleMenu} onCloseMenus={() => ctrl.setOpenMenu(null)}
            snap={snap} sortedChecks={sortedChecks} liveJob={ctrl.liveJob} isJobRunning={isJobRunning}
            checkPlan={ctrl.checkPlan} onStartCheck={(drafts) => void actions.startCheck(drafts)}
            onCancelJob={() => void actions.cancelJob()}
          />
          {ctrl.errorMsg && <AlertBanner tone="err" className="fp-job-banner" onDismiss={() => ctrl.setErrorMsg(null)}>{ctrl.errorMsg}</AlertBanner>}
          {tab === "check" ? (
            <FingerprintCheckTimeline
              sortedChecks={sortedChecks} timeZone={timeZone} pickedDay={activeDayKey} onPickDay={setPickedDay}
              rescoringId={ctrl.rescoringId} hasReadyBaselines={hasReadyBaselines}
              onRescore={canOperate ? (checkId) => void actions.rescoreCheck(checkId) : undefined}
              onSwitchToMatrix={() => setTab("matrix")} onOpenRunOnce={canOperate ? () => ctrl.setOpenMenu("runOnce") : undefined}
            />
          ) : (
            <FingerprintMatrix
              config={snap.modelFingerprint} matrix={snap.matrix} profiles={snap.profiles}
              fillProfiles={ctrl.fillProfiles} onChangeFillProfile={ctrl.setCliFillProfile}
              selfTest={snap.selfTest} canOperate={canOperate} busy={isJobRunning} pendingPlan={ctrl.fillTarget?.plan ?? null}
              onSelectCell={(cell) => void ctrl.loadDrawerCell(cell)}
              onRequestFillPlan={(opts) => void actions.requestFillPlan(opts)}
              onConfirmFill={() => void actions.confirmFill()} onCancelPlan={() => ctrl.setFillTarget(null)} onRefresh={ctrl.refreshAll}
            />
          )}
          {canOperate && ctrl.drawerState && (
            <FingerprintSampleDrawer
              cell={ctrl.drawerState.cell} profiles={snap.profiles}
              selectedProfile={ctrl.fillProfiles[ctrl.drawerState.cell.cli] ?? "default"}
              onChangeProfile={(prof) => ctrl.setCliFillProfile(ctrl.drawerState!.cell.cli, prof)}
              attempts={ctrl.drawerState.attempts} gap={ctrl.drawerState.gap}
              targetSamples={snap.modelFingerprint.samplesPerProbe} busy={isJobRunning}
              onClose={() => ctrl.setDrawerState(null)}
              onFillProbe={() => {
                const cell = ctrl.drawerState!.cell;
                ctrl.setDrawerState(null);
                void actions.requestFillPlan({ cli: cell.cli, model: cell.model, probes: [cell.probe], profile: ctrl.fillProfiles[cell.cli] ?? "default", profilesByCli: ctrl.fillProfiles });
              }}
              onToggleExclude={(reqId, ex) => void actions.mutateSample(ex ? "include" : "exclude", reqId)}
              onResetProbe={() => void actions.mutateSample("reset")}
            />
          )}
        </div>
      </div>
    </ProfilesProvider>
  );
}

function FingerprintWorkspaceToolbar(props: {
  owner: boolean; readonly: boolean; canOperate: boolean;
  tab: "check" | "matrix"; onSelectTab: (tab: "check" | "matrix") => void;
  timeZone: string; timeZones: ReturnType<typeof listTimeZones>; onPickTimeZone: (tz: string) => void;
  dayKey: string | null; days: readonly DayOption[]; todayKey: string; onPickDay: (day: string) => void;
  onJumpToNow: () => void; openMenu: string | null; onToggleMenu: (id: string) => void; onCloseMenus: () => void;
  snap: FingerprintApiSnapshot; sortedChecks: FingerprintApiSnapshot["checks"];
  liveJob: FingerprintApiSnapshot["activeJob"]; isJobRunning: boolean;
  checkPlan: VerificationCheckPlan | null; onStartCheck: (drafts: readonly CheckFormDraft[]) => void; onCancelJob: () => void;
}) {
  const { locale, t } = useI18n();
  const isEn = locale === "en";
  const fp = t.fingerprint;
  const passedCount = useMemo(() => props.sortedChecks.filter(isRecordCheckPassed).length, [props.sortedChecks]);
  const totalCount = props.sortedChecks.length;
  const rateText = totalCount > 0 ? `${Math.round((passedCount / totalCount) * 100)}%` : "—";
  const readyModels = useMemo(() => props.snap.matrix.filter((m) => m.usableProbes.length > 0).length, [props.snap.matrix]);

  return (
    <WorkspaceToolbar
      activePage="fingerprint" pageTitle={fp.pageTitle} owner={props.owner} readonly={props.readonly}
      timeZone={props.timeZone} timeZones={props.timeZones} onPickTimeZone={props.onPickTimeZone}
      onJumpToNow={props.onJumpToNow} openMenu={props.openMenu} onToggleMenu={props.onToggleMenu}
      onCloseMenus={props.onCloseMenus} configHref="/config#model-fingerprint" configTitle={fp.configLink} pairHref="/pair?next=%2Ffingerprint"
      menusSlot={
        <nav className="menus" aria-label={isEn ? "Date and view" : "日期与视图"}>
          <ToolbarDayMenu
            dayKey={props.dayKey} days={props.days} todayKey={props.todayKey}
            onPickDay={props.onPickDay} open={props.openMenu === "day"}
            onToggle={() => props.onToggleMenu("day")} onClose={props.onCloseMenus}
          />
          <div className="page-group-nav" role="tablist" aria-label={fp.pageTitle}>
            <button type="button" role="tab" aria-selected={props.tab === "check"} className={`page-group-link fp-subview-btn${props.tab === "check" ? " is-active" : ""}`} onClick={() => props.onSelectTab("check")}><span>{fp.tabs.check}</span></button>
            <button type="button" role="tab" aria-selected={props.tab === "matrix"} className={`page-group-link fp-subview-btn${props.tab === "matrix" ? " is-active" : ""}`} onClick={() => props.onSelectTab("matrix")}><span>{fp.tabs.matrix}</span></button>
          </div>
        </nav>
      }
      centerSlot={
        <div className="toolbar-center">
          <div className="toolbar-stack stats" title={fp.pageSubtitle}>
            <span className="stat-primary">{rateText} {isEn ? "consistent" : "一致"}</span>
            <span className="stat-secondary">{totalCount} {isEn ? "checks" : "次核验"} · {readyModels}/{props.snap.matrix.length} {isEn ? "models" : "模型"}</span>
          </div>
          {props.canOperate && (
            <FingerprintCheckPanel
              config={props.snap.modelFingerprint} matrix={props.snap.matrix} selfTest={props.snap.selfTest} selfTestByCli={props.snap.selfTestByCli}
              profiles={props.snap.profiles} activeJob={props.liveJob} busy={props.isJobRunning} pendingPlan={props.checkPlan}
              open={props.openMenu === "runOnce"} onToggle={() => props.onToggleMenu("runOnce")} onClose={props.onCloseMenus}
              onSwitchToMatrix={() => props.onSelectTab("matrix")} onStartCheck={props.onStartCheck} onCancelJob={props.onCancelJob}
            />
          )}
        </div>
      }
    />
  );
}


