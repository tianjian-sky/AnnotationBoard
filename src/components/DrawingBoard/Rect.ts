import Konva from 'konva'

export class Rect {
    pointStart: { x: 0; y: 0 }
    pointEnd: { x: 0; y: 0 }
    graph: any
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
        this.graph = new Konva.Rect({
            x: this.pointStart.x,
            y: this.pointStart.y,
            width: this.pointEnd.x - this.pointStart.x,
            height: this.pointEnd.y - this.pointStart.y,
            ...this.lineOpt
        })
        this.layer.add(this.graph)
    }
    isAncestorOf(graph) {
        if (!graph) return false
        else {
            const src = this.graph
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
            this.tr.nodes([this.graph])
        } else {
            this.tr = new Konva.Transformer({
                nodes: [this.graph],
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
        const width = this.pointEnd.x - this.pointStart.x
        const height = this.pointEnd.y - this.pointStart.y
        this.graph.setAttrs({
            width,
            height
        })
        this.tr?.forceUpdate()
    }
    finish() { }
}
