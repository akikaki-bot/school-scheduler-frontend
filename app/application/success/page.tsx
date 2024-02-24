import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { Content } from "@/components/content";



 
export default function AuthorizationDisplay() {
    return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                <Title title="終了 : 正常に追加" IsCenter/>
                <Content className="grid col-span-12 justify-center gap-4">
                    <p className="text-xl"> このウインドウは閉じていただいて構いません。 </p>
                </Content>
            </GridChildren>
        </GridMainLayout>
    )
}