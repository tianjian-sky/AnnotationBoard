import Konva from 'konva'

const update = function (pt) {
    this.pointEnd = pt
    const width = this.pointEnd.x - this.pointStart.x
    const height = this.pointEnd.y - this.pointStart.y
    let p1 = { x: 0, y: 0 }
    let p2 = { x: width, y: height }
    let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    let arrowLen = dist / 10
    const foot = { x: p1.x + arrowLen * Math.cos(angle), y: p1.y + arrowLen * Math.sin(angle) }
    const theta = (20 * Math.PI) / 180
    const p3 = {
        x: foot.x * Math.cos(-theta) - foot.y * Math.sin(-theta) - p1.x * Math.cos(-theta) + p1.y * Math.sin(-theta) + p1.x,
        y: foot.x * Math.sin(-theta) + foot.y * Math.cos(-theta) - p1.x * Math.sin(-theta) - p1.y * Math.cos(-theta) + p1.y
    }
    const p4 = {
        x: foot.x * Math.cos(theta) - foot.y * Math.sin(theta) - p1.x * Math.cos(theta) + p1.y * Math.sin(theta) + p1.x,
        y: foot.x * Math.sin(theta) + foot.y * Math.cos(theta) - p1.x * Math.sin(theta) - p1.y * Math.cos(theta) + p1.y
    }
    this.triangle.setAttr('points', [p1.x, p1.y, p3.x, p3.y, p4.x, p4.y])
    this.line.setAttr('points', [p1.x, p1.y, p2.x, p2.y])
    this.tr?.forceUpdate()
}

export function drawArrow(props) {
    const obj: any = {}
    obj.layer = props.layer
    obj.id = `Arrow-${new Date().getTime()}`
    obj.pointStart = obj.pointEnd = { x: props.left, y: props.top }
    obj.lineOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    }
    obj.triangleOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke,
        closed: true
    }
    obj.line = new Konva.Line({
        points: [0, 0, 0, 0],
        ...obj.lineOpt
    })
    obj.triangle = new Konva.Line({
        points: [0, 0, 0, 0, 0, 0],
        ...obj.triangleOpt
    })
    obj.group = new Konva.Group({
        selectable: true,
        x: obj.pointStart.x,
        y: obj.pointStart.y,
        draggable: true
    })
    obj.update = update
    obj.group.name(obj.id)
    obj.group.add(obj.line)
    obj.group.add(obj.triangle)
    obj.layer.add(obj.group)
    return obj
}
