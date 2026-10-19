import { useEffect, useRef, type RefObject } from "react";
import { hasActiveOverlay } from "../ui/use-overlay-stack";

/**
 * 监听点击面板外部或按下 Escape 键时触发关闭回调。
 * 当存在活动的 Modal / Drawer 浮层（`hasActiveOverlay()`）时自动忽略，避免误关父级下拉面板。
 */
export function useMenuDismiss(
  open: boolean,
  root: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (hasActiveOverlay()) return;
      if (root.current !== null && !root.current.contains(event.target as Node)) {
        onCloseRef.current();
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (hasActiveOverlay()) return;
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, root]);
}
