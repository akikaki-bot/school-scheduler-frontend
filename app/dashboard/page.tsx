"use client";
import { About } from '@/components/about';
import { ParticlesBackGround } from '@/components/background-particles';
import { LetsStart } from '@/components/letsget';
import { Loading } from '@/components/loading';
import { UserComponent } from '@/components/usercomponent';
import { API_URL } from '@/constants/setting';
import { User } from '@/constants/types/user';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from '@nextui-org/react';
import { createCipheriv, randomBytes } from 'crypto';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'



export default function Dashboard() {

    const [loginform, changeLoginForm] = useState(false)
    
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [pwd, setpwd] = useState<string | undefined>(undefined)
    const [err, setErr] = useState<string | null>(null)
    const [ user , setUser ] = useState<User | null>(null)


    const router = useRouter()

    useEffect(() => {
        const session = sessionStorage
        const logined = session.getItem('user')
        if (typeof logined === "undefined" || logined === null) return changeLoginForm(true)
        InitUser({ t : logined })
    }, [])

    useEffect(() => {
        if (typeof err === "string") setTimeout(() => setErr(null), 3000)
    }, [(typeof err === "string")])

    async function login() {
        if (
            typeof email === "undefined" ||
            typeof pwd === "undefined" ||
            email === "" ||
            pwd === ""
        ) return setErr("メールアドレス、パスワードに誤りがあります。")

        const response_hash = await fetch(`/api/v1/hash`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify({
                text : pwd
            })
        })

        const { hash : hashpwd, iv : iv } = await response_hash.json() as { hash : string, iv : string }

        const response = await fetch(`${API_URL}/v1/login`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify({
                email : email,
                pwd : hashpwd,
                iv : iv
            })
        })

        if(!response.ok) return setErr(`${response.statusText} - 通信に失敗`)
        const data = await response.json()
        const session = sessionStorage
        session.setItem('user', data.body.token)
        
        changeLoginForm(false)
        await InitUser({ t : data.body.token })
    }

    async function InitUser( u : { t : string }) {
        /** token */
        const t = u.t
        const response = await fetch(`${API_URL}/v1/user`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify({
                token : `Bearer ${t}`
            })
        })
        if(!response.ok) return setErr(`${response.statusText} - 通信に失敗`)
        const data = await response.json() as { body : User }
        setUser(data.body)
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
                            <Input onChange={(v) => setEmail(v.target.value)} type="email" placeholder="Email" label={<p className="font-bold">メールアドレス</p>} />
                            <Input onChange={(v) => setpwd(v.target.value)} type="password" placeholder="Password" label={<p className="font-bold">パスワード</p>}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onPress={() => login()}>
                                Login
                            </Button>
                        </ModalFooter>
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
