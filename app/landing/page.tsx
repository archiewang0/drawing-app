
import { Metadata } from "next"
import Image from "next/image";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

export const metadata: Metadata = {
    title: "drawing app",
    description: "簡單好玩的畫圖網頁",
};

export default function ProfilePage() {

    return (
        <div className=" flex justify-center items-center  h-[calc(100vh-4rem)]">
            <Image src="/drawingdog.jpeg" alt='drawing dog' width={600} height={600} />
            <div>
                <p>Hi !!</p>
                <p>I'm drawing dog. </p>
                <p>Click the button to start drawing.</p>
                <Link className="flex items-center font-bold" href="/">Drawing now!  &nbsp;  <ArrowBigRight/></Link>
            </div>
        </div>
    )
}

