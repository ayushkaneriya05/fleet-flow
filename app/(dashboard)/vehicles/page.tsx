import { getVehicles } from '@/lib/actions/vehicle.actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import VehicleTableClient from './VehicleTableClient'

export const dynamic = 'force-dynamic'

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="space-y-6 p-1">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Vehicle Registry</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Manage your fleet lifecycle and statuses.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-neutral-200">
        <CardContent className="p-0">
          <VehicleTableClient initialVehicles={vehicles} />
        </CardContent>
      </Card>
    </div>
  )
}
