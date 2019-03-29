import axios from 'axios'
import { Modal } from 'antd'

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    const errortext = codeMessage[response.status] || response.statusText
    Modal.error({
        title: `请求错误 ${response.status}: ${response.url}`,
        content: errortext,
    })
}

const isDevelopment = process.env.NODE_ENV === 'development'
const devBaseUrl = '//localhost:3000/api'
const prodBaseUrl = '//localhost:3000/api'

export const baseUrl = isDevelopment ? devBaseUrl : prodBaseUrl

// 实例化axios
const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: false,
})

// 请求拦截器
instance.interceptors.request.use(
    config => {
        return config
    },
    error => {
        if (isDevelopment) {
            Modal.error({
                title: '提示',
                content: '请求拦截器中出错',
            })
        }
        Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    res => {
        const { data } = res
        if (data.success === false) {
            Modal.error({
                title: data.msg,
            })
        }
        return data
    },
    error => {
        // 如果跨域，则拿不到response
        const res = error.response
        if (res) {
            checkStatus(res)
        } else {
            Modal.error({
                title: '请求错误',
                content: error.toString(),
            })
        }
        Promise.reject(error)
    }
)

const createAPI = (url, method, config) => {
    return instance({
        url,
        method,
        ...config,
    })
}

export default createAPI
