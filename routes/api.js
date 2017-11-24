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

router.get('/participants', (req, res, next) => {
    res.send(global.PARTICIPANTS)
})

router.post('/post', (req, res, next) => {
    console.log(req.body)
})

module.exports = router;
