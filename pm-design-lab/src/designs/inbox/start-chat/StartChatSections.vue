<script setup>
/**
 * VERSION A — Sections
 * Default list: Company, Candidate, Applicant. While searching, a "Contact person" section
 * is added (name + "Role • Company"). Companies can still be opened to pick a contact.
 *
 * Props:  companies, candidates, applicants   (shapes: see README.md)
 * Events: select-contact(companyId, contactId)   → open the company chat with this contact as current
 *         select-person(person, kind)            → kind is 'candidate' | 'applicant'
 */
import { computed, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { searchDirectory } from './search'
import MenuShell from './ui/MenuShell.vue'
import MenuSection from './ui/MenuSection.vue'
import MenuRow from './ui/MenuRow.vue'

const props = defineProps({
  companies: { type: Array, required: true },
  candidates: { type: Array, required: true },
  applicants: { type: Array, required: true },
})
const emit = defineEmits(['select-contact', 'select-person'])

const query = ref('')
const openCompany = ref(null)
const results = computed(() => searchDirectory(query.value, props))
const empty = computed(() => !Object.values(results.value).some((v) => v.length))
</script>

<template>
  <MenuShell v-model="query">
    <!-- A company was opened: pick one of its contact persons -->
    <template v-if="openCompany">
      <button type="button" class="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" @click="openCompany = null">
        <ArrowLeft :size="18" />All
      </button>
      <MenuSection title="Company" />
      <MenuRow :entity="{ type: 'company', name: openCompany.name, logo: openCompany.logo }" :subtitle="openCompany.contractsLabel" class="pointer-events-none" />
      <MenuSection title="Contact person" />
      <MenuRow
        v-for="p in openCompany.contacts"
        :key="p.id"
        :entity="{ type: 'contact', name: p.name }"
        :subtitle="p.role"
        @click="emit('select-contact', openCompany.id, p.id)"
      />
    </template>

    <template v-else>
      <template v-if="results.companies.length">
        <MenuSection title="Company" :count="results.companies.length" />
        <MenuRow
          v-for="c in results.companies"
          :key="c.id"
          :entity="{ type: 'company', name: c.name, logo: c.logo }"
          :subtitle="c.contractsLabel"
          :query="query"
          chevron
          @click="openCompany = c"
        />
      </template>
      <template v-if="results.contacts.length">
        <MenuSection title="Contact person" :count="results.contacts.length" />
        <MenuRow
          v-for="p in results.contacts"
          :key="p.id"
          :entity="{ type: 'contact', name: p.name }"
          :subtitle="`${p.role} • ${p.company}`"
          :query="query"
          @click="emit('select-contact', p.companyId, p.id)"
        />
      </template>
      <template v-if="results.candidates.length">
        <MenuSection title="Candidate" :count="results.candidates.length" />
        <MenuRow v-for="p in results.candidates" :key="p.id" :entity="p" :subtitle="p.meta" :query="query" @click="emit('select-person', p, 'candidate')" />
      </template>
      <template v-if="results.applicants.length">
        <MenuSection title="Applicant" :count="results.applicants.length" />
        <MenuRow v-for="p in results.applicants" :key="p.id" :entity="p" :subtitle="p.meta" :query="query" @click="emit('select-person', p, 'applicant')" />
      </template>
      <p v-if="empty" class="px-2 py-6 text-center text-sm text-gray-500">No results for “{{ query }}”</p>
    </template>
  </MenuShell>
</template>
