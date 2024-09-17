import { BaseScheme, User } from "@/constants/types/user";
import { SidebarComopnent } from "./sidebarComponent";
import { Schools } from "@/constants/schooltypes";
import { Title } from "./title";
import { Content } from "./content";
import { Button, Card, CardBody, Listbox, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { API_URL } from "@/constants/setting";
import { useEffect, useState } from "react";
import { consola, createConsola } from "consola";
import { useRouter } from "next/navigation";
import { SelectBox } from "./box";


export function SchoolSettingLayout({ data }: { data: BaseScheme | null }) {

    const [Owneruser, setOwner] = useState<User | null>(null)
    const [IsRan, setRun] = useState(false)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setRun(true)
            await ResolveId(data?.details.ownerId ?? null)
            consola.info('Resolving owner id')
        })()
    }, [data])

    if (data === null) return (<></>)

    async function ResolveId(id: string | number | null) {
        if (id === null) return;

        const token = localStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "same-origin"
        });
        if (!response.ok) return;

        const user = await response.json()
        setOwner(user.body.data)
    }


    return (
        <SidebarComopnent sid={data.schoolId}>
            <Title title={`${data.details.name}のメインページ`} />
            <Content>
                HSSAPI - 学校ダッシュボードへようこそ。<br />
            </Content>
            <Title title={`${data.details.name}の登録情報`} />
            <Content className="sm:w-3/4 lg:w-2/4">
                <Table aria-label="学校詳細に関しての表">
                    <TableHeader>
                        <TableColumn>学校名</TableColumn>
                        <TableColumn>学校の種類</TableColumn>
                        <TableColumn>オーナーユーザー</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{data.details.name}</TableCell>
                            <TableCell>{Schools.find(v => v.value === (data.details.type ? parseInt(data.details.type.toString()) : 0))?.typeName}</TableCell>
                            <TableCell>{Owneruser?.username ?? "解決中.."}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Content>
            <Title title="次はどこへ行く？" />
            <Content>
                クラスを追加するか、一緒に管理する人を追加しましょう。
                <div className="flex flex-col lg:flex-row gap-4 mt-4 items-center lg:items-start">
                    <SelectBox
                        title="クラスを追加してみる"
                        description="クラスを追加して、時間割を管理しましょう。"
                        onClick={() => router.push(`/dashboard/${data.schoolId}/timeline?ref=schooldetail`)}
                    />
                    <SelectBox
                        title="管理者を増やす"
                        description="一緒に管理する人がいれば、効率アップ。"
                        onClick={() => router.push(`/dashboard/${data.schoolId}/settings?ref=schooldetail`)}
                    />
                </div>
            </Content>
        </SidebarComopnent>
    )
}