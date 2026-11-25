import {
  Ban,
  CalendarCheck,
  Check,
  Clock,
  Mail,
  NotebookPen,
  PhoneCall,
  ThumbsDown,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type Queue = {
  id: string;
  name: string;
  /** Numbers feeding this queue. */
  phoneNumbers: string[];
  channels: string[];
  /** Member names, matching users in lib/users. */
  members: string[];
};

export const allChannels = ["Phone", "Chat", "Email", "SMS"];

const team = [
  "Las sabir",
  "Pranto Kumar",
  "Patrick Andre",
  "Rahat Kabir",
  "Sebastian",
  "Adam James",
  "Ashikur Rahman",
  "Anas Ahmed",
  "Jhon Doe",
];

/** Sample data matching the design. Replace with a real data source later. */
export const queues: Queue[] = [
  ["Sales", "+45 29 47 58 63"],
  ["Customer support", "+45 31 82 74 19"],
  ["Recruiter", "+45 40 56 23 87"],
  ["Voicemail", "+45 22 91 45 30"],
  ["Sales", "+45 38 67 12 54"],
  ["Customer support", "+45 27 84 39 61"],
  ["Recruiter", "+45 33 19 72 48"],
  ["Voicemail", "+45 26 53 80 17"],
  ["Sales", "+45 35 68 41 29"],
  ["Customer support", "+45 30 72 56 84"],
].map(([name, phoneNumber], i) => ({
  id: String(i + 1),
  name,
  phoneNumbers: [phoneNumber],
  channels: allChannels,
  members: team,
}));

/**
 * An outcome's icon from the Lucide library (lucide.dev/icons). `name` is the
 * icon's Lucide name (e.g. "PhoneCall"), which is what would be saved; `Icon`
 * is the component that draws it.
 */
export type OutcomeIcon = { name: string; Icon: LucideIcon };

const icon = (name: string, Icon: LucideIcon): OutcomeIcon => ({ name, Icon });

export type OutcomeOptions = {
  /** Agent picks when to follow up (in 1 hour, today 16:00, or a specific time). */
  asksDateTime: boolean;
  /** Agent must add a note before wrapping up. */
  requiresNote: boolean;
  /** Archive the conversation when this outcome is applied. */
  autoArchive: boolean;
};

export type WrapUpOutcome = OutcomeOptions & {
  id: string;
  label: string;
  icon: OutcomeIcon;
  /** Comes with PowerMatch; can be edited but not deleted. */
  isDefault: boolean;
  /** When the outcome was added, e.g. "22 May, 2026". */
  createdAt: string;
};

/** Formats a date the way the designs do: "22 May, 2026". */
export function formatCreatedAt(date: Date) {
  const month = date.toLocaleString("en-GB", { month: "short" });
  return `${date.getDate()} ${month}, ${date.getFullYear()}`;
}

const off: OutcomeOptions = { asksDateTime: false, requiresNote: false, autoArchive: false };
/** Follow-up style outcomes ask the agent for a date & time. */
const asksTime: OutcomeOptions = { ...off, asksDateTime: true };
const created = "22 May, 2026";

/** Sample data matching the design. The ones marked isDefault are built in. */
export const defaultNewOutcomeIcon = icon("Check", Check);

export const phoneCallOutcomes: WrapUpOutcome[] = [
  { id: "resolved", label: "Resolved", icon: icon("Check", Check), isDefault: true, createdAt: created, ...off },
  { id: "info-sent", label: "Info sent", icon: icon("Mail", Mail), isDefault: true, createdAt: created, ...off },
  { id: "follow-up", label: "Follow-up", icon: icon("Clock", Clock), isDefault: true, createdAt: created, ...asksTime },
  { id: "callback-later", label: "Callback later", icon: icon("PhoneCall", PhoneCall), isDefault: true, createdAt: created, ...asksTime },
  { id: "wrong-number", label: "Wrong number", icon: icon("Ban", Ban), isDefault: true, createdAt: created, ...off },
  { id: "onboarded", label: "Onboarded", icon: icon("UserCheck", UserCheck), isDefault: false, createdAt: created, ...off },
  { id: "interview-booked", label: "Interview booked", icon: icon("CalendarCheck", CalendarCheck), isDefault: false, createdAt: created, ...off },
  { id: "not-interested", label: "Not interested", icon: icon("ThumbsDown", ThumbsDown), isDefault: false, createdAt: created, ...off },
];

export const chatEmailOutcomes: WrapUpOutcome[] = [
  { id: "c-resolved", label: "Resolved", icon: icon("Check", Check), isDefault: true, createdAt: created, ...off },
  { id: "c-info-sent", label: "Info sent", icon: icon("Mail", Mail), isDefault: true, createdAt: created, ...off },
  { id: "c-kept-note", label: "Kept note", icon: icon("NotebookPen", NotebookPen), isDefault: true, createdAt: created, ...off },
  { id: "c-follow-up", label: "Follow-up", icon: icon("Clock", Clock), isDefault: true, createdAt: created, ...asksTime },
  { id: "c-interview-booked", label: "Interview booked", icon: icon("CalendarCheck", CalendarCheck), isDefault: false, createdAt: created, ...off },
];

/** "Sales" → "Sales queue", but leaves "Sales queue" as is. */
export const queueLabel = (name: string) => (/\bqueue$/i.test(name.trim()) ? name.trim() : `${name.trim()} queue`);
