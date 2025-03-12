enum ToolModeEnum {
    line='line',
    rectangle = 'rectangle',
    selector = 'selector',
    pencil = 'pencil',
    text = 'text'
}

enum ActionEnum {
    none = "none", //放開點擊
    drawing = "drawing", //選擇tool action 就是drawing
    moving = "moving", //選擇selector action 就是moving
    resize = "resize", //選擇selector 在 element 特定位置 action 會是 resize
    writing = "writing"
}

enum ElementPositionEnum {
    inside = "inside",

    // for rectangle element
    tl = "tl",
    tr = "tr",
    bl = "bl",
    br = "br",

    // for line element
    start = "start",
    end = "end",
}

enum CursorStyleEnum {
    move = "move",
    nwse = "nwse-resize",
    nesw = "nesw-resize",
    pointer = "pointer",
    text = "text",
    default = "default"
}

export { ToolModeEnum , ActionEnum , ElementPositionEnum , CursorStyleEnum}