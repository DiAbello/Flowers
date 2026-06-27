import type { Order, PaginatedResponse, OrderStatus } from '~/types'

export function useOrders() {
  const loading = ref(false)
  const orders = ref<Order[]>([])
  const total = ref(0)
  const totalPages = ref(1)

  async function fetchOrders(params?: {
    page?: number
    limit?: number
    status?: OrderStatus
  }) {
    loading.value = true
    try {
      const { data } = await $fetch<{ success: boolean; data: PaginatedResponse<Order> }>(
        '/api/orders',
        { query: params },
      )
      orders.value = data.items
      total.value = data.total
      totalPages.value = data.totalPages
      return data
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id: string, status: OrderStatus) {
    const { data } = await $fetch<{ success: boolean; data: Order }>(`/api/orders/${id}`, {
      method: 'PUT',
      body: { status },
    })
    const idx = orders.value.findIndex((o) => o.id === id)
    if (idx !== -1) orders.value[idx] = data
    return data
  }

  async function deleteOrder(id: string) {
    await $fetch(`/api/orders/${id}`, { method: 'DELETE' })
    orders.value = orders.value.filter((o) => o.id !== id)
  }

  async function placeOrder(payload: {
    phone: string
    comment?: string
    items: Array<{ productId: string; quantity: number }>
  }) {
    return $fetch<{ success: boolean; data: Order }>('/api/orders', {
      method: 'POST',
      body: payload,
    })
  }

  return { orders, total, totalPages, loading, fetchOrders, updateOrderStatus, deleteOrder, placeOrder }
}
