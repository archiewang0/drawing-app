"use client"
import { Button } from "@/components/ui/button"
import { ChromeIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { FC } from "react"
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";

interface SignInButtonProps {
    providers:  Record<LiteralUnion<string>, ClientSafeProvider> | null;
}

const SignInButton:FC<SignInButtonProps> =({providers}) =>{

    return (
        <>  
            { providers && Object.values(providers).map((provider) => (
                <Button 
                    key={provider.name}
                    onClick={() => signIn(provider.id)} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2">
                    <ChromeIcon className="h-5 w-5" />
                    Sign in with {provider.name}
                </Button>
            ))}
        </>
    )
}

export default SignInButton