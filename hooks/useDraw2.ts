import { useEffect, useRef } from "react";

export const useDraw2 = (
    onDraw: (({ctxPara , currentPointPara , prevPointPara}:Draw2) => void)
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{

    
        const mousemoveHandler = (e: MouseEvent)=>{
            // 滑鼠位置是從 瀏覽器的最左上角開始計算 , 需要在計算出"滑鼠在canvas中的位置"
            console.log(
                computedPointInCanvas(e) 
            )
            const currentPoint = computedPointInCanvas(e) 
            const ctx = canvasRef.current?.getContext('2d')
            if (!ctx || currentPoint ) return
        }

        // 
        const computedPointInCanvas = (e: MouseEvent)=>{
            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return { x , y}
        }

        canvasRef.current?.addEventListener('mousemove',mousemoveHandler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return ()=> canvasRef.current?.removeEventListener('mousemove',mousemoveHandler)
    }, [])



    return { canvasRef }
}