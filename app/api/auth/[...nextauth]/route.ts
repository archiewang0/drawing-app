// import { handlers } from "@/utils/auth" // Referring to the auth.ts we just created
// export const { GET, POST } = handlers

import NextAuth from "next-auth";
import { authOptions } from "@/utils/auth";

export default NextAuth(authOptions);
