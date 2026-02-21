'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface FuelLogInput {
  vehicleId: string
  tripId?: string
  liters: number
  cost: number
  date: Date
}

export async function createFuelLog(data: FuelLogInput) {
  try {
    if (data.liters < 0 || data.cost < 0) {
      throw new Error('Fuel values cannot be negative')
    }

    const log = await prisma.fuelLog.create({
      data,
    })

    revalidatePath('/expenses')
    revalidatePath('/analytics')
    
    return { success: true, log }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to log fuel.' }
  }
}

export async function getFuelLogs() {
  return prisma.fuelLog.findMany({
    include: {
      vehicle: true,
      trip: true,
    },
    orderBy: { date: 'desc' },
  })
}
