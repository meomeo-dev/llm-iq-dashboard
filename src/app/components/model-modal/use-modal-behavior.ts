import { useEffect, useRef, type RefObject } from "react";

/** 模态窗行为：Esc 关闭、打开期间锁定页面滚动、焦点先落在关闭按钮，关闭后还给打开者 */
export function useModalBehavior(onClose: () => void): RefObject<HTMLButtonElement | null> {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [onClose]);
  return closeButton;
}
