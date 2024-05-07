import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";



export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image alt="404 not found - credit sawaratsuki1004" src="/NotFound.png" width={400} height={400} />
            <Link href="/">
                <Button color="primary" className="mt-4" >ホームに戻る</Button>
            </Link>
        </div>
    )
}