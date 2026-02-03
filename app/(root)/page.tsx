"use client"

import Image from "next/image"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

const Home = () => {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 lg:px-8 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
                <Image
                    src="/images/fondo.png"
                    width={120}
                    height={80}
                    className="h-14 w-auto object-contain lg:h-16"
                    alt="Logo organizador"
                    priority
                />
                <Image
                    src="/images/Recurso2.svg"
                    width={180}
                    height={80}
                    className="h-12 w-auto object-contain lg:h-16 lg:max-w-[220px]"
                    alt="Logo carrera"
                    priority
                />
            </header>

            {/* Hero */}
            <section
                className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4 pt-24 pb-16 lg:pt-28 lg:pb-20 min-h-screen"
                style={{
                    backgroundImage: "url(/images/Recurso6.svg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-10 lg:gap-16">
                    {/* Título / gráfico principal */}
                    <div className="flex-1 flex justify-center">
                        <Image
                            src="/images/Recurso3.svg"
                            width={700}
                            height={200}
                            className="w-full max-w-md lg:max-w-[520px] object-contain drop-shadow-2xl"
                            alt="10K Cotopaxi - Latacunga"
                            priority
                        />
                    </div>

                    {/* CTA y contenido */}
                    <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
                        <div className="space-y-2">
                            <p className="text-lg lg:text-xl text-amber-400/95 font-medium tracking-wide">
                                Latacunga · Cotopaxi
                            </p>
                            <p className="text-white font-semibold">
                                Fecha del evento: 3 de Mayo
                            </p>
                            <p className="text-white/90 text-sm lg:text-base max-w-sm">
                                Inscríbete a la carrera 10K. Elige tu modalidad y completa tu registro con el comprobante de pago.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger className="inline-flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg lg:text-xl px-8 py-4 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-100">
                                Inscríbete ahora
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl text-amber-400">
                                        Información de pago e inscripción
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="text-left text-slate-300 space-y-4 pt-2">
                                            <div>
                                                <span className="font-semibold text-white">1. Pago</span>
                                                <p className="mt-1">Transferencia o depósito bancario:</p>
                                                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                                                    <li>Banco Pichincha · Cuenta de ahorros</li>
                                                    <li>No. 2212759904</li>
                                                    <li>A nombre de: Isabel Armas Heredia</li>
                                                    <li>CC: 0502298482</li>
                                                </ul>
                                            </div>
                                            <div className="rounded-lg bg-slate-800/60 p-3">
                                                <span className="font-semibold text-white">Precios</span>
                                                <p className="mt-2 font-medium text-white/90 text-sm">Valor de inscripción</p>
                                                <ul className="mt-1 list-disc list-inside space-y-0.5 text-sm">
                                                    <li><strong>$10</strong> preventa todo febrero / <strong>$12</strong> desde el 1 de marzo — Juvenil, inclusiva, universitarios, personal administrativo y trabajadores UTC</li>
                                                    <li><strong>$20</strong> — Docentes UTC y demás categorías</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-white">2. Inscripción</span>
                                                <p className="mt-1 text-sm">Elige tu modalidad (UTC o Público general) y adjunta el comprobante en el formulario.</p>
                                            </div>
                                            <div className="rounded-lg bg-slate-800/80 p-3 text-sm">
                                                <span className="font-semibold text-amber-400">Punto físico de inscripciones</span>
                                                <p className="mt-1">JP Digital</p>
                                                <p>Quijano y Ordoñez entre Juan Abel Echeverría y Guayaquil 76-55 (Sector La Merced), Latacunga</p>
                                                <p>Tel: 0993151798</p>
                                            </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                                    <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-0">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => router.push("forms/utc")}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
                                    >
                                        Inscripción UTC
                                    </AlertDialogAction>
                                    <AlertDialogAction
                                        onClick={() => router.push("forms/general")}
                                        className="bg-slate-600 hover:bg-slate-500 text-white font-semibold"
                                    >
                                        Público general
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </section>

            {/* Organizadores */}
            <section className="relative py-12 lg:py-16 px-4 bg-slate-900/50 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm uppercase tracking-widest text-white/50 mb-6">
                        Organizan
                    </p>
                    <Image
                        src="/images/Recurso4.svg"
                        width={800}
                        height={120}
                        className="w-full max-w-2xl mx-auto object-contain opacity-95"
                        alt="Logos de organizadores"
                    />
                </div>
            </section>

            {/* Rectora / Respaldo institucional */}
            <section className="py-8 lg:py-10 px-4 bg-slate-950 border-t border-white/5">
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
                    <p className="text-xs uppercase tracking-widest text-white/40">
                        Con el respaldo de
                    </p>
                    <Image
                        src="/images/Recurso7.svg"
                        width={200}
                        height={80}
                        className="w-40 lg:w-52 object-contain opacity-90"
                        alt="Rectora - Universidad Técnica de Cotopaxi"
                    />
                </div>
            </section>

            {/* Powered by */}
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

export default Home
