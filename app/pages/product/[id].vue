<template>
  <div class="py-8 md:py-12">
    <div class="container-shop">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Главная</NuxtLink>
        <span>/</span>
        <NuxtLink to="/catalog" class="hover:text-primary-600 transition-colors">Каталог</NuxtLink>
        <span>/</span>
        <span class="text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
          {{ product?.name }}
        </span>
      </nav>

      <!-- Loading -->
      <div v-if="pending" class="grid md:grid-cols-2 gap-12">
        <div class="skeleton aspect-[4/3] rounded-2xl" />
        <div class="space-y-4">
          <div class="skeleton h-8 w-3/4 rounded-xl" />
          <div class="skeleton h-6 w-1/3 rounded-xl" />
          <div class="skeleton h-32 w-full rounded-xl" />
          <div class="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>

      <!-- Product -->
      <div v-else-if="product" class="grid md:grid-cols-2 gap-8 lg:gap-16">
        <!-- Gallery -->
        <div>
          <ProductImageSlider :images="product.images" :name="product.name" />
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-6 animate-fade-in">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              {{ product.name }}
            </h1>
            <div class="flex items-center gap-4">
              <span class="text-3xl font-semibold text-primary-600 dark:text-primary-400">
                {{ formatPrice(product.price) }}
              </span>
              <span
                class="badge"
                :class="product.stock > 0
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
              >
                {{ product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии' }}
              </span>
            </div>
          </div>

          <p class="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
            {{ product.description }}
          </p>

          <!-- Quantity selector -->
          <div v-if="product.stock > 0" class="flex items-center gap-4">
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Количество:</span>
            <div class="flex items-center gap-2">
              <button
                class="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-center font-bold text-lg"
                :disabled="qty <= 1"
                @click="qty = Math.max(1, qty - 1)"
              >
                −
              </button>
              <span class="w-10 text-center font-semibold text-lg">{{ qty }}</span>
              <button
                class="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-center font-bold text-lg"
                :disabled="qty >= product.stock"
                @click="qty = Math.min(product.stock, qty + 1)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="btn-primary flex-1"
              :disabled="product.stock === 0"
              @click="handleAddToCart"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ cartStore.hasProduct(product.id) ? 'В корзине' : 'В корзину' }}
            </button>
            <NuxtLink
              v-if="cartStore.hasProduct(product.id)"
              to="/cart"
              class="btn-secondary flex-1 text-center"
            >
              Оформить заказ
            </NuxtLink>
          </div>

          <!-- Delivery info -->
          <div class="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div class="flex items-center gap-2">
              <span>🚚</span>
              <span>Доставка в день заказа при заказе до 14:00</span>
            </div>
            <div class="flex items-center gap-2">
              <span>🌸</span>
              <span>Свежие цветы — гарантия качества</span>
            </div>
            <div class="flex items-center gap-2">
              <span>🎁</span>
              <span>Красивая упаковка в подарок</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="text-center py-20">
        <p class="text-zinc-500 text-lg">Товар не найден</p>
        <NuxtLink to="/catalog" class="btn-primary mt-4 inline-flex">В каталог</NuxtLink>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal v-model="showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/types'
import type { Product } from '~/types'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notify = useNotify()

const showAuthModal = ref(false)
const qty = ref(1)

const { data, pending } = await useAsyncData(
  `product-${route.params.id}`,
  () =>
    $fetch<{ success: boolean; data: Product }>(`/api/products/${route.params.id}`).catch(
      () => null,
    ),
)

const product = computed(() => data.value?.data ?? null)

useSeoMeta({
  title: () => (product.value ? `${product.value.name} — Floria` : 'Товар — Floria'),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.name ?? '',
  ogImage: () => product.value?.images[0] ?? '',
})

function handleAddToCart() {
  if (!product.value) return

  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  cartStore.addItem(product.value, qty.value)
  notify.success('Добавлено в корзину', product.value.name)
}
</script>
