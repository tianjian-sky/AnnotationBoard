import Konva from 'konva'

export class Arrow {
    pointStart: { x: 0; y: 0 }
    pointEnd: { x: 0; y: 0 }
    group: any
    triangle: any
    line: any
    lineOpt: any
    triangleOpt: any
    tr: any
    layer: any
    constructor(props) {
        this.layer = props.layer
        this.pointStart = this.pointEnd = { x: props.left, y: props.top }
        this.lineOpt = {
            fill: props.backgroundColor,
            strokeWidth: props.strokeWidth,
            stroke: props.borderColor
        }
        this.triangleOpt = {
            fill: props.backgroundColor,
            strokeWidth: props.strokeWidth,
            stroke: props.borderColor,
            closed: true
        }
        this.line = new Konva.Line({
            points: [0, 0, 0, 0],
            ...this.lineOpt
        })
        this.triangle = new Konva.Line({
            points: [0, 0, 0, 0, 0, 0],
            ...this.triangleOpt
        })
        this.group = new Konva.Group({
            selectable: true,
            x: this.pointStart.x,
            y: this.pointStart.y,
            draggable: true
        })
        this.group.add(this.line)
        this.group.add(this.triangle)
        this.layer.add(this.group)
    }
    openSelect() {
        this.addTransformer()
    }
    closeSelect() {
        this.removeTransFormer()
    }
    addTransformer() {
        if (this.tr) {
            this.tr.nodes([this.group])
        } else {
            this.tr = new Konva.Transformer({
                nodes: [this.group],
                keepRatio: false,
                boundBoxFunc: (oldBox, newBox) => {
                    return newBox
                }
            })
        }
        this.layer.add(this.tr)
    }
    removeTransFormer() {
        this.tr.remove()
        this.tr.detach()
    }
    isAncestorOf(graph) {
        if (!graph) return false
        else {
            const src = this.group
            let target = graph
            while (target != this.layer) {
                if (target._id === src._id) {
                    return true
                } else {
                    target = target.parent
                }
            }
            return false
        }
    }
    update(pt) {
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
    finish() { }
}
