
import { createCipheriv, createHash, randomBytes } from "crypto";
import {
    NextResponse,
    NextRequest
} from "next/server";


export async function POST(
    req : NextRequest,
    res : NextResponse
) {
    //text -> pwd , text2 -> email
    const body = await req.json() as { text : string , text2 : string };

    const iv = randomBytes(16);
    const iv2 = randomBytes(16);
    const hash = createHash('sha256').update(String(process.env.hashKey)).digest('base64').substr(0, 32);
    
    //pwd hash
    const HashFnc = createCipheriv("aes-256-cbc", hash, iv);
    HashFnc.update(body.text, 'utf8', 'hex');
    const hashpwd = HashFnc.final('hex');

    return NextResponse.json({
        p : hashpwd,
        e : body.text2,
        piv : iv.toString("hex"),
        eiv : iv2.toString('hex')
    })
}