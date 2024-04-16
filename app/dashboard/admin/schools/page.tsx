"use client";

import { AdminSidebarComopnent } from "@/components/serverAdminSidebar";
import { Title } from "@/components/title";
import { Schools } from "@/constants/schooltypes";
import { API_URL } from "@/constants/setting";
import { BaseScheme } from "@/constants/types/user";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";



export default function SchoolListDash() {

    const [ schoolList , setSchoolList ] = useState<null | BaseScheme[]>( null )

    useEffect(() => {
        GetUserLists();
    }, [])

    async function GetUserLists() {
        const response = await fetch(`${API_URL}/v1/admin/schoollist`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Admin ${localStorage.getItem('user')}`
            }
        })
        if( response.ok ){
            const data = await response.json()
            setSchoolList( data.schools )
        }
    }

    return (
        <AdminSidebarComopnent>
            <Title title="登録済み学校一覧" />
            <div className="flex items-center justify-between py-4">
                <Table>
                    <TableHeader>
                        <TableColumn>登録学校数</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{schoolList?.length}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            {
                schoolList === null ? (
                    <div> Loading... </div>
                ) : (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name / ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Typeof School
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                schoolList.map((school, index) => {
                                    if( typeof school.details !== "object" ) return;
                                    return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="w-10 h-10 rounded-full flex justify-center items-center border border-gray-300">{ school.details.name.substring(0 , 1) }</div>
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">{ school.details.name }</div>
                                                    <div className="font-normal text-gray-200">{ school.details.id }</div>
                                                </div>  
                                            </th>
                                            <td className="px-6 py-4">
                                                {Schools.find( v => v.value === +school.details.type ? school.details.type.toString() : 0 )?.typeName}
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