// Plain-JS helpers for the simple email versions (no Vue).
import { isImage } from '../attachments'

// "RE: RE: Hello" → "RE: Hello"
export const replySubject = (subject) => `RE: ${subject.replace(/^(re:\s*)+/i, '')}`

let n = 0
// A picked File → the attachment shape the email components show ({ id, name, size, url? }).
// Images get a local object URL so the sent email can show the thumbnail. A real app uploads the file instead.
export function toAttachment(file) {
  const a = { id: `up${++n}`, name: file.name, size: file.size }
  if (isImage(a)) a.url = URL.createObjectURL(file)
  return a
}

// Split text into parts, marking links like pmatch.dk/p/dianne so they can be rendered as <a>
const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
export const linkify = (text = '') => text.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 }))
export const href = (t) => (t.startsWith('http') ? t : `https://${t}`)

// "Dianne Russell <dianne@…>" → "Dianne Russell"
export const nameOf = (address = '') => address.replace(/\s*<.*>$/, '')
export const initials = (name = '') => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
