
const yaml = require('yamljs') 
const _ = require('lodash')

const API_URL = 'https://min-api.cryptocompare.com/data/pricehistorical'
const TIME_PERIOD = 6 * 60 * 60 * 1000  // 6 hrs in ms
const MAX_TICKERS = 6 // It's actually 7, but this is just to be safe.


/** This syncs the past 30 days worth of information **/
module.exports = function Sync () {
    // Report and 
    console.info('Beginning Initial Sync....')
    global.syncing = true

    // Sub routine to generate an appropriate API URL
    var url = (p,t) => (`${API_URL}?fsym=BTC&tsyms=${p}&ts=${t}`)

    var tickers = global.TICKERS

    // Grab our UTC Time
    var date  = new Date()
    var year  = date.getUTCFullYear()
    var month = date.getUTCMonth()
    var day   = date.getUTCDate()
    var hour  = date.getUTCHours()

    // Calculate last chunk and grab that timestamp
    var change = hour % 6
    var last = hour - change
    var timestamp = Date.UTC(year, month, day, hour)

    console.info('Syncing at ', timestamp)
    console.info('Syncing the following tickers: ', tickers.join(','))

    // Grab the last 120 chunks worth of time data.
    var times = Array.from(Array(120)).map((a,i) => i)
    async.eachLimit(times, 1,
        (i, cb) => {
            var time = timestamp - (i * TIME_PERIOD)
            var tick = _.chunk(tickers, MAX_TICKERS)
                
            // We'll collect all the history for the current time, here.
            var hist = []

            async.eachLimit(tick, 1,
                (ticks, cb) => {
                    request(url(ticks, time), (err, res, body) => {
                        console.log(body)
                    })
                },
                err => {
                    cb ()
                }
            )
        },
        (err, result) => {

        }
    )
}