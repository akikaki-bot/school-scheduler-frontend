"use client"
import { Content } from "@/components/content";
import { LoadingWithSidebar } from "@/components/loading";
import { useSchool } from "@/hooks/useSchool";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useClass } from "@/hooks/useClass";




export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    //const { data, user } = useSchool(id)
    const router = useRouter()

    const { data , user } = useClass( id , grade , classNumber )

    // Values
    const [DefaultTimeLineIndex, setDefaultTimeIndex] = useState<number | null>(null)

    useEffect(() => {
        SetInput()
    }, [data !== null])

    function SetInput() {
        if (data === null) return;
        const classData = data
        if (!classData) return;
        console.log(classData.defaultTimelineIndex)
        setDefaultTimeIndex(classData.defaultTimelineIndex)
    }

    async function SaveDefaultTimeline() {
        const response = await fetch(`${API_URL}/v1/school/${id}/userdatas/${grade}/${classNumber}/sun`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                bodies: [
                    {
                        key: "defaultTimelineIndex",
                        state : "update",
                        value : DefaultTimeLineIndex
                    }
                ]
            })
        })
        if (!response.ok) return;

    }

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <Title title={`設定`} />
            <Content>
                デフォルトの時間割数・その他もろもろの設定が出来ます。
            </Content>
            <Title title={`デフォルトの時間割数`} />
            <Content>
                {
                    DefaultTimeLineIndex !== null ?
                        (
                            <>
                                <Input type="number" min="1" onChange={((e) => setDefaultTimeIndex(+e.target.value))} defaultValue={String(DefaultTimeLineIndex)} />
                                <Button color="success" className="py-2" onClick={() => SaveDefaultTimeline()}> 保存 </Button>
                            </>
                        )
                        : <LoadingWithSidebar />
                }
            </Content>
        </SidebarComopnent>
    )
}