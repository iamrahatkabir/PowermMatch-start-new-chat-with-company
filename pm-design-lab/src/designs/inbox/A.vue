<script setup>
import { computed, ref, watch } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { clientCompanies } from '@/mock'
import { applicants, candidates, contactPersons, matches, provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import MenuShell from './parts/MenuShell.vue'
import MenuSection from './parts/MenuSection.vue'
import MenuRow from './parts/MenuRow.vue'

// Default list: Company, Candidate, Applicant. Searching also shows matching contact persons
// (name + "Role • Company"); picking one opens the chat under the company. Opening a company still works.
const inbox = provideInbox()
const query = ref('')
const company = ref(null)
watch(() => inbox.state.menuOpen, () => ((query.value = ''), (company.value = null)))

const companies = computed(() => clientCompanies.filter((c) => matches(query.value, c.name)))
// Contact persons only show up once the user searches
const contacts = computed(() => (query.value.trim() ? contactPersons.filter((p) => matches(query.value, p.name, p.company)) : []))
const cands = computed(() => candidates.filter((p) => matches(query.value, p.name, p.meta)))
const apps = computed(() => applicants.filter((p) => matches(query.value, p.name, p.meta)))
const empty = computed(() => !companies.value.length && !contacts.value.length && !cands.value.length && !apps.value.length)
</script>

<template>
  <InboxLayout>
    <template #menu>
      <MenuShell v-model="query">
        <template v-if="company">
          <button type="button" class="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" @click="company = null">
            <ArrowLeft :size="18" />All
          </button>
          <MenuSection title="Company" />
          <MenuRow :entity="{ type: 'company', name: company.name, logo: company.logo }" :subtitle="company.contractsLabel" class="pointer-events-none" />
          <MenuSection title="Contact person" />
          <MenuRow v-for="p in company.contacts" :key="p.id" :entity="{ type: 'contact', name: p.name }" :subtitle="p.role" @click="inbox.startWithContact(company.id, p.id)" />
        </template>
        <template v-else>
          <template v-if="companies.length">
            <MenuSection title="Company" :count="companies.length" />
            <MenuRow v-for="c in companies" :key="c.id" :entity="{ type: 'company', name: c.name, logo: c.logo }" :subtitle="c.contractsLabel" :query="query" chevron @click="company = c" />
          </template>
          <template v-if="contacts.length">
            <MenuSection title="Contact person" :count="contacts.length" />
            <MenuRow
              v-for="p in contacts"
              :key="p.id"
              :entity="{ type: 'contact', name: p.name }"
              :subtitle="`${p.role} • ${p.company}`"
              :query="query"
              @click="inbox.startWithContact(p.companyId, p.id)"
            />
          </template>
          <template v-if="cands.length">
            <MenuSection title="Candidate" :count="cands.length" />
            <MenuRow v-for="p in cands" :key="p.id" :entity="p" :subtitle="p.meta" :query="query" @click="inbox.startWithPerson(p, 'candidate')" />
          </template>
          <template v-if="apps.length">
            <MenuSection title="Applicant" :count="apps.length" />
            <MenuRow v-for="p in apps" :key="p.id" :entity="p" :subtitle="p.meta" :query="query" @click="inbox.startWithPerson(p, 'applicant')" />
          </template>
          <p v-if="empty" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
        </template>
      </MenuShell>
    </template>
  </InboxLayout>
</template>
