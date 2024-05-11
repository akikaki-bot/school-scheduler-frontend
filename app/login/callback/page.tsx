"use client";
import { API_URL } from "@/constants/setting";
import { Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




export default function CallbackLoginPage() {
    const session = useSession();
    const router = useRouter();

    const [ isOpen , setIsOpen ] = useState(false);
    const [ error , setError ] = useState<{ code : string , message : string } | null>(null);

    if(
        session.status !== "loading" &&
        session.status !== "authenticated"
    ) return router.push('/login');

    useEffect(() => {
        LoginToHSS();
    }, [ session.status === "authenticated" ])

    async function LoginToHSS() {
        if( session.status === "unauthenticated" ) return router.push('/login');
        if( session.status === "loading" ) return;
        //@ts-ignore
        const token = session.data.id_token as string;

        const res = await fetch(`${API_URL}/v1/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ at : token }),
        });

        const data = await res.json();
        if( res.status !== 200 ) {
           
            setError({
                code: data.code,
                message: data.message
            })
            setIsOpen(true);
        }
        else {
            router.push('/register/s?t='+ data.userAccessToken );
        }
    }

    return (
        <div className="p-4 flex flex-col justify-center items-center">
            <h1> <Spinner /> Logging... </h1>
            <Modal
                isOpen={ isOpen }
                onClose={
                    () => router.push('/')
                }
            >
                <ModalContent>
                    <>
                        <ModalHeader className="text-2xl"> ログインに失敗しました。{error?.code} </ModalHeader>
                        <ModalBody className="flex flex-col">
                            <p> {error?.message} </p>
                            <p> このモーダルを閉じると、自動的にホームに戻ります。 </p>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
        </div>
    )
}