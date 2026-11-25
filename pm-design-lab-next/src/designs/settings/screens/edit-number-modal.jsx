"use client";
import { useState } from "react";
import { AvatarSelect } from "@/designs/settings/ui/avatar-select";
import { Button } from "@/designs/settings/ui/button";
import { StatusBadge } from "@/designs/settings/ui/data-display";
import { TextInput } from "@/designs/settings/ui/form";
import { Select } from "@/designs/settings/ui/select";
import { Modal } from "@/designs/settings/ui/modal";
import { PillTabs } from "@/designs/settings/ui/tab-bar";
import { useUnsavedChanges } from "@/designs/settings/ui/use-unsaved-changes";
import { queues } from "@/designs/settings/data/queues";
import { users } from "@/designs/settings/data/users";
const routeKinds = ["Queues", "Agents"];
const queueOptions = [...new Set(queues.map((q) => q.name))];
const agentOptions = users.map((u) => u.name);
const findIn = (options, value) => options.find((o) => o.toLowerCase() === value.toLowerCase());
/** Work out which tab and option match the number's current "Routed to". */
function initialRoute(routedTo) {
  const queue = findIn(queueOptions, routedTo);
  if (queue) return { kind: "Queues", queue, agent: "" };
  const agent = findIn(agentOptions, routedTo);
  if (agent) return { kind: "Agents", queue: "", agent };
  // Routed to someone not in the agent list yet (or not routed at all).
  if (routedTo && routedTo !== "--") return { kind: "Agents", queue: "", agent: routedTo };
  return { kind: "Queues", queue: "", agent: "" };
}
/** Mount with a `key` per number so the form resets each time it opens. */
export function EditNumberModal({ number, onClose, onSave }) {
  const start = initialRoute(number.routedTo);
  const [label, setLabel] = useState(number.label === "New number" ? "" : number.label);
  const [kind, setKind] = useState(start.kind);
  const [queue, setQueue] = useState(start.queue);
  const [agent, setAgent] = useState(start.agent);
  // Include the current agent even if they're not in the user list yet.
  const agents = [
    ...users.map((u) => ({ value: u.name, label: u.name, photo: u.photo })),
    ...(agent && !agentOptions.includes(agent) ? [{ value: agent, label: agent }] : []),
  ];
  const target = kind === "Queues" ? queue : agent;
  // Save changes only shows after an edit; switching tabs back and forth alone isn't one.
  const { dirty } = useUnsavedChanges({ label: label.trim(), target });
  const save = () => {
    if (!dirty) return;
    onSave({ label: label.trim() || number.label, routedTo: target || "--" });
    onClose();
  };
  return (
    <Modal
      open
      onClose={onClose}
      className="max-w-[520px]"
      title={
        <>
          {number.number}
          <StatusBadge active={number.active} />
        </>
      }
      subtitle={`${number.routedTo || "--"} • ${number.type}`}
      footer={
        dirty ? (
          <div className="flex justify-end">
            <Button variant="primary" className="h-10 px-5" onClick={save}>
              Save changes
            </Button>
          </div>
        ) : undefined
      }
    >
      <form
        className="space-y-6 px-6 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="block">
          <span className="mb-2 block text-[15px] font-medium">Label</span>
          <TextInput
            placeholder="Enter number label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>

        <div>
          <span className="mb-2 block text-[15px] font-medium">Route to</span>
          <PillTabs tabs={routeKinds} value={kind} onChange={setKind} label="Route to" />
        </div>

        {kind === "Queues" ? (
          <div>
            <span className="mb-2 block text-[15px] font-medium">Queue</span>
            <Select
              label="Queue"
              placeholder="Select queue"
              options={queueOptions}
              value={queue}
              onChange={setQueue}
            />
          </div>
        ) : (
          <div>
            <span className="mb-2 block text-[15px] font-medium">Agent</span>
            <AvatarSelect
              label="Agent"
              placeholder="Select agent"
              options={agents}
              value={agent}
              onChange={setAgent}
            />
          </div>
        )}
      </form>
    </Modal>
  );
}
