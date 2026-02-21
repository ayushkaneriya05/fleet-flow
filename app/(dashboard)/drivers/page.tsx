import { getDrivers } from '@/lib/actions/driver.actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import DriverStatusToggle from './DriverStatusToggle'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DriversPage() {
  const drivers = await getDrivers()
  const today = new Date()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Driver Performance Grid</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Monitor compliance, safety scores, and duty status.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map(driver => {
          const isExpired = new Date(driver.licenseExpiryDate) < today
          
          return (
            <Card key={driver.id} className={isExpired ? 'border-red-200 shadow-sm' : 'shadow-sm'}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{driver.name}</CardTitle>
                    <p className="text-sm text-neutral-500">{driver.licenseCategory} • {driver.licenseNumber}</p>
                  </div>
                  {isExpired ? (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Expired</Badge>
                  ) : (
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Valid
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end border-b pb-3 mb-3">
                  <div>
                    <span className="block text-xs text-neutral-500 uppercase font-semibold mb-1">Safety Score</span>
                    <div className="flex items-center gap-2">
                       <span className={`text-2xl font-bold ${driver.safetyScore < 80 ? 'text-amber-500' : 'text-emerald-600'}`}>
                         {driver.safetyScore}
                       </span>
                       <span className="text-neutral-400 text-sm">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-neutral-500 uppercase font-semibold mb-1">Expiry Date</span>
                    <span className={`text-sm ${isExpired ? 'text-red-500 font-semibold flex items-center gap-1' : 'text-neutral-700'}`}>
                      {isExpired && <AlertTriangle className="w-3 h-3" />}
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

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
