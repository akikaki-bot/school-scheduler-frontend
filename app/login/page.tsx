import { auth, signIn } from "@/lib/auth";
import { Button } from "@nextui-org/react";
import Link from "next/link";


export default async function Login() {
    
    return (
        <div className="flex min-h-screen justify-center items-center flex-col p-12 sm:p-24">
            <div className="flex flex-col rounded-xl bg-white p-2 shadow-lg min-h-[500px] justify-center items-center gap-4">
                <h1 className="text-3xl font-semibold"> HSSアカウントへのログイン </h1>
                <Link href="/api/v1/login">
                    <Button color="primary"> Discordアカウントでログイン </Button>
                </Link>
                <form action={ async() => {
                    'use server';
                    await signIn("google", { redirectTo: "http://localhost:3000/login/callback" });
                }}
                >
                    <Button type="submit" color="secondary"> Googleアカウントでログイン </Button>
                </form>
                <div> アカウントがありませんか？ <Link href="/register" className=" text-blue-500">ここから作成してください。</Link></div>
            </div>
        </div>
    )
}