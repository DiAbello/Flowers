<template>
  <AppModal v-model="modelValue" title="Вход в аккаунт" max-width="xs">
    <div class="text-center space-y-4">
      <div class="text-4xl">🔐</div>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Для оформления заказа необходимо войти в аккаунт
      </p>
      <div class="flex gap-2 pt-1">
        <NuxtLink
          to="/auth/register"
          class="btn-secondary flex-1 text-sm px-3 py-2.5"
          @click="modelValue = false"
        >
          Регистрация
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="btn-primary flex-1 text-sm px-3 py-2.5"
          @click="modelValue = false"
        >
          Войти
        </NuxtLink>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import AppModal from "~/components/ui/AppModal.vue";

const modelValue = defineModel<boolean>({ required: true })
const authStore = useAuthStore()

// Закрыть модалку, если пользователь уже авторизовался
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) modelValue.value = false
})
</script>
