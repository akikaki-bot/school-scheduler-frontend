import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GoogleProvider({ authorization : { params : { scope : "openid profile email", access_type : "offline" } } })],
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            if (account && user) {
                return {
                    ...token,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token || null,
                    id_token: account.id_token || null,
                }
            }

            return token;
        },
        async session({ session, token, user }) {
            return {
                ...session,
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                id_token: token.id_token,
            };
        },
    }
})