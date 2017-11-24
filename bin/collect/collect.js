
const ontime = require('ontime')
const yaml = require('yamljs')

const tick = require('./tick')
const sync = require('./sync')
const calc = require('./calc')
const pricing = require('./pricing')

module.exports = () => {
    global.TICKERS = []
    global.PRICES = {}

    global.People = []
    global.Ledger = []
    global.History = []
    global.Times = []

    global.syncing = false

    // Load up the tickers and then historical data
    tick()
    sync(calc)
    pricing()

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
        // Grab the latest history, recalculate and we're done
        sync(calc)
        pricing()
        ot.done()
    })
}