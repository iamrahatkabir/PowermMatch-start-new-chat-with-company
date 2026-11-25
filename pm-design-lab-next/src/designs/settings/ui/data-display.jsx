import Image from "next/image";
/** Small grey tag, e.g. "Phone", "Sales", "+2", "Invitation sent". */
export function Chip({ children }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md bg-[#f2f4f7] px-2 text-[13px] font-medium whitespace-nowrap text-[#475467]">
      {children}
    </span>
  );
}
/** Shows the first `max` items as chips and the rest as "+N". */
export function ChipList({ items, max = 2 }) {
  const extra = items.length - max;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, max).map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
      {extra > 0 && <Chip>+{extra}</Chip>}
    </div>
  );
}
export function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
/** Round avatar: the photo when there is one, otherwise initials. */
export function Avatar({ name, src, className = "" }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        title={name}
        width={48}
        height={48}
        className={`size-6 shrink-0 rounded-full border border-gray-200 object-cover ${className}`}
      />
    );
  }
  return (
    <span
      title={name}
      className={`grid size-6 shrink-0 place-items-center rounded-full border border-gray-200 bg-[#f2f4f7] text-[10px] font-semibold text-[#475467] ${className}`}
    >
      {initials(name)}
    </span>
  );
}
export function AvatarStack({ names, max = 4, photoFor }) {
  const extra = names.length - max;
  return (
    <div className="flex items-center">
      {names.slice(0, max).map((name, i) => (
        <Avatar
          key={name}
          name={name}
          src={photoFor?.(name)}
          className={`ring-2 ring-white ${i > 0 ? "-ml-1.5" : ""}`}
        />
      ))}
      {extra > 0 && (
        <span className="-ml-1.5 grid size-6 place-items-center rounded-full bg-white text-[11px] font-medium text-gray-900 ring-2 ring-white">
          {extra}+
        </span>
      )}
    </div>
  );
}
/** White rounded card that holds a table. */
export function TableCard({ children }) {
  return <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">{children}</div>;
}
export const th = "h-11 px-5 text-[14.5px] font-normal text-[#475467]";
export const tr = "h-[52px] border-t border-gray-200 whitespace-nowrap";
/** Green "Active" / grey "Inactive" pill. */
export function StatusBadge({ active }) {
  return active ? (
    <span className="rounded-md bg-success-50 px-1.5 py-0.5 text-[13px] font-medium text-success-500">
      Active
    </span>
  ) : (
    <span className="rounded-md bg-[#f2f4f7] px-1.5 py-0.5 text-[13px] font-medium text-[#475467]">
      Inactive
    </span>
  );
}
