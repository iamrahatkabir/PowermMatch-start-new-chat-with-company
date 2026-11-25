export function MenuSection({ title, count }) {
  return <div className="px-2 pb-1 pt-3 text-xs font-medium text-gray-500">{title}{count != null && ` (${count})`}</div>
}
