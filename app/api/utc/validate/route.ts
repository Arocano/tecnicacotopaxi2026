import { NextRequest, NextResponse } from "next/server";
import { ApiService } from "@/app/api/apiUTC";

const UTC_URL = "https://aplicaciones.utc.edu.ec/sigutc/ws/RutaCotopaxi.asmx/Usuario";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identificacion, tipo } = body as { identificacion?: string; tipo?: string };
    if (!identificacion || !tipo) {
      return NextResponse.json(
        { error: "identificacion y tipo son requeridos" },
        { status: 400 }
      );
    }
    const apiService = new ApiService();
    const result = await apiService.getUsuarioAsync(UTC_URL, {
      identificacion,
      tipo,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error validando UTC:", error);
    return NextResponse.json(
      { error: "No se pudo validar con la UTC" },
      { status: 502 }
    );
  }
}
