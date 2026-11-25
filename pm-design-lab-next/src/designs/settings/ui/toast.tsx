"use client";

import { useEffect } from "react";
import { CircleCheck, X } from "lucide-react";

type ToastProps = {
  message: string | null;
  onDismiss: () => void;
  /** Auto-hide after this many ms. */
  duration?: number;
};

/** Bottom-right success message. Render it always; it shows while `message` is set. */
export function Toast({ message, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, onDismiss, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 z-50 w-[310px] min-w-fit rounded-xl border border-gray-200 bg-white p-4 shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]"
    >
      <div className="flex items-start justify-between">
        <CircleCheck className="size-5 text-success-500" strokeWidth={1.8} />
        <button type="button" aria-label="Dismiss" onClick={onDismiss} className="rounded text-gray-500 hover:text-gray-900">
          <X className="size-5" strokeWidth={1.6} />
        </button>
      </div>
      <p className="mt-3 text-[15px] whitespace-nowrap text-gray-900">{message}</p>
    </div>
  );
}
