import { z } from 'zod'
import prisma from '../../utils/prisma'
import { paginate } from '../../utils/response'

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  all: z.coerce.boolean().default(false),
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const parsed = querySchema.safeParse(query)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid query params' })
  }

  const { page, limit, search, sortBy, sortDir, all } = parsed.data

  const user = event.context.user
  const isAdmin = user?.role === 'ADMIN'

  const where = {
    ...(isAdmin && all ? {} : { isActive: true }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const { take, skip } = paginate(page, limit)

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      take,
      skip,
    }),
    prisma.product.count({ where }),
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
