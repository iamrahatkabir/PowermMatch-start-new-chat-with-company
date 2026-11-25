'use client'
/**
 * Version G composer: as simple as chat. Just type and send — it replies to the newest email in the
 * conversation, so the subject is filled in for you ("RE: …"). Click the subject to change it,
 * or "New email" to start a fresh subject. Attach with the paperclip or drop files on the box.
 * Ctrl/⌘ + Enter sends.
 *
 * Props:     to { name, email }, lastEmail? ({ subject }), replyTo? ({ subject }), disabled
 * Callbacks: onSend({ subject, body, attachments }) · onCancelReply()
 */
import { useEffect, useRef, useState } from 'react'
import { Paperclip, Pencil, Send, X } from 'lucide-react'
import { PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import { FileChips } from './FileChips'
import { replySubject, toAttachment } from './compose'
import type { DragEvent } from 'react'
import type { Attachment } from '@/mock/inbox-types'

type Props = {
  to: { name?: string; email?: string }
  lastEmail?: { subject?: string } | null
  replyTo?: { subject?: string } | null
  disabled?: boolean
  onSend?: (email: { subject: string; body: string; attachments: Attachment[] }) => void
  onCancelReply?: () => void
}

export function EmailComposerQuick({ to, lastEmail, replyTo, disabled, onSend, onCancelReply }: Props) {
  const [body, setBody] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [customSubject, setCustomSubject] = useState<string | null>(null) // null = automatic "RE: …"
  const [editing, setEditing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [focusSubject, setFocusSubject] = useState(0) // bumped to focus the subject input after it renders
  const fileInput = useRef<HTMLInputElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const subjectInput = useRef<HTMLInputElement>(null)

  const replyingTo = replyTo ?? lastEmail
  const subject = customSubject ?? (replyingTo ? replySubject(replyingTo.subject!) : '')
  const canSend = !disabled && body.trim() && subject.trim()

  // Reply on a specific email → use its subject and focus the text (not on first render, like a Vue watch)
  const prevReplyTo = useRef(replyTo)
  useEffect(() => {
    if (prevReplyTo.current === replyTo) return
    prevReplyTo.current = replyTo
    if (!replyTo) return
    setCustomSubject(null)
    setEditing(false)
    textarea.current?.focus()
  }, [replyTo])

  useEffect(() => {
    if (focusSubject) subjectInput.current?.focus()
  }, [focusSubject])

  function editSubject(fresh = false) {
    setCustomSubject(fresh ? '' : subject)
    setEditing(true)
    setFocusSubject((n) => n + 1)
  }
  function autoSubject() {
    setCustomSubject(null)
    setEditing(false)
  }
  const addFiles = (files: FileList) => {
    const list = [...files].map(toAttachment)
    setAttachments((a) => [...a, ...list])
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }
  function submit() {
    if (!canSend) return
    onSend?.({ subject: subject.trim(), body: body.trim(), attachments })
    setBody('')
    setAttachments([])
    autoSubject()
    onCancelReply?.()
  }

  return (
    <div
      className={cx('relative px-4 pb-3 pt-2.5', disabled && 'pointer-events-none opacity-40')}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { if (e.target === e.currentTarget) setDragging(false) }}
      onDrop={onDrop}
    >
      {/* Subject: automatic, click to change */}
      <div className="flex h-7 items-center gap-2 text-xs text-gray-500">
        {editing || !replyingTo ? (
          <>
            <input
              ref={subjectInput}
              value={subject}
              placeholder="Subject"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
              onChange={(e) => setCustomSubject(e.target.value)}
            />
            {replyingTo && <button type="button" className="flex shrink-0 items-center gap-1 hover:text-gray-900" title="Use the reply subject" onClick={autoSubject}><X size={13} />Back to reply</button>}
          </>
        ) : (
          <>
            <button type="button" className="flex min-w-0 items-center gap-1.5 rounded-md px-1 -mx-1 hover:bg-gray-100" title="Change subject" onClick={() => editSubject()}>
              <span className="min-w-0 truncate font-medium text-gray-700">{subject}</span>
              <Pencil size={12} className="shrink-0" />
            </button>
            <button type="button" className="ml-auto shrink-0 font-medium hover:text-gray-900" onClick={() => editSubject(true)}>New email</button>
          </>
        )}
      </div>

      <textarea
        ref={textarea}
        value={body}
        rows={3}
        placeholder={`Write an email to ${to.name?.split(' ')[0] ?? ''}`}
        className="mt-1 block w-full resize-none bg-transparent text-sm leading-6 text-gray-900 outline-none"
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            submit()
          }
        }}
      />
      <FileChips attachments={attachments} className="mb-2" onRemove={(id) => setAttachments((list) => list.filter((a) => a.id !== id))} />

      <div className="flex items-center gap-2 text-gray-500">
        <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { addFiles(e.target.files!); e.target.value = '' }} />
        <button type="button" className="-ml-1.5 flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach files" onClick={() => fileInput.current!.click()}><Paperclip size={16} /></button>
        <span className="ml-auto text-xs text-gray-400">Ctrl + Enter to send</span>
        <PmButton size="sm" disabled={!canSend} onClick={submit}>Send <Send size={14} /></PmButton>
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/90 text-sm font-medium text-gray-700">
          Drop files to attach
        </div>
      )}
    </div>
  )
}
