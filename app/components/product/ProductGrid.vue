<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!products.length" class="text-center py-20">
      <div class="text-5xl mb-4">🌷</div>
      <h3 class="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Ничего не найдено
      </h3>
      <p class="text-zinc-500 dark:text-zinc-400">
        Попробуйте изменить параметры поиска
      </p>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @auth-required="showAuthModal = true"
      />
    </div>

    <AuthModal v-model="showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{ products: Product[]; loading?: boolean }>()

const showAuthModal = ref(false)
</script>
