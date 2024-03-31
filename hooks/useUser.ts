import { API_URL } from "@/constants/setting"
import { User } from "@/constants/types/user"
import { useEffect, useState } from "react"




export function useUser( id : string = "@me" ) {

    const [ data , setOwner ] = useState<User | null>( null )

    useEffect(() => {
        setInterval(async () => {
            await ResolveId( )
        }, 1000 * 60 * 1);
        (async () => {
            await ResolveId( )
        })()
    }, [ ])

    async function ResolveId(){
        const token = localStorage.getItem('user');
        if( typeof token === "undefined" || token === null) return;
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            credentials: "same-origin",
        })
        if(!response.ok) return;

        const user = await response.json() as { body : { data : User } }
        setOwner(user.body.data)
    }

    if( data === null ){
        return { data : null }
    } else {
        return { data }
    }
}