'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useSession , signOut , getProviders} from "next-auth/react"
import { useEffect , useState} from "react"
import { useRouter } from "next/navigation"

interface ExtendedUser {
    id: string;
    image?: string
    name?: string | null;
    email?: string | null;
    role?: string;
}

function Profile(){
    const { data: session, status } = useSession();
    const router = useRouter();
    const onSignOut = ()=>{
        signOut()
        router.replace("/sign-in")
    }
    const [provider , setProvider] = useState<any>(null)

    useEffect(()=>{
        const providers = getProviders()
        providers.then((data)=>{
            console.log('data: ' , data)
            setProvider(data)
        })
    },[])

    useEffect(()=>{

        console.log({
            session: session,
            status: status
        })
    },[status , session])

    if (status === "loading" ) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!session?.user ) {
        return <p onClick={()=>{router.push('/sign-in')}}>請進行登入</p>;
    }

    const user = session.user as ExtendedUser

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                    <AvatarImage src={user.image} alt={user.name || ''} />
                    <AvatarFallback>
                        <User className="h-12 w-12" />
                    </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-center">{user.name}</CardTitle>
                <CardDescription className="text-center">{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4" >
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
                
                    <Button variant="outline" className="w-full" onClick={onSignOut}>
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Profile