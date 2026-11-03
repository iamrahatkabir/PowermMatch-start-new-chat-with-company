<script setup>
import { Building, FileText, Mail, MapPin, PanelRight, Phone, Video } from 'lucide-vue-next'
import { candidateProfile as p, PROFILE_STATUS } from '@/mock'
import { useInbox } from './useInbox'

const { selected } = useInbox()

const info = [
  { label: 'Phone', value: p.phone, icon: Phone },
  { label: 'Email', value: p.email, icon: Mail },
  { label: 'Address', value: p.address, icon: MapPin },
  { label: 'Employer', value: p.employer, icon: Building },
]
</script>

<template>
  <aside class="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 xl:flex">
    <div class="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
      <span class="text-base font-semibold text-gray-900">Candidate info</span>
      <button type="button" class="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Hide panel"><PanelRight :size="18" /></button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col items-center gap-1 border-b border-gray-200 px-4 py-6 text-center">
        <PmAvatar :name="selected.name" :src="selected.photo" :size="64" class="mb-2" />
        <div class="text-base font-semibold text-gray-900">{{ selected.name }}</div>
        <div class="text-[13px] text-gray-600">{{ selected.kind === 'applicant' ? 'Applicant' : p.type }} • {{ p.trade }} • {{ p.experience }}</div>
      </div>

      <section class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Personal Info</h3>
        <dl class="flex flex-col gap-3 text-[13px]">
          <div v-for="r in info" :key="r.label" class="flex gap-3">
            <dt class="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><component :is="r.icon" :size="14" />{{ r.label }}</dt>
            <dd class="min-w-0 break-words text-gray-900">{{ r.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Interviews</h3>
        <div class="flex flex-col gap-2">
          <div v-for="i in p.interviews" :key="i.id" class="flex gap-3 rounded-xl bg-gray-50 p-3">
            <component :is="i.mode === 'video' ? Video : MapPin" :size="16" class="mt-0.5 shrink-0 text-gray-600" />
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-medium text-gray-900">{{ i.date }} • {{ i.time }}</div>
              <div class="text-xs text-gray-600">{{ i.company }}</div>
            </div>
            <PmStatusPill :tone="PROFILE_STATUS[i.status].tone" :dot="false" bordered class="self-start">{{ PROFILE_STATUS[i.status].label }}</PmStatusPill>
          </div>
        </div>
      </section>

      <section class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Contracts</h3>
        <div class="flex flex-col gap-2">
          <div v-for="c in p.contracts" :key="c.id" class="flex gap-3 rounded-xl bg-gray-50 p-3">
            <FileText :size="16" class="mt-0.5 shrink-0 text-gray-600" />
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-medium text-gray-900">{{ c.date }} • {{ c.time }}</div>
              <div class="truncate text-xs text-gray-600">{{ c.company }}</div>
            </div>
            <PmStatusPill :tone="PROFILE_STATUS[c.status].tone" :dot="false" bordered class="self-start">{{ PROFILE_STATUS[c.status].label }}</PmStatusPill>
          </div>
        </div>
      </section>

    </div>
  </aside>
</template>
