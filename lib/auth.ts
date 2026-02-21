import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fleet-flow-key-change-in-production'

export interface JWTPayload {
  userId: string
  role: Role
  exp?: number
}

/**
 * Generates a standard JWT token for a user.
 * Expires in 24 hours.
 */
export async function signToken(payload: Omit<JWTPayload, 'exp'>): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err || !token) reject(err)
        else resolve(token)
      }
    )
  })
}

/**
 * Verifies a JWT token and returns the payload.
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) reject(err)
      else resolve(decoded as JWTPayload)
    })
  })
}
