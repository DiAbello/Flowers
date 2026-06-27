import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')

  async function fetchMe() {
    try {
      const { data } = await $fetch<{ success: boolean; data: User }>('/api/auth/me')
      user.value = data
      // Корзина инициализируется в app.vue после fetchMe
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data } = await $fetch<{ success: boolean; data: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = data
      // Загружаем корзину этого пользователя
      if (import.meta.client) {
        const { useCartStore } = await import('~/stores/cart')
        useCartStore().setUser(data.id)
      }
      return { success: true }
    } catch (err: unknown) {
      const error = err as { statusMessage?: string; data?: Record<string, string[]> }
      return {
        success: false,
        message: error.statusMessage || 'Ошибка входа',
        errors: error.data,
      }
    } finally {
      loading.value = false
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    loading.value = true
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, confirmPassword },
      })
      return { success: true }
    } catch (err: unknown) {
      const error = err as { statusMessage?: string; data?: Record<string, string[]> }
      return {
        success: false,
        message: error.statusMessage || 'Ошибка регистрации',
        errors: error.data,
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      // Сбрасываем корзину до очистки user, чтобы setUser(null) сработал корректно
      if (import.meta.client) {
        const { useCartStore } = await import('~/stores/cart')
        useCartStore().setUser(null)
      }
      user.value = null
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isUser,
    fetchMe,
    login,
    register,
    logout,
  }
})
