import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/response'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })

  // Soft delete — just deactivate if has orders, hard delete if not
  const ordersCount = await prisma.orderItem.count({ where: { productId: id } })

  if (ordersCount > 0) {
    await prisma.product.update({ where: { id }, data: { isActive: false } })
    return { success: true, message: 'Товар деактивирован (есть связанные заказы)' }
  }

  await prisma.product.delete({ where: { id } })
  return { success: true, message: 'Товар удалён' }
})
