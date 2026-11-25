import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#98a2b3] disabled:bg-gray-50 disabled:text-[#c4c9d2]";

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-10 ${fieldBase} ${className}`} {...props} />;
}

export function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`min-h-32 resize-y py-2.5 leading-relaxed ${fieldBase} ${className}`} {...props} />;
}

/** Centered column used by the form-style settings pages. */
export function FormPage({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[844px] px-6 py-10">{children}</div>;
}

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-2.5 flex min-h-8 items-end justify-between">
        <h2 className="text-[13px] font-medium text-[#475467]">{title}</h2>
        {action}
      </div>
      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">{children}</div>
    </section>
  );
}

/** One label + control row inside a Section card. */
export function FieldRow({ label, children, top = false }: { label: ReactNode; children: ReactNode; top?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-6 px-5 py-5 ${top ? "items-start" : "items-center"}`}>
      <div className={`text-[15px] font-medium text-gray-900 ${top ? "pt-2" : ""}`}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
