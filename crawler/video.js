const puppeteer = require('puppeteer')

const detailUrl = `https://movie.douban.com/subject/`

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

process.on('message', async movies => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()

    for (let i = 0; i < movies.length; i++) {
        let doubanId = movies[i].doubanId

        await page.goto(detailUrl + doubanId, {
            waitUntil: 'networkidle2'
        })

        await sleep(1000)

        const result = await page.evaluate(() => {
            var $ = window.$
            var it = $('.related-pic-video')

            if (it && it.length > 0) {
                var link = it.attr('href')
                var cover = it.css("backgroundImage")
                cover = cover.split('("')[1].split('")')[0].split('?')[0]

                return {
                    link,
                    cover
                }
            }

            return {}
        })

        let video

        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2'
            })
            await sleep(2000)

            video = await page.evaluate(() => {
                var $ = window.$
                var it = $('source')

                if (it && it.length > 0) {
                    return it.attr('src')
                }

                return null
            })
        }

        const data = {
            video,
            doubanId,
            cover: result.cover
        }

        process.send(data)
    }

    browser.close()
    process.exit(0)

})