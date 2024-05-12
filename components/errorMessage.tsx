


export function ErrorMessageComponent({ err } : { err : string | null }) {
    return (
        <div className={`flex flex-col fixed top-2 right-0 w-full h-[9rem] shadow-md rounded-l-xl p-2 bg-white z-[999] ${err !== null ? " " : "translate-x-[32rem]"} duration-[3500] transition-all max-w-[500px]`}>
            <h1 className="text-2xl font-semibold"> 正常に保存ができませんでした。 </h1>
            <div className="px-4 h-[0.75px] bg-red-200" />
            <p className="text-xl"> { err } </p>
        </div>
    )
}