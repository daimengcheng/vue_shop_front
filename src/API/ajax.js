import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
// 创建实例化对象
const instance = axios.create({
    timeout: 20000, //配置请求超时时间
    baseURL: 'http://47.104.151.225:33333/api/private/v1'
})

// 请求拦截器
instance.interceptors.request.use((config) => {

    // 对请求参数进行urlencoding处理，而不是使用默认的json格式
    const data = config.data
    if (data instanceof Object) {
        config.data = qs.stringify(data)
    }
    // 为请求对象,添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 相应拦截器
instance.interceptors.response.use(

    // 请求成功的回调
    (response) => {
        const { status, msg } = response.data.meta
        if (status === 400 || status === 401 || status === 403 || status === 404 || status === 422 || status === 500) {
            Message.error(msg);
        } else {
            Message.success(msg);
        }
        // 异步请求成功的数据不是response,而是response.data
        return response.data
    },
    // 请求失败的回调
    (error) => {
        Message.error(error);
        return new Promise(() => {}) //返回一个pending状态的promise对象,中断promise链
    }
)
export default instance