const cp = require('child_process')
const path = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')


;(async () => {
    const script = path.resolve(__dirname, '../crawler/douban-movie')
    const child = cp.fork(script, [])
    let invoked = false

    child.on('error', err => {
        if (invoked) return
        invoked = true
        
        console.log(err)
    })

    child.on('exit', code => {
        if (invoked) return
        invoked = true

        let err = code === 0 ? null : new Error('exit code ' + code)

        console.log(err)

        if (!err) {
            console.log('爬虫进程已退出！')
        }
    })

    child.on('message', async data => {
        let result = data.result

        let movie = await Movie.findOne({
            doubanId: result.doubanId
        })

        if (!movie) {
            movie = new Movie(result)
            await movie.save()
        } else {
            await Movie.findByIdAndUpdate(movie._id, result)
        }
    })
})()