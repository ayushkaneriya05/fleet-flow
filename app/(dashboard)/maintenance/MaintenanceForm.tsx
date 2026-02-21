'use client'

import { useState } from 'react'
import { Vehicle } from '@prisma/client'
import { createMaintenanceLog } from '@/lib/actions/maintenance.actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function MaintenanceForm({ vehicles }: { vehicles: Vehicle[] }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            vehicleId: formData.get('vehicleId') as string,
            description: formData.get('description') as string,
            cost: parseFloat(formData.get('cost') as string),
            date: new Date(),
        }

        if (!data.vehicleId || !data.description || isNaN(data.cost)) {
            setError('Please fill out all required fields properly.')
            setIsLoading(false)
            return
        }

        if (data.cost < 0) {
            setError('Cost cannot be negative.')
            setIsLoading(false)
            return
        }

        const res = await createMaintenanceLog(data)
        if (!res.success) {
            setError(res.error || 'Failed to submit log.')
        } else {
            (e.target as HTMLFormElement).reset()
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{error}</div>}

            <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Vehicle</label>
                <select
                    name="vehicleId"
                    required
                    className="w-full flex h-9 items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                >
                    <option value="">Select vehicle...</option>
                    {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.licensePlate} ({v.modelName})</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
                <input
                    name="description"
                    type="text"
                    required
                    placeholder="e.g. Oil Change"
                    className="w-full flex h-9 rounded-md border border-neutral-300 bg-transparent px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Cost ($)</label>
                <input
                    name="cost"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full flex h-9 rounded-md border border-neutral-300 bg-transparent px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6324eb]"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-[#6324eb] hover:bg-[#521dc4] h-9"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Submit Log (Sends to Shop)
            </Button>
        </form>
    )
}
