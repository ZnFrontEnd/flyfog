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
const distUrl = path.resolve(__dirname, '../dist')

app.use(cors())
    .use(logger())
    .use(middleware.util)
    .use(koaBody())
    .use(async (ctx, next) => {
        if (ctx.url === '/') {
            ctx.set('Content-Type', 'text/html;charset="utf-8"')
            ctx.body = fse.createReadStream(path.join(distUrl, 'index.html'))
        } else if (ctx.url.indexOf('api') === -1) {
            await koaStatic(distUrl)(ctx, next)
        } else {
            next()
        }
    })
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())

app.listen(3009)
console.log('server port 3009')
