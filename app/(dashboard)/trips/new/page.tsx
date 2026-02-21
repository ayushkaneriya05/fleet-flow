import { getAvailableVehicles } from '@/lib/actions/vehicle.actions'
import { getEligibleDrivers } from '@/lib/actions/driver.actions'
import DispatchForm from './DispatchForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function NewTripPage() {
  const [vehicles, drivers] = await Promise.all([
    getAvailableVehicles(),
    getEligibleDrivers(),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Dispatch New Trip</h2>
        <p className="text-neutral-500 text-sm mt-1">
          Assign an available vehicle and eligible driver to a new route.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>All fields are required. Cargo weight must not exceed vehicle capacity.</CardDescription>
        </CardHeader>
        <CardContent>
          <DispatchForm vehicles={vehicles} drivers={drivers} />
        </CardContent>
      </Card>
    </div>
  )
}
