
const request = require('request')
const API_URL = 'https://api.coinmarketcap.com/v1/ticker/?start=0&limit=2000'


module.exports = function Pricing () {
    global.PRICES = {}

    request(API_URL, (err, res, body) => {
        var data = JSON.parse(body)

        for (var i = data.length; i--;) {
            global.PRICES[data[i].symbol] = data[i].price_btc
        }
    })
}
