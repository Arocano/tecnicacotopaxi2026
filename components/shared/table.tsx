"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Si es true, usa estilos para fondo oscuro (texto claro, bordes sutiles) */
  dark?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dark = false,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const headClass = dark ? "text-slate-300 border-white/10" : "text-black"
  const cellClass = dark ? "font-medium text-slate-200" : "font-medium text-black"
  const rowClass = dark ? "border-white/10 hover:bg-white/5" : ""
  const wrapperClass = dark ? "flex items-center py-4 w-full overflow-x-auto" : "flex items-center py-4 lg:mx-52 md:mx-28 sm:mx-20 mx-1"

  return (
    <div className={cn(wrapperClass, className)}>
      <Table className={dark ? "text-slate-200" : ""}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={rowClass}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={headClass}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={rowClass}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cellClass}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={rowClass}>
              <TableCell colSpan={columns.length} className={cn(cellClass, "h-24 text-center")}>
                No hay registros.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}