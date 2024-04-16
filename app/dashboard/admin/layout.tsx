"use client"
import { useUser } from "@/hooks/useUser";
import { ReactNode } from "react";



export default function Layout({ children } : { children : ReactNode }) {

    const { data } = useUser();
    
    if( data === null ) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-2xl"> 読み込み中であります。 </div>
        </div>
    )

    if( typeof data.serverAdmin === "undefined" || data.serverAdmin === false ) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-2xl"> Forbidden. ここで見るものは**今は**無いようです。 </div>
        </div>
    )

    return (
        <>
            {children}
        </>
    )
}