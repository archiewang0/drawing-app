'use server';

import connectDB from '@/lib/mongodb';
import ModelUser from '@/models/user';

export async function register({userId, name, email, canvasImages = []}: {userId: string; name: string; email: string; canvasImages: {name?: string; imageUrl: string}[]}) {
    await connectDB();

    const userdata = new ModelUser({
        userId,
        name,
        email,
        canvasImages,
    });

    await userdata.save();

    return {
        id: userdata._id.toString(),
        userId: userdata.userId,
        name: userdata.name,
        email: userdata.email,
        canvasImages: userdata.canvasImages.map((i) => ({
            id: i._id.toString(),
            imageUrl: i.imageUrl,
            name: i.name,
            createdAt: i.createdAt?.toISOString(),
            updatedAt: i.updatedAt?.toISOString(),
        })),
        createdAt: userdata.createdAt?.toISOString(),
        updatedAt: userdata.updatedAt?.toISOString(),
    };
}
