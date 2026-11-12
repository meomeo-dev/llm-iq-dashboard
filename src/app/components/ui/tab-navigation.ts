import type { KeyboardEvent } from "react";

/** 横向标签组：方向键循环切换，Home / End 跳到首尾。 */
export function handleTabNavigation(event: KeyboardEvent<HTMLElement>): void {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>(
    '[role="tab"]:not(:disabled)',
  )];
  const index = tabs.indexOf(event.target as HTMLButtonElement);
  if (index === -1) return;

  const next = event.key === "Home" ? 0
    : event.key === "End" ? tabs.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[next]?.focus();
  tabs[next]?.click();
}
