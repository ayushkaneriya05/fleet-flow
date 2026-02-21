import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data (optional, but good for reliable seeding)
  await prisma.maintenanceLog.deleteMany()
  await prisma.fuelLog.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.user.deleteMany()

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = [
    { name: 'Admin User', email: 'admin@fleetflow.test', password: hashedPassword, role: 'FLEET_MANAGER' as const },
    { name: 'Dispatcher Dave', email: 'dispatcher@fleetflow.test', password: hashedPassword, role: 'DISPATCHER' as const },
    { name: 'Safety Sarah', email: 'safety@fleetflow.test', password: hashedPassword, role: 'SAFETY_OFFICER' as const },
    { name: 'Finance Frank', email: 'finance@fleetflow.test', password: hashedPassword, role: 'FINANCE_ANALYST' as const },
  ]

  for (const user of users) {
    await prisma.user.create({ data: user })
  }

  // Seed Vehicles
  const vehicles = [
    { modelName: 'Ford Transit', licensePlate: 'FL-TR-001', maxCapacityKg: 1500, odometer: 45000, acquisitionCost: 35000, status: 'AVAILABLE' as const },
    { modelName: 'Mercedes Sprinter', licensePlate: 'FL-SP-002', maxCapacityKg: 2000, odometer: 22000, acquisitionCost: 45000, status: 'AVAILABLE' as const },
    { modelName: 'Volvo FH16', licensePlate: 'FL-VO-003', maxCapacityKg: 25000, odometer: 150000, acquisitionCost: 120000, status: 'ON_TRIP' as const },
    { modelName: 'Scania R500', licensePlate: 'FL-SC-004', maxCapacityKg: 24000, odometer: 80000, acquisitionCost: 110000, status: 'IN_SHOP' as const },
    { modelName: 'Renault Master', licensePlate: 'FL-RE-005', maxCapacityKg: 1300, odometer: 300000, acquisitionCost: 28000, status: 'RETIRED' as const },
  ]

  const createdVehicles = []
  for (const vehicle of vehicles) {
    createdVehicles.push(await prisma.vehicle.create({ data: vehicle }))
  }

  // Seed Drivers
  const drivers = [
    { name: 'John Doe', licenseNumber: 'DL12345678', licenseCategory: 'Class A', licenseExpiryDate: new Date('2027-12-31'), safetyScore: 98, status: 'ON_DUTY' as const },
    { name: 'Jane Smith', licenseNumber: 'DL87654321', licenseCategory: 'Class B', licenseExpiryDate: new Date('2028-06-15'), safetyScore: 100, status: 'ON_TRIP' as const },
    { name: 'Mike Johnson', licenseNumber: 'DL11223344', licenseCategory: 'Class A', licenseExpiryDate: new Date('2025-01-10'), safetyScore: 85, status: 'SUSPENDED' as const }, // Expired license effectively, or suspended
  ]

  const createdDrivers = []
  for (const driver of drivers) {
    createdDrivers.push(await prisma.driver.create({ data: driver }))
  }

  // Seed a Trip for the ON_TRIP driver and vehicle
  const activeTrip = await prisma.trip.create({
    data: {
      vehicleId: createdVehicles[2].id, // Volvo FH16
      driverId: createdDrivers[1].id,   // Jane Smith
      cargoWeight: 18000,
      origin: 'New York, NY',
      destination: 'Chicago, IL',
      revenue: 4500,
      startOdometer: 149000,
      status: 'DISPATCHED',
    }
  })

  // Seed some maintenance and fuel logs
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: createdVehicles[3].id, // Scania (IN_SHOP)
      description: 'Engine overhaul and brake pad replacement',
      cost: 3200,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  })

  await prisma.fuelLog.create({
    data: {
      vehicleId: createdVehicles[2].id, // Volvo (active trip)
      tripId: activeTrip.id,
      liters: 450,
      cost: 585,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    }
  })

  console.log('Database seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
