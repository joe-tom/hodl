
const ontime = require('ontime')
const yaml = require('yamljs')

const tick = require('./tick')
const sync = require('./sync')
const grab = require('./grab')


module.exports = () => {
    global.TICKERS = []
    global.PRICES = {}
    global.History = []
    
    global.syncing = false

    // Load up the tickers and then historical data
    tick()
    sync()
    grab()

    // Fetch this every 6 hours.
    ontime({
        cycle: [
            '00:00:00',
            '06:00:00',
            '12:00:00',
            '18:00:00',
        ],
        utc: true
    }, (ot) => {
        // Grab the latest history, and we're done
        grab()
        ot.done()
    })
}