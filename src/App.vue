<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: liushuhao
 * @Date: 2021-09-06 09:45:12
 * @LastEditors: liushuhao
 * @LastEditTime: 2021-09-13 15:48:35
-->
<template>
    <div id="app">
        <DrawingBoard />
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DrawingBoard from './components/DrawingBoard/index.vue'
export default defineComponent({
    name: 'app',
    components: { DrawingBoard }
})
</script>
<style lang="less">
#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: transparent;
    position: relative;
}
</style>
