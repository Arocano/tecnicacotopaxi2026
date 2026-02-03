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
})


const GeneralPage = () => {
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
            utc: "no",
        }
        try {
            const { data: existente } = await supabase.from("corredores").select("id").eq("cedula", values.cedula).maybeSingle()
            if (existente) {
                toast({
                    title: "Error de registro",
                    description: "Ya existe un corredor registrado con esta cédula.",
                    duration: 3000,
                    variant: "destructive",
                })
                router.push("/")
            } else {
                await supabase.from("corredores").insert(clientData)
                form.reset()
                setImage(null)
                toast({
                    title: "Registrado correctamente",
                    description: "Tus datos se han registrado con éxito para la carrera",
                    duration: 2000,
                    className: "success-toast",
                })
                router.push("/mesage")
            }
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
            const url = urlData.publicUrl
            setImage(url)
            setComprobante(url)
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
                            <p className="mt-1 text-amber-400/90 text-sm lg:text-base">Formulario para el público general</p>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                <SelectItem value="JUVENIL">JUVENIL (17-19)</SelectItem>
                                                <SelectItem value="SENIOR-ELITE">SENIOR-ELITE (19-39)</SelectItem>
                                                <SelectItem value="MASTER">MASTER (40-49)</SelectItem>
                                                <SelectItem value="SUPER MASTER">SUPER MASTER (50-59)</SelectItem>
                                                <SelectItem value="MASHCA TERCERA ERA">MASHCA TERCERA ERA (60-adelante)</SelectItem>
                                                <SelectItem value="INCLUSIVA">INCLUSIVA (Abierta)</SelectItem>
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
                                        <FormLabel className="text-sm font-medium text-slate-300">Número de comprobante</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" placeholder="Comprobante Depósito/Transferencia" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>
                            <div className="grid grid-cols-1 gap-4">
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

export default GeneralPage