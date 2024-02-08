import { API_URL } from "@/constants/setting"


export type HTTPRestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

export async function settingFetch< T = any , R = any >( path : string , method : HTTPRestMethod , token : string , data ?: T ){
    
    const requestBody : RequestInit = typeof data === "undefined" ? {
        method : method,
        mode: "cors",
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        credentials: "same-origin",
    } : {
        method : method,
        mode: "cors",
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        credentials: "same-origin",
        body : JSON.stringify( data )
    }

    const response = await fetch(`${API_URL}${path}`, requestBody)
    return response
}