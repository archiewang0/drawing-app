import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function ProfilePage() {
    // Mock user data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        id: "user_123456",
        image: "/placeholder.svg?height=100&width=100",
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-center">{user.name}</CardTitle>
                <CardDescription className="text-center">{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500">User ID</span>
                    <span className="text-sm truncate">{user.id}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-500">Account Type</span>
                    <span className="text-sm">Google</span>
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                <Link href="/sign-in" className="w-full">
                    <Button variant="outline" className="w-full">
                    Sign Out
                    </Button>
                </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

