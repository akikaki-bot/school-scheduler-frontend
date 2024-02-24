import { BotUser, User } from "@/constants/types/user";
import { MouseEventHandler } from "react";



export function UserBox({ user , IsOwner , onPress , isBot } : { isBot : boolean, user : User | null, IsOwner : boolean , onPress ?: MouseEventHandler<HTMLButtonElement>}){
    return (
        <div >
            <code> {isBot && "🤖"} {user?.username ?? "削除済みもしくは不明なユーザー"} ( {user?.hid ?? 0} ) </code>
            {  IsOwner && <button className="right-0 p-1 bg-white w-11 h-11 rounded-xl border-2 border-yellow-500">👑</button>  }
            { !IsOwner && <button className="right-0 p-1 bg-white w-11 h-11 rounded-xl border-2 border-red-500" onClick={ typeof onPress == "function" ? onPress : void 0}> ✖ </button> }
        </div>
    )
}