import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  email: string
  role: 'USER' | 'ADMIN'
  iat?: number
  exp?: number
}

function getSecret(): string {
  const config = useRuntimeConfig()
  return config.jwtSecret as string
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload
  } catch {
    return null
  }
}
