import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/response'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Заказ не найден' })

  await prisma.order.delete({ where: { id } })

  return { success: true, message: 'Заказ удалён' }
})
