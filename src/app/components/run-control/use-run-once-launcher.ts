import { useState, type MutableRefObject } from "react";
import { postRun } from "./run-once-api";
import type { Notice } from "./RunOnceFooter";

export function useRunOnceLauncher(
  targets: ReadonlySet<string>,
  prompts: ReadonlySet<string>,
  candidateOverridesRef: MutableRefObject<Record<string, string>>,
) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [startedRunId, setStartedRunId] = useState<string | null>(null);

  const start = async (): Promise<void> => {
    setBusy(true);
    const result = await postRun([...targets], [...prompts], candidateOverridesRef.current);
    setBusy(false);
    if ("error" in result) return setNotice({ kind: "error", text: result.error });
    setNotice({ kind: "ok", text: `已开始 ${result.runId}，共 ${result.calls} 次调用；进度见右侧执行状态` });
    // 本轮跑完前按钮置灰，避免重复发起得到 409
    setStartedRunId(result.runId);
  };

  return { busy, notice, setNotice, startedRunId, start };
}
