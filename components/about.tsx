


export function About(){
    return (
        <div className="py-2">
            <div className="bg-slate-50 rounded-xl">
                <div className="p-10 text-center w-full">
                    <h1 className="text-3xl sm:text-5xl font-bold"> <span className="text-amber-500">H</span><span className="text-amber-300">SS</span>APIとは</h1>
                    <h2 className="text-2xl sm:text-3xl font-bold"> About the <span className="text-amber-500">H</span><span className="text-amber-300">SS</span>API</h2>
                </div>
                <div className="text-center text-xl sm:text-2xl font-semibold py-10"> 
                    <p className=" text-gray-800">
                        <span className="text-amber-500 text-3xl">こ</span>のAPIは、全国の学生開発者のために作られたものです。<br />
                        スケジュール・学校行事等をこのAPIに学校単位で保存することができます。<br />
                        利用は<span className="text-amber-400">無料</span>で、どんな<span className="text-amber-400">学年</span>でも利用が出来ます。<br />
                    </p>
                </div>
            </div>
        </div>
    )
}