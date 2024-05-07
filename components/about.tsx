


export function About(){
    return (
        <div className="py-2">
            <div className="bg-white bg-opacity-80 rounded-xl">
                <div className="p-5 text-center w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold"> <span className="text-amber-500">H</span><span className="text-amber-300">SS</span>API とは</h1>
                    <h2 className="text-2xl sm:text-2xl font-bold"> About the <span className="text-amber-500">H</span><span className="text-amber-300">SS</span>API</h2>
                </div>
                <div className="px-3 text-xl sm:text-2xl font-semibold py-10 opacity-100"> 
                    <div className="text-gray-800">
                        <div className="pb-4 min-w-full">
                            <h1><span className="bg-yellow-200 px-1">学校を記憶しよう。</span></h1>
                            <h2 className="px-2">HSSAPIでは、面倒なデータベースの構築をせず、API通信のみで時間割やイベント・宿題等を管理することができます。</h2>
                        </div>
                        <div className="pb-2 min-w-full">
                            <h1><span className="bg-yellow-200 px-1">みんなで作ろう。</span></h1>
                            <h2 className="px-2">HSSAPIでは、管理者コラボレーションという機能がついています。これにより、複数人が様々なプラットフォームや環境で開発を進めることができます。</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}