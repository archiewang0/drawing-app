
import { FC } from 'react'
// import DrawingComponent from '../components/page/drawing/drawing'
import { DrawingPage } from '@/components/page/drawing/drawingPage'

interface pageProps {}

console.log('process.env.TEST', process.env.TEST)
console.log('process.env.NEXT_PUBLIC_TEST', process.env.NEXT_PUBLIC_TEST)
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
console.log('process.env.AUTH_GOOGLE_ID: ' , process.env.AUTH_GOOGLE_ID)
console.log('process.env.AUTH_GOOGLE_SECRET: ' , process.env.AUTH_GOOGLE_SECRET)

const Page: FC<pageProps> = ({}) => {
    return  <div className="container mx-auto px-4 py-8">
        <DrawingPage/>
        {/* <DrawingApp/> */}
    </div>
}

export default Page
