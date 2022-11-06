import Konva from 'konva'

export class LeadAnnotation {
    p1 = { x: 0, y: 0 }
    p2 = { x: 0, y: 0 }
    p3 = { x: 0, y: 0 }
    p4 = { x: 0, y: 0 }
    group: any
    fontSize: any
    triangle: any
    leadLine: any
    textbox: any
    textBg: any
    tr: any
    layer: any
    text: string
    inputContainer: any
    inputEl: any
    props: any
    constructor(props) {
        this.props = props
        this.inputContainer = props.inputContainer
        this.layer = props.layer
        this.fontSize = props.fontSize
        this.text = props.text || ''
        this.p1 = this.p2 = { x: props.left, y: props.top }
        this.p3 = { x: this.p2.x + 45, y: this.p2.y }
        this.p4 = { x: this.p3.x, y: this.p3.y - 22 }
        this.leadLine = new Konva.Line({
            points: [this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y],
            fill: props.borderColor,
            strokeWidth: props.strokeWidth,
            stroke: props.borderColor
        })
        this.triangle = new Konva.Line({
            points: [this.p1.x, this.p1.y, this.p1.x, this.p1.y, this.p1.x, this.p1.y],
            fill: props.borderColor,
            strokeWidth: props.strokeWidth,
            stroke: props.borderColor,
            closed: true
        })
        this.textbox = new Konva.Text({
            width: 200,
            // height: 200,
            fontSize: this.fontSize,
            padding: 12,
            text: this.text,
            wrap: 'char',
            lineHeight: 20 / 14,
            fill: props.borderColor,
            hasBorders: true,
            stroke: props.borderColor,
            strokeWidth: props.strokeWidth,
            fillAfterStrokeEnabled: true,
            x: this.p4.x,
            y: this.p4.y
        })
        const textBbox = this.textbox.getSelfRect()
        this.textBg = new Konva.Rect({
            cornerRadius: 4,
            fill: props.backgroundColor,
            strokeWidth: props.strokeWidth,
            stroke: props.borderColor,
            x: this.p4.x,
            y: this.p4.y,
            width: 200,
            height: textBbox.height
        })
        this.group = new Konva.Group({
            selectable: true,
            // x: this.p1.x,
            draggable: true
        })
        this.group.add(this.leadLine)
        this.group.add(this.triangle)
        this.group.add(this.textBg)
        this.group.add(this.textbox)
        this.layer.add(this.group)
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
                nodes: [this.leadLine, this.triangle, this.textbox],
                keepRatio: false,
                boundBoxFunc: (oldBox, newBox) => {
                    return newBox
                }
            })
        }
        this.layer.add(this.tr)
        // this.layer.add(new Konva.Transformer({
        //     nodes: [this.leadLine],
        //     keepRatio: false,
        //     boundBoxFunc: (oldBox, newBox) => {
        //         return newBox
        //     }
        // }))
        // this.layer.add(new Konva.Transformer({
        //     nodes: [this.triangle],
        //     keepRatio: false,
        //     boundBoxFunc: (oldBox, newBox) => {
        //         return newBox
        //     }
        // }))
        // this.layer.add(new Konva.Transformer({
        //     nodes: [this.textbox],
        //     keepRatio: false,
        //     boundBoxFunc: (oldBox, newBox) => {
        //         return newBox
        //     }
        // }))
    }
    removeTransFormer() {
        this.tr?.remove()
        this.tr?.detach()
    }
    edit(bol) {
        if (bol) {
            const input = document.createElement('textarea')
            this.inputContainer.appendChild(input)
            input.className = 'floating-textarea'
            input.style.left = this.p4.x + 'px'
            input.style.top = this.p4.y + 'px'
            input.style.borderRadius = '4px'
            input.style.lineHeight = (20 / 14) + ''
            input.style.padding = '12px'
            input.style.border = `${this.props.strokeWidth}px solid ${this.props.borderColor}`
            input.value = this.text || ''
            input.onblur = () => {
                this.edit(false)
            }
            this.inputEl = input
        } else {
            this.text = this.inputEl.value || ''
            this.inputContainer.removeChild(this.inputEl)
            this.inputEl = null
            this.textbox.setAttr('text', this.text)
            this.textBg.setAttrs({
                height: this.textbox.getSelfRect().height
            })
        }
    }
    update(pt) {
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
}
