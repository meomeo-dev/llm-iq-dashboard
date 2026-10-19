import type { ProbeId } from "@/core/model-fingerprint/types";
import {
  readStoredStringList,
  safeLocalStorageGet,
  safeLocalStorageSet,
  writeStoredStringList,
} from "../components/profile/profile-selection-store";

export const CHECK_SELECTION_STORAGE_KEY = "pelican.fingerprint.checkSelection.v1";
export const CHECK_PROFILE_STORAGE_KEY = "pelican.fingerprint.checkProfiles.v1";

export function readStoredCheckSelection(storage?: Storage): { targets: string[]; probes: string[] } | null {
  try {
    const raw = safeLocalStorageGet(CHECK_SELECTION_STORAGE_KEY, storage);
    if (!raw) return null;
    const rec = JSON.parse(raw) as Record<string, unknown>;
    if (!rec || typeof rec !== "object" || !Array.isArray(rec.targets) || !Array.isArray(rec.probes)) return null;
    return {
      targets: rec.targets.filter((i): i is string => typeof i === "string"),
      probes: rec.probes.filter((i): i is string => typeof i === "string"),
    };
  } catch {
    return null;
  }
}

export function writeStoredCheckSelection(targets: Iterable<string>, probes: Iterable<string>, storage?: Storage): void {
  try {
    safeLocalStorageSet(CHECK_SELECTION_STORAGE_KEY, JSON.stringify({ targets: [...targets], probes: [...probes] }), storage);
  } catch { /* ignore */ }
}

export function readStoredCheckProfiles(storage?: Storage): string[] | null {
  return readStoredStringList(CHECK_PROFILE_STORAGE_KEY, storage);
}

export function writeStoredCheckProfiles(profiles: Iterable<string>, storage?: Storage): void {
  writeStoredStringList(CHECK_PROFILE_STORAGE_KEY, profiles, storage);
}

export function reconcileCheckTargets(
  targets: readonly { id: string; defaultSelected?: boolean }[],
  current: ReadonlySet<string>,
  initialized: boolean,
  storedTargets?: readonly string[],
): ReadonlySet<string> {
  const validIds = new Set(targets.map((t) => t.id));
  const defaultIds = () => {
    const defaults = targets.filter((t) => t.defaultSelected).map((t) => t.id);
    return new Set(defaults.length > 0 ? defaults : targets.map((t) => t.id));
  };
  if (!initialized) {
    if (storedTargets) {
      if (storedTargets.length === 0) return new Set();
      const valid = storedTargets.filter((id) => validIds.has(id));
      return valid.length > 0 ? new Set(valid) : defaultIds();
    }
    return defaultIds();
  }
  const kept = [...current].filter((id) => validIds.has(id));
  if (kept.length === current.size) return current;
  return new Set(kept);
}

export function resolveCheckProbes(
  allIds: readonly ProbeId[],
  defaultIds: readonly ProbeId[],
  storedProbes?: readonly string[],
): ReadonlySet<string> {
  if (storedProbes) {
    if (storedProbes.length === 0) return new Set();
    const valid = storedProbes.filter((id): id is ProbeId => allIds.includes(id as ProbeId));
    return new Set(valid.length > 0 ? valid : defaultIds);
  }
  return new Set(defaultIds);
}
