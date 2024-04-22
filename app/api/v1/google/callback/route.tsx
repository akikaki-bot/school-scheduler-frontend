import { API_URL } from "@/constants/setting";
import {
    NextResponse,
    NextRequest
} from "next/server";
import { URL } from "url";



export async function GET(
    req : NextRequest,
    res : NextResponse
) {
    const url = new URL(req.url).search.split('=')[1]
}