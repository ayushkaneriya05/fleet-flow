import { getAvailableVehicles } from '@/lib/actions/vehicle.actions'
import { getMaintenanceLogs, getMaintenanceAlerts } from '@/lib/actions/maintenance.actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import MaintenanceForm from './MaintenanceForm'
import RepairedButton from './RepairedButton'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MaintenancePage() {
    const [availableVehicles, logs, inShopVehicles] = await Promise.all([
        getAvailableVehicles(),
        getMaintenanceLogs(),
        getMaintenanceAlerts()
    ])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Maintenance & Service</h2>
                    <p className="text-neutral-500 text-sm mt-1">
                        Log service events and manage vehicles currently in the shop.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Vehicles Currently In Shop */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Vehicles In Shop ({inShopVehicles.length})
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {inShopVehicles.length === 0 ? (
                            <div className="col-span-2 p-6 text-center border rounded-lg bg-neutral-50 text-neutral-500">
                                No vehicles currently require maintenance.
                            </div>
                        ) : (
                            inShopVehicles.map(v => (
                                <Card key={v.id} className="border-red-200 shadow-sm bg-red-50/10">
                                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base">{v.licensePlate}</CardTitle>
                                            <p className="text-xs text-neutral-500">{v.modelName}</p>
                                        </div>
                                        <Badge variant="destructive" className="bg-red-100 text-red-800">In Shop</Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2">
                                        <p className="text-sm text-neutral-700 bg-white p-2 rounded border border-red-100">
                                            <span className="font-semibold block text-xs text-neutral-500 uppercase mb-1">Latest Issue</span>
                                            {v.maintenanceLogs[0]?.description || 'Unknown reason'}
                                        </p>
                                        <div className="flex justify-end pt-2 border-t border-red-100">
                                            <RepairedButton vehicleId={v.id} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    <Card className="shadow-sm mt-6">
                        <CardHeader className="pb-3 border-b border-neutral-100">
                            <CardTitle className="text-lg">Service History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Vehicle</th>
                                            <th className="px-4 py-3">Service Details</th>
                                            <th className="px-4 py-3 text-right">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">No service records found</td>
                                            </tr>
                                        ) : (
                                            logs.map(log => (
                                                <tr key={log.id} className="hover:bg-neutral-50/50">
                                                    <td className="px-4 py-3 text-neutral-600">{new Date(log.date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 font-medium text-neutral-800">{log.vehicle.licensePlate}</td>
                                                    <td className="px-4 py-3 text-neutral-600">{log.description}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-red-600">${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Column */}
                <div className="md:col-span-1">
                    <Card className="shadow-sm border-blue-100 bg-blue-50/20 sticky top-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-blue-900">Log New Service Event</CardTitle>
                            <p className="text-xs text-blue-700 m-0">This will move the selected vehicle to "In Shop" status.</p>
                        </CardHeader>
                        <CardContent>
                            <MaintenanceForm vehicles={availableVehicles} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
