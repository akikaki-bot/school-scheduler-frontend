"use client";
import { Content } from "@/components/content";
import { Loading, LoadingWithSidebar } from "@/components/loading"
import { useSchool } from "@/components/schoolComponent"
import { SidebarComopnent } from "@/components/sidebarComponent"
import { Title } from "@/components/title"
import { API_URL } from "@/constants/setting";
import { DateChangeArray, Dates, MonthData, UserDatas } from "@/constants/types/user";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    const { data, user } = useSchool(id)
    const router = useRouter()
    const [isOpen, Open] = useState(false)

    const [ monthIndex , setMonthIndex ] = useState<Dates>("mon")
    const [ defaultIndex , setDefaultIndex ] = useState<number | null>( null )

    const [schoolData, setSchoolData] = useState<UserDatas | null>(null)
    const [ err , setError ] = useState<string | null>( null )
    useEffect(() => {
        setTimeout(() => setError( null ) , 4000)
    }, [typeof err === "string"])

    useEffect(() => {
        const gradeData = data?.userDatas.find((datas) => datas.grade === +grade && datas.class === +classNumber)
        if (!gradeData) return;
        setSchoolData(gradeData)
    }, [data !== null])



    if (typeof data !== "object") return (
        <Loading />
    )

    function ChangeMonthToLabel( label : Dates | string ){
        switch( label ){
            case "sun" : return "日曜日";
            case "mon" : return "月曜日";
            case "tue" : return "火曜日";
            case "wed" : return "水曜日";
            case "thu" : return "木曜日";
            case "fri" : return "金曜日";
            case "sat" : return "土曜日";
        }
    }

    async function setDefaultTimeIndex(){
        const response = await fetch(`${API_URL}/v1/school/${id}/patchsetting`, {
            method : "PATCH",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify({
                token : `Bearer ${sessionStorage.getItem('user')}`,
                data : {
                    headInfo : "details",
                    patchHeader : "defaultTimelineIndex",
                    value : defaultIndex
                }
            })
        })
        if(!response.ok) return setError(`エラーが発生しました。\nサーバーが無効な返答をしました : ${response.statusText}`);
        else router.push(`${classNumber}/${monthIndex}/edit`)
    }

    async function SetOpenChange() {
        if( typeof data?.details.defaultTimelineIndex === "undefined" ) return Open( isOpen ? false : true )
        else router.push(`${classNumber}/${monthIndex}/edit`)
    }

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <div className="absolute top-20 right-2">
                {
                    typeof err === "string" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative z-20" role="alert">
                            <strong className="font-bold"> {err} </strong>
                        </div>
                    )
                }
            </div>
            <Title title={`${grade}-${classNumber}の標準時間割編集`} />
            <Content className="h-1/2">
                {!schoolData && <LoadingWithSidebar />}
                {
                    schoolData && (
                        <Select
                            label="曜日を選んでください。"
                            className="max-w-xs py-2"
                            defaultSelectedKeys={["mon"]}
                        >
                            {
                                Object.keys(schoolData.defaultTimelineData).map((labelData, index) => (
                                    <SelectItem key={labelData} onClick={(e) => setMonthIndex( DateChangeArray[index] as Dates )}>
                                        {ChangeMonthToLabel(labelData)}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                    )
                }                
                <table className="border border-slate-400 h-1/2 py-2 w-10/12">
                    <thead>
                        <tr>
                            <th> n時間目 </th>
                            <th className="flex border border-slate-300 justify-end"> <Button variant="light" color="primary" onClick={() => SetOpenChange()}> 編集する </Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            schoolData && 
                            schoolData.defaultTimelineData[monthIndex as Dates].length !== 0 ? 
                            schoolData.defaultTimelineData[monthIndex as Dates].map((data, index1) =>
                                (
                                    <tr key={index1 + 1120}>
                                        <td key={index1 + 12212} className="border border-slate-300 text-center py-3"> {index1 + 1}時間目 </td>
                                        <td key={index1} className="border border-slate-300 text-center py-3"> {data.name} </td>
                                    </tr>
                                )
                            )
                            :
                            (
                                typeof data?.details.defaultTimelineIndex !== "undefined" ?
                                    (
                                        new Array( +data?.details.defaultTimelineIndex ).fill(0).map(( _ , index1) => (
                                            <tr key={index1 + 122}>
                                                <td key={index1 + 1231} className="border border-slate-300 text-center py-3"> {index1 + 1}時間目 </td>
                                                <td key={index1} className="border font-semibold border-slate-300 text-gray-600 text-center py-3"> データがありません </td>
                                            </tr>
                                        ))
                                    ) : 
                                    <tr>
                                        <td className="border border-slate-300 text-center py-3 text-gray-600"> ほんとにデータがありません </td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>
            </Content>
            <Modal
                isOpen={isOpen}
                onOpenChange={Open}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"> 基本的な設定 </ModalHeader>
                            <ModalBody>
                                <label > 基本時間数を入力 </label>
                                <Input placeholder="何時間普段授業あるんですか...？私は７時間ですつらいね..." min={1} type="number" onChange={(e) => setDefaultIndex( +e.target.value )} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={() => setDefaultTimeIndex()}>
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