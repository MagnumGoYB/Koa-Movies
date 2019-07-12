const puppeteer = require('puppeteer')

const LIST_URL = `https://movie.douban.com/tag/#/?sort=U&range=0,10&tags=%E7%94%B5%E5%BD%B1`

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

    for (let i = 0; i < 3; i++) {
        await sleep(3000)
        await page.click('.more')
    }

    const result = await page.evaluate(() => {
        var $ = window.$
        var items = $('.list-wp a.item')
        var links = []

        if (items.length >= 1) {
            items.each((index, item) => {
                var it = $(item)
                var doubanId = it.find('div.cover-wp').data('id')
                var title = it.find('.title').text()
                var rate = Number(it.find('.rate').text())
                var poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
                
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

    browser.close()

    process.send(result)
    process.exit(0)

})()