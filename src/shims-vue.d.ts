/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
interface Window {
    __POWERED_BY_QIANKUN__: any
    __CBIM_PLATFORM_APPLICATION_BOOT_DATA__: any
}
interface mountProps {
    application?: any
    container: any
    globalStore?: any
    mountParcel?: any
    name?: string
    onGlobalStateChange?: any
    setGlobalState?: any
    singleSpa?: any
    startMicroCbimAcp?: any
    registry?: any
    user?: any
}
