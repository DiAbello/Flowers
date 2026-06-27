<template>
  <div class="py-8 md:py-12">
    <div class="container-shop">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Каталог цветов
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400">
          {{ total ? `${total} товаров` : 'Загрузка...' }}
        </p>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="search"
            type="search"
            placeholder="Поиск цветов..."
            class="input-base pl-10"
            @input="debouncedSearch"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex gap-3">
          <select v-model="sortBy" class="input-base w-auto" @change="loadProducts">
            <option value="createdAt">По дате</option>
            <option value="price">По цене</option>
            <option value="name">По названию</option>
          </select>
          <button
            class="btn-secondary px-3"
            :title="sortDir === 'asc' ? 'По убыванию' : 'По возрастанию'"
            @click="toggleSort"
          >
            <svg v-if="sortDir === 'asc'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9M3 12h5m8 0l4-4m0 0l-4-4m4 4H11" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Products grid -->
      <ProductGrid :loading="pending" :products="products" />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center gap-2">
        <button
          v-for="p in pagesArray"
          :key="p"
          class="w-10 h-10 rounded-xl font-medium text-sm transition-all"
          :class="p === page
            ? 'bg-primary-600 text-white shadow-glow'
            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary-300'"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { Product, PaginatedResponse } from '~/types'

useSeoMeta({
  title: 'Каталог цветов — Floria',
  description: 'Выберите идеальный букет из нашего каталога свежих цветов.',
})

const search = ref('')
const sortBy = ref<'createdAt' | 'price' | 'name'>('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)

const { data, pending, refresh } = await useAsyncData(
  'catalog',
  () =>
    $fetch<{ success: boolean; data: PaginatedResponse<Product> }>('/api/products', {
      query: {
        page: page.value,
        limit: 12,
        search: search.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
      },
    }),
  { watch: [page, sortBy, sortDir] },
)

const products = computed(() => data.value?.data.items ?? [])
watchEffect(() => {
  if (data.value) {
    total.value = data.value.data.total
    totalPages.value = data.value.data.totalPages
  }
})

const pagesArray = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1),
)

async function loadProducts() {
  page.value = 1
  await refresh()
}

function toggleSort() {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  loadProducts()
}

function goToPage(p: number) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const debouncedSearch = useDebounceFn(loadProducts, 400)
</script>
