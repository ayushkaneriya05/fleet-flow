'use client'

import { useState } from 'react'
import { updateDriverStatus } from '@/lib/actions/driver.actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function DriverStatusToggle({ 
  driverId, 
  currentStatus 
}: { 
  driverId: string, 
  currentStatus: 'ON_DUTY' | 'OFF_DUTY' | 'SUSPENDED' | 'ON_TRIP' 
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (newStatus: 'ON_DUTY' | 'OFF_DUTY' | 'SUSPENDED') => {
    setIsLoading(true)
    await updateDriverStatus(driverId, newStatus)
    setIsLoading(false)
  }

  // If on trip, they can't change status directly
  if (currentStatus === 'ON_TRIP') {
    return <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">ON TRIP</span>
  }

  if (currentStatus === 'SUSPENDED') {
    return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">SUSPENDED</span>
  }

  return (
    <div className="flex gap-1 bg-white p-1 rounded-md border border-neutral-200 shadow-sm">
      <Button
        variant={currentStatus === 'ON_DUTY' ? 'default' : 'ghost'}
        size="sm"
        className={`h-7 px-3 text-xs ${currentStatus === 'ON_DUTY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-neutral-500'}`}
        onClick={() => handleToggle('ON_DUTY')}
        disabled={isLoading || currentStatus === 'ON_DUTY'}
      >
        On Duty
      </Button>
      <Button
        variant={currentStatus === 'OFF_DUTY' ? 'default' : 'ghost'}
        size="sm"
        className={`h-7 px-3 text-xs ${currentStatus === 'OFF_DUTY' ? 'bg-neutral-600 hover:bg-neutral-700' : 'text-neutral-500'}`}
        onClick={() => handleToggle('OFF_DUTY')}
        disabled={isLoading || currentStatus === 'OFF_DUTY'}
      >
        Off Duty
      </Button>
      {isLoading && <Loader2 className="w-4 h-4 text-neutral-400 animate-spin ml-1" />}
    </div>
  )
}
