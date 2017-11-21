const request = require('request')
const ontime = require('ontime')
const fs = require('fs')

const API_URL = 'https://api.coinmarketcap.com/v1/ticker/?start=0&limit=2000'
const TIME_PERIOD = 6 * 60 * 60 * 1000  // 6 hrs in ms

const PARTICIPANTS_FILE = './PARTICIPANTS'
const TICKERS_FILE = './TICKERS'
const ARCHIVE_FOLDER = './price_data'

// Converts (TICKER, TIMESTAMP) to historical URL.
const HistUrl = (p,t) => (
    `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${p}&tsyms=BTC&ts=${t}`
)

/** Just fetches the cached ticker symbols and puts them into memory */
function tickers () {
    var t = JSON.parse(fs.readFileSync(TICKERS_FILE).toString())
    global.TICKERS = t
}


/** This syncs the past 30 days worth of information **/
function sync () {
    var tickers = global.TICKERS
    var date = new Date()

    var year  = date.getUTCFullYear()
    var month = date.getUTCMonth()
    var day   = date.getUTCDate()
    var hour  = date.getUTCHours()

    // Calculate last chunk and grab that timestamp
    var change = hour % 6
    var last = hour - change

    timestamp = Date.UTC(year, month, day, hour)

    var i = 0
    async.whilst(
        () => (i < (120))), // 4 chunks per day, for 30 days
        cb => {
            // Check for a file for each chunk.
            var sync = timestamp - (i * TIME_PERIOD)
            var path = [ARCHIVE_FOLDER, '/', sync, '.json'].join('')
            // If the chunk exists, read into memory, else fetch and put into memory
            if (fs.existsSync(path)) {
                var file = fs.readFileSync(path).toString()
                var data = JSON.parse(file)

                recalc(data, sync)
                i++
                cb()
            } else {
                async.mapLimit(tickers, 2, (tick, cb) => {
                    var url = HistUrl(tick, sync)

                    request(url, (err, res, body) => {
                        var data = JSON.parse(body)
                        if (data.Response == "Error") {
                            cb(null, [tick, 0])
                        } else {
                            var value = data[tick].BTC
                            cb(null, [tick, value])
                        }
                    })
                }, (err, results) => {
                    var data = JSON.stringify(results)
                    fs.writeFileSync(path, data)
                    recalc(data, sync)

                    i++
                    cb()
                })
            }
        }
    }
}


/** This fetches all necessary params from the coinmarketcap */
function fetch (cb) {
    request(URL, (err, res, body) => {
        var data = JSON.parse(body)

        // Fetch all the btc prices via dict
        var amounts = {}
        data.forEach(a => {
            amounts[a.symbol] = a.price_btc
        })

        global.PRICES = amounts
        global.TICKERS = data.map(i => i.symbol)

        cb && cb() // Executes callback if one is provided.
    })
}

/** This recalculates the amount BTC for each participant */
function recalc (data, date) {

    // Fetch participants from flatfile db
    var participants = fs.readFileSync(PARTICIPANTS_FILE).toString().split('\n')
    
    // Micro optimizations are the root of all evil ;)
    for (var i = participants.length; i--;) {
        // Grab the user and his JSON.stringified investments.
        var [user, inps] = participants[i].split(':')

        // Calculate and set participant's investment values
        var value = JSON.parse(inps)
        .reduce((acc, p) => (
            // p = [ticker, amount]
            acc + (p[1] * global.PRICES[p[0]])
        ),0)
        .toFixed(4)

        global.PARTICIPANTS[user] = value
    }

    // Archive progress!
    store()
}

/** Appends the current date and participant history to the archive */
function store () {
    var archive = JSON.parse(fs.readFileSync(ARCHIVE_FILE))
    var total = (archive[Object.keys(archive)[0]] || []).length

    for (var name in global.PARTICIPANTS) {
        var value = global.PARTICIPANTS[name]
        
        if (archive[name]) {
            archive[name].push(value)
        } else {
            // Fill up the user's history with 1 BTCs, then add the current
            archive[name] = []

            for(var i = total; i--;) {
                archive[name].push(1)
            }

            archive[name].push(value)
        }
    }

    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(archive))
}

module.exports = () => {
    global.PARTICIPANTS = {}
    global.TICKERS      = []
    global.PRICES       = {}

    // The tickers are precached, for space.
    tickers()
    sync(recalc)

    // Fetch this every 4 hours.
    ontime({
        cycle: [
            '00:00:00',
            '06:00:00',
            '12:00:00',
            '18:00:00',
        ],
        utc: true
    }, (ot) => {
        fetch(recalc)
        ot.done()
    })
}