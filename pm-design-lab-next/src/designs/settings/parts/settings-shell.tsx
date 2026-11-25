import type { ReactNode } from "react";
import { Bell, ChevronDown, ChevronRight } from "lucide-react";
import { Sidebar } from "@/designs/settings/parts/sidebar";
import { Avatar } from "@/designs/settings/ui/data-display";
import { PLACEHOLDER_PHOTO } from "@/designs/settings/data/users";
import { PowerMatchLogo } from "@/designs/settings/parts/powermatch-logo";

// The Settings app chrome: 248px sidebar (Admin settings group) + top bar (bell, Las Sabir) + grey page area.
// view / onNav pick which settings page is shown.
export function SettingsShell({ view, onNav, children }: { view: string; onNav?: (view: string) => void; children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white text-gray-900">
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-gray-200">
        <div className="relative flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
          <PowerMatchLogo />
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="absolute -right-4 grid size-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-500"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <Sidebar view={view} onNav={onNav} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-end gap-6 border-b border-gray-200 px-6">
          <button type="button" aria-label="Notifications" className="text-gray-900">
            <Bell className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className="flex items-center gap-2.5 text-[15px]">
            <Avatar name="Las Sabir" src={PLACEHOLDER_PHOTO} className="size-8" />
            Las Sabir
            <ChevronDown className="size-4" />
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
