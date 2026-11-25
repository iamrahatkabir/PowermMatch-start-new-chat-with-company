"use client";

import { useCallback, useState } from "react";
import { AudioUpload } from "@/designs/settings/ui/audio-upload";
import { Button } from "@/designs/settings/ui/button";
import { FieldRow, FormPage, Section, TextArea } from "@/designs/settings/ui/form";
import { Select } from "@/designs/settings/ui/select";
import { Toast } from "@/designs/settings/ui/toast";
import { useUnsavedChanges } from "@/designs/settings/ui/use-unsaved-changes";
import { VoiceRecorder, type Recording } from "@/designs/settings/ui/voice-recorder";

/** How the voicemail greeting is provided, in the order the design lists them. */
const greetingTypes = ["Typed text, read aloud", "An uploaded audio file", "Record a greeting now"] as const;
const lengths = ["1 minute", "2 minutes", "3 minutes", "5 minutes", "10 minutes"] as const;

export function VoicemailSettings() {
  const [greetingType, setGreetingType] = useState<string>(greetingTypes[0]);
  const [greeting, setGreeting] = useState(
    "This call is recorded for quality and documentation purposes. Press 1 if you do not wish to be recorded.",
  );
  const [maxLength, setMaxLength] = useState("2 minutes");
  const [greetingFile, setGreetingFile] = useState<File | null>(null);
  const [recording, setRecording] = useState<Recording | null>(null);

  // Save changes only shows once something differs from the last save. Files are compared by name, size and date.
  const { dirty, markSaved } = useUnsavedChanges({
    greetingType,
    greeting,
    maxLength,
    // The file only matters while the uploaded-file option is chosen.
    file:
      greetingType === "An uploaded audio file" && greetingFile
        ? [greetingFile.name, greetingFile.size, greetingFile.lastModified]
        : null,
    // Likewise the recording, compared by size and length.
    recording:
      greetingType === "Record a greeting now" && recording ? [recording.blob.size, recording.duration] : null,
  });
  // The uploaded-file and recorded greetings need their audio before they can be saved.
  const missingFile =
    (greetingType === "An uploaded audio file" && !greetingFile) ||
    (greetingType === "Record a greeting now" && !recording);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const save = () => {
    if (missingFile) return;
    markSaved();
    setToast("Changes have been saved.");
  };

  return (
    <FormPage>
      <Section title="Greetings">
        <FieldRow label="What caller hear before leaving a message" top>
          <div className="space-y-3">
            <Select label="Greeting type" options={greetingTypes} value={greetingType} onChange={setGreetingType} />
            {greetingType === "Typed text, read aloud" && (
              <TextArea
                aria-label="Greeting text"
                rows={5}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
              />
            )}
            {greetingType === "An uploaded audio file" && (
              <AudioUpload value={greetingFile} onChange={setGreetingFile} />
            )}
            {greetingType === "Record a greeting now" && <VoiceRecorder value={recording} onChange={setRecording} />}
          </div>
        </FieldRow>
      </Section>

      <Section title="Voicemails">
        <FieldRow label="Max voicemail length">
          <Select label="Max voicemail length" options={lengths} value={maxLength} onChange={setMaxLength} />
        </FieldRow>
      </Section>

      {dirty && (
        <Button variant="primary" className="h-10 px-5" disabled={missingFile} onClick={save}>
          Save changes
        </Button>
      )}
      <Toast message={toast} onDismiss={dismissToast} />
    </FormPage>
  );
}
