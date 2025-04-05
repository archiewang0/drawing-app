import {ref, deleteObject} from 'firebase/storage';
import {firebaseStorage} from '@/lib/firebase';

export async function deleteStorageImg(url: string, name?: string) {
    // encode the url to base64
    // console.log(url.split('%2F')[1].split('?')[0]);
    // console.log
    let filename = name ? `${name}.jpeg` : url.split('%2F')[1].split('?')[0];
    console.log('filename chekc: ', filename);
    const desertRef = ref(firebaseStorage, 'canvas/' + filename);
    // Delete the file
    return deleteObject(desertRef)
        .then(() => {
            // File deleted successfully
            return {
                code: 200,
                message: 'firebase storage 刪除成功',
            };
        })
        .catch((error) => {
            // Uh-oh, an error occurred!
            throw new Error(`發生錯誤: ${error}`);
        });
}
