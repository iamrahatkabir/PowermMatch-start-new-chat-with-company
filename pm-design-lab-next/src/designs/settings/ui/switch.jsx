"use client";
export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-[30px] shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark ${checked ? "bg-brand" : "bg-[#f2f4f7]"}`}
    >
      <span
        className={`size-4 rounded-full bg-white shadow-[0_1px_3px_rgba(16,24,40,0.15)] transition-transform ${checked ? "translate-x-3" : "translate-x-0.5"}`}
      />
    </button>
  );
}
