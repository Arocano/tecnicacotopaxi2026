"use client";
import { useRouter } from 'next/navigation';
import { Input, Button } from "@heroui/react";
import { useState } from "react";
import { supabase } from '@/app/api/supabase/client';
import { useToast } from './ui/use-toast';

export default function LoginForm() {

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const router = useRouter();
  const { toast } = useToast();
  const log = async () => {
    console.log("ssws")
    if (!canSubmit) {
      toast({
        title: 'Error',
        description: "Ingrese sus credenciales",
        duration: 2000,
        className: "destructive",
      });
    } else {
      try {
        const { data: res, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        if (res.user) {
          toast({
            title: "Bienvenido " + (res.user.email ?? data.email),
            description: "Un gusto tenerte de vuelta",
            duration: 2000,
            className: 'success-toast'
          });
          localStorage.setItem('user', JSON.stringify(res.user));
          router.push('/admin');
        }
      } catch (error: any) {
        console.log(error.message);
        toast({
          title: 'Credenciales inválidas',
          description: "No tienes permiso para acceder a esta página",
          duration: 2000,
          variant: "destructive",
        });
      }
    }


  }

  const { ...allData } = data;

  const canSubmit = [...Object.values(allData)].every(Boolean);


  return (

    <form
      action=""
      className="w-3/4 h-72 flex flex-col items-center justify-between"
    >

      <h2 className="text-2xl font-light">Bienvenido</h2>
      <Input
        name="email"
        id="email"
        onChange={(e: any) => {
          setData({
            ...data,
            email: e.target.value
          });
        }}
        type="email" label="Email" fullWidth />
      <Input
        name="password"
        id="password"
        onChange={(e: any) => {
          setData({
            ...data,
            password: e.target.value
          });
        }}
        type="password" label="Contraseña" fullWidth  />
      <Button
        onClick={log}
        color="success" fullWidth>
        Ingresar
      </Button>
    </form>
  );

}