import { ReactNode } from "react";


export function Warning({ className , children } : { className : string,  children : ReactNode }){

    return (
        <div className={`max-w-[700px] rounded-md bg-slate-50 ${className} border-l-4 border-l-yellow-200`}>
            <div className="p-5 h-full ">
                <span className="text-2xl font-semibold"><span className="text-yellow-400">⚠️</span> 注意 / Warning </span><br />
                    {children}
            </div>
        </div>
    )
}