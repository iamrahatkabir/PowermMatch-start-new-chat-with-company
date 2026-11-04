<script setup>
import { reactive } from 'vue'
import {
  Archive, Bell, Briefcase, Building2, CalendarDays, ChevronDown, CircleDollarSign, Clock, Contact, FilePen, Globe, Inbox, LayoutGrid,
  ListChecks, MessagesSquare, Network, PhoneForwarded, Receipt, Settings, Ticket, User, UserPlus, Users, Workflow,
} from 'lucide-vue-next'

// `active` is any item key below (e.g. 'inbox-all', 'candidates', 'journeys').
// Clicking any item emits `select(key)` so a design can switch what it shows.
const props = defineProps({ active: String, collapsed: Boolean })
const emit = defineEmits(['select', 'expand']) // expand: a group was clicked while collapsed

const nav = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  {
    key: 'inbox', label: 'Inbox', icon: Inbox, badge: 43, children: [
      { key: 'inbox-all', label: 'All', icon: MessagesSquare, badge: 10 },
      { key: 'inbox-support', label: 'Support', icon: Ticket },
      { key: 'inbox-upcoming', label: 'Upcoming', icon: CalendarDays },
      { key: 'inbox-communication', label: 'Communication', icon: Contact },
      { key: 'inbox-archive', label: 'Archive', icon: Archive },
      { key: 'inbox-notifications', label: 'Notification settings', icon: Bell },
    ],
  },
  { key: 'interviews', label: 'Job Interviews', icon: CalendarDays },
  { key: 'time', label: 'Time Tracking', icon: Clock },
  { key: 'payroll', label: 'Payroll', icon: CircleDollarSign },
  { key: 'contracts', label: 'Contracts', icon: FilePen },
  { key: 'invoicing', label: 'Invoicing', icon: Receipt },
  {
    key: 'team', label: 'Team', icon: Users, children: [
      { key: 'candidates', label: 'Candidates', icon: User },
      { key: 'companies', label: 'Companies', icon: Building2 },
    ],
  },
  {
    key: 'jobs', label: 'Jobs', icon: Briefcase, children: [
      { key: 'jobs-all', label: 'All Jobs', icon: ListChecks },
      { key: 'jobs-applicants', label: 'Applicants', icon: UserPlus },
    ],
  },
  {
    key: 'power-journey', label: 'Power journey', icon: Network, children: [
      { key: 'journeys', label: 'Journeys', icon: Workflow },
      { key: 'numbers', label: 'Numbers', icon: PhoneForwarded },
    ],
  },
  { key: 'career-page', label: 'Career page', icon: Globe },
  { key: 'settings', label: 'Settings', icon: Settings },
]

// Inbox and Power journey start open (as in the product), plus whichever group holds the active page.
const open = reactive({ inbox: true, 'power-journey': true })
for (const g of nav) if (g.children?.some((c) => c.key === props.active)) open[g.key] = true
</script>

<template>
  <aside
    class="hidden shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white py-4 transition-[width] duration-200 ease-pm lg:flex"
    :class="collapsed ? 'w-[72px] px-3' : 'w-60 px-3'"
  >
    <template v-for="item in nav" :key="item.key">
      <button
        type="button"
        class="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50"
        :class="[item.key === active && 'bg-gray-100 text-gray-900', collapsed && 'justify-center']"
        :title="collapsed ? item.label : undefined"
        @click="!item.children ? emit('select', item.key) : collapsed ? ((open[item.key] = true), emit('expand')) : (open[item.key] = !open[item.key])"
      >
        <component :is="item.icon" :size="20" class="shrink-0 text-gray-600" />
        <template v-if="!collapsed">
          <span>{{ item.label }}</span>
          <ChevronDown v-if="item.children" :size="16" class="shrink-0 text-gray-500 transition-transform" :class="open[item.key] && 'rotate-180'" />
          <span v-if="item.badge" class="ml-auto rounded-full bg-error-50 px-2 text-xs font-medium leading-5 text-error-500">{{ item.badge }}</span>
        </template>
        <span v-else-if="item.badge" class="absolute right-2 top-2 size-2 rounded-full bg-error-500" />
      </button>
      <div v-if="item.children && open[item.key] && !collapsed" class="mb-1 ml-5 flex flex-col gap-0.5 border-l border-gray-200 pl-2">
        <button
          v-for="c in item.children"
          :key="c.key"
          type="button"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50"
          :class="c.key === active && 'bg-gray-100 text-gray-900'"
          @click="emit('select', c.key)"
        >
          <component :is="c.icon" :size="18" class="shrink-0 text-gray-600" />
          <span class="truncate">{{ c.label }}</span>
          <span v-if="c.badge" class="ml-auto rounded-full bg-error-50 px-2 text-xs font-medium leading-5 text-error-500">{{ c.badge }}</span>
        </button>
      </div>
    </template>
  </aside>
</template>
