'use client'

import { Bell, LogOut, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-md lg:max-w-xs relative hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-full border-0 py-1.5 pl-10 pr-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-[#6324eb] sm:text-sm sm:leading-6 bg-neutral-50 transition-colors"
            placeholder="Search vehicles, drivers, trips..."
            type="search"
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center md:ml-6 gap-4">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-2"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Profile dropdown mockup */}
        <div className="relative ml-2 flex items-center gap-3 border-l pl-4 border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            <User className="h-5 w-5 text-neutral-500" />
          </div>
          <div className="hidden md:block flex-col text-sm">
            <span className="block font-medium text-neutral-700">Admin User</span>
            <span className="block text-xs text-neutral-500">Fleet Manager</span>
          </div>

          <button 
            onClick={handleLogout}
            className="ml-2 text-neutral-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
