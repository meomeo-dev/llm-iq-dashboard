import { useEffect, useRef } from "react";

interface OverlayEntry {
  id: number;
  onClose: () => void;
  getPanel?: () => HTMLElement | null;
}

const overlayStack: OverlayEntry[] = [];
let nextOverlayId = 1;
let savedBodyOverflow: string | null = null;

export function getTabStops(panel: HTMLElement): HTMLElement[] {
  const selector = "a[href], button, input, select, textarea, summary, [tabindex]";
  return [...panel.querySelectorAll<HTMLElement>(selector)].filter((node) =>
    node.tabIndex >= 0 && !node.matches(":disabled") && !node.closest("[inert]") &&
    node.getClientRects().length > 0 && getComputedStyle(node).visibility === "visible",
  );
}

function focusPanel(panel: HTMLElement): void {
  const stops = getTabStops(panel);
  const preferred = stops.find((node) => node.hasAttribute("data-overlay-initial-focus"));
  (preferred ?? stops[0] ?? panel).focus({ preventScroll: true });
}

function currentPanel(): HTMLElement | null {
  return overlayStack.at(-1)?.getPanel?.() ?? null;
}

export function isInsideActiveOverlay(node: HTMLElement | null): boolean {
  return node !== null && currentPanel()?.contains(node) === true;
}

function keepFocusInPanel(event: FocusEvent): void {
  const panel = currentPanel();
  if (panel && !panel.contains(event.target as Node)) focusPanel(panel);
}

function wrapTab(event: KeyboardEvent, panel: HTMLElement): void {
  const stops = getTabStops(panel);
  const first = stops[0];
  const last = stops.at(-1);
  const active = document.activeElement;
  const outside = !active || !stops.includes(active as HTMLElement);
  if (!outside && active !== (event.shiftKey ? first : last)) return;

  event.preventDefault();
  (event.shiftKey ? last ?? panel : first ?? panel).focus();
}

function onDocumentKeyDown(event: KeyboardEvent): void {
  if (event.defaultPrevented) return;
  if (event.key === "Tab") {
    const panel = currentPanel();
    if (panel) wrapTab(event, panel);
    return;
  }
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
 * 首个浮层打开时挂载键盘与焦点监听并锁定背景滚动，栈归零时自动卸载。
 */
export function pushOverlay(
  onClose: () => void,
  getPanel?: () => HTMLElement | null,
): () => void {
  const id = nextOverlayId++;
  if (overlayStack.length === 0 && typeof document !== "undefined") {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onDocumentKeyDown);
    document.addEventListener("focusin", keepFocusInPanel);
  }
  overlayStack.push({ id, onClose, getPanel });
  return () => {
    const idx = overlayStack.findIndex((item) => item.id === id);
    if (idx === -1) return;
    overlayStack.splice(idx, 1);
    if (overlayStack.length === 0 && typeof document !== "undefined") {
      document.removeEventListener("keydown", onDocumentKeyDown);
      document.removeEventListener("focusin", keepFocusInPanel);
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
export function useOverlayStack<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const panelRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const getPanel = () => panelRef.current;
    const remove = pushOverlay(() => onCloseRef.current(), getPanel);
    const panel = getPanel();
    if (panel && !panel.contains(document.activeElement)) focusPanel(panel);
    return () => {
      const wasTop = overlayStack.at(-1)?.getPanel === getPanel;
      remove();
      if (!wasTop) return;
      const parent = currentPanel();
      if (prevFocus?.isConnected && (!parent || parent.contains(prevFocus))) {
        prevFocus.focus({ preventScroll: true });
      } else if (parent) {
        focusPanel(parent);
      }
    };
  }, [open]);
  return panelRef;
}
