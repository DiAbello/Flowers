import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { success: true, data: user }
})
