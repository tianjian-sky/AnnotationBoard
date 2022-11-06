<template>
    <div class="annotation-toolbar">
        <div class="annotation-toolbar-group" v-for="(group, index) in configs" :key="index">
            <ToolbarItem v-for="item in group" :key="item.type" :actives="actives" :menu="item" @menu-click="handleMenuClick">
                <template v-for="(item, key) in getMenuSlots(item)" #[key]>
                    <slot :name="key"></slot>
                </template>
            </ToolbarItem>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ATTACHMENT_ANNOTATION_BTN_TOOLS_CONFIGS } from './toolbarConfig'
import ToolbarItem from './ToolbarItem.vue'
export default defineComponent({
    name: 'Toolbar',
    props: {
        actives: {
            type: Array,
            default: () => []
        },
        configs: {
            type: Array,
            default: () => ATTACHMENT_ANNOTATION_BTN_TOOLS_CONFIGS
        }
    },
    components: { ToolbarItem },
    emits: ['menu_click'],
    setup(props, { emit, slots }) {
        const getMenuSlots = function (menu) {
            const obj = {}
            if (menu.slot && slots[menu.slot]) {
                obj[menu.slot] = slots[menu.slot]
            }
            if (menu.iconSlot && slots[menu.iconSlot]) {
                obj[menu.iconSlot] = slots[menu.iconSlot]
            }
            return obj
        }
        const handleMenuClick = function (menu) {
            emit('menu_click', menu)
        }
        return {
            handleMenuClick,
            getMenuSlots,
            ATTACHMENT_ANNOTATION_BTN_TOOLS_CONFIGS
        }
    }
})
</script>

<style lang="scss">
.annotation-toolbar {
    .annotation-toolbar-group {
        position: relative;
        display: inline-flex;
        background: rgba(246, 249, 252, 0.9);
        &::after {
            position: absolute;
            width: 1px;
            height: 12px;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            content: ' ';
            background: #9daac2;
        }
        &:last-child {
            &::after {
                display: none;
            }
        }
    }
}
</style>
