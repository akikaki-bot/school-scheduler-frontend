import Link from "next/link";



export default function APITerms() {
    return (
        <main className="flex flex-col gap-4 p-6 sm:p-12">
            <div>
                <p>
                    <span className="text-3xl sm:text-5xl font-bold"> HSS API - Legal Content <br /></span>
                    <span className="text-sm font-normal -mt-5"> HSSAPI 法的コンテンツ </span>
                </p>
            </div>
            <div className="flex flex-col gap-4 text-xl">
                APIに関する法的コンテンツです。以下のリンクから利用規約やプライバシーポリシーをご確認ください。
                <div className="gird gird-cols-1 sm:grid-cols-3 max-w-full gap-2">
                    <Link href="/terms/api" className="flex flex-col w-[300px] h-[120px] shadow-md text-xl items-center justify-center font-semibold">
                        API Terms of Use <br />
                        <span className="text-sm font-normal"> API利用規約 </span>
                    </Link>
                    <Link href="/terms/privacy" className="flex flex-col w-[300px] h-[120px] shadow-md text-xl items-center justify-center font-semibold">
                        Privacy Policy <br />
                        <span className="text-sm font-normal"> プライバシーポリシー </span>
                    </Link>
                    <Link href="/terms/packages" className="flex flex-col w-[300px] h-[120px] shadow-md text-xl items-center justify-center font-semibold">
                        Package Licence <br />
                        <span className="text-sm font-normal"> パッケージ等権利表示 </span>
                    </Link>
                </div>
            </div>
        </main>
    )
}