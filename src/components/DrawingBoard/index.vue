/*
 * @Author: yutianjian
 * @Date: 2022-11-06 13:17:10 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-11-10 08:29:57
 */
<template>
    <div class="drawing-board flex-column">
        <div class="header">
            <label>
                <a class="iconfont iconarrow-left" @click="handleClose"></a>
                <span class="title">手绘附件</span>
            </label>
            <label>
                <a-button class="margin-right-12" @click="handleSave">保存至本地</a-button>
                <a-button @click="handleUpload" type="primary">上传附件</a-button>
            </label>
        </div>
        <div ref="canvasEl" class="main">
            <div id="drawing-board-canvas"></div>
            <div class="bg-switch">
                <label class="label">显示图纸底图</label>
                <a-switch v-model:checked="showBg" @change="toggleBg" />
            </div>
            <textarea class="floating-textarea" v-model="textInput.val" :style="{left: textInput.left + 'px', top: textInput.top + 'px', border: `${lineWidth}px solid ${color}`}" @blur="handleTextInput"></textarea>
        </div>
        <div class="toolbar-wrap">
            <Toolbar :actives="activeMenus" @menu_click="handleMenuClick" :configs="toolbarConfigs">
                <template #colorPickerTrigger>
                    <a-popover placement="top">
                        <label class="color-trigger" :style="{background: fillColor}"></label>
                        <template #content>
                            <AnnotationColorPicker v-model:color="fillColor" />
                        </template>
                    </a-popover>
                    <label class="margin-left-4">填充</label>
                </template>
                <template #colorPickerStrokeTrigger>
                    <a-popover placement="top">
                        <label class="color-trigger" :style="{background: color}"></label>
                        <template #content>
                            <AnnotationColorPicker v-model:color="color" />
                        </template>
                    </a-popover>
                </template>
            </Toolbar>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, watch } from 'vue'
import Toolbar from '../Toolbar.vue'
import { ANNOTATION_BTN_TOOL_ENUMS } from '../toolbarConfig'
import AnnotationColorPicker from '../AnnotationColorPicker.vue'
import { drawArrow } from './Arrow'
import { drawCloudLine } from './CloudLine'
import { drawEclipse } from './Eclipse'
import { drawLeadAnnotation } from './LeadAnnotation'
import { drawRect } from './Rect'
import { drawText } from './Text'
import { drawPostilLine } from './PostilLine'
import Konva from 'konva'

export default defineComponent({
    name: 'drawingBoard',
    props: {
        backgroundImage: {
            type: String,
            default: ''
        }
    },
    emits: ['close', 'upload'],
    components: { Toolbar, AnnotationColorPicker },
    setup(props, { emit }) {
        const canvasEl = ref(null)
        const canvas = ref(null)
        const layer = ref(null)
        const transformer = ref(null)
        const currentCmd = ref(null)
        const activeMenus = ref([ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN, ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN])
        const color = ref('#cf5433')
        const fontSize = ref(12)
        const fontSizes = ref([12, 14, 16])
        const fillColor = ref('#e2e6f0')
        const lineWidth = ref(2)
        const lineWidths = ref([2, 4, 6])
        const showBg = ref(false)
        const bgLayer = ref(null)
        const bg = ref(null)
        const timer = {
            history: null
        }
        const textInput = ref({
            show: false,
            left: -999,
            top: -999,
            val: '',
            graphId: ''
        })
        const undoStack = ref([])
        const redoStack = ref([])
        const toolbarConfigs = ref([
            [
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.SELECT,
                    icon: '#icon-select',
                    name: '选择工具'
                }
            ],
            [
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.TEXT,
                    icon: '#icon-a-writtenwords',
                    name: '文字'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION,
                    icon: '#icon-a-textframe',
                    name: '批注'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.GRAFFITI,
                    icon: '#icon-graffiti',
                    name: '手绘'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.ECLIPSE,
                    icon: '#icon-circular',
                    name: '圆形'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.RECTANGLE,
                    icon: '#icon-rectangle',
                    name: '方形'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.ARROW,
                    icon: '#icon-a-straightline',
                    name: '箭头'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.CLOUD_LINE,
                    icon: '#icon-moire',
                    name: '云线'
                }
            ],
            [
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH,
                    icon: '#icon-a-linethickness',
                    trigger: 'hover',
                    name: '粗细',
                    subs: [
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN,
                            html: '<label class="stroke-example min"></label>',
                            defaultActive: true,
                            name: '细'
                        },
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID,
                            html: '<label class="stroke-example mid"></label>',
                            name: '中'
                        },
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX,
                            html: '<label class="stroke-example max"></label>',
                            name: '粗'
                        }
                    ]
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE,
                    icon: '#icon-a-textsize',
                    trigger: 'hover',
                    name: '文字大小',
                    subs: [
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN,
                            defaultActive: true,
                            html: '<div class="font">小</div>'
                        },
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID,
                            html: '<div class="font">中</div>'
                        },
                        {
                            type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX,
                            html: '<div class="font">大</div>'
                        }
                    ]
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.FILL_COLOR_PICKER,
                    name: '填充',
                    iconSlot: 'colorPickerTrigger'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_COLOR_PICKER,
                    name: '颜色',
                    iconSlot: 'colorPickerStrokeTrigger'
                }
            ],
            [
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.UNDO,
                    icon: '#icon-a-turnleft',
                    name: '上一步',
                    disabled: true
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.REDO,
                    icon: '#icon-a-turnright',
                    name: '下一步',
                    disabled: true
                }
            ]
        ])
        watch([() => [...undoStack.value], () => [...redoStack.value]], ([curUndo, curRedo]) => {
            const undoMenu: any = toolbarConfigs.value[3][0]
            const redoMenu: any = toolbarConfigs.value[3][1]
            undoMenu.disabled = curUndo.length < 2
            redoMenu.disabled = curRedo.length === 0
        })
        const currentDrawing = ref(null)
        const initCanvas = function () {
            const el = canvasEl.value
            canvas.value = new Konva.Stage({
                container: 'drawing-board-canvas',
                width: el.clientWidth,
                height: el.clientHeight
            })
            bgLayer.value = new Konva.Layer()
            bgLayer.value.name('bgLayer')
            layer.value = new Konva.Layer()
            layer.value.name('layer')
            canvas.value.add(bgLayer.value)
            canvas.value.add(layer.value)
            initCanvasEvents(canvas.value)
            saveHistory()
        }
        const initCanvasEvents = function (canvas) {
            canvas.on('mousedown', onMouseDown)
            canvas.on('mousemove', onMouseMove)
            canvas.on('mouseup', onMouseUp)
            canvas.on('dragend', e => {
                clearInterval(timer.history)
                timer.history = setTimeout(() => {
                    saveHistory()
                    timer.history = null
                }, 100)
            })
        }
        const handleClose = function () {
            emit('close')
        }
        const resetTextInput = function () {
            textInput.value = {
                show: false,
                left: -999,
                top: -999,
                val: '',
                graphId: ''
            }
        }
        const handleTextInput = function () {
            const id = textInput.value.graphId
            let graph = layer.value.getChildren(function (node) {
                return node.attrs.name === id
            })[0]
            if (graph) {
                if (graph.attrs.name.includes('LeadAnnotation')) {
                    const input = graph.getChildren(function (node) {
                        return node instanceof Konva.Text
                    })[0]
                    const inputBg = graph.getChildren(function (node) {
                        return (node.attrs.name = 'textBg')
                    })[0]
                    if (input) {
                        input.setAttr('text', textInput.value.val)
                        if (inputBg) {
                            inputBg.setAttrs({
                                height: input.getSelfRect().height
                            })
                        }
                    }
                } else {
                    graph.setAttr('text', textInput.value.val)
                }
            }
            const index = activeMenus.value.findIndex(type => type === ANNOTATION_BTN_TOOL_ENUMS.TEXT || type === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION)
            if (index >= 0) {
                activeMenus.value.splice(index, 1)
            }
            resetTextInput()
            saveHistory()
        }
        const handleMenuClick = function (menu) {
            const type = menu.type
            const index = activeMenus.value.indexOf(type)
            if (
                [
                    ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN,
                    ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID,
                    ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX,
                    ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN,
                    ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID,
                    ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX,
                    ANNOTATION_BTN_TOOL_ENUMS.FILL_COLOR_PICKER,
                    ANNOTATION_BTN_TOOL_ENUMS.STROKE_COLOR_PICKER,
                    ANNOTATION_BTN_TOOL_ENUMS.UNDO,
                    ANNOTATION_BTN_TOOL_ENUMS.REDO
                ].includes(type)
            ) {
                handleCmdStateless(menu)
                return
            }
            if (index >= 0) {
                activeMenus.value.splice(index, 1)
            } else {
                activeMenus.value = activeMenus.value.filter(type =>
                    [
                        ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN,
                        ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID,
                        ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX,
                        ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN,
                        ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID,
                        ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX
                    ].includes(type)
                )
                activeMenus.value.push(menu.type)
            }
            const isActive = activeMenus.value.includes(type)
            handleCmd(menu, isActive)
        }
        const handleCmd = function (menu, active) {
            const type = menu.type
            if (currentCmd.value === type) {
                currentCmd.value = ''
            } else {
                currentCmd.value = type
            }
            console.log('菜单点击', currentCmd.value)
        }
        const handleCmdStateless = function (menu) {
            const type = menu.type
            const _strokes = {
                2: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN,
                4: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID,
                6: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX
            }
            const _font = {
                12: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN,
                14: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID,
                16: ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX
            }
            switch (menu.type) {
                case ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN:
                case ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID:
                case ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX: {
                    const prevIndex = activeMenus.value.indexOf(_strokes[lineWidth.value])
                    activeMenus.value.splice(prevIndex, 1)
                    activeMenus.value.push(menu.type)
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN) {
                        lineWidth.value = 2
                    }
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MID) {
                        lineWidth.value = 4
                    }
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MAX) {
                        lineWidth.value = 6
                    }
                    break
                }
                case ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN:
                case ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID:
                case ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX: {
                    const prevIndex = activeMenus.value.indexOf(_font[fontSize.value])
                    activeMenus.value.splice(prevIndex, 1)
                    activeMenus.value.push(menu.type)
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN) {
                        fontSize.value = 12
                    }
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID) {
                        fontSize.value = 14
                    }
                    if (menu.type === ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX) {
                        fontSize.value = 16
                    }
                    break
                }
                case ANNOTATION_BTN_TOOL_ENUMS.FILL_COLOR_PICKER:
                    break
                case ANNOTATION_BTN_TOOL_ENUMS.STROKE_COLOR_PICKER:
                    break
                case ANNOTATION_BTN_TOOL_ENUMS.UNDO:
                    undo()
                    break
                case ANNOTATION_BTN_TOOL_ENUMS.REDO:
                    redo()
                    break
            }
        }
        const handleSave = function () {
            const url = canvas.value.toDataURL()
            let anchor = document.createElement('a')
            anchor.download = '附件批注_' + new Date().getTime()
            anchor.href = url
            document.body.appendChild(anchor)
            anchor.click()
            anchor.parentNode.removeChild(anchor)
            anchor = null
        }
        const handleUpload = function () {
            canvas.value.toBlob({
                callback: blob => {
                    emit('upload', blob)
                }
            })
        }
        const handleSelect = function (x, y) {
            let intersect = layer.value.getIntersection({
                x,
                y
            })
            let isSelectTransform = false
            if (intersect) {
                if (transformer.value && intersect._id === transformer.value._id) {
                    isSelectTransform = true
                }
                while (intersect.parent && intersect.parent.attrs?.name != 'layer') {
                    intersect = intersect.parent
                    if (transformer.value && intersect._id === transformer.value._id) {
                        isSelectTransform = true
                    }
                }
                if (isSelectTransform) return
                if (intersect !== currentDrawing.value) {
                    if (transformer.value) {
                        transformer.value.detach()
                        transformer.value.remove()
                        transformer.value = null
                        currentDrawing.value = null
                    }
                    currentDrawing.value = intersect
                    transformer.value = new Konva.Transformer({
                        nodes: [intersect],
                        keepRatio: false,
                        boundBoxFunc: (oldBox, newBox) => {
                            return newBox
                        }
                    })
                    // debugger
                    layer.value.add(transformer.value)
                    transformer.value.on('transform', e => {
                        console.log('transform', e)
                        clearInterval(timer.history)
                        timer.history = setTimeout(() => {
                            saveHistory()
                            timer.history = null
                        }, 500)
                    })
                }
            } else {
                if (transformer.value) {
                    console.log('detach!!!')
                    transformer.value.detach()
                    transformer.value.remove()
                    transformer.value = null
                    currentDrawing.value = null
                }
            }
        }
        const recoverHistory = function (history: any) {
            canvas.value = Konva.Node.create(history, '#drawing-board-canvas')
            bgLayer.value = canvas.value.getChildren(function (node) {
                return node.attrs.name === 'bgLayer'
            })[0]
            if (bgLayer.value.children[0] && bgLayer.value.children[0].attrs.name === 'true') {
                showBg.value = true
            } else {
                showBg.value = false
            }
            Konva.Image.fromURL(props.backgroundImage, function (image) {
                bg.value = image
                image.name('true')
                bgLayer.value.removeChildren()
                bgLayer.value.add(image)
                bg.value.visible(showBg.value)
            })
            layer.value = canvas.value.getChildren(function (node) {
                return node.attrs.name === 'layer'
            })[0]
            transformer.value = null
            initCanvasEvents(canvas.value)
        }
        const undo = function () {
            if (undoStack.value.length > 1) {
                const curItem = undoStack.value[undoStack.value.length - 1]
                const recoverItem = undoStack.value[undoStack.value.length - 2]
                redoStack.value.push(curItem)
                undoStack.value.pop()
                recoverHistory(recoverItem)
            }
        }
        const redo = function () {
            if (redoStack.value.length) {
                const item = redoStack.value.slice(-1)[0]
                undoStack.value.push(item)
                redoStack.value.pop()
                recoverHistory(item)
            }
        }
        const saveHistory = function () {
            const jsonStr = canvas.value.toJSON()
            const prev = undoStack.value.slice(-1)[0]
            if (prev && prev === jsonStr) return
            undoStack.value.push(jsonStr)
            redoStack.value = []
            console.log('undoStack:', undoStack.value, undoStack.value.length, redoStack.value.length)
        }
        const onMouseDown = function (e) {
            const cmd = currentCmd.value
            console.log('onMouseDown', e, cmd)
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ECLIPSE) {
                currentDrawing.value = drawEclipse({
                    fill: fillColor.value,
                    stroke: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.RECTANGLE) {
                currentDrawing.value = drawRect({
                    fill: fillColor.value,
                    stroke: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ARROW) {
                currentDrawing.value = drawArrow({
                    fill: color.value,
                    stroke: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.CLOUD_LINE) {
                currentDrawing.value = drawCloudLine({
                    fill: fillColor.value,
                    stroke: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.GRAFFITI) {
                currentDrawing.value = drawPostilLine({
                    stroke: color.value,
                    strokeWidth: lineWidth.value,
                    lineCap: 'round',
                    lineJoin: 'round',
                    layer: layer.value,
                    points: [e.evt.offsetX, e.evt.offsetY, e.evt.offsetX, e.evt.offsetY]
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.TEXT) {
                currentDrawing.value = drawText({
                    inputContainer: canvasEl.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    fontSize: fontSize.value,
                    text: '',
                    padding: 12,
                    wrap: 'char',
                    fill: color.value,
                    layer: layer.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION) {
                currentDrawing.value = drawLeadAnnotation({
                    inputContainer: canvasEl.value,
                    stroke: color.value,
                    fill: fillColor.value,
                    text: '',
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    fontSize: fontSize.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.SELECT) {
                handleSelect(e.evt.offsetX, e.evt.offsetY)
            }
        }
        const onMouseMove = function (e) {
            const cmd = currentCmd.value
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ECLIPSE) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.RECTANGLE) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ARROW) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.CLOUD_LINE) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.GRAFFITI) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION) {
                const obj = currentDrawing.value
                if (obj) {
                    obj.update({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY
                    })
                }
            }
        }
        const onMouseUp = function (e) {
            const cmd = currentCmd.value
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.TEXT) {
                textInput.value = {
                    show: true,
                    left: currentDrawing.value.pointStart.x,
                    top: currentDrawing.value.pointStart.y,
                    val: '',
                    graphId: currentDrawing.value.id
                }
                currentDrawing.value = null
                currentCmd.value = null
                saveHistory()
            } else if (cmd === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION) {
                textInput.value = {
                    show: true,
                    left: currentDrawing.value.p4.x,
                    top: currentDrawing.value.p4.y,
                    val: '',
                    graphId: currentDrawing.value.id
                }
                currentDrawing.value = null
                currentCmd.value = null
                saveHistory()
            } else if (
                [
                    ANNOTATION_BTN_TOOL_ENUMS.ECLIPSE,
                    ANNOTATION_BTN_TOOL_ENUMS.RECTANGLE,
                    ANNOTATION_BTN_TOOL_ENUMS.ARROW,
                    ANNOTATION_BTN_TOOL_ENUMS.CLOUD_LINE,
                    ANNOTATION_BTN_TOOL_ENUMS.GRAFFITI,
                    ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION
                ].includes(cmd)
            ) {
                if (currentDrawing.value) {
                    currentDrawing.value = null
                }
                const menuIndex = activeMenus.value.indexOf(cmd)
                activeMenus.value.splice(menuIndex, 1)
                currentCmd.value = null
                saveHistory()
            }
        }
        const toggleBg = function (open) {
            if (open) {
                if (bg.value) {
                    bg.value.visible(true)
                    bg.value.name('true')
                    saveHistory()
                } else {
                    Konva.Image.fromURL(props.backgroundImage, function (image) {
                        // Image的状态未同步到saveJSON方法，需要另外处理
                        bg.value = image
                        bg.value.name('true')
                        bgLayer.value.add(image)
                        saveHistory()
                    })
                }
            } else {
                if (bg.value) {
                    bg.value.visible(false)
                    bg.value.name('false')
                    saveHistory()
                }
            }
        }
        onMounted(() => {
            initCanvas()
        })
        return {
            canvasEl,
            activeMenus,
            color,
            fillColor,
            fontSize,
            handleClose,
            handleSave,
            handleUpload,
            handleMenuClick,
            showBg,
            textInput,
            lineWidth,
            toolbarConfigs,
            handleTextInput,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            toggleBg
        }
    }
})
</script>

<style lang="scss">
.drawing-board {
    position: fixed;
    display: flex;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: gray;
    z-index: 1000;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 0 0 56px;
        background: #fff;
        .title {
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            color: #2a334a;
            line-height: 20px;
        }
    }
    .main {
        position: relative;
        width: 100%;
        flex: 1;
        .bg-switch {
            position: absolute;
            left: 24px;
            top: 16px;
            .label {
                margin-right: 12px;
                color: #6d7b98;
                line-height: 22px;
            }
        }
    }
    .floating-textarea {
        position: absolute;
        width: 200px;
        height: 100px;
        background: rgba(246, 249, 252, 0.9);
        border-radius: 4px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.06);
        backdrop-filter: blur(30px);
        padding: 12px;
    }
    .toolbar-wrap {
        position: absolute;
        bottom: 8px;
        width: 100%;
        left: 0;
        display: flex;
        justify-content: center;
        margin: 0 12px;
        cursor: pointer;
        > * {
            flex: 0 0 auto;
        }
        .color-trigger {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #e1e6f1;
            border-radius: 1px;
            cursor: pointer;
        }
        .active .stroke-example {
            background: #f65d30;
        }
        .active .font {
            color: #f65d30;
        }
    }
}
</style>