import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fleet-flow-key-change-in-production'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 2. Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 3. Generate JWT containing userId, role, and expiration
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 4. Store JWT in a manual HTTP-only cookie
    const response = NextResponse.json({ success: true, role: user.role })
    
    response.cookies.set({
      name: 'fleetflow_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
