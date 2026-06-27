<template>
  <div class="py-8 md:py-12">
    <div class="container-shop">
      <h1 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-8">
        Корзина
        <span v-if="cartStore.count" class="text-xl text-zinc-400 font-sans font-normal ml-2">
          ({{ cartStore.count }})
        </span>
      </h1>

      <!-- Empty cart -->
      <div v-if="cartStore.isEmpty" class="text-center py-20 animate-fade-in">
        <div class="text-6xl mb-6">🌸</div>
        <h2 class="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Корзина пуста
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-8">
          Выберите цветы из нашего каталога
        </p>
        <NuxtLink to="/catalog" class="btn-primary">Перейти в каталог</NuxtLink>
      </div>

      <!-- Cart content -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Items list -->
        <div class="lg:col-span-2 space-y-4">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.product.id"
            :item="item"
          />
        </div>

        <!-- Summary & Checkout -->
        <div class="space-y-6">
          <!-- Summary card -->
          <div class="card p-6 sticky top-24">
            <h2 class="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Итого
            </h2>
            <div class="space-y-3 mb-6">
              <div
                v-for="item in cartStore.items"
                :key="item.product.id"
                class="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span class="truncate mr-2">{{ item.product.name }} × {{ item.quantity }}</span>
                <span class="font-medium shrink-0">{{ formatPrice(Number(item.product.price) * item.quantity) }}</span>
              </div>
              <div class="border-t border-zinc-200 dark:border-zinc-700 pt-3 flex justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                <span>Сумма</span>
                <span class="text-primary-600 dark:text-primary-400 text-lg">{{ formatPrice(cartStore.total) }}</span>
              </div>
            </div>

            <!-- Order form -->
            <div v-if="authStore.isAuthenticated">
              <h3 class="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Оформление заказа</h3>
              <form class="space-y-4" @submit.prevent="placeOrder">
                <div>
                  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Телефон *
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    class="input-base"
                    :class="{ 'input-error': formErrors.phone }"
                  />
                  <p v-if="formErrors.phone" class="mt-1 text-xs text-red-500">{{ formErrors.phone }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Комментарий
                  </label>
                  <textarea
                    v-model="form.comment"
                    rows="3"
                    placeholder="Пожелания, адрес доставки..."
                    class="input-base resize-none"
                  />
                </div>
                <button
                  type="submit"
                  class="btn-primary w-full"
                  :disabled="placing"
                >
                  <svg v-if="placing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ placing ? 'Оформляем...' : 'Оформить заказ' }}
                </button>
              </form>
            </div>

            <!-- Guest prompt -->
            <div v-else class="text-center py-4">
              <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Для оформления заказа необходимо войти в аккаунт
              </p>
              <NuxtLink to="/auth/login" class="btn-primary w-full">
                Войти
              </NuxtLink>
              <NuxtLink to="/auth/register" class="btn-ghost w-full mt-2 text-sm">
                Создать аккаунт
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/types'

useSeoMeta({ title: 'Корзина — Floria' })

const cartStore = useCartStore()
const authStore = useAuthStore()
const notify = useNotify()
const router = useRouter()

const placing = ref(false)
const form = reactive({ phone: '', comment: '' })
const formErrors = reactive<Record<string, string>>({})

function validateForm() {
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
  if (!form.phone.trim()) {
    formErrors.phone = 'Введите номер телефона'
    return false
  }
  if (form.phone.replace(/\D/g, '').length !== 11) {
    formErrors.phone = 'Введите корректный номер телефона'
    return false
  }
  return true
}

async function placeOrder() {
  if (!validateForm()) return

  placing.value = true
  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        phone: form.phone,
        comment: form.comment || undefined,
        items: cartStore.items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      },
    })
    cartStore.clear()
    notify.success('Заказ оформлен!', 'Мы свяжемся с вами в ближайшее время')
    router.push('/')
  } catch (err: unknown) {
    const error = err as { statusMessage?: string }
    notify.error('Ошибка', error.statusMessage || 'Не удалось оформить заказ')
  } finally {
    placing.value = false
  }
}
</script>
