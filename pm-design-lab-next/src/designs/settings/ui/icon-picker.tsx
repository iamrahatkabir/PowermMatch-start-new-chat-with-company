"use client";

import { useEffect, useMemo, useState, type KeyboardEvent, type UIEvent } from "react";
import { ChevronDown, Loader2, type LucideIcon } from "lucide-react";
import { useFloatingMenu } from "@/designs/settings/ui/use-floating-menu";

export type PickedIcon = { name: string; Icon: LucideIcon };

type LibraryIcon = PickedIcon & {
  /** Readable name, e.g. "Call 02". */
  label: string;
  /** Lower-case text searched against: the readable name plus the Lucide name. */
  keywords: string;
};

/** "PhoneCall" → "Phone Call", "AArrowDown" → "A Arrow Down", "Clock3" → "Clock 3". */
export const humanize = (name: string) =>
  name
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .trim();

/**
 * Load every Lucide icon (~2,100) once, on first open, so the full set stays
 * out of normal page loads; pages only include the icons they actually show.
 */
let libraryPromise: Promise<LibraryIcon[]> | null = null;
function loadLibrary() {
  libraryPromise ??= import("lucide-react").then(({ icons }) =>
    Object.entries(icons)
      .map(([name, Icon]) => {
        const label = humanize(name);
        return { name, Icon, label, keywords: `${label} ${name}`.toLowerCase() };
      })
      .sort((a, b) => a.label.localeCompare(b.label)),
  );
  return libraryPromise;
}

/** Icons drawn at first; more are added as you scroll to the bottom. */
const PAGE = 160;
/** Search box + grid. Used to decide whether the dropdown opens up or down. */
const PANEL_HEIGHT = 380;

type IconSelectProps = {
  value: PickedIcon;
  onChange: (icon: PickedIcon) => void;
  label?: string;
};

/**
 * Icon field with a dropdown over the whole Lucide library (lucide.dev/icons):
 * a search box on top and the icons in a scrolling grid. The library loads the
 * first time the dropdown opens. Independent of any form: it only
 * reports the icon that was picked.
 */
export function IconSelect({ value, onChange, label = "Icon" }: IconSelectProps) {
  const { open, openMenu, close, buttonRef, anchorRef, listRef, style } = useFloatingMenu<HTMLDivElement>(PANEL_HEIGHT);
  const [library, setLibrary] = useState<LibraryIcon[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    if (!open || library) return;
    let active = true;
    loadLibrary()
      .then((icons) => active && setLibrary(icons))
      .catch(() => {
        libraryPromise = null; // let the next open try again
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [open, library]);

  const results = useMemo(() => {
    if (!library) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return library;
    const matches = library.filter((icon) => terms.every((t) => icon.keywords.includes(t)));
    // Names that start with the search come first, e.g. "call" before "missed call".
    const first = terms[0];
    return matches.sort(
      (a, b) =>
        Number(!a.label.toLowerCase().startsWith(first)) - Number(!b.label.toLowerCase().startsWith(first)),
    );
  }, [library, query]);

  const shown = results.slice(0, limit);

  const show = () => {
    setQuery("");
    setLimit(PAGE);
    openMenu();
  };

  const choose = (icon: LibraryIcon) => {
    onChange({ name: icon.name, Icon: icon.Icon });
    close();
    buttonRef.current?.focus();
  };

  /** Draw the next batch when the grid is scrolled near its end. */
  const onGridScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 120 && limit < results.length) {
      setLimit((n) => n + PAGE);
    }
  };

  // Esc closes just the dropdown, not the popup it sits in.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
      buttonRef.current?.focus();
    }
  };

  return (
    <div onKeyDown={onKeyDown}>
      <div
        ref={anchorRef}
        className={`rounded-lg transition-shadow ${open ? "ring-4 ring-[#f2f4f7]" : ""}`}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${label}: ${humanize(value.name)}`}
          onClick={() => (open ? close() : show())}
          className={`flex h-10 w-full items-center gap-3 rounded-lg border bg-white px-3 text-left text-[15px] outline-none ${
            open ? "border-[#d0d5dd]" : "border-gray-200 focus-visible:border-[#98a2b3]"
          }`}
        >
          <value.Icon size={18} strokeWidth={1.6} className="shrink-0" />
          <span className="flex-1 truncate text-[#475467]">{humanize(value.name)}</span>
          <ChevronDown
            className={`size-[18px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {open && style && (
        <div
          ref={listRef}
          role="dialog"
          aria-label="Select icon"
          style={{ ...style, height: PANEL_HEIGHT }}
          className="fixed z-50 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          <div className="shrink-0 border-b border-gray-200 p-2">
            <input
              type="search"
              autoFocus
              placeholder="Search icons, e.g. phone, calendar, star"
              aria-label="Search icons"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE);
              }}
              className="h-9 w-full rounded-md border border-gray-200 px-3 text-[14.5px] outline-none placeholder:text-[#98a2b3] focus:border-[#98a2b3]"
            />
            {library && (
              <p className="mt-1.5 px-1 text-[12.5px] text-[#475467]" aria-live="polite">
                {query
                  ? `${results.length.toLocaleString("en")} results`
                  : `${library.length.toLocaleString("en")} icons`}
              </p>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2" onScroll={onGridScroll}>
            {failed ? (
              <p className="py-12 text-center text-sm text-gray-500">Couldn’t load the icons. Close and try again.</p>
            ) : !library ? (
              <p className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="size-4 animate-spin" />
                Loading icons…
              </p>
            ) : results.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No icons match “{query}”.</p>
            ) : (
              <div role="listbox" aria-label="Icons" className="grid grid-cols-8 gap-1">
                {shown.map((icon) => {
                  const selected = icon.name === value.name;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-label={icon.label}
                      title={icon.label}
                      onClick={() => choose(icon)}
                      className={`grid aspect-square place-items-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#98a2b3] ${
                        selected
                          ? "border-gray-900 bg-gray-50 text-gray-900 ring-1 ring-gray-900"
                          : "border-transparent text-[#344054] hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <icon.Icon size={20} strokeWidth={1.6} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
