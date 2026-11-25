"use client";
import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { OutcomeMarker } from "@/designs/settings/screens/outcome-marker";
/** Pixels the pointer must move before a press turns into a drag. */
const DRAG_THRESHOLD = 4;
const COLUMNS = 2;
/** Move the item at `from` into the slot at `to`. */
function move(list, from, to) {
  const next = [...list];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}
/**
 * "Reorder buttons" card. Drag a button by pressing anywhere on it: its slot
 * turns into a dashed gap, a copy follows the pointer, and a blue line marks
 * the exact slot (left or right, in any row) it will land in: the grid cell
 * nearest the pointer. Focused buttons also move with the arrow keys.
 */
export function WrapUpPreview({ outcomes, onReorder }) {
  const [drag, setDrag] = useState(null);
  /** Grid slot (0 = top-left) the dragged button would land in. */
  const [slot, setSlot] = useState(null);
  const press = useRef(null);
  const items = useRef(new Map());
  const refocus = useRef(null);
  const dragged = drag ? outcomes.find((o) => o.id === drag.id) : undefined;
  // The line sits on top of whatever is in the landing slot now; none when it would land back where it started.
  const landingSlotId = drag && slot !== null && outcomes[slot]?.id !== drag.id ? outcomes[slot]?.id : null;
  /**
   * The grid cell nearest the pointer: left or right column, and the closest
   * row. Works anywhere, including gaps, the space above the first row, and
   * outside the card.
   */
  const findSlot = (x, y) => {
    const rects = outcomes.map((o) => items.current.get(o.id)?.getBoundingClientRect());
    const [left, right] = rects;
    if (!left) return null;
    const column = right && x > (left.right + right.left) / 2 ? 1 : 0;
    // Each row's vertical centre, from the first cell of every row.
    const rowCentres = rects
      .filter((_, i) => i % COLUMNS === 0)
      .map((r) => (r ? r.top + r.height / 2 : Infinity));
    let row = 0;
    rowCentres.forEach((centre, i) => {
      if (Math.abs(y - centre) < Math.abs(y - rowCentres[row])) row = i;
    });
    return Math.min(row * COLUMNS + column, outcomes.length - 1);
  };
  // Moving a focused element in the DOM can drop focus; put it back after a keyboard move.
  useEffect(() => {
    if (refocus.current) {
      items.current.get(refocus.current)?.focus();
      refocus.current = null;
    }
  }, [outcomes]);
  const onPointerDown = (e, id) => {
    if (e.button !== 0) return;
    press.current = { id, x: e.clientX, y: e.clientY, rect: e.currentTarget.getBoundingClientRect() };
    // Keep getting move/up events even when the pointer leaves the button.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // The pointer was already released; the drag simply won't start.
    }
  };
  const onPointerMove = (e) => {
    const start = press.current;
    if (!start) return;
    if (!drag && Math.hypot(e.clientX - start.x, e.clientY - start.y) < DRAG_THRESHOLD) return;
    setDrag({
      id: start.id,
      x: e.clientX,
      y: e.clientY,
      offsetX: start.x - start.rect.left,
      offsetY: start.y - start.rect.top,
      width: start.rect.width,
      height: start.rect.height,
    });
    setSlot(findSlot(e.clientX, e.clientY));
  };
  const endDrag = () => {
    if (drag && slot !== null) {
      const from = outcomes.findIndex((o) => o.id === drag.id);
      if (from !== slot) onReorder(move(outcomes, from, slot));
    }
    press.current = null;
    setDrag(null);
    setSlot(null);
  };
  const onKeyDown = (e, index) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLUMNS, ArrowDown: COLUMNS }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const to = Math.min(outcomes.length - 1, Math.max(0, index + step));
    if (to === index) return;
    refocus.current = outcomes[index].id;
    onReorder(move(outcomes, index, to));
  };
  return (
    <aside className="w-[358px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <h2 className="flex h-11 items-center border-b border-gray-200 bg-gray-50 px-4 text-[14.5px] text-[#475467]">
        Reorder buttons
      </h2>
      <p className="flex h-[52px] items-center border-b border-gray-200 px-4 text-[15px] text-[#344054]">
        Wrap up (Preview)
      </p>

      <ul
        className="relative grid grid-cols-2 gap-2 border-b border-gray-200 p-4"
        aria-label="Wrap-up buttons, drag to reorder"
      >
        {outcomes.map((outcome, index) => {
          const isDragged = drag?.id === outcome.id;
          return (
            <li
              key={outcome.id}
              ref={(el) => {
                if (el) items.current.set(outcome.id, el);
                else items.current.delete(outcome.id);
              }}
              tabIndex={0}
              aria-roledescription="sortable button"
              aria-label={`${outcome.label}, position ${index + 1} of ${outcomes.length}. Use arrow keys to move.`}
              onPointerDown={(e) => onPointerDown(e, outcome.id)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`group relative flex h-9 touch-none items-center gap-2 rounded-lg border px-3 text-[14.5px] whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-[#84caff] ${
                isDragged
                  ? "border-dashed border-[#d0d5dd] bg-gray-50"
                  : `border-gray-200 bg-[#fcfcfd] ${drag ? "cursor-grabbing" : "cursor-grab"}`
              }`}
            >
              {/* Keep the slot's size while its button is being dragged. */}
              <span className={`flex min-w-0 flex-1 items-center gap-2 ${isDragged ? "invisible" : ""}`}>
                <OutcomeMarker icon={outcome.icon} />
                <span className="truncate">{outcome.label}</span>
              </span>
              {!drag && (
                <GripVertical
                  aria-hidden
                  className="hidden size-4 shrink-0 text-[#475467] group-hover:block group-focus-visible:block"
                  strokeWidth={2}
                />
              )}
              {landingSlotId === outcome.id && (
                <span className="absolute inset-x-0 -top-[6px] h-[3px] rounded-full bg-[#53b1fd]" />
              )}
            </li>
          );
        })}
      </ul>

      <div className="grid grid-cols-2 gap-2 p-4">
        <button
          type="button"
          disabled
          className="h-9 rounded-lg border border-gray-200 text-[14.5px] text-[#98a2b3]"
        >
          Later
        </button>
        <button type="button" disabled className="h-9 rounded-lg bg-[#f2f4f7] text-[14.5px] text-[#98a2b3]">
          Complete
        </button>
      </div>

      {/* The copy that follows the pointer. */}
      {drag && dragged && (
        <div
          aria-hidden
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
            width: drag.width,
            height: drag.height,
          }}
          className="pointer-events-none fixed z-50 flex cursor-grabbing items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[14.5px] whitespace-nowrap shadow-[0_12px_16px_-4px_rgba(16,24,40,0.12),0_4px_6px_-2px_rgba(16,24,40,0.05)]"
        >
          <OutcomeMarker icon={dragged.icon} />
          <span className="min-w-0 flex-1 truncate">{dragged.label}</span>
          <GripVertical className="size-4 shrink-0 text-[#475467]" strokeWidth={2} />
        </div>
      )}
    </aside>
  );
}
