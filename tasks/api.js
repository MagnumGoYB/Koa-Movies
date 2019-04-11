const request = require('request-promise-native')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
    const res = await request(url)
    return res
}

;
(async () => {
    let movies = [{
        doubanId: 25964071,
        title: '夏洛特烦恼',
        rate: 7.5,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2264377763.jpg'
    },
    {
        doubanId: 1929463,
        title: '少年派的奇幻漂流',
        rate: 9,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1784592701.jpg'
    },
    {
        doubanId: 1866479,
        title: '复仇者联盟',
        rate: 8.1,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1524359776.jpg'
    },
    {
        doubanId: 11026735,
        title: '超能陆战队',
        rate: 8.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2224568669.jpg'
    },
    {
        doubanId: 1299398,
        title: '大话西游之月光宝盒',
        rate: 8.9,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1280323646.jpg'
    }]

    movies.map(async movie => {
        let movieData = await fetchMovie(movie)

        try {
            movieData = JSON.parse(movieData)
            console.log(movieData.genres)
            console.log(movieData.summary)
        } catch (error) {
            console.log(error)
        }
    })
})()