"use client";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




export default function CallbackLoginPage() {
    const session = useSession();
    const router = useRouter();

    if(
        session.status !== "loading" &&
        session.status !== "authenticated"
    ) return router.push('/login');

    useEffect(() => {
        LoginToHSS();
    }, [ session.status === "authenticated" ])

    async function LoginToHSS() {
        if( session.status === "unauthenticated" ) return router.push('/login');
        if( session.status === "loading" ) return;
        console.log(
            session.data?.user,
            session.data
        )
    }

    return (
        <div className="p-4 flex flex-col justify-center items-center">
            <h1> <Spinner /> Logging... </h1>
        </div>
    )
}