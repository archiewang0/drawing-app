import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"

console.log('process.env.GOOGLE_CLIENT_ID: ' , process.env.GOOGLE_CLIENT_ID)

function getGoogleCredentials(): { clientId: string; clientSecret: string } {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return {clientId ,clientSecret}
}

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [
//         Google({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//         })
// ]   ,
//     secret: process.env.NEXTAUTH_SECRET,
// })


export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages:{
        signIn: '/login'
    },
    // 如果只使用 process.env.xxx 
    // 可能會形成兩個型別 一個是 string 一個是 undefined
    // undefined 是因為
    providers: [
        Google({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret
        })
    ],
    callbacks:{
        async signIn({account ,profile}){
            console.log('account: ' , account)
            console.log('profile: ' , profile)
            return true
        },
        // async session({token,session}){
        //     if(token){
        //         session.user.id = token.id
        //         session.user.name = token.name
        //         session.user.email = token.email
        //         session.user.image = token.picture
        //     }
        //     return session
        // },
        // async jwt({token , user}){
        //     const dbUser = await db.user.findFirst({
        //         where:{
        //             email: token.email
        //         }
        //     })
        //     if(!dbUser){
        //         token.id = user!.id
        //         return token
        //     }

        //     return {
        //         id: dbUser.id,
        //         name: dbUser.name,
        //         email: dbUser.email,
        //         picture: dbUser.image
        //     }
        // },
        redirect() {
            return '/'
        }
    }
}
const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}