<script setup>
import { computed, ref, watch } from 'vue'
import { ArrowLeft, CornerDownLeft, Phone } from 'lucide-vue-next'
import { clientCompanies } from '@/mock'
import { applicants, candidates, companyById, contactPersons, matches, provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import MenuShell from './parts/MenuShell.vue'
import MenuSection from './parts/MenuSection.vue'
import MenuRow from './parts/MenuRow.vue'
import EntityAvatar from './parts/EntityAvatar.vue'
import Highlight from './parts/Highlight.vue'

// Same default sections as A. While searching, the best match becomes a card with
// everything needed to decide (company, role, phone) and a Start chat button. Enter starts it.
const inbox = provideInbox()
const query = ref('')
const company = ref(null)
watch(() => inbox.state.menuOpen, () => ((query.value = ''), (company.value = null)))

const searching = computed(() => !!query.value.trim())
const companies = computed(() => clientCompanies.filter((c) => matches(query.value, c.name)))
const cands = computed(() => candidates.filter((p) => matches(query.value, p.name, p.meta)))
const apps = computed(() => applicants.filter((p) => matches(query.value, p.name, p.meta)))

const results = computed(() => {
  if (!searching.value) return []
  const q = query.value.trim().toLowerCase()
  const rank = (r) => (r.name.toLowerCase().startsWith(q) ? 0 : r.name.toLowerCase().includes(q) ? 1 : 2)
  return [
    ...contactPersons.filter((p) => matches(query.value, p.name, p.company)).map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p, go: () => inbox.startWithContact(p.companyId, p.id) })),
    ...companies.value.map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, go: () => (company.value = c) })),
    ...cands.value.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', name: p.name, photo: p.photo, subtitle: p.meta, person: p, go: () => inbox.startWithPerson(p, 'candidate') })),
    ...apps.value.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', name: p.name, photo: p.photo, subtitle: p.meta, person: p, go: () => inbox.startWithPerson(p, 'applicant') })),
  ].sort((a, b) => rank(a) - rank(b))
})
const top = computed(() => results.value[0])
const entityOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })
const onKey = (e) => e.key === 'Enter' && top.value && (e.preventDefault(), top.value.go())
</script>

<template>
  <InboxLayout>
    <template #menu>
      <MenuShell v-model="query" @keydown="onKey">
        <!-- Company opened from a result: pick a contact -->
        <template v-if="company">
          <button type="button" class="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" @click="company = null"><ArrowLeft :size="18" />Back</button>
          <MenuSection :title="`Contact persons at ${company.name}`" />
          <MenuRow v-for="p in company.contacts" :key="p.id" :entity="{ type: 'contact', name: p.name }" :subtitle="p.role" @click="inbox.startWithContact(company.id, p.id)" />
        </template>

        <!-- Searching: best match card + other results -->
        <template v-else-if="searching">
          <div v-if="top" class="m-1 mt-2 rounded-xl border border-gray-200 bg-gray-25 p-4">
            <div class="flex items-start gap-3">
              <EntityAvatar v-bind="entityOf(top)" :size="44" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-semibold text-gray-900"><Highlight :text="top.name" :query="query" /></span>
                  <span class="shrink-0 rounded-md border border-gray-200 bg-white px-1.5 text-[11px] leading-[18px] text-gray-600">{{ top.label }}</span>
                </div>
                <div class="truncate text-xs text-gray-500">{{ top.kind === 'contact' ? top.contact.role : top.subtitle }}</div>
              </div>
            </div>
            <div v-if="top.kind === 'contact'" class="mt-3 flex flex-col gap-1.5 text-xs text-gray-600">
              <span class="flex items-center gap-2">
                <EntityAvatar type="company" :logo="companyById(top.contact.companyId).logo" :size="18" />
                <Highlight :text="top.contact.company" :query="query" />
              </span>
              <span class="flex items-center gap-2 pl-0.5"><Phone :size="14" />{{ top.contact.phone }}</span>
            </div>
            <PmButton block class="mt-4" @click="top.go()">
              {{ top.kind === 'company' ? 'Show contact persons' : `Start chat with ${top.name.split(' ')[0]}` }}
              <CornerDownLeft :size="14" class="opacity-50" />
            </PmButton>
            <p v-if="top.kind === 'contact'" class="mt-2 text-center text-[11px] text-gray-500">Opens in the {{ top.contact.company }} conversation</p>
          </div>

          <template v-if="results.length > 1">
            <MenuSection title="Other results" :count="results.length - 1" />
            <MenuRow v-for="r in results.slice(1)" :key="r.key" :entity="entityOf(r)" :subtitle="r.subtitle" :query="query" :chevron="r.kind === 'company'" @click="r.go()">
              <template #end><span class="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{{ r.label }}</span></template>
            </MenuRow>
          </template>
          <p v-if="!top" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
        </template>

        <!-- Not searching: same sections as today -->
        <template v-else>
          <MenuSection title="Company" :count="companies.length" />
          <MenuRow v-for="c in companies" :key="c.id" :entity="{ type: 'company', name: c.name, logo: c.logo }" :subtitle="c.contractsLabel" chevron @click="company = c" />
          <MenuSection title="Candidate" :count="cands.length" />
          <MenuRow v-for="p in cands" :key="p.id" :entity="p" :subtitle="p.meta" @click="inbox.startWithPerson(p, 'candidate')" />
          <MenuSection title="Applicant" :count="apps.length" />
          <MenuRow v-for="p in apps" :key="p.id" :entity="p" :subtitle="p.meta" @click="inbox.startWithPerson(p, 'applicant')" />
        </template>
      </MenuShell>
    </template>
  </InboxLayout>
</template>
