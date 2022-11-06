/*
  @Author: lize
  @Date: 2021/6/29
  @Description :
  @Parames :
  @Example :
  @Last Modified by: lize
  @Last Modified time: 2021/6/29
*/
let UtilsTools = null

const Cookies = {
    set: function (name, value, days = 1, domain) {
        const d = new Date()
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
        const domainStr = domain ? ';domain=cbim.org.cn' : ''
        window.document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}${domainStr}`
    },
    get: function (name) {
        const v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
        return v ? v[2] : null
    },
    delete: function (name) {
        this.set(name, '', -1)
    },
    clear() {
        const keys = document.cookie.match(/[^ =;]+(?==)/g)
        if (keys) {
            for (let i = keys.length; i--;) {
                document.cookie = keys[i] + '=0; domain=cbim.org.cn; path=/; expires=' + new Date(0).toUTCString()
            }
        }
    }
}
class Utils {
    options: any = null
    cookie: any = Cookies
    constructor(options) {
        this.options = options
    }
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string): string => {
            const r = (Math.random() * 16) | 0 // eslint-disable-line
            let v = c == 'x' ? r : (r & 0x3) | 0x8 // eslint-disable-line
            return v.toString(16)
        })
    }
    getUrlParams(url?: string): any {
        const href = url || window.location.href
        const paramsStr = href.split('?')[1]
        const paramsAry = paramsStr ? paramsStr.split('&') : []
        const tem: any = {}
        for (let i = 0; i < paramsAry.length; i += 1) {
            const [key, value] = paramsAry[i].split('=')
            tem[key] = value
        }
        return tem
    }
    analysisNowUrl(): any {
        let path = window.location.hash ? window.location.hash.split('?')[0] : '#/' // eslint-disable-line
        if (path) path = path.split('#')[1] // eslint-disable-line
        const query = this.getUrlParams()
        return {
            protocol: window.location.protocol,
            port: window.location.port,
            pathname: window.location.pathname,
            origin: window.location.origin,
            hostname: window.location.hostname,
            host: window.location.host,
            hash: window.location.hash,
            path,
            query
        }
    }
    // 去除字符串空格
    removeStringSpace(str: string): string {
        return str.replace(/\s*/g, '')
    }
    debounce(fn: any, wait = 1000, immediate?): any {
        let timer: any = null
        return function (...args: any) {
            if (timer) clearTimeout(timer)
            if (immediate && !timer) {
                fn.call(this, args)
            }
            timer = setTimeout(() => {
                fn.call(this, args)
            }, wait)
        }
    }

    dealBlob(res): any {
        const reader: any = new FileReader()
        // 暂时注释，用不到
        // if (res.data.type === 'application/json') {
        //     return new Promise(resolve => {
        //         const blob = new Blob([res.data], { type: 'application/json' })
        //         const fr = new FileReader()
        //         const resultData: any = {}
        //         fr.onload = item => {
        //             const outcome = JSON.parse((item.target.result as string).replace(/\\/g, ''))
        //             if (!outcome.success) {
        //                 resultData.img = ''
        //                 resultData.errMessage = outcome.errMessage
        //                 resultData.success = false
        //             }
        //             resolve(resultData)
        //         }
        //         fr.readAsText(blob)
        //     })
        // }
        // if (res.data.type === 'text/xml') {
        //     return new Promise(resolve => {
        //         reader.readAsDataURL(res.data)
        //         const result: any = {}
        //         reader.onload = item => {
        //             result.img = item.target.result
        //             result.errMessage = ''
        //             result.success = true
        //             resolve(result)
        //         }
        //     })
        // }
        if (res.data instanceof Blob) {
            return new Promise(resolve => {
                resolve({
                    data: res,
                    success: true
                })
            })
        }
    }
    getVisualNum(containerHeight: number, listItemHeight: number): number {
        const resultNum = Math.floor(containerHeight / listItemHeight)
        return resultNum
    }
    getfilesize(size) {
        if (!size) return ''
        const num = 1024.0 //byte
        if (size < num) return size + 'B'
        if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'KB' //kb
        if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + 'MB'
        if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + 'G' //G
        return (size / Math.pow(num, 4)).toFixed(2) + 'T' //T
    }
    formatDate(dateObj, format) {
        let o = {
            "M+": dateObj.getMonth() + 1, // month
            "d+": dateObj.getDate(), // day
            "h+": dateObj.getHours(), // hour
            "m+": dateObj.getMinutes(), // minute
            "s+": dateObj.getSeconds(), // second
            "q+": Math.floor((dateObj.getMonth() + 3) / 3), // quarter
            "S": dateObj.getMilliseconds()
            // millisecond
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
}

export { UtilsTools, Cookies }
export default {
    async install(Vue: any, options: any) {
        // eslint-disable-line
        UtilsTools = await new Utils(options)
        Vue.config.globalProperties.$UtilsTools = UtilsTools
    }
}
