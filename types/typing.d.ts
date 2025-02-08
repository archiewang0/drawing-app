type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
  startPoint: Point | null
}

type DrawRect = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
  startPoint: Point | null
  isDrawing: boolean
}

// type Draw2 = {
//   ctxPara: CanvasRenderingContext2D
//   currentPointPara: Point
//   prevPointPara: Point | null
// }


type Point = { x: number; y: number }
