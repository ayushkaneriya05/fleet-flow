import Link from 'next/link'
import { getTrips, completeTrip } from '@/lib/actions/trip.actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Navigation, Banknote } from 'lucide-react'
import TripCompletionAction from './TripCompletionAction'
import TripCancelAction from './TripCancelAction'
import TripDispatchAction from './TripDispatchAction'

export const dynamic = 'force-dynamic'

export default async function TripsPage() {
  const trips = await getTrips()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Trips & Dispatch</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Manage active routes and dispatch new fleet operations.
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="bg-[#6324eb] hover:bg-[#521dc4]">
            <Plus className="w-4 h-4 mr-2" />
            Dispatch Trip
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.length === 0 ? (
          <div className="col-span-full p-8 text-center text-neutral-500 bg-white rounded-lg border border-neutral-200">
            No trips dispatched yet.
          </div>
        ) : (
          trips.map(trip => (
            <Card key={trip.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${trip.status === 'COMPLETED' ? 'bg-emerald-500' :
                trip.status === 'DISPATCHED' ? 'bg-blue-500' :
                  trip.status === 'CANCELLED' ? 'bg-red-500' : 'bg-neutral-300'
                }`} />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-neutral-400" />
                    {trip.origin} <span className="text-neutral-300 mx-1">→</span> {trip.destination}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {trip.status === 'DRAFT' && (
                      <TripDispatchAction tripId={trip.id} />
                    )}
                    {(trip.status === 'DISPATCHED' || trip.status === 'DRAFT') && (
                      <TripCancelAction tripId={trip.id} />
                    )}
                    <Badge variant={
                      trip.status === 'COMPLETED' ? 'default' :
                        (trip.status === 'DISPATCHED' || trip.status === 'DRAFT') ? 'secondary' : 'outline'
                    } className={
                      trip.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        trip.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                          trip.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                            trip.status === 'CANCELLED' ? 'bg-red-50 text-red-700' : ''
                    }>
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-neutral-500 block text-xs">Vehicle</span>
                    <span className="font-medium">{trip.vehicle.licensePlate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-xs">Driver</span>
                    <span className="font-medium">{trip.driver.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-xs flex items-center gap-1"><Banknote className="w-3 h-3" /> Revenue</span>
                    <span className="font-medium text-emerald-600">${trip.revenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-xs">Start Odo</span>
                    <span className="font-medium">{trip.startOdometer} km</span>
                  </div>
                </div>

                {trip.status === 'DISPATCHED' && (
                  <div className="pt-3 border-t border-neutral-100 mt-2">
                    <TripCompletionAction tripId={trip.id} startOdometer={trip.startOdometer} />
                  </div>
                )}
                {trip.status === 'COMPLETED' && trip.endOdometer && (
                  <div className="pt-3 border-t border-neutral-100 mt-2 text-sm text-neutral-600">
                    <div>Distance Driven: <span className="font-semibold text-neutral-900">{trip.endOdometer - trip.startOdometer} km</span></div>
                    <div>Income: <span className="font-semibold text-emerald-600">${trip.revenue.toLocaleString()}</span></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
