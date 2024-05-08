import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [ GoogleProvider ],
})