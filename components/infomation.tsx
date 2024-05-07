import { ReactNode } from "react";


export function Infomation({ className , children } : { className : string,  children : ReactNode }){
    return (
        <div className={`max-w-[700px] rounded-md bg-slate-50 ${className} border-l-4 border-l-blue-200`}>
            <div className="p-5 h-full ">
                {children}
            </div>
        </div>
    )
}