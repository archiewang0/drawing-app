'use server';
import User from '@/models/user';
import connectDB from '@/lib/mongodb';
import {authOptions} from '@/lib/auth';
import {getServerSession} from 'next-auth';

export async function deleteimg({id, imgUrl, name}: {id: string; imgUrl: string; name?: string}) {
    await connectDB();
    try {
        const session = await getServerSession(authOptions);

        if (!session) throw new Error('Session not found');
        const userUpdated = await User.updateOne(
            {userId: session.user.id},
            {
                $pull: {canvasImages: {_id: id}},
            },
            {new: true},
        );
        if (!userUpdated) throw new Error('更新失敗');

        return {
            code: 200,
            message: '使用者更新成功',
        };
    } catch (error) {
        console.error('移除圖片失敗:', error);
        throw error instanceof Error ? error : new Error('移除圖片失敗');
    }
}
