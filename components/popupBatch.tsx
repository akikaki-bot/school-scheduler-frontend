import { useState } from 'react'

export function PopupBatch({ title , emoji , description } : { title : string , emoji : string , description : string }){
    const [open, setOpen] = useState( false )
    return (
        <div className='px-1'>
            <div className={`absolute left-2 bg-white top-1 ${open ? "block" : "hidden"} w-30 text-sm p-5 rounded-lg shadow-lg transform`}>
                <span className='font-bold'>{title}</span> <br />
                {description}
            </div>
            <button 
                className="border-none bg-transparent w-5" 
                onClick={() => setOpen( open ? false : true )} 
                onMouseEnter={() => setOpen( true )} 
                onMouseLeave={() => setOpen( false )} 
            >
                {emoji}
            </button>
        </div>
    )
}