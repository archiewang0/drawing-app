import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export function NavBar() {
    // For demo purposes, we'll assume the user is logged in
    const isLoggedIn = true
    const user = {
        name: "John Doe",
        image: "/placeholder.svg?height=32&width=32",
    }

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                Drawing App
                </Link>
                <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <Link href="/profile">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                        <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    </Link>
                ) : (
                    <Link href="/login">
                    <Button variant="outline" size="sm">
                        Sign In
                    </Button>
                    </Link>
                )}
                </div>
            </div>
        </header>
    )
}

