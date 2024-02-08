"use client";
import { useState } from "react";
type ValueResovled = string | number

export function CanCopyBlock({ value }: { value : ValueResovled }){

    const [ ok , setOk ] = useState(false)

    function copyToClipboard(){
        navigator.clipboard.writeText( String(value ?? "") ).then(
            () => {
                setOk( true )
                setTimeout(() => setOk( false ) , 2500 )
            }
        )
    }

    return (
        <button aria-label={`${value}をクリップボードにコピー`} className="rounded-lg border-1 border-gray-200 py-[0.005rem] px-1 bg-white" onClick={() => copyToClipboard()}>
            <code>
                <p>{ value } { ok ? <SuccessCopy /> : <CopyEmoji />}</p>
            </code>
        </button>
    )
}

export function CopyEmoji(){
    return (
        <svg className="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M14 4v3c0 .6-.4 1-1 1h-3m4 10v1c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V9c0-.6.4-1 1-1h2m11-3v10c0 .6-.4 1-1 1h-7a1 1 0 0 1-1-1V7.9c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H18c.6 0 1 .4 1 1Z"/>
        </svg>
    )
}

export function SuccessCopy(){
    return (
        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3c.6 0 1 .4 1 1v15c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V5c0-.6.4-1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"/>
        </svg>
    )
}