// Note text with @mentions drawn as blue text on a light blue chip.
import { splitMentions } from './mentions'

type Props = { text: string; mentions?: string[] }

/** Classes of a mention chip (also used to measure text in ClampedText) */
export const mentionClass = 'rounded bg-info-50 px-1 py-0.5 text-info-500 [box-decoration-break:clone]'

export function MentionText({ text, mentions = [] }: Props) {
  return (
    <>
      {splitMentions(text, mentions).map((part, i) =>
        part.mention ? <span key={i} className={mentionClass}>{part.text}</span> : <span key={i}>{part.text}</span>,
      )}
    </>
  )
}
