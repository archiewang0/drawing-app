enum ToolModeEnum {
    line='line',
    rectangle = 'rectangle',
    selector = 'selector'
}

enum ActionEnum {
    none = "none", //放開點擊
    drawing = "drawing", //選擇tool action 就是drawing
    moving = "moving" //選擇selector action 就是moving
}

export { ToolModeEnum , ActionEnum}