'use client'
import { ChangeEvent, FC, FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { useDebounce } from '../hooks/useDebounce'
import { ToolModeEnum , ActionEnum , ElementPositionEnum ,CursorStyleEnum } from '../enums/draw'
import { RoughGenerator } from 'roughjs/bin/generator'
import { RoughCanvas } from 'roughjs/bin/canvas'
import { Drawable } from 'roughjs/bin/core'
import { createDrawElement , positionWithinElement , cursorForPosition , resizeCoordinates } from '../utils/draw'
import { useHistory } from '../hooks/useHistory'


interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [loaded , setLoaded] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // const [elements,setElements] = useState<DrawElement[]>([])
    const [elements , setElements , undo , redo] = useHistory<DrawElement[]>([])

    const [action,setAction] = useState<ActionEnum>(ActionEnum.none)

    const [tool , setTool] = useState<ToolModeEnum>(ToolModeEnum.line)
    const [selectedElement , setSelectedElement] = useState<SelectedDrawElement|null>(null)


    const computePointInCanvas = (e: MouseEvent ): {x:number , y:number} | undefined => {
        const canvas = canvasRef.current
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
    
        return { x, y }
    }


    const getElementAtPosition = (curX: number, curY: number, elements: DrawElement[]): SelectedDrawElement | undefined => {
        return elements
            .map(element => {
                const position = positionWithinElement(curX, curY, element);
                return { ...element, position , offsetX: curX - element.x1,offsetY: curY - element.y1};
            })
            .find(element => element.position);
    };

    const updateElement = (id:number , x1:number , y1:number , x2:number , y2: number ,type:ToolModeEnum) =>{
        const updatedElement = createDrawElement( id ,x1 , y1 ,x2 ,y2  , type)
        const copyElements = [...elements]
        copyElements[id] = updatedElement
        setElements(copyElements , true)
    }

    const adjectElementCoordinates = (element: DrawElement): PositionXYXY => {
        const {type , x1 , y1 , x2 ,y2} = element
        if (type === ToolModeEnum.rectangle) {
            const minX = Math.min(x1,x2)
            const maxX = Math.max(x1,x2)
            const minY = Math.min(y1,y2)
            const maxY = Math.max(y1,y2)
            return { x1: minX , y1:minY ,x2:maxX , y2:maxY }
        } else {
            if(x1 < x2 || (x1 === x2 && y1 < y2) ) return {x1 ,y1 ,x2 ,y2}
            else return {x1: x2 , y1: y2 , x2: x1, y2: y1}
        }
    }

    const handlerMouseDown =(e:MouseEvent)=>{
        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        const {x: clientX , y:clientY } = currentCursorPosition

        if ( tool === ToolModeEnum.selector ){
            // 找到有position得element
            const element = getElementAtPosition(clientX , clientY , elements)
            if (element) {
                setSelectedElement({...element })
                setElements(pre => pre)

                if (element.position === ElementPositionEnum.inside) {
                    setAction(ActionEnum.moving)
                } else {
                    // ElementPositionEnum.tl , ElementPositionEnum.tr , ElementPositionEnum.bl , ElementPositionEnum.br , ElementPositionEnum.start , ElementPositionEnum.end
                    setAction(ActionEnum.resize)
                }
            }
        } else {
            const id = elements.length
            const defaultElement = createDrawElement( id ,clientX , clientY , clientX ,clientY , tool)
            // 先建立default , 當滑鼠移動時, 再將此element 進行update
            setElements(pre => [...pre ,defaultElement ])
            
            // 進行畫圖 element 就成為selectedElement , offset offsetY position 都先帶入default值
            setSelectedElement({...defaultElement , offsetX: 0 , offsetY: 0 , position: null})
            setAction(ActionEnum.drawing)
        }

    }

    const handlerMouseMove =(e:MouseEvent)=>{
        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        const { x: clientX, y:clientY} = currentCursorPosition
        // 取得目前滑鼠移動的位置


        // cursor 變化
        if (tool === ToolModeEnum.selector) {
            const element = getElementAtPosition(clientX , clientY , elements);
            (e.target as HTMLCanvasElement).style.cursor = element ? cursorForPosition(element.position!) : CursorStyleEnum.default
        }


        if (action === ActionEnum.drawing) {
            // 目前移動的位置
            // const { x: x2, y:y2} = currentCursorPosition
            if ( clientX <=0 || clientY <= 0) {
                setAction(ActionEnum.none)
                return
            }
            // 剛剛mouseDown產生的 element
            const getElementIdx = elements.length -1
            // 將default element x1 , y1 位置取出
            const { id ,x1 , y1} = elements[getElementIdx]
            updateElement(id , x1,y1,clientX,clientY, tool)
        } else if (action === ActionEnum.moving) {
            if ( !selectedElement ) return;
            const {id, x1,y1,x2,y2 , type , offsetX , offsetY} = selectedElement
            const elementWidth = x2- x1
            const elementHight = y2 - y1
            const newX1 = clientX - offsetX
            const newY1 = clientY - offsetY
            updateElement(id , newX1, newY1 ,newX1 + elementWidth, newY1 + elementHight, type)
        } else if (action === ActionEnum.resize) {
            if (!selectedElement) return;
            const { id , type , position , ...coordinates } = selectedElement
            const resizeResult = resizeCoordinates( clientX ,clientY , position! ,coordinates)
            if (!resizeResult) return;
            const {x1 , y1 , x2 , y2} = resizeResult
            updateElement(id , x1 , y1 , x2 , y2 , type)

        }
    }

    const handlerMouseUp =(e:MouseEvent)=>{
        if ( selectedElement ) {
            const lastIdx = selectedElement?.id
            const { id , type } = elements[lastIdx]
            if (action === ActionEnum.drawing || action === ActionEnum.resize) {
                const { x1 , y1 , x2 , y2 } = adjectElementCoordinates(elements[lastIdx])
                // console.log('檢查調整過的xy: ' , {x1,y1,x2,y2})
                updateElement(id , x1 ,y1 , x2, y2 ,type)
            }
        }
        setAction(ActionEnum.none)
        setSelectedElement(null)
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

        const undoRedoHandler = (e: KeyboardEvent) =>{
            if ( (e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) redo()
                else undo()
            }
        }

        window.addEventListener('keydown' , undoRedoHandler)
        return ()=> window.removeEventListener('keydown' , undoRedoHandler)
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
                <button onClick={undo} className='border-x border-black p-2 mr-1'>undo</button>
                <button onClick={redo} className='border-x border-black p-2'>redo</button>
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
