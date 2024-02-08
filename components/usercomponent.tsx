import { Schools } from "@/constants/schooltypes";
import { API_URL } from "@/constants/setting";
import { BaseScheme, User } from "@/constants/types/user";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export function UserComponent({ user }: { user: User }) {

    const [ schools , setSchools ] = useState<BaseScheme[] | null>(null)

    useEffect(() => {
        getUserMenu();
    }, [])

    async function getUserMenu() {

        const token = sessionStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/permission`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        })
        if(!response.ok) return;
        const data = await response.json()
        const schools = data.body.schools as string[];
        if(schools.length === 0) return;
        const result = (await Promise.all([ ...schools.map( async v => await getSchoolInfo( v )) ]))
        const filtered = result.filter( v => typeof v !== "undefined")
        setSchools( filtered )
    }

    async function getSchoolInfo( id : string ){
        const token = sessionStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/school/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        })
        const data = await response.json()
        return data.body.data as BaseScheme;
    }



    return (
        <div className="grid gird-cols-12 w-full h-full gap-4">
            { /* User のあれ  */}
            <div className="sm:row-span-12 sm:row-span-3 row-start-1">
                <h1 className="text-3xl font-bold"> {user.username} </h1>
                <p className="text-2xl"> さんのマイページ </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 sm:row-span-12 sm:row-span-12 lg:px-24 gap-4">
                {
                    schools !== null && 
                    schools.map( (data , index ) => typeof data === "object" && (
                            <Card className="py-4" key={index}>
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                    <p className="text-tiny uppercase font-bold">編集ページ</p>
                                    <h4 className="font-bold text-large">{ data.details.name }{ Schools.find( v=> v.value === +data.details.type ? data.details.type.toString() : 0 )?.typeName }</h4>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2 items-center">
                                    <Link href={`/dashboard/${data?.schoolId}`}>
                                        <Image
                                            alt="Card background"
                                            className="object-cover rounded-xl"
                                            src="/logo.png"
                                            width={270}
                                            height={300}
                                        />
                                    </Link>
                                </CardBody>
                            </Card>
                        )
                    )
                }
                <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">管理者ページ</p>
                        <h4 className="font-bold text-large">新規で追加する もしくは 管理者として招待を受ける</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 items-center">
                        <Link href="/dashboard/add">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="/logo.png"
                                width={270}
                                height={300}
                            />
                        </Link>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}