

export type ResponseLog = Log[]

export interface Log {
    username : string
    time : Date,
    infomations : LogInfomations
    isBot : boolean,
    isBigger : boolean
}

export interface LogInfomations {
    action : string,
    reason : string,
    target : string,
}