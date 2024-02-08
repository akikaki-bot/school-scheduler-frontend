


export function ErrorMessageComponent({ err } : { err : string | null }) {
    return (
        <div className="absolute top-20 right-2">
            {
                typeof err === "string" && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative z-20" role="alert">
                        <strong className="font-bold"> {err} </strong>
                    </div>
                )
            }
        </div>
    )
}