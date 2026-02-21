'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function DashboardFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentType = searchParams.get('type') || 'ALL'
    const currentStatus = searchParams.get('status') || 'ALL'

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value === 'ALL') {
                params.delete(name)
            } else {
                params.set(name, value)
            }
            return params.toString()
        },
        [searchParams]
    )

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`/?${createQueryString('type', e.target.value)}`)
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`/?${createQueryString('status', e.target.value)}`)
    }

    return (
        <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-neutral-200 mb-6">
            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-neutral-700">Filter By:</span>
            </div>

            <div className="flex gap-3 flex-1">
                <select
                    value={currentType}
                    onChange={handleTypeChange}
                    className="h-9 px-3 py-1 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6324eb] bg-neutral-50"
                >
                    <option value="ALL">All Vehicle Types</option>
                    <option value="TRUCK">Trucks</option>
                    <option value="VAN">Vans</option>
                    <option value="BIKE">Bikes</option>
                </select>

                <select
                    value={currentStatus}
                    onChange={handleStatusChange}
                    className="h-9 px-3 py-1 rounded-md border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6324eb] bg-neutral-50"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_TRIP">On Trip</option>
                    <option value="IN_SHOP">In Shop</option>
                    <option value="RETIRED">Retired</option>
                </select>
            </div>
        </div>
    )
}
