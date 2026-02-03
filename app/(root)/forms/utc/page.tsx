"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { supabase } from "@/app/api/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

/** Parsea fecha DD/MM/YYYY y devuelve la edad en años (hoy). */
function edadDesdeNacimiento(nacimientoStr: string): number | null {
    const trimmed = nacimientoStr.trim()
    if (!trimmed || trimmed.length < 8) return null
    const parts = trimmed.split("/")
    if (parts.length !== 3) return null
    const [d, m, y] = parts.map((p) => parseInt(p, 10))
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null
    const birth = new Date(y, m - 1, d)
    if (isNaN(birth.getTime())) return null
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
}

const formSchema = z.object({
    nombres: z.string().min(2, { message: "Mínimo 2 carácteres" }).max(50, { message: "Máximo 50 carácteres" }),
    apellidos: z.string().min(2, { message: "Mínimo 2 carácteres" }).max(50, { message: "Máximo 50 carácteres" }),
    email: z.string().email("Email inválido").min(2, { message: "Mínimo 2 carácteres" }).max(50, { message: "Máximo 50 carácteres" }),
    telefono: z.string().min(10, { message: "Debe ingresar 10 dígitos" }).max(10, { message: "Debe ingresar 10 dígitos" }),
    camiseta: z.string().min(1, { message: "Por favor seleccione una talla." }),
    nacimiento: z.string().min(5, { message: "Por favor ingrese su fecha de nacimiento" }),
    cedula: z.string().min(10, { message: "Debe ingresar 10 dígitos" }).max(10, { message: "Debe ingresar 10 dígitos" }),
    num_com: z.string().min(1, { message: "Por favor ingrese el número de comprobante." }),
    categoria: z.string().min(1, { message: "Por favor seleccione una categoría." }),
    comprobante: z.string().min(2, { message: "Por favor suba el comprobante de pago" }),
    genero: z.string().min(1, { message: "Por favor seleccione un género." }),
    carrera: z.string().min(1, { message: "Por favor seleccione una carrera." }),
})


const IndividualPage = () => {
    const [image, setImage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombres: "",
            apellidos: "",
            email: "",
            telefono: "",
            camiseta: "",
            nacimiento: "",
            cedula: "",
            num_com: "",
            categoria: "",
            comprobante: "",
            genero: "",
            carrera: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!image) {
            toast({
                title: "Comprobante requerido",
                description: "Por favor suba el comprobante de pago antes de inscribirse.",
                variant: "destructive",
            })
            return
        }
        setIsSubmitting(true)
        const clientData = {
            nombres: values.nombres,
            apellidos: values.apellidos,
            email: values.email,
            telefono: values.telefono,
            camiseta: values.camiseta,
            cedula: values.cedula,
            num_comprobante: values.num_com,
            categoria: values.categoria,
            nacimiento: values.nacimiento,
            genero: values.genero,
            comprobante: image,
            utc: "si",
            carrera: values.carrera,
        }
        try {
            const categoriaMap: Record<string, string> = {
                "UNIVERSITARIOS UTC": "1",
                "DOCENTES SENIOR (hasta 39 años)": "3",
                "DOCENTES MASTER (40 años en adelante)": "4",
            }
            const tipo = categoriaMap[values.categoria] ?? null
            if (!tipo) {
                toast({
                    title: "Error de validación",
                    description: "Seleccione una categoría válida.",
                    duration: 3000,
                    variant: "destructive",
                })
                router.push("/")
                return
            }
            const edad = edadDesdeNacimiento(values.nacimiento)
            if (edad === null) {
                toast({
                    title: "Fecha de nacimiento inválida",
                    description: "Use el formato DD/MM/YYYY (ej: 14/09/2001).",
                    duration: 3000,
                    variant: "destructive",
                })
                return
            }
            if (values.categoria === "DOCENTES SENIOR (hasta 39 años)" && edad > 39) {
                toast({
                    title: "Categoría no corresponde",
                    description: "Docentes Senior es para personas hasta 39 años. Su edad indica que debe inscribirse en Docentes Master.",
                    duration: 4000,
                    variant: "destructive",
                })
                return
            }
            if (values.categoria === "DOCENTES MASTER (40 años en adelante)" && edad < 40) {
                toast({
                    title: "Categoría no corresponde",
                    description: "Docentes Master es para personas de 40 años en adelante. Su edad indica que debe inscribirse en Docentes Senior.",
                    duration: 4000,
                    variant: "destructive",
                })
                return
            }
            const res = await fetch("/api/utc/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identificacion: values.cedula, tipo }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error((err as { error?: string }).error ?? "Error al validar")
            }
            const externalData = await res.json()
            const status = externalData.status

            if (!status) {
                toast({
                    title: "Error de validación",
                    description: "No pertenece a esta modalidad de inscripción.",
                    duration: 3000,
                    variant: "destructive",
                })
                router.push("/")
                return
            }

            const { data: existente } = await supabase.from("corredores").select("id").eq("cedula", values.cedula).maybeSingle()
            if (existente) {
                toast({
                    title: "Error de registro",
                    description: "Ya existe un corredor registrado con esta cédula.",
                    duration: 3000,
                    variant: "destructive",
                })
                router.push("/")
                return
            }

            await supabase.from("corredores").insert(clientData)
            form.reset()
            setImage(null)
            toast({
                title: "Registrado correctamente",
                description: "Tus datos se han registrado con éxito para la carrera",
                duration: 5000,
                className: "success-toast",
            })
            router.push("/mesage")
        } catch (error) {
            console.error("Error adding document: ", error)
            toast({
                title: "Error",
                description: "No se pudo completar el registro. Intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const onImageChange = async (
        input: HTMLInputElement,
        values: z.infer<typeof formSchema>,
        setComprobante: (url: string) => void
    ) => {
        const file = input.files?.[0]
        if (!file || !values.cedula) return
        setIsSubmitting(true)
        try {
            const path = `comprobantes/${values.cedula}_${Date.now()}_${file.name}`
            const { error: uploadError } = await supabase.storage.from("comprobantes").upload(path, file, { upsert: true })
            if (uploadError) throw uploadError
            const { data: urlData } = supabase.storage.from("comprobantes").getPublicUrl(path)
            setImage(urlData.publicUrl)
            setComprobante(urlData.publicUrl)
        } catch (err) {
            console.error("Error al subir comprobante:", err)
            toast({
                title: "Error",
                description: "No se pudo subir el comprobante. Intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white py-8 px-4 lg:py-12">
            <div className="max-w-2xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 lg:p-8 shadow-xl">
                            <h1 className="text-2xl lg:text-3xl font-bold text-white">Ingrese sus datos</h1>
                            <p className="mt-1 text-amber-400/90 text-sm lg:text-base">Formulario exclusivo para miembros UTC</p>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombres"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Nombres</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ingresa tus nombres" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apellidos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Apellidos</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ingresa tus apellidos" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Email</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ingresa tu email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Télefono</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ingresa tu télefono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <FormField
                                control={form.control}
                                name="camiseta"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-sm font-medium text-slate-300">Talla de Camiseta</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Selecciona tu talla" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600 text-white [&_[data-highlighted]]:bg-slate-700 [&_[data-highlighted]]:text-white">
                                                <SelectItem value="S">S</SelectItem>
                                                <SelectItem value="M">M</SelectItem>
                                                <SelectItem value="L">L</SelectItem>
                                                <SelectItem value="XL">XL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nacimiento"
                                render={({ field }) => (
                                    <FormItem>
<FormLabel className="text-sm font-medium text-slate-300">Fecha de Nacimiento</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ejemplo: 14/09/2001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cedula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Cédula</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Ingresa tu cédula" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoria"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-sm font-medium text-slate-300">Categoría</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Selecciona tu categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600 text-white [&_[data-highlighted]]:bg-slate-700 [&_[data-highlighted]]:text-white">
                                                <SelectItem value="UNIVERSITARIOS UTC">UNIVERSITARIOS UTC</SelectItem>
                                                <SelectItem value="DOCENTES SENIOR (hasta 39 años)">DOCENTES SENIOR (hasta 39 años)</SelectItem>
                                                <SelectItem value="DOCENTES MASTER (40 años en adelante)">DOCENTES MASTER (40 años en adelante)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                            <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="num_com"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-300">Número de Comprobante</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Comprobante Depósito/Transferencia" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="genero"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-sm font-medium text-slate-300">Género</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Selecciona tu género" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600 text-white [&_[data-highlighted]]:bg-slate-700 [&_[data-highlighted]]:text-white">
                                                <SelectItem value="MASCULINO">MASCULINO</SelectItem>
                                                <SelectItem value="FEMENINO">FEMENINO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carrera"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className="text-sm font-medium text-slate-300">Carrera</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue placeholder="Selecciona tu carrera" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-600 text-white max-h-[280px] [&_[data-highlighted]]:bg-slate-700 [&_[data-highlighted]]:text-white">
                                                <SelectItem value="AGROINDUSTRIA">AGROINDUSTRIA</SelectItem>
                                                <SelectItem value="AGRONOMÍA">AGRONOMÍA</SelectItem>
                                                <SelectItem value="AGROPECUARIA">AGROPECUARIA</SelectItem>
                                                <SelectItem value="BIOTECNOLOGÍA">BIOTECNOLOGÍA</SelectItem>
                                                <SelectItem value="INGENIERÍA AMBIENTAL">INGENIERÍA AMBIENTAL</SelectItem>
                                                <SelectItem value="MEDICINA VETERINARIA">MEDICINA VETERINARIA</SelectItem>
                                                <SelectItem value="TURISMO">TURISMO</SelectItem>
                                                <SelectItem value="ADMINISTRACIÓN DE EMPRESAS">ADMINISTRACIÓN DE EMPRESAS</SelectItem>
                                                <SelectItem value="CONTABILIDAD Y AUDITORÍA">CONTABILIDAD Y AUDITORÍA</SelectItem>
                                                <SelectItem value="ECONOMÍA">ECONOMÍA</SelectItem>
                                                <SelectItem value="GESTIÓN DE LA INFORMACIÓN GERENCIAL">GESTIÓN DE LA INFORMACIÓN GERENCIAL</SelectItem>
                                                <SelectItem value="GESTIÓN DEL TALENTO HUMANO">GESTIÓN DEL TALENTO HUMANO</SelectItem>
                                                <SelectItem value="FINANZAS">FINANZAS</SelectItem>
                                                <SelectItem value="MERCADOTECNIA">MERCADOTECNIA</SelectItem>
                                                <SelectItem value="COMUNICACIÓN">COMUNICACIÓN</SelectItem>
                                                <SelectItem value="DISEÑO GRÁFICO">DISEÑO GRÁFICO</SelectItem>
                                                <SelectItem value="TRABAJO SOCIAL">TRABAJO SOCIAL</SelectItem>
                                                <SelectItem value="ANIMACIÓN DIGITAL">ANIMACIÓN DIGITAL</SelectItem>
                                                <SelectItem value="PSICOLOGÍA SOCIAL">PSICOLOGÍA SOCIAL</SelectItem>
                                                <SelectItem value="ELECTRICIDAD">ELECTRICIDAD</SelectItem>
                                                <SelectItem value="ELECTROMECÁNICA">ELECTROMECÁNICA</SelectItem>
                                                <SelectItem value="HIDRÁULICA">HIDRÁULICA</SelectItem>
                                                <SelectItem value="INDUSTRIAL">INDUSTRIAL</SelectItem>
                                                <SelectItem value="SISTEMAS DE INFORMACIÓN">SISTEMAS DE INFORMACIÓN</SelectItem>
                                                <SelectItem value="SOFTWARE">SOFTWARE</SelectItem>
                                                <SelectItem value="ADMINISTRACIÓN DE EMPRESAS LM">ADMINISTRACIÓN DE EMPRESAS LM</SelectItem>
                                                <SelectItem value="AGROINDUSTRIA LM">AGROINDUSTRIA LM</SelectItem>
                                                <SelectItem value="AGRONOMÍA LM">AGRONOMÍA LM</SelectItem>
                                                <SelectItem value="CONTABILIDAD Y AUDITORÍA LM">CONTABILIDAD Y AUDITORÍA LM</SelectItem>
                                                <SelectItem value="ELECTROMECÁNICA LM">ELECTROMECÁNICA LM</SelectItem>
                                                <SelectItem value="SISTEMAS DE INFORMACIÓN LM">SISTEMAS DE INFORMACIÓN LM</SelectItem>
                                                <SelectItem value="TURISMO LM">TURISMO LM</SelectItem>
                                                <SelectItem value="EDUCACIÓN BÁSICA">EDUCACIÓN BÁSICA</SelectItem>
                                                <SelectItem value="EDUCACIÓN INICIAL">EDUCACIÓN INICIAL</SelectItem>
                                                <SelectItem value="PEDAGOGÍA DE LA LENGUA Y LITERATURA">PEDAGOGÍA DE LA LENGUA Y LITERATURA</SelectItem>
                                                <SelectItem value="PEDAGOGÍA DEL IDIOMA INGLÉS">PEDAGOGÍA DEL IDIOMA INGLÉS</SelectItem>
                                                <SelectItem value="PEDAGOGÍA DE LAS CIENCIAS EXPERIMENTALES">PEDAGOGÍA DE LAS CIENCIAS EXPERIMENTALES</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="comprobante"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-slate-300">Subir comprobante de pago</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            disabled={!form.watch("cedula") || form.watch("cedula").length < 10}
                                            className="bg-slate-800 border-slate-600 text-white file:text-amber-400 cursor-pointer"
                                            onChange={(e) => onImageChange(e.target, form.getValues(), field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="mt-6 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 text-lg shadow-lg shadow-amber-500/20 transition-colors disabled:opacity-50"
                            >
                                Inscribirse
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <footer className="py-4 px-4 border-t border-white/5">
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

export default IndividualPage