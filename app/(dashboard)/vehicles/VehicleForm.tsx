'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Vehicle } from '@prisma/client'
import { createVehicle, updateVehicle } from '@/lib/actions/vehicle.actions'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle } from 'lucide-react'

const vehicleSchema = z.object({
    modelName: z.string().min(2, 'Model name is required'),
    licensePlate: z.string().min(2, 'License plate is required'),
    type: z.enum(['TRUCK', 'VAN', 'BIKE']),
    maxCapacityKg: z.number().min(1, 'Capacity must be greater than 0'),
    odometer: z.number().min(0, 'Odometer cannot be negative'),
    acquisitionCost: z.number().min(0, 'Acquisition cost cannot be negative'),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

export default function VehicleForm({
    initialData,
    onSuccess,
    onCancel
}: {
    initialData?: Vehicle | null,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            modelName: initialData?.modelName || '',
            licensePlate: initialData?.licensePlate || '',
            type: initialData?.type as any || 'VAN',
            maxCapacityKg: initialData?.maxCapacityKg || 0,
            odometer: initialData?.odometer || 0,
            acquisitionCost: initialData?.acquisitionCost || 0,
        }
    })

    const onSubmit = async (data: VehicleFormValues) => {
        setSubmitError(null)

        const res = initialData
            ? await updateVehicle(initialData.id, data)
            : await createVehicle(data)

        if (res.success) {
            onSuccess()
        } else {
            setSubmitError(res.error || 'Failed to save vehicle.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl">
            <h3 className="font-semibold text-lg">{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>

            {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{submitError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">Model Name</label>
                    <input
                        {...register('modelName')}
                        type="text"
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    />
                    {errors.modelName && <p className="text-xs text-red-500">{errors.modelName.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">License Plate</label>
                    <input
                        {...register('licensePlate')}
                        type="text"
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    />
                    {errors.licensePlate && <p className="text-xs text-red-500">{errors.licensePlate.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">Vehicle Type</label>
                    <select
                        {...register('type')}
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    >
                        <option value="TRUCK">Truck</option>
                        <option value="VAN">Van</option>
                        <option value="BIKE">Bike</option>
                    </select>
                    {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">Max Capacity (kg)</label>
                    <input
                        {...register('maxCapacityKg', { valueAsNumber: true })}
                        type="number"
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    />
                    {errors.maxCapacityKg && <p className="text-xs text-red-500">{errors.maxCapacityKg.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">Current Odometer (km)</label>
                    <input
                        {...register('odometer', { valueAsNumber: true })}
                        type="number"
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    />
                    {errors.odometer && <p className="text-xs text-red-500">{errors.odometer.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-900">Acquisition Cost ($)</label>
                    <input
                        {...register('acquisitionCost', { valueAsNumber: true })}
                        type="number"
                        className="flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6324eb]"
                    />
                    {errors.acquisitionCost && <p className="text-xs text-red-500">{errors.acquisitionCost.message}</p>}
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#6324eb] hover:bg-[#521dc4]"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update' : 'Create'} Vehicle
                </Button>
            </div>
        </form>
    )
}
