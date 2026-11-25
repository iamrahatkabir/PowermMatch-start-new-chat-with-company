"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
/**
 * Centered popup built on the native <dialog>, which gives us the backdrop,
 * Escape-to-close and focus trapping for free.
 */
export function Modal({ open, onClose, title, subtitle, children, footer, className = "" }) {
  const ref = useRef(null);
  // Unique per popup, so two open at once (e.g. a picker over a form) don't clash.
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first button (usually Close); prefer a field marked data-autofocus.
      dialog.querySelector("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clicking the dim area outside the panel lands on the <dialog> itself.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto max-h-[calc(100vh-48px)] w-[calc(100%-32px)] overflow-hidden rounded-2xl bg-white p-0 text-gray-900 shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] backdrop:bg-[#101828]/20 open:flex open:flex-col ${className}`}
    >
      <header
        className={`flex min-h-[72px] shrink-0 justify-between gap-4 border-b border-gray-200 px-6 py-5 ${subtitle ? "items-start" : "items-center"}`}
      >
        <div>
          <h2 id={titleId} className="flex items-center gap-2 text-[17px] font-medium">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-[13px] text-[#475467]">{subtitle}</p>}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-mr-1 rounded p-1 hover:bg-gray-50"
        >
          <X className="size-5" strokeWidth={1.6} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer && <footer className="shrink-0 border-t border-gray-200 px-6 py-6">{footer}</footer>}
    </dialog>
  );
}
