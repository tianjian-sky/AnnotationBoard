import Konva from 'konva'

const update = function (pt) {
    this.pointEnd = pt
    const width = this.pointEnd.x - this.pointStart.x
    const height = this.pointEnd.y - this.pointStart.y
    this.graph.setAttrs({
        x: Math.min(this.pointStart.x, this.pointEnd.x),
        y: Math.min(this.pointStart.y, this.pointEnd.y),
        width: Math.abs(width),
        height: Math.abs(height)
    })
    this.tr?.forceUpdate()
}

export function drawEclipse(props) {
    const obj: any = {}
    obj.layer = props.layer
    obj.id = `Eclipse-${new Date().getTime()}`
    obj.pointStart = obj.pointEnd = { x: props.left, y: props.top }
    obj.lineOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    }
    obj.graph = new Konva.Ellipse({
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