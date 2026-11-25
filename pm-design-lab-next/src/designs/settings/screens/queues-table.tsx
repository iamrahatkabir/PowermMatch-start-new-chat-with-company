"use client";

import { useCallback, useState } from "react";
import { PenLine, Plus } from "lucide-react";
import { QueueModal, type QueueDraft } from "@/designs/settings/screens/queue-modal";
import { Button } from "@/designs/settings/ui/button";
import { AvatarStack, Chip, ChipList, TableCard, th, tr } from "@/designs/settings/ui/data-display";
import { Toast } from "@/designs/settings/ui/toast";
import { queues as initialQueues, queueLabel, type Queue } from "@/designs/settings/data/queues";
import { photoFor } from "@/designs/settings/data/users";

/** null = closed, "new" = creating, otherwise the id being edited. */
type Editing = null | "new" | string;

export function QueuesTable() {
  const [queues, setQueues] = useState(initialQueues);
  const [editing, setEditing] = useState<Editing>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const current = editing && editing !== "new" ? queues.find((q) => q.id === editing) : undefined;

  const save = (draft: QueueDraft) => {
    if (current) {
      setQueues((all) => all.map((q) => (q.id === current.id ? { ...q, ...draft } : q)));
      setToast(`Changes to ${draft.name} have been saved.`);
    } else {
      setQueues((all) => [...all, { id: crypto.randomUUID(), ...draft }]);
      setToast(`${queueLabel(draft.name)} has been created.`);
    }
  };

  const remove = (queue: Queue) => {
    setQueues((all) => all.filter((q) => q.id !== queue.id));
    setToast(`${queueLabel(queue.name)} has been deleted successfully!`);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" strokeWidth={1.8} />
          Create queue
        </Button>
      </div>

      {editing && (
        <QueueModal
          key={editing}
          queue={current}
          queueNames={queues.map((q) => q.name)}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={current ? () => remove(current) : undefined}
        />
      )}
      <Toast message={toast} onDismiss={dismissToast} />

      <TableCard>
        <table className="w-full min-w-[760px] text-left text-[15px]">
          <thead>
            <tr>
              <th className={`${th} w-[23%]`}>Queue</th>
              <th className={`${th} w-[23%]`}>Phone number</th>
              <th className={`${th} w-[23%]`}>Channels</th>
              <th className={th}>Members</th>
              <th className={`${th} w-16`}>
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {queues.map((queue) => (
              <tr key={queue.id} className={tr}>
                <td className="px-5">{queue.name}</td>
                <td className="px-5">
                  <PhoneNumbers numbers={queue.phoneNumbers} />
                </td>
                <td className="px-5">
                  {queue.channels.length > 0 ? <ChipList items={queue.channels} /> : <Empty />}
                </td>
                <td className="px-5">
                  {queue.members.length > 0 ? (
                    <AvatarStack names={queue.members} photoFor={photoFor} />
                  ) : (
                    <Empty />
                  )}
                </td>
                <td className="px-5 text-right">
                  <button
                    type="button"
                    aria-label={`Edit ${queue.name} queue`}
                    onClick={() => setEditing(queue.id)}
                    className="rounded p-1 text-gray-900 hover:bg-gray-50"
                  >
                    <PenLine className="size-[18px]" strokeWidth={1.6} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

/** First number, plus a "+N" chip when the queue is fed by more than one. */
function PhoneNumbers({ numbers }: { numbers: Queue["phoneNumbers"] }) {
  if (numbers.length === 0) return <Empty />;
  return (
    <span className="flex items-center gap-2">
      {numbers[0]}
      {numbers.length > 1 && <Chip>+{numbers.length - 1}</Chip>}
    </span>
  );
}

function Empty() {
  return <span className="text-gray-500">--</span>;
}
