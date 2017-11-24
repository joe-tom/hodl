
const CHUNK_TIME = 60 * 60 * 6 * 1000

var ctx = document.querySelector('canvas.winner').getContext('2d')

function Start (data) {
    var dates = data.time.reverse().map(function (time, i) {
        var date = new Date(time * 1000)
        return (date.getMonth() + 1) + '/' + date.getDate()
    })

    var sets =  [
        {
            "label": "BTC",
            "data": dates.map(i => 1),
            "fill": true,
            "borderColor": "#F7CA18",
            "lineTension": 0.1
        }
    ]

    data.people.forEach((person) => {
        sets.push({
            label: person.name,
            data: person.amounts.reverse(),
            fill: false,
            borderColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
            lineTension: 0.1
        })
    })


    var Hodl = new Chart(ctx, {
        "type":"line",
        "data":{
            "labels": dates,
            "datasets": sets
        },
        "options":{}
    })
}

var request = new XMLHttpRequest()
request.open('GET', '/api/ledger', true)

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText)
        Start(data)
    }
}
request.send()