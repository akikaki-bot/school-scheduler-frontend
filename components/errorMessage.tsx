


export function ErrorMessageComponent({ err } : { err : string | null }) {
    return (
        <div className="fixed top-20 right-5 p-2 z-[999]">
            {
                typeof err === "string" && (
                    <div className="min-h-[150px] bg-white border-l-red-700 border-l-3 border border-gray-200 text-red-700 px-2 py-1 rounded relative z-[999]" role="alert">
                        <h1 className="text-xl"> エラーが発生しました。</h1>
                        <strong className="font-bold text-xl text-gray-800"> {err} </strong>
                    </div>
                )
            }
        </div>
    )
}