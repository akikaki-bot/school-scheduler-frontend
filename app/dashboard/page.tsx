"use client";
import { About } from '@/components/about';
import { LetsStart } from '@/components/letsget';
import { Loading } from '@/components/loading';
import { UserComponent } from '@/components/usercomponent';
import { API_URL } from '@/constants/setting';
import { User } from '@/constants/types/user';
import { auth } from '@/lib/auth';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'



export default function Dashboard() {

    

    const [loginform, changeLoginForm] = useState(false)

    const [err, setErr] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)


    const router = useRouter()

    useEffect(() => {
        const session = localStorage
        const logined = session.getItem('user')
        if (typeof logined === "undefined" || logined === null) return changeLoginForm(true)
        InitUser({ t: logined })
    }, [])

    useEffect(() => {
        if (typeof err === "string") setTimeout(() => setErr(null), 3000)
    }, [(typeof err === "string")])

    async function InitUser(u: { t: string }) {
        /** token */
        const t = u.t
        const response = await fetch(`${API_URL}/v1/users/@me`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${t}`
            },
            credentials: "same-origin",
        })
        if (!response.ok) {
            setErr(`${response.statusText} - 再度ログインしてください。`);
            localStorage.removeItem('user');
            changeLoginForm(true);
            return;
        }
        const data = await response.json() as { body: { data: User } }
        setUser(data.body.data)
    }


    return (
        <main className="flex min-h-screen flex-col p-12 sm:p-24">
            <div className="absolute top-20 right-2">
                {
                    typeof err === "string" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative z-20" role="alert">
                            <strong className="font-bold"> {err} </strong>
                        </div>
                    )
                }
            </div>
            <Modal
                size="lg"
                isOpen={loginform}
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-2xl">HSS Dev.にログイン</ModalHeader>
                        <ModalBody>
                            <Button color="primary" onPress={() => router.push('/login')}> ログインページに飛ぶ </Button>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
            {
                (
                    user !== null
                ) ?
                    (
                        <UserComponent user={user} />
                    ) : <Loading />
            }
        </main>
    )
}
