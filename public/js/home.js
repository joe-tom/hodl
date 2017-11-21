
var ctx = document.querySelector('canvas.winner').getContext('2d')
var dates = '.'.repeat(31).split('').map((a,i) => {
    var date = new Date((new Date().getTime() + (i*86400000)))
    console.log(date)
    return date.getMonth() + '/' + date.getDate()
})

var myChart = new Chart(ctx, {
    "type":"line",
    "data":{
        "labels":dates,
        "datasets":[
            {"label":"BTC","data":dates.slice(0).map(i => 1),"fill":true,"borderColor":"#F7CA18","lineTension":0.1}
        ]
    },
    "options":{}
})