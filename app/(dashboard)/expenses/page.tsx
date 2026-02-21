import { getFuelLogs } from '@/lib/actions/fuel.actions'
import { getVehicles } from '@/lib/actions/vehicle.actions'
import { getMaintenanceLogs } from '@/lib/actions/maintenance.actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import ExpenseForm from './ExpenseForm'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const [logs, vehicles, maintLogs] = await Promise.all([
    getFuelLogs(),
    getVehicles(),
    getMaintenanceLogs()
  ])

  // Calculation for total operational cost
  const totalFuelCost = logs.reduce((sum, log) => sum + log.cost, 0)
  const totalLiters = logs.reduce((sum, log) => sum + log.liters, 0)
  const totalMaintCost = maintLogs.reduce((sum, log) => sum + log.cost, 0)
  const totalOpCost = totalFuelCost + totalMaintCost

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Fuel & Expenses</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Log fuel transactions and monitor operational costs.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* KPI Summary Cards */}
        <div className="md:col-span-1 border-r border-neutral-100 pr-4 space-y-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-white shadow-sm border-indigo-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800">Total Ops Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900">${totalOpCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm border-emerald-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Total Fuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">${totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-emerald-700 mt-1">{totalLiters.toLocaleString()} Liters</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white shadow-sm border-amber-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Total Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">${totalMaintCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>

          {/* Form wrapper */}
          <div className="pt-4 border-t border-neutral-100 mt-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Log New Fuel Entry</h3>
            <ExpenseForm vehicles={vehicles} />
          </div>
        </div>

        {/* Logs Table */}
        <div className="md:col-span-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Fuel Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3 text-right">Volume</th>
                      <th className="px-4 py-3 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">No logs found</td>
                      </tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="border-b last:border-0 hover:bg-neutral-50">
                          <td className="px-4 py-3 text-neutral-600">{new Date(log.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-medium">
                            {log.vehicle.licensePlate}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-600">{log.liters.toLocaleString()} L</td>
                          <td className="px-4 py-3 text-right font-semibold text-emerald-600">${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
