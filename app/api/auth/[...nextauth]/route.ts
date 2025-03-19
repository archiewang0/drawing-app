// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {getGoogleCredentials} from '@/utils/auth'

declare module 'next-auth' {
    interface Session {
        accessToken: any;
        user: { id: string; email: string; profile?: any , name: string , image: string };
    }
}


const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: getGoogleCredentials().clientId,
        clientSecret: getGoogleCredentials().clientSecret,
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        // 將 user 的 profile 資訊添加到 token
        if (account) {
          token.accessToken = account.access_token
          token.profile = profile
        }
        return token
      },
      async session({ session, token }) {
        // 將 token 中的資訊添加到 session
        session.accessToken = token.accessToken
        if (session.user) {
          session.user.profile = token.profile;
        }
        return session
      },
    },
  });

export { handler as GET, handler as POST };