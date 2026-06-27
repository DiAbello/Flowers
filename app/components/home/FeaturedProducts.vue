<template>
  <section class="py-20 md:py-28">
    <div class="container-shop">
      <div class="flex items-end justify-between mb-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Популярные букеты
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400">Любимые покупателями</p>
        </div>
        <NuxtLink to="/catalog" class="hidden sm:flex btn-ghost text-sm gap-1">
          Весь каталог
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductSkeleton v-for="i in 4" :key="i"/>
      </div>

      <!-- Products -->
      <div
          v-else-if="products.length"
          class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @auth-required="showAuthModal = true"
        />
      </div>

      <div class="text-center mt-10 sm:hidden">
        <NuxtLink to="/catalog" class="btn-primary">Посмотреть все букеты</NuxtLink>
      </div>
    </div>

    <AuthModal v-model="showAuthModal"/>
  </section>
</template>

<script setup lang="ts">
import type {Product, PaginatedResponse} from '~/types'

const showAuthModal = ref(false)

const { data, pending } = await useAsyncData('featured-products', () =>
    $fetch<{ success: boolean; data: PaginatedResponse<Product> }>('/api/products', {
      query: {limit: 4, sortBy: 'createdAt', sortDir: 'desc'},
    }),
)

const products = computed(() => data.value?.data.items ?? [])
</script>
