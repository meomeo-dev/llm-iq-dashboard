"use client";

import { useModalBehavior } from "../model-modal/use-modal-behavior";
import type { ProfileChoice } from "./run-once-profiles";
import { toggled } from "./run-once-selection-utils";

interface RunOnceProfileModalProps {
  /** 本轮条件的复述，如 `gpt-6-sol · high × 动态鹈鹕车` */
  round: string;
  choices: readonly ProfileChoice[];
  picked: ReadonlySet<string>;
  calls: number;
  /** 不支持上游、只跑登录态的组合说明；没有时为 null */
  loginOnlyNote: string | null;
  busy: boolean;
  onPick: (next: ReadonlySet<string>) => void;
  onStart: () => void;
  onCancel: () => void;
}

/**
 * "选择 Profile"二级模态：范围里的 codex 组合有多个可用上游时，开始前在这里勾选。
 * 固定宽度，清单在模态内滚动；面板与顶栏不受影响。
 */
export function RunOnceProfileModal({
  round,
  choices,
  picked,
  calls,
  loginOnlyNote,
  busy,
  onPick,
  onStart,
  onCancel,
}: RunOnceProfileModalProps) {
  const closeButton = useModalBehavior(onCancel);
  const pickedCount = choices.filter((choice) => choice.available && picked.has(choice.id)).length;
  return (
    <div className="profile-modal-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="run-once-profile-title">
        <header className="profile-modal-head">
          <h2 id="run-once-profile-title">选择 Profile</h2>
          <p className="profile-modal-round" title={round}>
            {round}
          </p>
          <button type="button" className="profile-modal-close" aria-label="关闭" ref={closeButton} onClick={onCancel}>
            ×
          </button>
        </header>
        <ul className="profile-modal-list">
          {choices.map((choice) => (
            <li key={choice.id}>
              <label className={`menu-row${choice.available ? "" : " profile-choice-off"}`}>
                <input
                  type="checkbox"
                  disabled={!choice.available}
                  checked={choice.available && picked.has(choice.id)}
                  onChange={() => onPick(toggled(picked, [choice.id]))}
                />
                <span className="checkbox" aria-hidden="true" />
                <span className="menu-row-name" title={choice.label}>
                  {choice.label}
                </span>
                {choice.reason !== null && <span className="profile-choice-reason">{choice.reason}</span>}
              </label>
            </li>
          ))}
        </ul>
        <footer className="profile-modal-foot">
          {loginOnlyNote !== null && <p className="profile-modal-note">{loginOnlyNote}</p>}
          <div className="profile-modal-actions">
            <button type="button" className="profile-modal-cancel" onClick={onCancel}>
              取消
            </button>
            <button type="button" className="run-once-start" disabled={busy || pickedCount === 0} onClick={onStart}>
              {busy ? "发起中…" : `开始（${pickedCount} 个 Profile，共 ${calls} 次调用）`}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
