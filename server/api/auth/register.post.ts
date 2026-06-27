import { z } from 'zod'
import prisma from '../../utils/prisma'
import { hashPassword } from '../../utils/hash'

const schema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(100),
  email: z.string().email('Некорректный email'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Пользователь с таким email уже существует',
    })
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  setResponseStatus(event, 201)
  return { success: true, data: user, message: 'Регистрация прошла успешно' }
})
