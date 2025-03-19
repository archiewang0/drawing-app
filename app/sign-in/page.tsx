// import SignIn from "@/components/page/sign-in/sign-in-delete"
// import SignIn2 from "@/components/page/sign-in/sign-in2"
import { getProviders } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SignInButton from "@/components/page/sign-in/sign-in-button";
import { Suspense } from "react";

export default async function LoginPage() {
    const providers = await getProviders()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* <SignIn2/> */}
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
                <CardDescription className="text-center">Sign in to access your account</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Suspense fallback={<div>載入中...</div>}>
                        <SignInButton providers={providers}/>
                    </Suspense>
                </CardContent>
                <CardFooter className="flex flex-col">
                <p className="text-sm text-center text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
                </CardFooter>
            </Card>
        </div>
    )
}

