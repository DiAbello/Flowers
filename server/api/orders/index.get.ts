import { z } from 'zod'
import prisma from '../../utils/prisma'
import { requireAuth, paginate } from '../../utils/response'

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
    .optional(),
})

export default defineEventHandler(async (event) => {
  const { userId, role } = requireAuth(event)

  const query = getQuery(event)
  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid query' })
  }

  const { page, limit, status } = parsed.data
  const { take, skip } = paginate(page, limit)

  const isAdmin = role === 'ADMIN'

  const where = {
    ...(isAdmin ? {} : { userId }),
    ...(status ? { status } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  return {
    success: true,
    data: {
      items,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  }
})
