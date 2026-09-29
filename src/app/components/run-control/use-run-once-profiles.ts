import { useCallback, useRef, useState } from "react";
import type { RunOptionsView } from "@/app/api/run/route";
import { countCalls, profileChoices, resolvePickedProfiles, startMode, type ProfileChoice, type StartMode } from "./run-once-profiles";

interface ProfileSelectionInput {
  options: RunOptionsView | null;
  targets: ReadonlySet<string>;
  promptCount: number;
  /** 记忆的上游勾选；null 表示没有记忆 */
  storedProfiles: readonly string[] | null;
  start: (profiles?: readonly string[]) => Promise<boolean>;
  onClosePanel: () => void;
}

export interface ProfileSelection {
  mode: StartMode;
  choices: ProfileChoice[];
  pickedProfiles: ReadonlySet<string>;
  chosenCalls: number;
  choosing: boolean;
  /** 页脚按钮：直接发起，或打开模态 */
  onStart: () => void;
  /** 模态里的开始：按勾选的上游发起，随后关模态 */
  startChosen: () => void;
  closeModal: () => void;
  /** 面板的关闭回调：模态打开期间外点与 Esc 都不关面板 */
  closePanel: () => void;
}

/** "跑一次"的上游选择状态：按钮形态、可选上游、勾选与二级模态的开合 */
export function useRunOnceProfiles(input: ProfileSelectionInput): ProfileSelection {
  const { options, targets, promptCount, storedProfiles, start, onClosePanel } = input;
  const [choosing, setChoosing] = useState(false);
  const choosingRef = useRef(false);
  choosingRef.current = choosing;
  const closePanel = useCallback(() => {
    if (!choosingRef.current) onClosePanel();
  }, [onClosePanel]);

  const mode = startMode(options, targets, promptCount);
  const choices = options === null ? [] : profileChoices(options, targets);
  const pickedProfiles = new Set(resolvePickedProfiles(choices, storedProfiles));
  const chosenCalls = options === null ? 0 : countCalls(options, targets, promptCount, [...pickedProfiles]);

  return {
    mode,
    choices,
    pickedProfiles,
    chosenCalls,
    choosing,
    onStart: () => {
      if (mode.kind === "choose") setChoosing(true);
      else if (mode.kind === "direct") void start(mode.profiles);
    },
    startChosen: () => {
      void start([...pickedProfiles]).then(() => setChoosing(false));
    },
    closeModal: () => setChoosing(false),
    closePanel,
  };
}
