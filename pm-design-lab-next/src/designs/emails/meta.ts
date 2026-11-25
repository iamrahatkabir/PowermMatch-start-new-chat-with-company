import type { DesignMeta } from '@/lab/types'

const meta: DesignMeta = {
  title: 'Emails',
  question: 'Email conversations in the inbox',
  variants: {
    A: 'Replies in a thread panel',
    B: 'Always open, no View details',
    C: 'Counts on top, View details expands below',
    D: 'Cards + Reply / New email',
    E: 'View details expands in place',
    F: 'View details opens a modal',
    G: 'Chat-style: just type to reply',
  },
}

export default meta
