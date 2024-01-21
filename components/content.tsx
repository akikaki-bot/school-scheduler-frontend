import { ReactNode } from "react";

export function Content({ children , className , IsCenter = false } : { className ?: string ,children : ReactNode, IsCenter ?: boolean }){
    return (
        <div className={`sm:text-xl ${className ?? ""} ${IsCenter ? "text-center" : ""}`}>
            {children}
        </div>
    )
}