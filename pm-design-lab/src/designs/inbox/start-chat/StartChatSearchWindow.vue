<script setup>
/**
 * VERSION D — Search window with preview
 * A centered window: results on the left, a preview of the highlighted result on the right
 * (phone, the company the chat opens under, colleagues). ↑ ↓ to move, Enter to start, Esc closes.
 *
 * Props:  companies, candidates, applicants   (shapes: see README.md)
 * Events: select-contact(companyId, contactId), select-person(person, kind), close()
 * Choosing a company without picking a contact uses its first contact person.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { MessageCircle, Phone, Search, X } from 'lucide-vue-next'
import { searchDirectory } from './search'
import MenuSection from './ui/MenuSection.vue'
import MenuRow from './ui/MenuRow.vue'
import EntityAvatar from './ui/EntityAvatar.vue'

const props = defineProps({
  companies: { type: Array, required: true },
  candidates: { type: Array, required: true },
  applicants: { type: Array, required: true },
})
const emit = defineEmits(['select-contact', 'select-person', 'close'])

const query = ref('')
const activeIndex = ref(0)
const input = ref()
onMounted(() => input.value?.focus())

const results = computed(() => searchDirectory(query.value, props))
const sections = computed(() =>
  [
    { title: 'Contact person', rows: results.value.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p })) },
    { title: 'Company', rows: results.value.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, company: c })) },
    { title: 'Candidate', rows: results.value.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
    { title: 'Applicant', rows: results.value.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
  ].filter((s) => s.rows.length),
)
const allRows = computed(() => sections.value.flatMap((s) => s.rows))
const active = computed(() => allRows.value[activeIndex.value])
watch(query, () => (activeIndex.value = 0))

const avatarOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })
const companyOf = (contact) => props.companies.find((c) => c.id === contact.companyId)

function start(row = active.value, contactId) {
  if (!row) return
  if (row.kind === 'contact') emit('select-contact', row.contact.companyId, row.contact.id)
  else if (row.kind === 'company') emit('select-contact', row.company.id, contactId ?? row.company.contacts[0].id)
  else emit('select-person', row.person, row.kind)
}
function onKeydown(e) {
  if (e.key === 'ArrowDown') activeIndex.value = Math.min(activeIndex.value + 1, allRows.value.length - 1)
  else if (e.key === 'ArrowUp') activeIndex.value = Math.max(activeIndex.value - 1, 0)
  else if (e.key === 'Enter') start()
  else return
  e.preventDefault()
}
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-start justify-center bg-gray-900/40 px-4 pt-[12vh]" @click.self="emit('close')">
    <div class="flex h-[min(520px,76vh)] w-[760px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" @keydown="onKeydown">
      <div class="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <Search :size="18" class="text-gray-500" />
        <input ref="input" v-model="query" placeholder="Start new conversation — search contact persons, candidates, companies" class="input-text flex-1 bg-transparent text-sm text-gray-900 outline-none" />
        <button type="button" class="flex size-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100" title="Close (Esc)" @click="emit('close')"><X :size="16" /></button>
      </div>

      <div class="flex min-h-0 flex-1">
        <!-- Results -->
        <div class="w-[340px] shrink-0 overflow-y-auto border-r border-gray-200 px-2 pb-2">
          <template v-for="s in sections" :key="s.title">
            <MenuSection :title="s.title" :count="s.rows.length" />
            <MenuRow
              v-for="r in s.rows"
              :key="r.key"
              :entity="avatarOf(r)"
              :subtitle="r.subtitle"
              :query="query"
              :active="active?.key === r.key"
              @mouseenter="activeIndex = allRows.indexOf(r)"
              @click="start(r)"
            />
          </template>
          <p v-if="!allRows.length" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
        </div>

        <!-- Preview of the highlighted result -->
        <div v-if="active" class="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
          <div class="flex items-center gap-4">
            <EntityAvatar v-bind="avatarOf(active)" :size="56" />
            <div class="min-w-0">
              <div class="truncate text-lg font-semibold text-gray-900">{{ active.name }}</div>
              <div class="text-sm text-gray-500">{{ active.kind === 'contact' ? `Contact person • ${active.contact.role}` : active.subtitle }}</div>
            </div>
          </div>

          <!-- Contact person: phone, the company the chat opens under, colleagues -->
          <template v-if="active.kind === 'contact'">
            <div class="mt-5 flex items-center gap-2 text-sm text-gray-600"><Phone :size="15" />{{ active.contact.phone }}</div>
            <div class="mt-5 rounded-xl border border-gray-200 p-4">
              <div class="mb-3 text-xs font-medium text-gray-500">Chat opens under</div>
              <div class="flex items-center gap-3">
                <EntityAvatar type="company" :logo="active.contact.companyLogo" :size="36" />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ active.contact.company }}</div>
                  <div class="text-xs text-gray-500">{{ companyOf(active.contact).contractsLabel }}</div>
                </div>
              </div>
              <div v-if="companyOf(active.contact).contacts.length > 1" class="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                Other contact persons:
                <span class="text-gray-700">{{ companyOf(active.contact).contacts.filter((p) => p.id !== active.contact.id).map((p) => p.name).join(', ') }}</span>
              </div>
            </div>
          </template>

          <!-- Company: choose who to talk to -->
          <div v-else-if="active.kind === 'company'" class="mt-5">
            <div class="mb-2 text-xs font-medium text-gray-500">Contact persons</div>
            <div class="flex flex-col gap-2">
              <div v-for="p in active.company.contacts" :key="p.id" class="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <EntityAvatar type="contact" :name="p.name" :size="32" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ p.name }}</div>
                  <div class="text-xs text-gray-500">{{ p.role }}</div>
                </div>
                <PmButton size="sm" variant="secondary" @click="start(active, p.id)"><MessageCircle :size="14" />Chat</PmButton>
              </div>
            </div>
          </div>

          <div class="mt-auto flex items-center gap-3 pt-6">
            <PmButton @click="start()">
              <MessageCircle :size="16" />
              {{ active.kind === 'company' ? 'Start chat' : `Start chat with ${active.name.split(' ')[0]}` }}
            </PmButton>
            <span class="text-xs text-gray-400">↑ ↓ to move · Enter to start</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
