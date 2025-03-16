
import { FC } from 'react'
import DrawingComponent from '../components/page/drawing/drawing'
// import DrawingApp from '@/components/page/drawing/drawing-ui'

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    return  <div className="container mx-auto px-4 py-8">
        <DrawingComponent/>
        {/* <DrawingApp/> */}
    </div>
}

export default Page
