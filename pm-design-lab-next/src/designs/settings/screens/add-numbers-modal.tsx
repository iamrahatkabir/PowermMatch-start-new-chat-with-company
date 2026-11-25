"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader, RotateCw } from "lucide-react";
import { Button } from "@/designs/settings/ui/button";
import { Modal } from "@/designs/settings/ui/modal";
import { PillTabs } from "@/designs/settings/ui/tab-bar";
import { availableNumbers, type AvailableNumber } from "@/designs/settings/data/phone-numbers";

const filters = ["All numbers", "Mobile", "Landline"] as const;
type Filter = (typeof filters)[number];

const kr = new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const price = (amount: number) => `kr. ${kr.format(amount)} / mo`;

type SetupStatus = "setting-up" | "added" | "failed";
type SetupItem = { number: AvailableNumber; status: SetupStatus };

/**
 * Stand-in for the real provisioning API: resolves after a short, staggered
 * delay and fails roughly 1 in 3 times so the retry state can be seen.
 */
const SIMULATED_FAILURE_RATE = 0.3;
const simulateSetup = (onDone: (ok: boolean) => void, delay: number) =>
  setTimeout(() => onDone(Math.random() >= SIMULATED_FAILURE_RATE), delay);

type AddNumbersModalProps = {
  open: boolean;
  onClose: () => void;
  onPurchase: (numbers: AvailableNumber[]) => void;
};

export function AddNumbersModal({ open, onClose, onPurchase }: AddNumbersModalProps) {
  const [available, setAvailable] = useState(availableNumbers);
  const [filter, setFilter] = useState<Filter>("All numbers");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  /** Numbers bought in this round; non-null means we're on the setup step. */
  const [setup, setSetup] = useState<SetupItem[] | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const visible = filter === "All numbers" ? available : available.filter((n) => n.type === filter);
  const chosen = available.filter((n) => selected.has(n.id));
  const summary = (numbers: AvailableNumber[]) =>
    `${numbers.length} selected · ${price(numbers.reduce((sum, n) => sum + n.price, 0))}`;

  const settingUp = setup !== null;
  const stillWorking = setup?.some((item) => item.status === "setting-up") ?? false;

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const setStatus = (id: string, status: SetupStatus) =>
    setSetup((items) => items?.map((item) => (item.number.id === id ? { ...item, status } : item)) ?? null);

  const startSetup = (id: string, delay: number) => {
    setStatus(id, "setting-up");
    timers.current.push(simulateSetup((ok) => setStatus(id, ok ? "added" : "failed"), delay));
  };

  const confirm = () => {
    setSetup(chosen.map((number) => ({ number, status: "setting-up" })));
    chosen.forEach((n, i) => startSetup(n.id, 1200 + i * 700));
    setAvailable((all) => all.filter((n) => !selected.has(n.id)));
    setSelected(new Set());
  };

  /**
   * Done (or closing during setup) hands the added numbers to the table.
   * Failed ones go back into the pool so they can be picked again later.
   */
  const finish = () => {
    if (setup) {
      onPurchase(setup.filter((i) => i.status === "added").map((i) => i.number));
      const failed = setup.filter((i) => i.status !== "added").map((i) => i.number);
      setAvailable((all) => [...all, ...failed]);
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSetup(null);
    setFilter("All numbers");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={settingUp ? finish : onClose}
      title="Add new number"
      className="max-w-[520px]"
      footer={
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] font-medium">{summary(setup?.map((i) => i.number) ?? chosen)}</p>
          {settingUp ? (
            <Button variant="primary" className="h-10 px-5" disabled={stillWorking} onClick={finish}>
              Done
            </Button>
          ) : (
            <Button variant="primary" className="h-10 px-4" disabled={chosen.length === 0} onClick={confirm}>
              Confirm purchase
            </Button>
          )}
        </div>
      }
    >
      {settingUp ? (
        <ul className="px-6 py-4">
          {setup.map(({ number: n, status }) => (
            <li key={n.id} className="flex h-11 items-center gap-3 text-[15px]">
              <DanishFlag />
              <span className="flex-1 whitespace-nowrap">{n.number}</span>
              <SetupStatusLabel status={status} onRetry={() => startSetup(n.id, 1500)} number={n.number} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="px-6 pt-6 pb-4">
            <PillTabs tabs={filters} value={filter} onChange={setFilter} label="Number type" />
          </div>

          <ul className="px-6 pb-4">
            {visible.map((n) => (
              <li key={n.id}>
                <label className="grid h-11 cursor-pointer grid-cols-[18px_22px_1fr_1fr_auto] items-center gap-x-3 text-[15px]">
                  <input
                    type="checkbox"
                    checked={selected.has(n.id)}
                    onChange={() => toggle(n.id)}
                    className="size-[18px] cursor-pointer rounded accent-gray-900"
                  />
                  <DanishFlag />
                  <span className="whitespace-nowrap">{n.number}</span>
                  <span className="pl-4 text-[#475467]">{n.type}</span>
                  <span className="text-right whitespace-nowrap text-[#475467]">{price(n.price)}</span>
                </label>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="py-6 text-center text-sm text-gray-500">No {filter.toLowerCase()} numbers available.</li>
            )}
          </ul>
        </>
      )}
    </Modal>
  );
}

function SetupStatusLabel({
  status,
  onRetry,
  number,
}: {
  status: SetupStatus;
  onRetry: () => void;
  number: string;
}) {
  if (status === "added") {
    return (
      <span className="flex items-center gap-1.5 text-success-500">
        <Check className="size-4" strokeWidth={2.2} />
        Added
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-3">
        <span className="text-error-500">Failed</span>
        <Button className="h-8 gap-1.5 px-2.5 text-[14px]" onClick={onRetry} aria-label={`Retry adding ${number}`}>
          <RotateCw className="size-3.5" strokeWidth={1.8} />
          Retry
        </Button>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[#475467]">
      <Loader className="size-4 animate-spin [animation-duration:2s]" strokeWidth={1.8} />
      Setting up...
    </span>
  );
}

function DanishFlag() {
  return (
    <svg viewBox="0 0 37 28" className="h-[14px] w-[22px] rounded-[2px]" aria-label="Denmark">
      <rect width="37" height="28" fill="#c8102e" />
      <rect x="12" width="4" height="28" fill="#fff" />
      <rect y="12" width="37" height="4" fill="#fff" />
    </svg>
  );
}
