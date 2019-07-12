const cp = require('child_process')
const path = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {

    let movies = await Movie.find({
        $or: [
            { summary: { $exists: false } },
            { summary: '' },
            { summary: null },
            { year: { $exists: false } }
        ]
    })

    const script = path.resolve(__dirname, '../crawler/douban-movie-subject')
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
        let id = data.id
        let genre = data.genre

        let movie = await Movie.findOne({
            _id: id
        })

        if (movie) {

            for (let i = 0; i < genre.length; i++) {
                let name = genre[i]
                let cat = await Category.findOne({
                    name: name
                })
                if (!cat) {
                    cat = new Category({
                        name: name,
                        movies: [id]
                    })
                } else {
                    if (cat.movies.indexOf(id) === -1) {
                        cat.movies.push(id)
                    }
                }
                await cat.save()

                if (!movie.category) {
                    movie.category = []
                    movie.category.push(cat._id)
                } else {
                    if (movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id)
                    }
                }
            }

            data.category = movie.category

            await Movie.findOneAndUpdate({
                _id: id
            }, data)
        }
    })

    child.send(movies)
})()