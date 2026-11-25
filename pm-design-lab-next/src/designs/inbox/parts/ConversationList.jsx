'use client'
import { useEffect } from 'react'
import { ArrowUpNarrowWide, Building2, ChevronDown, Mail, MessageCircle, MessageSquareText, Phone, PhoneMissed, Plus, Star, User, UserPlus, Voicemail } from 'lucide-react'
import { CONVERSATION_KIND } from '@/mock'
import { cx } from '@/lib/cx'
import { companyById, useInbox } from './useInbox'
import { EntityAvatar } from '../start-chat/ui/EntityAvatar'

const kindIcon = { candidate: User, applicant: UserPlus, company: Building2 }
const channelIcon = { call: Phone, missed: PhoneMissed, email: Mail, chat: MessageCircle, sms: MessageSquareText, voicemail: Voicemail }

// menu = the "Start new conversation" menu (node), shown while state.menuOpen
export function ConversationList({ menu }) {
  const { state, select, update } = useInbox()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && update((s) => { s.menuOpen = false })
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [update])

  return (
    <section className="relative flex w-80 shrink-0 flex-col border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <button type="button" className="flex items-center gap-1.5 text-base font-semibold text-gray-900">
          All conversations <ChevronDown size={18} className="text-gray-500" />
        </button>
        <button type="button" className="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Sort"><ArrowUpNarrowWide size={18} /></button>
        <button
          type="button"
          className={cx('flex size-8 items-center justify-center rounded-lg text-gray-700', state.menuOpen ? 'bg-gray-100' : 'hover:bg-gray-50')}
          title="Start new conversation"
          onClick={() => update((s) => { s.menuOpen = !s.menuOpen })}
        >
          <Plus size={18} />
        </button>
      </div>

      {state.menuOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => update((s) => { s.menuOpen = false })} />
          {menu}
        </>
      )}

      <ul className="flex-1 overflow-y-auto">
        {state.conversations.map((c) => {
          const KindIcon = kindIcon[c.kind]
          const ChannelIcon = channelIcon[c.channel]
          return (
            <li
              key={c.id}
              className={cx('flex cursor-pointer gap-3 px-4 py-3.5', c.id === state.selectedId ? 'bg-gray-50' : 'hover:bg-gray-25')}
              onClick={() => select(c.id)}
            >
              <EntityAvatar
                type={c.kind === 'company' ? 'company' : 'person'}
                name={c.name}
                photo={c.photo}
                logo={companyById(c.companyId)?.logo}
                className={c.state && 'ring-3 ring-success-200'}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className={cx('truncate text-sm text-gray-900', c.unread && 'font-semibold')}>{c.name}</span>
                  {CONVERSATION_KIND[c.kind] && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">
                      <KindIcon size={11} />{CONVERSATION_KIND[c.kind].label}
                    </span>
                  )}
                  <span className={cx('ml-auto shrink-0 text-xs', c.state === 'waiting' ? 'font-medium text-warning-500' : 'text-gray-500')}>
                    {c.state === 'waiting' ? 'Waiting…' : c.time}
                  </span>
                </span>
                <span className={cx('mt-1 flex items-center gap-1.5 text-[13px]', c.callback ? 'text-error-700' : 'text-gray-600')}>
                  {ChannelIcon && <ChannelIcon size={14} className={cx('shrink-0', c.channel === 'missed' && 'text-error-500')} />}
                  <span className="truncate">{c.callback ? 'Missed call • Callback requested' : c.preview}</span>
                  {c.starred && <Star size={14} className="ml-auto shrink-0 fill-warning-500 text-warning-500" />}
                  {!!c.unread && <span className={cx('shrink-0 rounded-full bg-error-50 px-1.5 text-xs font-medium leading-5 text-error-500', !c.starred && 'ml-auto')}>{c.unread}</span>}
                </span>
                {c.state && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-success-200 bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 hover:bg-success-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={13} />Pick up
                  </button>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
