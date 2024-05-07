"use client";
import { Content } from "@/components/content";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Log } from "@/constants/types/logs";
import { useSchool } from "@/hooks/useSchool";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";







export default function DashboardTimeLine({ params: { id } }: { params: { id: string } }) {

    const { data } = useSchool(id)
    const { data: loginUser } = useUser()
    const router = useRouter();

    const [ Logs , setLogs ] = useState<null | Log[]>(null)

    useEffect(() => {
        getLogs();

        const interval = setInterval(async () => {
            await getLogs()
        }, 1000 * 2)

        return () => {
            clearInterval( interval );
        }
    }, [])

    async function getLogs() {
        const response = await fetch(`${API_URL}/v1/logs/${id}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('user')}`
            }
        })
        if( response.ok ){
            const data = await response.json()
            const logs = data.body.logs as Log[]
            setLogs( logs.reverse() )
        }
    }

    return (
        <SidebarComopnent sid={id}>
            <Title title={`ログ`} />
            <Content>
                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                    { typeof Logs === "object" && Logs?.map((log, index) => (
                        <li key={index} className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{new Date(log.time).toLocaleDateString()} {new Date(log.time).toLocaleTimeString()}</time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{log.infomations.action}</h3>
                            <p className="text-base font-normal text-gray-500 dark:text-gray-400">実行者：{log.isBot ? "[🤖]" : "[👤]"}{log.username} / {log.infomations.reason}</p>
                        </li>
                        
                    ))}
                </ol>
            </Content>
        </SidebarComopnent>
    )
}