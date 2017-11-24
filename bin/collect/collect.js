
const ontime = require('ontime')
const yaml = require('yamljs')

const tick = require('./tick')
const sync = require('./sync')
const grab = require('./grab')
const calc = require('./calc')

module.exports = () => {
    global.TICKERS = []
    global.PRICES = {}

    global.People = []
    global.Ledger = []
    global.History = []

    global.syncing = false

    // Load up the tickers and then historical data
    tick()
    sync(calc)
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
        // Grab the latest history, recalculate and we're done
        grab()
        calc()
        ot.done()
    })
}