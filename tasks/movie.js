const cp = require('child_process')
const path = require('path')

;(async () => {
    const script = path.resolve(__dirname, './crawler/trailer-list')
    const child = cp.fork(script, [])
})()