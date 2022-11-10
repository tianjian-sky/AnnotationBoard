import Konva from 'konva'

export function drawText(props) {
    const obj: any = {}
    obj.props = props
    obj.id = `Text-${new Date().getTime()}`
    obj.inputContainer = props.inputContainer
    obj.layer = props.layer
    obj.pointStart = obj.pointEnd = { x: props.left, y: props.top }
    obj.text = props.text
    obj.editComplete = props.editComplete || (() => { })
    obj.graphOpt = {
        fontSize: props.fontSize,
        padding: props.padding || 12,
        wrap: props.wrap || 'char',
        fill: props.fill
    }
    obj.graph = new Konva.Text({
        fontSize: obj.graphOpt.fontSize,
        padding: obj.graphOpt.padding,
        text: obj.text,
        wrap: obj.graphOpt.wrap,
        fill: obj.graphOpt.fill,
        hasBorders: true,
        x: obj.pointStart.x,
        y: obj.pointStart.y,
        fillAfterStrokeEnabled: true,
    })
    // obj.group = new Konva.Group({
    //     selectable: true,

    //     draggable: true
    // })
    obj.graph.name(obj.id)
    obj.layer.add(obj.graph)
    return obj
}
