import { RoughGenerator } from "roughjs/bin/generator"
import { ToolModeEnum , ElementPositionEnum , CursorStyleEnum } from "../enums/draw"


const generator = new RoughGenerator()

const createDrawElement = (id:number , x1:number , y1:number , x2:number , y2:number , mode: ToolModeEnum): DrawElement=>{
    // line 要起始點與結束點
    if (mode === ToolModeEnum.line ) return { id , x1 , y1 , x2 , y2 , type: mode , roughElement: generator.line( x1,y1,x2,y2)}

    // if (mode === DrawModeEnum.rectangle) 
    // 正方形要 起始點與寬高
    return { id,  x1 , y1 , x2 , y2  , type: mode ,  roughElement: generator.rectangle( x1,y1, x2-x1 ,y2-y1)}
}

const distance = ( pointA:PositionXY , pointB:PositionXY):number =>{
    return Math.sqrt( Math.pow(pointA.x - pointB.x , 2) + Math.pow(pointA.y - pointB.y , 2))
}

const nearPoint = (x1: number , y1:number , x2:number , y2:number ,positionName:ElementPositionEnum): ElementPositionEnum | null => {
    return Math.abs(x1 - x2) < 5 && Math.abs(y1 -y2) < 5 ? positionName : null
}

const positionWithinElement = (curX:number , curY:number , element:DrawElement): ElementPositionEnum | null =>{
    const { type , x1 , x2 , y1 ,y2 } = element
    // x1 對應左邊 x2對應右邊 y1對應上面 y2對應下面
    if (type === ToolModeEnum.rectangle) {
        const topLeft = nearPoint( curX , curY ,x1 ,y1 , ElementPositionEnum.tl)
        const topRight = nearPoint( curX , curY ,x2 ,y1 , ElementPositionEnum.tr)
        const bottomLeft = nearPoint( curX , curY ,x1 ,y2 , ElementPositionEnum.bl)
        const bottomRight = nearPoint( curX , curY ,x2 ,y2 , ElementPositionEnum.br)
        const inside = curX >= x1 && curX <= x2 && curY >= y1 && curY <= y2 ? ElementPositionEnum.inside : null
        return topLeft ||topRight ||bottomLeft ||bottomRight || inside
    } else {
        // line
        const a = {x:x1, y:y1}
        const b = {x:x2, y:y2}
        const c = { x:curX, y:curY }
        const offset = distance(a ,b) - (distance(a,c) + distance(b, c))
        const start = nearPoint(curX ,curY, x1,y1, ElementPositionEnum.start)
        const end = nearPoint(curX ,curY,x2,y2, ElementPositionEnum.end)
        const inside = Math.abs(offset) < 1 ? ElementPositionEnum.inside : null
        return start || end || inside
    }
}

const cursorForPosition = (position: ElementPositionEnum ): CursorStyleEnum => {
    switch (position) {
        case ElementPositionEnum.tl:
        case ElementPositionEnum.br:
        case ElementPositionEnum.start:
        case ElementPositionEnum.end:
            return CursorStyleEnum.nwse
        case ElementPositionEnum.tr:
        case ElementPositionEnum.bl:
            return CursorStyleEnum.nesw
        default:
            return CursorStyleEnum.move
    }
}

const resizeCoordinates = (curX: number , curY: number , position: ElementPositionEnum , coordinates: PositionXYXY): PositionXYXY | null => {
    const { x1 , y1 , x2 , y2 } = coordinates
    switch (position) {
        case ElementPositionEnum.tl:
        case ElementPositionEnum.start:
            return { x1: curX , y1: curY , x2 , y2}
        case ElementPositionEnum.tr:
            return { x1 , y1: curY , x2: curX , y2}
        case ElementPositionEnum.bl:
            return { x1: curX , y1 , x2 , y2: curY}
        case ElementPositionEnum.br:
        case ElementPositionEnum.end:
            return { x1 , y1 , x2: curX , y2: curY}
        default:
            return null
    }
}


export {
    createDrawElement, distance , nearPoint ,positionWithinElement ,cursorForPosition ,resizeCoordinates 
}