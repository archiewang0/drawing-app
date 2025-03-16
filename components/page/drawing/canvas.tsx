"use client"

import type React from "react"

import { FC , MouseEvent , type RefObject } from "react"

interface CanvasProps {
    canvasRef: RefObject<HTMLCanvasElement>
    canvasContainerRef: RefObject<HTMLDivElement>
    handleMouseDown: (e:MouseEvent) => void
    handleMouseMove: (e:MouseEvent) => void
    handleMouseUp: (e:MouseEvent) => void
}

export const Canvas: FC<CanvasProps>  = ({canvasRef, handleMouseDown , handleMouseMove , handleMouseUp , canvasContainerRef }) => {
    if ( !canvasContainerRef || !canvasContainerRef.current ) return <div className=" flex justify-center h-full items-center">Loadding...</div>
    const {width , height} = canvasContainerRef.current.getBoundingClientRect()
    return (
        <>
            <canvas
                width={width}
                height={height}
                className=' bg-white '
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ></canvas>
        </>
    )
}

