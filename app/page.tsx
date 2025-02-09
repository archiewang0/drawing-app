'use client'
import { ChangeEvent, FC, FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { useDebounce } from '../hooks/useDebounce'
import { DrawModeEnum } from '../enums/draw'
import { RoughGenerator } from 'roughjs/bin/generator'
import { RoughCanvas } from 'roughjs/bin/canvas'

const generator = new RoughGenerator()

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [loaded , setLoaded] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [elements,setElements] = useState()
    const [drawing,setDrawing] = useState(false)

    const handlerMouseDown =(e:MouseEvent)=>{}
    const handlerMouseMove =(e:MouseEvent)=>{}
    const handlerMouseUp =(e:MouseEvent)=>{}

    useEffect(()=>{
        setLoaded(window && true)

    },[])

    useEffect(()=>{
        if (!canvasRef.current) return;

        const ctx = (canvasRef?.current as HTMLCanvasElement).getContext("2d")
        const roughCanvas  = new RoughCanvas(canvasRef.current as HTMLCanvasElement);
        const rect = generator.rectangle( 10 , 10 , 100 ,100)
        const line = generator.line(10 ,10 ,110, 110)

        roughCanvas.draw(rect)
        roughCanvas.draw(line)

    },[canvasRef , loaded])

    return (
        <div className='w-screen h-screen bg-white flex justify-center items-center p-5 '>
            {loaded &&<canvas
                width={ window.innerWidth / 1.05}
                height={ window.innerHeight / 1.05}
                className=' border border-black'
                ref={canvasRef}
                onMouseDown={handlerMouseDown}
                onMouseMove={handlerMouseMove}
                onMouseUp={handlerMouseUp}
                ></canvas>}
        </div>
    )
}

export default Page
