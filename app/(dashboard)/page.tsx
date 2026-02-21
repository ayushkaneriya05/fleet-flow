import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Navigation, AlertTriangle, PackageSearch } from 'lucide-react'

// Note: Ensure this page is dynamic so data updates 
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    pendingTrips
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
    prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
  ])

  const utilizationRate = totalVehicles > 0 
    ? Math.round((activeVehicles / totalVehicles) * 100) 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Command Center</h2>
        <p className="text-neutral-500">
          Overview of your fleet operations and logistics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Active Fleet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium border-b-0">Active Fleet</CardTitle>
            <Navigation className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Vehicles currently on trip
            </p>
          </CardContent>
        </Card>

        {/* KPI: Utilization Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium border-b-0">Utilization Rate</CardTitle>
            <Truck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Fleet assignment efficiency
            </p>
          </CardContent>
        </Card>

        {/* KPI: Maintenance Alerts */}
        <Card className={maintenanceVehicles > 0 ? 'border-red-200 bg-red-50/30' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium border-b-0">Maintenance & Repair</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${maintenanceVehicles > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceVehicles}</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Vehicles in shop
            </p>
          </CardContent>
        </Card>

        {/* KPI: Pending Cargo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium border-b-0">Pending Cargo</CardTitle>
            <PackageSearch className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTrips}</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Draft trips waiting dispatch
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Using dynamic export at the top handles caching
