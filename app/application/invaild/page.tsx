import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { Content } from "@/components/content";




export default function AuthorizationDisplay() {
    return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                <Title title="不明なアプリケーション" IsCenter/>
                <Content className="grid col-span-12 justify-center gap-4">
                    <p className="text-xl"> 不明なアプリケーションです。 </p>
                </Content>
            </GridChildren>
        </GridMainLayout>
    )
}