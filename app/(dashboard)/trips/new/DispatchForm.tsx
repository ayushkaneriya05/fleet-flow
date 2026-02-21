'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Driver, Vehicle } from '@prisma/client'
import { createDraftTrip } from '@/lib/actions/trip.actions'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

// Validation Schema mapping exactly to Prisma constraints
const tripSchema = z.object({
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  driverId: z.string().min(1, 'Please select a driver'),
  cargoWeight: z.number().min(1, 'Cargo weight must be greater than 0'),
  origin: z.string().min(3, 'Origin is required'),
  destination: z.string().min(3, 'Destination is required'),
  revenue: z.number().min(0, 'Revenue cannot be negative'),
})

type TripFormValues = z.infer<typeof tripSchema>

export default function DispatchForm({
  vehicles,
  drivers
}: {
  vehicles: Vehicle[]
  drivers: Driver[]
}) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicleId: '',
      driverId: '',
      cargoWeight: 0,
      origin: '',
      destination: '',
      revenue: 0,
    }
  })

  // Watch for dynamic validation UI (e.g. matching capacity)
  const selectedVehicleId = watch('vehicleId')
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  const onSubmit = async (data: TripFormValues) => {
    setSubmitError(null)

    // Extra client-side validation just to be sure before server action
    if (selectedVehicle && data.cargoWeight > selectedVehicle.maxCapacityKg) {
      setSubmitError(`Cargo exceeds vehicle capacity (${selectedVehicle.maxCapacityKg}kg).`)
      return
    }

    const res = await createDraftTrip(data)
    if (res.success) {
      router.push('/trips')
    } else {
      setSubmitError(res.error || 'Failed to dispatch trip.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Vehicle</label>
          <select
            {...register('vehicleId')}
            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select available vehicle...</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.licensePlate} ({v.modelName}) - Cap: {v.maxCapacityKg}kg
              </option>
            ))}
          </select>
          {errors.vehicleId && <p className="text-sm text-red-500">{errors.vehicleId.message}</p>}
        </div>

        {/* Driver Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Driver</label>
          <select
            {...register('driverId')}
            className="w-full flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select eligible driver...</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.licenseCategory}) - Score: {d.safetyScore}
              </option>
            ))}
          </select>
          {errors.driverId && <p className="text-sm text-red-500">{errors.driverId.message}</p>}
        </div>

        {/* Route: Origin */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Origin</label>
          <input
            {...register('origin')}
            type="text"
            placeholder="e.g. Warehouse A, New York"
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1"
          />
          {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
        </div>

        {/* Route: Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Destination</label>
          <input
            {...register('destination')}
            type="text"
            placeholder="e.g. Distribution Center, Chicago"
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1"
          />
          {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
        </div>

        {/* Cargo Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Cargo Weight (kg)</label>
          <input
            {...register('cargoWeight', { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1"
          />
          {errors.cargoWeight && <p className="text-sm text-red-500">{errors.cargoWeight.message}</p>}
          {selectedVehicle && (
            <p className="text-xs text-neutral-500">Max allowed: {selectedVehicle.maxCapacityKg} kg</p>
          )}
        </div>

        {/* Revenue */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-900">Estimated Revenue ($)</label>
          <input
            {...register('revenue', { valueAsNumber: true })}
            type="number"
            placeholder="0.00"
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb] focus:ring-offset-1"
          />
          {errors.revenue && <p className="text-sm text-red-500">{errors.revenue.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-neutral-800 hover:bg-neutral-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save as Draft
        </Button>
      </div>
    </form>
  )
}
