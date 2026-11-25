"use client";
import { useState } from "react";
import { PhoneForwarded } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";
import { ConfirmDialog } from "@/designs/settings/ui/confirm-dialog";
import { TextInput } from "@/designs/settings/ui/form";
import { Modal } from "@/designs/settings/ui/modal";
import { MultiSelect } from "@/designs/settings/ui/multi-select";
import { useUnsavedChanges } from "@/designs/settings/ui/use-unsaved-changes";
import { phoneNumbers } from "@/designs/settings/data/phone-numbers";
import { allChannels, queueLabel } from "@/designs/settings/data/queues";
import { users } from "@/designs/settings/data/users";
const channelOptions = allChannels.map((c) => ({ value: c, label: c }));
const memberOptions = users.map((u) => ({ value: u.name, label: u.name, avatar: { photo: u.photo } }));
/**
 * A number that's routed to a different queue can't feed this one. Its tag says
 * which queue it's feeding, e.g. "Feeding sales".
 */
function numberOptions(queueName, queueNames, own) {
  const names = new Set(queueNames.map((n) => n.toLowerCase()));
  return phoneNumbers.map((n) => {
    const routed = n.routedTo.toLowerCase();
    const feedingOther = names.has(routed) && routed !== queueName.toLowerCase() && !own.includes(n.number);
    return {
      value: n.number,
      label: n.number,
      disabled: feedingOther,
      tag: feedingOther ? `Feeding ${routed}` : undefined,
    };
  });
}
/** Mount with a `key` so the form resets each time it opens. */
export function QueueModal({ queue, queueNames, onClose, onSave, onDelete }) {
  const [name, setName] = useState(queue?.name ?? "");
  const [numbers, setNumbers] = useState(queue?.phoneNumbers ?? []);
  const [channels, setChannels] = useState(queue?.channels ?? []);
  const [members, setMembers] = useState(queue?.members ?? []);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { dirty } = useUnsavedChanges({ name: name.trim(), numbers, channels, members });
  const canSave = dirty && name.trim().length > 0;
  const canDelete = Boolean(queue && onDelete);
  const save = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), phoneNumbers: numbers, channels, members });
    onClose();
  };
  const deleteQueue = () => {
    setConfirmingDelete(false);
    onDelete?.();
    onClose();
  };
  return (
    <>
      <Modal
        open
        onClose={onClose}
        className="max-w-[520px]"
        title={queue ? queueLabel(queue.name) : "Create a new queue"}
        footer={
          // Delete is always there when editing; Save changes only after an edit.
          canDelete || dirty ? (
            <div className="flex items-center justify-between">
              {canDelete ? (
                <Button variant="danger" className="h-10 px-5" onClick={() => setConfirmingDelete(true)}>
                  Delete
                </Button>
              ) : (
                <span />
              )}
              {dirty && (
                <Button variant="primary" className="h-10 px-5" disabled={!canSave} onClick={save}>
                  Save changes
                </Button>
              )}
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
            <span className="mb-2 block text-[15px] font-medium">Assigned queue name</span>
            <TextInput placeholder="e.g., Sales" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <div>
            <span className="mb-2 block text-[15px] font-medium">Number feeding this queue</span>
            <MultiSelect
              label="Numbers"
              placeholder="Select numbers"
              options={numberOptions(name, queueNames, queue?.phoneNumbers ?? [])}
              value={numbers}
              onChange={setNumbers}
            />
          </div>

          <div>
            <span className="mb-2 block text-[15px] font-medium">Channels</span>
            <MultiSelect
              label="Channels"
              placeholder="Select channels"
              options={channelOptions}
              value={channels}
              onChange={setChannels}
            />
          </div>

          <div>
            <span className="mb-2 block text-[15px] font-medium">Members</span>
            <MultiSelect
              label="Members"
              placeholder="Select members"
              options={memberOptions}
              value={members}
              onChange={setMembers}
            />
          </div>
        </form>
      </Modal>

      {queue && (
        <ConfirmDialog
          open={confirmingDelete}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={deleteQueue}
          icon={<PhoneForwarded className="size-6" strokeWidth={1.6} />}
          title="Delete queue?"
          confirmLabel="Yes! Delete"
        >
          Do you really want to delete{" "}
          <strong className="font-semibold text-gray-900">{queueLabel(queue.name)}</strong>?
        </ConfirmDialog>
      )}
    </>
  );
}
