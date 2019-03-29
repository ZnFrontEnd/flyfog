import createAPI from '@/utils/createAPI'

export const getPages = async params =>
    createAPI('/page/list', 'get', {
        data: params || {},
    })

export const generatePage = async params =>
    createAPI('/page/generate', 'post', {
        data: params || {},
    })
