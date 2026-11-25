"use client";
import { useId, useState } from "react";
import { Button } from "@/designs/settings/ui/button";
import { TextArea } from "@/designs/settings/ui/form";
import { Modal } from "@/designs/settings/ui/modal";
/** Simple shape check: something@something.tld, no spaces. */
const looksLikeEmail = (value) => /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/.test(value);
/**
 * Split what was typed into emails. Commas are the documented separator, but
 * new lines, semicolons and spaces work too, since people paste lists.
 * Duplicates (ignoring case) are dropped.
 */
export function parseEmails(text) {
  const seen = new Set();
  const emails = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const email = raw.trim();
    if (!email || seen.has(email.toLowerCase())) continue;
    seen.add(email.toLowerCase());
    emails.push(email);
  }
  return emails;
}
/** "Add members" popup: type one or more emails and send invitations. */
export function InviteMembersModal({ existingEmails, onClose, onInvite }) {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const errorId = useId();
  const emails = parseEmails(text);
  const existing = new Set(existingEmails.map((e) => e.toLowerCase()));
  const invalid = emails.filter((e) => !looksLikeEmail(e));
  const alreadyMembers = emails.filter((e) => looksLikeEmail(e) && existing.has(e.toLowerCase()));
  const canSend = emails.length > 0 && invalid.length === 0 && alreadyMembers.length === 0;
  // Don't flag the address still being typed: only once it's followed by a separator or the box loses focus.
  const stillTyping = typing && !/[\s,;]$/.test(text) ? emails.at(-1) : undefined;
  const shownInvalid = invalid.filter((e) => e !== stillTyping);
  const send = () => {
    if (!canSend) return;
    onInvite(emails);
    onClose();
  };
  const errors = [
    shownInvalid.length > 0 &&
      `${shownInvalid.length === 1 ? "This doesn’t" : "These don’t"} look like an email address: ${shownInvalid.join(", ")}`,
    alreadyMembers.length > 0 &&
      `Already ${alreadyMembers.length === 1 ? "a member" : "members"}: ${alreadyMembers.join(", ")}`,
  ].filter(Boolean);
  return (
    <Modal
      open
      onClose={onClose}
      className="max-w-[520px]"
      title="Add members"
      footer={
        <div className="flex justify-end">
          <Button variant="primary" className="h-10 px-5" disabled={!canSend} onClick={send}>
            Send invitation
          </Button>
        </div>
      }
    >
      <div className="px-6 py-6">
        <TextArea
          data-autofocus
          aria-label="Email addresses"
          aria-invalid={errors.length > 0 || undefined}
          aria-describedby={errors.length > 0 ? errorId : undefined}
          placeholder="Enter email address. e.g., ls@powermatch.dk, pkp@powermatch.dk"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setTyping(true)}
          onBlur={() => setTyping(false)}
          onKeyDown={(e) => {
            // Cmd/Ctrl+Enter sends; plain Enter adds a new line.
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          className={`resize-none placeholder:text-[14px] ${errors.length > 0 ? "border-[#fda29b] focus:border-error-500" : ""}`}
        />
        {errors.length > 0 ? (
          <div id={errorId} role="alert" className="mt-2 space-y-1 text-[13px] text-error-500">
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[15px] text-[#475467]">
            Separate emails with commas to invite multiple people.
            {emails.length > 1 && ` ${emails.length} people will be invited.`}
          </p>
        )}
      </div>
    </Modal>
  );
}
