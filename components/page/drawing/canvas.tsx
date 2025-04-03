'use client';

import type React from 'react';

import {FC, MouseEvent, useEffect, useState, type RefObject} from 'react';
import Skeleton from 'react-loading-skeleton';

interface CanvasProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    canvasContainerRef: RefObject<HTMLDivElement | null>;
    handleMouseDown: (e: MouseEvent) => void;
    handleMouseMove: (e: MouseEvent) => void;
    handleMouseUp: (e: MouseEvent) => void;
}

export const Canvas: FC<CanvasProps> = ({canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, canvasContainerRef}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (canvasContainerRef.current) setLoading(true);
    }, [canvasContainerRef.current]);

    if (!canvasContainerRef || !canvasContainerRef.current || !loading)
        return (
            <div className=" flex justify-center h-full items-center">
                <Skeleton
                    width={300}
                    height={30}></Skeleton>
            </div>
        );

    const {width, height} = canvasContainerRef.current.getBoundingClientRect();
    return (
        <>
            <canvas
                width={width}
                height={height}
                className=" bg-white "
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}></canvas>
        </>
    );
};
