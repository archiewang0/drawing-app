
import { Metadata } from "next"
import Profile from "./profile"


export const metadata: Metadata = {
    title: "會議室預約系統",
    description: "簡單好用的會議室預約系統",
};

export default function ProfilePage() {

    return (
        <Profile/>
    )
}

