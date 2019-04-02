/* eslint-disable indent */
import fse from 'fs-extra'
import path from 'path'
import { objectToString } from './util'

const baseUrl = path.resolve('./')

// 讲路由转成页面用的数据格式
function routerToData (router) {
    const pages = []

    router.forEach(route => {
        const obj = {}
        if (route.name) {
            obj.name = route.name

            if (route.path) {
                const pathArr = route.path.split('/')
                let component = pathArr[pathArr.length - 1]
                component = `${component.slice(0, 1).toUpperCase()}${component.slice(1)}`

                obj.component = component
            }

            if (route.routes) {
                obj.pages = routerToData(route.routes)
            }

            pages.push(obj)
        }
    })

    return pages
}

export default class PageController {
    static async list(ctx) {
        let data = []
        // TODO: 数据是从路由配置拿的。
        // 最好从pages拿，然后跟这里的路由数据做一个匹配
        const routerConfigPath = path.join(baseUrl, 'config/router.config.js')
        try {
            let routerCnfigText = fse.readFileSync(routerConfigPath, 'utf8')
            routerCnfigText = routerCnfigText.replace('export default', '')
            routerCnfigText = eval(routerCnfigText)
            let routes = []
            routerCnfigText.forEach(r => {
                if (r.path === '/') {
                    routes = r.routes
                }
            })
            data = routerToData(routes)
        } catch (error) {
            ctx.body = ctx.util.refail(error.message)
            return
        }
        ctx.body = ctx.util.resuccess(data)
    }

    static async generate(ctx) {
        const {
            path: pathName,
            fileName,
            componentName,
            /* functions, */ formButtonGrouop,
            formData,
            tableColumns,
        } = ctx.request.body
        // console.log(pathName, fileName, componentName, /* functions, */formButtonGrouop, formData, tableColumns)
        // TODO: 根据functions选则不同的路径
        const teplatePath = path.resolve(__dirname, '../../templates/form&table')
        let templateFile
        try {
            templateFile = fse.readFileSync(teplatePath, 'utf8')
        } catch (error) {
            ctx.body = ctx.util.refail(`文件读出错 -- ${error.message}`)
            return
        }
        // TODO: 统一路径名、文件名
        const targetFilePath = path.join(baseUrl, `src/pages${pathName}/${fileName}`)
        const targetPath = path.join(baseUrl, `src/pages${pathName}/${fileName}/index.js`)

        templateFile = templateFile.replace(/@componentName@/g, componentName) // 替换组件名称
        templateFile = templateFile.replace(/@formdata@/g, objectToString(formData)) // 替换搜索表单的数据
        templateFile = templateFile.replace(
            /@formbuttongroup@/g,
            `buttonGroup={[${formButtonGrouop.map(
    b => `${
            b === 'search'
                ? `\r                        { onSearch: this.handleFormSearch }`
                : `\r                        { onDownload: this.handleFromDownload }`
        }`
)}
                    ]}`
        ) // 替换搜索表单的按钮
        templateFile = templateFile.replace(/@tablecolumns@/g, objectToString(tableColumns)) // 替换表格的columns
        try {
            fse.mkdirSync(targetFilePath)
        } catch (error) {
            ctx.body = ctx.util.refail(`文件名重复，请修改文件名 -- ${error.message}`)
            return
        }
        try {
            fse.writeFileSync(targetPath, templateFile)
        } catch (error) {
            ctx.body = ctx.util.refail(`文件写入出错 -- ${error.message}`)
            return
        }

        ctx.body = ctx.util.resuccess({})
    }
}
