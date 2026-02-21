'use client'

import { useState } from 'react'
import { markRepaired } from '@/lib/actions/maintenance.actions'
import { Button } from '@/components/ui/button'
import { Loader2, Wrench } from 'lucide-react'

export default function RepairedButton({ vehicleId }: { vehicleId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleMarkRepaired = async () => {
        setIsLoading(true)
        const res = await markRepaired(vehicleId)
        if (!res.success) {
            alert(res.error || 'Failed to mark repaired.')
        }
        setIsLoading(false)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleMarkRepaired}
            disabled={isLoading}
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8"
        >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wrench className="w-4 h-4 mr-2" />}
            Mark Repaired
        </Button>
    )
}
