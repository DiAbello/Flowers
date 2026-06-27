export type UserRole = 'USER' | 'ADMIN'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  images: string[]
  isActive: boolean
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Pick<Product, 'id' | 'name' | 'images'>
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  user?: Pick<User, 'id' | 'name' | 'email'>
  items: OrderItem[]
  phone: string
  comment?: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: Record<string, string[]>
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждён',
  COMPLETED: 'Выполнен',
  CANCELLED: 'Отменён',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(Number(price))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
        ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
        н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
        ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
        ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
