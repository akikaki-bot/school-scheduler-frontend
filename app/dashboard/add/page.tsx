"use client";

import { Schools } from "@/constants/schooltypes";
import { API_URL } from "@/constants/setting";
import { BaseScheme, User } from "@/constants/types/user";
import { Button, Card, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createCipheriv } from "crypto";


export default function DashboardAdd() {

    const router = useRouter();
    const [user , setUser] = useState<User | null>(null)

    const [school, setSchool] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    

    useEffect(() => {
        const session = sessionStorage
        const logined = session.getItem('user')
        if (typeof logined === "undefined" || logined === null) return router.push("/dashboard")
        InitUser({ t : logined })
    }, [])

    function RandomId() : number {
        return Math.round(Math.random() * 10000)
    }

    async function InitUser( u : { t : string }) {
        /** token */
        const t = u.t
        const response = await fetch(`${API_URL}/v1/users/@me`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${t}`
            },
            credentials: "same-origin"
        })
        if(!response.ok) return ;
        const data = await response.json() as { body : User }
        setUser(data.body)
    }

    async function Register() {
        if( type === null || school === null ) return console.error(`[Worker] Failed to register school: Invalid data`);
        const Id = 1;
        const response = await fetch(`${API_URL}/v1/school`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                data : {
                    schoolId : Id,
                    details : {
                        type : type,
                        ownerId : user?.hid,
                        name : school,
                        id : Id
                    }
                }
            })
        });

        if(!response.ok) return console.error(`[Worker] Failed to register school: ${response.statusText}`);
        if(response.ok) {
            const json = await response.json() as { body : { message : string , data : BaseScheme } } ;
            return router.push(`/dashboard/${json.body.data.schoolId}/`)
        }
    }

    return (
        <main className="flex min-h-screen flex-col p-12 sm:p-24 justify-center items-center">
            <h1 className="text-5xl font-semibold"> モーダルウィンドウが開きます。 </h1>
            <Modal
                size="lg"
                isOpen={true}
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-2xl">学校を新規で登録する</ModalHeader>
                        <ModalBody>
                            <Input type="text" placeholder="なんとか高等学校" label={<p className="font-bold">学校名</p>} onChange={( e ) => setSchool( e.target.value )} />
                            <Select placeholder="普通高校" label={<p className="font-bold">学校のタイプ</p>} onChange={(e) => setType( e.target.value )}>
                                {
                                    Schools.map(( data , index ) => (
                                        <SelectItem key={index} value={data.value}>
                                            { data.typeName }
                                        </SelectItem>
                                    ))
                                }
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={() => Register()}>
                                登録する
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </main>
    )
}