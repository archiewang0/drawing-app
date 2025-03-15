'use client'
import { ChangeEvent, FC, FocusEvent , FormEvent, MouseEvent, useCallback, useEffect , useRef, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { useDebounce } from '../hooks/useDebounce'
import { RoughGenerator } from 'roughjs/bin/generator'
import { Drawable } from 'roughjs/bin/core'
import { RoughCanvas } from 'roughjs/bin/canvas'
import { ToolModeEnum , ActionEnum , ElementPositionEnum ,CursorStyleEnum } from '../enums/draw'
import { createElement , positionWithinElement , cursorForPosition , resizedCoordinates , drawElement , adjustmentRequired , getElementAtPosition , adjustElementCoordinates } from '../utils/draw'
import { useHistory } from '../hooks/useHistory'
import { usePressedKeys } from '../hooks/usePressedKeys'


interface pageProps {}

const Page: FC<pageProps> = ({}) => {
    const [elements , setElements , undo , redo] = useHistory<DrawElement[]>([])
    const [action,setAction] = useState<ActionEnum>(ActionEnum.none)
    const [tool , setTool] = useState<ToolModeEnum>(ToolModeEnum.line)
    const [selectedElement , setSelectedElement] = useState<SelectedDrawElement|null>(null)
    const [loaded , setLoaded] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const canvasTop = canvasRef.current ? canvasRef.current.getBoundingClientRect().top : null
    const canvasLeft = canvasRef.current ? canvasRef.current.getBoundingClientRect().left : null

    const [panOffset , setPanOffset] = useState({ x: 50 , y: 50 })
    const [startPanMousePosition , setStartPanMousePosition] = useState({x: 0 , y: 0})

    const pressedKeys = usePressedKeys();

    const [scale , setScale] = useState<number>(1)
    const [scaleOffset , setScaleOffset ] = useState<PositionXY>({x: 0 , y:0})


    useEffect(()=>{
        if (!canvasRef.current) return;
        const ctx = (canvasRef?.current as HTMLCanvasElement).getContext("2d")
        if (!ctx) return;
        ctx.clearRect(0 , 0 ,750 , 750)
        
        const scaledWidth = canvasRef.current.width * scale
        const scaledHeight = canvasRef.current.height * scale

        const scaleOffsetX = (scaledWidth - canvasRef.current.width) / 2
        const scaleOffsetY = (scaledHeight - canvasRef.current.height) / 2

        setScaleOffset({x: scaleOffsetX , y: scaleOffsetY})

        ctx.save()
        ctx.translate(panOffset.x * scale -scaleOffsetX , panOffset.y * scale - scaleOffsetY)

        ctx.fillRect(100 , 100, 100 , 100)
        ctx.scale(scale,scale)
        ctx.fillRect(100 , 300, 100 , 100)
        
        const roughCanvas  = new RoughCanvas(canvasRef.current as HTMLCanvasElement);
        elements.forEach(el => { 
            if (action === ActionEnum.writing && selectedElement?.id === el.id) return;
            drawElement(roughCanvas , ctx , el) 
        })
        ctx.restore()
    },[ canvasRef , loaded , elements , action , panOffset , scale ])

    useEffect(()=>{
        const undoRedoHandler = (e: KeyboardEvent) =>{
            if ( (e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (e.shiftKey) redo()
                else undo()
            }
        }
        window.addEventListener('keydown' , undoRedoHandler)
        return ()=> window.removeEventListener('keydown' , undoRedoHandler)
    }, [ loaded ,undo ,redo])


    useEffect(()=>{
        const canvas = canvasRef.current as HTMLCanvasElement;
        if( !canvasRef.current ) return
        const panOrZoomFunction = (e: WheelEvent) =>{
            console.log('test ' , pressedKeys)

            if(pressedKeys.has("Meta") || pressedKeys.has("Control")) { 

                onZoom(e.deltaY * -0.01)
            } else {
                setPanOffset(pre=>({
                    x: pre.x - e.deltaX ,
                    y: pre.y - e.deltaY
                })) 
            }
        }
        canvas.addEventListener("wheel", panOrZoomFunction)
        return ()=> canvas.removeEventListener('wheel' , panOrZoomFunction)
    }, [ canvasRef , canvasRef.current , pressedKeys])

    useEffect(()=>{
        const textArea = textAreaRef.current
        if (!textArea) return;
        if (action === ActionEnum.writing &&  selectedElement){ 
            new Promise(resolve => setTimeout(resolve ,0)
            ).then(()=>{  
                textArea.focus()
                textArea.value = selectedElement.text
            })
        }
    }, [action , selectedElement])

    useEffect(()=>{
        setLoaded(window && true)
    },[])

    const getMouseCoordinates = ( data: {x: number , y:number}) => {
        const clientX = (data.x - panOffset.x * scale + scaleOffset.x)/scale;
        const clientY = (data.y - panOffset.y * scale + scaleOffset.y)/scale;
        
        return {clientX ,clientY}
    }

    const computePointInCanvas = (e: MouseEvent ): {x:number , y:number} | undefined => {
        const canvas = canvasRef.current
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
    
        return { x, y }
    }

    const updateElement = (id:number , x1:number , y1:number , x2:number , y2: number ,type:ToolModeEnum , option?: {text: string}) =>{
        const elementsCopy = [...elements]
        switch (type) {
            case ToolModeEnum.line:
            case ToolModeEnum.rectangle:
                elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
                break;
            case ToolModeEnum.pencil:
                elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
                break;
            case ToolModeEnum.text:
                const canvasElement = canvasRef.current as HTMLCanvasElement
                if ( !option ) return
                const textWidth = canvasElement.getContext("2d")?.measureText(option.text).width
                const textHight = 24
                if ( !textWidth ) return 
                elementsCopy[id] = {
                    ...createElement( id, x1, y1 , x1+textWidth , y1 + textHight , type ),
                    text: option.text
                }
                // elementsCopy[id].text = option?.text || ""
                break;
        }   
        setElements(elementsCopy , true)
    }

    const handleMouseDown =(e:MouseEvent)=>{
        if(action === ActionEnum.writing) return;

        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        // const {x: clientX , y:clientY } = currentCursorPosition
        const { clientX , clientY } = getMouseCoordinates(currentCursorPosition)

        if (e.button === 1 || pressedKeys.has(" ")) {
            setAction(ActionEnum.panning);
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        }

        if ( tool === ToolModeEnum.selector ){
            // 找到有position得element
            const element = getElementAtPosition(clientX , clientY , elements)
            if (element) {
                if (element.type === ToolModeEnum.pencil) {
                    const xOffsets = element.points.map(point => clientX - point.x);
                    const yOffsets = element.points.map(point => clientY - point.y);
                    // 將鉛筆寫入 selectedElement
                    setSelectedElement({ ...element, xOffsets, yOffsets });
                } else {
                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;
                    setSelectedElement({ ...element, offsetX, offsetY });
                }
                if (element.position === ElementPositionEnum.inside) {
                    setAction(ActionEnum.moving)
                } else {
                    // ElementPositionEnum.tl , ElementPositionEnum.tr , ElementPositionEnum.bl , ElementPositionEnum.br , ElementPositionEnum.start , ElementPositionEnum.end
                    setAction(ActionEnum.resize)
                }
            }
        } else {
            const id = elements.length
            const defaultElement = createElement( id ,clientX , clientY , clientX ,clientY , tool)
            // 先建立default , 當滑鼠移動時, 再將此element 進行update
            setElements(pre => [...pre ,defaultElement ])
            
            // 進行畫圖 element 就成為selectedElement , offset offsetY position 都先帶入default值
            setSelectedElement({...defaultElement , offsetX: 0 , offsetY: 0  , xOffsets: [] , yOffsets: [], position: null})
            setAction( tool === ToolModeEnum.text ?  ActionEnum.writing :  ActionEnum.drawing)
        }
    }

    const handleMouseMove =(e:MouseEvent)=>{
        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        // const { x: clientX, y:clientY} = currentCursorPosition
        const { clientX , clientY } = getMouseCoordinates(currentCursorPosition)

        if (action === ActionEnum.panning) {
            const deltaX = clientX - startPanMousePosition.x;
            const deltaY = clientY - startPanMousePosition.y;
            setPanOffset({
                x: panOffset.x + deltaX,
                y: panOffset.y + deltaY,
            });
            return;
        }


        // cursor 變化
        if (tool === ToolModeEnum.selector) {
            const element = getElementAtPosition(clientX , clientY , elements);
            (e.target as HTMLCanvasElement).style.cursor = element ? cursorForPosition(element.position!) : CursorStyleEnum.default
        }

        if (action === ActionEnum.drawing) {
  
            // 剛剛mouseDown產生的 element
            const getElementIdx = elements.length -1
            // 將default element x1 , y1 位置取出
            const { id ,x1 , y1} = elements[getElementIdx]
            updateElement(id , x1,y1,clientX,clientY, tool)
        } else if (action === ActionEnum.moving) {
            if ( !selectedElement ) return;
            if (selectedElement.type ===  ToolModeEnum.pencil) {
                const newPoints = selectedElement.points.map((point, index) => {
                    return {
                        x: clientX - selectedElement.xOffsets[index],
                        y: clientY - selectedElement.yOffsets[index],
                    }
                })
                const elementsCopy = [...elements];
                elementsCopy[selectedElement.id].points = newPoints
                setElements(elementsCopy, true);
            } else {
                const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
                const width = x2 - x1;
                const height = y2 - y1;
                const newX1 = clientX - offsetX;
                const newY1 = clientY - offsetY;
                const options = type === ToolModeEnum.text ? {text: selectedElement.text} : undefined
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type , options);
            }
        } else if (action === ActionEnum.resize) {
            if (!selectedElement) return;
            const { id , type , position , ...coordinates } = selectedElement
            const resizeResult = resizedCoordinates( clientX ,clientY , position! ,coordinates)
            if (!resizeResult) return;
            const {x1 , y1 , x2 , y2} = resizeResult
            updateElement(id , x1 , y1 , x2 , y2 , type)

        }
    }

    const handleMouseUp =(e:MouseEvent)=>{
        const currentCursorPosition = computePointInCanvas(e)
        if (!currentCursorPosition) return
        // const { x: clientX, y:clientY} = currentCursorPosition
        const { clientX , clientY } = getMouseCoordinates(currentCursorPosition)

        if ( selectedElement ) {
            if ( 
                selectedElement.type === ToolModeEnum.text &&  
                clientX - selectedElement.offsetX === selectedElement.x1 &&
                clientY - selectedElement.offsetY === selectedElement.y1
            ) {
                setAction(ActionEnum.writing)
                return;
            } 

            const lastIdx = selectedElement?.id
            const { id , type } = elements[lastIdx]
            // adjustmentRequired(type) 檢查型別是否 line 或是 rectangle
            if (( action === ActionEnum.drawing || action === ActionEnum.resize ) && adjustmentRequired(type)) {
                const { x1 , y1 , x2 , y2 } = adjustElementCoordinates(elements[lastIdx])
                // console.log('檢查調整過的xy: ' , {x1,y1,x2,y2})
                updateElement(id , x1 ,y1 , x2, y2 ,type)
            }
        }

        if(action === ActionEnum.writing) {
            return 
        }
        
        setAction(ActionEnum.none)
        setSelectedElement(null)
    }

    const handleBlur = (e:FocusEvent) =>{
        if (!selectedElement) return
        const { id , x1 , y1 , type } = selectedElement
        setAction(ActionEnum.none)
        setSelectedElement(null)
        const blurTarget = e.target as HTMLTextAreaElement
        updateElement(id ,x1, y1 , 0 , 0 , type , {text: blurTarget.value} )
    }

    const onZoom = (delta:number)=>{
        
        setScale(pre=> Math.min(Math.max(pre + delta , 0.1) , 20) )
    }







    return (
        <div  className='w-screen h-screen bg-white flex justify-center items-start p-5 flex-wrap'>
            <div className=' flex items-center top-4 left-4 fixed  border border-black bg-amber-200 gap-4'>
                <label className='p-1'>
                    draw line
                    <input type="radio" 
                        checked={tool === ToolModeEnum.line}
                        onChange={()=>{  setTool(ToolModeEnum.line)}}/>
                </label>
                <label className='p-1'>
                    draw rectangle
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.rectangle} 
                        onChange={()=>{ setTool(ToolModeEnum.rectangle)}}/>
                </label>
                <label className='p-1'>
                    pencil
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.pencil} 
                        onChange={()=>{ setTool(ToolModeEnum.pencil)}}/>
                </label>
                <label className='p-1'>
                    text
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.text} 
                        onChange={()=>{ setTool(ToolModeEnum.text)}}/>
                </label>

                <label className='p-1'>
                    selector
                    <input 
                        type="radio"  
                        checked={tool === ToolModeEnum.selector} 
                        onChange={()=>{ setTool(ToolModeEnum.selector)}}/>
                </label>

                <button onClick={undo} className='border-x border-black p-2 mr-1'>undo</button>
                <button onClick={redo} className='border-x border-black p-2'>redo</button>

                <div className=' ml-5'>
                    <button className='border border-black p-1' onClick={()=>onZoom(-0.1)}>-</button>
                    <span className=' p-2' onClick={()=>onZoom(1)}>{new Intl.NumberFormat("en-GB" , {style: "percent"}).format(scale) }</span>
                    <button className='border border-black p-1' onClick={()=>onZoom(0.1)}>+</button>
                </div>
            </div>

            { action === ActionEnum.writing && selectedElement && canvasTop && canvasLeft && <textarea 
                onBlur={handleBlur}
                ref={textAreaRef}
                className=' fixed m-0 p-0 border-0 outline-none resize overflow-hidden bg-transparent' 
                style={{
                    top: (selectedElement.y1 + canvasTop - 2 ) * scale + panOffset.y * scale  -scaleOffset.y, 
                    left:( selectedElement.x1 + canvasLeft - 1 ) * scale + panOffset.x * scale - (scaleOffset.y ),
                    font: `${15 * scale}px sans-serif`
                }}/> 
                }

            <div>
                { loaded && <canvas
                    width={ 750}
                    height={ 750}
                    className=' border border-black'
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    ></canvas>}
            </div>
        </div>

    )
}

export default Page
