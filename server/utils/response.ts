import { H3Event } from 'h3'

export function apiSuccess<T>(data: T, message?: string) {
  return { success: true, data, message }
}

export function requireAuth(event: H3Event) {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}

export function requireAdmin(event: H3Event) {
  const user = requireAuth(event)
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}

export function paginate(page: number, limit: number) {
  const take = Math.min(Math.max(limit, 1), 100)
  const skip = (Math.max(page, 1) - 1) * take
  return { take, skip }
}
