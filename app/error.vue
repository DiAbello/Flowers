<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
    <div class="text-center max-w-md animate-fade-in">
      <div class="text-8xl mb-6 font-serif text-primary-200 dark:text-primary-900">
        {{ error?.statusCode ?? 500 }}
      </div>
      <h1 class="text-3xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        {{ title }}
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        {{ message }}
      </p>
      <div class="flex gap-3 justify-center">
        <button class="btn-primary" @click="handleError">
          На главную
        </button>
        <button class="btn-secondary" @click="clearError">
          Попробовать снова
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() => {
  if (props.error?.statusCode === 404) return 'Страница не найдена'
  if (props.error?.statusCode === 403) return 'Доступ запрещён'
  if (props.error?.statusCode === 401) return 'Требуется авторизация'
  return 'Что-то пошло не так'
})

const message = computed(() => {
  if (props.error?.statusCode === 404)
    return 'Страница, которую вы ищете, не существует или была удалена.'
  if (props.error?.statusCode === 403)
    return 'У вас нет прав для просмотра этой страницы.'
  return props.error?.statusMessage || 'Произошла непредвиденная ошибка. Попробуйте позже.'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
