"use client";
import { Content } from "@/components/content";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { Loading } from "@/components/loading";
import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { Warning } from "@/components/warning";
import { API_URL } from "@/constants/setting";
import { BaseScheme, BotUser } from "@/constants/types/user";
import { loginForward } from "@/hooks/loginForward";
import { useSchool } from "@/hooks/useSchool";
import { useUser } from "@/hooks/useUser";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";



export default function ApplicationAuthorization({ params: { hid } }: { params: { hid: string } }) {

    const [page, setPage] = useState(0)
    const [ school , setSchool ] = useState<null | string>(null)
    const [ schools, setSchools ] = useState<BaseScheme[]>([])

    const [ checked , setChecked ] = useState(true)

    const router = useRouter();

    useEffect(() => {
        if(localStorage.getItem('user') === null) return loginForward(location, router)
        getUserMenu()
        checkBotUser();
    }, [])

    async function checkBotUser() {
        const user = hid;
        const data = await getBotUser(user)
        if( data === null || typeof data === "undefined" ) return router.push("/application/invaild");
        if( !data.isBot ) return router.push("/application/invaild");
    }

    useEffect(( ) => {
        console.log(school , resolveSchooldNameFromId(school ?? "0"), page)
    }, [school || schools || page])

    useEffect(() => {
        if( page === 1 ){
            isAddedBotCheck();
        }
    }, [page])

    async function Authorization() {
        const response = await fetch(`${API_URL}/v1/application/authorization`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                sid : school,
                applicationId : hid
            })
        })
        if (!response.ok || response.status === 403) return router.push("/application/end")
        else router.push("/application/success")
    }

    async function getUserMenu() {
        const token = localStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/permission`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
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

    async function isAddedBotCheck() {
        const schoolData = schools.find( v => v.schoolId === school );
        const bot = schoolData?.details.admins.find( v => String(v) === hid );
        if(bot) return router.push("/application/end")

        setChecked( false )
    }

    async function getSchoolInfo( id : string ){
        const response = await fetch(`${API_URL}/v1/school/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin"
        })
        const data = await response.json()
        return data.body.data as BaseScheme;
    }

    async function getBotUser( id : string ) {
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
        })
        if(!response.ok) return;
        const user = await response.json() as { body : { data : BotUser } }
        return user.body.data
    }

    function ResolveSchoolIdFromName( name : string ){
        console.log( name , schools.find( v => v.details.name === name ))
        return schools.find( v => v.details.name === name )?.schoolId
    }

    function resolveSchooldNameFromId( id : string ){
        return schools.find( v => v.schoolId === id )?.details.name
    }


    return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                {
                    page === 0 && (
                        <>
                            <Title title={"学校の選択"} IsCenter />
                            <Content className="grid col-span-12 justify-center gap-4">
                                <p className="text-xl"> この操作を続行する学校を選択してください。 </p>
                                <Select>
                                    {
                                        schools.map( ( data , index ) => (
                                            <SelectItem key={index} onClick={() => setSchool(ResolveSchoolIdFromName( data.details.name ?? "a" )?? "0")}>
                                                {data.details.name}
                                            </SelectItem>
                                        ))
                                    }
                                </Select>
                                <Button color="success" onClick={() => setPage(1)} disabled={ school === null }>次へ</Button>
                            </Content>
                        </>
                    )
                }
                {
                    page === 1 && (
                        <>
                            <Title title={"アプリケーションの認証"} IsCenter />
                            <Content className="grid col-span-12 justify-center gap-4">
                                <p className="text-xl"> 
                                    このアプリケーションはあなたの学校({resolveSchooldNameFromId( school ?? "0")})の情報を取得できるようになります。<br />
                                    このアプリケーションを認証しますか？
                                </p>
                                <Warning className="text-xl">
                                    <p>
                                        ・認証はいつでも管理者管理ページより解除できます。
                                    </p>
                                </Warning>
                                <Button color="success" onClick={() => Authorization()} isDisabled={checked}>認証する</Button>
                                <Button color="danger" onClick={() => router.push("/application/end")}>認証しない</Button>
                            </Content>
                        </>
                    )
                }
            </GridChildren>
        </GridMainLayout>
    )
}