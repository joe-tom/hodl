
const CHUNK_TIME = 60 * 60 * 6 * 1000

var ctx = document.querySelector('canvas.winner').getContext('2d')
var dates = Array
.from(Array(120))
.map(function (a, i) {
    var date = new Date((new Date().getTime() - (i*CHUNK_TIME)))
    return date.getMonth() + '/' + date.getDate()
})

var Hodl = new Chart(ctx, {
    "type":"line",
    "data":{
        "labels":dates,
        "datasets": [
            {
                "label": "BTC",
                "data": dates.map(i => 1),
                "fill": true,
                "borderColor": "#F7CA18",
                "lineTension": 0.1
            }
        ]
    },
    "options":{}
})


var request = new XMLHttpRequest()
request.open('GET', '/api/ledger', true)

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText)

    }
}
request.send()