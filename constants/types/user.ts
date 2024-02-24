export interface BaseUser {
    hid : number
    username : string
    discordAccount ?: boolean
    email : string
}

export interface User extends BaseUser {
    developer : boolean
    developerInfo ?: DeveloperSetting
}

export interface BotUser extends User {
    description : string,
    ownerId : string
    isBot : boolean
}

export interface DeveloperSetting {
    token : string | null
    redirects : string[]
    applicationName : string[]
}



/**
 * ベースとなるスキーマ
 */
export interface BaseScheme {
    /**
     * 学校管理Id
     */
    schoolId: string,
    /**
     * 学校情報
     */
    details: DetailSchool,
    /**
     *  以下ユーザー管理データ
     */
    userDatas: UserDatas[]
}

export type Dates = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"
export const DateChangeArray  = ["sun","mon","tue","wed","thu","fri","sat"]

export type BaseObjectType = {
    [ key : string ]: number | object | string
}

export interface UserDatas {
    /**
     * 学年
     */
    grade: 1 | 2 | 3 | 4 | 5 | 6 | number
    /**
     * クラス
     */
    class : number | string,
    /**
     * 基本的な時間割数
     */
    defaultTimelineIndex : number
    /**
     * 時間割
     */
    timelineData: MonthData<Subjects>
    /**
     * イベント等データ
     */
    eventData: MonthData<EventData>
    /**
     * 基本的な時間割
     */
    defaultTimelineData: MonthData<Subjects>
}

/**
 * 曜日データ Generic Tでsun ~ sat までのObjectを生成。
 * 
 * 各keyのデータはT[]となります。
 */
export interface MonthData<T> {
    sun: T[]
    mon: T[],
    tue: T[],
    wed: T[],
    thu: T[],
    fri: T[]
    sat: T[]
}

/**
 * イベントデータ
 */
export interface EventData {
    name: string,
    timeData : TimeData,
    place: string | null,
}

/**
 * イベント開始終了データ
 */
export interface TimeData {
    start: Date | null,
    end: Date | null,
    isEndofDay: boolean
}

/**
 * 教科
 */
export interface Subjects {
    /**
     * 名
     */
    name: string,
    /**
     * 場所 
     *
     * @nullable
     */
    place: null | string,
    /**
     * 提出物
     */
    homework: Homework[],

    IsEvent: boolean
}

/**
 * 宿題
 */
export interface Homework {
    /**名前 */
    name : string,
    /**とっても大きくてやるのに時間がかかるものか */
    istooBig : boolean,
    /**
     * ページ情報
     */
    page : {
        /**　はｚまり */
        start : string | number,
        /** おわり  */
        end : string | number,
        /** 何か補足 */
        comment : string | null
    }
}

/**
 * 学校のタイプ
 */
export enum SchoolType {
    Kosen = 0,
    NormalSchool = 1,
    InternetSchool = 2,
    BetaSchool = 3
}

/**
 * 学校情報
 */
export interface DetailSchool extends BaseObjectType {
    /**
     * 学校のタイプ
     */
    type: SchoolType
    /**
     * 学校名
     */
    name: string,
    /**
     *  BaseScheme.schoolId と 同様
     */
    id: string,
    /**
     * 登録代表ユーザー
     */
    ownerId: number,
    /**
     * 管理者
     */
    admins: number[]    
    /**
    * 基本的な時間割数
    */
    defaultTimelineIndex : number
}