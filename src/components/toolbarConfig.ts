export const enum ANNOTATION_BTN_TOOL_ENUMS {
    SELECT,
    TEXT,
    LEAD_ANNOTATION,
    GRAFFITI,
    CLOUD_LINE,
    ECLIPSE,
    RECTANGLE,
    ARROW,
    COLOR_PICKOR,
    STROKE_COLOR_PICKER,
    FILL_COLOR_PICKER,
    STROKE_WIDTH,
    STROKE_WIDTH_MIN,
    STROKE_WIDTH_MID,
    STROKE_WIDTH_MAX,
    FONT_SIZE,
    FONT_SIZE_MIN,
    FONT_SIZE_MID,
    FONT_SIZE_MAX,
    BATCH_DRAW,
    UNDO,
    REDO
}

export const ANNOTATION_BTN_TOOLS_CONFIGS = [
    [
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
            type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_COLOR_PICKER,
            icon: '#icon-a-colorpickup',
            slot: 'colorPicker',
            name: '颜色'
        },
        {
            type: ANNOTATION_BTN_TOOL_ENUMS.BATCH_DRAW,
            icon: '#icon-a-batchannotation-off',
            name: '批量绘制',
            activeIcon: '#icon-a-batchannotation-on'
        }
    ]
]

export const ATTACHMENT_ANNOTATION_BTN_TOOLS_CONFIGS = [
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
                    html: '小'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MID,
                    html: '中'
                },
                {
                    type: ANNOTATION_BTN_TOOL_ENUMS.FONT_SIZE_MAX,
                    html: '大'
                }
            ]
        },
        {
            type: ANNOTATION_BTN_TOOL_ENUMS.STROKE_COLOR_PICKER,
            html: '<label class="color-example"></label>',
            name: '颜色',
            slot: 'colorPicker'
        },
        {
            type: ANNOTATION_BTN_TOOL_ENUMS.FILL_COLOR_PICKER,
            html: '<label class="fill-color-example"></label>填充',
            name: '填充',
            slot: 'fillColorPicker'
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
            icon: 'icon-a-turnright',
            name: '下一步'
        }
    ]
]
