

module.exports = function Calc () {
    var Ledger = []
    var history = global.History
    var people = global.People
    console.log('Benchmarking People Pair Calculations...')
    var s = Date.now()

    for (var i = global.People.length; i--;) {
        var peep = People[i]
        var amounts = []

        for (var h = 0, hh = global.History.length; h < hh; h++) {
            var amount = 0
            for (var n = peep.pairs; n--;) {
                var pair = peep.pairs[n]
                amount += (history[h][[pair].ticker] * pair.amount)
            }
            amounts.push(amount)
        }

        Ledger.push({
            name: peep.name,
            amounts: amounts
        })
    }
    console.log(`Calculations took ${Date.now() - s} ms`)
    global.Ledger = Ledger
}

