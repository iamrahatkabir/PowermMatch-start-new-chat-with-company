"use client";

import { useState } from "react";
import { QueuesTable } from "@/designs/settings/screens/queues-table";
import { WrapUpOutcomes } from "@/designs/settings/screens/wrap-up-outcomes";
import { TabBar } from "@/designs/settings/ui/tab-bar";

const tabs = ["Queues", "Wrap-up outcomes"] as const;

export default function QueuesAndWrapUpPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Queues");

  return (
    <>
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      {tab === "Queues" ? <QueuesTable /> : <WrapUpOutcomes />}
    </>
  );
}
