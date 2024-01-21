export enum SchoolType {
    Kosen = 0,
    NormalSchool = 1,
    InternetSchool = 2,
    BetaSchool = 3
}

export type SchoolLabel = {
    typeName : string;
    value : number;
}

export const Schools : SchoolLabel[] = [
    {
        typeName : "高等専門学校",
        value : 0
    },
    {
        typeName : "普通高校",
        value : 1
    },
    {
        typeName : "通信高校",
        value : 2
    },
    {
        typeName : "ベータ",
        value : 3
    }
]