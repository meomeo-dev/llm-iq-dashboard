import { useCallback, useMemo, useRef, useState, type MutableRefObject } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { getCachedRunOptions } from "./run-once-api";
import { reconcileRunSelection, resolveRunSelection, writeStoredSelection } from "./run-selection-store";

interface SelectionRefs {
  targets: MutableRefObject<ReadonlySet<string>>;
  prompts: MutableRefObject<ReadonlySet<string>>;
  overrides: MutableRefObject<Record<string, string>>;
  /** 首次按可选范围初始化后置 true；此后刷新只校正不回填，用户清空的结果得以保留 */
  initialized: MutableRefObject<boolean>;
}

interface SelectionSetters {
  setTargets: (s: ReadonlySet<string>) => void;
  setPrompts: (s: ReadonlySet<string>) => void;
  setOverrides: (o: Record<string, string>) => void;
}

function initialSelectionState() {
  const cached = getCachedRunOptions();
  if (!cached) {
    return { initialized: false, targets: new Set<string>(), prompts: new Set<string>(), candidateOverrides: {} };
  }
  return { initialized: true, ...resolveRunSelection(cached, new Set(), new Set(), {}) };
}

function applySelectionResolved(next: RunOptionsView, refs: SelectionRefs, setters: SelectionSetters): void {
  const resolved = refs.initialized.current
    ? reconcileRunSelection(next, refs.targets.current, refs.prompts.current, refs.overrides.current)
    : resolveRunSelection(next, refs.targets.current, refs.prompts.current, refs.overrides.current);
  refs.initialized.current = true;
  refs.targets.current = resolved.targets;
  refs.prompts.current = resolved.prompts;
  refs.overrides.current = resolved.candidateOverrides;
  setters.setTargets(resolved.targets);
  setters.setPrompts(resolved.prompts);
  setters.setOverrides(resolved.candidateOverrides);
  writeStoredSelection(resolved.targets, resolved.prompts, resolved.candidateOverrides);
}

function updateSelectionTargets(next: ReadonlySet<string>, refs: SelectionRefs, setters: SelectionSetters): void {
  refs.targets.current = next;
  setters.setTargets(next);
  writeStoredSelection(next, refs.prompts.current, refs.overrides.current);
}

function updateSelectionPrompts(next: ReadonlySet<string>, refs: SelectionRefs, setters: SelectionSetters): void {
  refs.prompts.current = next;
  setters.setPrompts(next);
  writeStoredSelection(refs.targets.current, next, refs.overrides.current);
}

function updateSelectionCandidate(promptId: string, candidateId: string, refs: SelectionRefs, setters: SelectionSetters): void {
  const next = { ...refs.overrides.current, [promptId]: candidateId };
  refs.overrides.current = next;
  setters.setOverrides(next);
  writeStoredSelection(refs.targets.current, refs.prompts.current, next);
}

/** 四个动作回调；refs 与 setters 引用稳定，回调因此稳定 */
function useSelectionActions(refs: SelectionRefs, setters: SelectionSetters) {
  const applyResolved = useCallback(
    (next: RunOptionsView) => applySelectionResolved(next, refs, setters),
    [refs, setters],
  );
  const updateTargets = useCallback(
    (next: ReadonlySet<string>) => updateSelectionTargets(next, refs, setters),
    [refs, setters],
  );
  const updatePrompts = useCallback(
    (next: ReadonlySet<string>) => updateSelectionPrompts(next, refs, setters),
    [refs, setters],
  );
  const updateCandidateOverride = useCallback(
    (p: string, c: string) => updateSelectionCandidate(p, c, refs, setters),
    [refs, setters],
  );
  return { applyResolved, updateTargets, updatePrompts, updateCandidateOverride };
}

export function useRunOnceSelection() {
  const [initial] = useState(initialSelectionState);
  const [targets, setTargets] = useState<ReadonlySet<string>>(initial.targets);
  const [prompts, setPrompts] = useState<ReadonlySet<string>>(initial.prompts);
  const [candidateOverrides, setCandidateOverrides] = useState<Record<string, string>>(initial.candidateOverrides);

  const targetsRef = useRef(targets);
  const promptsRef = useRef(prompts);
  const overridesRef = useRef(candidateOverrides);
  const initializedRef = useRef(initial.initialized);
  targetsRef.current = targets;
  promptsRef.current = prompts;
  overridesRef.current = candidateOverrides;

  // refs 与 setters 的引用稳定，下面的回调才能稳定，否则依赖它们的 effect 每次渲染都重跑
  const refs = useMemo<SelectionRefs>(
    () => ({ targets: targetsRef, prompts: promptsRef, overrides: overridesRef, initialized: initializedRef }),
    [],
  );
  const setters = useMemo<SelectionSetters>(
    () => ({ setTargets, setPrompts, setOverrides: setCandidateOverrides }),
    [],
  );

  const actions = useSelectionActions(refs, setters);

  return {
    targets,
    prompts,
    candidateOverrides,
    candidateOverridesRef: overridesRef,
    ...actions,
  };
}
