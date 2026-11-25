'use client'
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { Archive, Check, ChevronDown, ChevronRight, Ellipsis, Link, Mail, MessageCircle, MessageSquareText, Paperclip, Phone, Reply, X, PhoneMissed, PhoneOutgoing, Send, StickyNote, User, Voicemail, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PmAvatar, PmButton } from '@/ds'
import { agents, candidateProfile } from '@/mock'
import { cx } from '@/lib/cx'
import { useInbox } from './useInbox'
import { AudioPlayer } from './AudioPlayer'
import { EntityAvatar } from '../start-chat/ui/EntityAvatar'
import { EmailMessage } from '../email/EmailMessage'
import { fakeDownload } from './fakeDownload'
import { groupReplies as groupEmailReplies } from '../email/thread/threads'
import type { ThreadItem } from '@/mock'
import type { EmailComposerSlotProps, EmailInThreadProps } from '../email/types'

export type ConversationThreadProps = {
  emailComponent?: ComponentType<EmailInThreadProps>
  groupReplies?: boolean
  renderEmailComposer?: (p: EmailComposerSlotProps) => ReactNode
  /** Composer tab open at start (chat · email · sms · note). Default: the conversation's channel. */
  defaultTab?: string
  /** Draws a note (message with channel 'note'). openNoteTab switches the composer to the Note tab. */
  renderNote?: (m: ThreadItem, actions: { openNoteTab: () => void }) => ReactNode
  /** Replaces the Note tab composer. Notes can be saved without being assigned. */
  renderNoteComposer?: (p: { saveNote: (text: string, extra?: Partial<ThreadItem>) => void }) => ReactNode
}

// Email designs can pass their own email component (same props/callbacks as EmailMessage).
// groupReplies (emails version A): replies to an email are hidden here; the first email gets `replies`
// and calls onOpenThread, which opens the Thread panel (state.emailThreadId).
const tabs = [
  { key: 'chat', label: 'Chat', icon: MessageCircle },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'sms', label: 'SMS', icon: MessageSquareText },
  { key: 'note', label: 'Note', icon: StickyNote },
]
const channelIcon: Record<string, LucideIcon> = { chat: MessageCircle, email: Mail, sms: MessageSquareText, call: Phone, missed: Phone, voicemail: Voicemail }
const me = agents.find((a) => a.id === 'ls')!
const sender = { name: me.name, email: 'las@powermatch.dk', phone: '+45 70 20 30 40' }
// Opening a conversation starts at the newest message, with the composer on that conversation's channel
const tabFor: Record<string, string> = { email: 'email', sms: 'sms' }

export function ConversationThread({ emailComponent: EmailComponent = EmailMessage, groupReplies, renderEmailComposer, defaultTab, renderNote, renderNoteComposer }: ConversationThreadProps) {
  const { state, selected, company, currentContact, send, call, assignToMe, update } = useInbox()
  const assignee = selected.assigneeId === null ? null : agents.find((a) => a.id === (selected.assigneeId ?? 'pa'))!
  const thread = state.threads[selected.id]
  const isCompany = selected.kind === 'company'
  const groups = groupReplies ? groupEmailReplies(thread) : null
  // Incoming emails have no author photo in the mock → use the conversation's photo for reply avatars
  const withPhoto = (r: ThreadItem): ThreadItem => ({ ...r, authorPhoto: r.authorPhoto ?? (r.dir === 'in' ? selected.photo : undefined) })
  const threadProps = (m: ThreadItem) => (groups ? { replies: (groups.replies[m.id] ?? []).map(withPhoto) } : {})
  const phone = isCompany ? currentContact?.phone : candidateProfile.phone
  const recipient = (isCompany ? currentContact?.name : selected.name)?.split(' ')[0]

  const [tab, setTab] = useState(() => defaultTab ?? tabFor[selected.channel] ?? 'chat')
  const [draft, setDraft] = useState('')
  const [subject, setSubject] = useState('')
  const [replyTo, setReplyTo] = useState<ThreadItem | null>(null) // email being replied to
  const textarea = useRef<HTMLTextAreaElement>(null)
  const replySubject = replyTo && `RE: ${replyTo.subject!.replace(/^(re:\s*)+/i, '')}`
  const scroller = useRef<HTMLDivElement>(null)

  const isEmail = tab === 'email'
  const canSend = draft.trim() && (!isEmail || replyTo || subject.trim())

  // Focus the textarea after the render that opened the reply
  const focusNext = useRef(false)
  useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    textarea.current?.focus()
  })
  function startReply(email: ThreadItem) {
    setReplyTo(email)
    setTab('email')
    focusNext.current = true
  }

  // Email designs can replace the Email tab's composer (renderEmailComposer prop). It gets
  // to / sender / replyTo / lastEmail (newest email in the thread) / disabled and calls sendEmail({ subject, body, attachments }) and cancelReply().
  const lastEmail = thread.findLast((m) => m.subject) ?? null
  const to = {
    name: isCompany ? currentContact?.name : selected.name,
    email: isCompany ? company?.email : selected.email ?? candidateProfile.email,
  }
  function sendEmail({ subject: s, body, attachments = [] }: Parameters<EmailComposerSlotProps['sendEmail']>[0]) {
    send(body, 'email', s, {
      from: `${sender.name} <${sender.email}>`,
      to: `${to.name} <${to.email}>`,
      attachments,
    })
    setReplyTo(null)
  }

  // Prototype: a retried bounced email "sends" for a moment, then goes through
  function retry(m: ThreadItem) {
    update(() => {
      m.failed = undefined
      m.sending = true
    })
    setTimeout(() => update(() => { m.sending = false }), 1200)
  }

  function submit() {
    if (!canSend) return
    send(draft.trim(), tab, isEmail ? replySubject ?? subject.trim() : undefined)
    setDraft('')
    setSubject('')
    setReplyTo(null)
  }

  // New message → scroll smoothly to the bottom (not on first render, like a non-immediate watch)
  const lastLength = useRef(thread.length)
  useEffect(() => {
    if (lastLength.current === thread.length) return
    lastLength.current = thread.length
    scroller.current?.scrollTo({ top: scroller.current!.scrollHeight, behavior: 'smooth' })
  }, [thread.length])
  // Conversation changed (and on mount) → composer on its channel, start at the newest message
  const lastSelectedId = useRef<string | null>(null)
  useEffect(() => {
    if (lastSelectedId.current !== null) {
      setTab(defaultTab ?? tabFor[selected.channel] ?? 'chat')
      setReplyTo(null)
    }
    lastSelectedId.current = selected.id
    scroller.current?.scrollTo({ top: scroller.current!.scrollHeight })
  }, [selected.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {/* Header: company conversations always carry the company's name */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-5">
        <EntityAvatar type={isCompany ? 'company' : 'person'} name={selected.name} photo={selected.photo} logo={company?.logo} size={36} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">{selected.name}</div>
          <div className="text-xs text-gray-500">{phone}</div>
        </div>
        <button type="button" className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-2.5 text-sm text-gray-900 hover:bg-gray-50">
          {assignee ? (
            <><span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">{assignee.initials}</span>{assignee.name}</>
          ) : (
            <><User size={16} className="ml-1 text-gray-400" /><span className="text-gray-400">Unassigned</span></>
          )}
          <ChevronDown size={16} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-1 text-gray-600">
          <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="More"><Ellipsis size={18} /></button>
          <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Call" onClick={() => call()}><Phone size={18} /></button>
          <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Archive"><Archive size={18} /></button>
        </div>
      </div>

      {/* Callback requested: stays until a recruiter calls, chats, texts or emails (not notes) */}
      {selected.callback && (
        <div className="flex shrink-0 items-center gap-2 border-b border-brand-light bg-brand-bg px-6 py-2.5 text-sm">
          <PhoneMissed size={16} className="text-error-500" />
          <span className="font-medium text-gray-900">Callback requested</span>
          <span className="text-gray-600">• Missed call at {selected.callback.missedAt}</span>
        </div>
      )}

      {/* Messages */}
      <div ref={scroller} className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        {thread.map((m) => {
          if (groups?.isReply.has(m.id)) return null
          if (m.type === 'system') {
            return (
              <div key={m.id} className="flex items-center gap-3 text-xs text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />{m.text}<span className="h-px flex-1 bg-gray-200" />
              </div>
            )
          }

          if (m.type === 'missed' || m.type === 'event') {
            return (
              <div key={m.id} className={cx('flex flex-col gap-1.5', m.dir === 'out' ? 'items-end self-end' : 'items-start')}>
                <div className={cx('flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-gray-900', m.dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
                  {m.type === 'missed' ? <PhoneMissed size={18} className="text-error-500" /> : <PhoneOutgoing size={18} className="text-gray-600" />}
                  {m.text}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  {m.authorPhoto && <PmAvatar name={m.author} src={m.authorPhoto} size={16} />}
                  {m.author && <>{m.author} • </>}{m.time}
                </div>
              </div>
            )
          }

          if (m.type === 'message' && m.channel === 'note' && renderNote) {
            return <div key={m.id} className="flex flex-col">{renderNote(m, { openNoteTab: () => setTab('note') })}</div>
          }

          // Emails are full width minus a 48px gap on the opposite side; chat/SMS bubbles stay at 70%
          if (m.type === 'message') {
            const ChannelIcon = channelIcon[m.channel!] ?? MessageCircle
            return (
              <div key={m.id} className={cx('flex flex-col gap-1.5', m.dir === 'out' ? 'items-end self-end' : 'items-start', m.subject ? 'w-[calc(100%-48px)]' : 'max-w-[70%]')}>
                {m.subject ? (
                  <EmailComponent
                    subject={m.subject}
                    body={m.text}
                    dir={m.dir}
                    from={m.from}
                    to={m.to}
                    quoted={m.quoted}
                    attachments={m.attachments}
                    failed={m.failed}
                    sending={m.sending}
                    {...threadProps(m)}
                    onOpenThread={() => update((s) => { s.emailThreadId = m.id })}
                    onReply={() => startReply(m)}
                    onDownload={fakeDownload}
                    onRetry={() => retry(m)}
                  />
                ) : (
                  <div className={cx('whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900', m.dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>{m.text}</div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <ChannelIcon size={13} />
                  {m.bySystem ? <Zap size={13} /> : m.authorPhoto ? <PmAvatar name={m.author} src={m.authorPhoto} size={16} /> : null}
                  {m.author} • {m.time}
                </div>
              </div>
            )
          }

          const CardIcon = m.type === 'call' ? PhoneOutgoing : Voicemail
          return (
            <div key={m.id} className={cx('flex w-full max-w-[560px] flex-col gap-1.5', m.type === 'call' && 'items-end self-end')}>
              <div className={cx('w-full rounded-2xl p-4', m.type === 'call' ? 'bg-info-25' : 'bg-gray-50')}>
                <button type="button" className="mb-3 flex w-full items-center gap-2 text-sm text-gray-900">
                  <CardIcon size={18} className="text-gray-600" />{m.title}
                  <ChevronRight size={16} className="ml-auto text-gray-500" />
                </button>
                <AudioPlayer position={m.position} duration={m.duration} progress={m.progress} />
                <p className="mt-3 text-[13px] leading-5 text-gray-700">{m.summary}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {m.authorPhoto && <PmAvatar name={m.author} src={m.authorPhoto} size={16} />}
                {m.author && <>{m.author} • </>}{m.time}
              </div>
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="shrink-0 px-6 pb-6">
        <div className="relative rounded-2xl border border-gray-200 bg-white">
          <div className="flex gap-1 border-b border-gray-100 px-3">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cx('flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px]', t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-500')}
                onClick={() => setTab(t.key)}
              >
                <t.icon size={15} />{t.label}
              </button>
            ))}
          </div>
          {tab === 'note' && renderNoteComposer ? (
            renderNoteComposer({ saveNote: (text, extra) => send(text, 'note', undefined, extra) })
          ) : isEmail && renderEmailComposer ? (
            renderEmailComposer({
              to,
              sender,
              replyTo,
              lastEmail,
              disabled: !selected.assignedToMe,
              sendEmail,
              cancelReply: () => setReplyTo(null),
            })
          ) : (
            <>
              {/* Replying: fixed "RE:" subject with a reply icon; ✕ goes back to a new email */}
              {isEmail && replyTo ? (
                <div className="mx-4 mt-2 flex items-center gap-2 border-b border-gray-200 py-2.5 text-sm text-gray-500">
                  <Reply size={16} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{replySubject}</span>
                  <button type="button" className="flex size-6 items-center justify-center rounded-md hover:bg-gray-100" title="Cancel reply" onClick={() => setReplyTo(null)}><X size={16} /></button>
                </div>
              ) : isEmail ? (
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!selected.assignedToMe}
                  placeholder="Subject"
                  className="mx-4 mt-2 block w-[calc(100%-2rem)] border-b border-gray-200 bg-transparent py-2.5 text-sm text-gray-900 outline-none disabled:opacity-40"
                />
              ) : null}
              <textarea
                ref={textarea}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={isEmail ? 4 : 3}
                disabled={!selected.assignedToMe}
                placeholder={isEmail ? 'Write description here' : `Write a message to ${recipient}`}
                className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 outline-none disabled:opacity-40"
                onKeyDown={(e) => {
                  // Enter (no modifiers) sends in chat/SMS/note; email keeps Enter for new lines
                  if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || isEmail) return
                  e.preventDefault()
                  submit()
                }}
              />
              <div className={cx('flex items-center gap-2 px-3 pb-3 text-gray-500', !selected.assignedToMe && 'opacity-40')}>
                <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach file"><Paperclip size={16} /></button>
                <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Templates"><Zap size={16} /></button>
                {isEmail && <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Insert link"><Link size={16} /></button>}
                <PmButton size="sm" variant="secondary" className="ml-auto"><Check size={15} />Wrap-up</PmButton>
                <PmButton size="sm" variant="secondary" disabled={!canSend} onClick={submit}>Send <Send size={14} /></PmButton>
              </div>
            </>
          )}

          {!selected.assignedToMe && !(tab === 'note' && renderNoteComposer) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/40">
              <PmButton size="lg" onClick={() => assignToMe()}>Assign to me</PmButton>
              <p className="text-sm text-gray-700">Click the button to assign this conversation to yourself.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
