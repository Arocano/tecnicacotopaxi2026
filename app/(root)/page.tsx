"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { MountainPointId } from "@/components/mountain-scene"

const MountainScene = dynamic(() => import("@/components/mountain-scene").then((m) => ({ default: m.MountainScene })), {
    ssr: false,
    loading: () => (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
            Cargando montaña 3D…
        </div>
    ),
})

const Home = () => {
    const router = useRouter()
    const [activePoint, setActivePoint] = useState<MountainPointId | null>(null)

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden w-full">
            <section className="relative w-full h-full flex-1 min-h-0">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-slate-200 to-slate-400" aria-hidden />
                <MountainScene onPointClick={setActivePoint} className="absolute inset-0 w-full h-full" labelsVisible={activePoint === null} />
                {/* Cartel inscripción — esquina superior derecha; más compacto en móvil */}
                <div className="absolute top-4 right-4 z-10 w-[min(320px,calc(100vw-2rem))] max-sm:top-2 max-sm:right-2 max-sm:left-2 max-sm:w-auto max-sm:p-3 rounded-2xl border border-slate-500/40 bg-slate-900/95 shadow-xl backdrop-blur-sm p-4">
                    <div className="aspect-[520/220] w-full max-h-[100px] max-sm:max-h-[70px] mb-3 max-sm:mb-2">
                        <Image
                            src="/images/main.svg"
                            width={520}
                            height={220}
                            className="w-full h-full object-contain"
                            alt="10K Ruta del Cotopaxi - Segunda Edición - 3 de mayo"
                        />
                    </div>
                    <p className="text-slate-200 text-sm leading-snug max-sm:text-xs max-sm:leading-snug">
                        Inscríbete a la carrera. Elige modalidad UTC o público general y adjunta tu comprobante de pago.
                    </p>
                </div>
                <p className="absolute bottom-16 left-0 right-0 text-center text-slate-500 text-sm z-10 pointer-events-none">
                    Haz clic en los puntos de la montaña · Arrastra para rotar
                </p>
            </section>

            {/* Modal al hacer clic en un punto */}
            {activePoint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setActivePoint(null)}
                            className="absolute top-4 right-4 z-10 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                            aria-label="Cerrar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {activePoint === "inscription" && (
                            <div className="p-6 sm:p-8 flex flex-col gap-5">
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-400 text-center">
                                    Información de pago e inscripción
                                </h2>
                                <div className="text-left text-slate-300 space-y-4 text-sm">
                                    <div>
                                        <span className="font-semibold text-white">1. Pago</span>
                                        <p className="mt-1">Transferencia o depósito:</p>
                                        <ul className="mt-2 list-disc list-inside space-y-0.5">
                                            <li>Banco Pichincha · Ahorros 2212759904</li>
                                            <li>Isabel Armas Heredia · CC 0502298482</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-lg bg-slate-800/60 p-3">
                                        <span className="font-semibold text-white">Precios</span>
                                        <ul className="mt-1 list-disc list-inside space-y-0.5">
                                            <li><strong>$10</strong> feb / <strong>$12</strong> desde mar — Juvenil, inclusiva, universitarios, trabajadores UTC</li>
                                            <li><strong>$20</strong> — Docentes UTC y demás</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white">2. Inscripción</span>
                                        <p className="mt-1">Elige UTC o Público general y sube el comprobante en el formulario.</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-800/80 p-3">
                                        <span className="font-semibold text-amber-400">Punto físico</span>
                                        <p className="mt-1">JP Digital · Quijano y Ordoñez 76-55, La Merced, Latacunga · 0993151798</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => router.push("forms/utc")}
                                        className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3.5 sm:py-4 transition"
                                    >
                                        Inscripción UTC
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("forms/general")}
                                        className="flex-1 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3.5 sm:py-4 transition"
                                    >
                                        Público general
                                    </button>
                                </div>
                            </div>
                        )}

                        {activePoint === "fecha" && (
                            <div className="p-8 text-center flex flex-col items-center gap-6">
                                <h3 className="text-xl font-bold text-amber-400 mb-2">Organizan</h3>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap">
                                    <div className="h-16 w-auto max-w-[140px] flex items-center justify-center">
                                        <Image
                                            src="/images/logo-utc.svg"
                                            width={140}
                                            height={64}
                                            className="h-16 w-auto object-contain"
                                            alt="UTC"
                                        />
                                    </div>
                                    <div className="h-16 w-auto max-w-[140px] flex items-center justify-center">
                                        <Image
                                            src="/images/logo-years.svg"
                                            width={140}
                                            height={64}
                                            className="h-16 w-auto object-contain"
                                            alt="Years"
                                        />
                                    </div>
                                    <div className="h-20 w-auto max-w-[120px] flex items-center justify-center">
                                        <Image
                                            src="/images/rectora.svg"
                                            width={120}
                                            height={80}
                                            className="h-20 w-auto object-contain"
                                            alt="Rectora"
                                        />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm">3 de mayo · Segunda edición · 10K Ruta del Cotopaxi</p>
                            </div>
                        )}

                        {activePoint === "lugar" && (
                            <div className="p-8 text-center flex flex-col items-center gap-5">
                                <h3 className="text-xl font-bold text-amber-400 mb-2">En colaboración</h3>
                                <a
                                    href="https://www.r2timing.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 hover:opacity-90 transition"
                                >
                                    <div className="h-16 w-auto max-w-[160px] flex items-center justify-center">
                                        <Image
                                            src="/images/r2.png"
                                            width={160}
                                            height={64}
                                            className="h-16 w-auto object-contain"
                                            alt="R2TIMING - Cronometraje Deportivo"
                                        />
                                    </div>
                                    <p className="text-slate-400 text-sm">Proveedor de cronometraje</p>
                                </a>
                                <div className="text-slate-300 text-sm space-y-1">
                                    <p className="font-semibold text-white">Cronometraje Electrónico</p>
                                    <p className="max-w-sm">
                                        Medición de tiempos con precisión profesional utilizando chips descartables o reusables para cada atleta.
                                    </p>
                                </div>
                                <a
                                    href="https://www.r2timing.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:text-amber-300 text-sm font-medium transition"
                                >
                                    www.r2timing.com
                                </a>
                            </div>
                        )}

                        {activePoint === "info" && (
                            <div className="p-8 text-center flex flex-col items-center gap-5">
                                <h3 className="text-xl font-bold text-amber-400 mb-2">Más información</h3>
                                <a
                                    href="https://www.utc.edu.ec/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 hover:opacity-90 transition"
                                >
                                    <div className="w-full max-w-[280px] h-auto flex items-center justify-center">
                                        <Image
                                            src="/images/muestra.svg"
                                            width={420}
                                            height={252}
                                            className="w-full h-auto object-contain"
                                            alt="Universidad Técnica de Cotopaxi"
                                        />
                                    </div>
                                </a>
                                <div className="flex flex-col items-center gap-3 max-w-md">
                                    <h4 className="text-lg font-bold text-amber-400">Opciones de inscripción</h4>
                                    <p className="text-white text-base font-semibold leading-relaxed">
                                        Inscríbete a la carrera. Elige modalidad UTC o público general y adjunta tu comprobante de pago.
                                    </p>
                                </div>
                                <a
                                    href="https://www.utc.edu.ec/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:text-amber-300 text-sm font-medium transition"
                                >
                                    www.utc.edu.ec
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <footer className="fixed bottom-0 left-0 right-0 py-3 px-4 border-t border-white/10 bg-slate-900/90 backdrop-blur-sm z-20">
                <a
                    href="https://www.shibatech.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-base font-medium text-slate-400 hover:text-amber-400 transition-colors"
                >
                    Powered by <span className="text-white/90 font-semibold">Shibatech</span>
                </a>
            </footer>
        </div>
    )
}

export default Home
