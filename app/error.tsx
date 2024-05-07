"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage (){
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image alt="503 service unavilable - credit sawaratsuki1004" src="/ServiceUnavailable.png" width={400} height={400} />
            <p className="mt-4 text-xl">なにか内部でエラーが発生しました。たぶんここはもうダメなのでホームにでも戻ってください。</p>
            <Link href="/">
                <Button color="primary" className="mt-4" >ホームに戻る</Button>
            </Link>
        </div>
    )
}