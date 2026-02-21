'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDrivers() {
  return prisma.driver.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getEligibleDrivers() {
  const today = new Date()
  return prisma.driver.findMany({
    where: { 
      status: 'ON_DUTY',
      licenseExpiryDate: { gt: today }
    },
    orderBy: { name: 'asc' },
  })
}

export async function updateDriverStatus(driverId: string, status: 'ON_DUTY' | 'OFF_DUTY' | 'SUSPENDED') {
  try {
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { status },
    })
    revalidatePath('/drivers')
    return { success: true, driver }
  } catch (error: any) {
    return { success: false, error: 'Failed to update driver status.' }
  }
}
