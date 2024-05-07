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
import { Infomation } from "@/components/infomation";
import { CanCopyBlock } from "@/components/canCopyBlock";




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
                "Authorization": `Bearer ${localStorage.getItem('user')}`
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
            <Title title="その他設定" />
            <Content>
                <Infomation className="text-xl">
                    <h1 className="text-2xl font-semibold"> ここの設定は現在準備中です。 </h1>
                    <p className="pb-2"> そのうち追加されます。 </p>
                </Infomation>
                <br />
                その他の設定は危険な操作も含まれています。十分にご注意ください。
                <Title title="クラスのAPIパス（開発者向け）" />
                <Content IsCenter={false}>
                    ( TODO : クラスのAPIパスの説明 ) <br />
                    {`https://hss-dev.aknet.tech/v1/school/${id}/patchsetting/${grade}/${classNumber}`}
                </Content>
                <Title title="クラス削除" />
                <Content className="flex flex-col gap-4">
                    TODO : クラス削除の説明
                    <Button color="danger" className="py-2" disabled> クラスを削除する </Button>
                </Content>
            </Content>
        </SidebarComopnent>
    )
}