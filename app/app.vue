<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import NotificationContainer from "~/components/layout/NotificationContainer.vue";

const authStore = useAuthStore()
const cartStore = useCartStore()

// Восстанавливаем сессию с сервера
await authStore.fetchMe()

// На клиенте — загружаем корзину под текущего пользователя
onMounted(() => {
  if (authStore.user) {
    cartStore.setUser(authStore.user.id)
  }
})
</script>
