import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '~/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<Notification[]>([])

  function add(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    const duration = notification.duration ?? 4000
    items.value.push({ ...notification, id, duration })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }

    return id
  }

  function remove(id: string) {
    items.value = items.value.filter((n) => n.id !== id)
  }

  function success(title: string, message?: string) {
    return add({ type: 'success', title, message })
  }

  function error(title: string, message?: string) {
    return add({ type: 'error', title, message, duration: 6000 })
  }

  function warning(title: string, message?: string) {
    return add({ type: 'warning', title, message })
  }

  function info(title: string, message?: string) {
    return add({ type: 'info', title, message })
  }

  return { items, add, remove, success, error, warning, info }
})
