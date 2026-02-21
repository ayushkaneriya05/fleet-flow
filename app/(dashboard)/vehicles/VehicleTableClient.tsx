'use client'

import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { Vehicle } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { retireVehicle } from '@/lib/actions/vehicle.actions'
import { Loader2, Trash } from 'lucide-react'

// TanStack column helper
const columnHelper = createColumnHelper<Vehicle>()

export default function VehicleTableClient({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [data, setData] = useState(() => initialVehicles)
  const [retiringId, setRetiringId] = useState<string | null>(null)

  const handleRetire = async (id: string) => {
    setRetiringId(id)
    const res = await retireVehicle(id)
    if (res.success && res.vehicle) {
      setData((prev) => prev.map(v => v.id === id ? { ...v, status: 'RETIRED' } : v))
    } else {
      alert(res.error || 'Failed to retire vehicle')
    }
    setRetiringId(null)
  }

  const columns = [
    columnHelper.accessor('licensePlate', {
      header: 'License Plate',
      cell: info => <span className="font-medium text-neutral-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor('modelName', {
      header: 'Model Name',
      cell: info => <span className="text-neutral-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('maxCapacityKg', {
      header: 'Capacity (kg)',
      cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('odometer', {
      header: 'Odometer (km)',
      cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue()
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default'
        let colorClass = ''
        
        // Colors matching the styling requests
        if (status === 'AVAILABLE') {
            variant = 'default'
            colorClass = 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
        }
        else if (status === 'ON_TRIP') {
            variant = 'secondary'
            colorClass = 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }
        else if (status === 'IN_SHOP') {
            variant = 'destructive'
            colorClass = 'bg-red-100 text-red-800 hover:bg-red-200'
        }
        else {
            variant = 'outline'
            colorClass = 'bg-neutral-100 text-neutral-600'
        }
        
        return <Badge variant={variant} className={`border-transparent ${colorClass}`}>{status}</Badge>
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => {
        const vehicle = props.row.original
        const isRetired = vehicle.status === 'RETIRED'
        const isRetiring = retiringId === vehicle.id

        return (
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={isRetired || isRetiring}
            onClick={() => handleRetire(vehicle.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isRetiring ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash className="h-4 w-4 mr-1" />}
            {isRetired ? 'Retired' : 'Retire'}
          </Button>
        )
      }
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 }
    }
  })

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/50 text-neutral-500 border-b border-neutral-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-neutral-500">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {data.length > 10 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50/30">
          <div className="text-sm text-neutral-500">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
