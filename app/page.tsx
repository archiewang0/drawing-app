import {FC} from 'react';
import DrawingComponent from '@/components/page/drawing/drawing';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <DrawingComponent />
        </div>
    );
};

export default Page;
