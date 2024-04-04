import { API_URL } from "@/constants/setting";
import { User, UserDatas } from "@/constants/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginForward } from "./loginForward";





export function useClass( id : string , grade : string , classNumber : string ){
    const router = useRouter()
    const [
        data  , setData
    ] = useState<UserDatas | null>( null );
    const [
        user  , setUser
    ] = useState<User | null>(null)
    
    const [
        isRan  , setRun
    ] = useState(false)

    async function updateData(){
        GetClassData( id , grade , classNumber );
    }

    useEffect(() => {
        ( async () => {
            if( !isRan ){
                const session = localStorage
                const logined = session.getItem('user')
                if (typeof logined === "undefined" || logined === null) return loginForward( location , router )
                await GetClassData( id , grade , classNumber )
            }
        })();

        const interval = setInterval(async () => {
            await GetClassData( id , grade , classNumber )
        }, 1000 * 10)

        return () => {
            console.log(`[Worker] Unregistered worker`)
            clearInterval(interval)
        }
    }, [ ])

    async function GetClassData( id : string , grade : string , classNumber : string ){
        const response = await fetch(`${API_URL}/v1/school/${id}/userdatas/${grade}/${classNumber}`, {
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
            setData( data.body )
        }
    }

    if( typeof data === "object" && typeof user === "object") {
        return {
            data,
            user,
            updateData
        }
    } else {
        return {
            data,
            user,
            updateData
        }
    }
}