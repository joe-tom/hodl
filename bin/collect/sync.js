
const request = require('request')
const async = require('async')
const yaml = require('yamljs') 
const fs = require('fs')
const _ = require('lodash')

const API_URL = 'https://min-api.cryptocompare.com/data/pricehistorical'
const TIME_PERIOD = 6 * 60 * 60 * 1000  // 6 hrs in ms
const MAX_TICKERS = 6 // It's actually 7, but this is just to be safe.


/** This syncs the past 30 days worth of information **/
module.exports = function Sync (callback) {
    // Report and set syncing to prevent double syncing.
    console.info('Beginning Initial Sync....')
    if (global.syncing) {
        console.warn('Already syncing, exiting sync.')
        return
    }
    global.syncing = true
    global.History = []

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
    var timestamp = Date.UTC(year, month, day, last)

    console.info('Syncing at ', timestamp)
    console.info('Syncing the following tickers: ', tickers.join(','))

    // Grab the last 120 chunks worth of time data.
    var times = Array.from(Array(120)).map((a,i) => i)
    async.mapLimit(times, 1,
        (i, cb) => {

            // We need the time at index, i corrected for seconds.
            var time = ~~((timestamp - (i * TIME_PERIOD)) / 1000)
            // This is chunked because the API doesn't like large requestss
            var tick = _.chunk(tickers, MAX_TICKERS)

            // Check for cached historical data, submit it if it exists.
            // If there is no cached historical data, fetch some from the API.
            if (fs.existsSync(`./price_data/${time}.json`)) {
                fs.readFile(`./price_data/${time}.json`, (err, data) => {
                    var json = JSON.parse(data.toString())
                    cb(null, json)
                })
            } else {
                _collect(tick, time, cb)
            }
        },
        (err, res) => {
            var final = res.map(data => {
                var map = {}
                data.forEach(arr => {
                    map[arr[0]] = arr[1]
                })
                return map
            })
            
            global.History = final
            global.syncing = false
            callback()
        }
    )
}


/**
*   Collects the pairs for ticks, based on the timestamp.
*   Also, archives it in a file located in /price_data
*/
function _collect (tick, time, cb) {

    // Sub routine to generate an appropriate API URL
    var url = (p,t) => (`${API_URL}?fsym=BTC&tsyms=${p}&ts=${t}`)

    async.mapLimit(tick, 1,
        (ticks, cb) => {
            request(url(ticks, time), (err, res, body) => {
                var resp = JSON.parse(body).BTC
                var data = []

                for(var pair in resp) {
                    data.push([pair, 1 / resp[pair]])
                }

                cb(null, data)
            })
        },
        (err, res) => {
            var final = _.flatten(res)
            fs.writeFile(`./price_data/${time}.json`, JSON.stringify(final), (err) => {
                console.log(err)
            })
            cb (null, final)
        }
    )
}