'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { licensePlate: 'asc' },
  })
}

export async function retireVehicle(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'RETIRED' },
    })
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, vehicle }
  } catch (error: any) {
    return { success: false, error: 'Failed to retire vehicle.' }
  }
}

export async function restoreVehicle(vehicleId: string) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'AVAILABLE' },
    })
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, vehicle }
  } catch (error: any) {
    return { success: false, error: 'Failed to restore vehicle.' }
  }
}

export async function createVehicle(data: {
  modelName: string;
  licensePlate: string;
  type: any;
  maxCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
}) {
  try {
    const vehicle = await prisma.vehicle.create({
      data: { ...data, status: 'AVAILABLE' },
    })
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, vehicle }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create vehicle.' }
  }
}

export async function updateVehicle(id: string, data: {
  modelName: string;
  licensePlate: string;
  type: any;
  maxCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
}) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    })
    revalidatePath('/vehicles')
    revalidatePath('/')
    return { success: true, vehicle }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update vehicle.' }
  }
}
