/*
 * @Author: yutianjian
 * @Date: 2022-11-06 14:40:15 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-11-06 14:51:17
 */

import { createApp } from 'vue'
import '@/assets/css/reset.css'
import '@/assets/css/var.scss'
import '@/assets/css/style.scss'
import Antd from 'ant-design-vue'
import utilsTools from '@/assets/utils/utilsTools'
import App from './App.vue'
import '@/assets/utils/rem.js'


let instance: any = null

instance = createApp(App)
instance
    .use(utilsTools)
    .use(Antd)
    .mount('#home')