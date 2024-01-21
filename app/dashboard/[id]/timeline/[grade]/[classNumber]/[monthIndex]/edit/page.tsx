"use client";
import { Content } from "@/components/content";
import { LoadingWithSidebar } from "@/components/loading";
import { useSchool } from "@/components/schoolComponent";
import { SidebarComopnent } from "@/components/sidebarComponent";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Dates, Subjects } from "@/constants/types/user";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function ChangeMonthToLabel( label : Dates | string ){
    switch( label ){
        case "sun" : return "日曜日";
        case "mon" : return "月曜日";
        case "tue" : return "火曜日";
        case "wed" : return "水曜日";
        case "thu" : return "木曜日";
        case "fri" : return "金曜日";
        case "sat" : return "土曜日";
    }
}

type Scheme = {
    headKey: string;
    grade: string;
    class: string;
    date: Dates;
    key: string;
    index: number;
    value: Subjects;
}

export default function DashboardTimeLineEdit({ params: { id, grade, classNumber, monthIndex } }: { params: { id: string, grade: string, classNumber: string, monthIndex : Dates } }) {

    const { data , user } = useSchool( id ) 
    const [ TimeLines , setTimeLines ] = useState<Subjects[] | null>( null )
    const router = useRouter()
    const [ TempTimeLines , setTempTimeLines ] = useState<{ time : number , data : Subjects }[] | null>( null )
    
    const [ err , setError ] = useState<string | null>( null )
    useEffect(() => {
        setTimeout(() => setError( null ) , 4000)
    }, [typeof err === "string"])

    function onChangeValueScadule( time : number , objectData : Subjects ){
        console.log(`Called`)
        if( typeof TempTimeLines == "undefined" || TempTimeLines === null ) return setTempTimeLines([{ time : time , data : objectData }])
        const Filtered = TempTimeLines.filter( ( data ) => data.time !== time ).sort(( data , _data) => data.time - _data.time)
        setTempTimeLines( Filtered );
        console.log(`Filtered : ${Filtered}`)
        setTempTimeLines(
            TempTimeLines === null ? 
                [{ time : time , data : objectData }] : 
                [ ...Filtered , { time : time , data : objectData }]
        )
    }

    function toSaveRefactor() {
        SaveData()
    }

    async function SaveData() {

        if(TempTimeLines === null) return;
       //return;

        const SortedTimeLine = TempTimeLines.sort(( data , _data) => data.time - _data.time);

        console.log( SortedTimeLine )

        const DataExtractMap = SortedTimeLine.map( v => v.data )

        const DataBody = DataExtractMap?.map(
            (v , index) => {
                return {
                    headKey : "userDatas",
                    grade : grade,
                    class : classNumber,
                    date : monthIndex,
                    key : "defaultTimelineData",
                    index : index,
                    value : v
                }
            }
        )

        if(data !== null && TempTimeLines.length !== data?.details.defaultTimelineIndex){
            const ClassData = data.userDatas.find( (data) => data.class === +classNumber && data.grade === +grade)
            if(ClassData){

                if(ClassData.defaultTimelineData[monthIndex].length === 0 && ( TempTimeLines.length !== data?.details.defaultTimelineIndex) ){
                    return setError(`教科データをすべて入力して保存してください。`)
                }

                const Indexs = SortedTimeLine.map( ( data ) => data.time )
                const Removed = ClassData.defaultTimelineData[monthIndex].map( ( _ , i ) => Indexs.includes( i + 1 ) ? null : _ )
                const Fixed = Removed.map( 
                    (data , i) => {
                        if( data == null ) {
                            const N = SortedTimeLine.find( ( data ) => data.time === i + 1)
                            if( typeof N === "undefined") return ClassData.defaultTimelineData[monthIndex][i]
                            return N.data
                        }
                        else return data
                    }
                );

                console.log( Indexs , Removed , Fixed )

                const DataBody = Fixed?.map(
                    (v , index) => {
                        return {
                            headKey : "userDatas",
                            grade : grade,
                            class : classNumber,
                            date : monthIndex,
                            key : "defaultTimelineData",
                            index : index,
                            value : v
                        }
                    }
                ).sort( ( a, b ) => a.index - b.index)

                return await PatchSetting( DataBody )
            }
            else {
                return setError(`クラスデータがありません。登録されていますか？`)
            }
        } 


        return await PatchSetting( DataBody )
    }

    async function PatchSetting( DataBody : Scheme[] ){
        const RequestBody = {
            schoolId : id,
            token : `Bearer ${sessionStorage.getItem('user')}`,
            bodies : DataBody
        }

        console.log( RequestBody , typeof RequestBody)
        
        const response = await fetch(`${API_URL}/v1/school`, {
            method : "PATCH",
            mode: "cors",
            headers : {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body : JSON.stringify(RequestBody)
        })
        if(!response.ok) return;
        const dataRes = await response.json()
        
        router.push(`/dashboard/${id}/timeline/${grade}/${classNumber}`)
    }

    useEffect(() => { TempTimeLines && console.log( TempTimeLines ) }, [TempTimeLines])
    useEffect(() => { data && console.log( data.details.defaultTimelineIndex ) }, [data])

    return (
        <SidebarComopnent sid={id} classMenu grade={+grade} classNumber={+classNumber}>
            <div className="absolute top-20 right-2">
                {
                    typeof err === "string" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative z-20" role="alert">
                            <strong className="font-bold"> {err} </strong>
                        </div>
                    )
                }
            </div>
            <Title title={`${grade}-${classNumber} / ${ChangeMonthToLabel( monthIndex )}の基本教科を編集する`} />
            <Content>
                { !data && <LoadingWithSidebar />}
                {
                    data && new Array(data.details.defaultTimelineIndex).fill(0).map( ( _ , index ) => (
                        <div className="py-2" key={index}>
                            <label> {index + 1}時間目の教科</label>
                            <Input 
                                placeholder={`${data.userDatas.find( (data) => data.class === +classNumber && data.grade === +grade)?.defaultTimelineData[monthIndex][index]?.name ?? "教科名"}`} 
                                type="text" 
                                onChange={
                                    (e) => 
                                        onChangeValueScadule( 
                                            index + 1 , 
                                            { 
                                                name : e.target.value , 
                                                place : "初期値" , 
                                                homework : [] , 
                                                IsEvent : false 
                                            }
                                        )
                                }
                            />
                        </div>
                    ))
                }
                {
                    /*
                <div className="grid grid-cols-2 gap-2 justify-center">
                    <Button color="primary" variant="light"  onClick={() => void 0} disabled> 科目数を増やす </Button>
                    <Button color="danger" variant="light" onClick={() => void 0} disabled> 科目数を減らす </Button>
                </div>
                    */
                }
                <Button color="primary" variant="light" onClick={() => toSaveRefactor()}> とりあえず保存する </Button>
                <Button color="primary" variant="light" onClick={() => router.push(`/dashboard/${id}/timeline/${grade}/${classNumber}`)}> やっぱやめる </Button>

            </Content>
        </SidebarComopnent>
    )
}