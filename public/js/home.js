var CHUNK_TIME = 60 * 60 * 6 * 1000

var ctx = document.querySelector('canvas.winner').getContext('2d')
var dates = '.'.repeat(120).split('').map((a,i) => {
    var date = new Date((new Date().getTime() - (i*CHUNK_TIME)))
    console.log(date)
    return date.getMonth() + '/' + date.getDate()
})

var myChart = new Chart(ctx, {
    "type":"line",
    "data":{
        "labels":dates,
        "datasets":[
            {
                "label": "BTC",
                "data": dates.slice(0).map(i => 1),
                "fill": true,
                "borderColor": "#F7CA18",
                "lineTension": 0.1
            }
        ]
    },
    "options":{}
})