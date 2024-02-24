"use client";
import { CanCopyBlock } from "@/components/canCopyBlock";
import { Content } from "@/components/content";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { AutoModifyGrid } from "@/components/grid-cols-auto";
import { Loading } from "@/components/loading";
import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { BotUser } from "@/constants/types/user";
import { useUser } from "@/hooks/useUser";
import { Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { on } from "events";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";






export default function User() {
    const user = useUser();
    const router = useRouter()

    const [displayAccessToken, setDisplayState] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    const [ isOpen , Open ] = useState(false)
    const [ isTokenMenuOpen , OpenTokenMenu ] = useState(false)

    const [ isDeleteMenuOpen , OpenDeleteMenu ] = useState(false)

    
    // TEMPOLARY STATE
    const [ applicationName , setApplicationName ] = useState<string | null>(null)
    const [ description , setDescription ] = useState<string | null>(null)
    // END TEMPOLARY STATE

    const [ deleteApplicationId , setDeleteApplicationId ] = useState<string | null>(null)

    const [ applicationTokens , setApplicationTokens ] = useState<{ botId : string , token : string }[] | null>(null)

    const [ tmpToken , setTmpToken ] = useState<string | null>(null)

    const [applications, setApplications] = useState<(BotUser | null)[] | null>( null )

    if (user === null) return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                <Loading />
            </GridChildren>
        </GridMainLayout>
    )

    //if( !globalThis.sessionStorage instanceof globalThis.Storage) return alert('GlobalなSessionStorageが使用できません。')

    useEffect(() => {
        if (sessionStorage.getItem('user') === null) return router.push("/dashboard")
        getApplications();

        const interval = setInterval(() => {
            getApplications();
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    function copyToken() {
        navigator.clipboard.writeText(sessionStorage.getItem('user') ?? "").then(
            () => {

            },
            (err) => {
                setErr('コピーに失敗しました。\n 理由 : ' + err)
                setTimeout(() => {
                    setErr(null)
                }, 3000)
            }
        )
    }

    async function deleteApplication() {
        if( deleteApplicationId === null ) return;
        const response = await fetch(`${API_URL}/v1/application`, {
            method : "DELETE",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                botId : deleteApplicationId
            })
        });

        OpenDeleteMenu( false );

        if(!response.ok) return;

        if(applications !== null) {
            const deleted = applications.filter( ( val ) => val?.hid !== Number(deleteApplicationId) )
            setApplications(deleted)
        }


    }

    async function postApplications (){
        if( applicationName === null || description === null ) return;
        const response = await fetch(`${API_URL}/v1/application`, {
            method : "POST",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                name : applicationName,
                description : description
            })
        });
        if(!response.ok) {
            const errorResponse = await response.json() as { message : string }
            setErr(errorResponse.message)
            return;
        }
        const data = await response.json() as { applicationAccessToken : string , botId : string}
        setTmpToken(data.applicationAccessToken)
        OpenTokenMenu(true)
        if( applicationTokens === null ) setApplicationTokens([{ botId : data.botId , token : data.applicationAccessToken }])
        else setApplicationTokens([...applicationTokens, { botId : data.botId , token : data.applicationAccessToken }])
    }

    async function getApplications () {
        const response = await fetch(`${API_URL}/v1/application`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });

        if(!response.ok) return;
        const responseJSON = await response.json() as { body : { applications : string[] } };
        const applications = await Promise.all(
            responseJSON.body.applications.map( async (id) => 
                resolveApplication(id)
            )
        )
        setApplications(applications)
        
    }

    useEffect(() => {
        console.log( applicationTokens )
    }, [applicationTokens])

    async function regenerateToken ( id : string ) {
        const response = await fetch(`${API_URL}/v1/application`, {
            method : "PATCH",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                botId : id
            })
        });

        if(!response.ok) return;
        const data = await response.json() as { reCreatedApplicationAccessToken : string };

        const isAdded = applicationTokens !== null && applicationTokens.find( ( val ) => val.botId === id )
        if( isAdded ) {
            const deleteApplication = applicationTokens.filter( ( val ) => val.botId !== id )
            setApplicationTokens([...deleteApplication, { botId : id , token : data.reCreatedApplicationAccessToken }])
        } else {
            if( applicationTokens === null ) setApplicationTokens([{ botId : id , token : data.reCreatedApplicationAccessToken }])
            else setApplicationTokens([...applicationTokens, { botId : id , token : data.reCreatedApplicationAccessToken }])
        }
        return data.reCreatedApplicationAccessToken

    }

    async function resolveApplication ( id : string ) {
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${sessionStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });

        if(!response.ok) return null;
        const responseJSON = await response.json() as { body : { data : BotUser } };
        return responseJSON.body.data
    }

    return (
        <GridMainLayout>
            <GridChildren paddingX={12} paddingY={12} IsHeightFull>
                <ErrorMessageComponent err={err} />
                <Title title={`ログイン中のユーザー`} />
                <Content>
                    <Card className="sm:w-1/2">
                        <CardBody>
                            <p className="text-2xl">{user.data?.username} </p>
                            <p> <CanCopyBlock value={user.data?.hid ?? 0} /> / {user.data?.discordAccount && "Discordアカウント連携✅"}</p>
                        </CardBody>
                    </Card>
                </Content>
                <Title title={`アクセストークン (高度な設定)`} />
                <Content>
                    <code> {displayAccessToken ? sessionStorage.getItem('user') : "SuP3r_S3CretAcCe2ST0k3n"} </code>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-1/2">
                        <Button color="warning" onPress={() => setDisplayState(displayAccessToken ? false : true)}>アクセストークンを{displayAccessToken ? "隠す" : "表示する"}</Button>
                        {displayAccessToken && <Button color="primary" onPress={() => copyToken()}>コピーする</Button>}
                    </div>
                </Content>
                <Title title={`APIアプリケーション`} />
                <Content>
                    <Title title={`作成済みのアプリケーション`} />
                    <AutoModifyGrid>
                    {
                        applications === null ? (<Loading /> ) :
                        applications.map( ( app , index ) => (
                            <Card key={index}>
                                <CardBody>
                                    <p className="text-2xl">{app?.username ?? "不明なアプリケーション"} ({app?.hid})</p>
                                    <p>{app?.description}</p>
                                    <CanCopyBlock value={applicationTokens?.find( ( val ) => val.botId === String(app?.hid ?? 0))?.token ?? "再生成してくださいな。"} /> 
                                    <div className="flex flex-col gap-3 py-2 justify-between">
                                        <Button color="primary" onClick={() => regenerateToken(String(app?.hid ?? 0))}> トークンを再生成する</Button>
                                        <Button color="danger" onClick={() => { setDeleteApplicationId(String(app?.hid ?? 0)); OpenDeleteMenu(true)}}> 削除する </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    }
                    </AutoModifyGrid>
                    <Button className="py-2" color="success" onClick={() => Open( true )}> 新しく作成する </Button>
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={Open}
                        placement="center"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1"> アプリケーションの追加 </ModalHeader>
                                    <ModalBody>
                                        <label> アプリケーションの名前 </label>
                                        <Input placeholder="すごいアプリケーション" min={30} type="text" onChange={(e) => setApplicationName(e.target.value)} required/>
                                        <label> 説明 </label>
                                        <Input placeholder="すごいです。" min={100} type="text" onChange={(e) => setDescription(e.target.value)} required/>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" variant="light" onClick={() =>  { postApplications(); Open(false) } }>
                                            作成する
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal
                        isOpen={isTokenMenuOpen}
                        onOpenChange={OpenTokenMenu}
                        placement="center"
                    >
                        <ModalContent>
                            {
                                (onClose) => (
                                    <>
                                        <ModalHeader> アプリケーションのトークン </ModalHeader>
                                        <ModalBody>
                                            <CanCopyBlock value={tmpToken ?? "null"} />
                                        </ModalBody>
                                    </>
                                )
                            }
                        </ModalContent>
                    </Modal>
                    <Modal
                        isOpen={isDeleteMenuOpen}
                        onOpenChange={OpenDeleteMenu}
                        placement="center"
                    >
                        <ModalContent>
                            {
                                (onClose) => (
                                    <>
                                        <ModalHeader> アプリケーションの削除 </ModalHeader>
                                        <ModalBody>
                                            <p> 本当に削除しますか？ </p>
                                            <p> この操作は取り消せません。</p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" onClick={() => deleteApplication()}> 削除 </Button>
                                        </ModalFooter>
                                    </>
                                )
                            }
                        </ModalContent>
                    </Modal>
                </Content>
            </GridChildren>
        </GridMainLayout>
    )
}   