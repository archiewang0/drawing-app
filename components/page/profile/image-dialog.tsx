'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {styled, keyframes} from '@stitches/react';
import {ZoomIn, ZoomOut, RotateCw, X, Download} from 'lucide-react';
import * as Skeleton from 'react-loading-skeleton';
import ToastMessage from '@/components/ui/toast';
import saveAs from 'file-saver';
// import Image from 'next/image';

interface ImageZoomDialogProps {
    src: string;
    alt: string;
    imageName: string;
    width?: number;
    height?: number;
    className?: string;
}

const overlayShow = keyframes({
    '0%': {opacity: 0},
    '100%': {opacity: 1},
});

const contentShow = keyframes({
    '0%': {opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)'},
    '100%': {opacity: 1, transform: 'translate(-50%, -50%) scale(1)'},
});

const StyledDialogOverlay = styled(Dialog.Overlay, {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'fixed',
    inset: 0,
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    zIndex: 50,
});

const StyledDialogContent = styled(Dialog.Content, {
    backgroundColor: 'transparent',
    borderRadius: 6,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '90vw',
    maxHeight: '90vh',
    padding: 0,
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    '&:focus': {outline: 'none'},
    zIndex: 51,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const StyledCloseButton = styled('button', {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.7)'},
});

const StyledControls = styled('div', {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '8px 12px',
    borderRadius: '20px',
});

const StyledControlButton = styled('button', {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.3)'},
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
    },
});

export function ImageZoomDialog({src, alt, width, height, className, imageName}: ImageZoomDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scale, setScale] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);
    // const [isload, setIsload] = React.useState(false);

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setScale(1);
        setRotation(0);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset zoom and rotation when closing
            handleReset();
        }
    };

    const handleDownload = async () => {
        saveAs(src, imageName ? `${imageName}.jpeg` : '未命名.jpeg');
    };

    // React.useEffect(() => {}, []);
    // if (!isload) return <div>Loading...</div>;

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                {/* <Skeleton */}
                <img
                    data-loaded="false"
                    onLoad={(event) => {
                        event.currentTarget.setAttribute('data-loaded', 'true');
                    }}
                    src={src || '/placeholder.svg'}
                    alt={alt}
                    width={width}
                    height={height}
                    className={` object-fill data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10 cursor-pointer transition-transform hover:scale-105 ${className || ''}`}
                />
            </Dialog.Trigger>
            <Dialog.Portal>
                <StyledDialogOverlay />
                <StyledDialogContent>
                    <Dialog.Title>
                        <p>{imageName ? imageName : '未命名'}</p>
                    </Dialog.Title>
                    <Dialog.Description></Dialog.Description>
                    <div className="relative flex items-center justify-center w-full h-full">
                        <img
                            src={src || '/placeholder.svg'}
                            alt={alt}
                            style={{
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                transition: 'transform 0.3s ease',
                            }}
                            className="object-contain bg-white"
                        />
                        <Dialog.Close asChild>
                            <StyledCloseButton aria-label="Close">
                                <X size={18} />
                            </StyledCloseButton>
                        </Dialog.Close>
                        <StyledControls>
                            <StyledControlButton
                                onClick={handleZoomIn}
                                disabled={scale >= 3}
                                aria-label="Zoom in">
                                <ZoomIn size={18} />
                            </StyledControlButton>
                            <StyledControlButton
                                onClick={handleZoomOut}
                                disabled={scale <= 0.5}
                                aria-label="Zoom out">
                                <ZoomOut size={18} />
                            </StyledControlButton>
                            <StyledControlButton
                                onClick={handleRotate}
                                aria-label="Rotate">
                                <RotateCw size={18} />
                            </StyledControlButton>
                            <StyledControlButton
                                onClick={handleDownload}
                                aria-label="Download">
                                <Download size={18} />
                            </StyledControlButton>
                            <StyledControlButton
                                onClick={handleReset}
                                disabled={scale === 1 && rotation === 0}
                                aria-label="Reset">
                                <span className="text-xs font-medium">Reset</span>
                            </StyledControlButton>
                        </StyledControls>
                    </div>
                </StyledDialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
