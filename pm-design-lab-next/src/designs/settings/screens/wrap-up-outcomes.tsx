"use client";

import { useCallback, useState } from "react";
import { PenLine, Plus } from "lucide-react";
import { OutcomeMarker } from "@/designs/settings/screens/outcome-marker";
import { OutcomeModal, type OutcomeDraft } from "@/designs/settings/screens/outcome-modal";
import { WrapUpPreview } from "@/designs/settings/screens/wrap-up-preview";
import { Button } from "@/designs/settings/ui/button";
import { Chip } from "@/designs/settings/ui/data-display";
import { SegmentedControl } from "@/designs/settings/ui/tab-bar";
import { Toast } from "@/designs/settings/ui/toast";
import {
  chatEmailOutcomes,
  defaultNewOutcomeIcon,
  formatCreatedAt,
  phoneCallOutcomes,
  type WrapUpOutcome,
} from "@/designs/settings/data/queues";

const channels = ["Phone call", "Chats & Emails"] as const;
type Channel = (typeof channels)[number];

/** null = closed, "new" = adding, otherwise the id being edited. */
type Editing = null | "new" | string;

/** Apply the popup's fields to an outcome. */
function applyDraft(outcome: WrapUpOutcome, draft: OutcomeDraft): WrapUpOutcome {
  return { ...outcome, ...draft };
}

export function WrapUpOutcomes() {
  const [channel, setChannel] = useState<Channel>("Phone call");
  const [outcomes, setOutcomes] = useState<Record<Channel, WrapUpOutcome[]>>({
    "Phone call": phoneCallOutcomes,
    "Chats & Emails": chatEmailOutcomes,
  });
  /**
   * Button order in the wrap-up preview, kept apart from the table (which
   * stays in the order outcomes were added). `savedOrder` is the last saved
   * order; Save changes only shows when the two differ.
   */
  const initialOrder: Record<Channel, string[]> = {
    "Phone call": phoneCallOutcomes.map((o) => o.id),
    "Chats & Emails": chatEmailOutcomes.map((o) => o.id),
  };
  const [buttonOrder, setButtonOrder] = useState(initialOrder);
  const [savedOrder, setSavedOrder] = useState(initialOrder);
  const [editing, setEditing] = useState<Editing>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const list = outcomes[channel];
  const current = editing && editing !== "new" ? list.find((o) => o.id === editing) : undefined;
  const update = (next: (all: WrapUpOutcome[]) => WrapUpOutcome[]) =>
    setOutcomes((all) => ({ ...all, [channel]: next(all[channel]) }));

  // Deleted outcomes drop out of the order on their own.
  const byId = new Map(list.map((o) => [o.id, o]));
  const order = buttonOrder[channel].filter((id) => byId.has(id));
  const previewList = order.map((id) => byId.get(id)!);
  const saved = savedOrder[channel].filter((id) => byId.has(id));
  const orderChanged = order.some((id, i) => id !== saved[i]);

  const setOrder = (ids: string[]) => setButtonOrder((all) => ({ ...all, [channel]: ids }));

  const saveOrder = () => {
    setSavedOrder((all) => ({ ...all, [channel]: order }));
    setToast("Button order has been saved.");
  };

  const save = (draft: OutcomeDraft) => {
    if (current) {
      update((all) => all.map((o) => (o.id === current.id ? applyDraft(o, draft) : o)));
      setToast(`Changes to ${draft.label} have been saved.`);
    } else {
      const blank: WrapUpOutcome = {
        id: crypto.randomUUID(),
        label: "",
        icon: defaultNewOutcomeIcon,
        isDefault: false,
        createdAt: formatCreatedAt(new Date()),
        asksDateTime: false,
        requiresNote: false,
        autoArchive: false,
      };
      update((all) => [...all, applyDraft(blank, draft)]);
      // A new button goes last in the preview; that's not an unsaved reorder.
      setButtonOrder((all) => ({ ...all, [channel]: [...all[channel], blank.id] }));
      setSavedOrder((all) => ({ ...all, [channel]: [...all[channel], blank.id] }));
      setToast(`${draft.label} outcome has been added.`);
    }
  };

  const remove = (outcome: WrapUpOutcome) => {
    update((all) => all.filter((o) => o.id !== outcome.id));
    setToast(`${outcome.label} has been deleted successfully!`);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <SegmentedControl tabs={channels} value={channel} onChange={setChannel} />
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" strokeWidth={1.8} />
          Add outcome
        </Button>
      </div>

      {editing && (
        <OutcomeModal
          key={`${channel}-${editing}`}
          outcome={current}
          onClose={() => setEditing(null)}
          onSave={save}
          // Built-in default outcomes can't be deleted.
          onDelete={current && !current.isDefault ? () => remove(current) : undefined}
        />
      )}
      <Toast message={toast} onDismiss={dismissToast} />

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-[2.15] overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <thead>
              <tr>
                <th className="h-11 w-[45%] px-5 text-[14.5px] font-normal text-[#475467]">Buttons</th>
                <th className="h-11 px-5 text-[14.5px] font-normal text-[#475467]">Created at</th>
                <th className="w-14">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((outcome) => (
                <tr
                  key={outcome.id}
                  onClick={() => setEditing(outcome.id)}
                  className="h-[52px] cursor-pointer border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-5">
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <OutcomeMarker icon={outcome.icon} />
                      {outcome.label}
                      {outcome.isDefault && <Chip>Default</Chip>}
                    </span>
                  </td>
                  <td className="px-5 whitespace-nowrap">{outcome.createdAt}</td>
                  <td className="pr-5 text-right">
                    <button
                      type="button"
                      aria-label={`Edit ${outcome.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(outcome.id);
                      }}
                      className="ml-auto grid place-items-center rounded p-1 hover:bg-white"
                    >
                      <PenLine className="size-[18px]" strokeWidth={1.6} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WrapUpPreview outcomes={previewList} onReorder={(next) => setOrder(next.map((o) => o.id))} />
      </div>

      {orderChanged && (
        <Button variant="primary" className="mt-4 h-10 px-5" onClick={saveOrder}>
          Save changes
        </Button>
      )}
    </div>
  );
}
