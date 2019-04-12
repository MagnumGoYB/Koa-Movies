const qiniu = require('qiniu')
const nanoid = require('nanoid')

const config = require('../config')

const bucket = config.qiniu.Bucket
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
    let movies = [{
        video: 'http://vt1.doubanio.com/201904121036/4b745f714b8555ac8e627ec6a9b6a1aa/view/movie/M/402400540.mp4',
        doubanId: '26374197',
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2542867516.jpg',
        cover: 'https://img1.doubanio.com/img/trailer/medium/2542292089.jpg'
    }]

    movies.map(async movie => {
        if (movie.video && !movie.key) {
            try {
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')

                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }

                console.log(movie)
            } catch (error) {
                console.log(error)
            }
        }
    })
})()