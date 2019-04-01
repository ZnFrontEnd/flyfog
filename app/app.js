import Koa from 'koa'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import cors from 'koa-cors'
import koaStatic from 'koa-static'
import path from 'path'
import fse from 'fs-extra'

import middleware from './middlewares'
import apiRouter from './router-config'

const app = new Koa()
const baseUrl = path.resolve('./')

app.use(cors())
    .use(logger())
    .use(koaStatic(path.join(baseUrl, 'dist')))
    .use(middleware.util)
    .use(koaBody())
    .use(async (ctx, next) => {
        if (!ctx.url) {
            ctx.set('Content-Type', 'text/html;charset="utf-8"')
            ctx.body = fse.createReadStream(path.join(baseUrl, 'dist/index.html'))
        } else {
            next()
        }
    })
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())

app.listen(3000)
console.log('server port 3000')
