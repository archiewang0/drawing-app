import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface User {
        id: string;
    }
    interface Session {
        user: User;
    }
} 


export function getGoogleCredentials(): { clientId: string; clientSecret: string } {
    const clientId = process.env.AUTH_GOOGLE_ID
    const clientSecret = process.env.AUTH_GOOGLE_SECRET
    // console.log('process.env.AUTH_GOOGLE_ID: ' , process.env.AUTH_GOOGLE_ID)
    // console.log('process.env.AUTH_GOOGLE_SECRET: ' , process.env.AUTH_GOOGLE_SECRET)
    // console.log('process.env.AUTH_SECRET: ' , process.env.AUTH_SECRET)
    if(!clientId || clientId.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return {clientId ,clientSecret}
}


export const authOptions: NextAuthOptions = {
    // 因為有執行 npx auth 迫使這個專案要帶入 auth secret key 如果沒有執行的話, 可以不需要這個secret
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async signIn() {
            return true;
        },
        async jwt({ token, trigger }) {
            console.log({
                token,
                trigger
            })
    
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/sign-in",
    },
};
