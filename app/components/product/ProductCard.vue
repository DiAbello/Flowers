<template>
  <article
    class="card group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
  >
    <!-- Image slider -->
    <div class="relative overflow-hidden aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
      <NuxtLink :to="`/product/${product.id}`">
        <img
          v-if="product.images.length > 0"
          :src="currentImage"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          @error="handleImgError"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-4xl">🌸</div>
      </NuxtLink>

      <!-- Image dots -->
      <div
        v-if="product.images.length > 1"
        class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5"
      >
        <button
          v-for="(_, i) in product.images"
          :key="i"
          class="w-1.5 h-1.5 rounded-full transition-all"
          :class="i === currentIndex ? 'bg-white w-3' : 'bg-white/50'"
          @click="currentIndex = i"
        />
      </div>

      <!-- Nav arrows (on hover) -->
      <div v-if="product.images.length > 1" class="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <button
          class="pointer-events-auto w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          @click.prevent="prevImage"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          class="pointer-events-auto w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          @click.prevent="nextImage"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Out of stock overlay -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 bg-zinc-900/60 flex items-center justify-center"
      >
        <span class="badge bg-white text-zinc-900 text-xs px-3 py-1">Нет в наличии</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <NuxtLink :to="`/product/${product.id}`">
        <h3 class="font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-1 text-lg leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
          {{ product.name }}
        </h3>
      </NuxtLink>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between gap-3 mt-auto">
        <span class="text-xl font-semibold text-primary-600 dark:text-primary-400">
          {{ formatPrice(product.price) }}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-zinc-400">{{ product.stock > 0 ? `${product.stock} шт` : '' }}</span>
          <NuxtLink
            :to="`/product/${product.id}`"
            class="btn-secondary text-sm px-3 py-1.5 rounded-lg"
          >
            Подробнее
          </NuxtLink>
          <button
            class="btn-primary text-sm px-3 py-1.5 rounded-lg"
            :disabled="product.stock === 0"
            @click="handleAddToCart"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { formatPrice } from '~/types'
import type { Product } from '~/types'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ 'auth-required': [] }>()

const cartStore = useCartStore()
const authStore = useAuthStore()
const notify = useNotify()

const currentIndex = ref(0)
const currentImage = computed(() => props.product.images[currentIndex.value] ?? '')

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % props.product.images.length
}

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + props.product.images.length) % props.product.images.length
}

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/flower/400/300'
}

function handleAddToCart() {
  if (!authStore.isAuthenticated) {
    emit('auth-required')
    return
  }
  cartStore.addItem(props.product, 1)
  notify.success('Добавлено в корзину', props.product.name)
}
</script>
