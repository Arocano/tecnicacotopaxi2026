'use client'
import { obtenerCorredores, obtenerCorredores2 } from '@/lib/actions/data.actions';
import React, { useEffect, useState } from 'react'
import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from '@/components/shared/table';
import Link from 'next/link';
type dataTable = {
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
    comprobante: string
}
const columns: ColumnDef<dataTable>[] = [
    {
        accessorKey: "cedula",
        header: "Cédula",

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
        accessorKey: "rifa",
        header: "Número Rifa",
    },
    {
        accessorKey: "telefono",
        header: "Télefono",
    },
    {
        accessorKey: "comprobante",
        header: "Comprobante",
        cell: ({ row }) => {
            const url = row.original.comprobante; // Asumiendo que el campo comprobante contiene la URL del link
            return <a href={url} target="_blank" rel="noopener noreferrer">Ver Comprobante</a>;
        }
    },


];

const ViewEPage = () => {
    const [dataTable, setDataTable] = useState<dataTable[]>([]);
    async function fetchData() {
        const scores = await obtenerCorredores();


        setDataTable(scores)
    }
    useEffect(() => {
        fetchData()
    }, []);
    return (
        <div>
            
            <div className='flex flex-col items-center gap-5 pb-9'>
                <h2 className='h2-semibold text-black mt-10'>
                    Corredores Ciclismo 
                </h2>
                <div className="w-full">
                    <DataTable columns={columns} data={dataTable} />
                </div>

            </div>
        </div>
    )
}
export default ViewEPage;