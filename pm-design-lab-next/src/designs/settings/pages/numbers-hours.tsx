"use client";

import { useState } from "react";
import { BusinessHours } from "@/designs/settings/screens/business-hours";
import { PhoneNumbersTable } from "@/designs/settings/screens/phone-numbers-table";
import { VoicemailSettings } from "@/designs/settings/screens/voicemail-settings";
import { TabBar } from "@/designs/settings/ui/tab-bar";

const tabs = ["Phone numbers", "Business hours", "Voicemail"] as const;

export default function NumbersAndHoursPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Phone numbers");

  return (
    <>
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Phone numbers" && <PhoneNumbersTable />}
      {tab === "Business hours" && <BusinessHours />}
      {tab === "Voicemail" && <VoicemailSettings />}
    </>
  );
}
