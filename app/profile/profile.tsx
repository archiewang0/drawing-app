'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircleIcon, User } from "lucide-react"
import { useSession , signOut , getProviders} from "next-auth/react"
import AddCanvas from "./add-canvas"

function Profile(){    
    const { data: session, status } = useSession();
    if ( status === "loading" ) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!session?.user ) {
        return <></>
    }

    const user = session.user as ExtendedUser

    return (
        <div className="flex py-32 justify-center min-h-screen bg-gray-100">
            <div className=" container">
                <Card className="w-full bg-white">

                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-start mb-4">
                            <Avatar className="h-24 w-24">
                            <AvatarImage src={user.image} alt={user.name || ''} />
                            <AvatarFallback>
                                <User className="h-12 w-12" />
                            </AvatarFallback>
                            </Avatar>

                            <div className=" ml-10">
                                <CardTitle className="text-2xl font-bold ">{user.name}</CardTitle>
                                <CardDescription >{user.email}</CardDescription>
                            </div>
                        </div>
                        
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div>
                            <div className="text-xl font-medium" >My Canvas </div>

                            <div className=" flex flex-wrap gap-4 mt-6">
                                <AddCanvas/>

                                <div className=" inline-flex flex-wrap justify-center items-start overflow-hidden border w-1/6 h-52 border-gray-200 shadow-md rounded-md">
                                    <div className=" w-full h-2/3 bg-gray-100">
                                        
                                    </div>
                                    <div className=" w-full p-2">
                                        <span className=" font-light">title</span> 

                                        <div className=" text-xs text-black/30">
                                            updated at: 2024/12/12

                                        </div>
                                    </div>
                                </div>
                            </div>
                        

                        </div>
                    </CardContent>
                    
                    <CardFooter>
                        <div className=" w-full flex justify-end">  
                            <Button variant="outline" onClick={()=>{signOut()}}>
                                Sign Out
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>


            {/* <Card className="w-full max-w-md bg-white">
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
                
                    <Button variant="outline" className="w-full" onClick={()=>{signOut()}}>
                        Sign Out
                    </Button>
                </CardFooter>
            </Card> */}
        </div>
    )
}

export default Profile