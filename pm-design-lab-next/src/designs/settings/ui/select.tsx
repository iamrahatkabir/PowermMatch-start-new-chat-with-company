"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { menuClass, useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";

const MENU_HEIGHT = 260;

type SelectProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name, e.g. "Greeting type". */
  label: string;
  /** Shown in grey while nothing is chosen (value ""). */
  placeholder?: string;
};

/**
 * Single-choice dropdown in the PowerMatch style: grey halo while open, the
 * chosen option highlighted with a tick. Arrow keys move, Enter picks, Esc
 * closes (without closing a popup around it).
 */
export function Select({ options, value, onChange, label, placeholder = "Select" }: SelectProps) {
  const { open, openMenu, close, buttonRef, anchorRef, listRef, style } = useFloatingMenu(MENU_HEIGHT);
  const [active, setActive] = useState(0);
  const listId = useId();
  const justOpened = useRef(false);

  const show = () => {
    setActive(Math.max(0, options.indexOf(value)));
    justOpened.current = true;
    openMenu();
  };

  const choose = (option: string) => {
    onChange(option);
    close();
    buttonRef.current?.focus();
  };

  // Keep the highlighted option in view (centred when the list first opens).
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: justOpened.current ? "center" : "nearest" });
    justOpened.current = false;
  }, [open, active, listRef]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Escape") {
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
    <div ref={anchorRef} className={`w-full rounded-lg transition-shadow ${open ? "ring-4 ring-[#f2f4f7]" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeyDown}
        className={`flex h-10 w-full items-center gap-2 rounded-lg border bg-white pr-3 pl-3.5 text-left text-[15px] text-gray-900 outline-none transition-colors ${
          open ? "border-[#d0d5dd]" : "border-gray-200 focus-visible:border-[#98a2b3]"
        }`}
      >
        <span className={`flex-1 truncate ${value ? "" : "text-[#98a2b3]"}`}>{value || placeholder}</span>
        <ChevronDown
          className={`size-[18px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
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
          {options.map((option, i) => {
            const selected = option === value;
            return (
              <li
                key={option}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(option)}
                className={`flex h-10 cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-[15px] ${
                  i === active || selected ? "bg-gray-50" : ""
                }`}
              >
                <span className="truncate">{option}</span>
                {selected && <Check className="size-[18px] shrink-0 text-gray-900" strokeWidth={2} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
