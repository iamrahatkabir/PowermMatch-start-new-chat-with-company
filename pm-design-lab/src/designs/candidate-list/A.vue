<script setup>
import { computed, ref } from 'vue'
import { candidates, STATUS } from '@/mock'

const tab = ref('all')
const query = ref('')
const tabs = computed(() => [
  { key: 'all', label: 'All', count: candidates.length },
  ...['matched', 'cv_ready', 'interview', 'pending'].map((s) => ({ key: s, label: STATUS[s].label, count: candidates.filter((c) => c.status === s).length })),
])
const list = computed(() =>
  candidates
    .filter((c) => tab.value === 'all' || c.status === tab.value)
    .filter((c) => `${c.name} ${c.role}`.toLowerCase().includes(query.value.toLowerCase())),
)
</script>

<template>
  <PmAppShell title="Employees" subtitle="Candidates matched to your jobs" active="candidates">
    <template #actions><PmButton icon="plus">Add Candidate</PmButton></template>

    <div class="flex flex-col gap-5">
      <PmCard padding="p-4">
        <PmInput v-model="query" placeholder="Search by name or role" />
      </PmCard>
      <PmTabs v-model="tab" :tabs="tabs" />

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="c in list"
          :key="c.id"
          class="relative flex cursor-pointer flex-col items-center gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
         
        >
          <div class="absolute right-4 top-4"><PmStatusPill :tone="STATUS[c.status].tone">{{ STATUS[c.status].label }}</PmStatusPill></div>
          <div class="flex flex-col items-center gap-2">
            <PmAvatar :name="c.name" :size="64" />
            <div class="text-base font-semibold text-gray-900">{{ c.name }}</div>
            <div class="flex items-center gap-1.5 text-sm text-gray-500"><PmIcon name="briefcase" :size="16" />{{ c.role }}</div>
          </div>
          <PmMatchChip :score="c.match" />
          <dl class="flex w-full flex-col gap-3 text-sm">
            <div class="flex justify-between"><dt class="text-gray-500">Age</dt><dd class="text-gray-900">{{ c.age }} years</dd></div>
            <div class="flex justify-between"><dt class="text-gray-500">Distance</dt><dd class="text-gray-900">{{ c.city }} · {{ c.distanceKm }} km</dd></div>
            <div class="flex justify-between"><dt class="text-gray-500">Experience</dt><dd class="text-gray-900">{{ c.experienceYears }} yrs</dd></div>
          </dl>
          <PmButton variant="secondary" block>Shortlist</PmButton>
        </article>
      </div>
    </div>
  </PmAppShell>
</template>
