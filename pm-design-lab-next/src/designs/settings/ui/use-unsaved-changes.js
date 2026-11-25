"use client";
import { useState } from "react";
/**
 * Tracks whether a form differs from its last saved state, so "Save changes"
 * only shows when there's something to save. The first value passed is the
 * saved baseline; call `markSaved()` after saving to make the current value the
 * new baseline. Changing a field back to its saved value counts as unchanged.
 *
 * Values are compared as JSON, so pass plain data: map anything else (e.g. an
 * icon component) to something comparable, like its name.
 */
export function useUnsavedChanges(current) {
  const snapshot = JSON.stringify(current);
  const [saved, setSaved] = useState(snapshot);
  return { dirty: snapshot !== saved, markSaved: () => setSaved(snapshot) };
}
