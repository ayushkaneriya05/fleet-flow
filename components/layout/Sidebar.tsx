'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Truck,
  Users,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Trips & Dispatch', href: '/trips', icon: ClipboardList },
  { name: 'Vehicle Registry', href: '/vehicles', icon: Truck },
  { name: 'Driver Management', href: '/drivers', icon: Users },
  { name: 'Maintenance & Service', href: '/maintenance', icon: ClipboardList },
  { name: 'Fuel & Expenses', href: '/expenses', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-[#0f172a] text-white">
      <div className="flex h-16 shrink-0 items-center px-6 bg-[#6324eb]">
        <Truck className="h-8 w-8 text-white mr-3" />
        <span className="text-xl font-bold tracking-tight text-white">FleetFlow</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            // Check if current path matches item.href, or spans subpaths (like /trips/new)
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-[#1e293b] text-white'
                    : 'text-neutral-300 hover:bg-[#1e293b] hover:text-white'
                  }`}
              >
                <item.icon
                  className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${isActive ? 'text-[#a78bfa]' : 'text-neutral-400 group-hover:text-neutral-300'
                    }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex shrink-0 border-t border-neutral-800 p-4">
        <Link href="/settings" className="group flex w-full items-center px-2 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-[#1e293b] hover:text-white transition-colors">
          <Settings className="flex-shrink-0 mr-3 h-5 w-5 text-neutral-400 group-hover:text-neutral-300" />
          Settings
        </Link>
      </div>
    </div>
  )
}
