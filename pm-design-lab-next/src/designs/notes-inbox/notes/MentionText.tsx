// Note text with @mentions drawn as blue text on a light blue chip.
import { splitMentions } from './mentions'

type Props = { text: string; mentions?: string[] }

export function MentionText({ text, mentions = [] }: Props) {
  return (
    <>
      {splitMentions(text, mentions).map((part, i) =>
        part.mention ? <span key={i} className="rounded bg-info-50 px-1 py-0.5 text-info-500">{part.text}</span> : <span key={i}>{part.text}</span>,
      )}
    </>
  )
}
