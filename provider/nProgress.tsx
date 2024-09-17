"use client";
import { ReactNode } from 'react'
import { AppProgressBar } from 'next-nprogress-bar';

export const NprogressProvider = ({ children }: { children: ReactNode }) => {
    return( 
        <>
            {children} 
            <AppProgressBar
                height="4px"
                color="#FFCA00"
                options={{ showSpinner: true }}
                shallowRouting={true}
            />
        </>
    )
}