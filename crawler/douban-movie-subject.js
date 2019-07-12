const puppeteer = require('puppeteer')

const SUBJECT_URL = `https://movie.douban.com/subject/`

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
        let id = movies[i]._id
        let doubanId = movies[i].doubanId

        await page.goto(SUBJECT_URL + doubanId, {
            waitUntil: 'networkidle2'
        })

        await sleep(1000)

        let result = await page.evaluate(() => {
            var $ = window.$

            var year = Number($('h1 .year').text().replace('(','').replace(')', ''))
            var summary = $('[property="v:summary"]').text().replace(/[/\s\r\n…]/g, '')

            var genre = []
            $('[property="v:genre"]').each((index, item) => {
                genre.push($(item).text())
            })

            var pubdate = []
            $('[property="v:initialReleaseDate"]').each((index, item) => {
                var text = $(item).text()
                if (text && text.split('(').length > 0) {
                    var parts = text.split('(')
                    var date = parts[0]
                    var country = '未知'

                    if (parts[1]) {
                        country = parts[1].split(')')[0]
                    }

                    pubdate.push({
                        date: date,
                        country
                    })
                }
            })

            return {
                year,
                summary,
                genre,
                pubdate
            }
        })

        result = { id: id, ...result }

        process.send(result)
    }

    browser.close()
    process.exit(0)
})