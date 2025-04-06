'use server';
import {uploadToImgur} from './uploadImgImgur';
import {finduser} from './finduser';
import {register} from './register';
import User from '@/models/user';
// const storage = getStorage();
export async function uploadImg({userId, filename, imgBase64url, name, email}: {userId: string; filename: string; imgBase64url: string; name: string; email: string}) {
    try {
        const storageRes = await uploadToImgur(imgBase64url);
        console.log('storageRes: ', storageRes);
        if (storageRes.status !== 200) throw new Error('上傳檔案時發生錯誤：' + storageRes.status);

        const uploadurl = storageRes.data.link;

        const user = await finduser({userId: userId});

        if (user?.error) {
            // 找不到使用者 新建立user資料
            const userRegistered = await register({
                userId,
                name,
                email,
                canvasImages: [
                    {
                        name: filename,
                        imageUrl: uploadurl,
                    },
                ],
            });

            return {
                code: 200,
                message: '使用者註冊成功',
                data: userRegistered,
            };
        }

        if (!user) throw new Error('使用者不存在');
        // 更新預約狀態
        const userUpdated = await User.findByIdAndUpdate(
            user.id,
            {
                $push: {canvasImages: {name: filename, imageUrl: uploadurl}},
                updatedAt: new Date(),
            },
            {new: true},
        );

        if (!userUpdated) {
            throw new Error('更新失敗');
        }

        return {
            code: 200,
            message: '使用者更新成功',
            data: {
                id: userUpdated._id.toString(),
                name: userUpdated.name,
                email: userUpdated.email,
                userId: userUpdated.userId,
                canvasImages: userUpdated.canvasImages.map((i) => ({
                    _id: i._id.toString(),
                    name: i.name,
                    imageUrl: i.imageUrl,
                    createdAt: i.createdAt?.toISOString(),
                })),
                createdAt: userUpdated.createdAt?.toISOString(),
                updatedAt: userUpdated.updatedAt?.toISOString(),
            },
        };
    } catch (error) {
        console.error('上傳檔案時發生錯誤：', error);
        return {code: 500, message: error};
    }
}
