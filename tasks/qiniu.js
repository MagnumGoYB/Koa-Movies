const qiniu = require('qiniu')
const nanoid = require('nanoid')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const config = require('../config')

const bucket = config.qiniu.Bucket
const domain = config.qiniu.Domain
const mac = new qiniu.auth.digest.Mac(config.qiniu.accessKey, config.qiniu.secretKey)

const qiniuConf = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, qiniuConf)

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    let movies = await Movie.find({
        $or: [
            { videoKey: { $exists: false } },
            { videoKey: null },
            { videoKey: '' }
        ]
    })

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        if (movie.video && !movie.videoKey) {
            try {
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }

                await movie.save()
            } catch (error) {
                console.log(error)
            }
        }
    }
})()