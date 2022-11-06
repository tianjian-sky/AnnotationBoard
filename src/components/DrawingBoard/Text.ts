import Konva from 'konva'

export class Text {
    pointStart: { x: 0; y: 0 }
    pointEnd: { x: 0; y: 0 }
    group: any
    graph: any
    tr: any
    text: any
    graphOpt: any
    layer: any
    inputContainer: any
    props: any
    inputEl: any
    constructor(props) {
        this.props = props
        this.inputContainer = props.inputContainer
        this.layer = props.layer
        this.pointStart = this.pointEnd = { x: props.left, y: props.top }
        this.text = props.text
        this.graphOpt = {
            fontSize: props.fontSize,
            padding: props.padding || 12,
            wrap: props.wrap || 'char',
            fill: props.fillColor
        }
        this.graph = new Konva.Text({
            fontSize: this.graphOpt.fontSize,
            padding: this.graphOpt.padding,
            text: this.text,
            wrap: this.graphOpt.wrap,
            fill: this.graphOpt.fill,
            hasBorders: true,
            fillAfterStrokeEnabled: true,
        })
        this.group = new Konva.Group({
            selectable: true,
            x: this.pointStart.x,
            y: this.pointStart.y,
            draggable: true
        })
        this.group.add(this.graph)
        this.layer.add(this.group)
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
    edit(bol) {
        if (bol) {
            const input = document.createElement('textarea')
            this.inputContainer.appendChild(input)
            input.className = 'floating-textarea'
            input.style.left = this.pointStart.x + 'px'
            input.style.top = this.pointStart.y + 'px'
            input.value = this.text || ''
            input.onblur = () => {
                this.edit(false)
            }
            this.inputEl = input
        } else {
            this.text = this.inputEl.value || ''
            this.inputContainer.removeChild(this.inputEl)
            this.inputEl = null
            this.graph.setAttr('text', this.text)
        }
    }
    update(pt) {
        this.tr?.forceUpdate()
    }
    finish() { }
}
