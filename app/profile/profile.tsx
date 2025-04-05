'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {User, Settings, Trash, TrashIcon} from 'lucide-react';
import {useSession, signOut} from 'next-auth/react';
import AddCanvas from './add-canvas';
import Skeleton from 'react-loading-skeleton';
import Container from './container';
import {finduser} from '../actions/finduser';
import {useEffect, useState} from 'react';
import ToastMessage from '@/components/ui/toast/toast';
import {ImageZoomDialog} from '@/components/page/profile/image-dialog';
import {DeleteImgDialog} from '@/components/page/profile/delete-dialog';

function Profile() {
    const {data: session, status} = useSession();
    const [canvasImg, setCanvasImg] = useState<
        {
            _id: string;
            name: string;
            imageUrl: string;
            createdAt: string;
        }[]
    >([]);
    const [fetchdata, setFetchData] = useState(true);
    const [showToast, setShowToast] = useState({
        open: false,
        title: '',
        description: '',
        delay: 0,
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletImgTarget, setDeleteImgTarget] = useState({
        imgUrl: '',
        name: '',
        id: '',
    });

    useEffect(() => {
        if (sessionStorage.getItem('addnewimg')) {
            sessionStorage.removeItem('addnewimg');
            setShowToast({
                open: true,
                title: '新增成功',
                description: '可以查看你所繪畫的圖片',
                delay: 2000,
            });
        }
    }, []);

    const fetchCanvasImg = async () => {
        const user = await finduser({userId: session!.user.id});
        setFetchData(false);
        if (!user) return;
        setCanvasImg(
            user.canvasImages?.map((image) => ({
                _id: image._id,
                name: image.name || '',
                imageUrl: image.imageUrl,
                createdAt: image.createdAt || '',
            })) || [],
        );
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (status !== 'loading' && session?.user && sessionStorage.getItem('addnewimg')) {
                fetchCanvasImg();
                return;
            }
            if (status !== 'loading' && session?.user) {
                fetchCanvasImg();
                return;
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [status, session?.user]);

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
        <>
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
                            <div className="text-xl font-medium">圖片快照</div>

                            <div className=" flex flex-wrap gap-4 mt-6">
                                {fetchdata && (
                                    <Skeleton
                                        count={3}
                                        width={400}
                                        height={40}
                                    />
                                )}
                                {!fetchdata && (
                                    <>
                                        <AddCanvas />

                                        {canvasImg.map((image) => (
                                            <div
                                                key={image._id}
                                                className=" inline-flex flex-wrap justify-center items-start overflow-hidden border w-1/6 h-52 border-gray-200 shadow-md rounded-md">
                                                <div className=" w-full h-1/2">
                                                    <ImageZoomDialog
                                                        className=" h-full"
                                                        imageName={image.name}
                                                        src={image.imageUrl}
                                                        alt={image.name + '.img'}
                                                        width={600}
                                                        height={300}
                                                    />
                                                </div>
                                                <div className=" w-full p-2 relative border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className=" font-light">{image.name || '未命名'}</span>

                                                        <Button
                                                            onClick={() => {
                                                                setDeleteImgTarget({
                                                                    imgUrl: image.imageUrl,
                                                                    name: image.name,
                                                                    id: image._id,
                                                                });
                                                                setOpenDeleteDialog(true);
                                                            }}
                                                            className=" rounded-full shadow-md"
                                                            variant="default"
                                                            size="sm">
                                                            <TrashIcon
                                                                width={25}
                                                                height={25}
                                                                className=" text-red-200"
                                                            />
                                                        </Button>
                                                    </div>

                                                    <div className=" mt-2 text-xs text-black/30">
                                                        <p>建立時間:</p>
                                                        <p> {new Date(image.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {showToast.open && (
                                    <ToastMessage
                                        title={showToast.title}
                                        description={showToast.description}
                                        delay={showToast.delay}
                                    />
                                )}
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

            <DeleteImgDialog
                setShowToast={setShowToast}
                fetchCanvasImg={fetchCanvasImg}
                id={deletImgTarget.id}
                imgurl={deletImgTarget.imgUrl}
                name={deletImgTarget.name}
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
            />
        </>
    );
}

export default Profile;
