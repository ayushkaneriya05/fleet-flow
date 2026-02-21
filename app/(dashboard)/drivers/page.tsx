import { getDrivers } from '@/lib/actions/driver.actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import DriverStatusToggle from './DriverStatusToggle'
import { AlertTriangle, ShieldCheck, FileText, Truck } from 'lucide-react'
import AddDriverWrapper from './AddDriverWrapper'

export const dynamic = 'force-dynamic'

export default async function DriversPage() {
  const drivers = await getDrivers()
  const today = new Date()

  // Calculate stats for each driver
  const driversWithStats = drivers.map(driver => {
    // @ts-ignore
    const trips = driver.trips || []
    const completed = trips.filter((t: any) => t.status === 'COMPLETED').length
    const total = trips.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { ...driver, completedTrips: completed, totalTrips: total, completionRate }
  })

  // Group drivers conceptually
  const onDutyCount = drivers.filter(d => d.status === 'ON_DUTY').length
  const totalCount = drivers.length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Driver Performance Grid</h2>
          <p className="text-neutral-500 text-sm mt-1">
            {onDutyCount} of {totalCount} drivers currently on duty.
          </p>
        </div>
        <AddDriverWrapper />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {driversWithStats.map(driver => {
          const isExpired = new Date(driver.licenseExpiryDate) < today
          const isSuspended = driver.status === 'SUSPENDED'

          return (
            <Card key={driver.id} className={`shadow-sm border transition-all ${isSuspended ? 'opacity-70 bg-neutral-50 border-neutral-200' :
              isExpired ? 'border-red-200' : 'border-neutral-200 hover:shadow-md'
              }`}>
              <CardHeader className="pb-3 border-b border-neutral-100/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-neutral-800">{driver.name}</CardTitle>
                    <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                      <FileText className="w-3 h-3" /> {driver.licenseCategory}
                      <span className="text-neutral-300 mx-1">•</span>
                      {driver.licenseNumber}
                    </p>
                  </div>
                  <Badge variant={
                    driver.status === 'ON_DUTY' && !isExpired ? 'default' :
                      driver.status === 'ON_DUTY' && isExpired ? 'destructive' : 'secondary'
                  } className={
                    driver.status === 'ON_DUTY' && !isExpired ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' :
                      isSuspended ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''
                  }>
                    {driver.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Safety Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1 line-clamp-1 text-ellipsis">
                    <span className="text-neutral-500 flex items-center gap-1">
                      {driver.safetyScore >= 90 ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> :
                        driver.safetyScore < 70 ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                          <ShieldCheck className="w-4 h-4 text-amber-500" />}
                      Safety Score
                    </span>
                    <span className="font-semibold text-neutral-700">{driver.safetyScore}/100</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${driver.safetyScore >= 90 ? 'bg-emerald-500' :
                        driver.safetyScore < 70 ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      style={{ width: `${driver.safetyScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Trip Stats and Expiry */}
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-100/50 pb-3">
                  <div>
                    <span className="text-xs text-neutral-500 block mb-1">Trip Completion</span>
                    <span className="font-semibold flex items-center gap-1"><Truck className="w-3 h-3 text-neutral-400" /> {driver.completionRate}% ({driver.totalTrips})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block mb-1">Expiry Date</span>
                    <span className={`text-sm ${isExpired ? 'text-red-500 font-semibold flex items-center justify-end gap-1' : 'text-neutral-700'}`}>
                      {isExpired && <AlertTriangle className="w-3 h-3" />}
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status Toggles Wrapper */}
                <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                  <span className="text-sm font-medium text-neutral-700">Duty Status</span>
                  <DriverStatusToggle driverId={driver.id} currentStatus={driver.status} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
