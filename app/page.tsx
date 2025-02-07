'use client'
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { useDraw2 } from '../hooks/useDraw2'
import { ChromePicker } from 'react-color'
import { useDebounce } from '../hooks/useDebounce'


interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const [ isClient , setIsClient] = useState(false)
  const [color, setColor] = useState('#000')
  const [size , setSize] = useState(5)
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine)
//   const {canvasRef} = useDraw(drawLine)

  function drawLine({ ctx ,prevPoint, currentPoint }: Draw) {
    // console.log(size)
    const { x: currX, y: currY } = currentPoint
    const lineColor = color
    const lineWidth = size
    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    console.log(ctx.lineWidth)
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()
  }

  useEffect(()=>{
    setIsClient(true) 
  }, [])

    const inputHanlder =(e:FormEvent)=>{
        const el = e.target as HTMLInputElement
        if ( typeof Number(el.value) !== 'number') return
        setSize( Number(el.value))
    }

    const debouncedInput = useDebounce(inputHanlder , 500)


  return (
    <div
        className='w-screen h-screen bg-white flex justify-center items-center'>

    <div className='border border-black'>
        <input type="number" defaultValue={size} onInput={(e)=>debouncedInput(e)} />
        <span>比刷尺寸: {size}</span>
    </div>

    <div className='flex flex-col gap-10 pr-10'>
        {isClient && <ChromePicker color={color} onChange={(e) => setColor(e.hex)} /> } 
        <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
            Clear canvas
        </button> 
    </div>
        <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            width={750}
            height={750}
            className='border border-black rounded-md'
        /> 

        {/* <canvas ref={canvasRef} width={750} height={750} className='border border-red-700 rounded-lg'></canvas> */}
    </div>
  )
}

export default Page
