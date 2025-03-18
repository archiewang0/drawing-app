
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FC } from "react"
import SignInButton from "./sign-in-button"

interface SignInProps {}

const SignIn:FC<SignInProps> =() =>{
  return (
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">

            <SignInButton />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
  )
}

export default SignIn