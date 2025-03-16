"use client"

import React , { FC , MouseEvent , FocusEvent , type RefObject } from "react"

interface TextAreaProps {
    handleBlur: (e:FocusEvent)=>void
    textAreaRef: RefObject<HTMLTextAreaElement>
    handleMouseMove: (e:MouseEvent) => void
    handleMouseUp: (e:MouseEvent) => void
    scale: number
    panOffset: PositionXY
    selectedElement: SelectedDrawElement,
    canvasTop: number
    canvasLeft: number
    scaleOffset: PositionXY
}

export const TextArea: FC<TextAreaProps>  = ({handleBlur, textAreaRef , scale , panOffset , selectedElement , canvasTop , canvasLeft , scaleOffset}) => {

    return (
        <textarea 
            onBlur={handleBlur}
            ref={textAreaRef}
            className=' fixed m-0 p-0 border-0 outline-none resize overflow-hidden bg-transparent z-50' 
            style={{
                top: (selectedElement.y1 + canvasTop - 6 ) * scale + panOffset.y * scale  - (scaleOffset.y  + canvasTop*(scale - 1)), 
                left:( selectedElement.x1 + canvasLeft - 2)  * scale + panOffset.x * scale - (scaleOffset.x + canvasLeft*(scale - 1)  ),
                font: `${15 * scale}px sans-serif`
            }}/> 
    )
}

