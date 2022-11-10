import Konva from 'konva'

const update = function (pt) {
    this.points.push(pt.x, pt.y)
    this.line.setAttr('points', this.points)
    this.tr?.forceUpdate()
}

export function drawPostilLine(props) {
    const obj: any = {}
    obj.layer = props.layer
    obj.id = `PostilLine-${new Date().getTime()}`
    obj.points = props.points || []
    obj.lineOpt = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    }
    obj.line = new Konva.Line({
        points: obj.points,
        ...obj.lineOpt,
        draggable: true
    })
    obj.update = update
    obj.line.name(obj.id)
    obj.layer.add(obj.line)
    return obj
}
