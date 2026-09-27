import { useCallback, useEffect, useState } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { fetchOptions, getCachedRunOptions, prefetchRunOptions, setCachedRunOptions } from "./run-once-api";
import type { Notice } from "./RunOnceFooter";

function usePrefetchOptions(onResolved: (next: RunOptionsView) => void) {
  useEffect(() => {
    void prefetchRunOptions().then((next) => {
      if (!("error" in next)) onResolved(next);
    });
  }, [onResolved]);
}

function useRefreshOptionsOnOpen(
  open: boolean,
  hasOptions: boolean,
  onResolved: (next: RunOptionsView) => void,
  onNotice: (notice: Notice) => void,
) {
  useEffect(() => {
    if (!open) return;
    onNotice(null);
    void fetchOptions().then((next) => {
      if ("error" in next) {
        if (!hasOptions) onNotice({ kind: "error", text: next.error });
        return;
      }
      setCachedRunOptions(next);
      onResolved(next);
    });
  }, [open, hasOptions, onResolved, onNotice]);
}

export function useRunOnceOptions(
  open: boolean,
  onResolved: (next: RunOptionsView) => void,
  onNotice: (notice: Notice) => void,
) {
  const [options, setOptions] = useState<RunOptionsView | null>(() => getCachedRunOptions());

  const handleResolved = useCallback((next: RunOptionsView) => {
    setOptions(next);
    onResolved(next);
  }, [onResolved]);

  usePrefetchOptions((next) => {
    if (options === null) handleResolved(next);
  });

  useRefreshOptionsOnOpen(open, options !== null, handleResolved, onNotice);

  return { options };
}
