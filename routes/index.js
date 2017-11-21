var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index')
})

/* GET input page. */
router.get('/input', function(req, res, next) {
    res.render('input')
})

module.exports = router;
