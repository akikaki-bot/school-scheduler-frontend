"use client";
import { Content } from "@/components/content";
import { Loading, LoadingWithSidebar } from "@/components/loading"
import { useSchool } from "@/hooks/useSchool"
import { SidebarComopnent } from "@/components/sidebarComponent"
import { Title } from "@/components/title"
import { API_URL } from "@/constants/setting";
import { DateChangeArray, Dates, MonthData, UserDatas } from "@/constants/types/user";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { ErrorMessageComponent } from "@/components/errorMessage";
import { Warning } from "@/components/warning";
import { GridChildren } from "@/components/mainLayout";

export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    const { data, user } = useSchool(id)
    const router = useRouter()
    const [isOpen, Open] = useState(false)

    const [monthIndex, setMonthIndex] = useState<Dates>("mon")
    const [monthIndexWeek, setMonthIndexWeek] = useState<Dates>("mon")

    const [resetState, setResetState] = useState<boolean>(false)


    const [defaultIndex, setDefaultIndex] = useState<number | null>(null)

    const [schoolData, setSchoolData] = useState<UserDatas | null>(null)

    const [err, setError] = useState<string | null>(null)
    useEffect(() => {
        setTimeout(() => setError(null), 4000)
    }, [typeof err === "string"])

    useEffect(() => {
        const gradeData = data?.userDatas.find((datas) => datas.grade === +grade && datas.class === +classNumber)
        if (!gradeData) return;
        setSchoolData(gradeData)
    }, [data])



    if (typeof data !== "object") return (
        <Loading />
    )

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

    async function setDefaultTimeIndex() {
        const response = await fetch(`${API_URL}/v1/school/${id}/patchsetting`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                data: {
                    headInfo: "userDatas",
                    gradeClass: { grade: +grade, class: +classNumber },
                    patchHeader: "defaultTimelineIndex",
                    value: defaultIndex
                }
            })
        })
        if (!response.ok) return setError(`エラーが発生しました。\nサーバーが無効な返答をしました : ${response.statusText}`);
        else router.push(`${classNumber}/${monthIndex}/defaultTimeline/edit`)
    }

    async function SetOpenChange() {
        const classData = data?.userDatas.find((data) => data.class == +classNumber && data.grade == +grade)
        if (typeof classData === "undefined") return;
        if (typeof classData.defaultTimelineIndex === "undefined") return Open(isOpen ? false : true)
        else router.push(`${classNumber}/${monthIndex}/defaultTimeline/edit`)
    }

    async function SetOpenChangeTimeline() {
        const classData = data?.userDatas.find((data) => data.class == +classNumber && data.grade == +grade)
        if (typeof classData === "undefined") return;
        if (typeof classData.defaultTimelineIndex === "undefined") return Open(isOpen ? false : true)
        else router.push(`${classNumber}/${monthIndexWeek}/timeline/edit`)
    }

    async function migrateTimeLineData() {
        setResetState(true)
        const response = await fetch(`${API_URL}/v1/school/${id}/migration`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body: JSON.stringify({
                class: +classNumber,
                grade: +grade
            })
        })
        if (!response.ok) return setError(`エラーが発生しました。\nサーバーが無効な返答をしました : ${response.statusText}`);
        else return setResetState(false);
    }

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <ErrorMessageComponent err={err} />
            <Title title={`${grade}-${classNumber}の標準時間割編集`} />
            <Content className="min-h-1/2">
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
                                    <SelectItem key={labelData} onClick={(e) => setMonthIndex(DateChangeArray[index] as Dates)}>
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
                                            new Array(+data?.details.defaultTimelineIndex).fill(0).map((_, index1) => (
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
            <Title title={`時間割マイグレーション`} />
            <Content className="h-1/2">
                <GridChildren paddingX={2} paddingY={2} IsHeightFull={false} className="gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold opacity-70">一週間の時間割を自動でリセットする</h1>
                    <hr className="py-2" />
                    <Warning className="text-xl">
                        ・自動リセットは毎週月曜日に行われます。<br />
                        ・自動リセットが実行されると、<strong>変更された教科なども標準時間割通りの設定となります。</strong><br />
                        ・<strong>まだ実装のされていない機能です。</strong>将来的に削除される可能性があります。
                    </Warning>
                    <Button color={`danger`} variant="ghost" disabled> 実装中です。もうちょっと待ってね </Button>
                </GridChildren>
                <GridChildren paddingX={2} paddingY={2} IsHeightFull={false} className="gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold opacity-70">一週間の時間割を今リセットする</h1>
                    <hr className="py-2" />
                    <Warning className="text-xl">
                        ・この操作は元に戻すことはできません。<br />
                        ・リセットが実行されると、<strong>変更された教科なども標準時間割通りの設定となります。</strong><br />
                    </Warning>
                    <Button color={`danger`} onPress={() => migrateTimeLineData()}>{resetState && <Spinner color="white" />} {resetState ? "実行中" : "リセット"} </Button>
                </GridChildren>
                <GridChildren paddingX={2} paddingY={2} IsHeightFull={false} className="gap-4 min-h-1/2">
                    <h1 className="text-xl sm:text-2xl font-bold opacity-70">設定されている一週間の時間割</h1>
                    <hr className="py-2" />
                    {!schoolData && <LoadingWithSidebar />}
                    {
                        schoolData && (
                            <Select
                                label="曜日を選んでください。"
                                className="max-w-xs py-2"
                                defaultSelectedKeys={["mon"]}
                            >
                                {
                                    Object.keys(schoolData.timelineData).map((labelData, index) => (
                                        <SelectItem key={labelData} onClick={(e) => setMonthIndexWeek(DateChangeArray[index] as Dates)}>
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
                                <th className="flex border border-slate-300 justify-end"> <Button variant="light" color="primary" onClick={() => SetOpenChangeTimeline()}> 編集する </Button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                schoolData &&
                                    schoolData.timelineData[monthIndexWeek as Dates].length !== 0 ?
                                    schoolData.timelineData[monthIndexWeek as Dates].map((data, index1) =>
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
                                                new Array(+data?.details.defaultTimelineIndex).fill(0).map((_, index1) => (
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
                </GridChildren>
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
                                <Input placeholder="何時間普段授業あるんですか...？私は７時間ですつらいね..." min={1} type="number" onChange={(e) => setDefaultIndex(+e.target.value)} />
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