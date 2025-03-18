"use client"
import { Button } from "@/components/ui/button"
import { ChromeIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { FC } from "react"


interface SignInButtonProps {}

const SignInButton:FC<SignInButtonProps> =() =>{
    return (
        <Button onClick={() => signIn("google")} variant="outline" className="w-full flex items-center justify-center gap-2">
            <ChromeIcon className="h-5 w-5" />
            Sign in with Google
        </Button>
    )
}

export default SignInButton