"use client";
import { Content } from "@/components/content";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";



export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <Title title={`イベントメニュー`} />
            <Content>
                そのうち
            </Content>
        </SidebarComopnent>
    )
}