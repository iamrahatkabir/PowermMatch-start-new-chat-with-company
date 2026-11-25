'use client'
/**
 * Full email text with clickable links, plus earlier quoted text behind a ••• button.
 * Props: body?, quoted?, className?
 */
import { Fragment, useState } from 'react'
import { Ellipsis } from 'lucide-react'
import { cx } from '@/lib/cx'

const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
const href = (t: string) => (t.startsWith('http') ? t : `https://${t}`)

export function EmailBody({ body = '', quoted, className }: { body?: string; quoted?: string; className?: string }) {
  const [showQuoted, setShowQuoted] = useState(false)
  const parts = body.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 }))

  return (
    <div className={cx('text-sm leading-6 text-gray-900', className)}>
      {body && (
        <p className="whitespace-pre-line break-words">
          {parts.map((p, i) => (p.link
            ? <a key={i} href={href(p.t)} target="_blank" rel="noopener" className="underline underline-offset-2">{p.t}</a>
            : <Fragment key={i}>{p.t}</Fragment>))}
        </p>
      )}
      {quoted && (
        <>
          <button
            type="button"
            className="mt-3 flex h-5 items-center rounded-md bg-gray-200 px-1.5 text-gray-600 hover:bg-gray-300"
            title={showQuoted ? 'Hide quoted text' : 'Show quoted text'}
            onClick={() => setShowQuoted(!showQuoted)}
          ><Ellipsis size={16} /></button>
          {showQuoted && <p className="mt-2 whitespace-pre-line border-l-2 border-gray-300 pl-3 text-gray-500">{quoted}</p>}
        </>
      )}
    </div>
  )
}
