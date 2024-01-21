"use client";
import { ReactNode } from "react";



export function Root ({ children } : { children : ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}