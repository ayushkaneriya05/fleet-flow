'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTrips() {
  return prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

interface DispatchTripInput {
  vehicleId: string
  driverId: string
  cargoWeight: number
  origin: string
  destination: string
  revenue: number
}

export async function createDraftTrip(data: DispatchTripInput) {
  try {
    const today = new Date()

    // 1. Transaction to ensure Atomicity and validation
    const result = await prisma.$transaction(async (tx: any) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } })
      const driver = await tx.driver.findUnique({ where: { id: data.driverId } })

      if (!vehicle || vehicle.status !== 'AVAILABLE') {
        throw new Error('Vehicle is not available.')
      }

      if (!driver || driver.status !== 'ON_DUTY') {
        throw new Error('Driver is not on duty.')
      }

      if (driver.licenseExpiryDate < today) {
        throw new Error('Driver license is expired.')
      }

      if (data.cargoWeight > vehicle.maxCapacityKg) {
        throw new Error(`Cargo exceeds vehicle capacity (${vehicle.maxCapacityKg}kg).`)
      }

      // We only CREATE the draft here. We don't mark as ON_TRIP.
      const trip = await tx.trip.create({
        data: {
          vehicleId: vehicle.id,
          driverId: driver.id,
          cargoWeight: data.cargoWeight,
          origin: data.origin,
          destination: data.destination,
          revenue: data.revenue,
          startOdometer: vehicle.odometer,
          status: 'DRAFT',
        }
      })

      return trip
    })

    revalidatePath('/trips')

    return { success: true, trip: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create draft trip.' }
  }
}

export async function dispatchDraftTrip(tripId: string) {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId } })

      if (!trip || trip.status !== 'DRAFT') {
        throw new Error('Trip is not in a draft state.')
      }

      // Ensure vehicle and driver are still available
      const vehicle = await tx.vehicle.findUnique({ where: { id: trip.vehicleId } })
      const driver = await tx.driver.findUnique({ where: { id: trip.driverId } })

      if (!vehicle || vehicle.status !== 'AVAILABLE') {
        throw new Error('Assigned vehicle is no longer available.')
      }
      if (!driver || driver.status !== 'ON_DUTY') {
        throw new Error('Assigned driver is no longer on duty.')
      }

      // Mark vehicle & driver as ON_TRIP, Update Trip to DISPATCHED
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'ON_TRIP' } })
      await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_TRIP' } })

      const dispatchedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'DISPATCHED' }
      })

      return dispatchedTrip
    })

    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    revalidatePath('/')

    return { success: true, trip: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to dispatch trip.' }
  }
}

export async function completeTrip(tripId: string, endOdometer: number) {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true }
      })

      if (!trip || trip.status === 'COMPLETED') {
        throw new Error('Trip not found or already completed.')
      }

      if (endOdometer < trip.startOdometer) {
        throw new Error('End odometer cannot be less than start odometer.')
      }

      // Update Vehicle
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: 'AVAILABLE',
          odometer: endOdometer
        }
      })

      // Update Driver
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_DUTY' }
      })

      // Complete Trip
      const completedTrip = await tx.trip.update({
        where: { id: tripId },
        data: {
          status: 'COMPLETED',
          endOdometer: endOdometer
        }
      })

      return completedTrip
    })

    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    revalidatePath('/')

    return { success: true, trip: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to complete trip.' }
  }
}

export async function cancelTrip(tripId: string) {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
      })

      if (!trip || trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
        throw new Error('Trip cannot be cancelled.')
      }

      // If it was dispatched, release the vehicle and driver
      if (trip.status === 'DISPATCHED') {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: 'AVAILABLE' }
        })

        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: 'ON_DUTY' }
        })
      }

      const cancelledTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: 'CANCELLED' }
      })

      return cancelledTrip
    })

    revalidatePath('/trips')
    revalidatePath('/vehicles')
    revalidatePath('/drivers')
    revalidatePath('/')

    return { success: true, trip: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to cancel trip.' }
  }
}
