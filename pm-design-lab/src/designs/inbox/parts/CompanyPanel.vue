<script setup>
import { Briefcase, Mail, MapPin, PanelRight, Phone, Receipt } from 'lucide-vue-next'
import { PROFILE_STATUS } from '@/mock'
import { useInbox } from './useInbox'
import EntityAvatar from './EntityAvatar.vue'

// Company info: who we're currently talking to, and a quick switch to another contact person.
const { selected, company, currentContact, switchContact } = useInbox()
</script>

<template>
  <aside class="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 xl:flex">
    <div class="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
      <span class="text-base font-semibold text-gray-900">Company info</span>
      <button type="button" class="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Hide panel"><PanelRight :size="18" /></button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col items-center gap-1 border-b border-gray-200 px-4 py-6 text-center">
        <EntityAvatar type="company" :logo="company.logo" :size="64" class="mb-2" />
        <div class="text-base font-semibold text-gray-900">{{ company.name }}</div>
        <div class="text-[13px] text-gray-600">{{ currentContact?.name }}</div>
      </div>

      <section class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Company Info</h3>
        <dl class="flex flex-col gap-3 text-[13px]">
          <div class="flex gap-3"><dt class="flex w-20 shrink-0 items-center gap-1.5 text-gray-600"><Mail :size="14" />Email</dt><dd class="min-w-0 break-words text-gray-900">{{ company.email }}</dd></div>
          <div class="flex gap-3"><dt class="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><MapPin :size="14" />Address</dt><dd class="min-w-0 text-gray-900">{{ company.address }}</dd></div>
        </dl>
      </section>

      <section class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Contact Person</h3>
        <div class="flex flex-col gap-3">
          <div v-for="p in company.contacts" :key="p.id" class="flex items-center gap-3">
            <EntityAvatar type="contact" :name="p.name" :size="36" />
            <div class="min-w-0 flex-1">
              <div class="truncate text-[13px] font-medium text-gray-900">{{ p.name }}</div>
              <div class="flex items-center gap-1 text-xs text-gray-600"><Phone :size="12" />{{ p.phone }}</div>
            </div>
            <span v-if="p.id === currentContact?.id" class="px-2 text-[13px] font-medium text-gray-900">Current</span>
            <PmButton v-else size="sm" variant="secondary" @click="switchContact(selected, p.id)">Switch</PmButton>
          </div>
        </div>
      </section>

      <section v-if="company.jobs.length" class="border-b border-gray-200 p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Jobs</h3>
        <div class="flex flex-col gap-2">
          <div v-for="j in company.jobs" :key="j.id" class="flex gap-3 rounded-xl bg-gray-50 p-3">
            <Briefcase :size="16" class="mt-0.5 shrink-0 text-gray-600" />
            <div class="min-w-0 flex-1 text-xs text-gray-600">
              <div class="text-[13px] font-medium text-gray-900">{{ j.title }}</div>
              <div class="mt-0.5">{{ j.open }} open jobs • {{ j.hired }} hired</div>
              <div>{{ j.city }}</div>
            </div>
            <PmStatusPill :tone="PROFILE_STATUS[j.status].tone" :dot="false" bordered class="self-start">{{ PROFILE_STATUS[j.status].label }}</PmStatusPill>
          </div>
        </div>
      </section>

      <section v-if="company.invoices.length" class="p-4">
        <h3 class="mb-3 text-[13px] font-medium text-gray-600">Invoices</h3>
        <div class="flex flex-col gap-2">
          <div v-for="i in company.invoices" :key="i.id" class="flex gap-3 rounded-xl bg-gray-50 p-3">
            <Receipt :size="16" class="mt-0.5 shrink-0 text-gray-600" />
            <div class="min-w-0 flex-1 text-xs text-gray-600">
              <div class="text-[13px] font-medium text-gray-900">{{ i.amount }}</div>
              <div class="mt-0.5">{{ i.period }}</div>
              <div>{{ i.sent }}</div>
            </div>
            <PmStatusPill :tone="PROFILE_STATUS[i.status].tone" :dot="false" bordered class="self-start">{{ PROFILE_STATUS[i.status].label }}</PmStatusPill>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>
