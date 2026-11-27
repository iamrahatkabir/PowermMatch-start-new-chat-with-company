// Note text with @mentions drawn as blue text on a light blue chip. Names in `links` (tagged companies /
// candidates) are buttons that open their profile.
import { splitMentions } from './mentions'

type Props = {
  text: string
  mentions?: string[]
  /** Name → open that profile (tags). Those chips are clickable. */
  links?: Record<string, () => void>
}

/** Classes of a mention chip (also used to measure text in ClampedText) */
export const mentionClass = 'rounded bg-info-50 px-1 py-0.5 text-info-500 [box-decoration-break:clone]'

export function MentionText({ text, mentions = [], links }: Props) {
  return (
    <>
      {splitMentions(text, mentions).map((part, i) =>
        part.mention && links?.[part.text] ? (
          // Inline span (not <button>, which is a box and grows taller) so it's exactly the size of a colleague mention
          <span
            key={i}
            role="button"
            tabIndex={0}
            className={`${mentionClass} cursor-pointer outline-none hover:bg-info-200 hover:text-info-700 focus-visible:bg-info-200`}
            title={`Open ${part.text}`}
            onClick={(e) => { e.stopPropagation(); links[part.text]() }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); links[part.text]() } }}
          >
            {part.text}
          </span>
        ) : part.mention ? <span key={i} className={mentionClass}>{part.text}</span> : <span key={i}>{part.text}</span>,
      )}
    </>
  )
}
