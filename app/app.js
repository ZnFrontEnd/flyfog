import Koa from 'koa'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import cors from 'koa-cors'

import middleware from './middlewares'
import apiRouter from './router-config'

const app = new Koa()

app.use(cors())
    .use(logger())
    .use(middleware.util)
    .use(koaBody())
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())

app.listen(3000)
console.log('server port 3000')
