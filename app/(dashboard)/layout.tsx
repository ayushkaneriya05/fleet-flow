import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('fleetflow_session')?.value
    if (token) {
      const payload = await verifyToken(token)
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { name: true, role: true }
      })
      if (dbUser) {
        user = dbUser
      }
    }
  } catch (error) {
    console.error('Error parsing token for header details')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
