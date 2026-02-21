'use client'

import { useState } from 'react'
import { cancelTrip } from '@/lib/actions/trip.actions'
import { Button } from '@/components/ui/button'
import { Loader2, XCircle } from 'lucide-react'

export default function TripCancelAction({ tripId }: { tripId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this trip?')) return

        setIsLoading(true)
        const res = await cancelTrip(tripId)
        if (!res.success) {
            alert(res.error || 'Failed to cancel trip.')
        }
        setIsLoading(false)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-neutral-500 hover:text-red-600 hover:bg-red-50 h-8"
            title="Cancel Trip"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
        </Button>
    )
}
