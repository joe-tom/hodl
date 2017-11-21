var express = require('express');
var router = express.Router();

router.get('/types', (req, res, next) => {
    res.send(global.TICKERS)
})

router.get('/prices', (req, res, next) => {
    res.send(global.PRICES)
})

router.get('/participants', (req, res, next) => {
    res.send(global.PARTICIPANTS)
})

module.exports = router;
