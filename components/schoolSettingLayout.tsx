import { BaseScheme, User } from "@/constants/types/user";
import { SidebarComopnent } from "./sidebarComponent";
import { Schools } from "@/constants/schooltypes";
import { Title } from "./title";
import { Content } from "./content";
import { Card, CardBody, Listbox, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { API_URL } from "@/constants/setting";
import { useEffect, useState } from "react";
import { consola , createConsola } from "consola";


export function SchoolSettingLayout({ data }: { data: BaseScheme | null }) {

    const [ Owneruser , setOwner ] = useState<User | null>( null )
    const [ IsRan , setRun ] = useState( false )

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

    return (
        <SidebarComopnent sid={data.schoolId}>
            <Title title={`${data.details.name}${Schools.find(v => v.value === +data.details.type.toString())?.typeName}のメインページ`} />
            <Content>
                ダッシュボードへようこそ！<br />
            </Content>
            <Title title={`${data.details.name}${Schools.find(v => v.value === +data.details.type.toString())?.typeName}の詳細`} />
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
                                    <TableCell>{Schools.find(v => v.value === +data.details.type.toString())?.typeName}</TableCell>
                                    <TableCell>{ Owneruser?.username ?? "解決中.." }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </Content>
        </SidebarComopnent>
    )
}