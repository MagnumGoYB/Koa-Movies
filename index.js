const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const path = require('path')

const app = new Koa()

app.use(views(path.resolve(__dirname, './views'), {
    extension: 'pug'
}))

app.use(static(path.resolve(__dirname, './assets')))

app.use(async (ctx, next) => {
    await ctx.render('index')
})

app.listen(4455)