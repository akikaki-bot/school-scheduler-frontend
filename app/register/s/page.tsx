"use client";
import { Spinner } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";



export default function S() {

    const searchParams = useSearchParams()
    const router = useRouter()

    if (searchParams.get(`t`) === null) return (
        <p> Invaild URL Parameter </p>
    )

    useEffect(() => {
        const token = searchParams.get(`t`);
        if (token === null) return;
        localStorage.setItem('user', token);
        const location = localStorage.getItem('state');
        if (location === null) return router.push('/dashboard');
        localStorage.removeItem('state');
        router.push(location);
    }, [])
    return (
        <> <Spinner /> ログイン処理中 </>
    )
} 