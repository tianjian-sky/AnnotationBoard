import Konva from 'konva'

function update(pt) {
    this.pointEnd = pt
    const width = this.pointEnd.x - this.pointStart.x
    const height = this.pointEnd.y - this.pointStart.y
    this.graph.setAttrs({
        width,
        height
    })
    this.tr?.forceUpdate()
}

export function drawRect(props) {
    const obj: any = {}
    obj.layer = props.layer
    obj.id = `Rect-${new Date().getTime()}`
    obj.pointStart = obj.pointEnd = { x: props.left, y: props.top }
    obj.lineOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    }
    obj.graph = new Konva.Rect({
        x: obj.pointStart.x,
        y: obj.pointStart.y,
        width: obj.pointEnd.x - obj.pointStart.x,
        height: obj.pointEnd.y - obj.pointStart.y,
        draggable: true,
        ...obj.lineOpt
    })
    obj.update = update
    obj.graph.name(obj.id)
    obj.layer.add(obj.graph)
    return obj
}
