import {
    NextResponse,
    NextRequest
} from "next/server";

import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";
import { firebaseApp } from "@/lib/firebaseConfig";

//const auth = getAuth( firebaseApp )

// Googleログイン

export async function GET(
    req : NextRequest,
    res : NextResponse
) {
    const auth = getAuth()

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setDefaultLanguage('ja');

    await signInWithRedirect( auth , provider );
}