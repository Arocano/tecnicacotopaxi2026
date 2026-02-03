"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'
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
import { useRouter } from 'next/navigation';
import Head from 'next/head';

interface User {
    email: string;
}

const Admin = () => {
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user: User = JSON.parse(userString);
            if (user.email !== 'adminsantarosa@gmail.com') {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        
    };
    const handleChaski10k=()=>{
        //console.log("/forms/santarosa")
        router.push('/forms/chaskiadmin');
    }

    const handleTablonTzunantza=()=>{
        //console.log("/forms/tablonadmin")
        router.push('/forms/tablonadmin');
    }
    return (
        <div className="flex flex-col min-h-min w-full items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Admin</h1>
           
            <button
                onClick={handleChaski10k}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Chaski 10k
            </button>
            <button
                onClick={handleTablonTzunantza}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                Tablón-Tzunantza
            </button>
            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Cerrar sesión
            </button>
        </div>
    );
}
export default Admin;