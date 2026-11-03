<script setup>
import { computed, ref } from 'vue'
import { candidates, STATUS, dkk } from '@/mock'

const query = ref('')
const status = ref('all')
const statusOptions = [{ value: 'all', label: 'All statuses' }, ...Object.entries(STATUS).map(([value, s]) => ({ value, label: s.label }))]
const list = computed(() =>
  candidates
    .filter((c) => status.value === 'all' || c.status === status.value)
    .filter((c) => `${c.name} ${c.role}`.toLowerCase().includes(query.value.toLowerCase())),
)
</script>

<template>
  <PmAppShell title="Employees" subtitle="Candidates matched to your jobs" active="candidates">
    <template #actions><PmButton icon="plus">Add Candidate</PmButton></template>

    <PmCard padding="p-0" class="overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4">
        <PmInput v-model="query" placeholder="Search by name or role" class="min-w-56 flex-1" />
        <PmSelect v-model="status" :options="statusOptions" class="w-48" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-left text-sm">
          <thead class="bg-gray-50 text-xs font-medium text-gray-500">
            <tr>
              <th class="px-4 py-3">Candidate</th>
              <th class="px-4 py-3">Match</th>
              <th class="px-4 py-3">Location</th>
              <th class="px-4 py-3">Experience</th>
              <th class="px-4 py-3">Rate</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="c in list" :key="c.id" class="cursor-pointer hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <PmAvatar :name="c.name" :size="36" />
                  <div>
                    <div class="font-medium text-gray-900">{{ c.name }}</div>
                    <div class="text-xs text-gray-500">{{ c.role }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-success-700">{{ c.match }}%</td>
              <td class="px-4 py-3 text-gray-600">{{ c.city }} · {{ c.distanceKm }} km</td>
              <td class="px-4 py-3 text-gray-600">{{ c.experienceYears }} yrs</td>
              <td class="px-4 py-3 text-gray-600">{{ dkk(c.hourlyRate) }}/h</td>
              <td class="px-4 py-3"><PmStatusPill :tone="STATUS[c.status].tone">{{ STATUS[c.status].label }}</PmStatusPill></td>
              <td class="px-4 py-3 text-right"><PmButton variant="secondary" size="sm">Shortlist</PmButton></td>
            </tr>
          </tbody>
        </table>
      </div>
    </PmCard>
  </PmAppShell>
</template>
