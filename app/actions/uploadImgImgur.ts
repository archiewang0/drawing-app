import {NextResponse} from 'next/server';

interface ImgurUploadResponse {
    status: number; // 回應狀態碼，例：200
    success: boolean; // 上傳是否成功
    data: ImgurImageData; // 圖片相關資料
}

interface ImgurImageData {
    id: string; // 圖片的唯一 ID
    deletehash: string; // 用於刪除圖片的 hash
    account_id: number | null; // 使用者帳號 ID（若未登入則為 null）
    account_url: string | null; // 使用者帳號名稱（若未登入則為 null）
    ad_type: number | null; // 廣告類型（若無則為 null）
    ad_url: string | null; // 廣告網址（若無則為 null）
    title: string; // 圖片標題
    description: string; // 圖片描述
    name: string; // 上傳時的檔案名稱
    type: string; // 檔案類型（如 image/png）
    width: number; // 圖片寬度（px）
    height: number; // 圖片高度（px）
    size: number; // 檔案大小（bytes）
    views: number; // 檢視次數
    section: string | null; // 所屬分類（若無則為 null）
    vote: string | null; // 使用者對圖片的評分（若無則為 null）
    bandwidth: number; // 使用頻寬（bytes）
    animated: boolean; // 是否為動畫圖片
    favorite: boolean; // 是否被收藏
    in_gallery: boolean; // 是否在圖庫中
    in_most_viral: boolean; // 是否為熱門圖片
    has_sound: boolean; // 是否有聲音
    is_ad: boolean; // 是否為廣告
    nsfw: boolean | null; // 是否為限制級（NSFW）
    link: string; // 圖片連結
    tags: string[]; // 標籤陣列
    datetime: number; // 上傳時間（Unix timestamp）
    mp4: string; // 動畫影片格式（若無則為空字串）
    hls: string; // 串流格式（若無則為空字串）
}

// 刷新 Imgur Token
// accesstoken 與 freshtoken 都具有時效性
// 打出api也會需要token , 也不可能一直替換 env 變數
// 所以這裡遇到token過期, 會取得新的病寫回 process.env. 去
async function refreshImgurToken() {
    const clientId = process.env.IMGUR_CLIENT_ID;
    const clientSecret = process.env.IMGUR_CLIENT_SECRET;
    const refreshToken = process.env.IMGUR_REFRESH_TOKEN;

    const bodyParams = new URLSearchParams({
        refresh_token: refreshToken || '', // 使用空字符串以避免 undefined
        client_id: clientId || '',
        client_secret: clientSecret || '',
        grant_type: 'refresh_token',
    });

    const response = await fetch('https://api.imgur.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams,
    });

    const data = await response.json();

    if (data.access_token) {
        process.env.IMGUR_ACCESS_TOKEN = data.access_token;
        if (data.refresh_token) {
            process.env.IMGUR_REFRESH_TOKEN = data.refresh_token;
        }
        console.log('Access token refreshed successfully');
    } else {
        console.error('Failed to refresh access token', data);
        throw new Error('Failed to refresh access token');
    }
}

// 上傳圖片至 Imgur
// async function uploadToImgur(imageBase64: string, accessToken: string, albumId: string) {
export async function uploadToImgur(imageBase64: string): Promise<ImgurUploadResponse> {
    const uploadImg = async (token: string) => {
        return await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                image: imageBase64,
                type: 'base64',
            }),
        });
    };

    let accessToken = process.env.IMGUR_ACCESS_TOKEN as string;

    if (!accessToken) {
        throw new Error('Imgur access token is not configured');
        // return NextResponse.json({error: 'Imgur access token is not configured'}, {status: 500});
    }
    let response = await uploadImg(accessToken);
    let imgurResponse = await response.json();

    // 如果 Token 過期，嘗試刷新 Token 並重新上傳
    if (imgurResponse.status === 403 && imgurResponse.data?.error === 'invalid_token') {
        console.warn('Access token expired, refreshing...');
        await refreshImgurToken();

        // 使用新的 access_token 再次嘗試上傳
        const newAccessToken = process.env.IMGUR_ACCESS_TOKEN as string;
        response = await uploadImg(newAccessToken);
        imgurResponse = await response.json();
    }

    return imgurResponse;
}
