
interface DrawElement extends PositionXYXY{
    id: number
    roughElement: Drawable
    type: ToolModeEnum
    points: PositionXY[] //如果不是鉛筆的話 points []
}

// 選到的DrawElement 
interface SelectedDrawElement extends DrawElement {
    offsetX: number
    offsetY: number
    position: ElementPositionEnum | null
}

interface PositionXY{
    x: number
    y: number
}

interface PositionXYXY {
    x1: number
    y1: number
    x2: number
    y2: number
}