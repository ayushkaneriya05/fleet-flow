import { prisma } from '@/lib/prisma'
import AnalyticsCharts from './AnalyticsCharts'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  // 1. Fetch expenses for trend
  const fuelLogs = await prisma.fuelLog.findMany({
    orderBy: { date: 'asc' },
    select: { date: true, cost: true, liters: true, vehicle: { select: { modelName: true } } }
  })
  const maintLogs = await prisma.maintenanceLog.findMany({
    orderBy: { date: 'asc' },
    select: { date: true, cost: true }
  })

  // Format Monthly Trend
  const monthlyDataMap = new Map<string, { month: string, fuel: number, maintenance: number }>()

  // Combine and bucket into months
  const allDates = [...fuelLogs.map((l: any) => l.date), ...maintLogs.map((l: any) => l.date)]
  const uniqueMonths = Array.from(new Set(allDates.map((d: any) => d.toLocaleString('default', { month: 'short', year: 'numeric' }))))

  uniqueMonths.forEach(m => monthlyDataMap.set(m, { month: m, fuel: 0, maintenance: 0 }))

  fuelLogs.forEach((log: any) => {
    const m = log.date.toLocaleString('default', { month: 'short', year: 'numeric' })
    const entry = monthlyDataMap.get(m)!
    entry.fuel += log.cost
  })

  maintLogs.forEach((log: any) => {
    const m = log.date.toLocaleString('default', { month: 'short', year: 'numeric' })
    const entry = monthlyDataMap.get(m)!
    entry.maintenance += log.cost
  })

  const expenseTrendData = Array.from(monthlyDataMap.values())

  // 2. Fetch Vehicle ROI Data
  const vehicles = await prisma.vehicle.findMany({
    include: {
      trips: { select: { revenue: true, status: true, startOdometer: true, endOdometer: true } },
      maintenanceLogs: { select: { cost: true } },
      fuelLogs: { select: { cost: true, liters: true } }
    }
  })

  let totalSystemRevenue = 0
  let totalSystemCosts = 0
  let totalSystemAcquisition = 0

  const roiData = vehicles.map((v: any) => {
    const totalRev = v.trips.reduce((s: any, t: any) => s + t.revenue, 0)
    const totalMaint = v.maintenanceLogs.reduce((s: any, m: any) => s + m.cost, 0)
    const totalFuelCost = v.fuelLogs.reduce((s: any, f: any) => s + f.cost, 0)
    const totalFuelLiters = v.fuelLogs.reduce((s: any, f: any) => s + f.liters, 0)
    const totalCosts = totalMaint + totalFuelCost
    const netProfit = totalRev - totalCosts
    const roiPercent = v.acquisitionCost > 0 ? (netProfit / v.acquisitionCost) * 100 : 0

    const totalDistance = v.trips
      .filter((t: any) => t.status === 'COMPLETED' && t.endOdometer)
      .reduce((s: any, t: any) => s + (t.endOdometer - t.startOdometer), 0)

    const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 0

    totalSystemRevenue += totalRev
    totalSystemCosts += totalCosts
    totalSystemAcquisition += v.acquisitionCost

    return {
      name: v.licensePlate,
      revenue: totalRev,
      costs: totalCosts,
      profit: netProfit,
      roiPercent: Math.round(roiPercent),
      fuelEfficiency: parseFloat(fuelEfficiency.toFixed(1))
    }
  }).filter((data: any) => data.revenue > 0 || data.costs > 0 || data.fuelEfficiency > 0)

  const systemRoiPercent = totalSystemAcquisition > 0 ? ((totalSystemRevenue - totalSystemCosts) / totalSystemAcquisition) * 100 : 0

  const summaryKpis = {
    revenue: totalSystemRevenue,
    costs: totalSystemCosts,
    roiPercent: Math.round(systemRoiPercent)
  }

  // 3. Flatten Fuel logs for CSV Export easily
  const exportFormat = fuelLogs.map((l: any) => ({
    Date: l.date.toISOString().split('T')[0],
    Vehicle: l.vehicle.modelName,
    Liters: l.liters,
    Cost: l.cost
  }))

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Financial & Performance Analytics</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Deep dive into operational costs, fleet ROI, and historical trends.
          </p>
        </div>
      </div>

      <AnalyticsCharts
        expenseTrendData={expenseTrendData}
        roiData={roiData}
        summaryKpis={summaryKpis}
        exportData={exportFormat}
      />
    </div>
  )
}
