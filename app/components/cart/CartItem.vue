<template>
  <div class="card p-4 flex gap-4 animate-fade-in">
    <!-- Image -->
    <NuxtLink :to="`/product/${item.product.id}`" class="shrink-0">
      <img
        :src="item.product.images[0]"
        :alt="item.product.name"
        class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
        loading="lazy"
        @error="handleImgError"
      />
    </NuxtLink>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <NuxtLink :to="`/product/${item.product.id}`" class="hover:text-primary-600 transition-colors">
        <h3 class="font-serif font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
          {{ item.product.name }}
        </h3>
      </NuxtLink>
      <p class="text-primary-600 dark:text-primary-400 font-semibold mt-1">
        {{ formatPrice(item.product.price) }}
      </p>

      <div class="flex items-center justify-between mt-3">
        <!-- Quantity -->
        <div class="flex items-center gap-2">
          <button
            class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center font-bold transition-colors"
            :disabled="item.quantity <= 1"
            @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
          >
            −
          </button>
          <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
          <button
            class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center font-bold transition-colors"
            :disabled="item.quantity >= item.product.stock"
            @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
          >
            +
          </button>
        </div>

        <div class="flex items-center gap-3">
          <span class="font-semibold text-zinc-900 dark:text-zinc-100">
            {{ formatPrice(Number(item.product.price) * item.quantity) }}
          </span>
          <button
            class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            aria-label="Удалить"
            @click="cartStore.removeItem(item.product.id)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { formatPrice } from '~/types'
import type { CartItem } from '~/types'

defineProps<{ item: CartItem }>()

const cartStore = useCartStore()

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/flower/200/200'
}
</script>
