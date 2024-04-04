"use client";
import { SelectBox } from "@/components/box";
import { Content } from "@/components/content";
import { EmojisInfo } from "@/components/emojis/info";
import { ErrorMessageComponent } from "@/components/errorMessage";
import { AutoModifyGrid } from "@/components/grid-cols-auto";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Homework, homeworkDataChangeRequest } from "@/constants/types/user";
import { useClass } from "@/hooks/useClass";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function DashboardTimeLine({ params: { id, grade, classNumber } }: { params: { id: string, grade: string, classNumber: string } }) {

    const { data , user, updateData } = useClass( id , grade , classNumber )
    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen : detailIsOpen, onOpen : detailOnOpen, onOpenChange : detailOnOpenChange } = useDisclosure();
    const { isOpen : deleteIsOpen , onOpen : deleteOnOpen , onOpenChange : deleteOnOpenChange } = useDisclosure();

    const [ err , setErr ] = useState<string | null>(null)

    const [ viewHomework , setViewHomework ] = useState<number | null>(null)

    useEffect(() => {
        setTimeout(() => setErr(null), 4000)
    }, [typeof err === "string"])

    //  宿題のデータたち (必須) //
    const [ name , setName ] = useState<string | null>(null)
    const [ deadline , setDeadline ] = useState<string | null>(null)

    // 宿題のデータたち (任意) //
    const [ startPage , setStartPage ] = useState<number | null>(null)
    const [ endPage , setEndPage ] = useState<number | null>(null)

    const [ isToobig , setToobig ] = useState<boolean>(false)

    const [ isEditMode , setEditMode ] = useState<boolean>(false)
    const [ editIndex , setEditIndex ] = useState<number | null>(null)

    function CheckHomeworkScheme() {
        if( name === null) return setErr("名前は必須です")
        PushData()
    }

    function CreateMode(){
        setName(null)
        setDeadline(null)
        setStartPage(null)
        setEndPage(null)
        setToobig(false)
        
        setEditMode(false)
        onOpen()
    }

    function EditMode(){

        setName( data?.homework[viewHomework ?? 0].name ?? "");
        setDeadline( data?.homework[viewHomework ?? 0].page.comment ?? "" );
        setStartPage(  +( data?.homework[viewHomework ?? 0].page.start ?? 0) ?? 0 );
        setEndPage( +( data?.homework[viewHomework ?? 0].page.end ?? 0) ?? 0);
        setToobig( data?.homework[viewHomework ?? 0].istooBig ?? false )


        detailOnOpenChange()
        setEditIndex( viewHomework );
        setEditMode( true );
        setToobig( data?.homework[viewHomework ?? 0].istooBig ?? false )
        onOpenChange()
    }

    function DeleteMode(){
        detailOnOpenChange()
        setEditIndex( viewHomework );
        deleteOnOpenChange()
    }

    async function DeleteData(){
        console.log(editIndex)
        if( editIndex === null) return setErr("エラーが発生しました... :( \n インデックスが見つかりませんでした...")
        const data : homeworkDataChangeRequest = {
            key : "homework",
            state : "remove",
            index : editIndex,
            value : { } as Homework
        }

        const response = await fetch(`${API_URL}/v1/school/${id}/userdatas/${grade}/${classNumber}/sun`, {
            method : "PATCH",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                bodies : [ data ]
            })
        })

        if(!response.ok) return setErr("エラーが発生しました... :( "+response.statusText )
        deleteOnOpenChange()
        updateData();
    }

    async function PushData() {

        console.log(`[PushData] ${editIndex} ${isEditMode} ${name} ${deadline} ${startPage} ${endPage} ${isToobig}`)

        const data : homeworkDataChangeRequest = {
            key : "homework",
            state : isEditMode ? "update" : "add",
            value : {
                name : name ?? "名前のない宿題",
                istooBig : isToobig,
                page : {
                    start : startPage ?? "N/A",
                    end : endPage ?? "N/A",
                    comment : `${(deadline === null || deadline === "") ? "特に目立ったコメントなし" : deadline}`
                }
            }
        }
        if( !Array.isArray( data.value )){
            if( data.value.page.start === 0 && data.value.page.end === 0) {
                    data.value.page.start = "";
                    data.value.page.end = "";
            }
        }

        if( isEditMode ){
            if( editIndex === null ) return setErr("エラーが発生しました... :(")
            data.index = editIndex
        }

        const response = await fetch(`${API_URL}/v1/school/${id}/userdatas/${grade}/${classNumber}/sun`, {
            method : "PATCH",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${localStorage.getItem('user')}`
            },
            credentials: "same-origin",
            body : JSON.stringify({
                bodies : [ data ]
            })
        })

        if(!response.ok) return setErr("エラーが発生しました... :( "+response.statusText )
        onOpenChange()
        updateData();
    }



    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <ErrorMessageComponent err={err} />
            <Title title={`宿題メニュー`} />
            <Content>
                <AutoModifyGrid>
                    {
                        typeof data !== "object" && <p>loading</p>
                    }
                    {
                        typeof data === "object" && (
                            data?.homework.map( ( homework , index ) => (
                                <SelectBox key={index} title={homework.name} description="クリックして詳細を見る" onClick={() => { setViewHomework( index ); detailOnOpen()}}/>
                            ))
                        )
                    }
                    <SelectBox title="宿題を追加" description="ここをクリックして追加" onClick={() => { CreateMode() }}/>
                </AutoModifyGrid>
            </Content>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">宿題の{isEditMode ? "編集" : "追加"}</ModalHeader>
                    <ModalBody>
                        <p className="font-semibold text-xl">
                            必須なオプション
                        </p>
                        <label> 名前<span className="text-red-700">*</span> </label>
                        <Input 
                            placeholder="宿題の名前 (必須) " 
                            required 
                            isInvalid={typeof err === "string" && ( name === null || name === "") }
                            onChange={(e) => setName(e.target.value)}
                            defaultValue={isEditMode ? data?.homework[editIndex ?? 0].name : ""}
                        />
                        <p className="text-xl">
                            特に必須ではないオプション
                        </p>
                        <label> コメント</label>
                        <Input 
                            placeholder="宿題に関するコメント" 
                            type="text" 
                            onChange={(e) => setDeadline(e.target.value)}
                            defaultValue={isEditMode ? data?.homework[editIndex ?? 0].page.comment ?? "" : ""}
                        />
                        <label> 始まり・終わりのページ </label>
                        <Input 
                            type="number"
                            placeholder="始まりのページ"
                            onChange={(e) => setStartPage( e.target.value === "" ? null : +e.target.value )}
                            defaultValue={isEditMode ?(data?.homework[editIndex ?? 0].page.start !== null ? data?.homework[editIndex ?? 0].page.start.toString() : "") ?? "" : ""}
                        />
                        <Input 
                            type="number"
                            placeholder="終わりのページ"
                            onChange={(e) => setEndPage( e.target.value === "" ? null : +e.target.value )}
                            defaultValue={isEditMode ? (data?.homework[editIndex ?? 0].page.end !== null ? data?.homework[editIndex ?? 0].page.end.toString() : "") ?? "" : ""}
                        />
                        <label> クソデカ？ </label>
                        <Button color={ isToobig ? "danger" : "default" } onClick={() => setToobig( isToobig ? false : true )}>{ isToobig ? "めちゃ面倒" : "そうでもない" }</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            キャンセルする
                        </Button>
                        <Button color="primary" onPress={() => CheckHomeworkScheme()}>
                            {isEditMode ? "適応" : "追加"}する
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            <Modal isOpen={detailIsOpen} onOpenChange={detailOnOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">宿題の詳細</ModalHeader>
                        <ModalBody>
                            <h2 className="flex gap-4 items-center text-xl font-semibold flex-nowrap"> <EmojisInfo /> この宿題の情報 </h2>
                            <p className="text-xl font-bold"> { data?.homework[viewHomework ?? 0].name } </p>
                            <p className="text-sm"> { data?.homework[viewHomework ?? 0].page.comment } </p>
                            <h2 className="flex gap-4 items-center text-xl font-semibold flex-nowrap"> <EmojisInfo /> 提出について </h2>
                            <p> この宿題{data?.homework[viewHomework ?? 0].istooBig ? "はクソデカです。" : "をやる時間はそこまでかかりません。"}</p>
                            {
                                typeof data?.homework[viewHomework ?? 0].page.start === "number" && (
                                    <p> 開始ページ {data?.homework[viewHomework ?? 0].page.start} から</p>
                                )
                            }
                            {
                                typeof data?.homework[viewHomework ?? 0].page.end === "number" && (
                                    <p> 終了ページ {data?.homework[viewHomework ?? 0].page.end} まで</p>
                                )
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={DeleteMode}> 削除する </Button>
                            <Button color="primary" variant="flat" onPress={EditMode}> 編集する </Button>
                            <Button color="success" variant="flat" onPress={onClose}> 閉じる </Button>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            <Modal isOpen={deleteIsOpen} onOpenChange={deleteOnOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">本当に消してよろしいですか？</ModalHeader>
                        <ModalBody>
                            <p> 「{data?.homework[editIndex ?? 0].name}」 という宿題データを消去します。※永遠に！</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" variant="light" onPress={onClose}> やっぱやめる </Button>
                            <Button color="danger" onPress={() => DeleteData()}> 削除する </Button>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </SidebarComopnent>
    )
}