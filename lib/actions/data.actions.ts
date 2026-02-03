"use server";

import { supabase } from "@/app/api/supabase/client";

export interface Corredor {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  nacimiento: Date | string;
  telefono: string;
  camiseta: string;
  distancia?: string;
  cedula: string;
  competencia?: string;
  categoria: string;
  genero: string;
  comprobante: string;
  rifa?: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  carrera?: string;
  ciclismo?: string;
  num_comprobante?: string;
}

function mapRow(row: Record<string, unknown>): Corredor {
  const r = row as Record<string, unknown> & { created_at?: string };
  return {
    id: (r.id as string) ?? "",
    nombres: (r.nombres as string) ?? "",
    apellidos: (r.apellidos as string) ?? "",
    email: (r.email as string) ?? "",
    nacimiento: (r.nacimiento as Date | string) ?? "",
    telefono: (r.telefono as string) ?? "",
    camiseta: (r.camiseta as string) ?? "",
    cedula: (r.cedula as string) ?? "",
    competencia: r.competencia as string | undefined,
    categoria: (r.categoria as string) ?? "",
    genero: (r.genero as string) ?? "",
    comprobante: (r.comprobante as string) ?? "",
    rifa: r.rifa as string | undefined,
    createdAt: r.created_at ?? "",
    carrera: r.carrera as string | undefined,
    ciclismo: r.ciclismo as string | undefined,
    num_comprobante: r.num_comprobante as string | undefined,
  };
}

export async function obtenerCorredores(): Promise<Corredor[]> {
  try {
    const { data, error } = await supabase
      .from("corredores")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("Error al obtener los corredores:", err);
    return [];
  }
}

export async function obtenerCorredores2(): Promise<Corredor[]> {
  try {
    const { data, error } = await supabase
      .from("corredores")
      .select("*")
      .eq("utc", "si")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  } catch (err) {
    console.error("Error al obtener los corredores:", err);
    return [];
  }
}

export async function obtenerCorredores3(): Promise<Corredor[]> {
  try {
    const { data, error } = await supabase.from("corredores").select("*");
    if (error) throw error;
    return (data ?? [])
      .filter(
        (row: Record<string, unknown>) =>
          (row.ciclismo === "no" || row.ciclismo == null) &&
          row.comprobante === "gad"
      )
      .map((row: Record<string, unknown>) => mapRow(row));
  } catch (err) {
    console.error("Error al obtener los corredores:", err);
    return [];
  }
}

export async function obtenerCorredores4(): Promise<Corredor[]> {
  try {
    const { data, error } = await supabase.from("corredores").select("*");
    if (error) throw error;
    return (data ?? [])
      .filter(
        (row: Record<string, unknown>) =>
          row.ciclismo === "si" && row.comprobante === "gad"
      )
      .map((row: Record<string, unknown>) => mapRow(row));
  } catch (err) {
    console.error("Error al obtener los corredores:", err);
    return [];
  }
}
