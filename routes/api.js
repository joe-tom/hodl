var express = require('express');
var router = express.Router();

router.get('/types', (req, res, next) => {
    res.send(global.TICKERS)
})

router.get('/prices', (req, res, next) => {
    res.send(global.PRICES)
})
router.get('/price/:symbol', (req, res, next) => {
    var price = global.PRICES[req.params.symbol]
    
    if (price) {
        res.send({data: price})
    } else {
        res.send({error: "Ticker not supported"})
    }

})

router.get('/ledger', (req, res, next) => {
    res.send({
        time: global.Times,
        people: global.Ledger
    })
})

function (inputs) {
    for(var i = inputs.length; i--;) {
        inputs[i]
    }
}

router.post('/post', (req, res, next) => {
    var data = req.body || {}

    // Check the prelims
    if (!data.name) {
        res.error({error: "NO NAME DEFINIED"})
        return
    }

    // Attempt to parse the inputs..
    try {
        var inps = JSON.parse(data.inps)
        var data
        if (data = _validate(inps)) {
            
        } else {
            res.error({error: "BAD INPUTS"})
            
        }
    } catch (e) {
        res.error({error: "BAD JSON"})
    }
})

module.exports = router;
