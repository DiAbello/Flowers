import { z } from 'zod'
import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/response'

const itemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
})

const schema = z.object({
  phone: z
    .string()
    .min(7, 'Введите корректный телефон')
    .max(30),
  comment: z.string().max(500).optional(),
  items: z.array(itemSchema).min(1, 'Корзина пуста'),
})

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { phone, comment, items } = parsed.data

  // Fetch products and validate stock
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  })

  if (products.length !== productIds.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Один или несколько товаров недоступны',
    })
  }

  const productMap = new Map(products.map((p) => [p.id, p]))

  for (const item of items) {
    const product = productMap.get(item.productId)!
    if (product.stock < item.quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: `Недостаточно товара «${product.name}» на складе`,
      })
    }
  }

  // Calculate total
  const totalPrice = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!
    return sum + Number(product.price) * item.quantity
  }, 0)

  // Create order and update stock in transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        phone,
        comment,
        totalPrice,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    // Decrement stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return newOrder
  })

  setResponseStatus(event, 201)
  return { success: true, data: order }
})
