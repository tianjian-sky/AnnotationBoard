<template>
    <div class="annotation-color-picker flex-row" @click.stop>
        <div v-for="(color, index) in colors" :key="color" class="color" :class="[selectIndex == index ? 'active' : '']" :style="{background: color}" @click="handleSelect(index)"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

const COLOR_LIST = [
    '#cf5433',
    '#df9c36',
    '#50aa82',
    '#327491',
    '#2e6be3',
    '#563ee2',
    '#d95681',
    '#495168',
    '#ef875d',
    '#f6c94d',
    '#6dd3a1',
    '#63d0dd',
    '#4b97f7',
    '#896cf7',
    '#ee809e',
    '#9faac0',
    '#f4b795',
    '#fae272',
    '#a2fccd',
    '#8bf9fa',
    '#79dbef',
    '#bea9f9',
    '#f4b8c5',
    '#e2e6f0'
]

export default defineComponent({
    name: 'AnnotationColorPicker',
    props: {
        color: {
            type: String,
            default: '#ef875d'
        }
    },
    emits: ['update:color'],
    setup(props, { emit }) {
        const selectIndex: Ref<number> = ref(0)
        const show = ref(false)
        const colors = COLOR_LIST
        const handleSelect = function (index: number) {
            selectIndex.value = index
        }
        if (props.color) {
            selectIndex.value = colors.findIndex(item => item === props.color.toLowerCase())
        }
        watch(selectIndex, val => {
            emit('update:color', colors[val])
        })
        onBeforeUnmount(() => {})
        return {
            colors,
            handleSelect,
            selectIndex,
            show
        }
    }
})
</script>

<style lang="scss" scoped>
.annotation-color-picker {
    margin-bottom: 8px;
    width: 344px;
    height: 144px;
    padding: 16px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background: rgba(246, 249, 252, 0.9);
    border-radius: 2px;
    box-shadow: -8px 0px 16px 0px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(30px);
    .color {
        margin-right: 8px;
        flex: 0 0 30px;
        height: 30px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #cad2df;
        &.active {
            border: 2px solid #f65d30;
        }
        &:nth-child(8n) {
            margin-right: 0;
        }
    }
}
</style>
