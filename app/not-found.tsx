import { Button } from "@nextui-org/react";
import Image from "next/image";



export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image alt="404" src="/NotFound.png" width={400} height={400} />
            <Button color="primary" className="mt-4" href="/">ホームに戻る</Button>
        </div>
    )
}