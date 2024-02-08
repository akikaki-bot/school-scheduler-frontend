import { BaseScheme, User } from "@/constants/types/user";
import { SidebarComopnent } from "./sidebarComponent";
import { Schools } from "@/constants/schooltypes";
import { Title } from "./title";
import { Content } from "./content";
import { Button, Card, CardBody, Listbox, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { API_URL } from "@/constants/setting";
import { useEffect, useState } from "react";
import { consola , createConsola } from "consola";
import { useRouter } from "next/navigation";


export function SchoolSettingLayout({ data }: { data: BaseScheme | null }) {

    const [ Owneruser , setOwner ] = useState<User | null>( null )
    const [ IsRan , setRun ] = useState( false )
    const router = useRouter()

    useEffect(() => {
        (async () => {
            setRun( true )
            await ResolveId( data?.details.ownerId ?? null )
            consola.info('Resolving owner id')
        })()
    }, [ data ])

    if (data === null) return (<></>)

    async function ResolveId( id : number | null ){
        if( id === null ) return;

        const token = sessionStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            credentials: "same-origin"
        });
        if(!response.ok) return;

        const user = await response.json()
        setOwner(user.body.data)
    }

    async function DeleteSchool() {
        const response = await fetch(`${API_URL}/v1/school/${data?.schoolId}`, {
            method : "DELETE",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });
        if(!response.ok) return;
        else router.push("/dashboard")
    }
    return (
        <SidebarComopnent sid={data.schoolId}>
            <Title title={`${data.details.name}${Schools.find(v => v.value === data.details.type ? +data.details.type.toString() : 0)?.typeName}のメインページ`} />
            <Content>
                ダッシュボードへようこそ！<br />
            </Content>
            <Title title={`${data.details.name}${Schools.find(v => v.value === data.details.type ? +data.details.type.toString() : 0)?.typeName}の詳細`} />
            <Content className="sm:w-3/4 lg:w-2/4">
                <Card>
                    <CardBody>
                        <Table aria-label="学校詳細に関しての表">
                            <TableHeader>
                                <TableColumn>学校名</TableColumn>
                                <TableColumn>学校の種類</TableColumn>
                                <TableColumn>オーナーユーザー</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ data.details.name }</TableCell>
                                    <TableCell>{Schools.find(v => v.value === data.details.type ? +data.details.type.toString() : 0)?.typeName}</TableCell>
                                    <TableCell>{ Owneruser?.username ?? "解決中.." }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </Content>
            <Title title="（仮）学校消す" />
            <Content>
                <Button color="danger" onClick={() => DeleteSchool()}> あぼーん </Button>
            </Content>
        </SidebarComopnent>
    )
}