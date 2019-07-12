const cp = require('child_process')
const path = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {

    let movies = await Movie.find({
        $or: [
            { video: { $exists: false } },
            { video: null }
        ]
    })

    const script = path.resolve(__dirname, '../crawler/douban-movie-video')
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
    })

    child.on('message', async data => {
        let doubanId = data.doubanId
        let movie = await Movie.findOne({
            doubanId: doubanId
        })

        if (data.video) {
            movie.video = data.video
            movie.cover = data.cover
            await movie.save()
        } else {
            await movie.remove()

            let genre = movie.genre
            for (let i = 0; i < genre.length; i++) {
                let name = genre[i]
                let cat = await Category.findOne({
                    name: name
                })
                if (cat && cat.movies) {
                    let idx = cat.movies.indexOf(cat._id)
                    if (idx > -1) {
                        cat.movies.splice(idx, 1)
                    }
                    await cat.save()
                }
            }
        }
    })

    child.send(movies)
})()