"use client";

import { useCallback, useState } from "react";
import { PenLine, Plus } from "lucide-react";
import { AddNumbersModal } from "@/designs/settings/screens/add-numbers-modal";
import { EditNumberModal } from "@/designs/settings/screens/edit-number-modal";
import { StatusBadge } from "@/designs/settings/ui/data-display";
import { Switch } from "@/designs/settings/ui/switch";
import { Toast } from "@/designs/settings/ui/toast";
import { phoneNumbers as initialNumbers, type AvailableNumber, type PhoneNumber } from "@/designs/settings/data/phone-numbers";

export function PhoneNumbersTable() {
  const [numbers, setNumbers] = useState(initialNumbers);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = numbers.find((n) => n.id === editingId);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  /** Purchased numbers start inactive and unrouted until someone edits them. */
  const addPurchased = (purchased: AvailableNumber[]) => {
    setNumbers((rows) => [
      ...rows,
      ...purchased.map((n) => ({ id: n.id, number: n.number, label: "New number", routedTo: "--", type: n.type, active: false })),
    ]);
    const count = purchased.length;
    if (count === 0) return;
    setToast(`${count} ${count === 1 ? "number has" : "numbers have"} been added to the list.`);
  };

  const updateNumber = (id: string, changes: Partial<PhoneNumber>) =>
    setNumbers((rows) => rows.map((row) => (row.id === id ? { ...row, ...changes } : row)));
  const setActive = (id: string, active: boolean) => updateNumber(id, { active });

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[15px] text-gray-900 shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-gray-50"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          Add numbers
        </button>
      </div>

      <AddNumbersModal open={adding} onClose={() => setAdding(false)} onPurchase={addPurchased} />
      {editing && (
        <EditNumberModal
          key={editing.id}
          number={editing}
          onClose={() => setEditingId(null)}
          onSave={(changes) => {
            updateNumber(editing.id, changes);
            setToast(`Changes to ${editing.number} have been saved.`);
          }}
        />
      )}
      <Toast message={toast} onDismiss={dismissToast} />

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-[15px]">
          <thead>
            <tr className="border-b border-gray-200 text-[13px] text-[#475467]">
              <th className="h-10 w-[15%] px-5 font-medium">Phone number</th>
              <th className="w-[17%] px-5 font-medium">Label</th>
              <th className="w-[15%] px-5 font-medium">Queue/Agent</th>
              <th className="w-[15%] px-5 font-medium">Type</th>
              <th className="w-[15%] px-5 font-medium">Status</th>
              <th className="px-5">
                <span className="sr-only">Enabled</span>
              </th>
              <th className="w-16 px-5">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((row) => (
              <tr key={row.id} className="h-[52px] border-b border-gray-200 whitespace-nowrap last:border-b-0">
                <td className="px-5">{row.number}</td>
                <td className="px-5">{row.label}</td>
                <td className="px-5">{row.routedTo}</td>
                <td className="px-5">{row.type}</td>
                <td className="px-5">
                  <StatusBadge active={row.active} />
                </td>
                <td className="px-5">
                  <Switch
                    checked={row.active}
                    onChange={(active) => setActive(row.id, active)}
                    label={`${row.active ? "Deactivate" : "Activate"} ${row.number}`}
                  />
                </td>
                <td className="px-5 text-right">
                  <button
                    type="button"
                    aria-label={`Edit ${row.number}`}
                    onClick={() => setEditingId(row.id)}
                    className="rounded p-1 text-gray-900 hover:bg-gray-50"
                  >
                    <PenLine className="size-[18px]" strokeWidth={1.6} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
