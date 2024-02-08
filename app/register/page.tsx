"use client";
import { Content } from "@/components/content";
import { BackgroundFixedImage, GridChildren, GridMainLayout, TitleAndSubtitle } from "@/components/mainLayout";
import { Title } from "@/components/title";
import { API_URL } from "@/constants/setting";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Register(){ 

    const [ email , setEmail ] = useState<string | null>(null)
    const router = useRouter();

    async function PostEmail() {
        router.push(`/api/v1/login`)
    }

    return (
        <GridMainLayout>
            <BackgroundFixedImage src="/bg_loginform.jpg"></BackgroundFixedImage>
            <GridChildren paddingX={12} className="flex flex-shrink justify-center items-center min-h-[400px]">
                <TitleAndSubtitle title={<span className="">アカウントの登録</span>} subtitle={<>Register to HSS Dev.</>} />
            </GridChildren>
            <GridChildren paddingX={12} IsBackground className="min-h-screen">
                <ScrollShadow>
                    <Title title={"Discordアカウントとの連携"} />
                    <Content>
                        <Button onClick={() => PostEmail()}>:discord: 連携</Button>
                    </Content>
                </ScrollShadow>
            </GridChildren>
        </GridMainLayout>
    )
}