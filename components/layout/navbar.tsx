import Link from "next/link"
import SignInButton from "./sign-in-button"
import { PenIcon } from "lucide-react"
PenIcon

export function NavBar() {


    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold flex gap-2">
                    <PenIcon />
                    <span>Drawing App</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <SignInButton/>
                </div>
            </div>
        </header>
    )
}

