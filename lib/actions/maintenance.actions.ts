'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface MaintenanceLogInput {
  vehicleId: string
  description: string
  cost: number
  date: Date
}

export async function createMaintenanceLog(data: MaintenanceLogInput) {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const log = await tx.maintenanceLog.create({
        data,
      })

      // Update vehicle status to IN_SHOP
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'IN_SHOP' },
      })

      return log
    })

    revalidatePath('/vehicles')
    revalidatePath('/expenses')
    revalidatePath('/')

    return { success: true, log: result }
  } catch (error: any) {
    return { success: false, error: 'Failed to create maintenance log.' }
  }
}

export async function getMaintenanceAlerts() {
  return prisma.vehicle.findMany({
    where: { status: 'IN_SHOP' },
    include: {
      maintenanceLogs: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  })
}

export async function getMaintenanceLogs() {
  return prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { date: 'desc' },
  })
}

export async function markRepaired(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId, status: 'IN_SHOP' },
      data: { status: 'AVAILABLE' }
    })
    revalidatePath('/maintenance')
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, vehicle }
  } catch (error: any) {
    return { success: false, error: 'Failed to mark vehicle as repaired.' }
  }
}
