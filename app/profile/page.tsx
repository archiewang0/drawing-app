import {Metadata} from 'next';
import Profile from './profile';

export const metadata: Metadata = {
    title: '繪圖app',
    description: '簡單繪畫工具',
};

export default function ProfilePage() {
    return <Profile />;
}
