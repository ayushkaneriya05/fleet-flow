import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcrypt'
import * as z from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCE_ANALYST']),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, email, password, role } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    })

    const token = await signToken({
      userId: user.id,
      role: user.role,
    })

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } }, { status: 201 })
    
    response.cookies.set({
      name: 'fleetflow_session',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
