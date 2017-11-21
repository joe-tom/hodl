const request = require('request')
const ontime = require('ontime')
const fs = require('fs')

const URL = 'https://api.coinmarketcap.com/v1/ticker/?start=0&limit=2000'
const PARTICIPANTS_FILE = './PARTICIPANTS'
const ARCHIVE_FILE = './HISTORY_ARCHIVE'


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
function recalc () {

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

    fetch(recalc)
    ontime({
        cycle: ['01:00:00'],    // This is 5pm PST
        utc: true
    }, (ot) => {
        fetch(recalc)
        ot.done()
    })
}