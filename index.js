const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const path = require('path')
const glob = require('glob')

const app = new Koa()

const { initSchemas, initAdmin, connect } = require('./database/init')

;(async () => {
    await connect()
    initSchemas()

    // await initAdmin()

    // require('./tasks/movie-list')
    // require('./tasks/movie-subject')
    // require('./tasks/movie-video')
    // require('./tasks/qiniu')

    glob.sync(path.resolve(__dirname, './routes', '**/*.js')).forEach(item => {
        const route = require(item)
        app.use(route.routes()).use(route.allowedMethods())
    })
})()

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

app.use(parameter(app))

app.use(views(path.resolve(__dirname, './views'), {
    extension: 'pug'
}))

app.use(static(path.resolve(__dirname, './assets')))

// app.use(async (ctx) => {
//     await ctx.render('index')
// })

app.listen(3000, () => console.log('程序已经启动在3000端口'))