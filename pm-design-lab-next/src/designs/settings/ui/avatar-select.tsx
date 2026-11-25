"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Avatar } from "@/designs/settings/ui/data-display";
import { menuClass, useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";

export type AvatarOption = { value: string; label: string; photo?: string };

type AvatarSelectProps = {
  options: AvatarOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

/** Single-choice dropdown with an avatar next to each person (native <select> can't show images). */
export function AvatarSelect({ options, value, onChange, placeholder = "Select", label }: AvatarSelectProps) {
  const { open, openMenu, close, buttonRef, listRef, style } = useFloatingMenu();
  const [active, setActive] = useState(0);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    openMenu();
  };

  const choose = (option: AvatarOption) => {
    onChange(option.value);
    close();
    buttonRef.current?.focus();
  };

  // Keep the highlighted option in view while using the arrow keys.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
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
      // Stop the surrounding popup from closing too.
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
      if (options[active]) choose(options[active]);
    } else if (e.key === "Tab") {
      close();
    }
  };

  return (
    <>
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
        className="flex h-10 w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-left text-[15px] text-gray-900 outline-none transition-colors focus:border-[#98a2b3]"
      >
        {selected ? (
          <>
            <Avatar name={selected.label} src={selected.photo} className="size-6" />
            <span className="flex-1 truncate">{selected.label}</span>
          </>
        ) : (
          <span className="flex-1 px-0.5 text-[#98a2b3]">{placeholder}</span>
        )}
        <ChevronDown
          className={`size-[18px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {open && style && (
        <ul ref={listRef} id={listId} role="listbox" style={style} className={`${menuClass} max-h-64`}>
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(option)}
                className={`flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-2 text-[15px] ${
                  i === active ? "bg-gray-50" : ""
                }`}
              >
                <Avatar name={option.label} src={option.photo} className="size-7" />
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && <Check className="size-4 text-gray-900" strokeWidth={2} />}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
