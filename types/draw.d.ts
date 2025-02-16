
interface DrawElement extends PositionXYXY{
    id: number
    roughElement: Drawable
    type: ToolModeEnum
}

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