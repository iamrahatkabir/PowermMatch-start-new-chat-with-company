"use client";

import { useState, type ComponentType } from "react";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarCheck,
  ChevronDown,
  Clock,
  Database,
  FileSignature,
  Globe,
  Inbox,
  Network,
  PhoneCall,
  PhoneForwarded,
  ReceiptText,
  Settings,
  User,
  Users,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  /** Only built screens get a view; the rest render as inert items for now. */
  view?: string;
  badge?: number;
  expandable?: boolean;
};

const mainNav: NavItem[] = [
  { label: "Overblik", icon: DotsIcon },
  { label: "Inbox", icon: Inbox, badge: 43 },
  { label: "Jobsamtaler", icon: CalendarCheck },
  { label: "Tidsregistrering", icon: Clock },
  { label: "Løn", icon: BadgeDollarSign },
  { label: "Kontrakter", icon: FileSignature },
  { label: "Fakturering", icon: ReceiptText },
  { label: "Team", icon: Users, expandable: true },
  { label: "Jobs", icon: BriefcaseBusiness, expandable: true },
  { label: "Power journey", icon: Network, expandable: true },
  { label: "Career page", icon: Globe },
];

const adminNav: NavItem[] = [
  { label: "Numbers & hours", icon: PhoneForwarded, view: "numbers-hours" },
  { label: "Queues & wrap-up", icon: PhoneCall, view: "queues-wrap-up" },
  { label: "User management", icon: User, view: "user-management" },
  { label: "Compliance & data", icon: Database, view: "compliance-data" },
];

const itemBase =
  "flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 text-[14.5px] text-gray-900 transition-colors";

// view: the open settings page · onNav(view): an Admin settings item was clicked.
// (In the original app these were routes; in the lab they switch views inside the Settings design.)
export function Sidebar({ view, onNav }: { view: string; onNav?: (view: string) => void }) {
  const [adminOpen, setAdminOpen] = useState(true);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-0.5">
        {mainNav.map((item) => (
          <li key={item.label}>
            <div className={`${itemBase} cursor-default`}>
              <item.icon className="size-[18px] shrink-0 text-gray-900" strokeWidth={1.6} />
              <span>{item.label}</span>
              {item.expandable && <ChevronDown className="size-4" strokeWidth={1.8} />}
              {item.badge !== undefined && (
                <span className="ml-auto rounded-full bg-error-50 px-1.5 text-[13px] font-medium text-error-500">
                  {item.badge}
                </span>
              )}
            </div>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={() => setAdminOpen((open) => !open)}
            aria-expanded={adminOpen}
            className={`${itemBase} hover:bg-gray-50`}
          >
            <Settings className="size-[18px] shrink-0" strokeWidth={1.6} />
            <span>Admin settings</span>
            <ChevronDown
              className={`size-4 transition-transform ${adminOpen ? "rotate-180" : ""}`}
              strokeWidth={1.8}
            />
          </button>

          {adminOpen && (
            <ul className="mt-1 ml-[21px] space-y-0.5 border-l border-gray-200 pl-2">
              {adminNav.map((item) => {
                const active = item.view !== undefined && item.view === view;
                const content = (
                  <>
                    <item.icon className="size-[18px] shrink-0" strokeWidth={1.6} />
                    <span>{item.label}</span>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.view ? (
                      <button
                        type="button"
                        onClick={() => onNav?.(item.view!)}
                        className={`${itemBase} ${active ? "bg-[#f2f4f7]" : "hover:bg-gray-50"}`}
                      >
                        {content}
                      </button>
                    ) : (
                      <div className={`${itemBase} cursor-default`}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

/** The four-dot "Overblik" icon from the design. */
function DotsIcon({ className, strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 18 18" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <circle cx="5" cy="5" r="1.8" />
      <circle cx="13" cy="5" r="1.8" />
      <circle cx="5" cy="13" r="1.8" />
      <circle cx="13" cy="13" r="1.8" />
    </svg>
  );
}
