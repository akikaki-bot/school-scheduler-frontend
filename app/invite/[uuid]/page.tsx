"use client";
import { Content } from "@/components/content";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { Loading } from "@/components/loading";
import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { Warning } from "@/components/warning";
import { API_URL } from "@/constants/setting";
import { BaseScheme } from "@/constants/types/user";
import { Button, Card, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function InviteUser({ params: { uuid } }: { params: { uuid: string } }) {

    const router = useRouter()
    const [status, setStatus] = useState(900)
    const [inviteSchool, setInviteSchool] = useState<null | BaseScheme>(null)
    const [ err , setErr ] = useState<null | string>(null)

    useEffect(() => {
        InviteGet()
    }, [])

    async function InviteGet() {
        if (sessionStorage.getItem('user') == null) return router.push('/dashboard')
        const response = await fetch(`${API_URL}/v1/school/invite`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                code: uuid
            })
        })
        if (!response.ok || response.status === 403) setStatus(response.status)
        else setStatus(200)

        const data = await response.json()
        setInviteSchool(data.body.school)
    }

    async function InvitePUT(){
        const response = await fetch(`${API_URL}/v1/school/invite`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                code: uuid
            })
        })
        if(!response.ok || response.status !== 200) return setErr(`招待を受け入れれませんでした。 : ${response.status}(${response.statusText})`);
        else return router.push('/dashboard')
    }

    return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                {
                    status === 900 && (
                        <Loading />
                    )
                }
                {
                    (status !== 200 && status !== 900) && (
                        <>
                            <Title title={`無効な招待コードです。`} />
                            <Content>
                                無効な招待コードです。
                            </Content>
                        </>
                    )
                }
                {
                    status === 200 && (
                        <>
                            <ErrorMessageComponent err={err} />
                            <Title title={`管理者への招待`} IsCenter />
                            <Content className="grid col-span-12 justify-center gap-4">
                                <div className="text-2xl text-center">
                                    {inviteSchool?.details.name} から管理者への招待が来ています。
                                </div>
                                <Warning className="sm:text-xl items-center">
                                    ・この招待を受け入れた段階で<code>{inviteSchool?.details.name}</code>への管理者へ追加されます。<br />
                                    ・もしこの招待を受け入れない場合は、このページを閉じてください。
                                </Warning>
                                <Button className="py-4" color="success" onPress={() => InvitePUT()}> 招待を受ける </Button>
                            </Content>
                        </>
                    )
                }
            </GridChildren>
        </GridMainLayout>
    )
}