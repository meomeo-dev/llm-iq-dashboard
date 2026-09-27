import { useRef, useState, type MutableRefObject } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { getCachedRunOptions } from "./run-once-api";
import { resolveRunSelection, writeStoredSelection } from "./run-selection-store";

interface SelectionRefs {
  targets: MutableRefObject<ReadonlySet<string>>;
  prompts: MutableRefObject<ReadonlySet<string>>;
  overrides: MutableRefObject<Record<string, string>>;
}

interface SelectionSetters {
  setTargets: (s: ReadonlySet<string>) => void;
  setPrompts: (s: ReadonlySet<string>) => void;
  setOverrides: (o: Record<string, string>) => void;
}

function initialSelectionState() {
  const cached = getCachedRunOptions();
  if (!cached) return { targets: new Set<string>(), prompts: new Set<string>(), candidateOverrides: {} };
  return resolveRunSelection(cached, new Set(), new Set(), {});
}

function applySelectionResolved(next: RunOptionsView, refs: SelectionRefs, setters: SelectionSetters): void {
  const resolved = resolveRunSelection(next, refs.targets.current, refs.prompts.current, refs.overrides.current);
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

export function useRunOnceSelection() {
  const [initial] = useState(initialSelectionState);
  const [targets, setTargets] = useState<ReadonlySet<string>>(initial.targets);
  const [prompts, setPrompts] = useState<ReadonlySet<string>>(initial.prompts);
  const [candidateOverrides, setCandidateOverrides] = useState<Record<string, string>>(initial.candidateOverrides);

  const refs: SelectionRefs = { targets: useRef(targets), prompts: useRef(prompts), overrides: useRef(candidateOverrides) };
  refs.targets.current = targets;
  refs.prompts.current = prompts;
  refs.overrides.current = candidateOverrides;

  const setters: SelectionSetters = { setTargets, setPrompts, setOverrides: setCandidateOverrides };

  return {
    targets,
    prompts,
    candidateOverrides,
    candidateOverridesRef: refs.overrides,
    applyResolved: (next: RunOptionsView) => applySelectionResolved(next, refs, setters),
    updateTargets: (next: ReadonlySet<string>) => updateSelectionTargets(next, refs, setters),
    updatePrompts: (next: ReadonlySet<string>) => updateSelectionPrompts(next, refs, setters),
    updateCandidateOverride: (p: string, c: string) => updateSelectionCandidate(p, c, refs, setters),
  };
}
