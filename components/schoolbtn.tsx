import { DetailSchool } from "@/constants/types/user";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";


export function School({ schools , index }: { schools: DetailSchool , index: number}) {
    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">管理者ページ</p>
                <small className="text-default-500">{index} - {schools.id}</small>
                <h4 className="font-bold text-large">{schools.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src="/logo.png"
                    width={270}
                    height={300}
                />
            </CardBody>
        </Card>
    )
}