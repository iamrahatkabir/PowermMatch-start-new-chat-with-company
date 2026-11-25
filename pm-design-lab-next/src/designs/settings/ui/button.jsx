const variants = {
  primary: "bg-brand text-gray-900 hover:bg-brand-dark",
  danger: "bg-[#d92d20] text-white hover:bg-[#b42318]",
  outline: "border border-gray-200 bg-white text-gray-900 shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-gray-50",
};
export function Button({ variant = "outline", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
/** Square 40px icon button used beside inputs (add range, remove, delete). */
export function IconButton({ className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`grid size-10 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-[#d0d5dd] disabled:hover:bg-white ${className}`}
      {...props}
    />
  );
}
