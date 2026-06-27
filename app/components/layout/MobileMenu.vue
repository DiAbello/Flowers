<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="modelValue"
      class="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    >
      <div class="container-shop py-4 space-y-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          @click="$emit('update:modelValue', false)"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-3">
          <div v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3 px-4 py-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 flex items-center justify-center font-semibold">
                {{ authStore.user?.name[0]?.toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ authStore.user?.name }}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              @click="handleLogout"
            >
              Выйти
            </button>
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <NuxtLink
              to="/auth/login"
              class="btn-secondary text-center"
              @click="$emit('update:modelValue', false)"
            >
              Войти
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="btn-primary text-center"
              @click="$emit('update:modelValue', false)"
            >
              Регистрация
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const authStore = useAuthStore()
const notify = useNotify()
const router = useRouter()

const navLinks = computed(() => {
  if (authStore.isAdmin) {
    return [
      { to: '/catalog', label: 'Каталог' },
      { to: '/admin', label: 'Управление' },
    ]
  }
  return [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/cart', label: 'Корзина' },
  ]
})

async function handleLogout() {
  emit('update:modelValue', false)
  await authStore.logout()
  notify.success('До свидания!')
  router.push('/')
}
</script>
