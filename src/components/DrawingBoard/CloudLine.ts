import Konva from 'konva'
const getPoints = function (begin, end, offset = 0, yAxis = false, dir = true) {
    const rate = 8
    const interval = 30
    const fn = function (x) {
        const times = Math.floor(x / interval)
        const diff = x - times * interval
        return (dir ? 1 : -1) * Math.sin((diff * Math.PI) / interval) * rate + offset
    }
    const points = []
    const accu = begin < end ? 1 : -1
    let i = begin
    while (i != end) {
        if (yAxis) {
            points.push(fn(i - begin), i)
        } else {
            points.push(i, fn(i - begin))
        }
        i += accu * 1
    }
    return points
}
const update = function (pt) {
    this.pointEnd = pt
    const p1 = { x: this.pointStart.x, y: this.pointStart.y }
    const p2 = { x: this.pointEnd.x, y: this.pointEnd.y }
    if (p1.x > p2.x) {
        const temp = p2.x
        p2.x = p1.x
        p1.x = temp
    }
    if (p1.y < p2.y) {
        const temp = p2.y
        p2.y = p1.y
        p1.y = temp
    }
    this.line.setAttr('points', [
        ...getPoints(p1.x, p2.x, p1.y, false, true),
        ...getPoints(p1.y, p2.y, p2.x, true, true),
        ...getPoints(p2.x, p1.x, p2.y, false, false),
        ...getPoints(p2.y, p1.y, p1.x, true, false)
    ])
    this.tr?.forceUpdate()
}
export function drawCloudLine(props) {
    const obj: any = {}
    obj.layer = props.layer
    obj.id = `CloudLine-${new Date().getTime()}`
    obj.pointStart = obj.pointEnd = { x: props.left, y: props.top }
    obj.lineOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    }
    obj.line = new Konva.Line({
        points: [
            ...getPoints(obj.pointStart.x, obj.pointEnd.x, obj.pointStart.y, false, true),
            ...getPoints(obj.pointStart.y, obj.pointEnd.y, obj.pointEnd.x, true, true),
            ...getPoints(obj.pointEnd.x, obj.pointStart.x, obj.pointEnd.y, false, false),
            ...getPoints(obj.pointEnd.y, obj.pointStart.y, obj.pointStart.x, true, false)
        ],
        draggable: true,
        ...obj.lineOpt
    })
    obj.line.name(obj.id)
    obj.layer.add(obj.line)
    obj.line.name(obj.id)
    obj.update = update
    return obj
}
