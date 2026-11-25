"use client";
import { useCallback, useEffect, useRef, useState } from "react";
/**
 * Open/close + positioning for dropdown menus. The menu is `position: fixed`
 * under its trigger so it isn't clipped inside scrolling popups. It opens
 * upward when there isn't room below for `menuHeight`. It closes on an outside
 * click, on resize, and when anything other than the menu scrolls.
 */
export function useFloatingMenu(menuHeight = 260) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState();
  const buttonRef = useRef(null);
  /** Optional wider box to line the menu up with (defaults to the button). */
  const anchorRef = useRef(null);
  const listRef = useRef(null);
  const openMenu = useCallback(() => {
    const rect = (anchorRef.current ?? buttonRef.current)?.getBoundingClientRect();
    if (rect) {
      const roomBelow = window.innerHeight - rect.bottom;
      const above = roomBelow < menuHeight + 12 && rect.top > roomBelow;
      setStyle(
        above
          ? { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
          : { top: rect.bottom + 4, left: rect.left, width: rect.width },
      );
    }
    setOpen(true);
  }, [menuHeight]);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const inside = (target) =>
      target instanceof Node && [buttonRef, anchorRef, listRef].some((ref) => ref.current?.contains(target));
    const onPointer = (e) => {
      if (!inside(e.target)) setOpen(false);
    };
    const onScroll = (e) => {
      if (!inside(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close]);
  return { open, openMenu, close, buttonRef, anchorRef, listRef, style };
}
export const menuClass =
  "fixed z-50 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]";
