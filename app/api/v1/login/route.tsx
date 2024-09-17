import {
    NextResponse,
    NextRequest
} from "next/server";



export async function GET(
    req : NextRequest,
    res : NextResponse
) {
    if( process.env.NODE_ENV === "production") return NextResponse.redirect('https://discord.com/api/oauth2/authorize?client_id=854288304518332416&response_type=code&redirect_uri=http%3A%2F%2Fhss.akikaki.net%2Fapi%2Fv1%2Fcallback&scope=identify+email')
    return NextResponse.redirect('https://discord.com/api/oauth2/authorize?client_id=854288304518332416&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv1%2Fcallback&scope=identify+email')
}