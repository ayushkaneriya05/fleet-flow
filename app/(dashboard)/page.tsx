import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Navigation, AlertTriangle, PackageSearch } from 'lucide-react'
import DashboardFilters from './DashboardFilters'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function DashboardPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const typeFilter = searchParams.type as string
  const statusFilter = searchParams.status as string

  const vehicleWhere: any = {}
  if (typeFilter && typeFilter !== 'ALL') vehicleWhere.type = typeFilter
  if (statusFilter && statusFilter !== 'ALL') vehicleWhere.status = statusFilter

  const activeWhere = { ...vehicleWhere, status: 'ON_TRIP' }
  const maintWhere = { ...vehicleWhere, status: 'IN_SHOP' }

  // Adjust logic if statusFilter is provided manually, so KPI cards make sense.
  // E.g., if statusFilter is 'RETIRED', activeVehicles count should be 0 logically.

  const [
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    pendingTrips,
    recentTrips
  ] = await Promise.all([
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.vehicle.count({ where: Object.keys(vehicleWhere).includes('status') ? vehicleWhere : activeWhere }),
    prisma.vehicle.count({ where: Object.keys(vehicleWhere).includes('status') ? vehicleWhere : maintWhere }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
    prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        vehicle: true,
        driver: true,
      }
    })
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

      <DashboardFilters />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI: Active Fleet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium border-b-0">Total matching Fleet</CardTitle>
            <Navigation className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Vehicles matching filters
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
            <CardTitle className="text-sm font-medium border-b-0">Maintenance / Selected</CardTitle>
            <AlertTriangle className={`h-4 w-4 \${maintenanceVehicles > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceVehicles}</div>
            <p className="text-xs text-muted-foreground p-0 m-0">
              Vehicles in state matching
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

      {/* Recent Activity Section */}
      <h3 className="text-lg font-semibold text-neutral-900 mt-8 mb-4">Recent Trip Activity</h3>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No recent activity</td>
                  </tr>
                ) : (
                  recentTrips.map(trip => (
                    <tr key={trip.id} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={
                          trip.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            trip.status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              trip.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700 border-gray-300' : ''
                        }>
                          {trip.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-700">
                        {trip.origin} <span className="text-neutral-400 mx-1">→</span> {trip.destination}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{trip.vehicle?.licensePlate || 'N/A'}</td>
                      <td className="px-4 py-3 text-neutral-600">{trip.driver?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-right text-neutral-500">{new Date(trip.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
