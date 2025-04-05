'use server';

import connectDB from '@/lib/mongodb';
import ModelUser from '@/models/user';
import {IUser} from '@/models/user';

export async function finduser({userId}: {userId: string}) {
    await connectDB();

    try {
        const user: IUser | null = await ModelUser.findOne(
            {userId: userId},
            {'canvas.drawElements.roughElement': 0}, // 排除 roughElement 欄位
        ).lean();

        if (!user) {
            return {error: 'User not found'};
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userId: user.userId,
            canvasImages: user.canvasImages.map((i) => ({
                _id: i._id.toString(),
                name: i.name,
                imageUrl: i.imageUrl,
                createdAt: i.createdAt?.toISOString(),
            })),
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
