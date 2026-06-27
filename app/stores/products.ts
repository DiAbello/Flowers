import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, PaginatedResponse } from '~/types'

export const useProductsStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const totalPages = ref(1)
  const loading = ref(false)
  const currentProduct = ref<Product | null>(null)
  const currentProductLoading = ref(false)

  async function fetchProducts(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDir?: 'asc' | 'desc'
    all?: boolean
  }) {
    loading.value = true
    try {
      const { data } = await $fetch<{ success: boolean; data: PaginatedResponse<Product> }>(
        '/api/products',
        { query: params },
      )
      items.value = data.items
      total.value = data.total
      page.value = data.page
      totalPages.value = data.totalPages
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string) {
    currentProductLoading.value = true
    try {
      const { data } = await $fetch<{ success: boolean; data: Product }>(`/api/products/${id}`)
      currentProduct.value = data
      return data
    } finally {
      currentProductLoading.value = false
    }
  }

  async function createProduct(payload: Partial<Product>) {
    const { data } = await $fetch<{ success: boolean; data: Product }>('/api/products', {
      method: 'POST',
      body: payload,
    })
    items.value.unshift(data)
    total.value++
    return data
  }

  async function updateProduct(id: string, payload: Partial<Product>) {
    const { data } = await $fetch<{ success: boolean; data: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: payload,
    })
    const idx = items.value.findIndex((p) => p.id === id)
    if (idx !== -1) items.value[idx] = data
    if (currentProduct.value?.id === id) currentProduct.value = data
    return data
  }

  async function deleteProduct(id: string) {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    items.value = items.value.filter((p) => p.id !== id)
    total.value--
  }

  return {
    items,
    total,
    page,
    totalPages,
    loading,
    currentProduct,
    currentProductLoading,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
