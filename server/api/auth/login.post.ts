import { z } from 'zod'
import { setCookie } from 'h3'
import prisma from '../../utils/prisma'
import { comparePassword } from '../../utils/hash'
import { signToken } from '../../utils/jwt'

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
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

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный email или пароль' })
  }

  const valid = await comparePassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный email или пароль' })
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role })

  setCookie(event, 'token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return {
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
})
