"use client";
import { SelectBox } from "@/components/box";
import { Content } from "@/components/content";
import { AutoModifyGrid } from "@/components/grid-cols-auto";
import { Loading } from "@/components/loading"
import { useSchool } from "@/hooks/useSchool"
import { SidebarComopnent } from "@/components/sidebarComponent"
import { Title } from "@/components/title"
import { UserDatas } from "@/constants/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function DashboardTimeLine({ params: { id, grade } }: { params: { id: string, grade: string } }) {

    const { data, user } = useSchool(id)
    const router = useRouter()

    const [GradeData, setGradeData] = useState<UserDatas[] | null>(null)

    if (typeof data !== "object") return (
        <Loading />
    )

    useEffect(() => {
        const gradeData = data?.userDatas.filter((datas) => datas.grade === +grade)
        if (!gradeData) return;
        setGradeData(gradeData)
    }, [data !== null])


    return (
        <SidebarComopnent sid={id}>
            <Title title={`${grade}学年の登録済みクラス一覧`} />
            <Content>
                <AutoModifyGrid isSidebarComponent>
                    {
                        GradeData?.map((data, index) => (
                            <SelectBox
                                key={index}
                                title={`${grade}-${data.class}`}
                                description="ここをクリックして編集"
                                onClick={() => router.push(`${grade}/${data.class}`)}
                            />
                        ))
                    }
                </AutoModifyGrid>
            </Content>
        </SidebarComopnent>
    )
}