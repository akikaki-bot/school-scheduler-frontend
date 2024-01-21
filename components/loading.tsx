import { Spinner } from "@nextui-org/react";


export function Loading() {

    return (
        <div className="flex w-screen items-center justify-center ">
            <h1 className="text-3xl">
                <Spinner /> Loading
            </h1>
        </div>
    )
}

export function LoadingWithSidebar(){
    return (
        <div className="items-center justify-center ">
            <h1 className="text-3xl">
                <Spinner /> Loading
            </h1>
        </div>
    )
}