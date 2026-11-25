"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  confirmLabel: string;
};

/**
 * Small red "are you sure?" dialog. Built on <dialog> so it stacks above an
 * already-open popup; Esc and clicking outside cancel it.
 */
export function ConfirmDialog({ open, onCancel, onConfirm, icon, title, children, confirmLabel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby="confirm-title"
      onClose={onCancel}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-32px)] max-w-[400px] rounded-2xl bg-white p-6 text-gray-900 shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] backdrop:bg-[#101828]/20"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-error-50 text-[#d92d20] ring-[6px] ring-[#fef3f2]/60">
          {icon}
        </span>
        <button type="button" aria-label="Close" onClick={onCancel} className="rounded p-1 text-gray-500 hover:text-gray-900">
          <X className="size-5" strokeWidth={1.6} />
        </button>
      </div>
      <h2 id="confirm-title" className="mt-4 text-[18px] font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-[15px] text-[#475467]">{children}</p>
      <div className="mt-8 flex justify-end">
        <Button variant="danger" className="h-10 px-4" onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
