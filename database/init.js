const mongoose = require('mongoose')

const config = require('../config')

const db = config.mongodb

mongoose.Promise = global.Promise

exports.connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
        console.log('正在重连数据库...')
        mongoose.connect(db)
    })

    mongoose.connection.on('error', err => {
        console.log(err)
    })

    mongoose.connection.once('open', () => {
        console.log('数据库连接成功！')
    })
}