import {PlusCircleIcon} from 'lucide-react';
import Link from 'next/link';

function AddCanvas() {
    return (
        <Link
            href="/"
            className=" inline-flex justify-center items-center border w-1/6 h-52 border-gray-200 shadow-md rounded-md">
            <PlusCircleIcon color="#dbdbdb" />
        </Link>
    );
}

export default AddCanvas;
