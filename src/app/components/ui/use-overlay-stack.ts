import { useEffect, useRef } from "react";

interface OverlayEntry {
  id: number;
  onClose: () => void;
}

const overlayStack: OverlayEntry[] = [];
let nextOverlayId = 1;
let savedBodyOverflow: string | null = null;

function onDocumentKeyDown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  if (dispatchOverlayEscape()) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}

/**
 * 判断当前是否存在处于打开状态的 Modal 或 Drawer 浮层。
 * 供下拉菜单 `useMenuDismiss` 调用，避免子浮层交互误关父级下拉面板。
 */
export function hasActiveOverlay(): boolean {
  return overlayStack.length > 0;
}

/**
 * 将浮层压入全局活动栈，返回幂等的出栈清理函数（支持纯 Node 环境单测直接调用）。
 * 在栈从 0 -> 1 时挂载捕获阶段全局单例 `keydown` 监听与 `body` 滚动锁，栈归零时自动卸载。
 */
export function pushOverlay(onClose: () => void): () => void {
  const id = nextOverlayId++;
  if (overlayStack.length === 0 && typeof document !== "undefined") {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onDocumentKeyDown, true);
  }
  overlayStack.push({ id, onClose });
  return () => {
    const idx = overlayStack.findIndex((item) => item.id === id);
    if (idx === -1) return;
    overlayStack.splice(idx, 1);
    if (overlayStack.length === 0 && typeof document !== "undefined") {
      document.removeEventListener("keydown", onDocumentKeyDown, true);
      if (savedBodyOverflow !== null) {
        document.body.style.overflow = savedBodyOverflow;
        savedBodyOverflow = null;
      }
    }
  };
}

/**
 * 触发栈顶浮层的 Escape 关闭回调；若栈非空并已处理则返回 true。
 */
export function dispatchOverlayEscape(): boolean {
  const top = overlayStack[overlayStack.length - 1];
  if (!top) return false;
  top.onClose();
  return true;
}

/**
 * 统一管理 Modal / Drawer 的浮层栈顺序、Escape 栈顶响应、背景滚动锁定与焦点恢复。
 */
export function useOverlayStack(open: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevFocus =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    const remove = pushOverlay(() => onCloseRef.current());
    return () => {
      remove();
      if (prevFocus && typeof prevFocus.focus === "function" && prevFocus.isConnected) {
        prevFocus.focus();
      }
    };
  }, [open]);
}
