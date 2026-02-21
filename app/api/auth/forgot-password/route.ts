import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { email, newPassword } = await request.json()

        if (!email || !newPassword) {
            return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 })
        }

        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            // Return success even if not found to prevent email enumeration
            return NextResponse.json({ success: true, message: 'Password reset successfully!' })
        }

        // Hash the new password and update the user
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })

        return NextResponse.json({
            success: true,
            message: 'Your password has been reset successfully. You can now log in.'
        })

    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
