<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md animate-slide-up">
      <div class="card p-8">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🌺</div>
          <h1 class="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
            Регистрация
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Создайте аккаунт и получите доступ к заказам
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="handleRegister">
          <AppInput
            v-model="form.name"
            label="Имя"
            placeholder="Иван Петров"
            autocomplete="name"
            :error="errors.name"
            @blur="touch('name')"
          />
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
            placeholder="Минимум 8 символов"
            autocomplete="new-password"
            :error="errors.password"
            @blur="touch('password')"
          />
          <AppInput
            v-model="form.confirmPassword"
            label="Подтверждение пароля"
            type="password"
            placeholder="Повторите пароль"
            autocomplete="new-password"
            :error="errors.confirmPassword"
            @blur="touch('confirmPassword')"
          />

          <div v-if="serverError" class="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3">
            {{ serverError }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="authStore.loading">
            <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ authStore.loading ? 'Регистрируем...' : 'Создать аккаунт' }}
          </button>
        </form>

        <p class="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          Уже есть аккаунт?
          <NuxtLink to="/auth/login" class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Войти
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
useSeoMeta({ title: 'Регистрация — Floria' })

const authStore = useAuthStore()
const notify = useNotify()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const serverError = ref('')

const { errors, validate, touch } = useValidation(form, {
  name: [
    (v) => !!v || 'Введите имя',
    (v) => (v as string).length >= 2 || 'Минимум 2 символа',
  ],
  email: [
    (v) => !!v || 'Введите email',
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string) || 'Некорректный email',
  ],
  password: [
    (v) => !!v || 'Введите пароль',
    (v) => (v as string).length >= 8 || 'Минимум 8 символов',
  ],
  confirmPassword: [
    (v) => !!v || 'Повторите пароль',
    (v) => v === form.password || 'Пароли не совпадают',
  ],
})

async function handleRegister() {
  if (!validate()) return
  serverError.value = ''

  const result = await authStore.register(
    form.name,
    form.email,
    form.password,
    form.confirmPassword,
  )

  if (result.success) {
    notify.success('Регистрация прошла успешно!', 'Войдите в аккаунт')
    router.push('/auth/login')
  } else {
    serverError.value = result.message ?? 'Ошибка регистрации'
  }
}
</script>
