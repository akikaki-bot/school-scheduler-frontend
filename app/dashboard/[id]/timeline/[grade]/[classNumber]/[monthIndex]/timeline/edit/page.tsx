"use client";
import { Content } from "@/components/content";
import { LoadingWithSidebar } from "@/components/loading";
import { useSchool } from "@/hooks/useSchool";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Dates, Subjects, timelineDataChangeRequest } from "@/constants/types/user";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorMessageComponent } from "@/components/errorMessage";
import consola from "consola";


function ChangeMonthToLabel(label: Dates | string) {
    switch (label) {
        case "sun": return "日曜日";
        case "mon": return "月曜日";
        case "tue": return "火曜日";
        case "wed": return "水曜日";
        case "thu": return "木曜日";
        case "fri": return "金曜日";
        case "sat": return "土曜日";
    }
}

type Scheme = timelineDataChangeRequest;

export default function DashboardTimeLineEdit({ params: { id, grade, classNumber, monthIndex } }: { params: { id: string, grade: string, classNumber: string, monthIndex: Dates } }) {

    const { data, user , runfunc : resetFunc} = useSchool(id)
    const [TimeLines, setTimeLines] = useState<Subjects[] | null>(null)

    const router = useRouter()
    const [TempTimeLines, setTempTimeLines] = useState<{ time: number, data: Subjects }[] | null>(null)
    const [isOpen, Open] = useState(false)

    const [err, setError] = useState<string | null>(null)
    useEffect(() => {
        setTimeout(() => setError(null), 4000)
    }, [typeof err === "string"])

    function onChangeValueScadule(time: number, objectData: Subjects) {
        if (typeof TempTimeLines == "undefined" || TempTimeLines === null) return setTempTimeLines([{ time: time, data: objectData }])
        const Filtered = TempTimeLines.filter((data) => data.time !== time).sort((data, _data) => data.time - _data.time)
        setTempTimeLines(Filtered);
        setTempTimeLines(
            TempTimeLines === null ?
                [{ time: time, data: objectData }] :
                [...Filtered, { time: time, data: objectData }]
        )
    }

    function toSaveRefactor() {
        SaveData()
    }

    async function SaveData() {

        if (TempTimeLines === null) return;

        const SortedTimeLine = TempTimeLines.sort((data, _data) => data.time - _data.time);

        consola.log(SortedTimeLine)

        const DataExtractMap = SortedTimeLine.map(v => v.data)

        const DataBody = DataExtractMap?.map(
            (v, index) => {
                return {
                    key: "timelineData",
                    state : "update",
                    value: v,
                    index: index,
                } as timelineDataChangeRequest
            }
        )

        console.log(`[Databody] : ${JSON.stringify(DataBody)}`)

        if (
            data !== null &&
            typeof data.userDatas.find((data) => data.class === +classNumber && data.grade === +grade)?.defaultTimelineData == "object"
        ) {
            const ClassData = data.userDatas.find((data) => data.class === +classNumber && data.grade === +grade)
            if (ClassData) {

                if (ClassData.defaultTimelineData[monthIndex].length === 0 && (TempTimeLines.length !== ClassData.defaultTimelineIndex)) {
                    return setError(`教科データをすべて入力して保存してください。`)
                }

                console.log("[ClassDataCheck] " + ClassData.defaultTimelineData[monthIndex].length, ClassData.defaultTimelineIndex)
                if (ClassData.defaultTimelineData[monthIndex].length !== ClassData.defaultTimelineIndex) {
                    if (ClassData.defaultTimelineData[monthIndex].length < ClassData.defaultTimelineIndex) {
                        for (let i: number = ClassData.defaultTimelineData[monthIndex].length; i < ClassData.defaultTimelineIndex; i++) {
                            //@ts-ignore
                            ClassData.defaultTimelineData[monthIndex].push({ name: "仮", IsEvent: false, place: "仮"})
                        }
                    }
                    else {
                        console.log(`[DataTranslator] Splice array`)
                        ClassData.defaultTimelineData[monthIndex].splice(ClassData.defaultTimelineIndex)
                    }
                }



                const Indexs = SortedTimeLine.map((data) => data.time)
                const Removed = ClassData.defaultTimelineData[monthIndex].map((_, i) => Indexs.includes(i + 1) ? null : _)
                const Fixed = Removed.map(
                    (data, i) => {
                        if (data == null) {
                            const N = SortedTimeLine.find((data) => data.time === i + 1)
                            if (typeof N === "undefined") return ClassData.defaultTimelineData[monthIndex][i]
                            return N.data
                        }
                        else return data
                    }
                );

                console.log(`Index : ${Indexs} , Removed : ${Removed} , Fixed : ${Fixed}`)

                const DataBody = Fixed?.map(
                    (v, index) => {
                        return {
                            key: "timelineData",
                            index: index,
                            value: v,
                            state : "update"
                        } as timelineDataChangeRequest
                    }
                ).sort((a, b) =>  ( a.index as number ) - ( b.index as number ))

                return await PatchSetting(DataBody)
            }
            else {
                return setError(`クラスデータがありません。登録されていますか？`)
            }
        }


        return await PatchSetting(DataBody)
    }

    async function DeleteData() {
        const defaultTimelineIndex = data?.userDatas.find((data) => data.class === +classNumber && data.grade === +grade)?.defaultTimelineIndex
        const RequestBody : timelineDataChangeRequest[] = new Array(
            defaultTimelineIndex
        ).fill(1).map( ( _ , index ) => ({
            key : "timelineData",
            state : "remove",
            index : index,
            value : null
        }))

        return await PatchSetting(RequestBody)
    }

    async function PatchSetting(DataBody: Scheme[]) {
        const RequestBody = {
            schoolId: id,
            bodies: DataBody
        }

        consola.log(RequestBody, typeof RequestBody)

        const response = await fetch(`${API_URL}/v1/school/${id}/userdatas/${grade}/${classNumber}/${monthIndex}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify(RequestBody)
        })
        if (!response.ok) return;
        const dataRes = await response.json()

        router.push(`/dashboard/${id}/timeline/${grade}/${classNumber}`)
    }

    useEffect(() => { TempTimeLines && console.log(TempTimeLines) }, [TempTimeLines])
    useEffect(() => { data && console.log(data.details.defaultTimelineIndex) }, [data])

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <ErrorMessageComponent err={err} />
            <Title title={`${grade}-${classNumber} / ${ChangeMonthToLabel(monthIndex)}の教科を編集する`} />
            <Content>
                {!data && <LoadingWithSidebar />}
                {
                    data && new Array(data.userDatas.find((data) => data.class === +classNumber && data.grade === +grade)?.defaultTimelineIndex).fill(0).map((_, index) => (
                        <div className="py-2" key={index}>
                            <label> {index + 1}時間目の教科</label>
                            <Input
                                placeholder={`${data.userDatas.find((data) => data.class === +classNumber && data.grade === +grade)?.timelineData[monthIndex][index]?.name ?? "教科名"}`}
                                type="text"
                                onChange={
                                    (e) =>
                                        onChangeValueScadule(
                                            index + 1,
                                            {
                                                name: e.target.value,
                                                place: "初期値",
                                                IsEvent: false
                                            }
                                        )
                                }
                            />
                        </div>
                    ))
                }
                {
                }
                <Button color="primary" variant="light" onClick={() => toSaveRefactor()}> とりあえず保存する </Button>
                <Button color="primary" variant="light" onClick={() => router.push(`/dashboard/${id}/timeline/${grade}/${classNumber}`)}> やっぱやめる </Button>
                <Button color="danger" onPress={() => Open(true)}>この曜日の教科をリセットする</Button>
            </Content>
            <Modal
                isOpen={isOpen}
                onOpenChange={Open}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"> 確認 </ModalHeader>
                            <ModalBody>
                                <p>この曜日の教科をリセットしますか？この操作は取り消せません。</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => DeleteData()}>
                                    実行する
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </SidebarComopnent>
    )
}