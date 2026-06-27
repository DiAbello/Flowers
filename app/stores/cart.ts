import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '~/types'

const CART_KEY_PREFIX = 'floria_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const _userId = ref<string | null>(null)

  // ── computed ──────────────────────────────────────────────────────────────
  const storageKey = computed(() =>
    _userId.value ? `${CART_KEY_PREFIX}_${_userId.value}` : null,
  )
  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const total = computed(() =>
    items.value.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
  )
  const isEmpty = computed(() => items.value.length === 0)
  const hasProduct = (productId: string) =>
    items.value.some((i) => i.product.id === productId)
  const getQuantity = (productId: string) =>
    items.value.find((i) => i.product.id === productId)?.quantity ?? 0

  // ── storage ───────────────────────────────────────────────────────────────
  function _load(key: string) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  }

  function _save() {
    if (!import.meta.client || !storageKey.value) return
    try {
      localStorage.setItem(storageKey.value, JSON.stringify(items.value))
    } catch {
      // ignore QuotaExceededError
    }
  }

  // ── user session ──────────────────────────────────────────────────────────
  /**
   * Вызывается из auth-стора после входа / выхода.
   * userId === null → сброс корзины (выход из аккаунта).
   */
  function setUser(userId: string | null) {
    if (!import.meta.client) return

    if (userId) {
      _userId.value = userId
      items.value = _load(`${CART_KEY_PREFIX}_${userId}`)
    } else {
      // Выход: очищаем память, ключ сбрасываем
      items.value = []
      _userId.value = null
    }
  }

  // ── actions ───────────────────────────────────────────────────────────────
  function addItem(product: Product, quantity = 1) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      items.value.push({ product, quantity: Math.min(quantity, product.stock) })
    }
    _save()
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((i) => i.product.id !== productId)
    _save()
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    item.quantity = Math.min(quantity, item.product.stock)
    _save()
  }

  function clear() {
    items.value = []
    _save()
  }

  return {
    items,
    count,
    total,
    isEmpty,
    hasProduct,
    getQuantity,
    setUser,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
})
