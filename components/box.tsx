import { MouseEventHandler } from "react";



export function SelectBox({ title , description, onClick } : { title : string , description : string, onClick ?: MouseEventHandler}){
    return (
        <button className="p-4 w-[300px] h-[300px] shadow-medium rounded-md" onClick={onClick}>
            <h1 className="text-2xl font-semibold"> { title } </h1>
            <p className="text-xl font-normal">
                {description}
            </p>
        </button>
    )
}