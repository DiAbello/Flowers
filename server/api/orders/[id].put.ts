import { z } from 'zod'
import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/response'

const schema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation Error' })
  }

  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Заказ не найден' })

  // Restore stock if cancelling a non-cancelled order
  if (parsed.data.status === 'CANCELLED' && existing.status !== 'CANCELLED') {
    const items = await prisma.orderItem.findMany({ where: { orderId: id } })
    await prisma.$transaction(
      items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    )
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    include: {
      items: { include: { product: { select: { id: true, name: true, images: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
  })

  return { success: true, data: order }
})
