"use client";
import { useCallback, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button, IconButton } from "@/designs/settings/ui/button";
import { DatePicker } from "@/designs/settings/ui/date-picker";
import { FormPage, Section } from "@/designs/settings/ui/form";
import { Switch } from "@/designs/settings/ui/switch";
import { TimeSelect } from "@/designs/settings/ui/time-select";
import { Toast } from "@/designs/settings/ui/toast";
import { useUnsavedChanges } from "@/designs/settings/ui/use-unsaved-changes";
let nextId = 100;
const range = (from, to) => ({ id: nextId++, from, to });
/** "16:00" + 60 → "17:00", capped at 23:45 (the last option in the time dropdown). */
function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 45);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
/** Times are "HH:MM", so plain string comparison orders them correctly. */
const endsAfterStart = (r) => r.to > r.from;
/** A new time range starts where the last one ends and lasts an hour. */
function nextRange(ranges) {
  const start = ranges.at(-1)?.to || "08:00";
  return range(start, addMinutes(start, 60));
}
const initialDays = [
  {
    name: "Monday",
    open: true,
    ranges: [range("08:00", "10:00"), range("12:00", "13:00"), range("15:00", "16:00")],
  },
  ...["Tuesday", "Wednesday", "Thursday", "Friday"].map((name) => ({
    name,
    open: true,
    ranges: [range("08:00", "16:00")],
  })),
  ...["Saturday", "Sunday"].map((name) => ({ name, open: false, ranges: [range("08:00", "16:00")] })),
];
/** Danish holidays for 2026 (the design showed the same placeholder date on every row). */
const initialHolidays = [
  { name: "Easter", from: "2026-04-02", to: "2026-04-06" },
  { name: "Whitsun", from: "2026-05-24", to: "2026-05-25" },
  { name: "Sankt Hans", from: "2026-06-23", to: "2026-06-23" },
  { name: "Christmas", from: "2026-12-24", to: "2026-12-26" },
].map((h) => ({ id: nextId++, ...h }));
/** ISO dates compare correctly as strings. A holiday may be a single day (start = end). */
const holidayDatesValid = (h) => !h.from || !h.to || h.to >= h.from;
/** A holiday needs a name and both dates before it can be saved. */
const holidayComplete = (h) => h.name.trim() !== "" && h.from !== "" && h.to !== "";
export function BusinessHours() {
  const [days, setDays] = useState(initialDays);
  const [holidays, setHolidays] = useState(initialHolidays);
  // Save changes only shows once something differs from the last save.
  const { dirty, markSaved } = useUnsavedChanges({
    // Ids are internal, so leave them out: undoing an edit counts as unchanged.
    days: days.map((d) => ({ open: d.open, ranges: d.ranges.map((r) => [r.from, r.to]) })),
    holidays: holidays.map((h) => [h.name, h.from, h.to]),
  });
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);
  // Can't save while any open day has a range that ends before it starts, or a holiday is
  // missing its name or dates, or ends before it starts.
  const hasErrors =
    days.some((d) => d.open && !d.ranges.every(endsAfterStart)) ||
    !holidays.every((h) => holidayComplete(h) && holidayDatesValid(h));
  const save = () => {
    if (hasErrors) return;
    markSaved();
    setToast("Changes have been saved.");
  };
  const updateDay = (name, change) =>
    setDays((all) => all.map((day) => (day.name === name ? change(day) : day)));
  const updateRange = (dayName, id, field, value) =>
    updateDay(dayName, (day) => ({
      ...day,
      ranges: day.ranges.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  const updateHoliday = (id, field, value) =>
    setHolidays((all) => all.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  return (
    <FormPage>
      <Section title="Weekly schedule">
        {days.map((day, dayIndex) => {
          // Consecutive closed days (the weekend) share one block in the design, so no divider between them.
          const nextDay = days[dayIndex + 1];
          const joinWithNext = !day.open && nextDay !== undefined && !nextDay.open;
          return (
            <div
              key={day.name}
              className={`grid grid-cols-2 gap-6 px-5 py-5 ${joinWithNext ? "!border-b-0" : ""}`}
            >
              <div className="flex h-10 items-center gap-2.5">
                <Switch
                  checked={day.open}
                  onChange={(open) => updateDay(day.name, (d) => ({ ...d, open }))}
                  label={`Open on ${day.name}`}
                />
                <span className={`text-[15px] font-medium ${day.open ? "text-gray-900" : "text-[#c4c9d2]"}`}>
                  {day.name}
                </span>
              </div>

              <div className="space-y-3">
                {day.ranges.map((r, i) => {
                  // Closed days aren't checked: their times aren't used.
                  const invalid = day.open && !endsAfterStart(r);
                  const errorId = `range-error-${r.id}`;
                  return (
                    <div key={r.id}>
                      <div className="flex items-center gap-2">
                        <TimeSelect
                          label={`${day.name} start time`}
                          value={r.from}
                          disabled={!day.open}
                          onChange={(time) => updateRange(day.name, r.id, "from", time)}
                        />
                        <span className={day.open ? "text-gray-900" : "text-[#c4c9d2]"}>-</span>
                        <TimeSelect
                          label={`${day.name} end time`}
                          value={r.to}
                          disabled={!day.open}
                          invalid={invalid}
                          errorId={errorId}
                          onChange={(time) => updateRange(day.name, r.id, "to", time)}
                        />
                        {i === 0 ? (
                          <IconButton
                            aria-label={`Add time range on ${day.name}`}
                            disabled={!day.open}
                            onClick={() =>
                              updateDay(day.name, (d) => ({
                                ...d,
                                ranges: [...d.ranges, nextRange(d.ranges)],
                              }))
                            }
                          >
                            <Plus className="size-[18px]" strokeWidth={1.6} />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label={`Remove time range on ${day.name}`}
                            disabled={!day.open}
                            onClick={() =>
                              updateDay(day.name, (d) => ({
                                ...d,
                                ranges: d.ranges.filter((x) => x.id !== r.id),
                              }))
                            }
                          >
                            <X className="size-[18px]" strokeWidth={1.6} />
                          </IconButton>
                        )}
                      </div>
                      {invalid && (
                        <p id={errorId} role="alert" className="mt-1.5 text-[13px] text-error-500">
                          End time must be later than start time.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Section>

      <Section
        title="Danish holidays"
        action={
          <Button
            className="h-8 text-[14.5px]"
            onClick={() => setHolidays((all) => [...all, { id: nextId++, name: "", from: "", to: "" }])}
          >
            <Plus className="size-4" strokeWidth={1.8} />
            Add holiday
          </Button>
        }
      >
        {holidays.map((holiday) => {
          const name = holiday.name || "Holiday";
          const invalid = !holidayDatesValid(holiday);
          const errorId = `holiday-error-${holiday.id}`;
          return (
            <div key={holiday.id} className="grid grid-cols-2 gap-6 px-5 py-5">
              <input
                aria-label="Holiday name"
                placeholder="Holiday name"
                value={holiday.name}
                onChange={(e) => updateHoliday(holiday.id, "name", e.target.value)}
                className="h-10 bg-transparent text-[15px] font-medium text-gray-900 outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <DatePicker
                    label={`${name} start date`}
                    placeholder="Start date"
                    value={holiday.from}
                    onChange={(date) => updateHoliday(holiday.id, "from", date)}
                  />
                  <span>-</span>
                  <DatePicker
                    label={`${name} end date`}
                    placeholder="End date"
                    value={holiday.to}
                    invalid={invalid}
                    errorId={errorId}
                    onChange={(date) => updateHoliday(holiday.id, "to", date)}
                  />
                  <IconButton
                    aria-label={`Delete ${holiday.name || "holiday"}`}
                    onClick={() => setHolidays((all) => all.filter((h) => h.id !== holiday.id))}
                  >
                    <Trash2 className="size-[18px]" strokeWidth={1.6} />
                  </IconButton>
                </div>
                {invalid && (
                  <p id={errorId} role="alert" className="mt-1.5 text-[13px] text-error-500">
                    End date can’t be before start date.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </Section>

      {dirty && (
        <Button variant="primary" className="h-10 px-5" disabled={hasErrors} onClick={save}>
          Save changes
        </Button>
      )}
      <Toast message={toast} onDismiss={dismissToast} />
    </FormPage>
  );
}
