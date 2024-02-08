import { Image } from "@nextui-org/react";
import React, { ReactNode } from "react";


export function GridMainLayout({ children } : { children : React.ReactNode}){
    return (
        <main className="grid gird-cols-12 min-h-screen">
            {children}
        </main>
    )
}

export function TitleAndSubtitle( { title , subtitle } : { title : ReactNode, subtitle : ReactNode }){
    return (
        <h1 className="text-center text-4xl text-white">
            <span className="font-semibold"> {title} </span><br /> 
            <span className="text-2xl"> {subtitle} </span> 
        </h1>
    )
}

export function BackgroundFixedImage( { src } : { src : string }){
    return (
        <Image
            removeWrapper
            className='fixed p-2 rounded-xl left-0 min-w-screen min-h-screen object-cover -z-10 blur-sm'
            src={src}
            alt="Auto generated backgroud image"
        />
    )
}

export function GridChildren(  { children , paddingX = 12 , paddingY = 12, IsBackground = false, IsHeightFull = true , className } : { children : React.ReactNode , paddingX : number, IsBackground ?: boolean , className ?: string , paddingY ?: number , IsHeightFull ?: boolean} ) {
    return (
        <div className={`col-span-12 ${IsBackground ? "bg-white" : ""} ${IsHeightFull && "h-full"} ${paddingY ? `py-${paddingY}` : `py-12`} ${paddingX ? `px-${paddingX}` : `px-12`} ${typeof className !== "undefined" ? className : ""}`}>
            {children}
        </div>
    )
}