"use client";
import { CanCopyBlock } from "@/components/canCopyBlock";
import { Content } from "@/components/content";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { Loading } from "@/components/loading";
import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { useUser } from "@/hooks/useUser";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";






export default function User() {
    const user = useUser();
    const router = useRouter()

    const [displayAccessToken, setDisplayState] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    if (user === null) return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                <Loading />
            </GridChildren>
        </GridMainLayout>
    )

    //if( !globalThis.sessionStorage instanceof globalThis.Storage) return alert('GlobalなSessionStorageが使用できません。')

    useEffect(() => {
        if (sessionStorage.getItem('user') === null) return router.push("/dashboard")
    }, [])

    function copyToken() {
        navigator.clipboard.writeText(sessionStorage.getItem('user') ?? "").then(
            () => {

            },
            (err) => {
                setErr('コピーに失敗しました。\n 理由 : ' + err)
                setTimeout(() => {
                    setErr(null)
                }, 3000)
            }
        )
    }

    return (
        <GridMainLayout>
            <GridChildren paddingX={12} paddingY={12} IsHeightFull>
                <ErrorMessageComponent err={err} />
                <Title title={`ログイン中のユーザー`} />
                <Content>
                    <Card className="sm:w-1/2">
                        <CardBody>
                            <p className="text-2xl">{user.data?.username} </p>
                            <p> <CanCopyBlock value={user.data?.hid ?? 0} /> / {user.data?.discordAccount && "Discordアカウント連携✅"}</p>
                        </CardBody>
                    </Card>
                </Content>
                <Title title={`アクセストークン (高度な設定)`} />
                <Content>
                    <code> {displayAccessToken ? sessionStorage.getItem('user') : "SuP3r_S3CretAcCe2ST0k3n"} </code>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-1/2">
                        <Button color="warning" onPress={() => setDisplayState(displayAccessToken ? false : true)}>アクセストークンを{displayAccessToken ? "隠す" : "表示する"}</Button>
                        {displayAccessToken && <Button color="primary" onPress={() => copyToken()}>コピーする</Button>}
                    </div>
                </Content>
            </GridChildren>
        </GridMainLayout>
    )
}   