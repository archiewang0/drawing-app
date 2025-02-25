// 'use client'
// import { ChangeEvent, FC, FormEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
// import { useDraw } from '../hooks/useDraw'
// // import { useDraw2 } from '../hooks/useDraw2'
// import { ChromePicker } from 'react-color'
// import { useDebounce } from '../hooks/useDebounce'
// // import { DrawModeEnum } from '../enums/draw'


// interface pageProps {}

// const Page: FC<pageProps> = ({}) => {
//   const [ isClient , setIsClient] = useState(false)
//   const [ color, setColor] = useState('#000')
//   const [ size , setSize] = useState(5)
// //   const [ drawMode, setDrawMode] = useState<DrawModeEnum>(DrawModeEnum.line) // 添加繪圖模式狀態

//   // const [drawHistory, setDrawHistory] = useState<DrawAction[]>([])

// //   const { canvasRef, onMouseDown, clear   , tempCanvasRef } = useDraw(drawMode, drawLine , drawRect)


//   function drawLine({ ctx ,prevPoint, currentPoint , startPoint }: Draw) {
//     const { x: currX, y: currY } = currentPoint
//     const lineColor = color
//     const lineWidth = size
//     const prevPt = prevPoint ?? currentPoint

//     ctx.beginPath()
//     ctx.lineWidth = lineWidth
//     ctx.strokeStyle = lineColor
//     ctx.moveTo(prevPt.x, prevPt.y)
//     ctx.lineTo(currX, currY)
//     ctx.stroke()
//   }



//   function drawRect({ ctx ,prevPoint, currentPoint , startPoint , isDrawing}: DrawRect){
//     const { x: currX, y: currY } = currentPoint
//     const lineColor = color
//     const lineWidth = size

//     if ( startPoint) {
//       const tempCtx = tempCanvasRef.current?.getContext('2d')
//       if (!tempCtx) return

//       // 只清除暫存 canvas
//       tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height)
//       // 在暫存 canvas 上繪製預覽矩形
//       tempCtx.beginPath()
//       tempCtx.lineWidth = lineWidth
//       tempCtx.strokeStyle = lineColor
//       const width = currX - startPoint.x
//       const height = currY - startPoint.y
//       tempCtx.strokeRect(startPoint.x, startPoint.y, width, height)

//       if ( !isDrawing ) {
//         ctx.beginPath()
//         ctx.lineWidth = lineWidth
//         ctx.strokeStyle = lineColor
//         ctx.strokeRect(startPoint.x, startPoint.y, width, height)
//         tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height)
//       }
//     }
//   }



//   useEffect(()=>{
//     setIsClient(true) 
//   }, [])

//   const inputHanlder =(e:FormEvent)=>{
//       const el = e.target as HTMLInputElement
//       if ( typeof Number(el.value) !== 'number') return
//       setSize( Number(el.value))
//   }

//   const debouncedInput = useDebounce(inputHanlder , 500)


//   return (
//     <div
//         className='w-screen h-screen bg-white flex justify-center items-center'>

//       <div>

//         <div className='mb-4'>
//           模式: {drawMode}
//           <button 
//             className='p-4 m-3 border border-black'
//             onClick={()=>{setDrawMode(DrawModeEnum.line)}}
//             disabled={drawMode===DrawModeEnum.line} 
//             >線條</button>
//           <button 
//             className='p-4 m-3 border border-black'
//             onClick={()=>{setDrawMode(DrawModeEnum.rectangle)}}
//             disabled={drawMode===DrawModeEnum.rectangle} 
//             >矩形</button>
//         </div>

//         <div className='mb-4 flex'>
//             <span>比刷尺寸: {size}</span>
//             <input 
//               className='border border-black ml-4'
//               type="number" 
//               defaultValue={size} onInput={(e)=>debouncedInput(e)} />
//         </div>

//         <div className='flex flex-col gap-10 pr-10'>
//             {isClient && <ChromePicker color={color} onChange={(e) => setColor(e.hex)} /> } 
//             <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
//                 Clear canvas
//             </button> 
//         </div>
//       </div>
      
//       <div className=' relative'>
//         <canvas
//             ref={canvasRef}
//             onMouseDown={(e: any)=> onMouseDown(e) }
//             width={750}
//             height={750}
//             className='border border-black rounded-md'
//         /> 
//         <canvas
//           ref={tempCanvasRef}
//           />
//       </div>
  
      
//     </div>
//   )
// }

// export default Page
