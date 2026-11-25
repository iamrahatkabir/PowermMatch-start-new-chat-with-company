'use client'
import { createContext, createElement, useContext, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { agents, clientCompanies, conversations, notificationSettings, threads } from '@/mock'
import type { Company, Contact, Conversation, DirectoryPerson, ThreadItem } from '@/mock'
import type { NotificationSettingsValue } from '../notification-settings/NotificationSettings'

export type InboxState = {
  conversations: Conversation[]
  threads: Record<string, ThreadItem[]>
  selectedId: string
  menuOpen: boolean
  view: string
  notificationSettings: NotificationSettingsValue
  emailThreadId: string | null
}

export type InboxOptions = { selectedId?: string; menuOpen?: boolean; init?: (s: InboxState) => void }

export type InboxStore = {
  state: InboxState
  readonly selected: Conversation
  readonly company: Company | undefined
  readonly currentContact: Contact | undefined
  select: (id: string) => void
  switchContact: (conv: Conversation, contactId: string) => void
  startWithContact: (companyId: string, contactId: string) => void
  startWithPerson: (person: DirectoryPerson, kind: 'candidate' | 'applicant') => void
  send: (text: string, channel: string, subject?: string, extra?: Partial<ThreadItem>) => void
  call: () => void
  assignToMe: () => void
  update: (fn: (s: InboxState) => void) => void
  subscribe: (listener: () => void) => () => void
  getVersion: () => number
}

// PROTOTYPE ONLY — fake in-memory inbox so the screens are clickable. In production this is the
// real API/store. Each version creates the store once with useCreateInbox() and wraps the screen in
// <InboxProvider store={…}>; parts call useInbox().
// The state object is mutable: every store function (and update(fn)) changes it in place, then all
// useInbox() subscribers re-render.
const InboxContext = createContext<InboxStore | null>(null)
const me = agents.find((a) => a.id === 'ls')!
let n = 0
const uid = () => `x${++n}`

export const companyById = (id: string | undefined): Company | undefined => clientCompanies.find((c) => c.id === id)
export const contactOf = (company: Company | undefined, id: string | undefined): Contact | undefined => company?.contacts.find((p) => p.id === id)

// options.selectedId: conversation open at start · options.menuOpen: show "Start new conversation" at start
// options.init(state): may mutate the fresh state (e.g. push extra emails)
function createInbox({ selectedId = conversations[0].id, menuOpen = true, init }: InboxOptions = {}): InboxStore {
  const state: InboxState = {
    conversations: structuredClone(conversations),
    threads: structuredClone(threads),
    selectedId,
    menuOpen,
    view: 'inbox-all', // 'inbox-all' (conversations) | 'inbox-notifications' (settings)
    notificationSettings: { ...notificationSettings },
    emailThreadId: null, // emails version A: id of the email whose Thread panel is open
  }
  for (const c of state.conversations) {
    state.threads[c.id] ??= [{ id: uid(), type: 'message', dir: 'in', channel: c.channel, author: c.name, time: c.time, text: c.preview }]
  }
  init?.(state)

  // Subscribers re-render on every change (version counter for useSyncExternalStore)
  const listeners = new Set<() => void>()
  let version = 0
  const notify = () => {
    version++
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  const getVersion = () => version
  // fn(state) mutates, then subscribers re-render
  const update = (fn: (s: InboxState) => void) => {
    fn?.(state)
    notify()
  }
  // Wraps a mutating function so it re-renders subscribers when done
  const action = <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A): R => {
    const r = fn(...args)
    notify()
    return r
  }

  const getSelected = () => state.conversations.find((c) => c.id === state.selectedId)!
  const getCompany = () => companyById(getSelected()?.companyId)
  const getCurrentContact = () => contactOf(getCompany(), getSelected()?.currentContactId)

  function select(id: string) {
    state.selectedId = id
    state.emailThreadId = null
    const c = state.conversations.find((x) => x.id === id)
    if (c) c.unread = 0
  }

  function openNew(conv: Conversation, firstLine: string) {
    state.conversations.unshift(conv)
    state.threads[conv.id] = [{ id: uid(), type: 'system', text: firstLine }]
    return state.conversations[0]
  }

  function switchContact(conv: Conversation, contactId: string) {
    if (conv.currentContactId === contactId) return
    conv.currentContactId = contactId
    state.threads[conv.id].push({ id: uid(), type: 'system', text: `Conversation switched to ${contactOf(companyById(conv.companyId), contactId)!.name}` })
  }

  // The core flow: talk to a contact person → the chat opens under the company's name.
  function startWithContact(companyId: string, contactId: string) {
    let conv = state.conversations.find((c) => c.companyId === companyId)
    const co = companyById(companyId)!
    if (!conv) {
      const p = contactOf(co, contactId)!
      conv = openNew(
        { id: `cv-${companyId}`, kind: 'company', companyId, currentContactId: contactId, name: co.name, channel: 'chat', preview: `Conversation started with ${p.name}`, time: 'Now', unread: 0, assignedToMe: true },
        `Conversation started with ${p.name}`,
      )
    } else switchContact(conv, contactId)
    select(conv.id)
    state.menuOpen = false
  }

  function startWithPerson(person: DirectoryPerson, kind: 'candidate' | 'applicant') {
    let conv = state.conversations.find((c) => c.personId === person.id)
    if (!conv) {
      conv = openNew(
        { id: `cv-${person.id}`, kind, personId: person.id, name: person.name, photo: person.photo, channel: 'chat', preview: `Conversation started with ${person.name}`, time: 'Now', unread: 0, assignedToMe: true },
        `Conversation started with ${person.name}`,
      )
    }
    select(conv.id)
    state.menuOpen = false
  }

  // A "Callback requested" alert stays until a recruiter reaches out: call, chat, SMS or email.
  // Internal notes don't count.
  const REACH_OUT = ['call', 'chat', 'sms', 'email']
  function handleCallback(conv: Conversation, channel: string) {
    if (conv.callback && REACH_OUT.includes(channel)) conv.callback = null
  }

  // extra: email fields (from, to, attachments) copied onto the thread item
  function send(text: string, channel: string, subject?: string, extra: Partial<ThreadItem> = {}) {
    const conv = getSelected()
    state.threads[conv.id].push({ id: uid(), type: 'message', dir: 'out', channel, author: me.name, authorPhoto: me.photo, time: 'Now', text, subject, ...extra })
    conv.preview = subject || text
    conv.time = 'Now'
    handleCallback(conv, channel)
  }

  function call() {
    const conv = getSelected()
    state.threads[conv.id].push({ id: uid(), type: 'event', dir: 'out', icon: 'outgoing', text: 'Outbound call', author: me.name, authorPhoto: me.photo, time: 'Now' })
    conv.channel = 'call'
    conv.preview = 'Outbound call'
    conv.time = 'Now'
    handleCallback(conv, 'call')
  }

  function assignToMe() {
    getSelected().assignedToMe = true
    getSelected().assigneeId = me.id
  }

  return {
    state,
    get selected() { return getSelected() },
    get company() { return getCompany() },
    get currentContact() { return getCurrentContact() },
    select: action(select),
    switchContact: action(switchContact),
    startWithContact: action(startWithContact),
    startWithPerson: action(startWithPerson),
    send: action(send),
    call: action(call),
    assignToMe: action(assignToMe),
    update,
    subscribe,
    getVersion,
  }
}

// Creates the store once per mounted version (options are read on the first render only)
export function useCreateInbox(options?: InboxOptions): InboxStore {
  const ref = useRef<InboxStore | null>(null)
  ref.current ??= createInbox(options)
  return ref.current
}

export function InboxProvider({ store, children }: { store: InboxStore; children?: ReactNode }) {
  return createElement(InboxContext.Provider, { value: store }, children)
}

// Returns the store and re-renders the caller on every change
export function useInbox(): InboxStore {
  const store = useContext(InboxContext)!
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion)
  return store
}
