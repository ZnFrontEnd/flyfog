import Router from 'koa-router'
import Controllers from './controllers'

const apiRouter = new Router({ prefix: '/api' })

const api = apiRouter
    .get('/page/list', Controllers.page.list)
    .post('/page/generate', Controllers.page.generate)

export default api
