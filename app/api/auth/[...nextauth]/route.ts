import NextAuth from "next-auth";
import { authOptions } from "@/utils/auth";

const handler = NextAuth(authOptions);
console.log('run there!')
export { handler as GET, handler as POST }; 