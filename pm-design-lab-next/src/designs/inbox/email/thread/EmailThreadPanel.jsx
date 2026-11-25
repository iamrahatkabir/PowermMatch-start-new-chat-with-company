'use client'
/**
 * Version A: right-hand "Thread" panel for one email thread (like the notes thread).
 * The first email on top, then "N replies" and every reply (avatar, name • time, text, files),
 * and a reply box at the bottom. Replies keep the thread's subject ("RE: …"), so there is no subject field.
 *
 * Props:     root { subject, body, from?, to?, author, authorPhoto?, time, attachments? },
 *            replies [{ id, author, authorPhoto?, time, body, attachments? }], disabled?
 * Callbacks: onClose() · onSend({ body, attachments }) · onDownload(file)
 */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Paperclip, Reply, Send, X } from 'lucide-react'
import { PmAvatar, PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import { EmailAttachments } from '../EmailAttachments'
import { ImagePreview } from '../ImagePreview'
import { FileChips } from '../simple/FileChips'
import { isAvailable, isImage } from '../attachments'
import { href, linkify, toAttachment } from '../simple/compose'

const Linkified = ({ text }) => linkify(text).map((p, i) => (p.link
  ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
  : <Fragment key={i}>{p.t}</Fragment>))

export function EmailThreadPanel({ root, replies = [], disabled, onClose, onSend, onDownload }) {
  const [body, setBody] = useState('')
  const [attachments, setAttachments] = useState([])
  const fileInput = useRef(null)
  const textarea = useRef(null)
  const scroller = useRef(null)
  const [dragging, setDragging] = useState(false)
  const canSend = !disabled && body.trim()

  // Image preview across the whole thread
  const [preview, setPreview] = useState(null) // { images, index }
  const imagesOf = (list = []) => list.filter((a) => isImage(a) && isAvailable(a))
  const openPreview = (list, index) => setPreview({ images: imagesOf(list), index })

  const addFiles = (files) => {
    const list = [...files].map(toAttachment)
    setAttachments((a) => [...a, ...list])
  }
  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }
  function submit() {
    if (!canSend) return
    onSend?.({ body: body.trim(), attachments })
    setBody('')
    setAttachments([])
  }
  const focusReply = () => textarea.current?.focus()

  // New reply → scroll to it. Another thread opened → start at the top. (Only on changes, not on first render.)
  const prevCount = useRef(replies.length)
  useEffect(() => {
    if (prevCount.current === replies.length) return
    prevCount.current = replies.length
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [replies.length])
  const prevRoot = useRef(root)
  useEffect(() => {
    if (prevRoot.current === root) return
    prevRoot.current = root
    scroller.current?.scrollTo({ top: 0 })
  }, [root])

  return (
    <aside className="hidden w-[340px] shrink-0 flex-col border-l border-gray-200 bg-white xl:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h2 className="text-base font-semibold text-gray-900">Thread</h2>
        <button type="button" className="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50" title="Close" onClick={() => onClose?.()}><X size={18} /></button>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {/* First email */}
        <div className={cx('rounded-2xl px-3.5 py-3 text-sm leading-6 text-gray-900', root.dir === 'out' ? 'bg-info-25' : 'bg-gray-50')}>
          <div className="font-semibold">{root.subject}</div>
          {(root.from || root.to) && (
            <dl className="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
              {root.from && <><dt>From</dt><dd className="truncate text-gray-700">{root.from}</dd></>}
              {root.to && <><dt>To</dt><dd className="truncate text-gray-700">{root.to}</dd></>}
            </dl>
          )}
          {root.body && (
            <p className="mt-2 whitespace-pre-line break-words"><Linkified text={root.body} /></p>
          )}
          {root.attachments?.length > 0 && (
            <EmailAttachments
              attachments={root.attachments}
              small
              stacked
              onDownload={(f) => onDownload?.(f)}
              onPreview={(i) => openPreview(root.attachments, i)}
            />
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
          <PmAvatar name={root.author} src={root.authorPhoto} size={16} />{root.author} • {root.time}
        </div>

        {/* Replies */}
        <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
          {replies.length ? `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : 'No replies yet'}
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="flex flex-col gap-5">
          {replies.map((r) => (
            <div key={r.id} className="group relative flex gap-2.5">
              <PmAvatar name={r.author} src={r.authorPhoto} size={28} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1 text-sm">
                  <span className="truncate font-medium text-gray-900">{r.author}</span>
                  <span className="shrink-0 text-xs text-gray-500">• {r.time}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-line break-words text-sm leading-6 text-gray-700"><Linkified text={r.body} /></p>
                {r.attachments?.length > 0 && (
                  <EmailAttachments
                    attachments={r.attachments}
                    small
                    stacked
                    onDownload={(f) => onDownload?.(f)}
                    onPreview={(i) => openPreview(r.attachments, i)}
                  />
                )}
              </div>
              <button
                type="button"
                className="absolute -top-2 right-0 hidden items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 group-hover:flex"
                onClick={focusReply}
              ><Reply size={13} />Reply</button>
            </div>
          ))}
        </div>
      </div>

      {/* Reply box */}
      <div className="shrink-0 p-4">
        <div
          className={cx('relative rounded-2xl border border-gray-200 bg-white', disabled && 'pointer-events-none opacity-40')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={(e) => { if (e.target === e.currentTarget) setDragging(false) }}
          onDrop={onDrop}
        >
          <textarea
            ref={textarea}
            value={body}
            rows={3}
            placeholder="Reply…"
            className="block w-full resize-none bg-transparent px-3 pt-3 text-sm leading-6 text-gray-900 outline-none"
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <FileChips attachments={attachments} className="mx-3 mb-2" onRemove={(id) => setAttachments((list) => list.filter((a) => a.id !== id))} />
          <div className="flex items-center gap-1 px-2 pb-2 text-gray-500">
            <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach files" onClick={() => fileInput.current.click()}><Paperclip size={16} /></button>
            <PmButton size="sm" variant="secondary" className="ml-auto" disabled={!canSend} onClick={submit}>Send <Send size={14} /></PmButton>
          </div>
          {dragging && (
            <div className="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/90 text-sm font-medium text-gray-700">
              Drop files to attach
            </div>
          )}
        </div>
      </div>

      {preview && (
        <ImagePreview
          index={preview.index}
          onIndexChange={(i) => setPreview((p) => ({ ...p, index: i }))}
          images={preview.images}
          onClose={() => setPreview(null)}
          onDownload={(f) => onDownload?.(f)}
        />
      )}
    </aside>
  )
}
