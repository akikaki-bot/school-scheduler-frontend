import { API_URL } from "@/constants/setting";
import { BaseScheme, User } from "@/constants/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginForward } from "./loginForward";




export function useSchool( id : string ) {
    const router = useRouter()
    const [ data , setData ] = useState<BaseScheme | null>( null );
    const [ user , setUser ] = useState<User | null>(null)

    const [ isRan , setRun ] = useState(false)

    useEffect(() => {
        ( async () => {
            if( !isRan ){
                const session = localStorage
                const logined = session.getItem('user')
                if (typeof logined === "undefined" || logined === null) return loginForward( location , router )
                await GetSchoolData( id )
            }
        })()
        console.log(`[Worker] Registered worker`)
        const interval = setInterval(async () => {
            await GetSchoolData( id )
        }, 1000 * 10)

        return () => {
            console.log(`[Worker] Unregistered worker`)
            clearInterval(interval)
        }
    }, [ ])

    async function Worker( id : string ){

    }

    async function runfunc() {
        await GetSchoolData( id )
    }

    async function GetSchoolData( id : string ){
        const response = await fetch(`${API_URL}/v1/school/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin"
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
            user,
            runfunc
        }
    } else {
        return {
            data : null,
            user : null,
            runfunc
        }
    }
}