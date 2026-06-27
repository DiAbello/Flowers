<template>
  <div>
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1 max-w-sm">
        <input
          v-model="search"
          type="search"
          placeholder="Поиск товаров..."
          class="input-base pl-9"
          @input="debouncedSearch"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button class="btn-primary ml-auto" @click="openCreate">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Добавить товар
      </button>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 select-none"
                @click="col.sortable && sort(col.key)"
              >
                <span class="flex items-center gap-1">
                  {{ col.label }}
                  <svg
                    v-if="col.sortable && sortBy === col.key"
                    class="w-3 h-3 transition-transform"
                    :class="{ 'rotate-180': sortDir === 'asc' }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr v-if="loading">
              <td :colspan="columns.length + 1" class="py-12 text-center">
                <AppSpinner class="mx-auto" />
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td :colspan="columns.length + 1" class="py-12 text-center text-zinc-400">
                Товары не найдены
              </td>
            </tr>
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover shrink-0"
                    loading="lazy"
                    @error="handleImgError"
                  />
                  <span class="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {{ product.name }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-primary-600 dark:text-primary-400">
                {{ formatPrice(product.price) }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="product.stock > 0
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="badge"
                  :class="product.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'"
                >
                  {{ product.isActive ? 'Активен' : 'Скрыт' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                    title="Редактировать"
                    @click="openEdit(product)"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    title="Удалить"
                    @click="confirmDelete(product)"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <span class="text-sm text-zinc-500 dark:text-zinc-400">
          Всего: {{ total }}
        </span>
        <div class="flex gap-1">
          <button
            v-for="p in totalPages"
            :key="p"
            class="w-8 h-8 rounded-lg text-sm font-medium transition-all"
            :class="p === page
              ? 'bg-primary-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <AdminProductFormModal
      v-model="showModal"
      :product="editingProduct"
      @saved="onSaved"
    />

    <!-- Delete confirm modal -->
    <AppModal v-model="showDeleteModal" title="Удалить товар?" max-width="sm">
      <p class="text-zinc-600 dark:text-zinc-400">
        Товар «<strong class="text-zinc-900 dark:text-zinc-100">{{ deletingProduct?.name }}</strong>» будет удалён.
        Это действие нельзя отменить.
      </p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button class="btn-secondary" @click="showDeleteModal = false">Отмена</button>
          <button class="btn-primary bg-red-600 hover:bg-red-700" :disabled="deleting" @click="deleteProduct">
            <AppSpinner v-if="deleting" size="sm" />
            {{ deleting ? 'Удаляем...' : 'Удалить' }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useProductsStore } from '~/stores/products'
import { formatPrice } from '~/types'
import type { Product, PaginatedResponse } from '~/types'
import AppSpinner from "~/components/ui/AppSpinner.vue";
import AppModal from "~/components/ui/AppModal.vue";

const productsStore = useProductsStore()
const notify = useNotify()

const search = ref('')
const sortBy = ref('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const products = ref<Product[]>([])

const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const showDeleteModal = ref(false)
const deletingProduct = ref<Product | null>(null)
const deleting = ref(false)

const columns = [
  { key: 'name', label: 'Название', sortable: true },
  { key: 'price', label: 'Цена', sortable: true },
  { key: 'stock', label: 'Склад', sortable: true },
  { key: 'status', label: 'Статус', sortable: false },
]

async function loadProducts() {
  loading.value = true
  try {
    const { data } = await $fetch<{ success: boolean; data: PaginatedResponse<Product> }>(
      '/api/products',
      {
        query: {
          page: page.value,
          limit: 15,
          search: search.value || undefined,
          sortBy: sortBy.value,
          sortDir: sortDir.value,
          all: true,
        },
      },
    )
    products.value = data.items
    total.value = data.total
    totalPages.value = data.totalPages
  } finally {
    loading.value = false
  }
}

function sort(key: string) {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortBy.value = key
    sortDir.value = 'desc'
  }
  loadProducts()
}

function goToPage(p: number) {
  page.value = p
  loadProducts()
}

function openCreate() {
  editingProduct.value = null
  showModal.value = true
}

function openEdit(product: Product) {
  editingProduct.value = product
  showModal.value = true
}

function confirmDelete(product: Product) {
  deletingProduct.value = product
  showDeleteModal.value = true
}

async function deleteProduct() {
  if (!deletingProduct.value) return
  deleting.value = true
  try {
    await productsStore.deleteProduct(deletingProduct.value.id)
    products.value = products.value.filter((p) => p.id !== deletingProduct.value!.id)
    total.value--
    showDeleteModal.value = false
    notify.success('Товар удалён')
  } catch (e: unknown) {
    const error = e as { statusMessage?: string }
    notify.error('Ошибка', error.statusMessage)
  } finally {
    deleting.value = false
  }
}

function onSaved(product: Product) {
  const idx = products.value.findIndex((p) => p.id === product.id)
  if (idx !== -1) {
    products.value[idx] = product
  } else {
    products.value.unshift(product)
    total.value++
  }
}

function handleImgError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/flower/100/100'
}

const debouncedSearch = useDebounceFn(() => {
  page.value = 1
  loadProducts()
}, 400)

onMounted(loadProducts)
</script>
