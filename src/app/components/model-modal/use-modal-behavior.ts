import { useEffect, useRef, type RefObject } from "react";
import { useOverlayStack } from "../ui/use-overlay-stack";

/** 模态窗行为：接入全局浮层栈（LIFO Esc 关闭、锁定页面滚动、焦点先落在关闭按钮、关闭后还给打开者） */
export function useModalBehavior(onClose: () => void): RefObject<HTMLButtonElement | null> {
  const closeButton = useRef<HTMLButtonElement>(null);
  useOverlayStack(true, onClose);
  useEffect(() => {
    closeButton.current?.focus();
  }, []);
  return closeButton;
}
