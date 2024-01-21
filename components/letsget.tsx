import Link from "next/link";



export function LetsStart() {
    return (
        <div className="py-2">
            <div className="bg-slate-50 rounded-xl">
                <div className="p-10 text-center w-full">
                    <h1 className="text-3xl sm:text-5xl font-bold"> 早速<span className="text-amber-500">始</span>めましょう</h1>
                    <h2 className="text-2xl sm:text-3xl font-bold"> Let's get <span className="text-amber-500">Start</span>!</h2>
                </div>
                <div className="text-center text-xl sm:text-2xl font-semibold py-10">
                    <p className=" text-gray-800">
                        <Link href="/dashboard"><span className="text-amber-500 text-3xl">ここから</span></Link><br />
                        アカウントを作成し、APIキーをゲットしてください。<br />
                        また、複数人での開発も<span className="text-amber-400">可能</span>です。<br />
                        少しでも便利に生活ができますように。<br />
                    </p>
                </div>
            </div>
        </div>
    )
}