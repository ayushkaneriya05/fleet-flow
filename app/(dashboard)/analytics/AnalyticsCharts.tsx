'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { FileText, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { exportToCSV } from '@/lib/export'

interface AnalyticsChartsProps {
  expenseTrendData: any[]
  roiData: any[]
  summaryKpis: {
    revenue: number
    costs: number
    roiPercent: number
  }
  exportData: any[]
}

export default function AnalyticsCharts({ expenseTrendData, roiData, summaryKpis, exportData }: AnalyticsChartsProps) {
  const handleExportCSV = () => {
    exportToCSV(exportData, 'fuel-expenses-report')
  }

  // Custom Tooltip for ROI chart to show ROI percentages
  const CustomROITooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-neutral-200 shadow-md rounded-lg">
          <p className="font-semibold text-neutral-800 mb-2">{label}</p>
          <p className="text-emerald-600 text-sm">Revenue: ${data.revenue.toLocaleString('en-US')}</p>
          <p className="text-red-500 text-sm">Costs: ${data.costs.toLocaleString('en-US')}</p>
          <p className="text-blue-600 font-medium text-sm mt-1 border-t pt-1">ROI: {data.roiPercent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" id="analytics-report-area">
      <div className="flex justify-end gap-3 mb-4 no-print print:hidden">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <FileText className="w-4 h-4 mr-2 text-emerald-600" />
          Export Data (CSV)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-white shadow-sm border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">${summaryKpis.revenue.toLocaleString('en-US')}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-white shadow-sm border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Total Operating Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">${summaryKpis.costs.toLocaleString('en-US')}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white shadow-sm border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Fleet Fleet ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{summaryKpis.roiPercent}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {expenseTrendData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-neutral-400">Not enough data to graph</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={expenseTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="fuel" name="Fuel ($)" stroke="#6324eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="maintenance" name="Maintenance ($)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Profitability (ROI)</CardTitle>
            <p className="text-xs text-neutral-500 m-0">Revenue vs Configured Costs (Fuel + Maint)</p>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {roiData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-neutral-400">Not enough data to graph</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <Tooltip content={<CustomROITooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Legend />
                    <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} stackId="a" />
                    <Bar dataKey="costs" name="Total Costs" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} stackId="b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Fuel Efficiency</CardTitle>
          <p className="text-xs text-neutral-500 m-0">Kilometers driven per Liter of fuel</p>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            {roiData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-neutral-400">Not enough data to graph</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="fuelEfficiency" name="Efficiency (km/L)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-neutral-400">
        Generated by FleetFlow Engine • {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}
