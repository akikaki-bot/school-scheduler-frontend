export function AutoModifyGrid({ isSidebarComponent = false , children } : { isSidebarComponent ?: boolean,  children : React.ReactNode }){
    return (
        <div className={`grid ${isSidebarComponent ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"} gap-4`}>
            {children}
        </div>
    )
}