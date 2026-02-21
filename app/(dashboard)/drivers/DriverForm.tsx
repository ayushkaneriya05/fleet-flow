'use client'

import { useState } from 'react'
import { createDriver } from '@/lib/actions/driver.actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function DriverForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const licenseNumber = formData.get('licenseNumber') as string
        const licenseCategory = formData.get('licenseCategory') as string
        const licenseExpiry = formData.get('licenseExpiry') as string

        if (!name || !licenseNumber || !licenseCategory || !licenseExpiry) {
            setError('Please fill all fields.')
            setIsLoading(false)
            return
        }

        const res = await createDriver({
            name,
            licenseNumber,
            licenseCategory,
            licenseExpiry: new Date(licenseExpiry)
        })

        if (res.success) {
            onSuccess()
        } else {
            setError(res.error || 'Failed to create driver.')
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-6">
            <h3 className="font-semibold text-lg text-neutral-900">Add New Driver</h3>

            {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full flex h-9 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">License Number</label>
                    <input
                        name="licenseNumber"
                        type="text"
                        required
                        className="w-full flex h-9 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">License Category</label>
                    <input
                        name="licenseCategory"
                        type="text"
                        placeholder="e.g. CDL-A"
                        required
                        className="w-full flex h-9 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">License Expiry</label>
                    <input
                        name="licenseExpiry"
                        type="date"
                        required
                        className="w-full flex h-9 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#6324eb] hover:bg-[#521dc4]"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Driver
                </Button>
            </div>
        </form>
    )
}
