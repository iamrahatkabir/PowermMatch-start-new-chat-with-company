import { computed, inject, provide, reactive } from 'vue'
import { agents, clientCompanies, conversations, notificationSettings, threads } from '@/mock'

// PROTOTYPE ONLY — fake in-memory inbox so the screens are clickable. In production this is the
// real API/store. Each version calls provideInbox() once; parts call useInbox().
const KEY = Symbol('inbox')
const me = agents.find((a) => a.id === 'ls')
let n = 0
const uid = () => `x${++n}`

export const companyById = (id) => clientCompanies.find((c) => c.id === id)
export const contactOf = (company, id) => company?.contacts.find((p) => p.id === id)

export function provideInbox() {
  const state = reactive({
    conversations: structuredClone(conversations),
    threads: structuredClone(threads),
    selectedId: conversations[0].id,
    menuOpen: true,
    view: 'inbox-all', // 'inbox-all' (conversations) | 'inbox-notifications' (settings)
    notificationSettings: { ...notificationSettings },
  })
  for (const c of state.conversations) {
    state.threads[c.id] ??= [{ id: uid(), type: 'message', dir: 'in', channel: c.channel, author: c.name, time: c.time, text: c.preview }]
  }

  const selected = computed(() => state.conversations.find((c) => c.id === state.selectedId))
  const company = computed(() => companyById(selected.value?.companyId))
  const currentContact = computed(() => contactOf(company.value, selected.value?.currentContactId))

  function select(id) {
    state.selectedId = id
    const c = state.conversations.find((x) => x.id === id)
    if (c) c.unread = 0
  }

  function openNew(conv, firstLine) {
    state.conversations.unshift(conv)
    state.threads[conv.id] = [{ id: uid(), type: 'system', text: firstLine }]
    return state.conversations[0]
  }

  function switchContact(conv, contactId) {
    if (conv.currentContactId === contactId) return
    conv.currentContactId = contactId
    state.threads[conv.id].push({ id: uid(), type: 'system', text: `Conversation switched to ${contactOf(companyById(conv.companyId), contactId).name}` })
  }

  // The core flow: talk to a contact person → the chat opens under the company's name.
  function startWithContact(companyId, contactId) {
    let conv = state.conversations.find((c) => c.companyId === companyId)
    const co = companyById(companyId)
    if (!conv) {
      const p = contactOf(co, contactId)
      conv = openNew(
        { id: `cv-${companyId}`, kind: 'company', companyId, currentContactId: contactId, name: co.name, channel: 'chat', preview: `Conversation started with ${p.name}`, time: 'Now', unread: 0, assignedToMe: true },
        `Conversation started with ${p.name}`,
      )
    } else switchContact(conv, contactId)
    select(conv.id)
    state.menuOpen = false
  }

  function startWithPerson(person, kind) {
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
  function handleCallback(conv, channel) {
    if (conv.callback && REACH_OUT.includes(channel)) conv.callback = null
  }

  function send(text, channel) {
    const conv = selected.value
    state.threads[conv.id].push({ id: uid(), type: 'message', dir: 'out', channel, author: me.name, authorPhoto: me.photo, time: 'Now', text })
    conv.preview = text
    conv.time = 'Now'
    handleCallback(conv, channel)
  }

  function call() {
    const conv = selected.value
    state.threads[conv.id].push({ id: uid(), type: 'event', dir: 'out', icon: 'outgoing', text: 'Outbound call', author: me.name, authorPhoto: me.photo, time: 'Now' })
    conv.channel = 'call'
    conv.preview = 'Outbound call'
    conv.time = 'Now'
    handleCallback(conv, 'call')
  }

  const store = { state, selected, company, currentContact, select, switchContact, startWithContact, startWithPerson, send, call }
  provide(KEY, store)
  return store
}

export const useInbox = () => inject(KEY)
