<template>
  <div class="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <header
      class="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div class="container-shop flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <span class="text-xl">🌸</span>
            <span class="font-serif text-xl font-semibold">Floria</span>
          </NuxtLink>
          <span
            class="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full"
          >
            Админ
          </span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/catalog" class="btn-ghost text-sm">
            Каталог
          </NuxtLink>
          <button class="btn-secondary text-sm px-4 py-2" @click="logout">
            Выйти
          </button>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  await authStore.logout()
  router.push('/')
}
</script>
