"use client";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";
import { ConfirmDialog } from "@/designs/settings/ui/confirm-dialog";
import { TextInput } from "@/designs/settings/ui/form";
import { IconSelect } from "@/designs/settings/ui/icon-picker";
import { Modal } from "@/designs/settings/ui/modal";
import { Switch } from "@/designs/settings/ui/switch";
import { useUnsavedChanges } from "@/designs/settings/ui/use-unsaved-changes";
import { defaultNewOutcomeIcon } from "@/designs/settings/data/queues";
const options = [
  {
    key: "asksDateTime",
    title: "Asks for a date & time",
    description: "The agent picks when to follow up in 1 hour, today 16:00, or a specific time.",
  },
  {
    key: "requiresNote",
    title: "Requires a note",
    description: "Before wrapping up agents needs to add a note.",
  },
  {
    key: "autoArchive",
    title: "Auto archive conversation",
    description: "Auto archive a conversation if outcome is applied in wrap up.",
  },
];
/** New outcomes start with a tick icon, asking for a date & time (as in the design). */
const newDraft = {
  label: "",
  icon: defaultNewOutcomeIcon,
  asksDateTime: true,
  requiresNote: false,
  autoArchive: false,
};
function draftFrom(outcome) {
  return {
    label: outcome.label,
    icon: outcome.icon,
    asksDateTime: outcome.asksDateTime,
    requiresNote: outcome.requiresNote,
    autoArchive: outcome.autoArchive,
  };
}
/** Mount with a `key` so the form resets each time it opens. */
export function OutcomeModal({ outcome, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(outcome ? draftFrom(outcome) : newDraft);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  // Compare the icon by name; the component itself can't be compared as data.
  const { dirty } = useUnsavedChanges({ ...draft, label: draft.label.trim(), icon: draft.icon.name });
  const canSave = dirty && draft.label.trim().length > 0;
  const canDelete = Boolean(outcome && onDelete);
  const save = () => {
    if (!canSave) return;
    onSave({ ...draft, label: draft.label.trim() });
    onClose();
  };
  const remove = () => {
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
        title={outcome ? "Edit outcome" : "Add new outcome"}
        subtitle={
          outcome
            ? "Make changes on your existing outcome."
            : "What agents pick when finishing a conversation."
        }
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
            <span className="mb-2 block text-[15px] font-medium">Name</span>
            <TextInput
              placeholder="e.g., Callback"
              value={draft.label}
              onChange={(e) => set("label", e.target.value)}
            />
          </label>

          <div>
            <span className="mb-2 block text-[15px] font-medium">Icon</span>
            <IconSelect value={draft.icon} onChange={(icon) => set("icon", icon)} />
          </div>

          <div className="space-y-7 px-3 pt-1">
            {options.map(({ key, title, description }) => (
              <div key={key} className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#475467]">{description}</p>
                </div>
                <Switch checked={draft[key]} onChange={(on) => set(key, on)} label={title} />
              </div>
            ))}
          </div>
        </form>
      </Modal>

      {outcome && (
        <ConfirmDialog
          open={confirmingDelete}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={remove}
          icon={<ListChecks className="size-6" strokeWidth={1.6} />}
          title="Delete outcome?"
          confirmLabel="Yes! Delete"
        >
          Do you really want to delete <strong className="font-semibold text-gray-900">{outcome.label}</strong>?
        </ConfirmDialog>
      )}
    </>
  );
}
