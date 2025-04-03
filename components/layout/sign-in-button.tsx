'use client';
import {FC} from 'react';
import {useSession, signOut, getProviders} from 'next-auth/react';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {Button} from '../ui/button';
import {User} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

interface SignInButtonProps {}

const SignInButton: FC<SignInButtonProps> = ({}) => {
    const {data: session, status} = useSession();

    if (status === 'loading')
        return (
            <Skeleton
                width={'150px'}
                height={'32px'}
            />
        );

    if (status === 'unauthenticated' || !session)
        return (
            <>
                <Link href="/sign-in">
                    <Button
                        variant="outline"
                        size="sm">
                        Sign In
                    </Button>
                </Link>
            </>
        );

    const user = session.user as ExtendedUser;

    return (
        <>
            <Link href="/profile">
                <div className=" flex items-center gap-3">
                    <Avatar className=" flex h-9 w-9 rounded-full overflow-hidden">
                        <AvatarImage
                            src={user.image}
                            alt={user.name}
                        />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <p>{user.name}</p>
                </div>
            </Link>
        </>
    );
};

export default SignInButton;
