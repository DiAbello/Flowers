<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md animate-slide-up">
      <!-- Card -->
      <div class="card p-8">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🌸</div>
          <h1 class="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
            Вход в аккаунт
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Добро пожаловать в Floria
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <AppInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            :error="errors.email"
            @blur="touch('email')"
          />
          <AppInput
            v-model="form.password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            autocomplete="current-password"
            :error="errors.password"
            @blur="touch('password')"
          />

          <div v-if="serverError" class="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3">
            {{ serverError }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="authStore.loading">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ authStore.loading ? 'Входим...' : 'Войти' }}
          </button>
        </form>

        <p class="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          Нет аккаунта?
          <NuxtLink to="/auth/register" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Зарегистрироваться
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import AppInput from "~/components/ui/AppInput.vue";

definePageMeta({ middleware: 'guest' })
useSeoMeta({ title: 'Вход — Floria' })

const authStore = useAuthStore()
const notify = useNotify()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const serverError = ref('')

const { errors, validate, touch } = useValidation(form, {
  email: [
    (v) => !!v || 'Введите email',
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string) || 'Некорректный email',
  ],
  password: [(v) => !!v || 'Введите пароль'],
})

async function handleLogin() {
  if (!validate()) return
  serverError.value = ''

  const result = await authStore.login(form.email, form.password)
  if (result.success) {
    notify.success('Добро пожаловать!', authStore.user?.name)
    const redirect = route.query.redirect as string
    router.push(redirect || (authStore.isAdmin ? '/admin' : '/'))
  } else {
    serverError.value = result.message ?? 'Ошибка входа'
  }
}
</script>
