
import { createCipheriv, createHash, randomBytes } from "crypto";
import {
    NextResponse,
    NextRequest
} from "next/server";


export async function POST(
    req : NextRequest,
    res : NextResponse
) {

    const body = await req.json() as { text : string };

    const iv = randomBytes(16);
    console.log(iv.length)
    const hash = createHash('sha256').update(String(process.env.hashKey)).digest('base64').substr(0, 32);
    const HashFnc = createCipheriv("aes-256-cbc", hash, iv);
    HashFnc.update(body.text, 'utf8', 'hex');
    const hashpwd = HashFnc.final('hex');

    return NextResponse.json({
        hash : hashpwd,
        iv : iv.toString("hex")
    })
}