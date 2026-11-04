<script setup>
// PROTOTYPE wiring for the settings page: dummy data + browser sound preview + real permission.
// The UI itself is notification-settings/NotificationSettings.vue.
import { ref } from 'vue'
import { notificationSounds } from '@/mock'
import { useInbox } from './useInbox'
import NotificationSettings from '../notification-settings/NotificationSettings.vue'
import { playTone } from '../notification-settings/playTone'

const { state } = useInbox()
const permission = ref('Notification' in window ? Notification.permission : 'unsupported')
async function fixPermission() {
  permission.value = await Notification.requestPermission()
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-gray-50 p-4 sm:p-8">
    <NotificationSettings
      v-model="state.notificationSettings"
      :sounds="notificationSounds"
      :permission="permission"
      @test-sound="playTone"
      @fix-permission="fixPermission"
    />
  </div>
</template>
