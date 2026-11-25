"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";
export function toIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function fromIso(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
/** "2026-04-02" → "Apr 2, 2026", as in the design. */
export function formatDate(iso) {
  return fromIso(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date, months) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
};
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
/** Popover size from the design. */
const PANEL_WIDTH = 326;
const PANEL_HEIGHT = 390;
/** Six Monday-first weeks covering the month, including the days around it. */
function monthGrid(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -((first.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
/**
 * Date field with a month calendar popover (Monday first). The chosen day is a
 * yellow circle and today is grey. Arrow keys move between days, Page Up/Down
 * change month, Enter picks, Esc closes.
 */
export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  invalid = false,
  errorId,
}) {
  const { open, openMenu, close, buttonRef, anchorRef, listRef, style } = useFloatingMenu(PANEL_HEIGHT);
  const today = new Date();
  const [focused, setFocused] = useState(value ? fromIso(value) : today);
  /** Set when keyboard focus should jump to the highlighted day on the next render. */
  const moveFocus = useRef(false);
  const show = () => {
    setFocused(value ? fromIso(value) : today);
    moveFocus.current = true;
    openMenu();
  };
  const choose = (date) => {
    onChange(toIso(date));
    close();
    buttonRef.current?.focus();
  };
  // Put keyboard focus on the highlighted day when opening and after arrow-key moves.
  useEffect(() => {
    if (!open || !moveFocus.current) return;
    listRef.current?.querySelector(`[data-date="${toIso(focused)}"]`)?.focus();
    moveFocus.current = false;
  }, [open, focused, listRef]);
  const move = (date) => {
    moveFocus.current = true;
    setFocused(date);
  };
  const onGridKeyDown = (e) => {
    const steps = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
    };
    if (steps[e.key]) {
      e.preventDefault();
      move(steps[e.key]());
    }
  };
  // Esc closes just the calendar, not a popup around it.
  const onKeyDown = (e) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
      buttonRef.current?.focus();
    }
  };
  const month = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const selectedIso = value || null;
  const todayIso = toIso(today);
  return (
    <div onKeyDown={onKeyDown} className="w-full">
      <div ref={anchorRef} className={`rounded-lg transition-shadow ${open ? "ring-4 ring-[#f2f4f7]" : ""}`}>
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${label}: ${value ? formatDate(value) : "not set"}`}
          aria-describedby={invalid ? errorId : undefined}
          onClick={() => (open ? close() : show())}
          className={`flex h-10 w-full items-center rounded-lg border bg-white px-3.5 text-left text-[15px] outline-none ${
            invalid
              ? "border-[#fda29b] focus-visible:border-error-500"
              : open
                ? "border-[#d0d5dd]"
                : "border-gray-200 focus-visible:border-[#98a2b3]"
          }`}
        >
          {value ? formatDate(value) : <span className="text-[#98a2b3]">{placeholder}</span>}
        </button>
      </div>

      {open && style && (
        <div
          ref={listRef}
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()}`}
          style={{ ...style, width: PANEL_WIDTH }}
          className="fixed z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setFocused(addMonths(focused, -1))}
              className="grid size-8 place-items-center rounded-md hover:bg-gray-50"
            >
              <ChevronLeft className="size-[18px]" strokeWidth={1.8} />
            </button>
            <p className="text-[15px] font-medium" aria-live="polite">
              {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setFocused(addMonths(focused, 1))}
              className="grid size-8 place-items-center rounded-md hover:bg-gray-50"
            >
              <ChevronRight className="size-[18px]" strokeWidth={1.8} />
            </button>
          </div>

          <div role="grid" onKeyDown={onGridKeyDown} className="grid grid-cols-7 gap-y-1 text-center">
            {weekdays.map((d) => (
              <span key={d} role="columnheader" className="pb-2 text-[14px] font-medium text-[#344054]">
                {d}
              </span>
            ))}
            {monthGrid(month).map((date) => {
              const iso = toIso(date);
              const inMonth = date.getMonth() === month.getMonth();
              const selected = iso === selectedIso;
              const isToday = iso === todayIso;
              const isFocused = iso === toIso(focused);
              return (
                <button
                  key={iso}
                  type="button"
                  data-date={iso}
                  tabIndex={isFocused ? 0 : -1}
                  aria-pressed={selected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  onClick={() => choose(date)}
                  className={`mx-auto grid size-10 place-items-center rounded-full text-[14.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#98a2b3] ${
                    selected
                      ? "bg-brand font-medium text-gray-900"
                      : isToday
                        ? "bg-[#f2f4f7] font-medium text-gray-900"
                        : inMonth
                          ? "text-gray-900 hover:bg-gray-50"
                          : "text-[#98a2b3] hover:bg-gray-50"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
