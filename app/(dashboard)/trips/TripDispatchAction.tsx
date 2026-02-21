'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Loader2 } from 'lucide-react'
import { dispatchDraftTrip } from '@/lib/actions/trip.actions'

export default function TripDispatchAction({ tripId }: { tripId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDispatch = async () => {
        setIsLoading(true)
        const res = await dispatchDraftTrip(tripId)
        if (!res.success) {
            alert(res.error || 'Failed to dispatch trip.')
            setIsLoading(false)
        }
        // if successful, page revalidates anyway
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDispatch}
            disabled={isLoading}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
            {isLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
            Dispatch
        </Button>
    )
}
