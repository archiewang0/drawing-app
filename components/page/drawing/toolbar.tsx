'use client';

import {FC} from 'react';
import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {ToggleGroup, ToggleGroupItem} from '@radix-ui/react-toggle-group';
import {Pencil, Square, Type, Move, Undo2, Redo2, ZoomIn, ZoomOut, RotateCcw, LineChartIcon as LineIcon} from 'lucide-react';
import {ToolModeEnum} from '@/enums/draw';
import {ComponentPropsWithoutRef} from 'react';
import {cn} from '@/lib/utils';

interface ToolbarProps {
    tool: ToolModeEnum;
    scale: number;
    setTool: (tool: ToolModeEnum) => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: (data: number) => void;
    consoleElement: () => void;
}

// const StyledToggleGroup = styled(ToggleGroup, {
//     display: 'inline-flex',
//     backgroundColor: 'white',
//     borderRadius: '4px',
//     border: '1px solid #e2e8f0',
// });

// const StyledToggleGroupItem = styled(ToggleGroupItem, {
//     all: 'unset',
//     backgroundColor: 'white',
//     color: '#64748b',
//     height: '35px',
//     width: '35px',
//     display: 'flex',
//     fontSize: 15,
//     lineHeight: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 1,
//     '&:first-child': {marginLeft: 0, borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px'},
//     '&:last-child': {borderTopRightRadius: '3px', borderBottomRightRadius: '3px'},
//     '&:hover': {backgroundColor: '#f1f5f9'},
//     '&[data-state=on]': {backgroundColor: '#e2e8f0', color: '#0f172a'},
//     '&:focus': {position: 'relative', boxShadow: '0 0 0 2px #cbd5e1'},
// });

const StyledToggleGroupItem = ({className, ...props}: ComponentPropsWithoutRef<typeof ToggleGroupItem>) => {
    return (
        <ToggleGroupItem
            className={cn('bg-white h-[35px] w-[35px] flex text-sm leading-tight justify-center items-center ml-1', className)}
            {...props}
        />
    );
};

export const Toolbar: FC<ToolbarProps> = ({tool, setTool, onUndo: undo, onRedo: redo, onZoomIn: onZoom, scale, consoleElement}) => {
    return (
        <div className="flex items-center justify-between bg-white w-full mb-5">
            <TooltipProvider>
                {/* <div>
                    <span
                        onClick={() => {
                            consoleElement();
                        }}>
                        test
                    </span>
                </div> */}

                <div className="flex items-center">
                    <ToggleGroup
                        className=" inline-flex bg-white rounded-md border border-[#e2e8f0]"
                        type="single"
                        defaultValue={ToolModeEnum.pencil}
                        value={tool}
                        onValueChange={(value) => value && setTool(value as ToolModeEnum)}
                        aria-label="Drawing tool">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <StyledToggleGroupItem
                                    value={ToolModeEnum.pencil}
                                    aria-label="Pencil tool">
                                    <Pencil size={18} />
                                </StyledToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Pencil</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <StyledToggleGroupItem
                                    value={ToolModeEnum.rectangle}
                                    aria-label="Rectangle tool">
                                    <Square size={18} />
                                </StyledToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rectangle</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <StyledToggleGroupItem
                                    value={ToolModeEnum.line}
                                    aria-label="Line tool">
                                    <LineIcon size={18} />
                                </StyledToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Line</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <StyledToggleGroupItem
                                    value={ToolModeEnum.text}
                                    aria-label="Text tool">
                                    <Type size={18} />
                                </StyledToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Text</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <StyledToggleGroupItem
                                    value={ToolModeEnum.selector}
                                    aria-label="Selection tool">
                                    <Move size={18} />
                                </StyledToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Select & Move</p>
                            </TooltipContent>
                        </Tooltip>
                    </ToggleGroup>
                </div>

                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={undo}>
                                <Undo2 size={18} />
                                <span className="sr-only">Undo</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Undo</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={redo}>
                                <Redo2 size={18} />
                                <span className="sr-only">Redo</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Redo</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="h-6 border-l border-gray-300 mx-2"></div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onZoom(0.1)}>
                                <ZoomIn size={18} />
                                <span className="sr-only">Zoom In</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Zoom In + </p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onZoom(1)}>
                                {/* <RotateCcw size={18} /> */}
                                {new Intl.NumberFormat('en-GB', {style: 'percent'}).format(scale)}
                                <span className="sr-only">Reset Zoom</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{new Intl.NumberFormat('en-GB', {style: 'percent'}).format(scale)}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onZoom(-0.1)}>
                                <ZoomOut size={18} />
                                <span className="sr-only">Zoom Out</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Zoom Out</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
};
