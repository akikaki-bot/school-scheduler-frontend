"use client";
import { Loading } from "@/components/loading";
import { SchoolSettingLayout } from "@/components/schoolSettingLayout";
import { useSchool } from "@/hooks/useSchool";



export default function DashboardMain({ params: { id } }: { params: { id: string } }) {

    const { data, user } = useSchool(id)

    return (
        <main>
            {typeof data !== "object" && <Loading />}
            {typeof data !== null && <SchoolSettingLayout data={data} />}
        </main>
    )
}