"use client"
import { Content } from "@/components/content";
import { useSchool } from "@/components/schoolComponent";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";




export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    const { data, user } = useSchool(id)

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <Title title={`設定`} />
            <Content>
                デフォルトの時間割数・その他もろもろの設定が出来ます。
            </Content>
            <Title title={`デフォルトの時間割数`} />
            <Content>
                あんば
            </Content>
        </SidebarComopnent>
    )
}