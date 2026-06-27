<template>
  <header
    class="sticky top-0 z-40 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
      : 'bg-transparent'"
  >
    <div class="container-shop">
      <nav class="flex items-center justify-between h-16 md:h-18">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl transition-transform group-hover:scale-110">🌸</span>
          <span class="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Floria
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            active-class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-2">
          <!-- Dark mode toggle -->
          <button
            class="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            :aria-label="isDark ? 'Светлая тема' : 'Тёмная тема'"
            @click="toggleTheme"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Cart button (hidden for admin) -->
          <NuxtLink
            v-if="!authStore.isAdmin"
            to="/cart"
            class="relative p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartStore.count > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in"
            >
              {{ cartStore.count > 9 ? '9+' : cartStore.count }}
            </span>
          </NuxtLink>

          <!-- Avatar menu (авторизован) — виден на всех размерах -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="userMenuRef">
            <button
              class="relative w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold ring-2 ring-transparent hover:ring-primary-400 dark:hover:ring-primary-500 transition-all"
              :title="authStore.user?.name"
              @click="userMenuOpen = !userMenuOpen"
            >
              {{ authStore.user?.name[0]?.toUpperCase() }}
              <!-- Online dot -->
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white dark:ring-zinc-950" />
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out origin-top-right"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in origin-top-right"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-card border border-zinc-100 dark:border-zinc-800 overflow-hidden z-50"
              >
                <!-- User info -->
                <div class="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <p class="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {{ authStore.user?.name }}
                  </p>
                  <p class="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                    {{ authStore.user?.email }}
                  </p>
                  <span
                    v-if="authStore.isAdmin"
                    class="inline-flex mt-1.5 badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  >
                    Администратор
                  </span>
                </div>

                <!-- Menu items -->
                <div class="py-1">
                  <NuxtLink
                    v-if="authStore.isAdmin"
                    to="/admin"
                    class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Панель управления
                  </NuxtLink>

                  <button
                    class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    @click="handleLogout"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Auth buttons (не авторизован, только desktop) -->
          <div v-else class="hidden md:flex items-center gap-2">
            <NuxtLink to="/auth/login" class="btn-ghost text-sm px-3 py-2">
              Войти
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary text-sm px-4 py-2">
              Регистрация
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile menu -->
    <LayoutMobileMenu v-model="mobileMenuOpen" />
  </header>
</template>

<script setup lang="ts">
import { useScroll, onClickOutside } from '@vueuse/core'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useColorMode } from '#imports'

const cartStore = useCartStore()
const authStore = useAuthStore()
const notify = useNotify()
const router = useRouter()
const colorMode = useColorMode()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const { y } = useScroll(window)
const scrolled = computed(() => y.value > 20)

const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

onClickOutside(userMenuRef, () => { userMenuOpen.value = false })

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
  ]
})

async function handleLogout() {
  userMenuOpen.value = false
  await authStore.logout()
  notify.success('До свидания!')
  router.push('/')
}
</script>
