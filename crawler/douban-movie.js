const puppeteer = require('puppeteer')

const LIST_URL = `https://movie.douban.com/tag/#/?sort=U&range=0,10`
const SUBJECT_URL = `https://movie.douban.com/subject/`

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()
    await page.goto(LIST_URL, {
        waitUntil: 'networkidle2'
    })

    await sleep(3000)

    await page.waitForSelector('.more')

    for (let i = 0; i < 1; i++) {
        await sleep(3000)
        await page.click('.more')
    }

    const movies = await page.evaluate(() => {
        var $ = window.$
        var items = $('.list-wp a.item')
        var links = []

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                let doubanId = it.find('div.cover-wp').data('id')
                let title = it.find('.title').text()
                let rate = Number(it.find('.rate').text())
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
                
                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
            })
        }

        return links
    })

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        let doubanId = movie.doubanId

        await page.goto(SUBJECT_URL + doubanId, {
            waitUntil: 'networkidle2'
        })

        await sleep(1000)

        let subject = await page.evaluate(() => {
            var $ = window.$

            var year = Number($('h1 .year').text().replace('(','').replace(')', ''))
            var summary = $('[property="v:summary"]').text().replace(/[/\s\r\n…]/g, '')

            var genre = []
            $('[property="v:genre"]').each((index, item) => {
                genre.push($(item).text())
            })

            var pubdate = []
            $('[property="v:initialReleaseDate"]').each((index, item) => {
                let text = $(item).text()
                if (text && text.split('(').length > 0) {
                    let parts = text.split('(')
                    let date = parts[0]
                    let country = '未知'

                    if (parts[1]) {
                        country = parts[1].split(')')[0]
                    }

                    pubdate.push({
                        date: date,
                        country
                    })
                }
            })

            var video, link, cover
            var videoDom = $('.related-pic-video')
            if (videoDom && videoDom.length > 0) {
                cover = videoDom.css("backgroundImage")
                cover = cover.split('("')[1].split('")')[0].split('?')[0]
                link = videoDom.attr('href')
            }

            return {
                year,
                summary,
                genre,
                pubdate,
                link,
                cover,
                video
            }
        })

        if (subject.link) {
            await page.goto(subject.link, {
                waitUntil: 'networkidle2'
            })
            await sleep(2000)

            subject.video = await page.evaluate(() => {
                var $ = window.$
                var it = $('source')

                if (it && it.length > 0) {
                    return it.attr('src')
                }

                return null
            })
        }

        const result = { ...movie, ...subject }
        process.send({ result })
    }

    browser.close()
    process.exit(0)

})()