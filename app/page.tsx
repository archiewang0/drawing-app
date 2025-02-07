'use client'
import { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { useDraw2 } from '../hooks/useDraw2'
import { ChromePicker } from 'react-color'

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const [ isClient , setIsClient] = useState(false)
  const [color, setColor] = useState('#000')
  // const { canvasRef, onMouseDown, clear } = useDraw(drawLine)
  const {canvasRef} = useDraw(drawLine)

  function drawLine({ ctx ,prevPoint, currentPoint }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = color
    const lineWidth = 5
    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  useEffect(()=>{
    setIsClient(true) 
  }, [])

  return (
    <div
      className='w-screen h-screen bg-white flex justify-center items-center'>

      <div className='flex flex-col gap-10 pr-10'>
        {isClient && <ChromePicker color={color} onChange={(e) => setColor(e.hex)} /> } 
        {/* <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
          Clear canvas
        </button> */}
      </div>
      {/* <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className='border border-black rounded-md'
      /> */}

      <canvas ref={canvasRef} width={750} height={750} className='border border-red-700 rounded-lg'></canvas>
    </div>
  )
}

export default Page
