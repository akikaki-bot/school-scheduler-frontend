"use client";
import { SelectBox } from "@/components/box";
import { Content } from "@/components/content";
import { AutoModifyGrid } from "@/components/grid-cols-auto";
import { Loading } from "@/components/loading";
import { useSchool } from "@/components/schoolComponent";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { BaseScheme, User } from "@/constants/types/user";
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function DashboardTimeLine({ params: { id } }: { params: { id: string } }) {

    const { data, user } = useSchool(id)
    const [isOpen, Open] = useState(false)
    const router = useRouter()

    const [ err , setError ] = useState<string | null>( null )
    const [grade, setGrade] = useState<number | null>(null)
    const [classNumber, setClassNumber] = useState<number | null>(null)

    useEffect(() => {
        setTimeout(() => setError( null ) , 4000)
    }, [typeof err === "string"])

    if (typeof data !== "object") return (
        <Loading />
    )

    async function putClass() {

        const DataPut = {
            schoolId: id,
            token: `Bearer ${sessionStorage.getItem('user')}`,
            bodies: [
                {
                    headKey: "userDatas",
                    grade: grade,
                    class: classNumber,
                    date: "sun",
                    key: "defaultTimelineData",
                    index: 1,
                    value: {
                        name: "初期の値"
                    }
                }
            ]
        }

        const response = await fetch(`${API_URL}/v1/school`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify(DataPut)
        })
        if (!response.ok) return setError(`エラーが発生しました。\nサーバーが無効な返答をしました : ${response.statusText}`);
        else router.push(`timeline/${grade}/${classNumber}/`)
    }

    return (
        <SidebarComopnent sid={id}>
            <div className="absolute top-20 right-2">
                {
                    typeof err === "string" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative z-20" role="alert">
                            <strong className="font-bold"> {err} </strong>
                        </div>
                    )
                }
            </div>
            <Title title="標準時間割の設定" />
            <Content>
                <h1 className="py-2"> 標準時間割（変更等ない状態）の設定が出来ます。 </h1>
            </Content>
            <Title title="クラス選択" />
            <Content className="flex justify-center">
                <AutoModifyGrid isSidebarComponent>
                    {
                        data?.userDatas.map((data, index) => (
                            <SelectBox key={index} title={`${data.grade}-${data.class}`} description={`${data.grade}-${data.class}の基本時間割を変更`} onClick={() => router.push(`timeline/${data.grade}/${data.class}`)} />
                        ))
                    }
                    <SelectBox
                        title={`新しくクラスを追加する`}
                        description={`ここをクリックして新しくクラスを追加します。`}
                        onClick={() => Open(isOpen ? false : true)}
                    />
                </AutoModifyGrid>
            </Content>
            <Modal
                isOpen={isOpen}
                onOpenChange={Open}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"> クラスの追加 </ModalHeader>
                            <ModalBody>
                                <label> 学年 </label>
                                <Input placeholder="学年" min={1} type="number" onChange={(e) => setGrade(+e.target.value)} />
                                <label> クラス </label>
                                <Input placeholder="クラス" min={1} type="number" onChange={(e) => setClassNumber(+e.target.value)} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={() => putClass()}>
                                    作成する
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </SidebarComopnent>
    )
}