import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authStore.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Доступ запрещён' })
  }
})
