import Konva from 'konva'

const update = function (pt) {
    this.p2 = pt
    const width = this.p2.x - this.p1.x
    const height = this.p2.y - this.p1.y
    const dirX = width >= 0 ? 1 : -1
    let align = 'left'
    let p1 = { x: this.p1.x, y: this.p1.y } // group的坐标原点默认是group的中心
    let p2 = { x: p1.x + width, y: p1.y + height }
    let p3 = { x: p2.x + 45 * dirX, y: p2.y }
    let p4 = { x: p3.x, y: p3.y - 22 }
    if (dirX < 0) {
        p4.x -= 200
        align = 'right'
    }
    let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    let arrowLen = dist / 10
    const foot = { x: p1.x + arrowLen * Math.cos(angle), y: p1.y + arrowLen * Math.sin(angle) }
    const theta = (20 * Math.PI) / 180
    const pt1 = {
        x: foot.x * Math.cos(-theta) - foot.y * Math.sin(-theta) - p1.x * Math.cos(-theta) + p1.y * Math.sin(-theta) + p1.x,
        y: foot.x * Math.sin(-theta) + foot.y * Math.cos(-theta) - p1.x * Math.sin(-theta) - p1.y * Math.cos(-theta) + p1.y
    }
    const pt2 = {
        x: foot.x * Math.cos(theta) - foot.y * Math.sin(theta) - p1.x * Math.cos(theta) + p1.y * Math.sin(theta) + p1.x,
        y: foot.x * Math.sin(theta) + foot.y * Math.cos(theta) - p1.x * Math.sin(theta) - p1.y * Math.cos(theta) + p1.y
    }
    this.p3 = p3
    this.p4 = p4
    this.leadLine.setAttr('points', [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y])
    this.triangle.setAttr('points', [p1.x, p1.y, pt1.x, pt1.y, pt2.x, pt2.y])
    this.textbox.setAttrs({
        ...this.p4,
        align
    })
    this.textBg.setAttrs({
        ...this.p4,
        height: this.textbox.getSelfRect().height
    })
    this.tr?.forceUpdate()
}

export function drawLeadAnnotation(props) {
    const obj: any = {}
    obj.props = props
    obj.id = `LeadAnnotation-${new Date().getTime()}`
    obj.inputContainer = props.inputContainer
    obj.layer = props.layer
    obj.fontSize = props.fontSize
    obj.text = props.text || ''
    obj.editComplete = props.editComplete || (() => { })
    obj.p1 = obj.p2 = { x: props.left, y: props.top }
    obj.p3 = { x: obj.p2.x + 45, y: obj.p2.y }
    obj.p4 = { x: obj.p3.x, y: obj.p3.y - 22 }
    obj.lineOpts = {
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke,
        padding: 12,
        wrap: 'char',
        lineHeight: 20 / 14,
        fillAfterStrokeEnabled: true
    }
    obj.leadLine = new Konva.Line({
        points: [obj.p1.x, obj.p1.y, obj.p2.x, obj.p2.y, obj.p3.x, obj.p3.y],
        fill: props.stroke,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke
    })
    obj.triangle = new Konva.Line({
        points: [obj.p1.x, obj.p1.y, obj.p1.x, obj.p1.y, obj.p1.x, obj.p1.y],
        fill: props.stroke,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke,
        closed: true
    })
    obj.textbox = new Konva.Text({
        width: 200,
        // height: 200,
        fontSize: obj.fontSize,
        padding: 12,
        text: obj.text,
        wrap: 'char',
        lineHeight: 20 / 14,
        fill: props.stroke,
        hasBorders: true,
        stroke: props.stroke,
        strokeWidth: 0,
        fillAfterStrokeEnabled: true,
        x: obj.p4.x,
        y: obj.p4.y
    })
    const textBbox = obj.textbox.getSelfRect()
    obj.textBg = new Konva.Rect({
        cornerRadius: 4,
        fill: props.fill,
        strokeWidth: props.strokeWidth,
        stroke: props.stroke,
        x: obj.p4.x,
        y: obj.p4.y,
        width: 200,
        height: textBbox.height
    })
    obj.textBg.name('textBg')
    obj.group = new Konva.Group({
        selectable: true,
        // x: obj.p1.x,
        draggable: true
    })
    obj.group.name(obj.id)
    obj.group.add(obj.leadLine)
    obj.group.add(obj.triangle)
    obj.group.add(obj.textBg)
    obj.group.add(obj.textbox)
    obj.layer.add(obj.group)
    obj.update = update
    return obj
}
