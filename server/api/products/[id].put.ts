import { z } from 'zod'
import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/response'

const schema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.coerce.number().positive().multipleOf(0.01).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  isActive: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  })

  return { success: true, data: product }
})
