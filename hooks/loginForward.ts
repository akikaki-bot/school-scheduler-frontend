"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";


export function loginForward( location : Location , router : AppRouterInstance ) {
    const storage = localStorage;

    storage.setItem('state' , location.pathname);
    router.push('/dashboard');
}