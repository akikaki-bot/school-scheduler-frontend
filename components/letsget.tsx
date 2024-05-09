import { Button } from "@nextui-org/react";
import Link from "next/link";



export function LetsStart() {

    return (
        <div className="py-2">
            <div className="bg-white bg-opacity-80 rounded-xl">
                <div className="p-5 text-center w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold"> かんたんに、さっそく、すばやくはじめよう。</h1>
                    <h2 className="text-2xl sm:text-xl font-bold"> let's gets start! </h2>
                </div>
                <div className="px-3 text-xl sm:text-2xl font-semibold py-10 opacity-100"> 
                    <div className="text-gray-800">
                        <div className="pb-4 min-w-full">
                            <h1><span className="bg-yellow-200 px-1">ダッシュボードから確認してみる。</span></h1>
                            <p className="px-2 pb-2">APIの使い方がわからない方のために、ダッシュボードを用意しています。まずはこちらからでも！</p>
                            <Link href="/dashboard">
                                <Button color="primary">ダッシュボードを起動する</Button>
                            </Link> 
                        </div>
                        <div className="pb-4 min-w-full">
                            <h1><span className="bg-yellow-200 px-1">早速APIを使ってみる。</span></h1>
                            <p className="px-2 pb-2">APIを使うことはとっても慣れてるという方のために、ドキュメントを用意しています。こちらからどうぞ。</p>
                            <Link href="https://hss-dev-docs.aknet.tech">
                                <Button color="primary">ドキュメントに移動する</Button>
                            </Link>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}