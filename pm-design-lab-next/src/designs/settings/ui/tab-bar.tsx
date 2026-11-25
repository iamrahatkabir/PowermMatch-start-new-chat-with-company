"use client";

type TabBarProps<T extends string> = {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
};

/** The underlined page-level tabs that sit under the top bar. */
export function TabBar<T extends string>({ tabs, value, onChange }: TabBarProps<T>) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-gray-200 bg-white px-4">
      {tabs.map((name) => {
        const selected = name === value;
        return (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(name)}
            className={`-mb-px h-12 border-b-2 px-2 text-[15px] transition-colors ${
              selected ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

/** The small boxed toggle (e.g. "Phone call / Chats & Emails"). */
export function SegmentedControl<T extends string>({ tabs, value, onChange }: TabBarProps<T>) {
  return (
    <div role="tablist" className="inline-flex gap-0.5 rounded-lg border border-gray-200 bg-white p-1">
      {tabs.map((name) => {
        const selected = name === value;
        return (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(name)}
            className={`h-7 rounded-md px-3 text-[13.5px] transition-colors ${
              selected ? "bg-[#f2f4f7] font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

/** Full-width grey track with a white selected pill (e.g. "All numbers / Mobile / Landline"). */
export function PillTabs<T extends string>({ tabs, value, onChange, label }: TabBarProps<T> & { label?: string }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="grid gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((name) => (
        <button
          key={name}
          type="button"
          role="tab"
          aria-selected={name === value}
          onClick={() => onChange(name)}
          className={`h-7 rounded-md text-[13px] transition-colors ${
            name === value
              ? "bg-white font-medium text-gray-900 shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
