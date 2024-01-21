export function Title( {title , IsCenter = false } : { title : string, IsCenter ?: boolean } ){
    return (
        <div className="py-5">
            <h1 className={`text-2xl sm:text-3xl font-bold opacity-80 ${IsCenter ? "text-center" : ""}`}> { title }</h1>
            <hr className="" />
        </div>
    )
}