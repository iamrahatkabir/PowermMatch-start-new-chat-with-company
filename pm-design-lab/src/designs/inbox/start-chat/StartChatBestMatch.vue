<script setup>
/**
 * VERSION C — Best match card
 * Default list is the same as version A. While searching, the top result becomes a card with
 * role, company and phone, plus a "Start chat" button. Enter starts the top result.
 *
 * Props:  companies, candidates, applicants   (shapes: see README.md)
 * Events: select-contact(companyId, contactId), select-person(person, kind)
 */
import { computed, ref } from 'vue'
import { ArrowLeft, CornerDownLeft, Phone } from 'lucide-vue-next'
import { byNameRelevance, searchDirectory } from './search'
import MenuShell from './ui/MenuShell.vue'
import MenuSection from './ui/MenuSection.vue'
import MenuRow from './ui/MenuRow.vue'
import EntityAvatar from './ui/EntityAvatar.vue'
import Highlight from './ui/Highlight.vue'

const props = defineProps({
  companies: { type: Array, required: true },
  candidates: { type: Array, required: true },
  applicants: { type: Array, required: true },
})
const emit = defineEmits(['select-contact', 'select-person'])

const query = ref('')
const openCompany = ref(null)
const results = computed(() => searchDirectory(query.value, props))

// All results ranked by name relevance; the first one is shown as the card
const ranked = computed(() => {
  if (!results.value.searching) return []
  const r = results.value
  return [
    ...r.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p, onSelect: () => emit('select-contact', p.companyId, p.id) })),
    ...r.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, onSelect: () => (openCompany.value = c) })),
    ...r.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', name: p.name, photo: p.photo, subtitle: p.meta, onSelect: () => emit('select-person', p, 'candidate') })),
    ...r.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', name: p.name, photo: p.photo, subtitle: p.meta, onSelect: () => emit('select-person', p, 'applicant') })),
  ].sort(byNameRelevance(query.value))
})
const top = computed(() => ranked.value[0])
const avatarOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })

function onKeydown(e) {
  if (e.key !== 'Enter' || !top.value) return
  e.preventDefault()
  top.value.onSelect()
}
</script>

<template>
  <MenuShell v-model="query" @keydown="onKeydown">
    <!-- A company was opened: pick one of its contact persons -->
    <template v-if="openCompany">
      <button type="button" class="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" @click="openCompany = null"><ArrowLeft :size="18" />Back</button>
      <MenuSection :title="`Contact persons at ${openCompany.name}`" />
      <MenuRow v-for="p in openCompany.contacts" :key="p.id" :entity="{ type: 'contact', name: p.name }" :subtitle="p.role" @click="emit('select-contact', openCompany.id, p.id)" />
    </template>

    <!-- Searching: best match card + other results -->
    <template v-else-if="results.searching">
      <div v-if="top" class="m-1 mt-2 rounded-xl border border-gray-200 bg-gray-25 p-4">
        <div class="flex items-start gap-3">
          <EntityAvatar v-bind="avatarOf(top)" :size="44" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-sm font-semibold text-gray-900"><Highlight :text="top.name" :query="query" /></span>
              <span class="shrink-0 rounded-md border border-gray-200 bg-white px-1.5 text-[11px] leading-[18px] text-gray-600">{{ top.label }}</span>
            </div>
            <div class="truncate text-xs text-gray-500">{{ top.kind === 'contact' ? top.contact.role : top.subtitle }}</div>
          </div>
        </div>
        <div v-if="top.kind === 'contact'" class="mt-3 flex flex-col gap-1.5 text-xs text-gray-600">
          <span class="flex items-center gap-2"><EntityAvatar type="company" :logo="top.contact.companyLogo" :size="18" /><Highlight :text="top.contact.company" :query="query" /></span>
          <span class="flex items-center gap-2 pl-0.5"><Phone :size="14" />{{ top.contact.phone }}</span>
        </div>
        <PmButton block class="mt-4" @click="top.onSelect()">
          {{ top.kind === 'company' ? 'Show contact persons' : `Start chat with ${top.name.split(' ')[0]}` }}
          <CornerDownLeft :size="14" class="opacity-50" />
        </PmButton>
        <p v-if="top.kind === 'contact'" class="mt-2 text-center text-[11px] text-gray-500">Opens in the {{ top.contact.company }} conversation</p>
      </div>

      <template v-if="ranked.length > 1">
        <MenuSection title="Other results" :count="ranked.length - 1" />
        <MenuRow v-for="r in ranked.slice(1)" :key="r.key" :entity="avatarOf(r)" :subtitle="r.subtitle" :query="query" :chevron="r.kind === 'company'" @click="r.onSelect()">
          <template #end><span class="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{{ r.label }}</span></template>
        </MenuRow>
      </template>
      <p v-if="!top" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
    </template>

    <!-- Not searching: same sections as version A -->
    <template v-else>
      <MenuSection title="Company" :count="results.companies.length" />
      <MenuRow v-for="c in results.companies" :key="c.id" :entity="{ type: 'company', name: c.name, logo: c.logo }" :subtitle="c.contractsLabel" chevron @click="openCompany = c" />
      <MenuSection title="Candidate" :count="results.candidates.length" />
      <MenuRow v-for="p in results.candidates" :key="p.id" :entity="p" :subtitle="p.meta" @click="emit('select-person', p, 'candidate')" />
      <MenuSection title="Applicant" :count="results.applicants.length" />
      <MenuRow v-for="p in results.applicants" :key="p.id" :entity="p" :subtitle="p.meta" @click="emit('select-person', p, 'applicant')" />
    </template>
  </MenuShell>
</template>
