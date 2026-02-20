"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Home = () => {
    const router = useRouter()
    const [inscriptionOpen, setInscriptionOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white w-full">
            {/* Header: r2 izquierda, logo UTC derecha */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10">
                <a
                    href="https://www.r2timing.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-auto max-w-[140px] flex items-center"
                >
                    <Image
                        src="/images/r2.png"
                        width={160}
                        height={64}
                        className="h-10 sm:h-12 w-auto object-contain"
                        alt="R2TIMING - Cronometraje Deportivo"
                    />
                </a>
                <a
                    href="https://www.utc.edu.ec/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-auto max-w-[140px] flex items-center"
                >
                    <Image
                        src="/images/logo-utc.svg"
                        width={140}
                        height={64}
                        className="h-10 sm:h-12 w-auto object-contain"
                        alt="Universidad Técnica de Cotopaxi"
                    />
                </a>
            </header>

            {/* Sección principal: dos columnas; en ambas el contenido va centrado */}
            <main className="flex-1 min-h-0 flex flex-col lg:flex-row">
                {/* Columna 1: muestra.svg centrado */}
                <section className="w-full lg:w-1/2 min-h-[240px] lg:min-h-0 flex items-center justify-center p-6">
                    <div className="flex items-center justify-center w-full max-w-full">
                        <Image
                            src="/images/muestra.svg"
                            width={420}
                            height={252}
                            className="object-contain w-full max-w-md h-auto"
                            alt="Universidad Técnica de Cotopaxi"
                        />
                    </div>
                </section>
                {/* Columna 2: título, texto y botón centrados */}
                <section className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="flex flex-col items-center justify-center gap-6 text-center max-w-sm">
                        <h1 className="text-2xl sm:text-3xl font-bold text-amber-400">
                            10K Ruta del Cotopaxi
                        </h1>
                        <p className="text-slate-300 text-lg">
                            Segunda edición · 3 de mayo
                        </p>
                        <p className="text-slate-400 text-sm">
                            Inscríbete a la carrera. Elige modalidad UTC o público general y adjunta tu comprobante de pago.
                        </p>
                        <button
                            type="button"
                            onClick={() => setInscriptionOpen(true)}
                            className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg px-8 py-4 transition shadow-lg"
                        >
                            ¡Inscríbete!
                        </button>
                    </div>
                </section>
            </main>

            {/* Card / modal: Información de pago e inscripción */}
            {inscriptionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setInscriptionOpen(false)}
                            className="absolute top-4 right-4 z-10 rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition"
                            aria-label="Cerrar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="p-6 sm:p-8 flex flex-col gap-5">
                            <h2 className="text-lg sm:text-xl font-semibold text-amber-400 text-center">
                                Información de pago e inscripción
                            </h2>
                            <div className="text-left text-slate-300 space-y-4 text-sm">
                                <div>
                                    <span className="font-semibold text-white">1. Pago</span>
                                    <p className="mt-1">Transferencia o depósito:</p>
                                    <ul className="mt-2 list-disc list-inside space-y-0.5">
                                        <li>Banco Pichincha</li>
                                        <li>Cuenta de ahorro transaccional</li>
                                        <li>Número: 2204030982</li>
                                        <li>Hernán Patricio Bastidas Pacheco</li>
                                    </ul>
                                </div>
                                <div className="rounded-lg bg-slate-800/60 p-3">
                                    <span className="font-semibold text-white">Precios</span>
                                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                                        <li><strong>$10</strong> feb / <strong>$12</strong> desde mar — Juvenil, inclusiva, universitarios</li>
                                        <li><strong>$20</strong> — Docentes, empleados y trabajadores UTC, y demás</li>
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
                    </div>
                </div>
            )}

            <footer className="py-3 px-4 border-t border-white/10 bg-slate-900/90">
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
