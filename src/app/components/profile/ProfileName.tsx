"use client";

import { useEffect, useRef, useState } from "react";
import { profileLabel } from "@/core/profile-view";
import type { DashboardCard } from "@/core/types";
import { profileColor } from "./profile-color";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { useProfiles } from "./profiles-context";

interface ProfileNameProps {
  name: string;
  /** 信息卡"本件"一栏列出的调用 */
  cards?: readonly DashboardCard[];
  className?: string;
}

/**
 * 上游名字按钮：色点 + 显示名，点击在名字下方打开信息卡。
 * 外点、Esc、再点名字关闭；在弹窗里打开时 Esc 只关信息卡（捕获阶段截断）。
 */
export function ProfileName({ name, cards = [], className = "" }: ProfileNameProps) {
  const { profiles, owner } = useProfiles();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useInfoCardDismiss(open, root, () => setOpen(false));
  useEffect(() => {
    if (open) closeButton.current?.focus();
    else if (document.activeElement === document.body) button.current?.focus();
  }, [open]);

  const label = profileLabel(name, profiles);
  return (
    <span className={`profile-name-wrap ${className}`} ref={root}>
      <button
        type="button"
        className="profile-name"
        aria-haspopup="dialog"
        aria-expanded={open}
        title={label}
        ref={button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="profile-dot" style={{ background: profileColor(name) }} aria-hidden="true" />
        <span className="profile-name-text">{label}</span>
      </button>
      {open && (
        <ProfileInfoCard
          name={name}
          profile={profiles.find((profile) => profile.name === name) ?? null}
          cards={cards}
          owner={owner}
          closeRef={closeButton}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  );
}

/** 外点或 Esc 关闭；Esc 在捕获阶段截断，外层模态窗的 Esc 监听收不到 */
function useInfoCardDismiss(open: boolean, root: React.RefObject<HTMLElement | null>, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (root.current !== null && !root.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [open, onClose, root]);
}
