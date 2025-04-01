import { FC , MouseEvent , type RefObject } from "react"
import DrawingComponent from "./drawing"
import { Button , buttonVariants } from "@/components/ui/button"
interface DrawingPageProps {
}

export const DrawingPage: FC<DrawingPageProps>  = () => {
    buttonVariants
    return (
        <div>
            <div className=" mb-3 flex items-center">
                <h1 className=" mr-5 font-bold text-2xl">未命名</h1>
                <Button className={buttonVariants({variant: "outline"})} >Save Canvas</Button>
            </div>
            <DrawingComponent/>
        </div>
    )
}

