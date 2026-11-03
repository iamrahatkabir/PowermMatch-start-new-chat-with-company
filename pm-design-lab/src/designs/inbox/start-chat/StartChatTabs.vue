<script setup>
/**
 * VERSION B — Filter tabs
 * One flat list with tabs: All · Companies · Candidates · Applicants. A "Contact persons" tab
 * appears only while searching. Companies expand in place to show their contact persons.
 *
 * Props:  companies, candidates, applicants   (shapes: see README.md)
 * Events: select-contact(companyId, contactId), select-person(person, kind)
 */
import { computed, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { searchDirectory } from './search'
import MenuShell from './ui/MenuShell.vue'
import MenuRow from './ui/MenuRow.vue'

const props = defineProps({
  companies: { type: Array, required: true },
  candidates: { type: Array, required: true },
  applicants: { type: Array, required: true },
})
const emit = defineEmits(['select-contact', 'select-person'])

const query = ref('')
const tab = ref('all')
const expandedCompanyId = ref(null)
const results = computed(() => searchDirectory(query.value, props))

// Every result as one row type, so tabs can filter a single list
const rows = computed(() => [
  ...results.value.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', entity: { type: 'contact', name: p.name }, subtitle: `${p.role} • ${p.company}`, onClick: () => emit('select-contact', p.companyId, p.id) })),
  ...results.value.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', entity: { type: 'company', name: c.name, logo: c.logo }, subtitle: c.contractsLabel, company: c, onClick: () => (expandedCompanyId.value = expandedCompanyId.value === c.id ? null : c.id) })),
  ...results.value.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', entity: p, subtitle: p.meta, onClick: () => emit('select-person', p, 'candidate') })),
  ...results.value.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', entity: p, subtitle: p.meta, onClick: () => emit('select-person', p, 'applicant') })),
])
const count = (kind) => rows.value.filter((r) => kind === 'all' || r.kind === kind).length
const tabs = computed(() =>
  [
    { key: 'all', label: 'All' },
    ...(results.value.contacts.length ? [{ key: 'contact', label: 'Contact persons' }] : []),
    { key: 'company', label: 'Companies' },
    { key: 'candidate', label: 'Candidates' },
    { key: 'applicant', label: 'Applicants' },
  ].map((t) => ({ ...t, count: count(t.key) })),
)
// If the active tab disappears (e.g. search cleared), fall back to All
watch(tabs, (t) => !t.some((x) => x.key === tab.value) && (tab.value = 'all'))
const visibleRows = computed(() => rows.value.filter((r) => tab.value === 'all' || r.kind === tab.value))
</script>

<template>
  <MenuShell v-model="query">
    <template #below-search><PmTabs v-model="tab" :tabs="tabs" class="-mx-1 mt-2 [&>button]:text-[13px]" /></template>

    <template v-for="r in visibleRows" :key="r.key">
      <MenuRow :entity="r.entity" :subtitle="r.subtitle" :query="query" @click="r.onClick()">
        <template #end>
          <span v-if="tab === 'all'" class="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{{ r.label }}</span>
          <ChevronDown v-if="r.kind === 'company'" :size="16" class="shrink-0 text-gray-400 transition-transform" :class="expandedCompanyId === r.company.id && 'rotate-180'" />
        </template>
      </MenuRow>
      <!-- Expanded company: its contact persons -->
      <div v-if="r.kind === 'company' && expandedCompanyId === r.company.id" class="mb-1 ml-[27px] border-l border-gray-200 pl-3">
        <MenuRow
          v-for="p in r.company.contacts"
          :key="p.id"
          :entity="{ type: 'contact', name: p.name }"
          :subtitle="p.role"
          @click="emit('select-contact', r.company.id, p.id)"
        />
      </div>
    </template>
    <p v-if="!visibleRows.length" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
  </MenuShell>
</template>
