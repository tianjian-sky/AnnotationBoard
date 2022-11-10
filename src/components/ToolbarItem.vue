<template>
    <div class="annotation-toolbar-item" :class="{active: isActive(menu), disabled: menu.disabled}" @click.stop="handleClick(menu)">
        <a-tooltip :enterable="false" :show-after="50" :content="`${menu.name}`" :placement="menu.trigger == 'hover'?'left':'top'">
            <a class="content">
                <template v-if="menu.icon">
                    <div class="menu-icon">
                        <svg v-if="/^\#/.test(menu.icon)" class="icon-svg">
                            <use :xlink:href="`${menu.icon}`"></use>
                        </svg>
                        <i v-else class="iconfont" :class="menu.icon"></i>
                    </div>
                </template>
                <slot v-else-if="menu.iconSlot" :name="menu.iconSlot"></slot>
                <div v-else v-html="menu.html || menu.name"></div>
                <div v-if="menu.subs && (menu?.trigger === 'hover')" class="subs" :class="{show: isActive(menu), hoverShow: menu?.trigger === 'hover'}">
                    <div class="annotation-toolbar-item" :class="{active: isActive(sub), disabled: menu.disabled}" v-for="sub in menu.subs" :key="sub.type" @click.stop="handleClick(sub)">
                        <a class="content">
                            <slot :name="sub.slot" v-if="sub.slot"></slot>
                            <template v-else-if="sub.icon">
                                <div class="menu-icon">
                                    <svg v-if="/^\#/.test(sub.icon)" class="icon-svg">
                                        <use :xlink:href="`${sub.icon}`"></use>
                                    </svg>
                                    <i v-else class="iconfont" :class="sub.icon"></i>
                                </div>
                            </template>
                            <div v-else v-html="sub.html || sub.name"></div>
                        </a>
                    </div>
                </div>
                <div v-if="menu.slot && isActive(menu)" class="component">
                    <slot :name="menu.slot" />
                </div>
            </a>
        </a-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
    name: 'ToolbarItem',
    props: {
        menu: {
            type: Object
        },
        actives: {
            type: Array
        },
        slots: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['menu-click'],
    setup(props, { emit }) {
        const isActive = menu => {
            return props.actives.includes(menu.type) && !menu.disabled
        }
        const handleClick = function (menu) {
            if (menu?.trigger !== 'hover') {
                emit('menu-click', menu)
            }
        }
        return {
            isActive,
            handleClick
        }
    }
})
</script>

<style lang="scss">
.annotation-toolbar-item {
    position: relative;
    padding: 10px;
    font-size: 12px;
    color: #6d7b98;
    border-radius: 4px;
    .component {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -100%);
    }
    .icon-svg {
        width: 20px;
        height: 20px;
        use {
            --c1: #6d7b98;
            --c2: #c9d2e1;
        }
    }
    &.active > .content > .menu-icon > .icon-svg,
    &:hover > .content > .menu-icon > .icon-svg {
        use {
            --c1: #f65d30;
            --c2: #fccec0;
        }
    }
    &.active,
    &:hover {
        background: #fff;
        color: #f65d30;
    }
    &.disabled {
        color: #ccc !important;
        background: initial !important;
        cursor: not-allowed !important;
        .icon-svg {
            use {
                --c1: #ccc;
                --c2: #eee;
            }
        }
        &:hover > .content > .menu-icon > .icon-svg {
            use {
                --c1: #ccc;
                --c2: #eee;
            }
        }
    }
    .subs {
        display: none;
        position: absolute;
        left: 50%;
        top: 0;
        background: rgba(246, 249, 252, 0.9);
        transform: translateX(-50%) translateY(calc(-100%));
        padding-bottom: 4px;
        &.show {
            display: block;
        }
    }
    &:hover {
        .subs.hoverShow {
            display: block;
        }
    }
    .stroke-example {
        display: inline-block;
        width: 20px;
        height: 2px;
        background: #6d7b98;
        border-radius: 1px;
        &.mid {
            height: 4px;
        }
        &.max {
            height: 6px;
        }
    }
}
</style>
