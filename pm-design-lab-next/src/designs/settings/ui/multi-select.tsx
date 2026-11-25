"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Avatar } from "@/designs/settings/ui/data-display";
import { menuClass, useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";

export type MultiOption = {
  value: string;
  label: string;
  /** Shows an avatar before the label (photo, or initials when undefined). */
  avatar?: { photo?: string };
  /** Greyed out and not selectable, e.g. a number already feeding another queue. */
  disabled?: boolean;
  /** Small outlined tag after the label, e.g. "Feeding sales". */
  tag?: string;
};

type MultiSelectProps = {
  options: MultiOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  label?: string;
};

/** Checkbox dropdown: the trigger shows "N selected ×", the menu stays open while ticking. */
export function MultiSelect({ options, value, onChange, placeholder, label }: MultiSelectProps) {
  const { open, openMenu, close, buttonRef, anchorRef, listRef, style } = useFloatingMenu();
  const [active, setActive] = useState(0);
  const listId = useId();

  const selected = new Set(value);
  const count = options.filter((o) => selected.has(o.value)).length;

  const toggle = (option: MultiOption) => {
    if (option.disabled) return;
    onChange(selected.has(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value]);
  };

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => !o.disabled)));
    openMenu();
  };

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active, listRef]);

  /** Step through options, skipping disabled ones. */
  const move = (step: 1 | -1) =>
    setActive((i) => {
      for (let next = i + step; next >= 0 && next < options.length; next += step) {
        if (!options[next].disabled) return next;
      }
      return i;
    });

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
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) toggle(options[active]);
    } else if (e.key === "Tab") {
      close();
    }
  };

  return (
    <>
      <div
        ref={anchorRef}
        className={`flex h-10 w-full items-center rounded-lg border bg-white transition-shadow ${
          open ? "border-[#d0d5dd] ring-4 ring-[#f2f4f7]" : "border-gray-200"
        }`}
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
          onClick={() => (open ? close() : show())}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 truncate rounded-lg pl-3.5 text-left text-[15px] text-[#98a2b3] outline-none"
        >
          {placeholder}
        </button>
        {count > 0 && (
          <span className="mr-1 flex h-6 shrink-0 items-center gap-1 rounded-md bg-gray-50 pr-1 pl-2 text-[13px] font-medium text-gray-900">
            {count} selected
            <button
              type="button"
              aria-label={`Clear ${label ?? "selection"}`}
              onClick={() => onChange([])}
              className="rounded text-[#475467] hover:text-gray-900"
            >
              <X className="size-3.5" strokeWidth={2} />
            </button>
          </span>
        )}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => (open ? close() : show())}
          className="grid h-full shrink-0 place-items-center pr-3 pl-1"
        >
          <ChevronDown className={`size-[18px] transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.8} />
        </button>
      </div>

      {open && style && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable
          style={style}
          className={`${menuClass} max-h-[220px]`}
        >
          {options.map((option, i) => {
            const checked = selected.has(option.value);
            return (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={checked}
                aria-disabled={option.disabled}
                onPointerEnter={() => !option.disabled && setActive(i)}
                onClick={() => toggle(option)}
                className={`flex h-10 items-center gap-2.5 rounded-md px-2 text-[15px] ${
                  option.disabled ? "cursor-not-allowed text-[#667085]" : "cursor-pointer text-gray-900"
                } ${i === active && !option.disabled ? "bg-gray-50" : ""}`}
              >
                <span
                  className={`grid size-4 shrink-0 place-items-center rounded border ${
                    checked
                      ? "border-brand bg-brand text-white"
                      : option.disabled
                        ? "border-gray-200 bg-gray-50"
                        : "border-[#d0d5dd] bg-white"
                  }`}
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
                {option.avatar && <Avatar name={option.label} src={option.avatar.photo} className="size-6" />}
                <span className="truncate">{option.label}</span>
                {option.tag && (
                  <span className="shrink-0 rounded-md border border-gray-200 px-1.5 py-0.5 text-[12.5px] font-medium text-[#475467]">
                    {option.tag}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
