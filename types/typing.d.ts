type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

type Draw2 = {
  ctxPara: CanvasRenderingContext2D
  currentPointPara: Point
  prevPointPara: Point | null
}


type Point = { x: number; y: number }
