"use client";
import { PopupBatch } from "@/components/popupBatch";
import { AdminSidebarComopnent } from "@/components/serverAdminSidebar";
import { Title } from "@/components/title";
import { Warning } from "@/components/warning";
import { API_URL } from "@/constants/setting";
import { User } from "@/constants/types/user";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function DashboardAdminPage() {

    const [ userList , setUserList ] = useState<null | User[]>( null )

    const [ warning , setWarning ] = useState<boolean>( false )

    const [ showEmail , setShowEmail ] = useState<boolean>( false )

    const [ filter , setFilter ] = useState<"all" | "user" | "bot">("all");

    useEffect(() => {

        if( !checkUserAgent() ){
            setWarning( true )
        }

        GetUserLists();
    }, [])

    function checkUserAgent(){
        const userAgent = navigator.userAgent;
        if(
            userAgent.indexOf("iPad") > -1 ||
            userAgent.indexOf("Android") > -1 && userAgent.indexOf("Mobile") === -1 
        ) return true;
        if( userAgent.indexOf("Mobile") === -1 ) return true;
        if( userAgent.indexOf("Surface") > -1 ) return true;
        return false;
    }



    async function GetUserLists() {
        const response = await fetch(`${API_URL}/v1/admin/userlist`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Admin ${localStorage.getItem('user')}`
            }
        })
        if( response.ok ){
            const data = await response.json()
            setUserList( data.users )
        }
    }

    return (
        <AdminSidebarComopnent>
            <Title title="登録済ユーザー一覧" />
            {warning && (
                <Warning className="text-xl">
                    このページはモバイルデバイスからの閲覧でレイアウトが崩れる可能性があります。
                </Warning>
            )}
            <div className="flex items-center justify-between py-4">
                <Table>
                    <TableHeader>
                        <TableColumn>登録ユーザー数</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{userList?.length}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 py-2">
                <Button color="primary" onClick={() => setFilter("user")}> User </Button>
                <Button color="secondary" onClick={() => setFilter("bot")}> Bot </Button>
                <Button color="danger" onClick={() => setFilter("all")}> Reset </Button>
                <Button color="warning" onClick={() => setShowEmail( showEmail ? false : true )}> メールアドレスの表示切替 </Button>
            </div>
            {
                userList === null ? (
                    <div> Loading... </div>
                ) : (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Permission
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Account Linking
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userList.map((user, index) => {
                                    if( user === null ) return;
                                    if( filter === "user" && user.isBot ) return;
                                    if( filter === "bot" && !user.isBot ) return;
                                    if( user.hid === null ) return;
                                    return (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{ user?.username ?? "null" }</div>
                                                <div className="text-xs font-normal text-gray-500 dark:text-gray-400">{ user?.hid ?? "null" }</div>
                                                {showEmail && ( <div className="font-normal text-gray-200">{ user.email }</div> )}
                                            </div>  
                                        </th>
                                        <td className="px-6 py-4">
                                            {user?.isBot ? "🤖 Bot" : user.serverAdmin ? "👑 Admin" : "👤 User"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                { user.discordAccount && <PopupBatch title="Discordアカウントとリンク済み" emoji="🐽" description="リンク済み。" />}
                                                { user.googleAccount && <PopupBatch title="Googleアカウントとリンク済み" emoji="🐉" description="リンク済み。" />}
                                            </div>
                                        </td>
                                    </tr>
                                )})
                            }
                        </tbody>
                    </table>
                )
            }
        </AdminSidebarComopnent>
    )
}