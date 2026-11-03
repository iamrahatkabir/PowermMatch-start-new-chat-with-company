<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { clientCompanies } from '@/mock'
import { applicants, candidates, contactPersons, matches, provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import MenuShell from './parts/MenuShell.vue'
import MenuRow from './parts/MenuRow.vue'

// One flat list with filter tabs. "Contact persons" tab only exists while searching.
// Companies expand in place to show their contact persons (no sub-page).
const inbox = provideInbox()
const query = ref('')
const tab = ref('all')
const expanded = ref(null)
watch(() => inbox.state.menuOpen, () => ((query.value = ''), (tab.value = 'all'), (expanded.value = null)))

const searching = computed(() => !!query.value.trim())
const rows = computed(() => [
  ...(searching.value
    ? contactPersons.filter((p) => matches(query.value, p.name, p.company)).map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', entity: { type: 'contact', name: p.name }, subtitle: `${p.role} • ${p.company}`, go: () => inbox.startWithContact(p.companyId, p.id) }))
    : []),
  ...clientCompanies.filter((c) => matches(query.value, c.name)).map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', entity: { type: 'company', name: c.name, logo: c.logo }, subtitle: c.contractsLabel, company: c, go: () => (expanded.value = expanded.value === c.id ? null : c.id) })),
  ...candidates.filter((p) => matches(query.value, p.name, p.meta)).map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', entity: p, subtitle: p.meta, go: () => inbox.startWithPerson(p, 'candidate') })),
  ...applicants.filter((p) => matches(query.value, p.name, p.meta)).map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', entity: p, subtitle: p.meta, go: () => inbox.startWithPerson(p, 'applicant') })),
])
const count = (k) => rows.value.filter((r) => k === 'all' || r.kind === k).length
const tabs = computed(() =>
  [
    { key: 'all', label: 'All' },
    ...(searching.value && count('contact') ? [{ key: 'contact', label: 'Contact persons' }] : []),
    { key: 'company', label: 'Companies' },
    { key: 'candidate', label: 'Candidates' },
    { key: 'applicant', label: 'Applicants' },
  ].map((t) => ({ ...t, count: count(t.key) })),
)
watch(tabs, (t) => !t.some((x) => x.key === tab.value) && (tab.value = 'all'))
const shown = computed(() => rows.value.filter((r) => tab.value === 'all' || r.kind === tab.value))
</script>

<template>
  <InboxLayout>
    <template #menu>
      <MenuShell v-model="query">
        <template #below-search><PmTabs v-model="tab" :tabs="tabs" class="-mx-1 mt-2 [&>button]:text-[13px]" /></template>

        <template v-for="r in shown" :key="r.key">
          <MenuRow :entity="r.entity" :subtitle="r.subtitle" :query="query" @click="r.go()">
            <template #end>
              <span v-if="tab === 'all'" class="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{{ r.label }}</span>
              <ChevronDown v-if="r.kind === 'company'" :size="16" class="shrink-0 text-gray-400 transition-transform" :class="expanded === r.company.id && 'rotate-180'" />
            </template>
          </MenuRow>
          <div v-if="r.kind === 'company' && expanded === r.company.id" class="mb-1 ml-[27px] border-l border-gray-200 pl-3">
            <MenuRow
              v-for="p in r.company.contacts"
              :key="p.id"
              :entity="{ type: 'contact', name: p.name }"
              :subtitle="p.role"
              @click="inbox.startWithContact(r.company.id, p.id)"
            />
          </div>
        </template>
        <p v-if="!shown.length" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
      </MenuShell>
    </template>
  </InboxLayout>
</template>
