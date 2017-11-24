
const yaml = require('yamljs')

const PARTICIPANTS_FILE = './participants.yml'

module.exports = function Tick () {
    var people = yaml.load(PARTICIPANTS_FILE)
    var tMap = {}

    // This is for API access.
    global.PEOPLE = people

    // Go through every pair and add it to the map
    for (var i = people.length; i--;) {
        var pairs = people[i].pairs
        for (var g = pairs.length; g--;) {
            tMap[pairs[g].ticker] = true
        }
    }

    // This is always 1, no need to recollect.
    delete tMap.BTC

    // Collect the set keys
    global.TICKERS = Object.keys(tMap)
}