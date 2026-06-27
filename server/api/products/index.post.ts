import { z } from 'zod'
import prisma from '../../utils/prisma'
import { requireAdmin } from '../../utils/response'

const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug может содержать только буквы, цифры и дефис'),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().positive().multipleOf(0.01),
  stock: z.coerce.number().int().min(0),
  images: z.array(z.string().url()).min(1, 'Добавьте хотя бы одно фото'),
  isActive: z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const slugExists = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  })

  if (slugExists) {
    throw createError({ statusCode: 409, statusMessage: 'Slug уже используется' })
  }

  const product = await prisma.product.create({ data: parsed.data })

  setResponseStatus(event, 201)
  return { success: true, data: product }
})
