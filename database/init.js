const mongoose = require('mongoose')
const glob = require('glob')
const path = require('path')

const config = require('../config')

const db = config.mongodb

mongoose.Promise = global.Promise

exports.initSchemas = () => {
    glob.sync(path.resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
    const User = mongoose.model('User')
    let user = await User.findOne({
        username: 'root'
    })

    if (!user) {
        const user = new User({
            username: 'root',
            password: 'root123'
        })

        await user.save()
    }

}

exports.connect = () => {
    const opts = {
        useNewUrlParser: true,
        useCreateIndex: true
    }

    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(db, opts)

        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++

            if (maxConnectTimes < 5) {
                console.log('正在重连数据库...')
                mongoose.connect(db, opts)
            } else {
                throw new Error('数据库连接失败！')
            }
        })

        mongoose.connection.on('error', err => {
            maxConnectTimes++

            if (maxConnectTimes < 5) {
                console.log('正在重连数据库...')
                mongoose.connect(db, opts)
            } else {
                reject(err)
                throw new Error('数据库连接失败！')
            }
        })

        mongoose.connection.once('open', () => {
            resolve()
            console.log('数据库连接成功！')
        })
    })

}