import type { OutcomeIcon } from "@/designs/settings/data/queues";

/** The Lucide icon shown before a wrap-up outcome's label. */
export function OutcomeMarker({ icon, size = 18 }: { icon: OutcomeIcon; size?: number }) {
  const { Icon } = icon;
  return <Icon aria-hidden size={size} strokeWidth={1.6} className="shrink-0" />;
}
