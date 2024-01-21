import { API_URL } from "@/constants/setting";
import { BaseScheme, User } from "@/constants/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




export function useSchool( id : string ) {
    const router = useRouter()
    const [ data , setData ] = useState<BaseScheme | null>( null );
    const [ user , setUser ] = useState<User | null>(null)

    const [ isRan , setRun ] = useState(false)

    useEffect(() => {
        ( async () => {
            if( !isRan ){
                const session = sessionStorage
                const logined = session.getItem('user')
                if (typeof logined === "undefined" || logined === null) return router.push("/dashboard")
                await GetSchoolData( id )
            }
        })()
    }, [ ])

    async function GetSchoolData( id : string ){
        const response = await fetch(`${API_URL}/v1/school/${id}/get`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify({
                token : `Bearer ${sessionStorage.getItem('user')}`
            })
        });
        if(!response.ok) return router.push(`/`)
        if(response.ok) {
            const data = await response.json()
            setData( data.body.data )
        }
    }

    if( typeof data === "object" && typeof user === "object") {
        return {
            data,
            user
        }
    } else {
        return {
            data : null,
            user : null
        }
    }
}