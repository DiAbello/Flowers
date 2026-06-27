import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const product = await prisma.product.findUnique({ where: { id } })

  if (!product || (!product.isActive && event.context.user?.role !== 'ADMIN')) {
    throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
  }

  return { success: true, data: product }
})
