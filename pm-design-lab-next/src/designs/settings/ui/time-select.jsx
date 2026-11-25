"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { menuClass, useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";
/** "08:00", "08:15", … "23:45" for the given step in minutes. */
export function timeOptions(stepMinutes = 15) {
  const times = [];
  for (let m = 0; m < 24 * 60; m += stepMinutes) {
    times.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return times;
}
const defaultTimes = timeOptions(15);
/** About six rows, as in the design. */
const MENU_HEIGHT = 252;
/**
 * Time field with a scrolling dropdown of times (every 15 minutes by default).
 * The chosen time is highlighted with a tick and scrolled into view on open.
 */
export function TimeSelect({
  value,
  onChange,
  label,
  disabled = false,
  invalid = false,
  errorId,
  options = defaultTimes,
}) {
  const { open, openMenu, close, buttonRef, anchorRef, listRef, style } = useFloatingMenu(MENU_HEIGHT);
  const [active, setActive] = useState(0);
  const listId = useId();
  const justOpened = useRef(false);
  const show = () => {
    setActive(Math.max(0, options.indexOf(value)));
    justOpened.current = true;
    openMenu();
  };
  const choose = (time) => {
    onChange(time);
    close();
    buttonRef.current?.focus();
  };
  // Centre the chosen time when the list opens; afterwards keep the arrow-key highlight in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: justOpened.current ? "center" : "nearest" });
    justOpened.current = false;
  }, [open, active, listRef]);
  const onKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Escape") {
      // Stop a surrounding popup from closing too.
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Tab") {
      close();
    }
  };
  return (
    <div
      ref={anchorRef}
      className={`w-full rounded-lg transition-shadow ${open ? "ring-4 ring-[#f2f4f7]" : ""}`}
    >
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeyDown}
        className={`flex h-10 w-full items-center rounded-lg border bg-white px-3.5 text-left text-[15px] text-gray-900 outline-none transition-colors disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-[#c4c9d2] ${
          invalid
            ? "border-[#fda29b] focus-visible:border-error-500"
            : open
              ? "border-[#d0d5dd]"
              : "border-gray-200 focus-visible:border-[#98a2b3]"
        }`}
      >
        {value || <span className="text-[#98a2b3]">--:--</span>}
      </button>

      {open && style && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          style={{ ...style, maxHeight: MENU_HEIGHT }}
          className={`${menuClass} p-1.5`}
        >
          {options.map((time, i) => {
            const selected = time === value;
            return (
              <li
                key={time}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(time)}
                className={`flex h-10 cursor-pointer items-center justify-between rounded-md px-3 text-[15px] ${i === active || selected ? "bg-gray-50" : ""}`}
              >
                {time}
                {selected && <Check className="size-[18px] text-gray-900" strokeWidth={2} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
