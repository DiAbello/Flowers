<template>
  <div class="py-8">
    <div class="container-shop">
      <div class="mb-8">
        <h1 class="text-3xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
          Панель управления
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 mt-1">
          Управление товарами и заказами
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id
            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tab.badge"
            class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- Products tab -->
      <div v-show="activeTab === 'products'">
        <AdminProductTable />
      </div>

      <!-- Orders tab -->
      <div v-show="activeTab === 'orders'">
        <AdminOrdersTable />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
useSeoMeta({ title: 'Панель управления — Floria' })

const activeTab = ref<'products' | 'orders'>('products')
const pendingOrdersCount = ref(0)

const tabs = computed(() => [
  { id: 'products' as const, label: 'Товары' },
  { id: 'orders' as const, label: 'Заказы', badge: pendingOrdersCount.value || null },
])

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: { total: number; items: unknown[] } }>(
      '/api/orders',
      { query: { status: 'PENDING', limit: 1 } },
    )
    pendingOrdersCount.value = res.data.total
  } catch {
    // ignore
  }
})
</script>
