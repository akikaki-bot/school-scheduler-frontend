"use client";
import { CanCopyBlock } from "@/components/canCopyBlock";
import { Content } from "@/components/content";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { AutoModifyGrid } from "@/components/grid-cols-auto";
import { Infomation } from "@/components/infomation";
import { Loading } from "@/components/loading";
import { GridChildren, GridMainLayout } from "@/components/mainLayout";
import { PopupBatch } from "@/components/popupBatch";
import { Title } from "@/components/title";
import { Warning } from "@/components/warning";
import { VerifyStaffs } from "@/constants/serverAdminList";
import { API_URL } from "@/constants/setting";
import { BotUser } from "@/constants/types/user";
import { useUser } from "@/hooks/useUser";
import { Button, Card, CardBody, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { on } from "events";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";






export default function User() {
    const user = useUser();
    const router = useRouter()

    const [displayAccessToken, setDisplayState] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    const [ isOpen , Open ] = useState(false)
    const [ isTokenMenuOpen , OpenTokenMenu ] = useState(false)

    const [ isDeleteMenuOpen , OpenDeleteMenu ] = useState(false)
    const [ isRegenerateMenuOpen , OpenRegenerateMenu ] = useState(false)

    
    // TEMPOLARY STATE
    const [ applicationName , setApplicationName ] = useState<string | null>(null)
    const [ description , setDescription ] = useState<string | null>(null)
    // END TEMPOLARY STATE

    const [ deleteApplicationId , setDeleteApplicationId ] = useState<string | null>(null)

    const [ applicationTokens , setApplicationTokens ] = useState<{ botId : string , token : string }[] | null>(null)

    const [ tmpToken , setTmpToken ] = useState<string | null>(null)

    const [applications, setApplications] = useState<(BotUser | null)[] | null>( null )

    const [ isV2token , setisV2token ] = useState<boolean>(false)

    if (user === null) return (
        <GridMainLayout>
            <GridChildren paddingX={12}>
                <Loading />
            </GridChildren>
        </GridMainLayout>
    )

    //if( !globalThis.localStorage instanceof globalThis.Storage) return alert('GlobalなlocalStorageが使用できません。')

    useEffect(() => {
        if (localStorage.getItem('user') === null) return router.push("/dashboard")
        getApplications();

        const interval = setInterval(() => {
            getApplications();
            isV2tokenInit();
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        console.log( applications );
    }, [applications])

    function copyToken() {
        navigator.clipboard.writeText(localStorage.getItem('user') ?? "").then(
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
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                botId : deleteApplicationId
            })
        });

        OpenDeleteMenu( false );

        if(!response.ok) return;

        if(applications !== null) {
            const deleted = applications.filter( ( val ) => +(val?.hid ?? "0") !== Number(deleteApplicationId) )
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
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
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
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });

        if(!response.ok) return;
        const responseJSON = await response.json() as { body : { applications : string[] } };
        const applications = await Promise.all(
            responseJSON.body.applications.map( async (id) => 
                await resolveApplication(id)
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
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
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

    async function regenerateUserToken() {
        const response = await fetch(`${API_URL}/v1/users/accessToken`, {
            method : "PUT",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin"
        })

        if(!response.ok){
            const errorResponse = await response.json() as { body : { message : string }}
            setErr(errorResponse.body.message)
            return;
        }

        const data = await response.json() as { body : { token : string } }
        localStorage.setItem('user', data.body.token);
        OpenRegenerateMenu( false )
    }

    async function resolveApplication ( id : string ) {
        const response = await fetch(`${API_URL}/v1/users/${id}`, {
            method : "GET",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin"
        });

        if(!response.ok) return null;
        const responseJSON = await response.json() as { body : { data : BotUser } };
        return responseJSON.body.data
    }

    function isV2tokenInit(){ 
        setisV2token(
            ( localStorage.getItem('user')?.substring( ( localStorage.getItem('user')?.length ?? 0 ) - 2 ) === "v2" )
        )
    }

    return (
        <GridMainLayout>
            <GridChildren paddingX={12} paddingY={12} IsHeightFull>
                <ErrorMessageComponent err={err} />
                <Title title={`ユーザーページ`} />
                <Content>
                    <Card className="sm:w-1/2 gap-2 p-1">
                        <CardBody>
                            <div className="ps-1">
                                <div className="text-2xl font-semibold">{user.data?.username}</div>
                                <div className="font-normal text-gray-500">{ user.data?.email }</div>
                            </div>
                            <div className="ps-1"> <CanCopyBlock value={user.data?.hid ?? 0} /> </div>
                            <div className="flex items-center ps-1">
                                { user.data?.developer && <PopupBatch title="あなたは究極なデベロッパー！" emoji="📎" description="あなたは究極なデベロッパーです。" /> }
                                { user.data?.serverAdmin && <PopupBatch title="究極な管理者" emoji="👑" description="強そうな権限をあなたはもっています。" /> }
                                { user.data?.googleAccount && <PopupBatch title="Googleアカウント連携" emoji="🐉" description="GoogleアカウントとHSSアカウントが紐づけされています。" /> }
                                { user.data?.discordAccount && <PopupBatch title="Discordアカウント連携" emoji="🐽" description="DiscordアカウントとHSSアカウントが紐づけされています。" /> }
                                { user.data?.isBot && <PopupBatch title="You are bot" emoji="🤖" description="ｱﾚ ﾅﾝﾃﾞｱﾅﾀ ｺﾚｦﾐﾚﾃｲﾙ ﾝﾀﾞ" /> }
                                { isV2token && <PopupBatch title="You are version 2" emoji="💎" description="バージョン２のユーザー！" /> }
                                { VerifyStaffs.includes( user.data?.hid ?? "0" ) && <PopupBatch title="H（ハイパー）S（スーパー）S（スタップ）" emoji="💠" description="HSSのスタッフ？だよね？" /> }
                            </div>
                        </CardBody>
                    </Card>
                </Content>
                <Content className="py-2">
                    <div className="flex w-full gap-2">
                            <Button className="py-2" color="danger" onPress={() => { localStorage.removeItem('user'); router.push('/')}}> ログアウトする </Button>
                            <Button className="py-2" color="warning" onPress={() => { localStorage.removeItem('user'); router.push('/api/v1/login')}}> ログインしなおす </Button>
                    </div>
                </Content>
                <Title title={`アクセストークン (${!isV2token ? "!!!" : "高度な設定"})`} />
                <Content>
                    {/*!isV2token && (
                        <Warning className="text-xl">
                            利用者の方へ：アクセストークンは只今、v2にアップデートされています。
                            アクセストークンをv2にすることで様々なユーザー向け利用を利用することができるようになりますので、
                            お早めにアクセストークンを再生成をお願いします。
                        </Warning>
                    )*/}
                    <code> {displayAccessToken ? localStorage.getItem('user') : "アクセストークンはここに表示されます"} </code>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:w-1/2">
                        <Button color="warning" onPress={() => setDisplayState(displayAccessToken ? false : true)}>アクセストークンを{displayAccessToken ? "隠す" : "表示する"}</Button>
                        {displayAccessToken && <Button color="primary" onPress={() => copyToken()}>コピーする</Button>}
                        <Button color="danger" onPress={() => OpenRegenerateMenu(isRegenerateMenuOpen ? false : true )}> 再生成する </Button>
                    </div>
                </Content>
                <Title title={`APIアプリケーション`} />
                <Content>
                    <Infomation className="text-xl">
                        <h1 className="text-2xl font-semibold"> APIアプリケーションとは？ </h1>
                        <p className="pb-2"> 詳しくはこちらのドキュメンテーションをご確認ください。</p>
                        <Button color="primary" onPress={() => router.push('https://hss-dev-docs.aknet.tech/docs/faq/differents#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%A8%E3%81%AE%E5%B7%AE%E3%81%A3%E3%81%A6')}> ドキュメンテーションを見る </Button>
                    </Infomation>
                    <Title title={`作成済みのアプリケーション`} />
                    <AutoModifyGrid>
                    {
                        applications !== null && applications.map( ( app , index ) => (
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
                    <Modal
                        isOpen={isRegenerateMenuOpen}
                        onOpenChange={OpenRegenerateMenu}
                        placement="center"
                    >
                        <ModalContent>
                            {
                                (onClose) => (
                                    <>
                                        <ModalHeader> トークンの再生成 </ModalHeader>
                                        <ModalBody>
                                            <p> トークンを再生成すると、あなたのゆーざートークンで製作しているアプリ等に影響が出る可能性があります。 </p>
                                            <p> 本当によろしいですか？</p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" onClick={() => regenerateUserToken()}> 再生成する </Button>
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