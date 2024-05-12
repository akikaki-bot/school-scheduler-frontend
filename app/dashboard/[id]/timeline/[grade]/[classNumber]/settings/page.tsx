"use client"
import { Content } from "@/components/content";
import { LoadingWithSidebar } from "@/components/loading";
import { useSchool } from "@/hooks/useSchool";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useClass } from "@/hooks/useClass";
import { Infomation } from "@/components/infomation";
import { CanCopyBlock } from "@/components/canCopyBlock";
import { ErrorMessageComponent } from "@/components/errorMessage";




export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    //const { data, user } = useSchool(id)
    const router = useRouter()
    const [ err , setErr ] = useState<null | string>( null )
    const { data , user } = useClass( id , grade , classNumber )

    const [ isOpenModal , setOpenModal ] = useState<boolean>( false )

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
        if (!response.ok) return setErr('エラーが発生しました。正常にクラスが保存できませんでした。');
    }

    async function DeleteClass() {
        const response = await fetch(`${API_URL}/v1/school/${id}/class`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                grade: grade,
                classNumber: classNumber
            })
        })
        if (!response.ok) return setErr('エラーが発生しました。正常にクラスが削除できませんでした。');;
        router.push(`/dashboard/${id}/timeline`)
    }

    useEffect(() => {
        if (err !== null) {
            setTimeout(() => {
                setErr(null)
            }, 5000)
        }
    }, [ err !== null ])

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <ErrorMessageComponent err={err} />
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
                    <h1 className="text-2xl font-semibold"> ここの設定は一部準備中です。 </h1>
                    <p className="pb-2"> そのうち追加されます。 </p>
                </Infomation>
                <br />
                その他の設定は危険な操作も含まれています。十分にご注意ください。
                <Title title="クラスのAPIパス（開発者向け）" />
                <Content IsCenter={false}>
                    ( TODO : クラスのAPIパスの説明 ) <br />
                    {/*`https://hss-dev.aknet.tech/v1/school/${id}/patchsetting/${grade}/${classNumber}`*/}
                </Content>
                <Title title="クラス削除" />
                <Content className="flex flex-col gap-4">
                    現在のクラスを削除します。<br />
                    この操作は取り消せません。十分にご注意ください。
                    <Button color="danger" className="py-2" onClick={() => setOpenModal( true )}> クラスを削除する </Button>
                </Content>
            </Content>
            <Modal
                isOpen={isOpenModal}
                onClose={() => setOpenModal(false)}
                title="クラス削除"    
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl"> クラスの削除 </ModalHeader>
                            <ModalBody>
                                クラスを削除します。よろしいですか？
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={() => DeleteClass()}> 削除する </Button>
                                <Button color="secondary" onClick={() => setOpenModal(false)}> キャンセル </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </SidebarComopnent>
    )
}