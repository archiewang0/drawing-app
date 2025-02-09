
'use client'
import React, { FocusEvent, MouseEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RoughGenerator } from "roughjs/bin/generator";
import { RoughCanvas } from "roughjs/bin/canvas";
import getStroke from "perfect-freehand";
import { Drawable } from "roughjs/bin/core";

const generator = new RoughGenerator()

interface DefaultElement  {
    id: number , type: ToolEnum , 
}

interface CreateLineAndRectElment extends DefaultElement ,PositionXYXY  {
    drawableEl: Drawable
}

interface PositionXYXY {
    x1: number ,y1: number , x2: number , y2: number
}

interface PencilPoint extends PositionXY{}

interface PositionXY{
    x:number, y:number
}

interface CreatePencilElment extends DefaultElement {
    points: PencilPoint[]
}

interface CreateTextElment extends DefaultElement , PositionXYXY{
    text: string
}


const createElement = (
    id:number, 
    x1:number, 
    y1:number, 
    x2:number, 
    y2:number, 
    type: ToolEnum
): I_Selected_Element => {
    switch (type) {
        case ToolEnum.line:
            const lineEl = generator.line(x1, y1, x2, y2) 
            return { id, x1, y1, x2, y2, type, drawableEl: lineEl };
        case ToolEnum.rectangle:
            const rectEl  = generator.rectangle(x1, y1, x2 - x1, y2 - y1) 
            return { id, x1, y1, x2, y2, type, drawableEl: rectEl };
        case ToolEnum.pencil:
            return { id, type, points: [{ x: x1, y: y1 }] };
        case ToolEnum.text:
            return { id, type, x1, y1, x2, y2, text: "" };
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};

enum PointPositionEnums {
    start = 'start',
    end = 'end',
    tl = 'tl',
    tr = 'tr',
    bl = "bl",
    br = "br",
}

interface updateElementOption {
    text:string
}



const nearPoint = (x:number, y:number, x1:number, y1:number, name: PointPositionEnums): PointPositionEnums | null  => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1:number, y1:number, x2:number, y2:number, x:number, y:number, maxDistance:number = 1) => {
    const a:Point = { x: x1, y: y1 };
    const b:Point = { x: x2, y: y2 };
    const c:Point = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x:number, y:number, element: I_Selected_Element): null | "inside" |  PointPositionEnums => {
    const { type, x1, x2, y1, y2  , points} = element;
    if ( !x1 || !y1 || !x2 || !y2 || !points) {
        alert('positionWithinElement reqire error')
        return null
    }

    switch (type) {
        case ToolEnum.line:
            const on = onLine(x1, y1, x2, y2, x, y);
            const start = nearPoint(x, y, x1, y1, PointPositionEnums.start);
            const end = nearPoint(x, y, x2, y2, PointPositionEnums.end);
            return start || end || on;
        case ToolEnum.rectangle:
            const topLeft = nearPoint(x, y, x1, y1, PointPositionEnums.tl);
            const topRight = nearPoint(x, y, x2, y1, PointPositionEnums.tr);
            const bottomLeft = nearPoint(x, y, x1, y2, PointPositionEnums.bl);
            const bottomRight = nearPoint(x, y, x2, y2, PointPositionEnums.br);
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
            return topLeft || topRight || bottomLeft || bottomRight || inside;
        case ToolEnum.pencil:
            const betweenAnyPoint = points.some((point ,index: number) => {
                const nextPoint = points[index + 1];
                if (!nextPoint) return false;
                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
            });
            return betweenAnyPoint ? "inside" : null;
        case ToolEnum.text:
            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};

const distance = (a:Point, b:Point) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x:number, y:number, elements:I_Selected_Element[]) => {
    return elements
        .map(element => ({ ...element, position: positionWithinElement(x, y, element) }))
        .find(element => element.position !== null);
};

const adjustElementCoordinates = (element:I_Selected_Element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (!x1 || !y1 || !x2 || !y2) return
    if (type === ToolEnum.rectangle) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
        if (x1 < x2 || (x1 === x2 && y1 < y2)) {
            return { x1, y1, x2, y2 };
        } else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 };
        }
    }
};

enum CursorForPositionEnum {
    nwseResize = 'nwse-resize',
    neswResize = 'nesw-resize',
    move = 'move'
}

type T_Position = PointPositionEnums | "inside" | null

const cursorForPosition = (position: T_Position ): CursorForPositionEnum => {
    switch (position) {
        case PointPositionEnums.tl:
        case PointPositionEnums.br:
        case PointPositionEnums.start:
        case PointPositionEnums.end:
            return CursorForPositionEnum.nwseResize;
        case PointPositionEnums.tr:
        case PointPositionEnums.bl:
            return CursorForPositionEnum.neswResize;
        default:
            return CursorForPositionEnum.move;
    }
};

const resizedCoordinates = (clientX:number, clientY:number, position: T_Position, coordinates: PositionXYXY ): PositionXYXY | null => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
        case PointPositionEnums.tl:
        case PointPositionEnums.start:
            return { x1: clientX, y1: clientY, x2, y2 };
        case PointPositionEnums.tr:
            return { x1, y1: clientY, x2: clientX, y2 };
        case PointPositionEnums.bl:
            return { x1: clientX, y1, x2, y2: clientY };
        case PointPositionEnums.br:
        case PointPositionEnums.end:
            return { x1, y1, x2: clientX, y2: clientY };
        default:
            return null; //should not really get here...
    }
};

type HistoryAction<T> = ((state: T[]) => T[]) | T[]

const useHistory = <T extends unknown>(initialState: T[]): [
    history: T[],
    setState: (action: HistoryAction<T> , overwrite?: boolean) => void,
    undo: ()=>void,
    redo: ()=>void
] => {
    const [index, setIndex] = useState<number>(0);
    const [history, setHistory] = useState<T[][]>([initialState]);

    // 寫入State , 可以帶入()=>T[] 也可以直接帶入值
    const setState = ( 
            action: ( (param: T[])=> T[] ) | T[], 
            overwrite:boolean = false
        ) => {
            const newState = typeof action === "function" ? action(history[index]) : action;
            
            if (overwrite) {
                const historyCopy = [...history];
                historyCopy[index] = newState;
                setHistory(historyCopy);
            } else {
                const updatedState = [...history].slice(0, index + 1);
                setHistory([...updatedState, newState]);
                setIndex(prevState => prevState + 1);
            }
    };

    const undo:()=>void = () => index > 0 && setIndex(prevState => prevState - 1);
    const redo:()=>void = () => index < history.length - 1 && setIndex(prevState => prevState + 1);

    // 目前element , 寫入element , 回去上個element , 回覆上個element
    return [history[index], setState, undo, redo];
};

type T_Stroke = number[] | {x: number; y: number; pressure?: number; }
type T_Stroke_Arr = T_Stroke[]

// 這個不知道怎麼處理?
// const getSvgPathFromStroke = (
//         stroke: T_Stroke_Arr[] 
//     ) => {
//     if (!stroke.length) return "";
//     const d = stroke[0].reduce(
//         (acc: (string|number)[], point: T_Stroke, i: number, arr: T_Stroke[]) => {
//             const x0 = Array.isArray(point) ? point[0] : point.x;
//             const y0 = Array.isArray(point) ? point[1] : point.y;
            
//             const nextPoint = arr[(i + 1) % arr.length];
//             const x1 = Array.isArray(nextPoint) ? nextPoint[0] : nextPoint.x;
//             const y1 = Array.isArray(nextPoint) ? nextPoint[1] : nextPoint.y;
            
//             acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
//             return acc;
//         },
//         ["M", ...stroke[0], "Q"]
//     );

//     d.push("Z");
//     return d.join(" ");
// };



const drawElement = (roughCanvas: RoughCanvas, context: CanvasRenderingContext2D, element: I_Selected_Element) => {
    const { roughElement , points , text , x1 , y1 , type} = element
    if (!roughElement || !points || !text || !x1 || !y1 ) return 
    switch (type) {
        case ToolEnum.line:
        case ToolEnum.rectangle:
            roughCanvas.draw(roughElement);
            break;
        case ToolEnum.pencil:
            const stroke = "M Q Z";
            // const stroke = getSvgPathFromStroke(getStroke(points));
            context.fill(new Path2D(stroke));
            break;
        case ToolEnum.text:
            context.textBaseline = "top";
            context.font = "24px sans-serif";
            context.fillText(text, x1, y1);
            break;
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};

const adjustmentRequired = (type:ToolEnum) => ["line", "rectangle"].includes(type);

const usePressedKeys = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set<string>());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setPressedKeys( pre => new Set(pre).add(e.key));
        };

        const handleKeyUp = (e:KeyboardEvent) => {
            setPressedKeys( pre => {
                const updatedKeys = new Set(pre);
                updatedKeys.delete(e.key);
                return updatedKeys;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return pressedKeys;
};

enum ToolEnum {
    rectangle= 'rectangle',
    selection = 'selection',
    line = 'line',
    text = 'text',
    pencil = 'pencil'
}

enum ActionEnum{
    writing = 'writing',
    none = 'none',
    panning = 'panning',
    moving = 'moving',
    resizing = 'resizing',
    text = 'text',
    drawing = 'drawing',
}

interface I_Selected_Element{
    id: number
    type: ToolEnum,

    x1?: number,
    y1?: number,
    x2?: number,
    y2?: number,
    text?: string,

    offsetX?: number,
    offsetY?: number,

    xOffsets?: number[],
    yOffsets?: number[],

    position?: T_Position

    points?: PositionXY[]

    drawableEl?: Drawable
    roughElement?: Drawable
}

// interface I_Point {
//     x: number
//     y: number
//     pressure?: number
// }

// interface I_Draw_Element{
//     type: ToolEnum
//     roughElement: Drawable
//     points: I_Point[]
//     text: string
//     x1: number
//     y1: number
//     x2: number
//     y2: number
// }

const App = () => {
    const [ elements, setElements, undo, redo] = useHistory<I_Selected_Element>([]);

    const [action, setAction] = useState<ActionEnum>(ActionEnum.none);
    const [tool, setTool] = useState<ToolEnum>(ToolEnum.rectangle);

    const [selectedElement, setSelectedElement] = useState<I_Selected_Element | null>(null);
    const [panOffset, setPanOffset] = React.useState<PositionXY>({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = React.useState<PositionXY>({ x: 0, y: 0 });
    const pressedKeys = usePressedKeys();
    
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [textAreaVal , setTextAreaVal] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d");
        if (!context) return


        const roughCanvas = new RoughCanvas(canvas);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.translate(panOffset.x, panOffset.y);
        console.log( 'run action: ' , action)

        if (!selectedElement) return;
        elements.forEach(element => {
            console.log('run elements render drawElement')
            if (action === ActionEnum.writing && selectedElement.id === element.id) return;
            drawElement(roughCanvas, context, element);
        });
        context.restore();
    }, [elements, action, selectedElement, panOffset]);

    useEffect(() => {
        const undoRedoFunction = (event:KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "z") {
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        };

        document.addEventListener("keydown", undoRedoFunction);
        return () => {
            document.removeEventListener("keydown", undoRedoFunction);
        };
    }, [undo, redo]);

    useEffect(() => {
        setLoaded(true)
        const panFunction = (event: WheelEvent) => {
            setPanOffset(prevState => ({
                x: prevState.x - event.deltaX,
                y: prevState.y - event.deltaY,
            }));
        };
        document.addEventListener("wheel", panFunction);
        
        return () => {
            document.removeEventListener("wheel", panFunction);
        };
    }, []);

    useEffect(() => {
        const textArea = textAreaRef.current as HTMLTextAreaElement;
        if (!textArea) return;
        if (!selectedElement) return;

        if (action === ActionEnum.writing) {
            setTimeout(() => {
                textArea.focus();
                // textArea.value = selectedElement.text;
                setTextAreaVal( selectedElement.text! )
            }, 0);
        }
    }, [action, selectedElement]);

    const updateElement = (id:number, x1:number, y1:number,  x2:number|null, y2:number|null, type:ToolEnum, options?: updateElementOption | null) => {
        const elementsCopy = [...elements];

        switch (type) {
            case ToolEnum.line:
            case ToolEnum.rectangle:
                if (!x2 || !y2) return alert('x2 || y2 undefind!')
                elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
                break;
            case ToolEnum.pencil:
                const { points } = elementsCopy[id]
                if (!points) return alert('points undefined!')
                if (!x2 || y2) return alert('x2 or y2 undefined!')
                elementsCopy[id].points = [...points, { x: x2, y: y2 } as PositionXY];
                break;
            case ToolEnum.text:
                const canvasEl =  canvasRef.current
                if ( !canvasEl) return
                const context = canvasEl.getContext("2d")
                if (!context) return
                if (!options) return alert('options error!')
                const textWidth = context.measureText(options.text).width;
                const textHeight = 24;
                
                elementsCopy[id] = {
                    ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
                    text: options.text,
                };
                break;
            default:
                throw new Error(`Type not recognised: ${type}`);
        }

        setElements(elementsCopy, true);
    };

    const getMouseCoordinates = (e:MouseEvent) => {
        const clientX = e.clientX - panOffset.x;
        const clientY = e.clientY - panOffset.y;
        return { clientX, clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (action === ActionEnum.writing) return;

        const { clientX, clientY } = getMouseCoordinates(e);
        
        if (e.button === 1 || pressedKeys.has(" ")) {
            setAction(ActionEnum.panning);
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        }

        console.log('check e: ' , e)
        console.log('check tool: ' ,tool)


        if (tool === ToolEnum.selection) {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (!element) return alert('handleMouseDown element reqire')
            const {points , x1 , y1} = element
            if (element.type === "pencil") {
                if (!points) return alert('handleMouseDown elelement points reqire')
                const xOffsets = points.map(point => clientX - point.x);
                const yOffsets = points.map(point => clientY - point.y);
                setSelectedElement({ ...element, xOffsets, yOffsets });
            } else {
                if (!x1 || !y1) return alert('handleMouseDown elelement x1 , y1 reqire')
                const offsetX = clientX - x1;
                const offsetY = clientY - y1;
                setSelectedElement({ ...element, offsetX, offsetY });
            }
            setElements(prevState => prevState);

            if (element.position === "inside") {
                setAction(ActionEnum.moving);
            } else {
                setAction(ActionEnum.resizing);
            }
        } else {
            const id = elements.length;
            const element = createElement(id, clientX, clientY, clientX, clientY, tool);
            console.log(' handleMouseDown: ' , element)
            setElements(prevState => [...prevState, element]);
            setSelectedElement(element);
            setAction(tool === ToolEnum.text ? ActionEnum.writing : ActionEnum.drawing);
        }
    };

    const handleMouseMove = (event:MouseEvent) => {
        const { clientX, clientY } = getMouseCoordinates(event);

        if (action === ActionEnum.panning) {
            const deltaX = clientX - startPanMousePosition.x;
            const deltaY = clientY - startPanMousePosition.y;
            setPanOffset({
                x: panOffset.x + deltaX,
                y: panOffset.y + deltaY,
            });
            return;
        }

        if (tool === ToolEnum.selection) {
            const element = getElementAtPosition(clientX, clientY, elements);
            (event.target as HTMLCanvasElement).style.cursor = element ? cursorForPosition(element.position!) : "default";
        }

        if (action === ActionEnum.drawing ) {
            const index = elements.length - 1;
            const { x1, y1 } = elements[index];
            if( !x1 || !y1) return alert("handleMouseMove x1 y1 reqire")
            updateElement(index, x1, y1, clientX, clientY, tool);
        } else if (action === ActionEnum.moving) {
            if (!selectedElement) return  alert("handleMouseMove selectedElement reqire")
            if (selectedElement.type === ToolEnum.pencil) {
                const {points , xOffsets , yOffsets} = selectedElement
                if( !points || !yOffsets || !xOffsets ) return alert("handleMouseMove points , xOffsets , yOffsets reqire")
                const newPoints = points.map(( _ , index:number) => ({
                    x: clientX - xOffsets[index],
                    y: clientY - yOffsets[index],
                }));
                const elementsCopy = [...elements];
                elementsCopy[selectedElement.id] = {
                    ...elementsCopy[selectedElement.id],
                    points: newPoints,
                };
                setElements(elementsCopy, true);
            } else {
                const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
                if ( !x1 || !x2 || !y1 || !y2 || !offsetX || !offsetY) return alert("handleMouseMove x2 , x1 ,y1 ,y2 ,offsetX , offsetY reqire")
                const width = x2 - x1;
                const height = y2 - y1;
                const newX1 = clientX - offsetX;
                const newY1 = clientY - offsetY;
                const options = type === ToolEnum.text ? { text: selectedElement.text || '' } : null;
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
            }
        } else if (action === ActionEnum.resizing) {
            if (!selectedElement) return;
            const { id, type, position, ...coordinates } = selectedElement;
            if (!position) return;
            const resizedCoordinatesResult = resizedCoordinates(clientX, clientY, position, coordinates as PositionXYXY);
            if (!resizedCoordinatesResult) return alert('resizedCoordinatesResult is null')
            const {x1, y1, x2, y2 } = resizedCoordinatesResult
            updateElement(id, x1, y1, x2, y2, type);
        }
    };

    const handleMouseUp = (event:MouseEvent) => {
        const { clientX, clientY } = getMouseCoordinates(event);
        if (!selectedElement) return alert(' selectedElement reqire')
        console.log('check selectedElement: ' , selectedElement)
        const { offsetX , offsetY  } = selectedElement
        if ( !offsetX || !offsetY ) return 
        
        // 因為沒有 offsetX offsetY 所以不會往下跑
        if (
            selectedElement.type === ToolEnum.text &&
            clientX - offsetX ===  selectedElement.x1 &&
            clientY - offsetY === selectedElement.y1
        ) {
            setAction(ActionEnum.writing);
            return;
        }

        const index = selectedElement.id;
        const { id, type } = elements[index];
        if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
            const adjustElementCoordinatesResult = adjustElementCoordinates(elements[index])
            // console.log('adjustElementCoordinatesResult: ' , adjustElementCoordinatesResult)
            if (!adjustElementCoordinatesResult) return
            const { x1, y1, x2, y2 } = adjustElementCoordinatesResult;
            updateElement(id, x1, y1, x2, y2, type);
        }

        if (action === "writing") return;
        
        setAction(ActionEnum.none);
        setSelectedElement(null);
    };

    const handleBlur = (e:FocusEvent) => {
        if (!selectedElement) return;
        const { id, x1, y1, type } = selectedElement;
        if (!x1 || !y1 ) return 
        setAction(ActionEnum.none);
        setSelectedElement(null);
        updateElement(id, x1, y1, null , null , type, { text: (e.target as HTMLTextAreaElement).value });
    };

    return (
        <div>
            <div style={{ position: "fixed", zIndex: 2 }}>
                <input
                    type="radio"
                    id="selection"
                    checked={tool === ToolEnum.selection}
                    onChange={() => setTool(ToolEnum.selection )}/>

                <label htmlFor="selection">Selection</label>
                <input 
                    type="radio" 
                    id="line" 
                    checked={tool === "line"} 
                    onChange={() => setTool(ToolEnum.line)} />
                <label htmlFor="line">Line</label>
                <input
                    type="radio"
                    id="rectangle"
                    checked={tool === ToolEnum.rectangle}
                    onChange={() => setTool(ToolEnum.rectangle)} />
                <label htmlFor="rectangle">Rectangle</label>
                <input
                    type="radio"
                    id="pencil"
                    checked={tool === ToolEnum.pencil}
                    onChange={() => setTool(ToolEnum.pencil)}/>
                <label htmlFor="pencil">Pencil</label>
                <input 
                    type="radio" 
                    id="text" 
                    checked={tool === ToolEnum.text} 
                    onChange={() => setTool(ToolEnum.text)} />
                <label htmlFor="text">Text</label>
            </div>
            <div 
                className=" fixed bottom-0 p-3"
                style={{ zIndex: 2 }}>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
            </div>

            { action === ActionEnum.writing && selectedElement &&  selectedElement.y1 && selectedElement.x1 ? (
                <textarea
                    ref={textAreaRef}
                    value={textAreaVal}
                    onBlur={(e:FocusEvent)=>handleBlur(e)}
                    className=" fixed m-0 p-0 border-0 outline-0 resize overflow-hidden whitespace-pre bg-transparent "
                    style={{
                        top: selectedElement.y1 - 2 + panOffset.y,
                        left: selectedElement.x1 + panOffset.x,
                        font: "24px sans-serif",
                        zIndex: 2
                        }}/>
            ) : null}
            {loaded && <canvas
                ref={canvasRef}
                id="canvas"
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={(e:MouseEvent)=>handleMouseDown(e)}
                onMouseMove={(e:MouseEvent)=>handleMouseMove(e)}
                onMouseUp={(e:MouseEvent)=>handleMouseUp(e)}
                className=" absolute"
                style={{ zIndex: 1 }} >
                Canvas
            </canvas> }

        </div>
    );
};

export default App;