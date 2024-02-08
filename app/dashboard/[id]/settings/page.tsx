"use client";
import { CanCopyBlock } from "@/components/canCopyBlock";
import { Content } from "@/components/content";
import { LoadingWithSidebar } from "@/components/loading";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { UserBox } from "@/components/userbox";
import { API_URL } from "@/constants/setting";
import { User } from "@/constants/types/user";
import { useSchool } from "@/hooks/useSchool";
import { useUser } from "@/hooks/useUser";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";



export default function DashboardTimeLine({ params: { id } }: { params: { id: string } }) {

    const { data } = useSchool(id)
    const { data: loginUser } = useUser()
    const [admins, setAdmins] = useState<(null | User)[] | null>(null)
    const [owner, setOwner] = useState<User | null>(null)
    const [inviteCode, setInviteCode] = useState<string | null>(null)
    const [ deleteId , setDeleteId ] = useState<string|null>( null )

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen : _deleteIsOpen, onOpen : _deleteonOpen, onOpenChange : _deleteonOpenChange } = useDisclosure();


    useEffect(() => {
        if (data == null) return;
        (async () => {
            const users = await Promise.all(data.details.admins.map(async (id) => await ResolveId(id)))
            setAdmins(users)
            setOwner(await ResolveId(data.details.ownerId))
            loginUser?.hid === data.details.ownerId && await generateInviteCode()
        })()

    }, [data !== null])

    if (data === null) return (
        <SidebarComopnent sid={id}>
            <LoadingWithSidebar />
        </SidebarComopnent>
    )

    async function ResolveId(id: number | null) {
        if (id === null) return null
        const token = sessionStorage.getItem('user');
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "same-origin"
        });
        if (!response.ok) return null;

        const user = await response.json() as { body: { data: User } }
        return user.body.data
    }

    async function generateInviteCode() {
        const response = await fetch(`${API_URL}/v1/school/${id}/invite`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });
        if (!response.ok) return null;
        const data = await response.json();
        setInviteCode(data.body.code)
    }

    async function regenerateInviteCode(){
        const response = await fetch(`${API_URL}/v1/school/${id}/invite`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });
        if (!response.ok) return null;
        const data = await response.json();
        setInviteCode(data.body.code)
    }

    async function inviteDelete( hid : string ) {
        const response = await fetch(`${API_URL}/v1/school/${id}/admins`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                userId : hid
            })
        });
        if (!response.ok) return null;
        else {
            const removed = admins?.filter( ( user ) => String(user?.hid ?? "0") !== hid )
            if( !Array.isArray( removed )) return;
            setAdmins( removed )
        }
    }

    return (
        <SidebarComopnent sid={id}>
            <Title title={`コラボレーション設定`} />
            <Content>
                <p className="text-xl text-gray-800">
                    共同編集者・管理者の追加・もしくは削除ができます。
                </p>
                <div>
                    {
                        admins?.map((user, index) => (
                            <UserBox key={index} user={user} IsOwner={user?.hid == owner?.hid} onPress={() => { setDeleteId( String(user?.hid) ); _deleteonOpen();}} />
                        ))
                    }
                    {loginUser?.hid == owner?.hid && <Button color="primary" onPress={() => onOpen()}> <LinkIcon /> 新しく共同管理者を招待する </Button>}
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 text-2xl"> 共同管理者招待 </ModalHeader>
                                    <ModalBody>
                                        <p>
                                            <strong className="text-xl">⚠️注意</strong><br />
                                            このリンクを共同管理者となるユーザーに共有してください。<br />
                                            <strong>このリンクを知っているユーザーは誰でも参加することができますので</strong>、取り扱いに注意してください。
                                        </p>
                                        <p>
                                            <strong className="text-xl">招待リンク</strong><br />
                                            <CanCopyBlock value={`${location.protocol}//${location.hostname}:${location.port}/invite/${inviteCode}`} />
                                        </p>
                                        <p>
                                            <strong className="text-xl">招待リンク再発行</strong><br />
                                            現在の招待リンクを無効化し、新しく生成します。
                                            <Button color="warning" onPress={() => regenerateInviteCode()}> 再生成する </Button>
                                        </p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            閉じる
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={_deleteIsOpen} onOpenChange={_deleteonOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 text-2xl"> 管理者を削除 </ModalHeader>
                                    <ModalBody>
                                        { admins?.find( ( user ) => String(user?.hid ?? "0") === deleteId)?.username }を管理者から除外しますか？
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={() => { onClose(); inviteDelete( deleteId ?? "0" )}}>
                                            消す
                                        </Button>
                                        <Button color="primary" variant="light" onPress={onClose}>
                                            やめる
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </Content>
        </SidebarComopnent>
    )
}

function LinkIcon() {
    return (
        <svg className="w-6 h-6 text-gray-50 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.2 9.8a3.4 3.4 0 0 0-4.8 0L5 13.2A3.4 3.4 0 0 0 9.8 18l.3-.3m-.3-4.5a3.4 3.4 0 0 0 4.8 0L18 9.8A3.4 3.4 0 0 0 13.2 5l-1 1" />
        </svg>
    )
}