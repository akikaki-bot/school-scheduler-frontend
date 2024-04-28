"use client"
import { useUser } from "@/hooks/useUser";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { ReactNode } from "react";



export default function Layout({ children } : { children : ReactNode }) {

    const { data } = useUser();
    
    if( data === null ) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-2xl"> 読み込み中であります。 </div>
        </div>
    )

    if( typeof data.serverAdmin === "undefined" || data.serverAdmin === false ) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image alt="403" src="/Forbidden.png" width={400} height={400} />
            <Button color="primary" className="mt-4" href="/">ホームに戻る</Button>
        </div>
    )

    return (
        <>
            {children}
        </>
    )
}