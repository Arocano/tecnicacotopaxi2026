'use client'
import { obtenerCorredores, obtenerCorredores2 } from '@/lib/actions/data.actions';
import React, { useEffect, useState } from 'react'
import { format } from "date-fns";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from '@/components/shared/table';
import Link from 'next/link';
import * as XLSX from "xlsx";
type dataTable = {
    id: string;

    nombres: string,
    apellidos: string,
    email: string,
    nacimiento: Date,
    telefono: string,
    camiseta: string,
    distancia: string,
    cedula: string,
    competencia: string,
    categoria: string,
    genero: string,
    createdAt: any,
    comprobante: string
    carrera: string



}
const columns: ColumnDef<dataTable>[] = [
    {
        accessorKey: "position", // Agrega la nueva clave "position"
        header: "",
        cell: ({ row }) => (
            <div
                className={" w-12 text-center rounded-xl"}
            >
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
        header: "Télefono",
    },

    // {
    //     accessorKey: "corredores.0.comprobante",
    //     header: "Comprobante",
    // },

    // {
    //     accessorKey: "categoria",
    //     header: "Categoría",
    // },


    {
        accessorKey: "cedula",
        header: "Cédula ",
    },
    {
        accessorKey: "email",
        header: "Correo",
    },
    // {
    //     accessorKey: "num_comprobante",
    //     header: "Número de comprobante",
    // },
    {
        accessorKey: "createdAt",
        header: "Fecha de registro",
        cell: ({ row }) => {
            const raw = row.original.createdAt;
            if (typeof raw === "string") return format(new Date(raw), "dd/MM/yyyy");
            if (raw && typeof raw === "object" && "seconds" in raw) {
                const { seconds, nanoseconds } = raw as { seconds: number; nanoseconds: number };
                return format(new Date(seconds * 1000 + nanoseconds / 1e6), "dd/MM/yyyy");
            }
            return "Fecha no disponible";
        },
    },

    // {
    //     accessorKey: "comprobante",
    //     header: "Comprobante",
    //     cell: ({ row }) => {
    //         const url = row.original.comprobante; // Asumiendo que el campo comprobante contiene la URL del link
    //         return <a href={url} target="_blank" rel="noopener noreferrer">Ver Comprobante</a>;
    //     }
    // },

    {
        accessorKey: "carrera",
        header: "Carrera",
    },

];

const ViewPageC = () => {
    const [dataTable, setDataTable] = useState<dataTable[]>([]);
    const [selectedCarrera, setSelectedCarrera] = useState<string>("");

    async function fetchData() {
        const scores = await obtenerCorredores2();
        console.log(scores)

        setDataTable(scores)
    }

    useEffect(() => {
        fetchData()
    }, []);

    const filteredData = selectedCarrera
        ? selectedCarrera === "SIN_CARRERA"
            ? dataTable.filter((item) => !item.carrera)
            : dataTable.filter((item) => item.carrera === selectedCarrera)
        : dataTable;

    return (
        <div>
            <div className='flex flex-col items-center gap-5 pb-9'>
                <h2 className='h2-semibold text-black mt-10'>
                    Listado de corredores UTC
                </h2>
                <div className="w-full max-w-md">
                    <Select onValueChange={setSelectedCarrera}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por carrera" />
                        </SelectTrigger>
                        <SelectContent className="max-h-96 overflow-y-auto">
                            <SelectItem className='text-[16px]' value="SIN_CARRERA">SIN ASIGNAR</SelectItem>
                            <SelectItem className='text-[16px]' value="AGROINDUSTRIA">AGROINDUSTRIA</SelectItem>
                            <SelectItem className='text-[16px]' value="AGRONOMÍA">AGRONOMÍA</SelectItem>
                            <SelectItem className='text-[16px]' value="AGROPECUARIA">AGROPECUARIA</SelectItem>
                            <SelectItem className='text-[16px]' value="BIOTECNOLOGÍA">BIOTECNOLOGÍA</SelectItem>
                            <SelectItem className='text-[16px]' value="INGENIERÍA AMBIENTAL">INGENIERÍA AMBIENTAL</SelectItem>
                            <SelectItem className='text-[16px]' value="MEDICINA VETERINARIA">MEDICINA VETERINARIA</SelectItem>
                            <SelectItem className='text-[16px]' value="TURISMO">TURISMO</SelectItem>
                            <SelectItem className='text-[16px]' value="ADMINISTRACIÓN DE EMPRESAS">ADMINISTRACIÓN DE EMPRESAS</SelectItem>
                            <SelectItem className='text-[16px]' value="CONTABILIDAD Y AUDITORÍA">CONTABILIDAD Y AUDITORÍA</SelectItem>
                            <SelectItem className='text-[16px]' value="ECONOMÍA">ECONOMÍA</SelectItem>
                            <SelectItem className='text-[16px]' value="GESTIÓN DE LA INFORMACIÓN GERENCIAL">GESTIÓN DE LA INFORMACIÓN GERENCIAL</SelectItem>
                            <SelectItem className='text-[16px]' value="GESTIÓN DEL TALENTO HUMANO">GESTIÓN DEL TALENTO HUMANO</SelectItem>
                            <SelectItem className='text-[16px]' value="FINANZAS">FINANZAS</SelectItem>
                            <SelectItem className='text-[16px]' value="MERCADOTECNIA">MERCADOTECNIA</SelectItem>
                            <SelectItem className='text-[16px]' value="COMUNICACIÓN">COMUNICACIÓN</SelectItem>
                            <SelectItem className='text-[16px]' value="DISEÑO GRÁFICO">DISEÑO GRÁFICO</SelectItem>
                            <SelectItem className='text-[16px]' value="TRABAJO SOCIAL">TRABAJO SOCIAL</SelectItem>
                            <SelectItem className='text-[16px]' value="ANIMACIÓN DIGITAL">ANIMACIÓN DIGITAL</SelectItem>
                            <SelectItem className='text-[16px]' value="PSICOLOGÍA SOCIAL">PSICOLOGÍA SOCIAL</SelectItem>
                            <SelectItem className='text-[16px]' value="ELECTRICIDAD">ELECTRICIDAD</SelectItem>
                            <SelectItem className='text-[16px]' value="ELECTROMECÁNICA">ELECTROMECÁNICA</SelectItem>
                            <SelectItem className='text-[16px]' value="HIDRÁULICA">HIDRÁULICA</SelectItem>
                            <SelectItem className='text-[16px]' value="INDUSTRIAL">INDUSTRIAL</SelectItem>
                            <SelectItem className='text-[16px]' value="SISTEMAS DE INFORMACIÓN">SISTEMAS DE INFORMACIÓN</SelectItem>
                            <SelectItem className='text-[16px]' value="SOFTWARE">SOFTWARE</SelectItem>
                            <SelectItem className='text-[16px]' value="ADMINISTRACIÓN DE EMPRESAS LM">ADMINISTRACIÓN DE EMPRESAS LM</SelectItem>
                            <SelectItem className='text-[16px]' value="AGROINDUSTRIA LM">AGROINDUSTRIA LM</SelectItem>
                            <SelectItem className='text-[16px]' value="AGRONOMÍA LM">AGRONOMÍA LM</SelectItem>
                            <SelectItem className='text-[16px]' value="CONTABILIDAD Y AUDITORÍA LM">CONTABILIDAD Y AUDITORÍA LM</SelectItem>
                            <SelectItem className='text-[16px]' value="ELECTROMECÁNICA LM">ELECTROMECÁNICA LM</SelectItem>
                            <SelectItem className='text-[16px]' value="SISTEMAS DE INFORMACIÓN LM">SISTEMAS DE INFORMACIÓN LM</SelectItem>
                            <SelectItem className='text-[16px]' value="TURISMO LM">TURISMO LM</SelectItem>
                            <SelectItem className='text-[16px]' value="EDUCACIÓN BÁSICA">EDUCACIÓN BÁSICA</SelectItem>
                            <SelectItem className='text-[16px]' value="EDUCACIÓN INICIAL">EDUCACIÓN INICIAL</SelectItem>
                            <SelectItem className='text-[16px]' value="PEDAGOGÍA DE LA LENGUA Y LITERATURA">PEDAGOGÍA DE LA LENGUA Y LITERATURA</SelectItem>
                            <SelectItem className='text-[16px]' value="PEDAGOGÍA DEL IDIOMA INGLÉS">PEDAGOGÍA DEL IDIOMA INGLÉS</SelectItem>
                            <SelectItem className='text-[16px]' value="PEDAGOGÍA DE LAS CIENCIAS EXPERIMENTALES">PEDAGOGÍA DE LAS CIENCIAS EXPERIMENTALES</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full">
                    <DataTable columns={columns} data={filteredData} />
                </div>
            </div>
        </div>
    )
}
export default ViewPageC;