import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {firebaseStorage} from '@/lib/firebase';
import {UUID} from 'mongodb';

// const storage = getStorage();
export async function uploadImageFileToStorage(filename: string, file: Blob | null) {
    try {
        if (!file || file instanceof Blob === false) throw new Error('Invalid file');

        // build a reference to the file we want to upload
        const storageRef = ref(firebaseStorage, 'canvas/' + (filename ? filename : new UUID().toString()) + '.jpeg');

        // upload file to Cloud Storage
        const snapshot = await uploadBytes(storageRef, file);
        console.log('檔案上傳成功');

        // get the file URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('檔案可在此下載：', downloadURL);

        console.log('檔案資訊已儲存至 Firestore，文件 ID：', downloadURL);
        return {code: 200, data: downloadURL};
    } catch (error) {
        console.error('上傳檔案時發生錯誤：', error);
        return {code: 500, message: error};
    }
}
