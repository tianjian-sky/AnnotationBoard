import Konva from 'konva'

export class CloudLine {
    pointStart: { x: 0; y: 0 }
    pointEnd: { x: 0; y: 0 }
    line: any
    lineOpt: any
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
        this.line = new Konva.Line({
            points: [
                ...this.getPoints(this.pointStart.x, this.pointEnd.x, this.pointStart.y, false, true),
                ...this.getPoints(this.pointStart.y, this.pointEnd.y, this.pointEnd.x, true, true),
                ...this.getPoints(this.pointEnd.x, this.pointStart.x, this.pointEnd.y, false, false),
                ...this.getPoints(this.pointEnd.y, this.pointStart.y, this.pointStart.x, true, false)
            ],
            ...this.lineOpt
        })
        this.layer.add(this.line)
    }
    isAncestorOf(graph) {
        if (!graph) return false
        else {
            const src = this.line
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
    openSelect() {
        this.addTransformer()
    }
    closeSelect() {
        this.removeTransFormer()
    }
    addTransformer() {
        if (this.tr) {
            this.tr.nodes([this.line])
        } else {
            this.tr = new Konva.Transformer({
                nodes: [this.line],
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
    getPoints(begin, end, offset = 0, yAxis = false, dir = true) {
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
    update(pt) {
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
            ...this.getPoints(p1.x, p2.x, p1.y, false, true),
            ...this.getPoints(p1.y, p2.y, p2.x, true, true),
            ...this.getPoints(p2.x, p1.x, p2.y, false, false),
            ...this.getPoints(p2.y, p1.y, p1.x, true, false)
        ])
        this.tr?.forceUpdate()
    }
    finish() { }
}
