
import { FC } from 'react'
import DrawingComponent from '../components/page/drawing/drawing'
// import DrawingApp from '@/components/page/drawing/drawing-ui'

interface pageProps {}

console.log('process.env.TEST', process.env.TEST)
console.log('process.env.NEXT_PUBLIC_TEST', process.env.NEXT_PUBLIC_TEST)
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
const Page: FC<pageProps> = ({}) => {
    return  <div className="container mx-auto px-4 py-8">
        <DrawingComponent/>
        {/* <DrawingApp/> */}
    </div>
}

export default Page
