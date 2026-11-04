<script setup>
import { onMounted, onUnmounted } from 'vue'
import { ArrowUpNarrowWide, Building2, ChevronDown, Mail, MessageCircle, MessageSquareText, Phone, PhoneMissed, Plus, Star, User, UserPlus, Voicemail } from 'lucide-vue-next'
import { CONVERSATION_KIND } from '@/mock'
import { companyById, useInbox } from './useInbox'
import EntityAvatar from '../start-chat/ui/EntityAvatar.vue'

const { state, select } = useInbox()
const kindIcon = { candidate: User, applicant: UserPlus, company: Building2 }
const channelIcon = { call: Phone, missed: PhoneMissed, email: Mail, chat: MessageCircle, sms: MessageSquareText, voicemail: Voicemail }

const onKey = (e) => e.key === 'Escape' && (state.menuOpen = false)
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="relative flex w-80 shrink-0 flex-col border-r border-gray-200">
    <div class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
      <button type="button" class="flex items-center gap-1.5 text-base font-semibold text-gray-900">
        All conversations <ChevronDown :size="18" class="text-gray-500" />
      </button>
      <button type="button" class="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Sort"><ArrowUpNarrowWide :size="18" /></button>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-lg text-gray-700"
        :class="state.menuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'"
        title="Start new conversation"
        @click="state.menuOpen = !state.menuOpen"
      >
        <Plus :size="18" />
      </button>
    </div>

    <template v-if="state.menuOpen">
      <div class="fixed inset-0 z-20" @click="state.menuOpen = false" />
      <slot name="menu" />
    </template>

    <ul class="flex-1 overflow-y-auto">
      <li
        v-for="c in state.conversations"
        :key="c.id"
        class="flex cursor-pointer gap-3 px-4 py-3.5"
        :class="c.id === state.selectedId ? 'bg-gray-50' : 'hover:bg-gray-25'"
        @click="select(c.id)"
      >
        <EntityAvatar
          :type="c.kind === 'company' ? 'company' : 'person'"
          :name="c.name"
          :photo="c.photo"
          :logo="companyById(c.companyId)?.logo"
          :class="c.state && 'ring-3 ring-success-200'"
        />
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-1.5">
            <span class="truncate text-sm text-gray-900" :class="c.unread && 'font-semibold'">{{ c.name }}</span>
            <span v-if="CONVERSATION_KIND[c.kind]" class="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">
              <component :is="kindIcon[c.kind]" :size="11" />{{ CONVERSATION_KIND[c.kind].label }}
            </span>
            <span class="ml-auto shrink-0 text-xs" :class="c.state === 'waiting' ? 'font-medium text-warning-500' : 'text-gray-500'">
              {{ c.state === 'waiting' ? 'Waiting…' : c.time }}
            </span>
          </span>
          <span class="mt-1 flex items-center gap-1.5 text-[13px]" :class="c.callback ? 'text-error-700' : 'text-gray-600'">
            <component :is="channelIcon[c.channel]" :size="14" class="shrink-0" :class="c.channel === 'missed' && 'text-error-500'" />
            <span class="truncate">{{ c.callback ? 'Missed call • Callback requested' : c.preview }}</span>
            <Star v-if="c.starred" :size="14" class="ml-auto shrink-0 fill-warning-500 text-warning-500" />
            <span v-if="c.unread" class="shrink-0 rounded-full bg-error-50 px-1.5 text-xs font-medium leading-5 text-error-500" :class="!c.starred && 'ml-auto'">{{ c.unread }}</span>
          </span>
          <button
            v-if="c.state"
            type="button"
            class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-success-200 bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 hover:bg-success-200"
            @click.stop
          >
            <Phone :size="13" />Pick up
          </button>
        </span>
      </li>
    </ul>
  </section>
</template>
