import { useEffect, useRef, useState } from 'react'
import { DrawModeEnum } from '../enums/draw'

export const useDraw = (
  drawMode: DrawModeEnum,
  onDrawLine: ({ ctx, currentPoint, prevPoint , startPoint }: Draw) => void , 
  onDrawRect: ({ ctx, currentPoint, prevPoint , startPoint , isDrawing }: DrawRect) => void
  ) => {
  const [mouseDown, setMouseDown] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)
  const startPoint = useRef<null | Point>(null)

  const tempCanvasRef = useRef<HTMLCanvasElement>(null) // 新增暫存 canvas


  const computePointInCanvas = (e: MouseEvent ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    return { x, y }
  }

  // MouseDown 是由 canvas 監聽, 所以要把控制 function 帶給外面 parent
  const onMouseDown = (e: MouseEvent) => {
    setMouseDown(true)
    const point = computePointInCanvas(e)
    if (point) {
      startPoint.current = point // 記錄起始點
    } 
  } 

  // const onMouseUpHanlder = ( func:()=>void ) =>{
  //   func()
  // }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const tempCanvas = tempCanvasRef.current
    if (!tempCanvas) return


    const handler = (e: MouseEvent ) => {
      if (!mouseDown) return
      const currentPoint = computePointInCanvas(e)
      const ctx = canvasRef.current?.getContext('2d')
      // 先檢查有沒有 ctx 是否存在, currentPoint 也是否存在
      if (!ctx || !currentPoint) return

      // 再將參數 帶入 function params
      switch (drawMode)  {
        case DrawModeEnum.line:
          onDrawLine({ 
            ctx, 
            currentPoint, 
            prevPoint: prevPoint.current ,
            startPoint: startPoint.current , 
          })
          break;
        case DrawModeEnum.rectangle:

          onDrawRect({
            ctx, 
            currentPoint, 
            prevPoint: prevPoint.current ,
            startPoint: startPoint.current , 
            isDrawing: true
          })
          break;
      }
  
      prevPoint.current = currentPoint
    }

    const mouseUpHandler = () => {
      const canvas = canvasRef.current
      if (!canvas || !startPoint.current) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if(drawMode === DrawModeEnum.rectangle) {
        onDrawRect({
          ctx, 
          currentPoint: prevPoint.current!, 
          prevPoint: prevPoint.current ,
          startPoint: startPoint.current , 
          isDrawing: false
        })
      }

      setMouseDown(false)
      prevPoint.current = null
      startPoint.current = null
    }

    // 暫存canvas 設置跟 canvas 一樣
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    tempCanvas.style.position = 'absolute'
    tempCanvas.style.pointerEvents = 'none'
    tempCanvas.style.top = '0px'
    tempCanvas.style.left = '0px'
    canvas.parentElement?.appendChild(tempCanvas)

    // Add event listeners
    canvasRef.current?.addEventListener('mousemove', handler)
    window.addEventListener('mouseup', mouseUpHandler)

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', mouseUpHandler)
      tempCanvas.remove()
    }
  }, [onDrawLine , onDrawRect , drawMode])

  return { canvasRef , tempCanvasRef , onMouseDown  , clear }
}
