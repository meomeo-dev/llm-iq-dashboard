import { useState } from "react";
import { actionFetch } from "../components/action-fetch";
import { publishAutoRun } from "../components/live-state/live-store";
import type { AutoRunView } from "@/core/auto-run";

export function useMasterSwitch(state: AutoRunView | null) {
  const [switching, setSwitching] = useState(false);

  const toggleMasterSwitch = async (): Promise<void> => {
    if (state === null || switching) return;
    setSwitching(true);
    try {
      const next = !state.enabled;
      const res = await actionFetch("/api/auto-run", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (res.ok) {
        const data = (await res.json()) as AutoRunView;
        publishAutoRun(data);
      }
    } finally {
      setSwitching(false);
    }
  };

  return { switching, toggleMasterSwitch };
}
