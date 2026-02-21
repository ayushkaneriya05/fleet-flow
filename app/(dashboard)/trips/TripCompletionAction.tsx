'use client'

import { useState } from 'react'
import { completeTrip } from '@/lib/actions/trip.actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function TripCompletionAction({ tripId, startOdometer }: { tripId: string, startOdometer: number }) {
  const [endOdo, setEndOdo] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async () => {
    const odoNum = parseFloat(endOdo)
    if (isNaN(odoNum) || odoNum <= startOdometer) {
      setError(`Odometer must be > ${startOdometer}`)
      return
    }

    setIsLoading(true)
    setError(null)
    const res = await completeTrip(tripId, odoNum)
    if (!res.success) {
      setError(res.error || 'Failed to complete trip.')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <input
          type="number"
          placeholder="End Odometer"
          value={endOdo}
          onChange={(e) => setEndOdo(e.target.value)}
          className="flex h-8 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6324eb] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {error && <span className="text-[10px] text-red-500">{error}</span>}
      </div>
      <Button 
        size="sm" 
        onClick={handleComplete} 
        disabled={isLoading || !endOdo}
        className="h-8"
      >
        {isLoading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
        Complete
      </Button>
    </div>
  )
}
