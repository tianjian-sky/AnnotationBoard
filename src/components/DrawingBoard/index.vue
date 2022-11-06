/*
 * @Author: yutianjian
 * @Date: 2022-11-06 13:17:10 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-11-06 15:02:57
 */
<template>
    <div class="drawing-board flex-column">
        <div ref="canvasEl" class="main">
            <!-- <div class="bg-switch">
                <label class="label">显示图纸底图</label>
                <a-switch v-model:checked="showBg" />
            </div> -->
            <div id="drawing-board-canvas"></div>
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
import { ref, defineComponent, onMounted } from 'vue'
import Toolbar from '../Toolbar.vue'
import { ANNOTATION_BTN_TOOL_ENUMS } from '../toolbarConfig'
import AnnotationColorPicker from '../AnnotationColorPicker.vue'
import { Arrow } from './Arrow'
import { CloudLine } from './CloudLine'
import { Eclipse } from './Eclipse'
import { LeadAnnotation } from './LeadAnnotation'
import { Rect } from './Rect'
import { Text } from './Text'
import Konva from 'konva'

export default defineComponent({
    name: 'drawingBoard',
    props: {},
    emits: ['close'],
    components: { Toolbar, AnnotationColorPicker },
    setup(props, { emit }) {
        const canvasEl = ref(null)
        const canvas = ref(null)
        const layer = ref(null)
        const currentCmd = ref(null)
        const activeMenus = ref([ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MIN, ANNOTATION_BTN_TOOL_ENUMS.STROKE_WIDTH_MIN])
        const color = ref('#cf5433')
        const fontSize = ref(12)
        const fontSizes = ref([12, 14, 16])
        const fillColor = ref('#e2e6f0')
        const lineWidth = ref(2)
        const lineWidths = ref([2, 4, 6])
        const showBg = ref(false)
        const drawList = []
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
                    name: '上一步'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.REDO,
                    icon: '#icon-a-turnright',
                    name: '下一步'
                }
            ]
        ])
        const lineWidthSelection = ref([2, 4, 6])
        const currentDrawing = ref(null)
        const currentSelectDrawing = ref(null)
        const initCanvas = function () {
            const el = canvasEl.value
            canvas.value = new Konva.Stage({
                container: 'drawing-board-canvas',
                width: el.clientWidth,
                height: el.clientHeight
            })

            layer.value = new Konva.Layer()
            canvas.value.add(layer.value)
            initCanvasEvents(canvas.value)
        }
        const initCanvasEvents = function (canvas) {
            canvas.on('mousedown', onMouseDown)
            canvas.on('mousemove', onMouseMove)
            canvas.on('mouseup', onMouseUp)
        }
        const handleClose = function () {
            emit('close')
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
                    break
                case ANNOTATION_BTN_TOOL_ENUMS.REDO:
                    break
            }
        }
        const handleSave = function () {}
        const handleUpload = function () {}
        const handleSelect = function (x, y) {
            const intersect = layer.value.getIntersection({
                x,
                y
            })
            let hit = false
            console.log('intersect', intersect)
            for (const drawItem of drawList) {
                const isAnseter = drawItem.isAncestorOf(intersect)
                console.log(drawItem, intersect, isAnseter)
                if (isAnseter) {
                    if (currentSelectDrawing.value && currentSelectDrawing.value !== drawItem) {
                        currentSelectDrawing.value.closeSelect()
                    }
                    currentSelectDrawing.value = drawItem
                    currentSelectDrawing.value.openSelect()
                    hit = true
                    break
                }
            }
            if (!hit) {
                currentSelectDrawing.value?.closeSelect()
                currentSelectDrawing.value = null
            }
        }
        const onMouseDown = function (e) {
            const cmd = currentCmd.value
            console.log('onMouseDown', e, cmd)
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ECLIPSE) {
                currentDrawing.value = new Eclipse({
                    backgroundColor: fillColor.value,
                    borderColor: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.RECTANGLE) {
                currentDrawing.value = new Rect({
                    backgroundColor: fillColor.value,
                    borderColor: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.ARROW) {
                currentDrawing.value = new Arrow({
                    backgroundColor: fillColor.value,
                    borderColor: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.CLOUD_LINE) {
                currentDrawing.value = new CloudLine({
                    backgroundColor: fillColor.value,
                    borderColor: color.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    layer: layer.value,
                    strokeWidth: lineWidth.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.GRAFFITI) {
                currentDrawing.value = new Konva.Line({
                    stroke: color.value,
                    strokeWidth: lineWidth.value,
                    lineCap: 'round',
                    lineJoin: 'round',
                    layer: layer.value,
                    points: [e.evt.offsetX, e.evt.offsetY, e.evt.offsetX, e.evt.offsetY]
                })
                layer.value.add(currentDrawing.value)
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.TEXT) {
                currentDrawing.value = new Text({
                    inputContainer: canvasEl.value,
                    left: e.evt.offsetX,
                    top: e.evt.offsetY,
                    fontSize: fontSize.value,
                    text: '',
                    padding: 12,
                    wrap: 'char',
                    fillColor: fillColor.value,
                    layer: layer.value
                })
            }
            if (cmd === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION) {
                currentDrawing.value = new LeadAnnotation({
                    inputContainer: canvasEl.value,
                    backgroundColor: fillColor.value,
                    borderColor: color.value,
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
            // console.log('onMouseMove', Ke, cmd, currentDrawing.value)
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
                    const pts = obj.points()
                    obj.points(pts.concat([e.evt.offsetX, e.evt.offsetY]))
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
                currentDrawing.value.edit(true)
                drawList.push(currentDrawing.value)
                currentDrawing.value = null
                currentCmd.value = null
                const menuIndex = activeMenus.value.indexOf(cmd)
                activeMenus.value.splice(menuIndex, 1)
            } else if (cmd === ANNOTATION_BTN_TOOL_ENUMS.LEAD_ANNOTATION) {
                currentDrawing.value.edit(true)
                drawList.push(currentDrawing.value)
                currentDrawing.value = null
                currentCmd.value = null
                const menuIndex = activeMenus.value.indexOf(cmd)
                activeMenus.value.splice(menuIndex, 1)
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
                    drawList.push(currentDrawing.value)
                    currentDrawing.value = null
                }
                const menuIndex = activeMenus.value.indexOf(cmd)
                activeMenus.value.splice(menuIndex, 1)
                currentCmd.value = null
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
            toolbarConfigs,
            onMouseDown,
            onMouseMove,
            onMouseUp
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