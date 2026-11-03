<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { MessageCircle, Phone, Search, X } from 'lucide-vue-next'
import { clientCompanies } from '@/mock'
import { applicants, candidates, companyById, contactPersons, matches, provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import MenuSection from './parts/MenuSection.vue'
import MenuRow from './parts/MenuRow.vue'
import EntityAvatar from './parts/EntityAvatar.vue'

// A larger search window: results on the left, a preview of the highlighted result on the right
// (who they are, which company, other contacts) so you know what you're starting before you do.
const inbox = provideInbox()
const query = ref('')
const active = ref(0)
const input = ref()
watch(() => inbox.state.menuOpen, (open) => open && ((query.value = ''), nextTick(() => input.value?.focus())))
onMounted(() => input.value?.focus())

const sections = computed(() => {
  const q = query.value
  return [
    { title: 'Contact person', rows: q.trim() ? contactPersons.filter((p) => matches(q, p.name, p.company)).map((p) => ({ key: `ct-${p.id}`, kind: 'contact', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p })) : [] },
    { title: 'Company', rows: clientCompanies.filter((c) => matches(q, c.name)).map((c) => ({ key: `co-${c.id}`, kind: 'company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, company: c })) },
    { title: 'Candidate', rows: candidates.filter((p) => matches(q, p.name, p.meta)).map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
    { title: 'Applicant', rows: applicants.filter((p) => matches(q, p.name, p.meta)).map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
  ].filter((s) => s.rows.length)
})
const flat = computed(() => sections.value.flatMap((s) => s.rows))
const current = computed(() => flat.value[active.value])
watch(query, () => (active.value = 0))

const entityOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })
const existingContact = (companyId) => inbox.state.conversations.find((c) => c.companyId === companyId)?.currentContactId

function start(r = current.value, contactId) {
  if (!r) return
  if (r.kind === 'contact') inbox.startWithContact(r.contact.companyId, r.contact.id)
  else if (r.kind === 'company') inbox.startWithContact(r.company.id, contactId ?? existingContact(r.company.id) ?? r.company.contacts[0].id)
  else inbox.startWithPerson(r.person, r.kind)
}
function onKey(e) {
  if (e.key === 'ArrowDown') active.value = Math.min(active.value + 1, flat.value.length - 1)
  else if (e.key === 'ArrowUp') active.value = Math.max(active.value - 1, 0)
  else if (e.key === 'Enter') start()
  else return
  e.preventDefault()
}
</script>

<template>
  <InboxLayout>
    <template #menu>
      <div class="fixed inset-0 z-40 flex items-start justify-center bg-gray-900/40 px-4 pt-[12vh]" @click.self="inbox.state.menuOpen = false">
        <div class="flex h-[min(520px,76vh)] w-[760px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" @keydown="onKey">
          <div class="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
            <Search :size="18" class="text-gray-500" />
            <input ref="input" v-model="query" placeholder="Start new conversation — search contact persons, candidates, companies" class="input-text flex-1 bg-transparent text-sm text-gray-900 outline-none" />
            <button type="button" class="flex size-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100" title="Close (Esc)" @click="inbox.state.menuOpen = false"><X :size="16" /></button>
          </div>

          <div class="flex min-h-0 flex-1">
            <!-- Results -->
            <div class="w-[340px] shrink-0 overflow-y-auto border-r border-gray-200 px-2 pb-2">
              <template v-for="s in sections" :key="s.title">
                <MenuSection :title="s.title" :count="s.rows.length" />
                <MenuRow
                  v-for="r in s.rows"
                  :key="r.key"
                  :entity="entityOf(r)"
                  :subtitle="r.subtitle"
                  :query="query"
                  :active="current?.key === r.key"
                  @mouseenter="active = flat.indexOf(r)"
                  @click="start(r)"
                />
              </template>
              <p v-if="!flat.length" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
            </div>

            <!-- Preview -->
            <div v-if="current" class="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
              <div class="flex items-center gap-4">
                <EntityAvatar v-bind="entityOf(current)" :size="56" />
                <div class="min-w-0">
                  <div class="truncate text-lg font-semibold text-gray-900">{{ current.name }}</div>
                  <div class="text-sm text-gray-500">{{ current.kind === 'contact' ? `Contact person • ${current.contact.role}` : current.subtitle }}</div>
                </div>
              </div>

              <!-- Contact person: the company it opens under + colleagues -->
              <template v-if="current.kind === 'contact'">
                <div class="mt-5 flex items-center gap-2 text-sm text-gray-600"><Phone :size="15" />{{ current.contact.phone }}</div>
                <div class="mt-5 rounded-xl border border-gray-200 p-4">
                  <div class="mb-3 text-xs font-medium text-gray-500">Chat opens under</div>
                  <div class="flex items-center gap-3">
                    <EntityAvatar type="company" :logo="companyById(current.contact.companyId).logo" :size="36" />
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ current.contact.company }}</div>
                      <div class="text-xs text-gray-500">{{ companyById(current.contact.companyId).contractsLabel }}</div>
                    </div>
                  </div>
                  <div v-if="companyById(current.contact.companyId).contacts.length > 1" class="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    Other contact persons:
                    <span class="text-gray-700">{{ companyById(current.contact.companyId).contacts.filter((p) => p.id !== current.contact.id).map((p) => p.name).join(', ') }}</span>
                  </div>
                </div>
              </template>

              <!-- Company: pick who to talk to -->
              <div v-else-if="current.kind === 'company'" class="mt-5">
                <div class="mb-2 text-xs font-medium text-gray-500">Contact persons</div>
                <div class="flex flex-col gap-2">
                  <div v-for="p in current.company.contacts" :key="p.id" class="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <EntityAvatar type="contact" :name="p.name" :size="32" />
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium text-gray-900">{{ p.name }}</div>
                      <div class="text-xs text-gray-500">{{ p.role }}</div>
                    </div>
                    <PmButton size="sm" variant="secondary" @click="start(current, p.id)"><MessageCircle :size="14" />Chat</PmButton>
                  </div>
                </div>
              </div>

              <div class="mt-auto flex items-center gap-3 pt-6">
                <PmButton @click="start()">
                  <MessageCircle :size="16" />
                  {{ current.kind === 'company' ? 'Start chat' : `Start chat with ${current.name.split(' ')[0]}` }}
                </PmButton>
                <span class="text-xs text-gray-400">↑ ↓ to move · Enter to start</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </InboxLayout>
</template>
