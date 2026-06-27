import { getCookie } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      event.context.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      }
    }
  }
})
