"use client";
import { Content } from "@/components/content";
import { Infomation } from "@/components/infomation";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";



export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {
    const router = useRouter();
    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <Title title={`イベントメニュー`} />
            <Content>
                そのうち
                <Infomation className="text-xl">
                    <h1 className="text-2xl font-semibold"> API側では実装が完了しています。 </h1>
                    <p className="pb-2"> 詳しくはこちらのドキュメンテーションをご確認ください。</p>
                    <Button color="primary" onPress={() => router.push('https://hss-dev-docs.aknet.tech/docs/school/newPatch')}> ドキュメンテーションを見る </Button>
                </Infomation>
            </Content>
        </SidebarComopnent>
    )
}