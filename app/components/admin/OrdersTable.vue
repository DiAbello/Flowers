<template>
  <div>
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        v-for="opt in statusOptions"
        :key="opt.value ?? 'all'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
        :class="statusFilter === opt.value
          ? 'bg-primary-600 text-white border-primary-600'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-primary-300'"
        @click="setFilter(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th v-for="col in columns" :key="col" class="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <tr v-if="loading">
              <td :colspan="columns.length" class="py-12 text-center">
                <AppSpinner class="mx-auto" />
              </td>
            </tr>
            <tr v-else-if="!orders.length">
              <td :colspan="columns.length" class="py-12 text-center text-zinc-400">
                Заказов нет
              </td>
            </tr>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
            >
              <td class="px-4 py-3">
                <span class="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  #{{ order.id.slice(-8).toUpperCase() }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-zinc-900 dark:text-zinc-100">{{ order.user?.name }}</div>
                <div class="text-xs text-zinc-400">{{ order.user?.email }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="space-y-0.5">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    {{ item.product?.name }} × {{ item.quantity }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-semibold text-primary-600 dark:text-primary-400">
                {{ formatPrice(order.totalPrice) }}
              </td>
              <td class="px-4 py-3">
                <div class="text-sm">{{ order.phone }}</div>
                <div v-if="order.comment" class="text-xs text-zinc-400 mt-0.5 max-w-[150px] truncate" :title="order.comment">
                  {{ order.comment }}
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <span class="badge" :class="ORDER_STATUS_COLORS[order.status]">
                  {{ ORDER_STATUS_LABELS[order.status] }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="order.status === 'PENDING'"
                    class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                    title="Подтвердить"
                    @click="updateStatus(order.id, 'CONFIRMED')"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-if="order.status === 'CONFIRMED'"
                    class="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 transition-colors"
                    title="Выполнить"
                    @click="updateStatus(order.id, 'COMPLETED')"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    v-if="order.status !== 'CANCELLED' && order.status !== 'COMPLETED'"
                    class="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 transition-colors"
                    title="Отменить"
                    @click="updateStatus(order.id, 'CANCELLED')"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                    title="Удалить"
                    @click="confirmDelete(order)"
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
    </div>

    <!-- Delete Confirm -->
    <AppModal v-model="showDeleteModal" title="Удалить заказ?" max-width="sm">
      <p class="text-zinc-600 dark:text-zinc-400">
        Заказ <strong class="text-zinc-900 dark:text-zinc-100">#{{ deletingOrder?.id.slice(-8).toUpperCase() }}</strong> будет удалён.
      </p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button class="btn-secondary" @click="showDeleteModal = false">Отмена</button>
          <button class="btn-primary bg-red-600 hover:bg-red-700" :disabled="deleting" @click="deleteOrder">
            <AppSpinner v-if="deleting" size="sm" />
            Удалить
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from '~/composables/useOrders'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '~/types'
import type { Order, OrderStatus } from '~/types'
import AppModal from "~/components/ui/AppModal.vue";
import AppSpinner from "~/components/ui/AppSpinner.vue";

const { orders, loading, fetchOrders, updateOrderStatus, deleteOrder: apiDeleteOrder } = useOrders()
const notify = useNotify()

const statusFilter = ref<OrderStatus | undefined>(undefined)
const showDeleteModal = ref(false)
const deletingOrder = ref<Order | null>(null)
const deleting = ref(false)

const columns = ['ID', 'Клиент', 'Товары', 'Сумма', 'Телефон / Комментарий', 'Дата', 'Статус', 'Действия']

const statusOptions: Array<{ label: string; value?: OrderStatus }> = [
  { label: 'Все', value: undefined },
  { label: 'Ожидают', value: 'PENDING' },
  { label: 'Подтверждены', value: 'CONFIRMED' },
  { label: 'Выполнены', value: 'COMPLETED' },
  { label: 'Отменены', value: 'CANCELLED' },
]

function setFilter(status?: OrderStatus) {
  statusFilter.value = status
  fetchOrders({ status })
}

async function updateStatus(id: string, status: OrderStatus) {
  try {
    await updateOrderStatus(id, status)
    notify.success('Статус обновлён')
  } catch (e: unknown) {
    const error = e as { statusMessage?: string }
    notify.error('Ошибка', error.statusMessage)
  }
}

function confirmDelete(order: Order) {
  deletingOrder.value = order
  showDeleteModal.value = true
}

async function deleteOrder() {
  if (!deletingOrder.value) return
  deleting.value = true
  try {
    await apiDeleteOrder(deletingOrder.value.id)
    showDeleteModal.value = false
    notify.success('Заказ удалён')
  } finally {
    deleting.value = false
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

onMounted(() => fetchOrders())
</script>
