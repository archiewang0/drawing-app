// import {ref, deleteObject} from 'firebase/storage';
// import {firebaseStorage} from '@/lib/firebase';

// export async function deleteStorageImg(url: string, name?: string) {
//     let filename = name ? `${name}.jpeg` : url.split('%2F')[1].split('?')[0];
//     const desertRef = ref(firebaseStorage, 'canvas/' + filename);
//     return deleteObject(desertRef)
//         .then(() => {
//             return {
//                 code: 200,
//                 message: 'firebase storage 刪除成功',
//             };
//         })
//         .catch((error) => {
//             throw new Error(`發生錯誤: ${error}`);
//         });
// }

export {};
