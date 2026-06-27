<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
        move-class="transition-all duration-300"
      >
        <div
          v-for="notif in store.items"
          :key="notif.id"
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-card border backdrop-blur-sm"
          :class="notifClass(notif.type)"
        >
          <span class="text-lg shrink-0 mt-0.5">{{ notifIcon(notif.type) }}</span>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm leading-snug">{{ notif.title }}</p>
            <p v-if="notif.message" class="text-xs mt-0.5 opacity-80">{{ notif.message }}</p>
          </div>
          <button
            class="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            @click="store.remove(notif.id)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'
import type { Notification } from '~/types'

const store = useNotificationsStore()

function notifClass(type: Notification['type']) {
  const map: Record<Notification['type'], string> = {
    success: 'bg-green-50 dark:bg-green-900/80 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/80 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  }
  return map[type]
}

function notifIcon(type: Notification['type']) {
  const map: Record<Notification['type'], string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }
  return map[type]
}
</script>
