"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

const MesagePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div
                    className="relative w-full max-w-lg rounded-2xl bg-slate-900/90 border border-white/10 p-8 lg:p-10 shadow-xl text-center"
                    style={{
                        backgroundImage: "url(/images/Recurso6.svg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 rounded-2xl bg-slate-950/85 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-4 ring-amber-500/30">
                            <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">
                                Tu inscripción se ha realizado correctamente
                            </h1>
                            <p className="text-slate-300 text-base lg:text-lg">
                                Te notificaremos cuando el comprobante de pago haya sido validado.
                            </p>
                            <p className="text-amber-400/90 font-medium pt-2">
                                Gracias por tu participación
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-100"
                        >
                            Volver al inicio
                        </Link>
                    </div>
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

export default MesagePage
