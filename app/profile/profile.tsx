'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {User} from 'lucide-react';
import {useSession, signOut} from 'next-auth/react';
import AddCanvas from './add-canvas';
import Skeleton from 'react-loading-skeleton';
import Container from './container';

function Profile() {
    const {data: session, status} = useSession();
    if (status === 'loading') {
        return (
            <Container>
                <Card className="w-full bg-white">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-start mb-4">
                            <Skeleton
                                circle
                                width={96}
                                height={96}
                            />

                            <div className=" ml-10">
                                <CardTitle className="text-2xl font-bold ">
                                    <Skeleton width={100} />
                                </CardTitle>
                                <CardDescription>
                                    <Skeleton width={200} />
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div>
                            <div className=" flex flex-wrap gap-4 mt-6">
                                <Skeleton
                                    count={3}
                                    width={400}
                                    height={40}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <div className=" w-full flex justify-end">
                            <Skeleton
                                width={100}
                                height={30}
                            />
                        </div>
                    </CardFooter>
                </Card>
            </Container>
        );
    }

    if (!session?.user) {
        return <></>;
    }

    const user = session.user as ExtendedUser;

    return (
        <Container>
            <Card className="w-full bg-white">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-start mb-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={user.image}
                                alt={user.name || ''}
                            />
                            <AvatarFallback>
                                <User className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>

                        <div className=" ml-10">
                            <CardTitle className="text-2xl font-bold ">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <div>
                        <div className="text-xl font-medium">My Canvas </div>

                        <div className=" flex flex-wrap gap-4 mt-6">
                            <AddCanvas />
                            <div className=" inline-flex flex-wrap justify-center items-start overflow-hidden border w-1/6 h-52 border-gray-200 shadow-md rounded-md">
                                <div className=" w-full h-2/3 bg-gray-100"></div>
                                <div className=" w-full p-2">
                                    <span className=" font-light">title</span>

                                    <div className=" text-xs text-black/30">updated at: 2024/12/12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <div className=" w-full flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                signOut();
                            }}>
                            Sign Out
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Container>
    );
}

export default Profile;
