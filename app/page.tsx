'use client'
import { ChangeEvent, FC, FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { useDebounce } from '../hooks/useDebounce'
import { ToolModeEnum , ActionEnum } from '../enums/draw'
import { RoughGenerator } from 'roughjs/bin/generator'
import { RoughCanvas } from 'roughjs/bin/canvas'
import { Drawable } from 'roughjs/bin/core'

const generator = new RoughGenerator()

interface DrawElement {
    id: number
    x1:number
    y1:number
    x2:number
    y2:number
    roughElement: Drawable
    type: ToolModeEnum
}

interface PositionXY{
    x: number
    y: number
}


const createDrawElement = (id:number , x1:number , y1:number , x2:number , y2:number , mode: ToolModeEnum): DrawElement=>{
    if (mode === ToolModeEnum.line ) return { id , x1 , y1 , x2 , y2 , type: mode , roughElement: generator.line( x1,y1,x2,y2)}

    // if (mode === DrawModeEnum.rectangle) 
    return { id,  x1 , y1 , x2 , y2  , type: mode , roughElement: generator.rectangle( x1,y1, x2-x1 ,y2-y1)}
}

const distance = ( pointA:PositionXY , pointB:PositionXY):number =>{
    return Math.sqrt( Math.pow(pointA.x - pointB.x , 2) + Math.pow(pointA.y - pointB.y , 2))
}

const isWithinElement = (x:number , y:number , element:DrawElement): boolean =>{
    const { type , x1 , x2 , y1 ,y2 } = element
    if (type === ToolModeEnum.rectangle) {
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const manY = Math.max(y1, y2)
        return x >= minX && x <= maxX && y >= minY && y <= manY
    } else {
        // line
        const a = {x:x1, y:y1}
        const b = {x:x2, y:y2}
        const c = {x, y}
        const offset = distance(a ,b) - (distance(a,c) + distance(b, c))
        return Math.abs(offset) < 1
    }
}

// 以上可以拆分不同的檔案

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [loaded , setLoaded] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [elements,setElements] = useState<DrawElement[]>([])
    const [action,setAction] = useState<ActionEnum>(ActionEnum.none)

    const [tool , setTool] = useState<ToolModeEnum>(ToolModeEnum.line)

    const computePointInCanvas = (e: MouseEvent ): {x:number , y:number} | undefined => {
        const canvas = canvasRef.current
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
    
        return { x, y }
    }



    const getElementAtPosition = (x:number , y:number ,elements:DrawElement[]) =>{
        return elements.find(element => isWithinElement( x , y , element))
    }

    const handlerMouseDown =(e:MouseEvent)=>{
        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        const {x: clientX , y:clientY } = currentCursorPosition
        

        if ( tool === ToolModeEnum.selector ){
            const element = getElementAtPosition(clientX , clientY , elements)
            if (element) {
                setAction(ActionEnum.moving)
            }
        } else {
            const id = elements.length - 1
            const defaultElement = createDrawElement( id ,clientX , clientY , clientX ,clientY , tool)
            // 先建立default , 當滑鼠移動時, 再將此element 進行update
            setElements(pre => [...pre ,defaultElement ])
            setAction(ActionEnum.drawing)
        }

    }

    const handlerMouseMove =(e:MouseEvent)=>{
        if (tool === ToolModeEnum.selector) {
            //moving element
        } else {

            if ( action !== ActionEnum.drawing) return;
            // 取得目前滑鼠移動的位置
            const currentCursorPosition = computePointInCanvas(e)
            if (!currentCursorPosition) return
            // 目前移動的位置
            const { x: x2, y:y2} = currentCursorPosition
            if ( x2 <=0 || y2 <= 0) {
                setAction(ActionEnum.none)
                return
            }

            // // 剛剛mouseDown產生的 element
            const getElementIdx = elements.length -1
            // 將default element x1 , y1 位置取出
            const { id ,x1 , y1} = elements[getElementIdx]
    
            const updatedElement = createDrawElement( id ,x1 , y1 ,x2 ,y2  , tool)
            setElements( pre => {
                const copy = [...pre]
                copy[getElementIdx] = updatedElement
                return copy
            })
        }

    }

    const handlerMouseUp =(e:MouseEvent)=>{
        setAction(ActionEnum.none)
    }

    useEffect(()=>{
        setLoaded(window && true)
    },[])

    useEffect(()=>{
        if (!canvasRef.current) return;

        const ctx = (canvasRef?.current as HTMLCanvasElement).getContext("2d")
        if (!ctx) return;
        ctx.clearRect(0 , 0 ,750 , 750)

        const roughCanvas  = new RoughCanvas(canvasRef.current as HTMLCanvasElement);
        // 當elements 更新, 畫面就需要更新
        elements.forEach(el => roughCanvas.draw(el.roughElement))

    },[canvasRef , loaded , elements])


    return (
        <div  className='w-screen h-screen bg-white flex justify-center items-start p-5 flex-wrap'>
            <div className='top-4 left-4 fixed  border border-black bg-amber-200 gap-4'>
                <label className='p-4'>
                    draw line
                    <input type="radio" 
                        checked={tool === ToolModeEnum.line}
                        onChange={()=>{  setTool(ToolModeEnum.line)}}/>
                </label>
                <label className='p-4'>
                    draw rectangle
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.rectangle} 
                        onChange={()=>{ setTool(ToolModeEnum.rectangle)}}/>
                </label>
                <label className='p-4'>
                    selector
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.selector} 
                        onChange={()=>{ setTool(ToolModeEnum.selector)}}/>
                </label>
            </div>
            <div>
                {loaded &&<canvas
                    width={ 750}
                    height={ 750}
                    className=' border border-black'
                    ref={canvasRef}
                    onMouseDown={handlerMouseDown}
                    onMouseMove={handlerMouseMove}
                    onMouseUp={handlerMouseUp}
                    ></canvas>}
            </div>
        </div>

    )
}

export default Page
