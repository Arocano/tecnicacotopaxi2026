"use client"

import { obtenerCorredores } from "@/lib/actions/data.actions"
import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/table"
import * as XLSX from "xlsx"

type DataTableRow = {
  id: string
  nombres: string
  apellidos: string
  email: string
  nacimiento: Date | string
  telefono: string
  camiseta: string
  distancia?: string
  cedula: string
  competencia?: string
  categoria: string
  genero: string
  createdAt: unknown
  comprobante: string
  num_comprobante?: string
}

const columns: ColumnDef<DataTableRow>[] = [
  {
    accessorKey: "position",
    header: "#",
    cell: ({ row }) => (
      <div className="w-10 text-center text-slate-400 tabular-nums">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "nombres",
    header: "Nombres",
  },
  {
    accessorKey: "apellidos",
    header: "Apellidos",
  },
  {
    accessorKey: "camiseta",
    header: "Camiseta",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "categoria",
    header: "Categoría",
  },
  {
    accessorKey: "cedula",
    header: "Cédula",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "num_comprobante",
    header: "Nº comprobante",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de registro",
    cell: ({ row }) => {
      const raw = row.original.createdAt
      if (typeof raw === "string") return format(new Date(raw), "dd/MM/yyyy")
      if (raw && typeof raw === "object" && "seconds" in raw) {
        const { seconds, nanoseconds } = raw as { seconds: number; nanoseconds: number }
        return format(new Date(seconds * 1000 + nanoseconds / 1e6), "dd/MM/yyyy")
      }
      return "—"
    },
  },
  {
    accessorKey: "comprobante",
    header: "Comprobante",
    cell: ({ row }) => {
      const url = row.original.comprobante
      if (!url) return <span className="text-slate-500">—</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
        >
          Ver comprobante
        </a>
      )
    },
  },
]

export default function ViewPage() {
  const [dataTable, setDataTable] = useState<DataTableRow[]>([])

  useEffect(() => {
    obtenerCorredores().then(setDataTable)
  }, [])

  const onExportExcel = () => {
    if (!dataTable?.length) return
    const formatDate = (raw: unknown) => {
      if (typeof raw === "string") return format(new Date(raw), "dd/MM/yyyy")
      if (raw && typeof raw === "object" && "seconds" in raw) {
        const { seconds, nanoseconds } = raw as { seconds: number; nanoseconds: number }
        return format(new Date(seconds * 1000 + nanoseconds / 1e6), "dd/MM/yyyy")
      }
      return ""
    }
    const dataToExport = dataTable.map((pro) => ({
      Cédula: pro.cedula,
      Nombres: pro.nombres,
      Apellidos: pro.apellidos,
      Email: pro.email,
      Género: pro.genero,
      Categoría: pro.categoria,
      Teléfono: pro.telefono,
      Edad: pro.nacimiento,
      Camiseta: pro.camiseta,
      Número_Comprobante: pro.num_comprobante ?? "",
      Fecha_Registro: formatDate(pro.createdAt),
    }))
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Listado_Corredores")
    XLSX.writeFile(workbook, "Corredores.xlsx")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <main className="flex-1 px-4 py-8 lg:py-12 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Listado de corredores
            </h1>
            <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-100"
            >
              Exportar a Excel
            </button>
          </div>
          <DataTable columns={columns} data={dataTable} dark />
        </div>
      </main>
      <footer className="py-4 px-4 bg-slate-950 border-t border-white/5">
        <a
          href="https://www.shibatech.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-white/40 hover:text-amber-400/80 transition-colors"
        >
          Powered by Shibatech
        </a>
      </footer>
    </div>
  )
}
